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

    // =================================
    // DATABASE CONNECTION
    // =================================

    await helperPrisma.$connect();

    console.log(
      "✅ Connected to Helper Database"
    );


    // =================================
    // REDIS DISABLED FOR NOW
    // =================================

    console.log(
      "⚠️ Redis Disabled - Running without Redis"
    );


    // =================================
    // SOCKET.IO INITIALIZATION
    // =================================

    initializeMapSocket(server);

    console.log(
      "✅ Socket.IO Initialized"
    );


    // =================================
    // MAP CACHE INITIALIZATION
    // =================================

    try {

      await mapService.initializeCache();

      console.log(
        "✅ Map Cache Initialized"
      );

    } catch (error) {

      console.warn(
        "⚠️ Map Cache Initialization Skipped:",
        error.message
      );

    }


    // =================================
    // START SERVER
    // =================================

    server.listen(
      PORT,
      "0.0.0.0",
      () => {

        console.log(`

==========================================
🚀 SEWAC Citizen Backend Started

🌐 Server      : http://localhost:${PORT}
🔌 Socket.IO   : Enabled
🔴 Redis       : Disabled
🗺️ Map Cache   : Initialized
📡 Worker      : Starting

📦 Environment : ${process.env.NODE_ENV || "development"}
==========================================

        `);


        // =================================
        // START TELEMETRY WORKER
        // =================================

        try {

          mapWorker.start();

          console.log(
            "✅ Telemetry Worker Started"
          );

        } catch (error) {

          console.warn(
            "⚠️ Telemetry Worker Failed:",
            error.message
          );

        }

      }
    );


  } catch (error) {

    console.error(
      "❌ Failed to start server"
    );

    console.error(error);

    process.exit(1);

  }

}


startServer();