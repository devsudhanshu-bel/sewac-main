const { createClient } = require("redis");
const { getProducerClient } = require("../../config/redis");
const insertTelemetryLog = require("../../services/telemetry/insertTelemetryLog");

// =====================================================
// REDIS KEYS
// =====================================================

const VEHICLE_QUEUE_PREFIX = "telemetry_vehicle_queue:";

const VEHICLE_PROCESSING_PREFIX = "telemetry_vehicle_processing:";

const ACTIVE_VEHICLES_KEY = "telemetry_active_vehicles";

// =====================================================
// PROCESSOR STATE
// =====================================================
//
// activeProcessors:
//     Tracks which vehicles currently have an
//     active processor.
//
// processorClients:
//     Dedicated Redis blocking connection for
//     each vehicle processor.
//
// Packets themselves are NEVER stored here.
// Packets remain inside Redis.
//
// =====================================================

const activeProcessors = new Map();

const processorClients = new Map();

// =====================================================
// KEY HELPERS
// =====================================================

function vehicleQueueKey(vehicleId) {
  return `${VEHICLE_QUEUE_PREFIX}${vehicleId}`;
}

function vehicleProcessingKey(vehicleId) {
  return `${VEHICLE_PROCESSING_PREFIX}${vehicleId}`;
}

// =====================================================
// CREATE DEDICATED BLOCKING REDIS CLIENT
// =====================================================
//
// Every vehicle processor gets its own Redis connection.
//
// Vehicle A → Redis connection A
// Vehicle B → Redis connection B
// Vehicle C → Redis connection C
//
// This prevents BRPOPLPUSH/BRPOP blocking operations
// for one vehicle from affecting another vehicle.
//
// =====================================================

async function createProcessorClient(vehicleId) {
  const client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on("error", (err) => {
    console.error(`❌ Vehicle Redis error [${vehicleId}]:`, err.message);
  });

  await client.connect();

  processorClients.set(vehicleId, client);

  return client;
}

// =====================================================
// ENQUEUE
// =====================================================

async function enqueue(vehicleId, packet) {
  const key = String(vehicleId || "").trim();

  // ---------------------------------------------------
  // Validate vehicle ID
  // ---------------------------------------------------

  if (!key) {
    throw new Error("Cannot enqueue telemetry without vehicleId.");
  }

  // ---------------------------------------------------
  // Validate packet
  // ---------------------------------------------------

  if (!packet || typeof packet !== "object") {
    throw new Error(`Cannot enqueue invalid packet for vehicle ${key}.`);
  }

  // ---------------------------------------------------
  // Ensure packet vehicle ID exists
  // ---------------------------------------------------

  if (!packet.vehicleId) {
    throw new Error(`Telemetry packet has no vehicleId for queue ${key}.`);
  }

  const redis = getProducerClient();

  const queueKey = vehicleQueueKey(key);

  // ---------------------------------------------------
  // Store packet durably in Redis.
  //
  // LPUSH + RPOP/BRPOPLPUSH gives FIFO ordering.
  // ---------------------------------------------------

  await redis.lPush(queueKey, JSON.stringify(packet));

  // ---------------------------------------------------
  // Mark vehicle active
  // ---------------------------------------------------

  await redis.sAdd(ACTIVE_VEHICLES_KEY, key);

  // ---------------------------------------------------
  // Start processor if necessary
  // ---------------------------------------------------

  startProcessor(key);
}

// =====================================================
// START PROCESSOR
// =====================================================

function startProcessor(vehicleId) {
  // ---------------------------------------------------
  // Already running
  // ---------------------------------------------------

  if (activeProcessors.has(vehicleId)) {
    return;
  }

  // ---------------------------------------------------
  // Mark active
  // ---------------------------------------------------

  activeProcessors.set(vehicleId, true);

  // ---------------------------------------------------
  // Start asynchronous processor
  // ---------------------------------------------------

  processVehicle(vehicleId)
    .catch((err) => {
      console.error(`❌ Vehicle processor crashed [${vehicleId}]:`, err);
    })

    .finally(async () => {
      await cleanupProcessor(vehicleId);
    });
}

// =====================================================
// PROCESS ONE VEHICLE FIFO
// =====================================================

