const express = require("express");
const router = express.Router();

const {
  flushTelemetryQueues,
  getTelemetryQueueStatus,
  getVehicleProcessorStatus,
} = require("../controllers/redisController");

// Queue status
router.get("/telemetry/status", getTelemetryQueueStatus);

// Flush queues
router.delete("/telemetry/flush", flushTelemetryQueues);

router.get("/telemetry/processors", getVehicleProcessorStatus);

module.exports = router;
