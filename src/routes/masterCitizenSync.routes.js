const express =
  require("express");

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
// =====================================================

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
// Example:
//
// /api/master-citizen/sync/ward/216
//
// =====================================================

router.post(
  "/sync/ward/:wardNo",
  controller.syncOneWard
);


// =====================================================
// EXPORT
// =====================================================

module.exports =
  router;