const { randomInt } = require("crypto");

// ============================================================
// SEWAC VEHICLE SIMULATION
// ============================================================
//
// TEST:
//   Ward 216 - Ibbaluru
//
// VEHICLES:
//   KA05AB1237
//   KA05AB1238
//
// DURATION:
//   5 minutes
//
// IMPORTANT
//   Existing telemetry simulation logic is preserved.
//
//   EXISTING TELEMETRY:
//   GET /api/iot/telemetry/record
//
//   NEW HEARTBEAT:
//   POST /api/iot/heartbeat
//
//   Heartbeat is sent once every 15 seconds.
//
//   NO Socket.IO.
//
// ============================================================


// ============================================================
// API
// ============================================================

// EXISTING TELEMETRY API
const API_URL =
  "https://sewac-main.onrender.com/api/iot/telemetry/record";

// NEW HEARTBEAT API
//
// If your backend heartbeat route has a different URL,
// CHANGE ONLY THIS CONSTANT.
//
const HEARTBEAT_API_URL =
  "https://sewac-main.onrender.com/api/iot/heartbeat";


// ============================================================
// SIMULATION CONFIGURATION
// ============================================================

const SIMULATION_DURATION_MS = 5 * 60 * 1000;

const MIN_DELAY_SECONDS = 0.1;
const MAX_DELAY_SECONDS = 0.3;


// ============================================================
// HEARTBEAT CONFIGURATION
// ============================================================
//
// Heartbeat is completely independent from telemetry.
//
// Telemetry:
//     0.1 - 0.3 seconds
//
// Heartbeat:
//     EXACTLY every 15 seconds
//
// ============================================================

const HEARTBEAT_INTERVAL_MS = 15 * 1000;


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
  [12.9008, 77.6545],
  [12.8995, 77.6538],
  [12.8985, 77.653],
  [12.8978, 77.6518],
  [12.8982, 77.6505],
  [12.8995, 77.6498],
  [12.901, 77.6495],
  [12.9025, 77.65],
  [12.9035, 77.6515],
  [12.904, 77.653],
  [12.9035, 77.6542],
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

    driverName: "Ramesh",

    unitNumber: "SEWAC_01_UHF",

    firmwareVersion: "v0.1.0",

    // Replace with a real registered RFID if RFID
    // validation is enabled in the backend.
    rfidNumber: "E20047059AE0602601E8010D",

    route: [
      [12.902313, 77.654855],
      [12.901759, 77.654796],
      [12.9008, 77.6545],
      [12.8999, 77.6539],
      [12.8992, 77.6532],
      [12.8985, 77.6525],
      [12.8982, 77.6517],
      [12.8988, 77.6508],
      [12.8997, 77.6502],
      [12.9008, 77.65],
      [12.9018, 77.6504],
      [12.9025, 77.6512],
      [12.903, 77.6523],
      [12.9035, 77.6534],
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

    driverName: "Suresh",

    unitNumber: "SEWAC_01_UHF",

    firmwareVersion: "v0.1.0",

    // Replace with a real registered RFID if RFID
    // validation is enabled in the backend.
    rfidNumber: "E20047058C20602600FC010F",

    route: [
      [12.901, 77.6498],
      [12.9002, 77.6505],
      [12.8996, 77.6513],
      [12.899, 77.6522],
      [12.8995, 77.6531],
      [12.9003, 77.6537],
      [12.9012, 77.6541],
      [12.902, 77.6538],
      [12.9028, 77.6532],
      [12.9032, 77.6524],
      [12.9027, 77.6515],
      [12.9019, 77.6507],
      [12.901, 77.6498],
    ],
  },
];


// ============================================================
// STATISTICS
// ============================================================

const statistics = {
  startedAt: null,
  finishedAt: null,

  // EXISTING TELEMETRY STATISTICS
  totalPackets: 0,
  successfulPackets: 0,
  failedPackets: 0,

  // NEW HEARTBEAT STATISTICS
  totalHeartbeats: 0,
  successfulHeartbeats: 0,
  failedHeartbeats: 0,

  vehicles: {},
};


// ============================================================
// VEHICLE STATISTICS
// ============================================================

for (const vehicle of vehicles) {
  statistics.vehicles[vehicle.vehicleId] = {
    // EXISTING TELEMETRY STATS
    packetsSent: 0,
    packetsSuccessful: 0,
    packetsFailed: 0,

    lastRFID: null,

    lastLatitude: null,
    lastLongitude: null,

    firstPacketAt: null,
    lastPacketAt: null,

    // NEW HEARTBEAT STATS
    heartbeatsSent: 0,
    heartbeatsSuccessful: 0,
    heartbeatsFailed: 0,

    lastHeartbeatAt: null,
  };
}


