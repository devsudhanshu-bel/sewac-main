const { getProducerClient } = require("../config/redis");
const vehicleProcessorManager = require("../telemetry/services/VehicleProcessorManager");

const getTelemetryQueueStatus = async (req, res) => {
  try {
    const redis = getProducerClient();
    const telemetryQueue = await redis.lLen("telemetry_queue");
    const processingQueue = await redis.lLen("telemetry_processing_queue");
    const vehicleQueues = await vehicleProcessorManager.getQueueTotals();

    return res.status(200).json({
      success: true,
      telemetry_queue: telemetryQueue,
      telemetry_processing_queue: processingQueue,
      vehicle_queues: vehicleQueues,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getVehicleProcessorStatus = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      activeVehicles: vehicleProcessorManager.getActiveVehicleCount(),
      processors: await vehicleProcessorManager.getStats(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const flushTelemetryQueues = async (req, res) => {
  try {
    const redis = getProducerClient();
    const beforeTelemetry = await redis.lLen("telemetry_queue");
    const beforeProcessing = await redis.lLen("telemetry_processing_queue");

    await redis.del("telemetry_queue", "telemetry_processing_queue");
    await vehicleProcessorManager.flush();

    const vehicleQueues = await vehicleProcessorManager.getQueueTotals();

    return res.status(200).json({
      success: true,
      message: "All telemetry scheduler queues flushed successfully.",
      before: {
        telemetry_queue: beforeTelemetry,
        telemetry_processing_queue: beforeProcessing,
      },
      after: {
        telemetry_queue: 0,
        telemetry_processing_queue: 0,
        vehicle_queues: vehicleQueues,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  flushTelemetryQueues,
  getTelemetryQueueStatus,
  getVehicleProcessorStatus,
};
