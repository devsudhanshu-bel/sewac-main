const express = require("express");

const router = express.Router();

const { recordHeartbeat } = require("../controllers/heartbeatController");

// =====================================================
// VEHICLE HEARTBEAT
// =====================================================
//
// GET:
//
// /api/iot/heart-beat/:vehicleId
//
// Example:
//
// /api/iot/heart-beat/KA05AB1237
//   ?latitude=12.902313
//   &longitude=77.654855
//
// =====================================================

router.get("/heart-beat/:vehicleId", recordHeartbeat);

module.exports = router;
