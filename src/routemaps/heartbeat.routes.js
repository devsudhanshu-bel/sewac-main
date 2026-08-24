/**
 * ==========================================================
 * SEWAC ROUTE MAP - HEARTBEAT ROUTES
 * ==========================================================
 *
 * WRITE:
 *
 * POST /api/iot/heart-beat/lat+long
 * GET  /api/iot/heart-beat/lat+long
 *
 * READ:
 *
 * GET /api/iot/heart-beat/lat+long/data
 *
 * LIVE:
 *
 * GET /api/iot/heart-beat/lat+long/latest
 *
 * ==========================================================
 */

const express =
  require("express");

const router =
  express.Router();

const {
  saveHeartbeat,

  getHeartbeatData,

  getLatestHeartbeat,
} =
  require("./heartbeat.controller");


// ==========================================================
// WRITE HEARTBEAT
// ==========================================================
//
// POST
//
// /api/iot/heart-beat/lat+long
//
// ==========================================================

router.post(
  "/heart-beat/lat+long",
  saveHeartbeat,
);


// ==========================================================
// WRITE HEARTBEAT
// ==========================================================
//
// GET
//
// /api/iot/heart-beat/lat+long
//
// Example:
//
// /api/iot/heart-beat/lat+long
// ?vehicleNumber=KA05AB1237
// &latitude=12.9012345
// &longitude=77.6534567
//
// ==========================================================

router.get(
  "/heart-beat/lat+long",
  saveHeartbeat,
);


// ==========================================================
// GET COMPLETE HEARTBEAT DATA
// ==========================================================
//
// GET
//
// /api/iot/heart-beat/lat+long/data
//
// Example:
//
// /api/iot/heart-beat/lat+long/data
// ?vehicleNumber=KA05AB1237
//
// ==========================================================

router.get(
  "/heart-beat/lat+long/data",
  getHeartbeatData,
);


// ==========================================================
// GET LATEST HEARTBEAT
// ==========================================================
//
// GET
//
// /api/iot/heart-beat/lat+long/latest
//
// Example:
//
// /api/iot/heart-beat/lat+long/latest
// ?vehicleNumber=KA05AB1237
//
// ==========================================================

router.get(
  "/heart-beat/lat+long/latest",
  getLatestHeartbeat,
);


// ==========================================================
// EXPORT
// ==========================================================

module.exports =
  router;