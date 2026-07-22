const {
  citizenCache,
} = require("../config/citizenCache");
const { getProducerClient } = require("../config/redis");

const recordTelemetry = async (req, res) => {
  try {
    const {
  rfidNumber,
  iotTimestamp,
  driverName,
  vehicleNumber,
  vehicleId,
  latitude,
  longitude,
  weight,
  firmwareVersion,
  unitNumber,
  remarks,
  errCode,
} = req.query;

// Determine collection type
const isAuto =
  remarks === "O" &&
  !rfidNumber;

const isManual =
  remarks === "" &&
  rfidNumber;

// Validate payload
if (!isAuto && !isManual) {
  return res.status(400).json({
    success: false,
    message:
      "Invalid payload. Either send remarks='O' or a valid RFID number.",
  });
}

    // Mandatory telemetry fields
    if (!iotTimestamp || !vehicleId) {
      return res.status(400).json({
        success: false,
        message: "Missing required telemetry fields",
      });
    }

    // Manual collection validation
    if (!isAuto) {
      if (!rfidNumber) {
        return res.status(400).json({
          success: false,
          message: "RFID number is required for manual collection.",
        });
      }

      if (!citizenCache.has(rfidNumber)) {
        return res.status(404).json({
          success: false,
          message: "RFID not registered.",
        });
      }
    }

  const payload = {
  rfidNumber,
  iotTimestamp,
  driverName,
  vehicleNumber,
  vehicleId,
  latitude,
  longitude,
  weight,
  firmwareVersion,
  unitNumber,
  remarks,
  errCode,
};

    const redisClient = getProducerClient();

    await redisClient.lPush(
      "telemetry_queue",
      JSON.stringify(payload)
    );

    console.log("✅ Telemetry queued in Redis");

    return res.status(200).json({
      success: true,
      status: "QUEUED",
      message: "Telemetry accepted and queued successfully.",

      queueLength: await redisClient.lLen("telemetry_queue"),

      queuedTelemetry: payload,

      cacheLookup: isAuto ? null : citizenCache.has(rfidNumber),
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  recordTelemetry,
};