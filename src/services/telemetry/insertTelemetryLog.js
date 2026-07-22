const mainDb = require("../../config/mainDb");

const insertTelemetryLog = async ({
  iotTimestamp,
  driverName,
  vehicleId,
  vehicleNumber,
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
  await mainDb.query(
    `
    INSERT INTO telemetry_logs
    (
      iot_timestamp,
      driver_name,
      vehicle_id,
      vehicle_number,
      rfid_epc,
      latitude,
      longitude,
      wet_weight_kg,
      dry_weight_kg,
      other_weight_kg,
      cumulative_weight_kg,
      firmware_version,
      unit_number,
      collection_type,
      remarks,
      driver_action,
      err_code,
      citizen_id,
      citizen_contact,
      waste_type
    )
    VALUES
(
  $1,$2,$3,$4,$5,$6,$7,$8,$9,
  $10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20
)
    `,
    [
      iotTimestamp,
      driverName,
      vehicleId,
      vehicleNumber,
      rfidNumber,
      latitude,
      longitude,
      Number(wetWeightKg),
      Number(dryWeightKg),
      Number(otherWeightKg),
      Number(cumulativeWeightKg),
      firmwareVersion,
      unitNumber,
      collectionType,
      remarks,
      driverAction,
      errCode,
      citizenId,
      citizenContact,
      wasteType,
    ]
  );
};

module.exports = insertTelemetryLog;