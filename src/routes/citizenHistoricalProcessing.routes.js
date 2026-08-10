const Router =
  require("express")
    .Router();


const controller =
  require(
    "../controllers/citizenHistoricalProcessing.controller"
  );


// =====================================================
// CITIZEN HISTORICAL PROCESSING ROUTES
// =====================================================
//
// POST /run
// POST /run/today
// GET  /status
//
// =====================================================


// =====================================================
// MANUAL PROCESSING
// =====================================================

Router.post(
  "/run",
  controller.runHistoricalProcessing
);


// =====================================================
// PROCESS TODAY
// =====================================================
//
// Mainly useful during development/testing.
//
// =====================================================

Router.post(
  "/run/today",
  controller.runToday
);


// =====================================================
// STATUS
// =====================================================

Router.get(
  "/status",
  controller.getHistoricalProcessingStatus
);


module.exports =
  Router;