const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");
const express = require("express");

const router = express.Router();

const {
  getOverview,
  getOverviewFilters,
} = require("../controllers/overviewController");

// Overview main page access
router.get(
  "/",
  getOverview
);

// Overview filters access
router.get(
  "/filters",
  getOverviewFilters
);

module.exports = router;