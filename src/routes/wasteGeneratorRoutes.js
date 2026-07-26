const express = require("express");
const router = express.Router();

const wasteGeneratorController = require("../controllers/wasteGeneratorController");

const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");
const checkTemporaryPermission = require("../middlewares/checkTemporaryPermission");

// Waste Generator Summary
router.get("/", wasteGeneratorController.getAllWasteGenerators);
//router.get("/dashboard", getWasteGeneratorDashboard);
router.get(
  "/summary",
  authMiddleware,
  checkPermission("waste_generators"),
  wasteGeneratorController.getSummary
);

router.get("/gvp-trend", wasteGeneratorController.getGVPTrend);
// Waste Generator Directory
router.get(
  "/directory",
  authMiddleware,
  checkPermission("waste_generators"),
  wasteGeneratorController.getDirectory
);
// Waste Generator GVP Trend
router.get(
  "/gvp-trend",
  authMiddleware,
  checkPermission("waste_generators"),
  wasteGeneratorController.getGvpTrend
);
router.get("/:phoneNumber", wasteGeneratorController.getWasteGeneratorByPhone);
router.post(
  "/",
  authMiddleware,
  wasteGeneratorController.createWasteGenerator
);
router.put("/:phoneNumber", authMiddleware, checkTemporaryPermission("waste-generators"), wasteGeneratorController.updateWasteGenerator);
router.delete("/:phoneNumber", authMiddleware, checkTemporaryPermission("waste-generators"), wasteGeneratorController.deleteWasteGenerator);

module.exports = router;