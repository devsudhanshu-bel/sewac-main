const insertTelemetryLog = require("./telemetry/insertTelemetryLog");
const { citizenCache } = require("../config/citizenCache");

const { getConsumerClient } = require("../config/redis");

const processTelemetryQueue = async () => {
  const redisClient = getConsumerClient();

  const payloadString = await redisClient.blMove(
    "telemetry_queue",
    "telemetry_processing_queue",
    "RIGHT",
    "LEFT",
    0,
  );

  if (!payloadString) return;

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

  if (isAuto) {
    finalRemarks = "O";
    finalCollectionType = "AUTO";
    finalRfidNumber = rfidNumber;
    otherWeightKg = Number(weight);

    driverAction = 1;
  } else {
    const cachedData = citizenCache.get(rfidNumber);

    if (!cachedData) {
      throw new Error("Citizen not found");
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

  try {
    console.log("Inserting telemetry into telemetry_logs...");

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

    console.log("Telemetry inserted successfully.");

    await redisClient.lRem("telemetry_processing_queue", 1, payloadString);

    console.log("Removed packet from processing queue.");

    console.log(
      `Telemetry recorded successfully for ${
        isAuto ? "AUTO" : finalRfidNumber
      }`,
    );
  } catch (err) {
    console.error("\n========== QUEUE ERROR ==========");
    console.error(err);

    try {
      // Put the failed packet back into the main queue
      await redisClient.lPush("telemetry_queue", payloadString);

      // Remove only this packet from the processing queue
      await redisClient.lRem("telemetry_processing_queue", 1, payloadString);

      console.log("♻️ Failed packet returned to telemetry_queue for retry.");
    } catch (retryErr) {
      console.error("❌ FAILED TO REQUEUE PACKET:", retryErr);
    }
  }
};

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

    if (!moved) break;

    console.log("Recovered one telemetry packet.");
  }

  console.log("Telemetry recovery completed.");
}

const WORKER_COUNT = 8;

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

(async function startWorkers() {
  await recoverProcessingQueue();

  const workers = [];

  for (let i = 1; i <= WORKER_COUNT; i++) {
    workers.push(startWorker(i));
  }

  await Promise.all(workers);
})();

module.exports = {
  processTelemetryQueue,
};
