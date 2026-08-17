const express =
  require("express");

const router =
  express.Router();

const routeMapController =
  require("../controllers/routeMapController");

/*
|--------------------------------------------------------------------------
| ROUTE MAP
|--------------------------------------------------------------------------
|
| Example:
|
| GET
| /api/admin/route-map
|
| Query:
|
| ?date=2026-08-16
| &wardNo=20
|
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  routeMapController.getRouteMap
);

module.exports =
  router;