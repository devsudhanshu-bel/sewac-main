const API_URL = "https://sewac-main.onrender.com/api/iot/telemetry/record";

const HEARTBEAT_API_URL = "https://sewac-main.onrender.com/api/iot/heart-beat";

// ============================================================
// CONFIGURATION
// ============================================================

const SIMULATION_DURATION_MS = 5 * 60 * 1000;

const MIN_DELAY_SECONDS = 0.1;
const MAX_DELAY_SECONDS = 0.3;

const WARD_NO = 216;
const WARD_NAME = "Ibbalur";

// ============================================================
// VEHICLES
// ============================================================
//
// VEHICLE 1
// Normal citizen/manual collection
//
// Backend classification:
//
// remarks === ""
// RFID starts with E
// unitNumber === SEWAC_01_UHF
//
// ============================================================

const vehicles = [
  {
    vehicleId: "KA05AB1237",

    vehicleName: "KA05AB1237",

    wardNo: WARD_NO,

    wardName: WARD_NAME,

    driverName: "Ramesh",

    firmwareVersion: "v0.1.0",

    unitNumber: "SEWAC_01_UHF",

    rfidNumber: "E20047059AE0602601E8010D",

    remarks: "",

    errCode: "R0L0G0D0C1",

    type: "COLLECTION",

    routeIndex: 0,

    route: [
      [12.92169, 77.663022],
      [12.922351, 77.661328],
      [12.923043, 77.661601],
      [12.923853, 77.661829],
      [12.9245, 77.6622],
      [12.926142, 77.662472],
      [12.926729, 77.662758],
      [12.927172, 77.662066],
      [12.927936, 77.662209],
      [12.928537, 77.662631],
      [12.928229, 77.663286],
      [12.928038, 77.663883],
      [12.928052, 77.664594],
      [12.928355, 77.665115],
      [12.9295, 77.6655],
      [12.930351, 77.665855],
      [12.930723, 77.666152],
      [12.931006, 77.666402],
      [12.931199, 77.666921],
      [12.931281, 77.667529],
      [12.931243, 77.668035],
      [12.930741, 77.668015],
      [12.929495, 77.667865],
      [12.9285, 77.6669],
      [12.9275, 77.666],
      [12.9265, 77.665],
      [12.9255, 77.664],
      [12.9245, 77.6635],
      [12.9235, 77.663],
      [12.9225, 77.6625],
      [12.92169, 77.663022],
    ],
  },

  // ==========================================================
  // VEHICLE 2
  // GVP / AUTO COLLECTION
  //
  // THIS MUST MATCH THE REAL BACKEND CONTRACT:
  //
  // remarks       = "O"
  // RFID          = DOES NOT start with E
  // unitNumber    = "SEWAC_01_HF"
  //
  // The backend then maps:
  //
  // weight
  //   ↓
  // otherWeightKg
  //   ↓
  // currentWeight
  //   ↓
  // vehicle cumulative weight
  //
  // ==========================================================

  {
    vehicleId: "KA05AB1238",

    vehicleName: "KA05AB1238",

    wardNo: WARD_NO,

    wardName: WARD_NAME,

    driverName: "Suresh",

    firmwareVersion: "v0.1.0",

    unitNumber: "SEWAC_01_HF",

    /*
    |--------------------------------------------------------------------------
    | IMPORTANT
    |--------------------------------------------------------------------------
    |
    | MUST NOT start with "E".
    |
    | Otherwise backend classifies it as manual/UHF.
    |
    */

    rfidNumber: "GVP200600106026083B0113",

    remarks: "O",

    errCode: "R0L0G0D0C1",

    type: "GVP",

    routeIndex: 0,

    route: [
      [12.923137, 77.664139],
      [12.9227, 77.6635],
      [12.9222, 77.6628],
      [12.9217, 77.6623],
      [12.9213, 77.662],
      [12.9216, 77.6612],
      [12.92235, 77.661328],
      [12.923043, 77.661601],
      [12.923853, 77.661829],
      [12.9243, 77.662],
      [12.925, 77.6622],
      [12.926142, 77.662472],
      [12.926729, 77.662758],
      [12.927172, 77.662066],
      [12.927936, 77.662209],
      [12.928537, 77.662631],
      [12.928229, 77.663286],
      [12.928039, 77.663883],
      [12.928053, 77.664594],
      [12.928355, 77.665115],
      [12.9292, 77.6655],
      [12.930351, 77.665855],
      [12.930723, 77.666152],
      [12.9309, 77.6665],
      [12.9307, 77.6672],
      [12.930364, 77.667975],
      [12.929495, 77.667865],
      [12.9286, 77.6673],
      [12.9275, 77.6665],
      [12.9265, 77.6655],
      [12.9255, 77.6648],
      [12.9245, 77.6643],
      [12.9235, 77.664],
      [12.923137, 77.664139],
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

  collectionPackets: 0,

  gvpPackets: 0,

  vehicles: {},
};

for (const vehicle of vehicles) {
  statistics.vehicles[vehicle.vehicleId] = {
    packetsSent: 0,

    packetsSuccessful: 0,

    packetsFailed: 0,

    collectionPackets: 0,

    gvpPackets: 0,

    lastLatitude: null,

    lastLongitude: null,

    lastWeight: null,

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
  return [
    start[0] + (end[0] - start[0]) * progress,

    start[1] + (end[1] - start[1]) * progress,
  ];
}

// ============================================================
// CURRENT VEHICLE POSITION
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
//
// IMPORTANT:
//
// NO cumulativeWeight
//
// The backend calculates cumulative weight.
//
// ============================================================

function createPacket(vehicle) {
  const position = getVehiclePosition(vehicle);

  // Small GPS variation so points do not
  // all land exactly on the same coordinate.

  const latitude = Number(
    (position[0] + randomFloat(-0.000005, 0.000005)).toFixed(7),
  );

  const longitude = Number(
    (position[1] + randomFloat(-0.000005, 0.000005)).toFixed(7),
  );

  /*
  |--------------------------------------------------------------------------
  | WEIGHT
  |--------------------------------------------------------------------------
  |
  | This is the ONLY weight value sent.
  |
  | Backend:
  |
  | weight
  |   ↓
  | otherWeightKg for AUTO
  |   ↓
  | currentWeight
  |   ↓
  | cumulativeWeight
  |--------------------------------------------------------------------------
  */

  const weight = Number(randomFloat(0.5, 12).toFixed(2));

  /*
  |--------------------------------------------------------------------------
  | REAL IOT PAYLOAD
  |--------------------------------------------------------------------------
  */

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

    remarks: vehicle.remarks,

    errCode: vehicle.errCode,
  };
}

// ============================================================
// BUILD API URL
// ============================================================

function buildRequestURL(packet) {
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

  /*
  |--------------------------------------------------------------------------
  | DO NOT SEND:
  |
  | cumulativeWeight
  | citizenContact
  |
  |--------------------------------------------------------------------------
  */

  url.search = params.toString();

  return url;
}

// ============================================================
// SEND PACKET
// ============================================================

async function sendPacket(vehicle, packet) {
  const url = buildRequestURL(packet);

  const stats = statistics.vehicles[vehicle.vehicleId];

  stats.packetsSent++;

  statistics.totalPackets++;

  if (!stats.firstPacketAt) {
    stats.firstPacketAt = new Date();
  }

  stats.lastPacketAt = new Date();

  if (vehicle.type === "GVP") {
    stats.gvpPackets++;

    statistics.gvpPackets++;
  } else {
    stats.collectionPackets++;

    statistics.collectionPackets++;
  }

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

      stats.lastLatitude = packet.latitude;

      stats.lastLongitude = packet.longitude;

      stats.lastWeight = packet.weight;

      console.log(
        `${vehicle.type === "GVP" ? "🔴 GVP" : "🟢 COLLECTION"} | ` +
          `${vehicle.vehicleId} | ` +
          `Ward ${vehicle.wardNo} | ` +
          `Lat ${packet.latitude.toFixed(6)} | ` +
          `Lng ${packet.longitude.toFixed(6)} | ` +
          `Weight ${packet.weight} kg | ` +
          `RFID ${packet.rfidNumber} | ` +
          `Unit ${packet.unitNumber} | ` +
          `Remarks ${packet.remarks || "-"}`,
      );

      return {
        success: true,

        status: response.status,

        body: responseText,
      };
    }

    stats.packetsFailed++;

    statistics.failedPackets++;

    console.error("");

    console.error("=================================================");

    console.error("❌ TELEMETRY PACKET FAILED");

    console.error("=================================================");

    console.error(`Vehicle    : ${vehicle.vehicleId}`);

    console.error(`Type       : ${vehicle.type}`);

    console.error(`Ward       : ${vehicle.wardNo}`);

    console.error(`RFID       : ${packet.rfidNumber}`);

    console.error(`Unit       : ${packet.unitNumber}`);

    console.error(`Remarks    : ${packet.remarks || "-"}`);

    console.error(`Weight     : ${packet.weight}`);

    console.error(`Status     : ${response.status}`);

    console.error(`Response   : ${responseText}`);

    console.error(`URL        : ${url.toString()}`);

    console.error("=================================================");

    console.error("");

    return {
      success: false,

      status: response.status,

      body: responseText,
    };
  } catch (error) {
    stats.packetsFailed++;

    statistics.failedPackets++;

    console.error(`❌ ${vehicle.vehicleId} request failed:`, error.message);

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
// NEW ONLY.
//
// Uses the SAME packet.latitude and packet.longitude
// that the original telemetry packet uses.
//
// ============================================================

async function sendHeartbeat(vehicle, packet) {
  const url = new URL(
    `${HEARTBEAT_API_URL}/${encodeURIComponent(vehicle.vehicleId)}`,
  );

  url.searchParams.set("latitude", String(packet.latitude));

  url.searchParams.set("longitude", String(packet.longitude));

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
  console.log("");

  console.log(`🚛 ${vehicle.vehicleId} simulation started`);

  console.log(`Type       : ${vehicle.type}`);

  console.log(`Ward       : ${vehicle.wardNo} - ${vehicle.wardName}`);

  console.log(`Unit       : ${vehicle.unitNumber}`);

  console.log(`RFID       : ${vehicle.rfidNumber}`);

  console.log(`Remarks    : ${vehicle.remarks || "(empty)"}`);

  while (Date.now() < stopTime) {
    await new Promise((resolve) =>
      setTimeout(resolve, randomDelay(MIN_DELAY_SECONDS, MAX_DELAY_SECONDS)),
    );

    if (Date.now() >= stopTime) {
      break;
    }

    const packet = createPacket(vehicle);

    // ========================================================
    // EXISTING TELEMETRY + NEW HEARTBEAT
    // ========================================================
    //
    // The telemetry packet is EXACTLY the same packet
    // generated by the original simulator.
    //
    // Heartbeat receives that SAME packet only to use:
    //
    // packet.latitude
    // packet.longitude
    //
    // ========================================================

    await Promise.allSettled([
      sendPacket(vehicle, packet),
      sendHeartbeat(vehicle, packet),
    ]);

    vehicle.routeIndex++;

    if (vehicle.routeIndex >= vehicle.route.length) {
      vehicle.routeIndex = 0;
    }
  }

  console.log(`🛑 ${vehicle.vehicleId} simulation stopped`);
}

// ============================================================
// SUMMARY
// ============================================================

function printSummary() {
  console.log("");

  console.log("=================================================");

  console.log("SIMULATION COMPLETE");

  console.log("=================================================");

  console.log(`Duration         : 5 minutes`);

  console.log(
    `Random Delay     : ${MIN_DELAY_SECONDS}s - ${MAX_DELAY_SECONDS}s`,
  );

  console.log(`Total Packets    : ${statistics.totalPackets}`);

  console.log(`Successful       : ${statistics.successfulPackets}`);

  console.log(`Failed           : ${statistics.failedPackets}`);

  console.log(`Collection       : ${statistics.collectionPackets}`);

  console.log(`GVP              : ${statistics.gvpPackets}`);

  for (const vehicle of vehicles) {
    const stats = statistics.vehicles[vehicle.vehicleId];

    console.log("");

    console.log("-------------------------------------------------");

    console.log(`Vehicle : ${vehicle.vehicleId}`);

    console.log(`Ward    : ${vehicle.wardNo}`);

    console.log(`Type    : ${vehicle.type}`);

    console.log(`Unit    : ${vehicle.unitNumber}`);

    console.log(`Packets : ${stats.packetsSent}`);

    console.log(`Success : ${stats.packetsSuccessful}`);

    console.log(`Failed  : ${stats.packetsFailed}`);

    console.log(`Last Weight : ${stats.lastWeight ?? "N/A"}`);

    console.log(
      `Last Position : ${stats.lastLatitude ?? "N/A"}, ${
        stats.lastLongitude ?? "N/A"
      }`,
    );
  }

  console.log("");

  console.log("=================================================");
}

// ============================================================
// STOP
// ============================================================

function stopSimulation() {
  statistics.finishedAt = new Date();

  printSummary();

  process.exit(0);
}

// ============================================================
// START
// ============================================================

async function startSimulation() {
  const startedAt = Date.now();

  const stopTime = startedAt + SIMULATION_DURATION_MS;

  statistics.startedAt = new Date();

  console.log("");

  console.log("============================================================");

  console.log("🚛 SEWAC VEHICLE SIMULATION");

  console.log("============================================================");

  console.log(`Ward       : ${WARD_NO} - ${WARD_NAME}`);

  console.log(`Vehicles   : ${vehicles.length}`);

  console.log("Collection : KA05AB1237");

  console.log("GVP        : KA05AB1238");

  console.log(`Duration   : 5 minutes`);

  console.log(`Random Delay : ${MIN_DELAY_SECONDS}s - ${MAX_DELAY_SECONDS}s`);

  console.log(`Telemetry API : ${API_URL}`);

  console.log(
    `Heartbeat API : ${HEARTBEAT_API_URL}/<vehicleId>?latitude=<lat>&longitude=<lng>`,
  );

  console.log("============================================================");

  console.log("");

  await Promise.all(vehicles.map((vehicle) => runVehicle(vehicle, stopTime)));

  statistics.finishedAt = new Date();

  printSummary();

  process.exit(0);
}

// ============================================================
// TIMER
// ============================================================

setTimeout(() => {
  stopSimulation();
}, SIMULATION_DURATION_MS);

// ============================================================
// CTRL+C
// ============================================================

process.on("SIGINT", () => {
  console.log("\n⚠️ Simulation manually stopped.");

  stopSimulation();
});

// ============================================================
// ERRORS
// ============================================================

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught simulation error:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled simulation rejection:", error);
});

// ============================================================
// RUN
// ============================================================

startSimulation();
