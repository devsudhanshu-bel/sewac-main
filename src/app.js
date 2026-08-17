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
// ROUTE MAP
// =====================================================
//
// Reads:
//
// Header date
// Header ward number
//
// Then:
//
// master_telemetry_db
//       ↓
// selected date day table
//       ↓
// selected ward
//       ↓
// vehicles
//       ↓
// individual vehicle tables
//       ↓
// latitude / longitude + complete telemetry rows
//
// =====================================================

const routeMapRoutes =
  require("./routes/routeMap.routes");


// =====================================================
// HISTORICAL DATABASE ROUTES
// =====================================================

const historicalDatabaseRoutes =
  require(
    "./routes/historicalDatabase.routes"
  );


// =====================================================
// HISTORICAL DATABASE SCHEDULER
// =====================================================
//
// Automatically archives TODAY'S telemetry every day
// at 02:00 PM IST.
//
// IMPORTANT:
//
// The scheduler uses the existing
// historicalDatabase.controller.js archive logic.
//
// It does NOT contain its own database logic.
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
        // Requests without Origin
        //
        // Postman
        // Thunder Client
        // Server-to-server
        // etc.
        // -------------------------------------------------

        if (!origin) {

          return callback(
            null,
            true
          );

        }


        // -------------------------------------------------
        // Allowed frontends
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

  })
);


// =====================================================
// BODY PARSER
// =====================================================

app.use(
  express.json()
);


// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
  "/",
  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "SEWAC backend is running.",

    });

  }
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
// ROUTE MAP API
// =====================================================
//
// GET:
//
// /api/route-map?date=2026-08-16&wardNo=20
//
// Example:
//
// /api/route-map
//     ?date=2026-08-16
//     &wardNo=20
//
// The route-map service will:
//
// 1. Read the selected date.
// 2. Read the selected ward number.
// 3. Locate that day's telemetry table.
// 4. Find vehicles belonging to that ward.
// 5. Open each vehicle's telemetry table.
// 6. Read ALL telemetry records.
// 7. Order them by timestamp.
// 8. Return every latitude/longitude.
// 9. Return the complete telemetry information
//    required by the frontend hover popup.
//
// =====================================================

app.use(
  "/api/route-map",
  routeMapRoutes
);


// =====================================================
// HISTORICAL DATABASE
// =====================================================
//
// POST
// /api/historical-database/archive-today
//
// Archives today's daily telemetry.
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
//
// GET
// /api/historical-database/test-connections
//
// =====================================================

app.use(
  "/api/historical-database",
  historicalDatabaseRoutes
);


// =====================================================
// MASTER CITIZEN
// =====================================================


// =====================================================
// CITY
// =====================================================

app.use(
  "/api/master-citizen",
  masterCitizenCityRoutes
);


// =====================================================
// ZONE
// =====================================================

app.use(
  "/api/master-citizen",
  masterCitizenZoneRoutes
);


// =====================================================
// DIVISION
// =====================================================

app.use(
  "/api/master-citizen",
  masterCitizenDivisionRoutes
);


// =====================================================
// WARD
// =====================================================

app.use(
  "/api/master-citizen",
  masterCitizenWardRoutes
);


// =====================================================
// MASTER CITIZEN SYNC
// =====================================================

app.use(
  "/api/master-citizen",
  masterCitizenSyncRoutes
);


// =====================================================
// START MASTER CITIZEN WEEKLY SYNC
// =====================================================
//
// Sunday
// 02:00 AM
// Asia/Kolkata
//
// =====================================================

startMasterCitizenWeeklySync();


// =====================================================
// START HISTORICAL DATABASE SCHEDULER
// =====================================================
//
// Every day:
//
// 02:00 PM IST
//
// The scheduler archives:
//
// TODAY
//
// Example:
//
// 15 August 2026
//       ↓
// 14:00 IST
//       ↓
// day_15082026
//       ↓
// vehicle_table_name
//       ↓
// actual vehicle table
//       ↓
// telemetry records
//       ↓
// ward monthly historical table
//
// =====================================================

console.log("");
console.log(
  "============================================================"
);
console.log(
  "🚛 SEWAC HISTORICAL ARCHIVE SCHEDULER"
);
console.log(
  "============================================================"
);
console.log(
  "Status: STARTING"
);
console.log(
  "Schedule: Every day at 02:00 PM IST"
);
console.log(
  "Archive target: TODAY"
);
console.log(
  "============================================================"
);

citizenHistoricalScheduler.start();

console.log(
  "✅ Historical archive scheduler started successfully."
);

console.log(
  "============================================================"
);
console.log("");


// =====================================================
// 404 HANDLER
// =====================================================

app.use(
  (req, res) => {

    res.status(404).json({

      success: false,

      message:
        "API endpoint not found.",

      path:
        req.originalUrl,

    });

  }
);


// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    console.error(
      "❌ GLOBAL ERROR:",
      error
    );


    // ---------------------------------------------------
    // CORS ERROR
    // ---------------------------------------------------

    if (
      error.message ===
      "Not allowed by CORS"
    ) {

      return res.status(403).json({

        success: false,

        message:
          "Origin not allowed by CORS.",

      });

    }


    // ---------------------------------------------------
    // DEFAULT ERROR
    // ---------------------------------------------------

    return res.status(
      error.status || 500
    ).json({

      success: false,

      message:
        error.message ||
        "Internal server error.",

    });

  }
);


// =====================================================
// EXPORT
// =====================================================

module.exports =
  app;