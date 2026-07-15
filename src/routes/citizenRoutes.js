const express = require("express");

const router = express.Router();

const citizenController = require("../controllers/citizenController");

const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");

// Search citizen (restricted to users page permission)
router.get(
  "/search",
  authMiddleware,
  checkPermission("users"),
  citizenController.searchCitizen
);

// Get all citizens (restricted to users page permission)
router.get(
  "/all",
  authMiddleware,
  checkPermission("users"),
  citizenController.getAllCitizens
);

module.exports = router;