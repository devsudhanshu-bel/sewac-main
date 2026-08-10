const express = require("express");

const controller =
  require("../controllers/masterCitizenSync.controller");

const router =
  express.Router();

// =====================================================
// FULL MASTER CITIZEN SYNC
// =====================================================
//
// POST
// /api/master-citizen/sync
//
// Synchronizes all citizens from the Helper DB
// into their corresponding Ward tables.
//

router.post(
  "/sync",
  controller.syncAllCitizens
);

// =====================================================
// WARD-WISE MASTER CITIZEN SYNC
// =====================================================
//
// POST
// /api/master-citizen/sync/ward/:wardNo
//
// IMPORTANT:
// The route uses the actual Ward Number,
// NOT the internal ward_id.
//
// Example:
//
// POST
// /api/master-citizen/sync/ward/174
//
// This will:
//
// 174
//   ↓
// Find Master Citizen Ward where ward_no = 174
//   ↓
// Get its ward_table_name
//   ↓
// Read Helper DB citizens
//   ↓
// Match citizens belonging to Ward 174
//   ↓
// Bulk upsert into the Ward table
//

router.post(
  "/sync/ward/:wardNo",
  controller.syncOneWard
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;