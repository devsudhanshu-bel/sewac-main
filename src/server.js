import dotenv from "dotenv";

dotenv.config();

import http from "http";

import app from "./app.js";

import helperPrisma from "./config/helperPrisma.js";

import { initializeMapSocket } from "./modules/map/map.socket.js";
import mapService from "./modules/map/map.service.js";
import mapWorker from "./modules/map/map.worker.js";

const PORT = process.env.PORT || 5002;

const server = http.createServer(app);

async function startServer() {
  try {
    // Test Helper Database Connection
    await helperPrisma.$connect();
    console.log("✅ Connected to Helper Database");

    // Initialize Socket.IO
    initializeMapSocket(server);
    console.log("✅ Socket.IO Initialized");

    // Initialize the in-memory map cache
    await mapService.initializeCache();

    // Start the live map worker
    mapWorker.start();

    // Start HTTP Server
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`
==========================================
🚀 SEWAC Citizen Backend Started
🌐 Server      : http://localhost:${PORT}
🔌 Socket.IO   : Enabled
🗺️ Map Cache   : Initialized
🚛 Map Worker  : Running (Every 2 Seconds)
📦 Environment : ${process.env.NODE_ENV || "development"}
==========================================
      `);
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);
    process.exit(1);
  }
}

startServer();