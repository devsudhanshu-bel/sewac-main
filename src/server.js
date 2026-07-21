require("./config/loadEnv");
const { initRedis } = require("./config/redis");

const app = require("./app");
const { loadCitizenCache } = require("./config/citizenCache");

const PORT = process.env.PORT || 5002;

(async () => {
  try {
await initRedis();
await loadCitizenCache();
    // Start the worker ONLY AFTER cache is loaded
    require("./services/telemetryQueueService");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error(err);
  }
})();