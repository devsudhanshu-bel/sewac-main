const express =
  require("express");

const cors =
  require("cors");


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

const routeMapRoutes =
  require(
    "./routes/routeMap.routes"
  );


// =====================================================
// HISTORICAL DATABASE
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
// MASTER CITIZEN MAP
// =====================================================
//
// IMPORTANT
//
// The actual file is:
//
// src/master_citizen/masterCitizenMap.routes.js
//
// NOT:
//
// src/routes/masterCitizenMap.routes.js
//
// =====================================================

const masterCitizenMapRoutes =
  require(
    "./master_citizen/masterCitizenMap.routes"
  );


// =====================================================
// MASTER CITIZEN BACKGROUND JOB
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

  // ---------------------------------------------------
  // LOCAL DEVELOPMENT
  // ---------------------------------------------------

  "http://localhost:5173",

  "http://localhost:5174",

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

        console.warn(
          "❌ CORS rejected:",
          origin
        );


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
// URL ENCODER
// =====================================================

app.use(
  express.urlencoded({
    extended: true,
  })
);


// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
  "/",
  (
    req,
    res
  ) => {

    return res
      .status(200)
      .json({

        success:
          true,

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
// /api/route-map
//
// Example:
//
// /api/route-map
//   ?date=2026-08-16
//   &wardNo=20
//
// =====================================================

app.use(
  "/api/route-map",
  routeMapRoutes
);


// =====================================================
// HISTORICAL DATABASE API
// =====================================================
//
// Examples:
//
// POST
// /api/historical-database/archive-today
//
// POST
// /api/historical-database/archive
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
// =====================================================

app.use(
  "/api/master-citizen",
  masterCitizenWardRoutes
);


// =====================================================
// CITY OVERVIEW MAP
// =====================================================
//
// THIS IS THE NEW MAP ENDPOINT.
//
// ONE ENDPOINT ONLY.
//
// GET:
//
// /api/master-citizen/map/city/:cityId
//
// Example:
//
// /api/master-citizen/map/city/1
//
// Response:
//
// {
//   success: true,
//   city: {
//     id,
//     cityName,
//     geoBoundary,
//     cityTableName
//   },
//   zoneNames: [],
//   zones: []
// }
//
// =====================================================

app.use(
  "/api/master-citizen",
  masterCitizenMapRoutes
);


// =====================================================
// MASTER CITIZEN SYNC
// =====================================================
//
// POST
// /api/master-citizen/sync
//
// POST
// /api/master-citizen/sync/ward/:wardNo
//
// =====================================================

app.use(
  "/api/master-citizen",
  masterCitizenSyncRoutes
);


// =====================================================
// START MASTER CITIZEN WEEKLY SYNC
// =====================================================

try {

  startMasterCitizenWeeklySync();

  console.log(
    "✅ Master Citizen weekly sync started."
  );

} catch (error) {

  console.error(
    "❌ Failed to start Master Citizen weekly sync:",
    error
  );

}


// =====================================================
// 404 HANDLER
// =====================================================

app.use(
  (
    req,
    res
  ) => {

    return res
      .status(404)
      .json({

        success:
          false,

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
      "================================================"
    );

    console.error(
      "❌ GLOBAL ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================================"
    );


    // -------------------------------------------------
    // CORS ERROR
    // -------------------------------------------------

    if (
      error.message ===
      "Not allowed by CORS"
    ) {

      return res
        .status(403)
        .json({

          success:
            false,

          message:
            "Origin not allowed by CORS.",

        });

    }


    // -------------------------------------------------
    // DEFAULT ERROR
    // -------------------------------------------------

    return res
      .status(
        error.status || 500
      )
      .json({

        success:
          false,

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