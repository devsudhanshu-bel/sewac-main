const express = require("express");

const router = express.Router();

const wasteGeneratorController = require("../controllers/wasteGeneratorController");

const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");
const checkTemporaryPermission = require("../middlewares/checkTemporaryPermission");

/*
============================================================
GET ALL WASTE GENERATORS
============================================================
*/
router.get("/", wasteGeneratorController.getAllWasteGenerators);

/*
============================================================
MAP
============================================================

IMPORTANT:
This MUST remain before /:phoneNumber.

GET /api/waste-generators/map
    ?date=2026-08-17
    &cityId=1
    &zoneId=4
    &divisionId=5
    &wardId=216
============================================================
*/
router.get(
  "/map",
  authMiddleware,
  wasteGeneratorController.getMap,
);

/*
============================================================
SUMMARY
============================================================
*/
router.get(
  "/summary",
  authMiddleware,
  wasteGeneratorController.getSummary,
);

/*
============================================================
DIRECTORY
============================================================
*/
router.get(
  "/directory",
  authMiddleware,
  wasteGeneratorController.getDirectory,
);

/*
============================================================
GVP TREND
============================================================
*/
router.get(
  "/gvp-trend",
  authMiddleware,
  wasteGeneratorController.getGVPTrend,
);

/*
============================================================
GET ONE WASTE GENERATOR
============================================================

Keep this AFTER /map.
============================================================
*/
router.get("/:phoneNumber", wasteGeneratorController.getWasteGeneratorByPhone);

/*
============================================================
UPDATE
============================================================
*/
router.put(
  "/:phoneNumber",
  authMiddleware,
  wasteGeneratorController.updateWasteGenerator,
);

module.exports = router;
