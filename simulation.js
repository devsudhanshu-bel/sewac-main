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
 * IMPORTANT:
 *   NO SOCKET.IO
 *
 * Flow:
 *
 * Simulation
 *     ↓
 * HTTP POST
 *     ↓
 * SEWAC Backend
 *     ↓
 * Existing telemetry processing
 *
 * ============================================================
 */

const http = require("http");
const https = require("https");

// ============================================================
// CONFIGURATION
// ============================================================
//
// PUT YOUR EXISTING TELEMETRY HTTP ENDPOINT HERE.
//
// Example:
// http://localhost:5002/api/telemetry
//
// Do NOT put a Socket.IO URL here.
//

const TELEMETRY_URL =
  process.env.TELEMETRY_URL ||
  "http://localhost:5002/api/telemetry";

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
// STARTUP INFORMATION
// ============================================================

console.log("");

console.log(
  "============================================================"
);

console.log(
  "🚛 SEWAC VEHICLE SIMULATION"
);

console.log(
  "============================================================"
);

console.log(
  `Ward       : ${WARD_NO} - ${WARD_NAME}`
);

console.log(
  `Vehicles   : ${vehicles.length}`
);

console.log(
  "Vehicles   : KA05AB1237, KA05AB1238"
);

console.log(
  "Duration   : 5 minutes"
);

console.log(
  `Interval   : ${TELEMETRY_INTERVAL_MS / 1000}s`
);

console.log(
  `HTTP API   : ${TELEMETRY_URL}`
);

console.log(
  "Socket.IO  : DISABLED"
);

console.log(
  "============================================================"
);

console.log("");

// ============================================================
// UTILITY
// ============================================================

function random(min, max) {
  return Math.random() *
    (max - min) +
    min;
}

// ============================================================
// INTERPOLATE GPS
// ============================================================

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
// VEHICLE POSITION
// ============================================================

function getVehiclePosition(
  vehicle
) {
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
// HTTP POST
// ============================================================

function postTelemetry(
  telemetry
) {
  return new Promise(
    (resolve, reject) => {

      const url =
        new URL(
          TELEMETRY_URL
        );

      const payload =
        JSON.stringify(
          telemetry
        );

      const isHttps =
        url.protocol ===
        "https:";

      const transport =
        isHttps
          ? https
          : http;

      const request =
        transport.request(
          {
            hostname:
              url.hostname,

            port:
              url.port ||
              (isHttps
                ? 443
                : 80),

            path:
              `${url.pathname}${url.search}`,

            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",

              "Content-Length":
                Buffer.byteLength(
                  payload
                ),
            },
          },

          (response) => {

            let body = "";

            response.on(
              "data",
              (chunk) => {
                body += chunk;
              }
            );

            response.on(
              "end",
              () => {

                if (
                  response.statusCode >= 200 &&
                  response.statusCode < 300
                ) {

                  resolve({
                    status:
                      response.statusCode,

                    body,
                  });

                } else {

                  reject(
                    new Error(
                      `HTTP ${response.statusCode}: ${body}`
                    )
                  );

                }

              }
            );

          }
        );

      request.on(
        "error",
        reject
      );

      request.write(
        payload
      );

      request.end();

    }
  );
}

// ============================================================
// SEND VEHICLE TELEMETRY
// ============================================================

async function sendVehicleTelemetry(
  vehicle
) {

  const position =
    getVehiclePosition(
      vehicle
    );

  const latitude =
    position[0];

  const longitude =
    position[1];

  // ----------------------------------------------------------
  // SIMULATE WASTE COLLECTION
  // ----------------------------------------------------------

  const collected =
    random(
      0.5,
      2.5
    );

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
  // TELEMETRY
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
        vehicle.wasteCollected
          .toFixed(2)
      ),

    status:
      vehicle.status,

    timestamp:
      new Date().toISOString(),

  };

  // ----------------------------------------------------------
  // SEND HTTP REQUEST
  // ----------------------------------------------------------

  try {

    const response =
      await postTelemetry(
        telemetry
      );

    console.log(
      `🚛 ${vehicle.vehicleId} | ` +
      `Ward ${vehicle.wardNo} | ` +
      `Lat ${latitude.toFixed(6)} | ` +
      `Lng ${longitude.toFixed(6)} | ` +
      `Speed ${telemetry.speed} km/h | ` +
      `Waste ${telemetry.wasteCollected} kg | ` +
      `HTTP ${response.status}`
    );

  } catch (error) {

    console.error(
      `❌ ${vehicle.vehicleId} telemetry failed:`,
      error.message
    );

  }
}

// ============================================================
// SIMULATION LOOP
// ============================================================

let simulationInterval = null;

let simulationStartedAt =
  null;

// ============================================================
// START
// ============================================================

async function startSimulation() {

  simulationStartedAt =
    Date.now();

  console.log(
    "🚛 Starting vehicle simulation..."
  );

  console.log("");

  // ----------------------------------------------------------
  // INITIAL TELEMETRY
  // ----------------------------------------------------------

  for (
    const vehicle of vehicles
  ) {

    await sendVehicleTelemetry(
      vehicle
    );

  }

  // ----------------------------------------------------------
  // CONTINUOUS TELEMETRY
  // ----------------------------------------------------------

  simulationInterval =
    setInterval(
      () => {

        vehicles.forEach(
          (vehicle) => {

            sendVehicleTelemetry(
              vehicle
            );

          }
        );

      },
      TELEMETRY_INTERVAL_MS
    );

}

// ============================================================
// STOP
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

  if (
    simulationInterval
  ) {

    clearInterval(
      simulationInterval
    );

    simulationInterval =
      null;

  }

  console.log("");

  console.log(
    "📊 FINAL VEHICLE STATISTICS"
  );

  console.log(
    "------------------------------------------------------------"
  );

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

      console.log(
        `   Route points visited: ${vehicle.routeIndex}`
      );

      console.log("");

    }
  );

  console.log(
    "============================================================"
  );

  console.log(
    "✅ Simulation stopped successfully."
  );

  console.log(
    "============================================================"
  );

  process.exit(0);
}

// ============================================================
// 5-MINUTE TIMER
// ============================================================

setTimeout(
  () => {

    stopSimulation();

  },
  TEST_DURATION_MS
);

// ============================================================
// CTRL + C
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
// ERROR HANDLERS
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

// ============================================================
// START
// ============================================================

startSimulation();