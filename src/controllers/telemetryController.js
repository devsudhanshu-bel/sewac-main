const { randomUUID } = require("crypto");
const { citizenCache } = require("../config/citizenCache");
const { getProducerClient } = require("../config/redis");

const recordTelemetry = async (req, res) => {
  try {
    const {
      rfidNumber,
      iotTimestamp,
      driverName,
      vehicleId,
      latitude,
      longitude,
      weight,
      firmwareVersion,
      unitNumber,
      remarks,
      errCode,
    } = req.query;

    const isManual =
      remarks === "" &&
      rfidNumber?.startsWith("E") &&
      unitNumber === "SEWAC_01_UHF";

    const isAuto =
      remarks === "O" &&
      !rfidNumber?.startsWith("E") &&
      unitNumber === "SEWAC_01_HF";

    if (!isAuto && !isManual) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid telemetry payload. Check RFID format, unitNumber and remarks.",
      });
    }

    if (!iotTimestamp || !vehicleId) {
      return res.status(400).json({
        success: false,
        message: "Missing required telemetry fields",
      });
    }

    if (!isAuto) {
      if (!rfidNumber?.startsWith("E")) {
        return res.status(400).json({
          success: false,
          message:
            "Valid UHF RFID is required for citizen collection.",
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
      vehicleId,
      latitude,
      longitude,
      weight,
      firmwareVersion,
      unitNumber,
      remarks,
      errCode,
    };

    // Every accepted HTTP request becomes a unique scheduler job.
    const job = {
      queueId: randomUUID(),
      payload,
    };

    const redisClient = getProducerClient();

    await redisClient.lPush(
      "telemetry_queue",
      JSON.stringify(job),
    );

    const queueLength = await redisClient.lLen("telemetry_queue");

    console.log(
      `✅ Telemetry queued | job=${job.queueId} | vehicle=${vehicleId}`,
    );

    return res.status(200).json({
      success: true,
      status: "QUEUED",
      message: "Telemetry accepted and queued successfully.",
      queueLength,
      queueId: job.queueId,
      queuedTelemetry: payload,
      cacheLookup: isAuto ? null : citizenCache.has(rfidNumber),
    });
  } catch (error) {
    console.error("Telemetry queue error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  recordTelemetry,
};
