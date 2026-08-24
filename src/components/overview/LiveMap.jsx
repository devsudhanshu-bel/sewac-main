require("./config/loadEnv");

const http = require("http");

const { Server } = require("socket.io");

const { initRedis } = require("./config/redis");

const initializeTelemetryDB = require("./telemetry/initialize/initializeTelemetryDB");

const app = require("./app");

const { loadCitizenCache } = require("./config/citizenCache");

// ============================================================
// HISTORICAL DATABASE SCHEDULER
// ============================================================

const historicalScheduler = require("./schedulers/historicalDatabase.scheduler");

console.log("🔥 HISTORICAL ARCHIVE SCHEDULER MODULE LOADED");

// ============================================================
// PORT
// ============================================================

const PORT = process.env.PORT || 5003;

// ============================================================
// SOCKET.IO CORS
// ============================================================

const allowedOrigins = [
  "https://app-authentication-frontend.onrender.com",

  "https://sewac-main-frontend.onrender.com",

  "http://localhost:5173",

  "http://localhost:5174",
];

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

    require("./services/telemetryQueueService");

    // ========================================================
    // HTTP SERVER
    // ========================================================

    const httpServer = http.createServer(app);

    // ========================================================
    // SOCKET.IO
    // ========================================================

    const io = new Server(httpServer, {
      cors: {
        origin: function (origin, callback) {
          // Requests without Origin
          // Postman / server-to-server etc.

          if (!origin) {
            return callback(null, true);
          }

          if (allowedOrigins.includes(origin)) {
            return callback(null, true);
          }

          console.warn("❌ Socket.IO CORS rejected:", origin);

          return callback(new Error("Socket.IO CORS origin not allowed"));
        },

        credentials: true,

        methods: ["GET", "POST"],
      },

      transports: ["websocket", "polling"],
    });

    // ========================================================
    // MAKE SOCKET.IO AVAILABLE TO EXPRESS REQUESTS
    // ========================================================

    app.set("io", io);

    // ========================================================
    // SOCKET CONNECTION
    // ========================================================

    io.on("connection", (socket) => {
      console.log(`🔌 Live Maps client connected: ${socket.id}`);

      // ------------------------------------------------------
      // OPTIONAL FILTER ROOM
      // ------------------------------------------------------

      socket.on("live:subscribe", (filters = {}) => {
        const room = buildLiveRoom(filters);

        socket.join(room);

        console.log(`📍 ${socket.id} subscribed to ${room}`);
      });

      // ------------------------------------------------------
      // DISCONNECT
      // ------------------------------------------------------

      socket.on("disconnect", (reason) => {
        console.log(`🔌 Live Maps client disconnected: ${socket.id}`, reason);
      });
    });

    // ========================================================
    // START HTTP + SOCKET SERVER
    // ========================================================

    httpServer.listen(PORT, () => {
      console.log("");

      console.log("=================================================");

      console.log("🚀 SEWAC BACKEND STARTED");

      console.log("=================================================");

      console.log(`Server running on port ${PORT}`);

      console.log("📡 Socket.IO live vehicle tracking enabled");

      console.log("=================================================");
    });

    // ========================================================
    // HISTORICAL ARCHIVE SCHEDULER
    // ========================================================

    console.log("");

    console.log("📅 Starting Historical Archive Scheduler...");

    historicalScheduler.start();
  } catch (err) {
    console.error("");

    console.error("❌ SEWAC BACKEND STARTUP FAILED");

    console.error(err);

    process.exit(1);
  }
})();

// ============================================================
// LIVE ROOM HELPER
// ============================================================

function buildLiveRoom(filters = {}) {
  const cityId = filters.cityId ?? "all";

  const zoneId = filters.zoneId ?? "all";

  const divisionId = filters.divisionId ?? "all";

  const wardId = filters.wardId ?? "all";

  return `live:${cityId}:${zoneId}:${divisionId}:${wardId}`;
}
