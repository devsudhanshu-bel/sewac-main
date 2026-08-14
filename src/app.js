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
// HISTORICAL DATABASE
// =====================================================
//
// NEW HISTORICAL DATABASE PIPELINE
//
// Source:
// master_telemetry_db
//
// Daily tables:
//
// day_DDMMYYYY
//
// Example:
//
// day_14082026
//
// Historical tables:
//
// ward_174_2026
// ward_174_082026
//
// =====================================================

const historicalDatabaseRoutes =
  require(
    "./routes/historicalDatabase.routes"
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
// HISTORICAL DATABASE
// =====================================================
//
// NEW PIPELINE
//
// POST
// /api/historical-database/archive-today
//
// Archives today's daily table.
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