// ============================================================
// RANDOM HELPERS
// ============================================================

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randomDelay(minSeconds, maxSeconds) {
  return Math.round(
    randomFloat(
      minSeconds,
      maxSeconds,
    ) * 1000,
  );
}


// ============================================================
// INTERPOLATE GPS
// ============================================================

function interpolate(start, end, progress) {
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
//
// IMPORTANT:
//
// This is the SAME position calculation used by the
// existing telemetry simulation.
//
// Heartbeat uses the SAME current simulated position.
//
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
    0.35,
  );
}


// ============================================================
// CREATE TELEMETRY PACKET
// ============================================================
//
// EXISTING TELEMETRY LOGIC - PRESERVED.
//
// EXACT TELEMETRY CONTRACT:
//
// rfidNumber
// iotTimestamp
// driverName
// vehicleId
// latitude
// longitude
// weight
// firmwareVersion
// unitNumber
// remarks
// errCode
//
// ============================================================

function createPacket(vehicle) {
  const position =
    getVehiclePosition(
      vehicle,
    );

  const latitudeNoise =
    randomFloat(
      -0.000005,
      0.000005,
    );

  const longitudeNoise =
    randomFloat(
      -0.000005,
      0.000005,
    );

  const latitude =
    Number(
      (
        position[0] +
        latitudeNoise
      ).toFixed(7),
    );

  const longitude =
    Number(
      (
        position[1] +
        longitudeNoise
      ).toFixed(7),
    );

  const weight =
    Number(
      randomFloat(
        0.5,
        12,
      ).toFixed(2),
    );

  return {
    rfidNumber:
      vehicle.rfidNumber,

    iotTimestamp:
      new Date().toISOString(),

    driverName:
      vehicle.driverName,

    vehicleId:
      vehicle.vehicleId,

    latitude,

    longitude,

    weight,

    firmwareVersion:
      vehicle.firmwareVersion,

    unitNumber:
      vehicle.unitNumber,

    remarks: "",

    errCode:
      "R0L0G0D0C1",
  };
}


// ============================================================
// BUILD TELEMETRY GET REQUEST URL
// ============================================================
//
// EXISTING LOGIC - PRESERVED.
//
// ============================================================

function buildRequestURL(packet) {
  const url =
    new URL(API_URL);

  const params =
    new URLSearchParams();

  params.set(
    "rfidNumber",
    packet.rfidNumber,
  );

  params.set(
    "iotTimestamp",
    packet.iotTimestamp,
  );

  params.set(
    "driverName",
    packet.driverName,
  );

  params.set(
    "vehicleId",
    packet.vehicleId,
  );

  params.set(
    "latitude",
    String(
      packet.latitude,
    ),
  );

  params.set(
    "longitude",
    String(
      packet.longitude,
    ),
  );

  params.set(
    "weight",
    String(
      packet.weight,
    ),
  );

  params.set(
    "firmwareVersion",
    packet.firmwareVersion,
  );

  params.set(
    "unitNumber",
    packet.unitNumber,
  );

  params.set(
    "remarks",
    packet.remarks,
  );

  params.set(
    "errCode",
    packet.errCode,
  );

  url.search =
    params.toString();

  return url;
}


// ============================================================
// SEND EXISTING TELEMETRY PACKET
// ============================================================
//
// EXISTING LOGIC - PRESERVED.
//
// ============================================================

