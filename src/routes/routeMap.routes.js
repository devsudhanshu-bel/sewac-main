const express = require("express");

const router = express.Router();

const { getLiveRouteMap } = require("../controllers/routeMapController");

/*
|--------------------------------------------------------------------------
| LIVE ROUTE MAP
|--------------------------------------------------------------------------
|
| GET
|
| /api/route-map/live
|
| Query:
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

router.get("/live", getLiveRouteMap);

module.exports = router;
