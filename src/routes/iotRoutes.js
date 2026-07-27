const express = require("express");
const router = express.Router();

const { recordTelemetry } = require("../controllers/telemetryController");
const iotAuthMiddleware = require("../middlewares/iotAuthMiddleware");

router.get(
    "/telemetry/record",
    iotAuthMiddleware,
    recordTelemetry
);

module.exports = router;