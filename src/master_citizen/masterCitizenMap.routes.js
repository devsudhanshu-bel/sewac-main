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
 * COMPLETE CITY MAP
 * ============================================================
 *
 * GET
 *
 * /api/master-citizen/map/city/:cityId
 *
 *
 * RETURNS:
 *
 * City
 *   ↓
 * Zones
 *   ↓
 * Divisions
 *   ↓
 * Wards
 *
 *
 * NO CITIZEN DATA.
 *
 * ============================================================
 */

router.get(
  "/map/city/:cityId",
  getCityMapDataController
);


module.exports =
  router;