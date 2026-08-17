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
 * ONE CITY MAP ENDPOINT
 * ============================================================
 *
 * GET
 * /api/master-citizen/map/city/:cityId
 *
 * ============================================================
 */

router.get(
  "/map/city/:cityId",
  getCityMapDataController
);


module.exports =
  router;