async function sendPacket(
  vehicle,
  packet,
) {
  const url =
    buildRequestURL(
      packet,
    );

  const stats =
    statistics.vehicles[
      vehicle.vehicleId
    ];

  stats.packetsSent++;

  statistics.totalPackets++;

  if (
    !stats.firstPacketAt
  ) {
    stats.firstPacketAt =
      new Date();
  }

  stats.lastPacketAt =
    new Date();

  try {
    const response =
      await fetch(
        url,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",

            "User-Agent":
              "SEWAC-Vehicle-Simulator",
          },
        },
      );

    const responseText =
      await response.text();

    if (response.ok) {
      stats.packetsSuccessful++;

      statistics.successfulPackets++;

      stats.lastRFID =
        packet.rfidNumber;

      stats.lastLatitude =
        packet.latitude;

      stats.lastLongitude =
        packet.longitude;

      console.log(
        `🚛 ${vehicle.vehicleId} | ` +
          `Ward ${vehicle.wardNo} | ` +
          `RFID ${packet.rfidNumber} | ` +
          `Lat ${packet.latitude.toFixed(6)} | ` +
          `Lng ${packet.longitude.toFixed(6)} | ` +
          `Weight ${packet.weight} kg | ` +
          `HTTP ${response.status}`,
      );

      return {
        success: true,

        status:
          response.status,

        body:
          responseText,
      };
    }

    stats.packetsFailed++;

    statistics.failedPackets++;

    console.error("");

    console.error(
      "===============================================",
    );

    console.error(
      "TELEMETRY PACKET FAILED",
    );

    console.error(
      "===============================================",
    );

    console.error(
      `Vehicle    : ${vehicle.vehicleId}`,
    );

    console.error(
      `Ward       : ${vehicle.wardNo}`,
    );

    console.error(
      `RFID       : ${packet.rfidNumber}`,
    );

    console.error(
      `Unit       : ${packet.unitNumber}`,
    );

    console.error(
      `Status     : ${response.status}`,
    );

    console.error(
      `Response   : ${responseText}`,
    );

    console.error(
      `URL        : ${url.toString()}`,
    );

    console.error(
      "===============================================",
    );

    console.error("");

    return {
      success: false,

      status:
        response.status,

      body:
        responseText,
    };
  } catch (error) {
    stats.packetsFailed++;

    statistics.failedPackets++;

    console.error(
      `❌ ${vehicle.vehicleId} telemetry failed:`,
      error.message,
    );

    console.error(
      `URL: ${url.toString()}`,
    );

    return {
      success: false,

      error:
        error.message,
    };
  }
}


// ============================================================
// CREATE HEARTBEAT PACKET
// ============================================================
//
// NEW LOGIC.
//
// Heartbeat contains the current simulated vehicle position.
//
// IMPORTANT:
//
// We DO NOT modify routeIndex here.
//
// The existing telemetry loop remains responsible for
// changing vehicle movement.
//
// ============================================================

function createHeartbeatPacket(
  vehicle,
) {
  const position =
    getVehiclePosition(
      vehicle,
    );

  const latitudeNoise =
    randomFloat(
      -0.000002,
      0.000002,
    );

  const longitudeNoise =
    randomFloat(
      -0.000002,
      0.000002,
    );

  const latitude =
    Number(
      (
        position[0] +
        latitudeNoise
      ).toFixed(7),
    );

  const longitude =
    Number(
      (
        position[1] +
        longitudeNoise
      ).toFixed(7),
    );

  return {
    vehicleNumber:
      vehicle.vehicleId,

    vehicleId:
      vehicle.vehicleId,

    iotTimestamp:
      new Date().toISOString(),

    latitude,

    longitude,

    speed:
      vehicle.speed,

    vehicleStatus:
      vehicle.status,

    wardNo:
      vehicle.wardNo,

    wardName:
      vehicle.wardName,
  };
}


// ============================================================
// SEND HEARTBEAT
// ============================================================
//
// NEW LOGIC.
//
// POST /api/iot/heartbeat
//
// The backend should:
//
// 1. Identify today's day table.
// 2. Find vehicle_table_hb.
// 3. Insert this heartbeat into that table.
//
// ============================================================

