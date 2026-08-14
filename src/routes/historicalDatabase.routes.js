const express =
  require("express");

const {
  archiveToday,
  archiveDate,
} =
  require(
    "../controllers/historicalDatabase.controller"
  );

const router =
  express.Router();

// =====================================================
// ARCHIVE TODAY
// =====================================================

router.post(
  "/archive-today",
  archiveToday
);

// =====================================================
// ARCHIVE SPECIFIC DATE
// =====================================================

router.post(
  "/archive",
  archiveDate
);

module.exports =
  router;