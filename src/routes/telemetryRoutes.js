const express = require("express");
const router = express.Router();

const { recordTelemetry } = require("../controllers/telemetryController");
const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");

router.get(
    "/record",
    authMiddleware,
    checkPermission("logs"),
    recordTelemetry
);

module.exports = router;