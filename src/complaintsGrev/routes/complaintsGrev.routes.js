const express = require("express");

const {
  getComplaintLocations,
} = require("../controller/complaintsGrev.controller");

const router = express.Router();

/* =========================================================
   GET ALL BENGALURU COMPLAINT LOCATIONS
========================================================= */

/*
   GET

   /api/complaints-grev/locations

   Returns only complaints whose coordinates
   fall inside the Bengaluru city boundary.
*/

router.get(
  "/locations",
  getComplaintLocations
);

module.exports = router;