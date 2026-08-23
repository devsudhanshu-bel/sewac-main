const { randomInt } = require("crypto");

// ============================================================
// SEWAC VEHICLE SIMULATION
// TELEMETRY + HEARTBEAT
// ============================================================
//
// VEHICLES:
//   KA05AB1237
//   KA05AB1238
//
// WARD:
//   216 - Ibbaluru
//
// BOTH ENDPOINTS ARE CALLED FOR EVERY PACKET:
//
// 1. TELEMETRY
//    GET /api/iot/telemetry/record
//
// 2. HEARTBEAT
//    GET /api/iot/heart-beat/<vehicleId>
//       ?latitude=<lat>
//       &longitude=<lng>
//
// IMPORTANT:
// - Existing vehicle IDs are unchanged.
// - Existing RFID values are unchanged.
// - Existing routes are unchanged.
// - Existing telemetry payload is unchanged.
// - Heartbeat uses the SAME latitude/longitude generated
//   for the telemetry packet.
// - Heartbeat does NOT enter the Redis telemetry pipeline.
// - Both requests are independent.
//
// ============================================================

// ============================================================
// API
// ============================================================

const API_URL = "https://sewac-main.onrender.com/api/iot/telemetry/record";

const HEARTBEAT_API_URL = "https://sewac-main.onrender.com/api/iot/heart-beat";

// ============================================================
// SIMULATION CONFIGURATION
// ============================================================

const SIMULATION_DURATION_MS = 5 * 60 * 1000;

const MIN_DELAY_SECONDS = 0.1;

const MAX_DELAY_SECONDS = 0.3;

// ============================================================
// WARD
// ============================================================

const WARD_NO = 216;

const WARD_NAME = "Ibbaluru";

// ============================================================
// WARD BOUNDARY
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

    rfidNumber: "E2004721600000000001237",

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

    rfidNumber: "E2004721600000000001238",

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

  totalPackets: 0,

  successfulPackets: 0,

  failedPackets: 0,

  totalHeartbeats: 0,

  successfulHeartbeats: 0,

  failedHeartbeats: 0,

  vehicles: {},
};

// ============================================================
// INITIALIZE VEHICLE STATISTICS
// ============================================================

for (const vehicle of vehicles) {
  statistics.vehicles[vehicle.vehicleId] = {
    packetsSent: 0,

    packetsSuccessful: 0,

    packetsFailed: 0,

    heartbeatsSent: 0,

    heartbeatsSuccessful: 0,

    heartbeatsFailed: 0,

    lastRFID: null,

    lastLatitude: null,

    lastLongitude: null,

    firstPacketAt: null,

    lastPacketAt: null,
  };
}

// ============================================================
// RANDOM HELPERS
// ============================================================

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randomDelay(minSeconds, maxSeconds) {
  return Math.round(randomFloat(minSeconds, maxSeconds) * 1000);
}

// ============================================================
// GPS INTERPOLATION
// ============================================================

function interpolate(start, end, progress) {
  const latitude = start[0] + (end[0] - start[0]) * progress;

  const longitude = start[1] + (end[1] - start[1]) * progress;

  return [latitude, longitude];
}

// ============================================================
// VEHICLE POSITION
// ============================================================

function getVehiclePosition(vehicle) {
  const route = vehicle.route;

  const currentIndex = vehicle.routeIndex;

  const nextIndex = (currentIndex + 1) % route.length;

  const currentPoint = route[currentIndex];

  const nextPoint = route[nextIndex];

  return interpolate(currentPoint, nextPoint, 0.35);
}

// ============================================================
// CREATE TELEMETRY PACKET
// ============================================================

function createPacket(vehicle) {
  const position = getVehiclePosition(vehicle);

  const latitudeNoise = randomFloat(-0.000005, 0.000005);

  const longitudeNoise = randomFloat(-0.000005, 0.000005);

  const latitude = Number((position[0] + latitudeNoise).toFixed(7));

  const longitude = Number((position[1] + longitudeNoise).toFixed(7));

  const weight = Number(randomFloat(0.5, 12).toFixed(2));

  return {
    rfidNumber: vehicle.rfidNumber,

    iotTimestamp: new Date().toISOString(),

    driverName: vehicle.driverName,

    vehicleId: vehicle.vehicleId,

    latitude,

    longitude,

    weight,

    firmwareVersion: vehicle.firmwareVersion,

    unitNumber: vehicle.unitNumber,

    remarks: "",

    errCode: "R0L0G0D0C1",
  };
}

// ============================================================
// BUILD TELEMETRY URL
// ============================================================