async function sendHeartbeat(
  vehicle,
) {
  const packet =
    createHeartbeatPacket(
      vehicle,
    );

  const stats =
    statistics.vehicles[
      vehicle.vehicleId
    ];

  stats.heartbeatsSent++;

  statistics.totalHeartbeats++;

  stats.lastHeartbeatAt =
    new Date();

  try {
    const response =
      await fetch(
        HEARTBEAT_API_URL,
        {
          method: "POST",

          headers: {
            Accept:
              "application/json",

            "Content-Type":
              "application/json",

            "User-Agent":
              "SEWAC-Vehicle-Heartbeat-Simulator",
          },

          body:
            JSON.stringify(
              packet,
            ),
        },
      );

    const responseText =
      await response.text();

    if (response.ok) {
      stats.heartbeatsSuccessful++;

      statistics.successfulHeartbeats++;

      console.log("");

      console.log(
        `💓 HEARTBEAT | ` +
          `${vehicle.vehicleId} | ` +
          `Lat ${packet.latitude.toFixed(6)} | ` +
          `Lng ${packet.longitude.toFixed(6)} | ` +
          `HTTP ${response.status}`,
      );

      return {
        success: true,

        status:
          response.status,

        body:
          responseText,
      };
    }

    stats.heartbeatsFailed++;

    statistics.failedHeartbeats++;

    console.error("");

    console.error(
      "===============================================",
    );

    console.error(
      "HEARTBEAT FAILED",
    );

    console.error(
      "===============================================",
    );

    console.error(
      `Vehicle    : ${vehicle.vehicleId}`,
    );

    console.error(
      `Latitude   : ${packet.latitude}`,
    );

    console.error(
      `Longitude  : ${packet.longitude}`,
    );

    console.error(
      `Status     : ${response.status}`,
    );

    console.error(
      `Response   : ${responseText}`,
    );

    console.error(
      `URL        : ${HEARTBEAT_API_URL}`,
    );

    console.error(
      "===============================================",
    );

    console.error("");

    return {
      success: false,

      status:
        response.status,

      body:
        responseText,
    };
  } catch (error) {
    stats.heartbeatsFailed++;

    statistics.failedHeartbeats++;

    console.error(
      `❌ ${vehicle.vehicleId} heartbeat failed:`,
      error.message,
    );

    console.error(
      `URL: ${HEARTBEAT_API_URL}`,
    );

    return {
      success: false,

      error:
        error.message,
    };
  }
}


// ============================================================
// HEARTBEAT LOOP
// ============================================================
//
// Each vehicle has its own independent heartbeat timer.
//
// KA05AB1237 → every 15 seconds
// KA05AB1238 → every 15 seconds
//
// ============================================================

function startHeartbeatLoop(
  vehicle,
  stopTime,
) {
  console.log(
    `💓 ${vehicle.vehicleId} heartbeat loop started ` +
      `(every 15 seconds)`,
  );

  const heartbeatTimer =
    setInterval(
      async () => {
        if (
          Date.now() >=
          stopTime
        ) {
          clearInterval(
            heartbeatTimer,
          );

          return;
        }

        await sendHeartbeat(
          vehicle,
        );
      },
      HEARTBEAT_INTERVAL_MS,
    );

  return heartbeatTimer;
}


// ============================================================
// VEHICLE LOOP
// ============================================================
//
// EXISTING LOGIC - PRESERVED.
//
// ============================================================

async function runVehicle(
  vehicle,
  stopTime,
) {
  console.log(
    `${vehicle.vehicleId} simulation started`,
  );

  while (
    Date.now() <
    stopTime
  ) {
    const delay =
      randomDelay(
        MIN_DELAY_SECONDS,
        MAX_DELAY_SECONDS,
      );

    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          delay,
        ),
    );

    if (
      Date.now() >=
      stopTime
    ) {
      break;
    }

    const packet =
      createPacket(
        vehicle,
      );

    await sendPacket(
      vehicle,
      packet,
    );

    vehicle.routeIndex++;

    if (
      vehicle.routeIndex >=
      vehicle.route.length
    ) {
      vehicle.routeIndex = 0;
    }
  }

  console.log(
    `${vehicle.vehicleId} simulation stopped`,
  );
}


// ============================================================
// SUMMARY
// ============================================================

function printSummary() {
  console.log("");

  console.log(
    "=================================================",
  );

  console.log(
    "SIMULATION COMPLETE",
  );

  console.log(
    "=================================================",
  );

  console.log("");

  console.log(
    "Duration         : 5 minutes",
  );

  console.log(
    `Random Delay     : ` +
      `${MIN_DELAY_SECONDS}s - ` +
      `${MAX_DELAY_SECONDS}s`,
  );

  // EXISTING TELEMETRY

  console.log(
    `Total Packets    : ${statistics.totalPackets}`,
  );

  console.log(
    `Successful       : ${statistics.successfulPackets}`,
  );

  console.log(
    `Failed           : ${statistics.failedPackets}`,
  );

  console.log("");

  // NEW HEARTBEATS

  console.log(
    `Total Heartbeats : ${statistics.totalHeartbeats}`,
  );

  console.log(
    `HB Successful    : ${statistics.successfulHeartbeats}`,
  );

  console.log(
    `HB Failed        : ${statistics.failedHeartbeats}`,
  );

  console.log("");

  for (
    const vehicle of vehicles
  ) {
    const stats =
      statistics.vehicles[
        vehicle.vehicleId
      ];

    console.log(
      "-------------------------------------------------",
    );

    console.log(
      `Vehicle : ${vehicle.vehicleId}`,
    );

    console.log(
      `Ward    : ${vehicle.wardNo}`,
    );

    console.log(
      `Unit    : ${vehicle.unitNumber}`,
    );

    // EXISTING TELEMETRY

    console.log(
      `Packets : ${stats.packetsSent}`,
    );

    console.log(
      `Success : ${stats.packetsSuccessful}`,
    );

    console.log(
      `Failed  : ${stats.packetsFailed}`,
    );

    console.log(
      `Last RFID : ${stats.lastRFID || "N/A"}`,
    );

    console.log(
      `Last Position : ` +
        `${stats.lastLatitude ?? "N/A"}, ` +
        `${stats.lastLongitude ?? "N/A"}`,
    );

    // NEW HEARTBEAT

    console.log(
      `Heartbeats : ${stats.heartbeatsSent}`,
    );

    console.log(
      `HB Success : ${stats.heartbeatsSuccessful}`,
    );

    console.log(
      `HB Failed  : ${stats.heartbeatsFailed}`,
    );
  }

  console.log("");

  console.log(
    "=================================================",
  );
}


