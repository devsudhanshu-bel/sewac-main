const mainDb = require("../../config/mainDb");

const updateVehicleTelemetry = async ({
  vehicleId,
  latitude,
  longitude,
}) => {

  await mainDb.query(
    `
    INSERT INTO vehicle_telemetry
    (
      vehicle_id,
      latitude,
      longitude,
      recorded_at
    )
    VALUES
    (
      $1,$2,$3,NOW()
    )
    `,
    [
      vehicleId,
      latitude,
      longitude
    ]
  );

  console.log("Vehicle telemetry updated.");
};

module.exports = updateVehicleTelemetry;