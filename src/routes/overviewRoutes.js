const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");
const express = require("express");

const router = express.Router();

const {
    getSummary,
    getVehicleSummary,
    getGenerationTrend,
    getMapData,
    getOverviewFilters
}=require("../controllers/overviewController");

// Overview main page access
router.get("/summary",getSummary);

router.get("/vehicle-summary",getVehicleSummary);

router.get("/generation-trend",getGenerationTrend);

router.get("/map",getMapData);

// Overview filters access
router.get(
  "/filters",
  getOverviewFilters
);

module.exports = router;