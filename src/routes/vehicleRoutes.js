const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");
const checkActionPermission = require("../middlewares/checkActionPermission");

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
  checkPermission("vehicles"),
  getVehicleSummary,
);

router.get("/", authMiddleware, checkPermission("vehicles"), getAllVehicles);

router.get(
  "/:vehicleId",
  authMiddleware,
  checkPermission("vehicles"),
  getVehicleById,
);

router.post(
  "/",
  authMiddleware,
  checkPermission("vehicles"),
  checkActionPermission("EDIT"),
  createVehicle,
);

router.put(
  "/:vehicleId",
  authMiddleware,
  checkPermission("vehicles"),
  checkActionPermission("EDIT"),
  updateVehicle,
);

router.delete(
  "/:vehicleId",
  authMiddleware,
  checkPermission("vehicles"),
  checkActionPermission("DELETE"),
  deleteVehicle,
);

module.exports = router;
