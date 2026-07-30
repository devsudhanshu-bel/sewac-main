const express = require("express");
const router = express.Router();

const {
  flushTelemetryQueues,
} = require("../controllers/redisController");

// Protect this with your auth middleware
router.delete("/telemetry/flush", flushTelemetryQueues);

module.exports = router;