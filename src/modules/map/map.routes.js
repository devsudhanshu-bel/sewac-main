import express from "express";

import mapController from "./map.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET NEAREST VEHICLE
|--------------------------------------------------------------------------
|
| GET /api/route-map/nearest
|
*/

router.get("/nearest", mapController.getNearestVehicle);

/*
|--------------------------------------------------------------------------
| GET LIVE VEHICLE LOCATIONS
|--------------------------------------------------------------------------
|
| GET /api/route-map/live
|
| This is the endpoint your Flutter app is calling.
|
*/

router.get("/live", mapController.getLiveVehicleLocations);

/*
|--------------------------------------------------------------------------
| GET ALL LIVE VEHICLES
|--------------------------------------------------------------------------
|
| GET /api/route-map/vehicles
|
*/

router.get("/vehicles", mapController.getLiveVehicles);

/*
|--------------------------------------------------------------------------
| GET SINGLE VEHICLE
|--------------------------------------------------------------------------
|
| GET /api/route-map/vehicle/:vehicleId
|
*/

router.get("/vehicle/:vehicleId", mapController.getVehicle);

export default router;