// ============================================================
// STOP
// ============================================================

function stopSimulation() {
  console.log("");

  console.log(
    "=================================================",
  );

  console.log(
    "🛑 5-MINUTE SIMULATION COMPLETED",
  );

  console.log(
    "=================================================",
  );

  printSummary();

  process.exit(0);
}


// ============================================================
// MAIN
// ============================================================

async function startSimulation() {
  const simulationStartedAt =
    Date.now();

  const stopTime =
    simulationStartedAt +
    SIMULATION_DURATION_MS;

  statistics.startedAt =
    new Date();

  console.log("");

  console.log(
    "============================================================",
  );

  console.log(
    "🚛 SEWAC VEHICLE SIMULATION",
  );

  console.log(
    "============================================================",
  );

  console.log(
    `Ward       : ${WARD_NO} - ${WARD_NAME}`,
  );

  console.log(
    `Vehicles   : ${vehicles.length}`,
  );

  console.log(
    "Vehicles   : KA05AB1237, KA05AB1238",
  );

  console.log(
    "Duration   : 5 minutes",
  );

  console.log(
    `Random Delay : ` +
      `${MIN_DELAY_SECONDS}s - ` +
      `${MAX_DELAY_SECONDS}s`,
  );

  console.log(
    `HTTP API   : ${API_URL}`,
  );

  console.log(
    "Method     : GET",
  );

  console.log(
    `Heartbeat  : ${HEARTBEAT_API_URL}`,
  );

  console.log(
    "HB Method  : POST",
  );

  console.log(
    "HB Interval: 15 seconds",
  );

  console.log(
    "Socket.IO  : DISABLED",
  );

  console.log(
    "Telemetry  : MANUAL / UHF",
  );

  console.log(
    "============================================================",
  );

  console.log("");

  console.log(
    "🚛 Starting vehicle simulation...",
  );

  console.log("");

  // ==========================================================
  // START HEARTBEAT LOOPS
  // ==========================================================

  const heartbeatTimers =
    vehicles.map(
      (vehicle) =>
        startHeartbeatLoop(
          vehicle,
          stopTime,
        ),
    );

  // ==========================================================
  // EXISTING TELEMETRY SIMULATION
  // ==========================================================

  await Promise.all(
    vehicles.map(
      (vehicle) =>
        runVehicle(
          vehicle,
          stopTime,
        ),
    ),
  );

  // ==========================================================
  // CLEANUP HEARTBEAT TIMERS
  // ==========================================================

  for (
    const timer of heartbeatTimers
  ) {
    clearInterval(timer);
  }

  statistics.finishedAt =
    new Date();

  printSummary();

  process.exit(0);
}


// ============================================================
// 5-MINUTE TIMER
// ============================================================

setTimeout(
  () => {
    stopSimulation();
  },
  SIMULATION_DURATION_MS,
);


// ============================================================
// CTRL + C
// ============================================================

process.on(
  "SIGINT",
  () => {
    console.log(
      "⚠️ Simulation manually stopped.",
    );

    stopSimulation();
  },
);


// ============================================================
// ERROR HANDLERS
// ============================================================

process.on(
  "uncaughtException",
  (error) => {
    console.error(
      "❌ Simulation error:",
      error,
    );
  },
);

process.on(
  "unhandledRejection",
  (error) => {
    console.error(
      "❌ Unhandled simulation error:",
      error,
    );
  },
);


// ============================================================
// START
// ============================================================

startSimulation();