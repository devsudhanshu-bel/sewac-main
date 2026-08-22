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

router.get(
  "/summary",
  getVehicleSummary,
);

router.get("/", getAllVehicles);

router.get(
  "/:vehicleId",
  getVehicleById,
);

router.post(
  "/",
  createVehicle,
);

router.put(
  "/:vehicleId",
  updateVehicle,
);

router.delete(
  "/:vehicleId",
  deleteVehicle,
);

module.exports = router;
