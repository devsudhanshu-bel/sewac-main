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
const isManual =
  remarks === "" &&
  rfidNumber?.startsWith("E") &&
  unitNumber === "SEWAC_01_UHF";

const isAuto =
  remarks === "O" &&
  !rfidNumber?.startsWith("E") &&
  unitNumber === "SEWAC_01_HF";

// Validate payload
if (!isAuto && !isManual) {
  return res.status(400).json({
    success: false,
    message:
  "Invalid telemetry payload. Check RFID format, unitNumber and remarks.",
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
      if (!rfidNumber?.startsWith("E")) {
        return res.status(400).json({
          success: false,
          message: "Valid UHF RFID is required for citizen collection.",
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