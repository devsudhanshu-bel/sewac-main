const express = require("express");

const router = express.Router();

const wasteGeneratorController = require("../controllers/wasteGeneratorController");

const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");
const checkTemporaryPermission = require("../middlewares/checkTemporaryPermission");
const checkActionPermission = require("../middlewares/checkActionPermission");

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
  checkPermission("waste_generators"),
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
  checkPermission("waste_generators"),
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
  checkPermission("waste_generators"),
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
  checkPermission("waste_generators"),
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
  checkPermission("waste_generators"),
  checkActionPermission("EDIT"),
  wasteGeneratorController.updateWasteGenerator,
);

module.exports = router;
