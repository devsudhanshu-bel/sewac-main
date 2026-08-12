const {
  createDispatcherClient,
  getProducerClient,
} = require("../config/redis");

const { citizenCache } = require("../config/citizenCache");

const vehicleProcessorManager = require("../telemetry/services/VehicleProcessorManager");

// =====================================================
// CONFIG
// =====================================================

const DISPATCHER_COUNT = 4;

const GLOBAL_QUEUE = "telemetry_queue";

const GLOBAL_PROCESSING_QUEUE = "telemetry_processing_queue";

// =====================================================
// BUILD TELEMETRY PACKET
// =====================================================

function buildTelemetryPacket(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid telemetry payload.");
  }

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

  // =================================================
  // BASIC VALIDATION
  // =================================================

  if (!vehicleId) {
    throw new Error("Telemetry packet missing vehicleId.");
  }

  if (!iotTimestamp) {
    throw new Error("Telemetry packet missing iotTimestamp.");
  }

  if (!unitNumber) {
    throw new Error("Telemetry packet missing unitNumber.");
  }

  // =================================================
  // COLLECTION TYPE
  // =================================================

  const isManual =
    remarks === "" &&
    typeof rfidNumber === "string" &&
    rfidNumber.startsWith("E") &&
    unitNumber === "SEWAC_01_UHF";

  const isAuto =
    remarks === "O" &&
    typeof rfidNumber === "string" &&
    !rfidNumber.startsWith("E") &&
    unitNumber === "SEWAC_01_HF";

  if (!isAuto && !isManual) {
    throw new Error("Invalid telemetry payload.");
  }

  // =================================================
  // VALUES
  // =================================================

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

  // =================================================
  // AUTO
  // =================================================

  if (isAuto) {
    finalRemarks = "O";

    finalCollectionType = "AUTO";

    finalRfidNumber = rfidNumber;

    otherWeightKg = Number(weight);

    driverAction = 1;
  }

  // =================================================
  // MANUAL
  // =================================================
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

  // =================================================
  // SERIALIZABLE PACKET
  // =================================================
  //
  // THIS OBJECT is what enters the vehicle FIFO.
  //
  // No functions.
  // No callbacks.
  // No execute().
  //
  // =================================================

  return {
    rfidNumber: finalRfidNumber,

    iotTimestamp,

    driverName,

    vehicleId: String(vehicleId),

    latitude,

    longitude,

    wetWeightKg,

    dryWeightKg,

    otherWeightKg,

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
  };
}

// =====================================================
// PROCESS ONE GLOBAL QUEUE PACKET
// =====================================================

async function processTelemetryQueue(dispatcherId, redis) {
  // =================================================
  // ATOMIC GLOBAL FIFO → PROCESSING
  // =================================================

  const payloadString = await redis.blMove(
    GLOBAL_QUEUE,
    GLOBAL_PROCESSING_QUEUE,
    "RIGHT",
    "LEFT",
    0,
  );

  if (!payloadString) {
    return false;
  }

  // =================================================
  // PARSE
  // =================================================

  let payload;

  try {
    payload = JSON.parse(payloadString);
  } catch (err) {
    console.error("❌ Invalid telemetry JSON:", err);

    await redis.lRem(GLOBAL_PROCESSING_QUEUE, 1, payloadString);

    return true;
  }

  // =====================================================
  // UNWRAP QUEUED JOB
  // =====================================================
  //
  // The HTTP controller stores:
  // {
  //   jobId,
  //   payload
  // }
  //
  // The vehicle processor must receive ONLY the
  // actual telemetry payload.
  //
  // =====================================================

  const job =
    payload &&
    typeof payload === "object" &&
    payload.payload &&
    typeof payload.payload === "object"
      ? payload
      : null;

  const telemetryPayload = job ? job.payload : payload;

  const jobId = job?.jobId || null;

  console.log("\n========== NEW TELEMETRY ==========");

  console.log("Job:", jobId || "legacy");

  console.log("Vehicle:", telemetryPayload?.vehicleId);

  try {
    const packet = buildTelemetryPacket(telemetryPayload);

    const vehicleId = String(packet.vehicleId);

    // =================================================
    // VEHICLE FIFO
    // =================================================

    await vehicleProcessorManager.enqueue(vehicleId, packet);

    // =================================================
    // GLOBAL ACK
    //
    // The packet now exists in:
    //
    // telemetry_vehicle_queue:<vehicle>
    //
    // so the temporary global processing copy
    // can safely disappear.
    // =================================================

    await redis.lRem(GLOBAL_PROCESSING_QUEUE, 1, payloadString);

    console.log(`📦 Routed vehicle ${vehicleId}`);

    return true;
  } catch (err) {
    console.error("\n========== DISPATCH ERROR ==========");

    console.error(err);

    // =================================================
    // GLOBAL RETRY
    // =================================================

    try {
      await redis.lRem(GLOBAL_PROCESSING_QUEUE, 1, payloadString);

      await redis.rPush(GLOBAL_QUEUE, payloadString);

      console.log("♻️ Dispatch failed, packet requeued.");
    } catch (retryErr) {
      console.error("❌ FAILED TO REQUEUE PACKET:", retryErr);
    }

    return true;
  }
}

// =====================================================
// GLOBAL RECOVERY
// =====================================================

async function recoverProcessingQueue() {
  const redis = getProducerClient();

  console.log("Checking telemetry_processing_queue for pending packets...");

  while (true) {
    const moved = await redis.lMove(
      GLOBAL_PROCESSING_QUEUE,
      GLOBAL_QUEUE,
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
  console.log(`Telemetry Dispatcher ${dispatcherId} starting...`);

  const redis = await createDispatcherClient(dispatcherId);

  console.log(`Telemetry Dispatcher ${dispatcherId} started`);

  try {
    while (true) {
      try {
        const processed = await processTelemetryQueue(dispatcherId, redis);

        if (!processed) {
          await new Promise((resolve) => setTimeout(resolve, 5));
        }
      } catch (err) {
        console.error(`Dispatcher ${dispatcherId} error:`, err);

        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  } finally {
    try {
      await redis.quit();
    } catch (err) {
      console.error(
        `Failed to close Dispatcher ${dispatcherId} Redis connection:`,
        err.message,
      );
    }
  }
}

// =====================================================
// START
// =====================================================

console.log(`Telemetry Dispatcher Started - ${DISPATCHER_COUNT} dispatchers`);

(async function startDispatchers() {
  try {
    // -------------------------------------------------
    // GLOBAL RECOVERY FIRST
    // -------------------------------------------------

    await recoverProcessingQueue();

    // -------------------------------------------------
    // VEHICLE RECOVERY SECOND
    // -------------------------------------------------

    await vehicleProcessorManager.recover();

    // -------------------------------------------------
    // START DISPATCHERS
    // -------------------------------------------------

    const dispatchers = [];

    for (let i = 1; i <= DISPATCHER_COUNT; i++) {
      dispatchers.push(startDispatcher(i));
    }

    await Promise.all(dispatchers);
  } catch (err) {
    console.error("❌ Telemetry dispatcher startup failed:", err);
  }
})();

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  processTelemetryQueue,
  recoverProcessingQueue,
};
