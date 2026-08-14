const express = require("express");
const cors = require("cors");

// =====================================================
// EXISTING ROUTES
// =====================================================

const overviewRoutes =
  require("./routes/overviewRoutes");

const citizenRoutes =
  require("./routes/citizenRoutes");

const telemetryRoutes =
  require("./routes/telemetryRoutes");

const ragRoutes =
  require("./routes/ragRoutes");

const iotRoutes =
  require("./routes/iotRoutes");

const filterRoutes =
  require("./routes/filterRoutes");

const wasteGeneratorRoutes =
  require("./routes/wasteGeneratorRoutes");

const authRoutes =
  require("./routes/authRoutes");

const logsRoutes =
  require("./routes/logsRoutes");

const usersRoutes =
  require("./routes/usersRoutes");

const vehicleRoutes =
  require("./routes/vehicleRoutes");

const plantRoutes =
  require("./routes/plantRoutes");

const permissionRoutes =
  require("./routes/permissionRoutes");

const redisRoutes =
  require("./routes/redisRoutes");

const complaintRoutes =
  require("./routes/complaintRoutes");


// =====================================================
// NEW HISTORICAL DATABASE
// =====================================================
//
// New clean historical database pipeline.
//
// Endpoint:
//
// POST
// /api/historical-database/archive-today
//
// POST
// /api/historical-database/archive
//
// =====================================================

const historicalDatabaseRoutes =
  require(
    "./routes/historicalDatabase.routes"
  );


// =====================================================
// OLD CITIZEN HISTORICAL PROCESSING
// =====================================================
//
// NOTE:
//
// This is kept temporarily because the old historical
// processing system is still present in the project.
//
// We will remove/deprecate this later after the new
// historical-database pipeline has been tested.
//
// Manual:
//
// POST
// /api/historical-processing/run
//
// POST
// /api/historical-processing/run/today
//
// Status:
//
// GET
// /api/historical-processing/status
//
// =====================================================

const citizenHistoricalProcessingRoutes =
  require(
    "./routes/citizenHistoricalProcessing.routes"
  );


// =====================================================
// OLD CITIZEN HISTORICAL AUTOMATIC SCHEDULER
// =====================================================
//
// TEMPORARILY KEPT.
//
// Automatically processes the previous day's
// telemetry every day at 00:05.
//
// This belongs to the OLD citizenHistorical pipeline.
//
// We will remove it once the new historical database
// scheduler is implemented and tested.
//
// =====================================================

const citizenHistoricalScheduler =
  require(
    "./schedulers/citizenHistorical.scheduler"
  );


// =====================================================
// MASTER CITIZEN ROUTES
// =====================================================

const masterCitizenCityRoutes =
  require(
    "./routes/masterCitizenCity.routes"
  );

const masterCitizenZoneRoutes =
  require(
    "./routes/masterCitizenZone.routes"
  );

const masterCitizenDivisionRoutes =
  require(
    "./routes/masterCitizenDivision.routes"
  );

const masterCitizenWardRoutes =
  require(
    "./routes/masterCitizenWard.routes"
  );

const masterCitizenSyncRoutes =
  require(
    "./routes/masterCitizenSync.routes"
  );


// =====================================================
// MASTER CITIZEN BACKGROUND JOBS
// =====================================================

const {
  startMasterCitizenWeeklySync,
} =
  require(
    "./jobs/masterCitizenSync.job"
  );


// =====================================================
// APP
// =====================================================

const app =
  express();


// =====================================================
// CORS
// =====================================================

const allowedOrigins = [

  "https://app-authentication-frontend.onrender.com",

  "https://sewac-main-frontend.onrender.com",

];


app.use(
  cors({

    origin:
      function (
        origin,
        callback
      ) {

        // -------------------------------------------------
        // Allow requests without Origin
        //
        // Useful for:
        // Thunder Client
        // Postman
        // Server-to-server requests
        // etc.
        // -------------------------------------------------

        if (
          !origin
        ) {

          return callback(
            null,
            true
          );

        }


        // -------------------------------------------------
        // Allow known frontend origins
        // -------------------------------------------------

        if (
          allowedOrigins.includes(
            origin
          )
        ) {

          return callback(
            null,
            true
          );

        }


        // -------------------------------------------------
        // Reject unknown origins
        // -------------------------------------------------

        return callback(
          new Error(
            "Not allowed by CORS"
          )
        );

      },

    credentials:
      true,

  }),
);


// =====================================================
// BODY PARSER
// =====================================================

app.use(
  express.json()
);


// =====================================================
// EXISTING API ROUTES
// =====================================================

app.use(
  "/api/filters",
  filterRoutes
);


app.use(
  "/api/admin/overview",
  overviewRoutes
);


app.use(
  "/api/users",
  usersRoutes
);


