const express =
  require("express");

const router =
  express.Router();


const {
  getCityMapDataController,
  getZoneDivisionsController,
} =
  require("./masterCitizenMap.controller");


/**
 * ============================================================
 * CITY MAP
 * ============================================================
 *
 * GET
 *
 * /api/master-citizen/map/city/:cityId
 *
 * Returns:
 *
 * City
 * +
 * All zones
 *
 * ============================================================
 */

router.get(
  "/map/city/:cityId",
  getCityMapDataController
);


/**
 * ============================================================
 * ZONE DIVISIONS
 * ============================================================
 *
 * GET
 *
 * /api/master-citizen/map/zone/:zoneTableName/divisions
 *
 * Example:
 *
 * /api/master-citizen/map/zone/
 * bengaluru_east_city_corporation_zone/
 * divisions
 *
 * ============================================================
 */

router.get(
  "/map/zone/:zoneTableName/divisions",
  getZoneDivisionsController
);


/**
 * ============================================================
 * EXPORT
 * ============================================================
 */

module.exports =
  router;