function buildTelemetryURL(packet) {
  const url = new URL(API_URL);

  const params = new URLSearchParams();

  params.set("rfidNumber", packet.rfidNumber);

  params.set("iotTimestamp", packet.iotTimestamp);

  params.set("driverName", packet.driverName);

  params.set("vehicleId", packet.vehicleId);

  params.set("latitude", String(packet.latitude));

  params.set("longitude", String(packet.longitude));

  params.set("weight", String(packet.weight));

  params.set("firmwareVersion", packet.firmwareVersion);

  params.set("unitNumber", packet.unitNumber);

  params.set("remarks", packet.remarks);

  params.set("errCode", packet.errCode);

  url.search = params.toString();

  return url;
}

// ============================================================
// SEND TELEMETRY
// ============================================================

async function sendPacket(vehicle, packet) {
  const url = buildTelemetryURL(packet);

  const stats = statistics.vehicles[vehicle.vehicleId];

  stats.packetsSent++;

  statistics.totalPackets++;

  if (!stats.firstPacketAt) {
    stats.firstPacketAt = new Date();
  }

  stats.lastPacketAt = new Date();

  try {
    const response = await fetch(url, {
      method: "GET",

      headers: {
        Accept: "application/json",

        "User-Agent": "SEWAC-Vehicle-Simulator",
      },
    });

    const responseText = await response.text();

    if (response.ok) {
      stats.packetsSuccessful++;

      statistics.successfulPackets++;

      stats.lastRFID = packet.rfidNumber;

      stats.lastLatitude = packet.latitude;

      stats.lastLongitude = packet.longitude;

      console.log(
        `🚛 TELEMETRY | ` +
          `${vehicle.vehicleId} | ` +
          `Ward ${vehicle.wardNo} | ` +
          `RFID ${packet.rfidNumber} | ` +
          `Lat ${packet.latitude.toFixed(6)} | ` +
          `Lng ${packet.longitude.toFixed(6)} | ` +
          `Weight ${packet.weight} kg | ` +
          `HTTP ${response.status}`,
      );

      return {
        success: true,

        status: response.status,

        body: responseText,
      };
    }

    stats.packetsFailed++;

    statistics.failedPackets++;

    console.error(
      `❌ TELEMETRY FAILED | ` +
        `${vehicle.vehicleId} | ` +
        `HTTP ${response.status} | ` +
        `${responseText}`,
    );

    return {
      success: false,

      status: response.status,

      body: responseText,
    };
  } catch (error) {
    stats.packetsFailed++;

    statistics.failedPackets++;

    console.error(
      `❌ TELEMETRY REQUEST FAILED | ` +
        `${vehicle.vehicleId} | ` +
        `${error.message}`,
    );

    return {
      success: false,

      error: error.message,
    };
  }
}

// ============================================================
// SEND HEARTBEAT
// ============================================================
//
// GET:
//
// /api/iot/heart-beat/<vehicleId>
// ?latitude=<lat>
// &longitude=<lng>
//
// ============================================================

async function sendHeartbeat(vehicle, packet) {
  const url = new URL(
    `${HEARTBEAT_API_URL}/${encodeURIComponent(vehicle.vehicleId)}`,
  );

  url.searchParams.set("latitude", String(packet.latitude));

  url.searchParams.set("longitude", String(packet.longitude));

  const stats = statistics.vehicles[vehicle.vehicleId];

  stats.heartbeatsSent++;

  statistics.totalHeartbeats++;

  try {
    const response = await fetch(url, {
      method: "GET",

      headers: {
        Accept: "application/json",

        "User-Agent": "SEWAC-Vehicle-Simulator",
      },
    });

    const responseText = await response.text();

    if (response.ok) {
      stats.heartbeatsSuccessful++;

      statistics.successfulHeartbeats++;

      console.log(
        `💓 HEARTBEAT | ` +
          `${vehicle.vehicleId} | ` +
          `Lat ${packet.latitude.toFixed(6)} | ` +
          `Lng ${packet.longitude.toFixed(6)} | ` +
          `HTTP ${response.status}`,
      );

      return {
        success: true,

        status: response.status,

        body: responseText,
      };
    }

    stats.heartbeatsFailed++;

    statistics.failedHeartbeats++;

    console.error(
      `❌ HEARTBEAT FAILED | ` +
        `${vehicle.vehicleId} | ` +
        `HTTP ${response.status} | ` +
        `${responseText}`,
    );

    return {
      success: false,

      status: response.status,

      body: responseText,
    };
  } catch (error) {
    stats.heartbeatsFailed++;

    statistics.failedHeartbeats++;

    console.error(
      `❌ HEARTBEAT REQUEST FAILED | ` +
        `${vehicle.vehicleId} | ` +
        `${error.message}`,
    );

    return {
      success: false,

      error: error.message,
    };
  }
}

// ============================================================
// VEHICLE LOOP
// ============================================================