async function processVehicle(vehicleId) {
  // ---------------------------------------------------
  // Dedicated Redis connection
  // ---------------------------------------------------

  const redis = await createProcessorClient(vehicleId);

  const queueKey = vehicleQueueKey(vehicleId);

  const processingKey = vehicleProcessingKey(vehicleId);

  console.log(`Processing vehicle ${vehicleId}`);

  // ===================================================
  // VEHICLE FIFO LOOP
  // ===================================================

  while (true) {
    // -------------------------------------------------
    // ATOMIC MOVE
    //
    // vehicle queue
    //       ↓
    // processing queue
    //
    // The packet remains recoverable until processing
    // succeeds.
    // -------------------------------------------------

    const packetString = await redis.brPopLPush(queueKey, processingKey, 1);

    // -------------------------------------------------
    // Queue became empty.
    // -------------------------------------------------

    if (!packetString) {
      break;
    }

    let packet;

    // =================================================
    // PARSE PACKET
    // =================================================

    try {
      packet = JSON.parse(packetString);
    } catch (parseError) {
      // ------------------------------------------------
      // Invalid JSON is a permanent packet failure.
      //
      // There is no point retrying malformed data.
      // ------------------------------------------------

      console.error(`❌ Invalid packet JSON [${vehicleId}]`, parseError);

      await redis.lRem(processingKey, 1, packetString);

      console.error(`🚫 Invalid packet discarded [${vehicleId}]`);

      continue;
    }

    // =================================================
    // PROCESS PACKET
    // =================================================

    try {
      // ------------------------------------------------
      // Send packet through complete telemetry pipeline.
      // ------------------------------------------------

      await insertTelemetryLog(packet);

      // ------------------------------------------------
      // SUCCESS
      //
      // Database transaction has completed successfully.
      // Remove packet from processing queue.
      // ------------------------------------------------

      await redis.lRem(processingKey, 1, packetString);

      console.log(`✅ ACK vehicle ${vehicleId}`);
    } catch (err) {
      console.error(`❌ Vehicle processing failed [${vehicleId}]:`, err);

      // =================================================
      // PERMANENT FAILURE
      // =================================================
      //
      // Vehicle is not registered in vehicle_master
      // or has invalid/missing ward information.
      //
      // THIS PACKET MUST NEVER BE REQUEUED.
      //
      // It has already been marked FAILED by the
      // telemetry pipeline.
      //
      // =================================================

      if (err && err.code === "UNREGISTERED_VEHICLE") {
        // -----------------------------------------------
        // Remove packet from processing queue.
        // -----------------------------------------------

        await redis.lRem(processingKey, 1, packetString);

        // -----------------------------------------------
        // DO NOT LPUSH / RPUSH
        //
        // This is intentional.
        // -----------------------------------------------

        console.error(
          `🚫 Permanent vehicle failure — packet discarded, NOT requeued [${vehicleId}]`,
        );

        // -----------------------------------------------
        // Continue to next packet.
        // -----------------------------------------------

        continue;
      }

      // =================================================
      // OTHER PERMANENT MALFORMED-PACKET FAILURES
      // =================================================
      //
      // These are optional safety cases.
      //
      // If packet structure is clearly invalid, there
      // is no value in retrying indefinitely.
      //
      // =================================================

      if (
        err &&
        (err.code === "INVALID_TELEMETRY_PACKET" ||
          err.code === "INVALID_PACKET")
      ) {
        await redis.lRem(processingKey, 1, packetString);

        console.error(`🚫 Invalid telemetry packet discarded [${vehicleId}]`);

        continue;
      }

      // =================================================
      // TRANSIENT / UNKNOWN FAILURE
      // =================================================
      //
      // Examples:
      //
      // PostgreSQL temporary failure
      // Redis/network issue
      // transaction timeout
      // connection failure
      // temporary infrastructure issue
      //
      // These remain retryable.
      //
      // =================================================

      try {
        // ------------------------------------------------
        // Put packet back at the RIGHT side of the FIFO.
        //
        // Original packet gets priority over newer
        // packets so ordering is preserved.
        // ------------------------------------------------

        await redis.rPush(queueKey, packetString);

        // ------------------------------------------------
        // Remove processing copy.
        // ------------------------------------------------

        await redis.lRem(processingKey, 1, packetString);

        console.log(`♻️ Packet requeued [${vehicleId}]`);
      } catch (requeueError) {
        // ------------------------------------------------
        // If requeue itself fails, DO NOT pretend that
        // the packet was recovered.
        // ------------------------------------------------

        console.error(
          `❌ Failed to requeue packet [${vehicleId}]:`,
          requeueError,
        );

        // ------------------------------------------------
        // Leave the packet in processing queue.
        //
        // Startup recovery can recover it later.
        // ------------------------------------------------
      }

      // -------------------------------------------------
      // Small backoff prevents a permanent transient
      // failure from producing a hot retry loop.
      // -------------------------------------------------

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}

// =====================================================
// CLEANUP PROCESSOR
// =====================================================

async function cleanupProcessor(vehicleId) {
  // ---------------------------------------------------
  // Remove local processor state
  // ---------------------------------------------------

  activeProcessors.delete(vehicleId);

  const redis = getProducerClient();

  try {
    const queued = await redis.lLen(vehicleQueueKey(vehicleId));

    const processing = await redis.lLen(vehicleProcessingKey(vehicleId));

    // -------------------------------------------------
    // If packets appeared while processor was shutting
    // down, restart the processor.
    // -------------------------------------------------

    if (queued > 0 || processing > 0) {
      startProcessor(vehicleId);

      return;
    }

    // -------------------------------------------------
    // No packets remain.
    //
    // Vehicle is no longer active.
    // -------------------------------------------------

    await redis.sRem(ACTIVE_VEHICLES_KEY, vehicleId);
  } catch (err) {
    console.error(`❌ Processor cleanup failed [${vehicleId}]:`, err);
  } finally {
    // -------------------------------------------------
    // Close dedicated processor Redis connection.
    // -------------------------------------------------

    const client = processorClients.get(vehicleId);

    if (client) {
      processorClients.delete(vehicleId);

      try {
        await client.quit();
      } catch (err) {
        console.error(
          `Redis processor disconnect failed [${vehicleId}]:`,
          err.message,
        );
      }
    }
  }
}

// =====================================================
// RECOVERY
// =====================================================
//
// Called during server startup.
//
// Any packet that was inside a vehicle's processing
// queue when the server stopped is returned to that
// vehicle's FIFO queue.
//
// =====================================================

async function recover() {
  const redis = getProducerClient();

  const vehicles = await redis.sMembers(ACTIVE_VEHICLES_KEY);

  console.log(`Recovering ${vehicles.length} active vehicle processors...`);

  for (const vehicleId of vehicles) {
    const queueKey = vehicleQueueKey(vehicleId);

    const processingKey = vehicleProcessingKey(vehicleId);

    // -------------------------------------------------
    // Move processing packets back into FIFO.
    //
    // rPop + rPush preserves packet ordering during
    // recovery.
    // -------------------------------------------------

    while (true) {
      const packet = await redis.rPop(processingKey);

      if (!packet) {
        break;
      }

      await redis.rPush(queueKey, packet);

      console.log(`Recovered vehicle packet [${vehicleId}]`);
    }

    // -------------------------------------------------
    // Check remaining queue
    // -------------------------------------------------

    const remaining = await redis.lLen(queueKey);

    if (remaining > 0) {
      startProcessor(vehicleId);
    } else {
      await redis.sRem(ACTIVE_VEHICLES_KEY, vehicleId);
    }
  }

  console.log("Vehicle processor recovery completed.");
}

// =====================================================
// STATUS
// =====================================================

async function getStats() {
  const redis = getProducerClient();

  const vehicles = await redis.sMembers(ACTIVE_VEHICLES_KEY);

  const stats = {};

  for (const vehicleId of vehicles) {
    stats[vehicleId] = {
      queued: await redis.lLen(vehicleQueueKey(vehicleId)),

      processing: await redis.lLen(vehicleProcessingKey(vehicleId)),

      processorActive: activeProcessors.has(vehicleId),
    };
  }

  return stats;
}

// =====================================================
// QUEUE TOTALS
// =====================================================

async function getQueueTotals() {
  const redis = getProducerClient();

  const vehicles = await redis.sMembers(ACTIVE_VEHICLES_KEY);

  let queued = 0;

  let processing = 0;

  for (const vehicleId of vehicles) {
    queued += await redis.lLen(vehicleQueueKey(vehicleId));

    processing += await redis.lLen(vehicleProcessingKey(vehicleId));
  }

  return {
    activeVehicles: vehicles.length,

    queued,

    processing,
  };
}

// =====================================================
// FLUSH ALL VEHICLE QUEUES
// =====================================================
//
// Intended for controlled maintenance/testing only.
//
// This clears:
//   telemetry_vehicle_queue:*
//   telemetry_vehicle_processing:*
//   telemetry_active_vehicles
//
// =====================================================

async function flush() {
  const redis = getProducerClient();

  const vehicles = await redis.sMembers(ACTIVE_VEHICLES_KEY);

  for (const vehicleId of vehicles) {
    await redis.del(vehicleQueueKey(vehicleId));

    await redis.del(vehicleProcessingKey(vehicleId));
  }

  await redis.del(ACTIVE_VEHICLES_KEY);

  // ---------------------------------------------------
  // Close dedicated processor clients
  // ---------------------------------------------------

  for (const [vehicleId, client] of processorClients) {
    try {
      await client.quit();
    } catch (err) {
      console.error(
        `Processor Redis close failed [${vehicleId}]:`,
        err.message,
      );
    }
  }

  processorClients.clear();

  activeProcessors.clear();
}

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  enqueue,

  recover,

  getStats,

  getQueueTotals,

  getActiveVehicleCount: () => activeProcessors.size,

  flush,
};
