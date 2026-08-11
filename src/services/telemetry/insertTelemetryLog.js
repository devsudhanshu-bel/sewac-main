const telemetryPipelineService = require("../../telemetry/services/TelemetryPipelineService");

const insertTelemetryLog = async ({
  iotTimestamp,
  driverName,
  vehicleId,
  rfidNumber,
  latitude,
  longitude,
  wetWeightKg,
  dryWeightKg,
  otherWeightKg,
  cumulativeWeightKg,
  firmwareVersion,
  unitNumber,
  collectionType,
  remarks,
  driverAction,
  errCode,
  citizenId,
  citizenContact,
  wasteType,
}) => {
  await telemetryPipelineService.process({
    iotTimestamp: new Date(iotTimestamp),

    receivedTimestamp: new Date(),

    rfidEpc: rfidNumber,

    citizenId,

    wasteType,

    latitude: Number(latitude),

    longitude: Number(longitude),

    wetWeight: Number(wetWeightKg),

    dryWeight: Number(dryWeightKg),

    otherWeight: Number(otherWeightKg),

    cumulativeWeight: Number(cumulativeWeightKg),

    driverName,

    vehicleNumber: vehicleId,

    firmwareVersion,

    unitNumber,

    collectionType,

    remarks,

    errorCode: errCode,

    citizenContact,

    driverAction,
  });
};

module.exports = insertTelemetryLog;
