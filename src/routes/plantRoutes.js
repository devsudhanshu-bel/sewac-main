const express = require("express");

const router = express.Router();

const {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getPlantDashboard,
  getPlantLocations
} = require("../controllers/plantController");

router.get("/", getAllPlants);
router.get("/dashboard", getPlantDashboard);
router.get("/locations", getPlantLocations);
router.get("/:id", getPlantById);
router.post("/", createPlant);
router.put("/:id", updatePlant);
router.delete("/:id", deletePlant);

module.exports = router;