async function runVehicle(vehicle, stopTime) {
  console.log(`${vehicle.vehicleId} simulation started`);

  while (Date.now() < stopTime) {
    const delay = randomDelay(MIN_DELAY_SECONDS, MAX_DELAY_SECONDS);

    await new Promise((resolve) => setTimeout(resolve, delay));

    if (Date.now() >= stopTime) {
      break;
    }

    // ========================================================
    // CREATE ONE PACKET
    // ========================================================

    const packet = createPacket(vehicle);

    // ========================================================
    // SEND BOTH ENDPOINTS
    // ========================================================
    //
    // SAME packet
    // SAME latitude
    // SAME longitude
    //
    // They are independent.
    //
    // ========================================================

    await Promise.allSettled([
      sendPacket(vehicle, packet),

      sendHeartbeat(vehicle, packet),
    ]);

    // ========================================================
    // MOVE VEHICLE
    // ========================================================

    vehicle.routeIndex++;

    if (vehicle.routeIndex >= vehicle.route.length) {
      vehicle.routeIndex = 0;
    }
  }

  console.log(`${vehicle.vehicleId} simulation stopped`);
}

// ============================================================
// SUMMARY
// ============================================================

function printSummary() {
  console.log("");

  console.log("=================================================");

  console.log("SIMULATION COMPLETE");

  console.log("=================================================");

  console.log("");

  console.log("Duration         : 5 minutes");

  console.log(
    `Random Delay     : ` +
      `${MIN_DELAY_SECONDS}s - ` +
      `${MAX_DELAY_SECONDS}s`,
  );

  console.log(`Total Telemetry  : ` + `${statistics.totalPackets}`);

  console.log(`Telemetry Success: ` + `${statistics.successfulPackets}`);

  console.log(`Telemetry Failed : ` + `${statistics.failedPackets}`);

  console.log(`Total Heartbeats : ` + `${statistics.totalHeartbeats}`);

  console.log(`Heartbeat Success: ` + `${statistics.successfulHeartbeats}`);

  console.log(`Heartbeat Failed : ` + `${statistics.failedHeartbeats}`);

  console.log("");

  for (const vehicle of vehicles) {
    const stats = statistics.vehicles[vehicle.vehicleId];

    console.log("-------------------------------------------------");

    console.log(`Vehicle : ${vehicle.vehicleId}`);

    console.log(`Ward    : ${vehicle.wardNo}`);

    console.log(`Unit    : ${vehicle.unitNumber}`);

    console.log(`Packets : ${stats.packetsSent}`);

    console.log(`Success : ${stats.packetsSuccessful}`);

    console.log(`Failed  : ${stats.packetsFailed}`);

    console.log(`Heartbeats : ${stats.heartbeatsSent}`);

    console.log(`Heartbeat Success : ` + `${stats.heartbeatsSuccessful}`);

    console.log(`Heartbeat Failed : ` + `${stats.heartbeatsFailed}`);

    console.log(`Last RFID : ` + `${stats.lastRFID || "N/A"}`);

    console.log(
      `Last Position : ` +
        `${stats.lastLatitude ?? "N/A"}, ` +
        `${stats.lastLongitude ?? "N/A"}`,
    );
  }

  console.log("");

  console.log("=================================================");
}

// ============================================================
// STOP
// ============================================================

function stopSimulation() {
  console.log("");

  console.log("=================================================");

  console.log("🛑 SIMULATION STOPPED");

  console.log("=================================================");

  printSummary();

  process.exit(0);
}

// ============================================================
// MAIN
// ============================================================

async function startSimulation() {
  statistics.startedAt = new Date();

  const stopTime = Date.now() + SIMULATION_DURATION_MS;

  console.log("");

  console.log("============================================================");

  console.log("🚛 SEWAC VEHICLE SIMULATION");

  console.log("============================================================");

  console.log(`Ward           : ` + `${WARD_NO} - ${WARD_NAME}`);

  console.log(`Vehicles       : ${vehicles.length}`);

  console.log("Vehicle IDs    : KA05AB1237, KA05AB1238");

  console.log("Duration       : 5 minutes");

  console.log(
    `Random Delay   : ` + `${MIN_DELAY_SECONDS}s - ` + `${MAX_DELAY_SECONDS}s`,
  );

  console.log(`Telemetry API  : ${API_URL}`);

  console.log(
    `Heartbeat API  : ` +
      `${HEARTBEAT_API_URL}/<vehicleId>` +
      `?latitude=<lat>&longitude=<lng>`,
  );

  console.log("Telemetry      : GET");

  console.log("Heartbeat      : GET");

  console.log("Socket.IO      : DISABLED");

  console.log("============================================================");

  console.log("");

  console.log("🚛 Starting vehicle simulation...");

  console.log("");

  await Promise.all(vehicles.map((vehicle) => runVehicle(vehicle, stopTime)));

  statistics.finishedAt = new Date();

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

process.on("SIGINT", () => {
  console.log("⚠️ Simulation manually stopped.");

  stopSimulation();
});

// ============================================================
// ERROR HANDLERS
// ============================================================

process.on("uncaughtException", (error) => {
  console.error("❌ Simulation error:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled simulation error:", error);
});

// ============================================================
// START
// ============================================================

startSimulation();
