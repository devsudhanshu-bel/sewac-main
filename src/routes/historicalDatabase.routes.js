const express = require("express");

const {
  archiveToday,
  archiveDate,
} = require(
  "../controllers/citizenHistoricalArchive.controller"
);

const router = express.Router();


// =====================================================
// ARCHIVE TODAY
// =====================================================
//
// POST
// /archive-today
//
// Reads:
// master_telemetry_db
//      ↓
// day_DDMMYYYY
//      ↓
// vehicle_table_name
//      ↓
// vehicle table
//      ↓
// ward historical monthly table
//
// =====================================================

router.post(
  "/archive-today",
  archiveToday
);


// =====================================================
// ARCHIVE SPECIFIC DATE
// =====================================================
//
// POST
// /archive
//
// Body:
//
// {
//   "date": "2026-08-14"
// }
//
// =====================================================

router.post(
  "/archive",
  archiveDate
);


module.exports = router;