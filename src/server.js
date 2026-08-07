require("./config/loadEnv");
const { initRedis } = require("./config/redis");
const initializeTelemetryDB = require("./telemetry/initialize/initializeTelemetryDB");
const app = require("./app");
const { loadCitizenCache } = require("./config/citizenCache");

const PORT = process.env.PORT || 5002;

(async () => {
  try {

    await initRedis();

    await initializeTelemetryDB.initialize();   // ⭐ NEW

    await loadCitizenCache();

    require("./services/telemetryQueueService");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error(err);
    process.exit(1); // ⭐ Don't continue if startup fails
  }
})();