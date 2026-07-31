import dotenv from "dotenv";

dotenv.config();

import http from "http";

import app from "./app.js";

import helperPrisma from "./config/helperPrisma.js";

import { connectRedis } from "./modules/redis/redis.client.js";

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
    // REDIS CONNECTION
    // =================================

    await connectRedis();

    console.log(
      "🔴 Redis Connected Successfully"
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

    await mapService.initializeCache();

    console.log(
      "✅ Map Cache Initialized"
    );





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
🔴 Redis       : Connected
🗺️ Map Cache   : Ready
📡 Worker      : Running

📦 Environment : ${process.env.NODE_ENV || "development"}
==========================================

        `);



        // Start telemetry sync worker
        mapWorker.start();


      }
    );



  } catch(error) {


    console.error(
      "❌ Failed to start server"
    );


    console.error(error);


    process.exit(1);


  }

}




startServer();