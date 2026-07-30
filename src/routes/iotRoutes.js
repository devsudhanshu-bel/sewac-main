const express = require("express");
const router = express.Router();

const { recordTelemetry } = require("../controllers/telemetryController");

router.get(
    "/telemetry/record",
    recordTelemetry
);

module.exports = router;