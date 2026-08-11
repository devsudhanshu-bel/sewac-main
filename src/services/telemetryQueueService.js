const insertTelemetryLog = require("./telemetry/insertTelemetryLog");
const { citizenCache } = require("../config/citizenCache");
const { getConsumerClient } = require("../config/redis");

// =====================================================
// WORKER CONFIGURATION
// =====================================================

const WORKER_COUNT = 8;

// =====================================================
// PER-VEHICLE LOCKS
// =====================================================
//
// Important:
//
// We DO NOT globally lock telemetry processing.
//
// Different vehicles can continue processing in parallel.
//
// Only packets belonging to the SAME vehicle are serialized.
//
// This prevents concurrent updates to:
//     vehicle_cumulative
//
// from fighting over the same PostgreSQL row.
//
// =====================================================

const vehicleLocks = new Map();

/**
 * Execute a task sequentially for a specific vehicle.
 *
 * Example:
 *
 * KA05AB1234:
 *   P1 → P2 → P3 → P4
 *
 * KA05AB1235:
 *   P1 → P2
 *
 * Both vehicles can still run concurrently.
 */
function runForVehicle(vehicleId, task) {
  const vehicleKey = String(vehicleId || "UNKNOWN");

  const previous = vehicleLocks.get(vehicleKey) || Promise.resolve();

  const current = previous.catch(() => {}).then(task);

  vehicleLocks.set(vehicleKey, current);

  // Cleanup the lock after this task finishes.
  current.finally(() => {
    if (vehicleLocks.get(vehicleKey) === current) {
      vehicleLocks.delete(vehicleKey);
    }
  });

  return current;
}

// =====================================================
// PROCESS ONE TELEMETRY PACKET
// =====================================================

const processTelemetryQueue = async () => {
  const redisClient = getConsumerClient();

  // ---------------------------------------------------
  // Atomically move packet:
  //
  // telemetry_queue
  //        ↓
  // telemetry_processing_queue
  //
  // ---------------------------------------------------

  const payloadString = await redisClient.blMove(
    "telemetry_queue",
    "telemetry_processing_queue",
    "RIGHT",
    "LEFT",
    0,
  );

  if (!payloadString) {
    return;
  }

  const payload = JSON.parse(payloadString);

  console.log("\n========== NEW TELEMETRY ==========");

  const {
    rfidNumber,
    iotTimestamp,
    driverName,
    vehicleId,
    latitude,
    longitude,
    weight = 0,
    firmwareVersion,
    unitNumber,
    remarks,
    errCode,
  } = payload;

  // ===================================================
  // DETERMINE COLLECTION TYPE
  // ===================================================

  const isAuto =
    remarks === "O" &&
    !rfidNumber?.startsWith("E") &&
    unitNumber === "SEWAC_01_HF";

  let citizenId = null;
  let citizenContact = null;

  let wasteType = "MIXED";

  let wetWeightKg = 0;
  let dryWeightKg = 0;
  let otherWeightKg = 0;

  let driverAction = 0;

  let finalRemarks;
  let finalCollectionType;
  let finalRfidNumber;

  // ===================================================
  // AUTO COLLECTION
  // ===================================================

  if (isAuto) {
    finalRemarks = "O";

    finalCollectionType = "AUTO";

    finalRfidNumber = rfidNumber;

    otherWeightKg = Number(weight);

    driverAction = 1;
  }

  // ===================================================
  // MANUAL COLLECTION
  // ===================================================
  else {
    const cachedData = citizenCache.get(rfidNumber);

    if (!cachedData) {
      throw new Error(`Citizen not found for RFID: ${rfidNumber}`);
    }

    citizenId = cachedData.citizen.id;

    citizenContact = cachedData.citizen.contactNumber;

    wasteType = cachedData.wasteType;

    finalRemarks = wasteType === "WET" ? "W" : "D";

    finalCollectionType = "MANUAL";

    finalRfidNumber = rfidNumber;

    if (wasteType === "WET") {
      wetWeightKg = Number(weight);
    } else {
      dryWeightKg = Number(weight);
    }

    driverAction = 0;
  }

  // ===================================================
  // PROCESS PACKET
  // ===================================================

  try {
    console.log("Inserting telemetry into telemetry_logs...");

    /*
     * IMPORTANT:
     *
     * Only packets belonging to the SAME vehicle
     * are serialized.
     *
     * Different vehicles remain fully concurrent.
     */

    await runForVehicle(vehicleId, async () => {
      await insertTelemetryLog({
        iotTimestamp,

        driverName,

        vehicleId,

        rfidNumber: finalRfidNumber,

        latitude,

        longitude,

        wetWeightKg,

        dryWeightKg,

        otherWeightKg,

        /*
         * The actual cumulative value is calculated
         * atomically inside the telemetry pipeline.
         */
        cumulativeWeightKg: 0,

        firmwareVersion,

        unitNumber,

        collectionType: finalCollectionType,

        remarks: finalRemarks,

        driverAction,

        errCode,

        citizenId,

        citizenContact,

        wasteType,
      });
    });

    console.log("Telemetry inserted successfully.");

    // =================================================
    // ACK / REMOVE FROM PROCESSING QUEUE
    // =================================================

    await redisClient.lRem("telemetry_processing_queue", 1, payloadString);

    console.log("Removed packet from processing queue.");

    console.log(
      `Telemetry recorded successfully for ${
        isAuto ? "AUTO" : finalRfidNumber
      }`,
    );
  } catch (err) {
    // ===================================================
    // FAILURE
    // ===================================================

    console.error("\n========== QUEUE ERROR ==========");

    console.error(err);

    try {
      /*
       * IMPORTANT:
       *
       * The packet is returned to the main queue
       * ONLY after the processing attempt fails.
       */

      await redisClient.lPush("telemetry_queue", payloadString);

      await redisClient.lRem("telemetry_processing_queue", 1, payloadString);

      console.log("♻️ Failed packet returned to telemetry_queue for retry.");
    } catch (retryErr) {
      console.error("❌ FAILED TO REQUEUE PACKET:", retryErr);
    }
  }
};

// =====================================================
// RECOVER PROCESSING QUEUE
// =====================================================

async function recoverProcessingQueue() {
  const redisClient = getConsumerClient();

  console.log("Checking telemetry_processing_queue for pending packets...");

  while (true) {
    const moved = await redisClient.lMove(
      "telemetry_processing_queue",
      "telemetry_queue",
      "RIGHT",
      "LEFT",
    );

    if (!moved) {
      break;
    }

    console.log("Recovered one telemetry packet.");
  }

  console.log("Telemetry recovery completed.");
}

// =====================================================
// WORKER
// =====================================================

console.log(`Telemetry Queue Worker Started - ${WORKER_COUNT} workers`);

async function startWorker(workerId) {
  console.log(`Telemetry Worker ${workerId} started`);

  while (true) {
    try {
      await processTelemetryQueue();
    } catch (err) {
      console.error(`Telemetry Worker ${workerId} Error:`, err);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

// =====================================================
// START ALL WORKERS
// =====================================================

(async function startWorkers() {
  await recoverProcessingQueue();

  const workers = [];

  for (let i = 1; i <= WORKER_COUNT; i++) {
    workers.push(startWorker(i));
  }

  await Promise.all(workers);
})();

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  processTelemetryQueue,
};
