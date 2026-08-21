const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");
const checkActionPermission = require("../middlewares/checkActionPermission");

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
  checkPermission("plants"),
  getPlantDashboard,
);

router.get(
  "/locations",
  authMiddleware,
  checkPermission("plants"),
  getPlantLocations,
);

router.get("/", authMiddleware, checkPermission("plants"), getAllPlants);

router.get("/:id", authMiddleware, checkPermission("plants"), getPlantById);

/*
|--------------------------------------------------------------------------
| PLANTS — MUTATIONS
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authMiddleware,
  checkPermission("plants"),
  checkActionPermission("EDIT"),
  createPlant,
);

router.put(
  "/:id",
  authMiddleware,
  checkPermission("plants"),
  checkActionPermission("EDIT"),
  updatePlant,
);

router.delete(
  "/:id",
  authMiddleware,
  checkPermission("plants"),
  checkActionPermission("DELETE"),
  deletePlant,
);

module.exports = router;
