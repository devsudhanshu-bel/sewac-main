const express = require("express");

const router = express.Router();

const {
  getOverview,
  getOverviewFilters,
} = require("../controllers/overviewController");

router.get("/", getOverview);

router.get(
  "/filters",
  getOverviewFilters
);

module.exports = router;