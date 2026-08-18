/**
 * ==========================================================
 * SEWAC COLLECTION POINT MONITORING ROUTES
 * ==========================================================
 */

const express =
  require("express");


const {
  getCollectionPointMonitoringController,
} =
  require(
    "./collectionPointMonitoring.controller"
  );


const router =
  express.Router();


/* ==========================================================
   GET COLLECTION POINT MONITORING
========================================================== */

/*
 * Example:
 *
 * GET
 *
 * /api/collection-point-monitoring?wardNo=216&date=2026-08-17
 *
 */

router.get(
  "/",
  getCollectionPointMonitoringController
);


/* ==========================================================
   EXPORT
========================================================== */

module.exports =
  router;