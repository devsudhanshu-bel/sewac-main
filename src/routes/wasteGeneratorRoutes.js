const express = require("express");

const router = express.Router();

const wasteGeneratorController = require("./controllers/wasteGeneratorController");

const authMiddleware = require("./middlewares/authMiddleware");
const checkPermission = require("./middlewares/checkPermission");
const checkTemporaryPermission = require("./middlewares/checkTemporaryPermission");

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

Request:

GET /api/waste-generators/map
    ?date=2026-08-19
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
Otherwise:

/map

could be interpreted as:

/:phoneNumber

============================================================
*/
router.get("/:phoneNumber", wasteGeneratorController.getWasteGeneratorByPhone);

/*
============================================================
CREATE
============================================================
*/
router.post("/", authMiddleware, wasteGeneratorController.createWasteGenerator);

/*
============================================================
UPDATE
============================================================
*/
router.put(
  "/:phoneNumber",
  authMiddleware,
  checkTemporaryPermission("waste-generators"),
  wasteGeneratorController.updateWasteGenerator,
);

/*
============================================================
DELETE
============================================================
*/
router.delete(
  "/:phoneNumber",
  authMiddleware,
  checkTemporaryPermission("waste-generators"),
  wasteGeneratorController.deleteWasteGenerator,
);

module.exports = router;
