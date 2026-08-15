/**
 * ============================================================
 * SEWAC VEHICLE SIMULATION
 * ============================================================
 *
 * TEST:
 *   Ward 216 - Ibbaluru
 *
 * VEHICLES:
 *   KA05AB1237
 *   KA05AB1238
 *
 * DURATION:
 *   5 minutes
 *
 * PURPOSE:
 *   Simulate two waste collection vehicles moving inside
 *   Ward 216 and continuously sending telemetry.
 *
 * ============================================================
 */

const { io } = require("socket.io-client");

// ============================================================
// CONFIGURATION
// ============================================================

// Your SEWAC backend Socket.IO URL
const SOCKET_URL =
  process.env.SOCKET_URL ||
  "http://localhost:5000";

// ------------------------------------------------------------
// SOCKET EVENT
// ------------------------------------------------------------
//
// IMPORTANT:
// Keep this as the event your backend uses for telemetry.
//
// If your backend listens to another event, change this one.
// ------------------------------------------------------------

const SOCKET_EVENT =
  process.env.SOCKET_EVENT ||
  "vehicle-location-update";

// ============================================================
// TEST CONFIGURATION
// ============================================================

// 5 MINUTES
const TEST_DURATION_MS =
  5 * 60 * 1000;

// Send telemetry every 3 seconds
const TELEMETRY_INTERVAL_MS =
  3000;

// ============================================================
// WARD INFORMATION
// ============================================================

const WARD_NO = 216;

const WARD_NAME = "Ibbaluru";

// ============================================================
// WARD 216 BOUNDARY
// ============================================================
//
// IMPORTANT:
//
// Replace these coordinates with the EXACT geo_boundary
// coordinates stored in your Master Citizen DB for Ward 216.
//
// Format:
// [
//   [latitude, longitude],
//   [latitude, longitude],
//   ...
// ]
//
// The example below represents the approximate Ibbaluru area.
// ============================================================

const WARD_BOUNDARY = [
  [12.902313, 77.6548554],
  [12.901759, 77.6547961],
  [12.900800, 77.654500],
  [12.899500, 77.653800],
  [12.898500, 77.653000],
  [12.897800, 77.651800],
  [12.898200, 77.650500],
  [12.899500, 77.649800],
  [12.901000, 77.649500],
  [12.902500, 77.650000],
  [12.903500, 77.651500],
  [12.904000, 77.653000],
  [12.903500, 77.654200],
  [12.902313, 77.6548554],
];

// ============================================================
// VEHICLES
// ============================================================
//
// Each vehicle has its own route.
//
// The routes should remain inside Ward 216.
//
// You can add more vehicles later.
// ============================================================

const vehicles = [
  {
    vehicleId: "KA05AB1237",

    vehicleName: "KA05AB1237",

    wardNo: 216,

    wardName: "Ibbaluru",

    routeIndex: 0,

    wasteCollected: 0,

    status: "COLLECTING",

    speed: 18,

    route: [
      [12.902313, 77.654855],
      [12.901759, 77.654796],
      [12.900800, 77.654500],
      [12.899900, 77.653900],
      [12.899200, 77.653200],
      [12.898500, 77.652500],
      [12.898200, 77.651700],
      [12.898800, 77.650800],
      [12.899700, 77.650200],
      [12.900800, 77.650000],
      [12.901800, 77.650400],
      [12.902500, 77.651200],
      [12.903000, 77.652300],
      [12.903500, 77.653400],
      [12.902313, 77.654855],
    ],
  },

  {
    vehicleId: "KA05AB1238",

    vehicleName: "KA05AB1238",

    wardNo: 216,

    wardName: "Ibbaluru",

    routeIndex: 0,

    wasteCollected: 0,

    status: "COLLECTING",

    speed: 15,

    route: [
      [12.901000, 77.649800],
      [12.900200, 77.650500],
      [12.899600, 77.651300],
      [12.899000, 77.652200],
      [12.899500, 77.653100],
      [12.900300, 77.653700],
      [12.901200, 77.654100],
      [12.902000, 77.653800],
      [12.902800, 77.653200],
      [12.903200, 77.652400],
      [12.902700, 77.651500],
      [12.901900, 77.650700],
      [12.901000, 77.649800],
    ],
  },
];

// ============================================================
// SOCKET CONNECTION
// ============================================================

console.log("");
console.log("============================================================");
console.log("🚛 SEWAC VEHICLE SIMULATION");
console.log("============================================================");
console.log(`Ward       : ${WARD_NO} - ${WARD_NAME}`);
console.log(`Vehicles   : ${vehicles.length}`);
console.log(`Duration   : 5 minutes`);
console.log(`Interval   : ${TELEMETRY_INTERVAL_MS / 1000}s`);
console.log(`Socket     : ${SOCKET_URL}`);
console.log(`Event      : ${SOCKET_EVENT}`);
console.log("============================================================");
console.log("");

const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
});

// ============================================================
// CONNECTION EVENTS
// ============================================================

socket.on("connect", () => {
  console.log(
    `✅ Socket connected: ${socket.id}`
  );

  console.log("");
  console.log(
    "🚛 Starting vehicle simulation..."
  );
  console.log("");
});

socket.on("connect_error", (error) => {
  console.error(
    "❌ Socket connection error:",
    error.message
  );
});

socket.on("disconnect", (reason) => {
  console.log(
    `⚠️ Socket disconnected: ${reason}`
  );
});

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function random(min, max) {
  return Math.random() * (max - min) + min;
}

