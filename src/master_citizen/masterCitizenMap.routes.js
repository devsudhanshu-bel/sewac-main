const express =
  require("express");

const router =
  express.Router();

const {
  getCityMapData,
} = require("./masterCitizenMap.controller");

/**
 * ============================================================
 * CITY MAP
 * ============================================================
 *
 * GET
 * /api/master-citizen/map/city/:cityId
 *
 * Example:
 *
 * /api/master-citizen/map/city/1
 *
 * ============================================================
 */

router.get(
  "/city/:cityId",
  getCityMapData
);

module.exports =
  router;