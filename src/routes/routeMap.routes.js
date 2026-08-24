const express = require("express");

const router = express.Router();

const { getLiveRouteMap } = require("../controllers/routeMapController");

const authMiddleware = require("../middlewares/authMiddleware");

/*
|--------------------------------------------------------------------------
| LIVE VEHICLE MAP
|--------------------------------------------------------------------------
|
| GET
|
| /api/route-map/live
|
| Query parameters:
|
| latitude
| longitude
| cityId
| zoneId
| divisionId
| wardId
|
|--------------------------------------------------------------------------
*/

router.get("/live", authMiddleware, getLiveRouteMap);

module.exports = router;
