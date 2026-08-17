const express =
  require("express");


const router =
  express.Router();


const {
  getCityMapDataController,
  getZoneDivisionsController,
  getDivisionWardsController,
} =
  require("./masterCitizenMap.controller");


// ============================================================
// CITY
// ============================================================
//
// GET
//
// /api/master-citizen/map/city/:cityId
//
// Returns:
//
// City
//   └── Zones
//
// ============================================================

router.get(
  "/map/city/:cityId",
  getCityMapDataController
);


// ============================================================
// ZONE → DIVISIONS
// ============================================================
//
// GET
//
// /api/master-citizen/map/zone/:zoneTableName/divisions
//
// Example:
//
// /api/master-citizen/map/zone/
// bengaluru_east_city_corporation_zone
// /divisions
//
// ============================================================

router.get(
  "/map/zone/:zoneTableName/divisions",
  getZoneDivisionsController
);


// ============================================================
// DIVISION → WARDS
// ============================================================
//
// GET
//
// /api/master-citizen/map/division/:divisionTableName/wards
//
// ============================================================

router.get(
  "/map/division/:divisionTableName/wards",
  getDivisionWardsController
);


// ============================================================
// EXPORT
// ============================================================

module.exports =
  router;