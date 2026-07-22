const getLatestCumulativeWeight = require("./telemetry/getLatestCumulativeWeight");
const insertTelemetryLog = require("./telemetry/insertTelemetryLog");
const updateVehicleTelemetry = require("./telemetry/updateVehicleTelemetry");
const checkVehicleIncident = require("./telemetry/checkVehicleIncident");
const updatePlantStatistics = require("./telemetry/updatePlantStatistics");
const {
  citizenCache,
  activeScans,
} = require("../config/citizenCache");

const { getConsumerClient } = require("../config/redis");

const processTelemetryQueue = async () => {
  const redisClient = getConsumerClient();

  const result = await redisClient.blPop(
    "telemetry_queue",
    0
  );

  if (!result) return;

  const payload = JSON.parse(result.element);

  console.log("\n========== NEW TELEMETRY ==========");
  console.log("Queue payload:", payload);

  const {
  rfidNumber,
  iotTimestamp,
  driverName,
  vehicleNumber,
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
  !rfidNumber;

  if (!isAuto && activeScans.has(rfidNumber)) {
    return;
  }

  if (!isAuto) {
    activeScans.add(rfidNumber);
  }

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
  finalRfidNumber = "AUTO";

  otherWeightKg = Number(weight);

  driverAction = 1;
} 
  else {
    const cachedData = citizenCache.get(rfidNumber);

    console.log("Citizen found in cache:", cachedData);

    if (!cachedData) {
      throw new Error("Citizen not found");
    }

    citizenId = cachedData.citizen.id;
    citizenContact = cachedData.citizen.contactNumber;
    wasteType = cachedData.wasteType;

    console.log("Citizen Contact:", citizenContact);

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
    const previousCumulativeWeightKg = await getLatestCumulativeWeight();

const currentWeightKg =
  Number(weight || 0);

const cumulativeWeightKg =
  previousCumulativeWeightKg + currentWeightKg;

    await insertTelemetryLog({
      iotTimestamp,
      driverName,
      vehicleId,
      vehicleNumber,
      rfidNumber: finalRfidNumber,
      latitude,
      longitude,
      wetWeightKg,
      dryWeightKg,
      otherWeightKg,
      cumulativeWeightKg,
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

    await updateVehicleTelemetry({
      vehicleId,
      latitude,
      longitude,
    });

    await checkVehicleIncident({
      vehicleId,
      errCode,
    });

    await updatePlantStatistics({
      vehicleId,
      cumulativeWeightKg,
    });

    console.log("Telemetry inserted successfully.");

    console.log(
      `Telemetry recorded successfully for ${
        isAuto ? "AUTO" : finalRfidNumber
      }`
    );
  } catch (err) {
    console.error("\n========== QUEUE ERROR ==========", err);
  } finally {
    if (!isAuto) {
      activeScans.delete(rfidNumber);
    }
  }
};

console.log("Telemetry Queue Worker Started");

(async function startWorker() {
  while (true) {
  try {
    await processTelemetryQueue();
  } catch (err) {
    console.error("Worker Error:", err);

    await new Promise((resolve) =>
      setTimeout(resolve, 5000)
    );
  }
}
})();

module.exports = {
  processTelemetryQueue,
};