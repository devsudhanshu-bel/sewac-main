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
// CREATE DEDICATED BLOCKING CLIENT
// =====================================================
//
// IMPORTANT:
//
// Every vehicle processor gets its own Redis connection.
//
// A blocking BRPOPLPUSH on one vehicle must NEVER block
// another vehicle processor or the dispatcher.
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

  if (!key) {
    throw new Error("Cannot enqueue telemetry without vehicleId.");
  }

  if (!packet || typeof packet !== "object") {
    throw new Error(`Cannot enqueue invalid packet for vehicle ${key}.`);
  }

  if (!packet.vehicleId) {
    throw new Error(`Telemetry packet has no vehicleId for queue ${key}.`);
  }

  const redis = getProducerClient();

  const queueKey = vehicleQueueKey(key);

  // -------------------------------------------------
  // Store RAW SERIALIZABLE TELEMETRY PACKET.
  // -------------------------------------------------

  await redis.lPush(queueKey, JSON.stringify(packet));

  // -------------------------------------------------
  // Mark vehicle active.
  // -------------------------------------------------

  await redis.sAdd(ACTIVE_VEHICLES_KEY, key);

  // -------------------------------------------------
  // Start processor if necessary.
  // -------------------------------------------------

  startProcessor(key);
}

// =====================================================
// START PROCESSOR
// =====================================================

function startProcessor(vehicleId) {
  if (activeProcessors.has(vehicleId)) {
    return;
  }

  activeProcessors.set(vehicleId, true);

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
  const redis = await createProcessorClient(vehicleId);

  const queueKey = vehicleQueueKey(vehicleId);

  const processingKey = vehicleProcessingKey(vehicleId);

  console.log(`Processing vehicle ${vehicleId}`);

  while (true) {
    // =================================================
    // ATOMIC MOVE
    //
    // vehicle queue
    //      ↓
    // vehicle processing queue
    //
    // The packet remains recoverable until DB success.
    // =================================================

    const packetString = await redis.brPopLPush(queueKey, processingKey, 1);

    // -------------------------------------------------
    // Queue became empty.
    // -------------------------------------------------

    if (!packetString) {
      const remaining = await redis.lLen(queueKey);

      const processing = await redis.lLen(processingKey);

      if (remaining === 0 && processing === 0) {
        break;
      }

      continue;
    }

    let packet;

    // =================================================
    // PARSE
    // =================================================

    try {
      packet = JSON.parse(packetString);
    } catch (err) {
      console.error(`❌ Invalid vehicle packet JSON [${vehicleId}]`, err);

      // Bad packet cannot be processed.
      await redis.lRem(processingKey, 1, packetString);

      continue;
    }

    // =================================================
    // VALIDATE
    // =================================================

    if (
      !packet ||
      typeof packet !== "object" ||
      !packet.vehicleId ||
      !packet.iotTimestamp
    ) {
      console.error(`❌ Invalid vehicle packet [${vehicleId}]`, packet);

      await redis.lRem(processingKey, 1, packetString);

      continue;
    }

    // =================================================
    // IMPORTANT:
    //
    // insertTelemetryLog receives the ACTUAL PACKET.
    //
    // No envelope.
    // No execute().
    // No callback.
    // =================================================

    try {
      await insertTelemetryLog(packet);

      // =================================================
      // DATABASE SUCCESS
      //
      // ONLY NOW ACK / REMOVE FROM PROCESSING QUEUE.
      // =================================================

      await redis.lRem(processingKey, 1, packetString);

      console.log(`✅ ACK vehicle ${vehicleId}`);
    } catch (err) {
      console.error(`❌ Vehicle processing failed [${vehicleId}]:`, err);

      // =================================================
      // DATABASE FAILED
      //
      // Put packet back at the FRONT of FIFO.
      // =================================================

      await redis.lRem(processingKey, 1, packetString);

      await redis.rPush(queueKey, packetString);

      console.log(`♻️ Packet requeued [${vehicleId}]`);

      // -------------------------------------------------
      // Small backoff prevents a permanent DB error
      // from creating a hot retry loop.
      // -------------------------------------------------

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
}

// =====================================================
// CLEANUP
// =====================================================

async function cleanupProcessor(vehicleId) {
  activeProcessors.delete(vehicleId);

  const redis = getProducerClient();

  try {
    const queued = await redis.lLen(vehicleQueueKey(vehicleId));

    const processing = await redis.lLen(vehicleProcessingKey(vehicleId));

    // -------------------------------------------------
    // New packets arrived while processor was shutting
    // down. Restart it.
    // -------------------------------------------------

    if (queued > 0 || processing > 0) {
      startProcessor(vehicleId);
      return;
    }

    await redis.sRem(ACTIVE_VEHICLES_KEY, vehicleId);
  } catch (err) {
    console.error(`❌ Processor cleanup failed [${vehicleId}]:`, err);
  } finally {
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
// Called once when server starts.
//
// Anything that was in a vehicle processing queue when
// the server died is returned to its vehicle FIFO.
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
    // Move processing packets back to FIFO.
    //
    // rPop + rPush preserves the packet ordering
    // when restoring the processing queue.
    // -------------------------------------------------

    while (true) {
      const packet = await redis.rPop(processingKey);

      if (!packet) {
        break;
      }

      await redis.rPush(queueKey, packet);

      console.log(`Recovered vehicle packet [${vehicleId}]`);
    }

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
// COUNTS
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
// FLUSH
// =====================================================

async function flush() {
  const redis = getProducerClient();

  const vehicles = await redis.sMembers(ACTIVE_VEHICLES_KEY);

  for (const vehicleId of vehicles) {
    await redis.del(vehicleQueueKey(vehicleId));

    await redis.del(vehicleProcessingKey(vehicleId));
  }

  await redis.del(ACTIVE_VEHICLES_KEY);

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
