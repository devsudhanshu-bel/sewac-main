const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const checkPermission = require("../middlewares/checkPermission");

const {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleSummary,
  getAverageWeightByZone,
} = require("../controllers/vehicleController");

/*
|--------------------------------------------------------------------------
| VEHICLES
|--------------------------------------------------------------------------
|
| All three roles currently have:
|
| vehicles: true
|
| Therefore all authenticated roles can VIEW.
|
| Mutation will be restricted separately by canEdit/canDelete.
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| VEHICLE SUMMARY
|--------------------------------------------------------------------------
*/

router.get("/summary", getVehicleSummary);

/*
|--------------------------------------------------------------------------
| AVERAGE WEIGHT BY ZONE
|--------------------------------------------------------------------------
|
| GET
|
| /api/vehicles/average-weight-by-zone
|
| Example:
|
| /api/vehicles/average-weight-by-zone?date=2026-08-24
|
|--------------------------------------------------------------------------
*/

router.get("/average-weight-by-zone", getAverageWeightByZone);

/*
|--------------------------------------------------------------------------
| ALL VEHICLES
|--------------------------------------------------------------------------
*/

router.get("/", getAllVehicles);

/*
|--------------------------------------------------------------------------
| VEHICLE BY ID
|--------------------------------------------------------------------------
*/

router.get("/:vehicleId", getVehicleById);

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

router.post("/", createVehicle);

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

router.put("/:vehicleId", updateVehicle);

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

router.delete("/:vehicleId", deleteVehicle);

module.exports = router;
