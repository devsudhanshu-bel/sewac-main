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
  authMiddleware,
  getPlantDashboard,
);

router.get(
  "/locations",
  authMiddleware,
  getPlantLocations,
);

router.get("/", authMiddleware, getAllPlants);

router.get("/:id", authMiddleware, getPlantById);

/*
|--------------------------------------------------------------------------
| PLANTS — MUTATIONS
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authMiddleware,
  createPlant,
);

router.put(
  "/:id",
  authMiddleware,
  updatePlant,
);

router.delete(
  "/:id",
  authMiddleware,
  deletePlant,
);

module.exports = router;
