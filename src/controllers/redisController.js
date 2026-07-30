const { getProducerClient } = require("../config/redis");

const flushTelemetryQueues = async (req, res) => {
  try {
    const redis = getProducerClient();

    const beforeTelemetry = await redis.lLen("telemetry_queue");
    const beforeProcessing = await redis.lLen("telemetry_processing_queue");

    await redis.del(
      "telemetry_queue",
      "telemetry_processing_queue"
    );

    res.status(200).json({
      success: true,
      message: "Telemetry queues flushed successfully.",
      before: {
        telemetry_queue: beforeTelemetry,
        telemetry_processing_queue: beforeProcessing,
      },
      after: {
        telemetry_queue: 0,
        telemetry_processing_queue: 0,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  flushTelemetryQueues,
};