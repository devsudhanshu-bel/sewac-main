const express = require("express");

const {
  getComplaintLocations,
} = require("../controller/complaintsGrev.controller");

const router = express.Router();

/* =========================================================
   GET ALL COMPLAINT LOCATIONS
========================================================= */

router.get(
  "/locations",
  getComplaintLocations
);

module.exports = router;