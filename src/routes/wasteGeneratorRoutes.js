const express = require("express");
const router = express.Router();

const wasteGeneratorController = require("../controllers/wasteGeneratorController");

const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");


// =====================================================
// WASTE GENERATORS
// =====================================================

// Current Waste Generators
router.get(
  "/",
  wasteGeneratorController.getAllWasteGenerators
);


// =====================================================
// SUMMARY
// =====================================================

router.get(
  "/summary",
  authMiddleware,
  checkPermission("waste_generators"),
  wasteGeneratorController.getSummary
);


// =====================================================
// DIRECTORY
// =====================================================

router.get(
  "/directory",
  authMiddleware,
  checkPermission("waste_generators"),
  wasteGeneratorController.getDirectory
);


// =====================================================
// GVP TREND
// =====================================================

router.get(
  "/gvp-trend",
  authMiddleware,
  checkPermission("waste_generators"),
  wasteGeneratorController.getGVPTrend
);


// =====================================================
// SINGLE WASTE GENERATOR
// =====================================================

router.get(
  "/:phoneNumber",
  wasteGeneratorController.getWasteGeneratorByPhone
);


// =====================================================
// CREATE
// =====================================================

router.post(
  "/",
  authMiddleware,
  wasteGeneratorController.createWasteGenerator
);


// =====================================================
// UPDATE
// =====================================================

router.put(
  "/:phoneNumber",
  authMiddleware,
  wasteGeneratorController.updateWasteGenerator
);


// =====================================================
// DELETE
// =====================================================

router.delete(
  "/:phoneNumber",
  authMiddleware,
  wasteGeneratorController.deleteWasteGenerator
);


module.exports = router;