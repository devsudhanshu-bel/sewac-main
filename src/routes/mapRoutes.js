const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");

// Placeholder controller
const mapController = require("../controllers/mapController");

// Map data (overview-level access)
router.get(
  "/",
  authMiddleware,
  checkPermission("overview"),
  mapController.getMapData
);

module.exports = router;