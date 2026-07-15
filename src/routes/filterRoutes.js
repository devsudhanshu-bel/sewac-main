const express = require("express");
const router = express.Router();

const filterController = require("../controllers/filterController");

const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");

// Shared hierarchical filters
router.get(
  "/cities",
  authMiddleware,
  checkPermission("overview"),
  filterController.getCities
);

router.get(
  "/zones/:cityId",
  authMiddleware,
  checkPermission("overview"),
  filterController.getZones
);

router.get(
  "/divisions/:zoneId",
  authMiddleware,
  checkPermission("overview"),
  filterController.getDivisions
);

router.get(
  "/wards/:divisionId",
  authMiddleware,
  checkPermission("overview"),
  filterController.getWards
);

module.exports = router;