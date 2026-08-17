const express =
  require("express");


const router =
  express.Router();


const {
  getCityMapDataController,
} =
  require("./masterCitizenMap.controller");


/**
 * ============================================================
 * COMPLETE CITY MAP ENDPOINT
 * ============================================================
 *
 * GET
 *
 * /api/master-citizen/map/city/:cityId
 *
 *
 * HIERARCHY:
 *
 * CITY
 *   ↓
 *   boundary
 *   ↓
 * ZONES
 *   ↓
 *   boundary
 *   ↓
 * DIVISIONS
 *   ↓
 *   boundary
 *   ↓
 * WARDS
 *   ↓
 *   boundary
 *
 *
 * Example:
 *
 * GET
 * /api/master-citizen/map/city/1
 *
 *
 * Response contains ONLY:
 *
 * - City information
 * - City geo boundary
 * - Zone information
 * - Zone geo boundaries
 * - Division information
 * - Division geo boundaries
 * - Ward information
 * - Ward geo boundaries
 *
 *
 * NO:
 *
 * - Citizens
 * - Citizen records
 * - Citizen counts
 * - Citizen table data
 *
 * ============================================================
 */

router.get(
  "/map/city/:cityId",
  getCityMapDataController
);


/**
 * ============================================================
 * EXPORT ROUTER
 * ============================================================
 */

module.exports =
  router;