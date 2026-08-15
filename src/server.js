require("./config/loadEnv");

const { initRedis } =
  require("./config/redis");

const initializeTelemetryDB =
  require("./telemetry/initialize/initializeTelemetryDB");

const app =
  require("./app");

const { loadCitizenCache } =
  require("./config/citizenCache");


// ============================================================
// HISTORICAL DATABASE SCHEDULER
// ============================================================

const historicalScheduler =
  require("./schedulers/historicalDatabase.scheduler");

console.log(
  "🔥 HISTORICAL ARCHIVE SCHEDULER MODULE LOADED"
);


// ============================================================
// PORT
// ============================================================

const PORT =
  process.env.PORT || 5003;


// ============================================================
// SERVER STARTUP
// ============================================================

(async () => {

  try {

    // ========================================================
    // REDIS
    // ========================================================

    await initRedis();


    // ========================================================
    // TELEMETRY DATABASE
    // ========================================================

    await initializeTelemetryDB.initialize();


    // ========================================================
    // CITIZEN CACHE
    // ========================================================

    await loadCitizenCache();


    // ========================================================
    // TELEMETRY QUEUE
    // ========================================================

    require(
      "./services/telemetryQueueService"
    );


    // ========================================================
    // START HTTP SERVER
    // ========================================================

    app.listen(
      PORT,
      () => {

        console.log("");

        console.log(
          "================================================="
        );

        console.log(
          "🚀 SEWAC BACKEND STARTED"
        );

        console.log(
          "================================================="
        );

        console.log(
          `Server running on port ${PORT}`
        );

        console.log(
          "================================================="
        );

      }
    );


    // ========================================================
    // START HISTORICAL ARCHIVE SCHEDULER
    // ========================================================

    console.log("");

    console.log(
      "📅 Starting Historical Archive Scheduler..."
    );


    historicalScheduler.start();


  } catch (err) {

    console.error("");

    console.error(
      "❌ SEWAC BACKEND STARTUP FAILED"
    );

    console.error(err);

    process.exit(1);

  }

})();