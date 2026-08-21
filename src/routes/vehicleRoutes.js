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
  authMiddleware,
  getVehicleSummary,
);

router.get("/", authMiddleware, checkPermission("vehicles"), getAllVehicles);

router.get(
  "/:vehicleId",
  authMiddleware,
  getVehicleById,
);

router.post(
  "/",
  authMiddleware,
  createVehicle,
);

router.put(
  "/:vehicleId",
  authMiddleware,
  updateVehicle,
);

router.delete(
  "/:vehicleId",
  authMiddleware,
  deleteVehicle,
);

module.exports = router;