// ------------------------------------------------------------
// INTERPOLATE BETWEEN TWO GPS POINTS
// ------------------------------------------------------------

function interpolate(
  start,
  end,
  progress
) {
  const latitude =
    start[0] +
    (end[0] - start[0]) *
      progress;

  const longitude =
    start[1] +
    (end[1] - start[1]) *
      progress;

  return [
    latitude,
    longitude,
  ];
}

// ============================================================
// VEHICLE STATE
// ============================================================

function getVehiclePosition(vehicle) {
  const route =
    vehicle.route;

  const currentIndex =
    vehicle.routeIndex;

  const nextIndex =
    (currentIndex + 1) %
    route.length;

  const currentPoint =
    route[currentIndex];

  const nextPoint =
    route[nextIndex];

  return interpolate(
    currentPoint,
    nextPoint,
    0.35
  );
}

// ============================================================
// SEND TELEMETRY
// ============================================================

function sendVehicleTelemetry(
  vehicle
) {
  const position =
    getVehiclePosition(vehicle);

  const latitude =
    position[0];

  const longitude =
    position[1];

  // ----------------------------------------------------------
  // SIMULATE WASTE COLLECTION
  // ----------------------------------------------------------

  const collected =
    random(0.5, 2.5);

  vehicle.wasteCollected +=
    collected;

  // ----------------------------------------------------------
  // MOVE TO NEXT ROUTE POINT
  // ----------------------------------------------------------

  vehicle.routeIndex++;

  if (
    vehicle.routeIndex >=
    vehicle.route.length
  ) {
    vehicle.routeIndex = 0;
  }

  // ----------------------------------------------------------
  // TELEMETRY PAYLOAD
  // ----------------------------------------------------------

  const telemetry = {
    vehicleId:
      vehicle.vehicleId,

    vehicleName:
      vehicle.vehicleName,

    wardNo:
      vehicle.wardNo,

    wardName:
      vehicle.wardName,

    latitude,

    longitude,

    speed:
      Number(
        random(
          vehicle.speed - 3,
          vehicle.speed + 3
        ).toFixed(2)
      ),

    wasteCollected:
      Number(
        vehicle.wasteCollected.toFixed(2)
      ),

    status:
      vehicle.status,

    timestamp:
      new Date().toISOString(),
  };

  // ----------------------------------------------------------
  // SEND TO BACKEND
  // ----------------------------------------------------------

  socket.emit(
    SOCKET_EVENT,
    telemetry
  );

  // ----------------------------------------------------------
  // LOG
  // ----------------------------------------------------------

  console.log(
    `🚛 ${vehicle.vehicleId} | ` +
    `Ward ${vehicle.wardNo} | ` +
    `Lat ${latitude.toFixed(6)} | ` +
    `Lng ${longitude.toFixed(6)} | ` +
    `Speed ${telemetry.speed} km/h | ` +
    `Waste ${telemetry.wasteCollected} kg`
  );
}

// ============================================================
// SIMULATION LOOP
// ============================================================

let simulationInterval = null;

function startSimulation() {
  // ----------------------------------------------------------
  // SEND INITIAL LOCATION
  // ----------------------------------------------------------

  vehicles.forEach(
    (vehicle) => {
      sendVehicleTelemetry(
        vehicle
      );
    }
  );

  // ----------------------------------------------------------
  // CONTINUOUS TELEMETRY
  // ----------------------------------------------------------

  simulationInterval =
    setInterval(() => {
      vehicles.forEach(
        (vehicle) => {
          sendVehicleTelemetry(
            vehicle
          );
        }
      );
    }, TELEMETRY_INTERVAL_MS);
}

// ============================================================
// STOP SIMULATION
// ============================================================

function stopSimulation() {
  console.log("");
  console.log(
    "============================================================"
  );

  console.log(
    "🛑 5-MINUTE SIMULATION COMPLETED"
  );

  console.log(
    "============================================================"
  );

  if (simulationInterval) {
    clearInterval(
      simulationInterval
    );

    simulationInterval = null;
  }

  // ----------------------------------------------------------
  // FINAL VEHICLE STATISTICS
  // ----------------------------------------------------------

  vehicles.forEach(
    (vehicle) => {
      console.log(
        `🚛 ${vehicle.vehicleId}`
      );

      console.log(
        `   Ward: ${vehicle.wardNo} - ${vehicle.wardName}`
      );

      console.log(
        `   Waste collected: ${vehicle.wasteCollected.toFixed(
          2
        )} kg`
      );
    }
  );

  console.log(
    "============================================================"
  );

  console.log(
    "🔌 Closing socket..."
  );

  socket.disconnect();

  process.exit(0);
}

// ============================================================
// START AFTER SOCKET CONNECTION
// ============================================================

socket.on("connect", () => {
  if (!simulationInterval) {
    startSimulation();
  }
});

// ============================================================
// 5-MINUTE TIMER
// ============================================================

setTimeout(() => {
  stopSimulation();
}, TEST_DURATION_MS);

// ============================================================
// CTRL+C HANDLER
// ============================================================

process.on(
  "SIGINT",
  () => {
    console.log("");
    console.log(
      "⚠️ Simulation manually stopped."
    );

    stopSimulation();
  }
);

// ============================================================
// ERROR HANDLER
// ============================================================

process.on(
  "uncaughtException",
  (error) => {
    console.error(
      "❌ Simulation error:",
      error
    );
  }
);

process.on(
  "unhandledRejection",
  (error) => {
    console.error(
      "❌ Unhandled simulation error:",
      error
    );
  }
);