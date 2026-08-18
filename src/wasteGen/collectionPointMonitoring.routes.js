/**
 * ==========================================================
 * SEWAC COLLECTION POINT MONITORING ROUTES
 * ==========================================================
 */

const express = require("express");

const {
  getCollectionPointMonitoringController,
} = require("../controllers/collectionPointMonitoring.controller");

const router = express.Router();

/* ==========================================================
   GET COLLECTION POINT MONITORING
========================================================== */

/*
 * Example:
 *
 * GET
 * /api/collection-point-monitoring?wardNo=216&date=2026-08-18
 *
 */

router.get(
  "/",
  getCollectionPointMonitoringController,
);

module.exports = router;