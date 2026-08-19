const express =
  require("express");

const cors =
  require("cors");

const compression =
  require("compression");


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
// COMPLAINT GRIEVANCE MAP
// =====================================================
//
// Actual location:
//
// src/complaintsGrev/
//
// Files:
//
// complaintsGrev.controller.js
// complaintsGrev.routes.js
// complaintsGrev.service.js
//
// Endpoint:
//
// GET /api/complaints-grev/locations
//
// =====================================================

const complaintsGrevRoutes =
  require(
    "./complaintsGrev/routes/complaintsGrev.routes"
  );


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
// Actual location:
//
// src/master_citizen/masterCitizenMap.routes.js
//
// =====================================================

const masterCitizenMapRoutes =
  require(
    "./master_citizen/masterCitizenMap.routes"
  );


// =====================================================
// COLLECTION POINT MONITORING
// =====================================================
//
// Actual location:
//
// src/wasteGen/
//
// Files:
//
// collectionPointMonitoring.controller.js
// collectionPointMonitoring.routes.js
// collectionPointMonitoring.service.js
//
// =====================================================

const collectionPointMonitoringRoutes =
  require(
    "./wasteGen/collectionPointMonitoring.routes"
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
// RESPONSE COMPRESSION
// =====================================================
//
// IMPORTANT FOR CITY MAP
//
// The City Map endpoint can return several MB of JSON
// because it contains:
//
// City boundary
//      ↓
// Zone boundaries
//      ↓
// Division boundaries
//      ↓
// Ward boundaries
//
// Compression allows Express to send the response using:
//
// Brotli
// or
// GZIP
//
// WITHOUT changing the JSON structure.
//
// The browser automatically decompresses it.
//
// =====================================================

app.use(
  compression({

    /**
     * Compression level.
     *
     * 6 gives a good balance between:
     *
     * CPU usage
     * +
     * compression ratio
     *
     */

    level:
      6,


    /**
     * Only compress responses larger than 1 KB.
     *
     * Small API responses do not need compression.
     */

    threshold:
      1024,


    /**
     * Let the compression middleware choose
     * Brotli/GZIP depending on what the client supports.
     *
     * This is especially useful for the map endpoint.
     *
     */

  })
);


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
// COMPLAINT GRIEVANCE MAP API
// =====================================================
//
// GET:
//
// /api/complaints-grev/locations
//
//
//
// RESPONSE:
//
// {
//   success: true,
//   count: 3,
//   data: [
//     {
//       lat: 12.9716,
//       long: 77.5946,
//       data: {
//         id: 1,
//         ticket_number: "...",
//         phone_number: "...",
//         title: "...",
//         description: "...",
//         category: "...",
//         image_url: "...",
//         address: "...",
//         status: "..."
//       }
//     }
//   ]
// }
//
// =====================================================

app.use(
  "/api/complaints-grev",
  complaintsGrevRoutes
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
// COLLECTION POINT MONITORING API
// =====================================================
//
// GET:
//
// /api/collection-point-monitoring
//
// Example:
//
// /api/collection-point-monitoring
//   ?wardNo=216
//   &date=2026-08-18
//
// FLOW:
//
// Header Ward
//      ↓
// wardNo = 216
//      ↓
// day_18082026
//      ↓
// vehicles where ward_no = 216
//      ↓
// vehicle_table_name
//      ↓
// latitude + longitude + complete telemetry
//
// =====================================================

app.use(
  "/api/collection-point-monitoring",
  collectionPointMonitoringRoutes
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
// ONE COMPLETE MAP ENDPOINT
//
// GET:
//
// /api/master-citizen/map/city/:cityId
//
// Example:
//
// /api/master-citizen/map/city/1
//
//
//
// DATA HIERARCHY:
//
// City
//   ↓
// City Boundary
//   ↓
// Zones
//   ↓
// Zone Boundaries
//   ↓
// Divisions
//   ↓
// Division Boundaries
//   ↓
// Wards
//   ↓
// Ward Boundaries
//
//
//
// IMPORTANT:
//
// No citizen records.
// No citizen counts.
// No citizen joins.
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