const express = require("express");

const router = express.Router();

const {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

router.get("/", getAllVehicles);
router.get("/:vehicleId", getVehicleById);
router.post("/", createVehicle);
router.put("/:vehicleId", updateVehicle);
router.delete("/:vehicleId", deleteVehicle);

module.exports = router;