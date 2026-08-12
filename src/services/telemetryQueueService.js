const insertTelemetryLog = require("./telemetry/insertTelemetryLog");
const { citizenCache } = require("../config/citizenCache");
const { getConsumerClient } = require("../config/redis");

const vehicleProcessorManager = require("../telemetry/services/VehicleProcessorManager");

// =====================================================
// CONFIGURATION
// =====================================================

const DISPATCHER_COUNT = 4;

// =====================================================
// BUILD TELEMETRY PROCESSING TASK
// =====================================================

function buildProcessingTask(payload) {
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
  // COLLECTION TYPE
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
  // RETURN PROCESSING TASK
  // ===================================================

  return {
    vehicleId,

    execute: async () => {
      console.log(`Processing vehicle ${vehicleId}`);

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
         * Cumulative value is calculated inside
         * the PostgreSQL transaction.
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

      console.log(`Vehicle ${vehicleId} packet committed`);
    },
  };
}

// =====================================================
// PROCESS ONE REDIS PACKET
// =====================================================

async function processTelemetryQueue() {
  const redisClient = getConsumerClient();

  // ===================================================
  // MOVE PACKET TO PROCESSING QUEUE
  // ===================================================

  const payloadString = await redisClient.blMove(
    "telemetry_queue",
    "telemetry_processing_queue",
    "RIGHT",
    "LEFT",
    0,
  );

  if (!payloadString) {
    return false;
  }

  let payload;

  try {
    payload = JSON.parse(payloadString);
  } catch (err) {
    console.error("❌ Invalid telemetry JSON:", err);

    // Invalid packet cannot be processed.
    await redisClient.lRem("telemetry_processing_queue", 1, payloadString);

    return true;
  }

  console.log("\n========== NEW TELEMETRY ==========");

  console.log("Vehicle:", payload.vehicleId);

  try {
    // =================================================
    // CREATE VEHICLE TASK
    // =================================================

    const task = buildProcessingTask(payload);

    // =================================================
    // QUEUE INTO VEHICLE FIFO
    // =================================================

    vehicleProcessorManager.enqueue(task.vehicleId, async () => {
      try {
        await task.execute();

        // =============================================
        // ACK ONLY AFTER DATABASE COMMIT
        // =============================================

        await redisClient.lRem("telemetry_processing_queue", 1, payloadString);

        console.log(`✅ ACK vehicle ${task.vehicleId}`);
      } catch (err) {
        console.error(`❌ Vehicle processing failed [${task.vehicleId}]`, err);

        // =============================================
        // RETRY
        // =============================================

        try {
          await redisClient.lPush("telemetry_queue", payloadString);

          await redisClient.lRem(
            "telemetry_processing_queue",
            1,
            payloadString,
          );

          console.log(`♻️ Packet requeued [${task.vehicleId}]`);
        } catch (retryErr) {
          console.error("❌ FAILED TO REQUEUE PACKET:", retryErr);
        }
      }
    });

    return true;
  } catch (err) {
    console.error("\n========== DISPATCH ERROR ==========");

    console.error(err);

    // =================================================
    // DISPATCH FAILURE → REQUEUE
    // =================================================

    try {
      await redisClient.lPush("telemetry_queue", payloadString);

      await redisClient.lRem("telemetry_processing_queue", 1, payloadString);

      console.log("♻️ Dispatch failed, packet requeued.");
    } catch (retryErr) {
      console.error("❌ FAILED TO REQUEUE PACKET:", retryErr);
    }

    return true;
  }
}

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
// DISPATCHER
// =====================================================

async function startDispatcher(dispatcherId) {
  console.log(`Telemetry Dispatcher ${dispatcherId} started`);

  while (true) {
    try {
      const processed = await processTelemetryQueue();

      if (!processed) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    } catch (err) {
      console.error(`Dispatcher ${dispatcherId} error:`, err);

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

// =====================================================
// START SYSTEM
// =====================================================

console.log(`Telemetry Dispatcher Started - ${DISPATCHER_COUNT} dispatchers`);

(async function startDispatchers() {
  await recoverProcessingQueue();

  const dispatchers = [];

  for (let i = 1; i <= DISPATCHER_COUNT; i++) {
    dispatchers.push(startDispatcher(i));
  }

  await Promise.all(dispatchers);
})();

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  processTelemetryQueue,
};
