const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");

const {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getPlantDashboard,
  getPlantLocations,
} = require("../controllers/plantController");

/*
|--------------------------------------------------------------------------
| PLANTS — VIEW
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",
  getPlantDashboard,
);

router.get(
  "/locations",
  getPlantLocations,
);

router.get("/", getAllPlants);

router.get("/:id", getPlantById);

/*
|--------------------------------------------------------------------------
| PLANTS — MUTATIONS
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  createPlant,
);

router.put(
  "/:id",
  updatePlant,
);

router.delete(
  "/:id",
  deletePlant,
);

module.exports = router;