app.use(
  "/api/admin/citizens",
  citizenRoutes
);


app.use(
  "/api/admin/telemetry",
  telemetryRoutes
);


app.use(
  "/api/waste-generators",
  wasteGeneratorRoutes
);


app.use(
  "/api/iot",
  iotRoutes
);


app.use(
  "/api/rag",
  ragRoutes
);


app.use(
  "/api/logs",
  logsRoutes
);


app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/vehicles",
  vehicleRoutes
);


app.use(
  "/api/plants",
  plantRoutes
);


app.use(
  "/api/permissions",
  permissionRoutes
);


app.use(
  "/api/redis",
  redisRoutes
);


app.use(
  "/api/complaints",
  complaintRoutes
);


// =====================================================
// NEW HISTORICAL DATABASE
// =====================================================
//
// POST
// /api/historical-database/archive-today
//
// Archives today's telemetry.
//
//
//
// POST
// /api/historical-database/archive
//
// Body:
//
// {
//   "date": "2026-08-14"
// }
//
// =====================================================

app.use(
  "/api/historical-database",
  historicalDatabaseRoutes
);


// =====================================================
// OLD CITIZEN HISTORICAL PROCESSING
// =====================================================
//
// TEMPORARY.
//
// These routes belong to the old historical system.
//
// POST
// /api/historical-processing/run
//
// Body:
//
// {
//   "date": "2026-08-09"
// }
//
//
//
// POST
// /api/historical-processing/run/today
//
//
//
// GET
// /api/historical-processing/status
//
// =====================================================

app.use(
  "/api/historical-processing",
  citizenHistoricalProcessingRoutes
);


// =====================================================
// MASTER CITIZEN
// =====================================================


// =====================================================
// CITY
// =====================================================
//
// POST
// /api/master-citizen/cities
//
// GET
// /api/master-citizen/cities
//
// GET
// /api/master-citizen/cities/:cityId
//
// =====================================================

app.use(
  "/api/master-citizen",
  masterCitizenCityRoutes
);


// =====================================================
// ZONE
// =====================================================
//
// POST
// /api/master-citizen/cities/:cityId/zones
//
// GET
// /api/master-citizen/cities/:cityId/zones
//
// GET
// /api/master-citizen/cities/:cityId/zones/:zoneId
//
// PATCH
// /api/master-citizen/cities/:cityId/zones/:zoneId
//
// DELETE
// /api/master-citizen/cities/:cityId/zones/:zoneId
//
// =====================================================

app.use(
  "/api/master-citizen",
  masterCitizenZoneRoutes
);


// =====================================================
// DIVISION
// =====================================================
//
// POST
// /api/master-citizen/cities/:cityId/zones/:zoneId/divisions
//
// GET
// /api/master-citizen/cities/:cityId/zones/:zoneId/divisions
//
// GET
// /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId
//
// PATCH
// /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId
//
// DELETE
// /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId
//
// =====================================================

app.use(
  "/api/master-citizen",
  masterCitizenDivisionRoutes
);


// =====================================================
// WARD
// =====================================================
//
// POST
// /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards
//
// GET
// /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards
//
// GET
// /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/:wardId
//
// PATCH
// /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/:wardId
//
// DELETE
// /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/:wardId
//
// =====================================================

app.use(
  "/api/master-citizen",
  masterCitizenWardRoutes
);


// =====================================================
// MASTER CITIZEN SYNC
// =====================================================
//
// FULL SYNC
//
// POST
// /api/master-citizen/sync
//
//
//
// WARD-WISE SYNC
//
// POST
// /api/master-citizen/sync/ward/:wardNo
//
// IMPORTANT:
//
// The Ward-wise endpoint uses the actual Ward Number,
// NOT the internal ward_id.
//
// Example:
//
// POST
// /api/master-citizen/sync/ward/174
//
// =====================================================

app.use(
  "/api/master-citizen",
  masterCitizenSyncRoutes
);


// =====================================================
// START MASTER CITIZEN BACKGROUND JOB
// =====================================================
//
// Schedule:
//
// Every Sunday
// 02:00 AM
// Asia/Kolkata (IST)
//
// =====================================================

startMasterCitizenWeeklySync();


// =====================================================
// START OLD CITIZEN HISTORICAL AUTOMATIC SCHEDULER
// =====================================================
//
// TEMPORARY.
//
// Schedule:
//
// Every day
// 00:05 AM
//
// It processes the PREVIOUS DAY.
//
// Example:
//
// August 10 at 00:05
//        ↓
// Process August 9
//
// IMPORTANT:
//
// This is the OLD historical processing system.
//
// Do NOT remove until the new historical database
// scheduler is implemented and tested.
//
// =====================================================

citizenHistoricalScheduler.start();


// =====================================================
// EXPORT
// =====================================================

module.exports =
  app;