const fs = require("fs");
const path = require("path");
const { randomInt, randomUUID } = require("crypto");

// =====================================================
// SEWAC VEHICLE STRESS SIMULATION
// =====================================================
//
// TEST ARCHITECTURE
//
// Bangalore
// ├── Zone A
// │   └── Division 1
// │       ├── Ward 1
// │       └── Ward 2
// │
// └── Zone Bgiu
//     └── Division 20
//         └── Ward 20
//
// VEHICLES
//
// KA05AB1234 -> Ward 1
// KA05AB1235 -> Ward 2
// KA05AB1236 -> Ward 20
//
// Each vehicle:
// - uses real citizen RFID data
// - uses real citizen coordinates
// - sends randomized packets
// - runs independently
// - runs concurrently
//
// Simulation duration:
// 10 minutes
//
// IMPORTANT TELEMETRY CONTRACT
//
// This simulator sends MANUAL/UHF packets.
//
// Therefore:
//
// remarks    = ""
// unitNumber = "SEWAC_01_UHF"
// RFID       = actual E... RFID
//
// This matches the actual telemetry controller:
//
// const isManual =
//   remarks === "" &&
//   rfidNumber?.startsWith("E") &&
//   unitNumber === "SEWAC_01_UHF";
//
// =====================================================

// =====================================================
// API
// =====================================================

const API_URL = "https://sewac-main.onrender.com/api/iot/telemetry/record";

// =====================================================
// SIMULATION DURATION
// =====================================================

const SIMULATION_DURATION_MS =  10 * 60 * 1000;

// =====================================================
// TEST NUMBER
// =====================================================
//
// PowerShell:
//
// $env:TEST_NUMBER="1"
// node .\src\simulation\vehicleStressSimulation.js
//
// =====================================================

const TEST_NUMBER = Number(process.env.TEST_NUMBER || 1);

// =====================================================
// TEST CONFIGURATION
// =====================================================
//
// Every test remains RANDOM.
//
// Only the packet frequency changes.
//
// =====================================================

const TEST_CONFIGS = {
  1: {
    name: "BASELINE",

    minDelaySeconds: 0.1,

    maxDelaySeconds: 0.3,

    description: "Low traffic randomized simulation",
  },

  2: {
    name: "MODERATE",

    minDelaySeconds: 3,

    maxDelaySeconds: 8,

    description: "Moderate randomized traffic",
  },

  3: {
    name: "HEAVY",

    minDelaySeconds: 2,

    maxDelaySeconds: 6,

    description: "Heavy randomized traffic",
  },

  4: {
    name: "VERY_HEAVY",

    minDelaySeconds: 1,

    maxDelaySeconds: 4,

    description: "Very heavy randomized traffic",
  },

  5: {
    name: "MAXIMUM_STRESS",

    minDelaySeconds: 0.5,

    maxDelaySeconds: 2.5,

    description: "Maximum randomized packet pressure",
  },
};

const TEST_CONFIG = TEST_CONFIGS[TEST_NUMBER] || TEST_CONFIGS[1];

// =====================================================
// VEHICLES
// =====================================================
//
// All three use the currently valid UHF unit number.
//
// Vehicle IDs are unique.
//
// =====================================================

const VEHICLES = [
  {
    vehicleId: "KA05AB1234",

    wardNo: 1,

    csv: "ward_1.csv",

    driverName: "Ramesh",

    unitNumber: "SEWAC_01_UHF",

    firmwareVersion: "v0.1.0",
  },

  {
    vehicleId: "KA05AB1235",

    wardNo: 2,

    csv: "ward_2.csv",

    driverName: "Suresh",

    unitNumber: "SEWAC_01_UHF",

    firmwareVersion: "v0.1.0",
  },

  {
    vehicleId: "KA05AB1236",

    wardNo: 20,

    csv: "ward_20.csv",

    driverName: "Mahesh",

    unitNumber: "SEWAC_01_UHF",

    firmwareVersion: "v0.1.0",
  },
];

// =====================================================
// CSV DATA DIRECTORY
// =====================================================

const DATA_DIRECTORY = path.join(__dirname, "data");

// =====================================================
// STATISTICS
// =====================================================

const statistics = {
  startedAt: null,

  finishedAt: null,

  totalPackets: 0,

  successfulPackets: 0,

  failedPackets: 0,

  vehicles: {},
};

// =====================================================
// INITIALIZE VEHICLE STATISTICS
// =====================================================

for (const vehicle of VEHICLES) {
  statistics.vehicles[vehicle.vehicleId] = {
    packetsSent: 0,

    packetsSuccessful: 0,

    packetsFailed: 0,

    lastRFID: null,

    lastLatitude: null,

    lastLongitude: null,

    firstPacketAt: null,

    lastPacketAt: null,
  };
}

// =====================================================
// CSV PARSER
// =====================================================

function parseCSVLine(line) {
  const result = [];

  let current = "";

  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const character = line[i];

    if (character === '"') {
      insideQuotes = !insideQuotes;

      continue;
    }

    if (character === "," && !insideQuotes) {
      result.push(current);

      current = "";

      continue;
    }

    current += character;
  }

  result.push(current);

  return result;
}

// =====================================================
// LOAD CSV
// =====================================================

function loadCSV(filename) {
  const filePath = path.join(DATA_DIRECTORY, filename);

  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf8");

  const lines = content.split(/\r?\n/).filter((line) => line.trim());

  if (lines.length < 2) {
    throw new Error(`CSV file is empty: ${filename}`);
  }

  const headers = parseCSVLine(lines[0]).map((header) => header.trim());

  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    const record = {};

    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = values[j] ?? "";
    }

    records.push(record);
  }

  return records;
}

// =====================================================
// LOAD CITIZEN DATA
// =====================================================

function loadVehicleData() {
  console.log("Loading citizen CSV data...");

  console.log("");

  for (const vehicle of VEHICLES) {
    const records = loadCSV(vehicle.csv);

    if (records.length === 0) {
      throw new Error(`No citizens found for Ward ${vehicle.wardNo}`);
    }

    vehicle.citizens = records
      .map((citizen) => ({
        dryRFID: String(citizen.dryRFID || "").trim(),

        wetRFID: String(citizen.wetRFID || "").trim(),

        drySlno: String(citizen.drySlno || "").trim(),

        wetSlno: String(citizen.wetSlno || "").trim(),

        latitude: Number(citizen.lat),

        longitude: Number(citizen.lng),

        personName: String(citizen.personName || "").trim(),
      }))
      .filter((citizen) => {
        const hasRFID = citizen.dryRFID || citizen.wetRFID;

        const validLatitude = Number.isFinite(citizen.latitude);

        const validLongitude = Number.isFinite(citizen.longitude);

        return Boolean(hasRFID) && validLatitude && validLongitude;
      });

    if (vehicle.citizens.length === 0) {
      throw new Error(`No valid citizens found for Ward ${vehicle.wardNo}`);
    }

    console.log(
      `${vehicle.vehicleId} -> ` +
        `Ward ${vehicle.wardNo} -> ` +
        `${vehicle.citizens.length} citizens`,
    );
  }

  console.log("");
}

// =====================================================
// RANDOM FLOAT
// =====================================================

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

// =====================================================
// RANDOM INDEX
// =====================================================

function randomIndex(length) {
  return randomInt(0, length);
}

// =====================================================
// RANDOM DELAY
// =====================================================

function randomDelay(minSeconds, maxSeconds) {
  return Math.round(randomFloat(minSeconds, maxSeconds) * 1000);
}

// =====================================================
// RANDOM CITIZEN
// =====================================================

function chooseCitizen(vehicle) {
  const index = randomIndex(vehicle.citizens.length);

  return vehicle.citizens[index];
}

// =====================================================
// SELECT RFID
// =====================================================
//
// IMPORTANT:
//
// We only use actual E... RFID values.
//
// The controller requires:
//
// rfidNumber.startsWith("E")
//
// =====================================================

function chooseRFID(citizen) {
  const validRFIDs = [];

  if (citizen.dryRFID && citizen.dryRFID.startsWith("E")) {
    validRFIDs.push({
      rfid: citizen.dryRFID,

      serial: citizen.drySlno,
    });
  }

  if (citizen.wetRFID && citizen.wetRFID.startsWith("E")) {
    validRFIDs.push({
      rfid: citizen.wetRFID,

      serial: citizen.wetSlno,
    });
  }

  if (validRFIDs.length === 0) {
    throw new Error("Citizen does not contain a valid E-prefixed RFID");
  }

  return validRFIDs[randomIndex(validRFIDs.length)];
}

// =====================================================
// RANDOM WEIGHT
// =====================================================

function generateWeight() {
  const weight = randomFloat(0.5, 12);

  return Number(weight.toFixed(2));
}

// =====================================================
// ERROR CODE
// =====================================================
//
// Test 1:
// Normal packet only.
//
// Later stress tests can introduce controlled
// error-code variation.
//
// =====================================================

function generateErrorCode() {
  if (TEST_NUMBER === 1) {
    return "R0L0G0D0C1";
  }

  const probability = Math.random();

  if (probability < 0.9) {
    return "R0L0G0D0C1";
  }

  if (probability < 0.94) {
    return "R1L0G0D0C1";
  }

  if (probability < 0.97) {
    return "R0L1G0D0C1";
  }

  if (probability < 0.985) {
    return "R0L0G1D0C1";
  }

  return "R1L1G0D0C1";
}

// =====================================================
// REMARKS
// =====================================================
//
// CRITICAL:
//
// For MANUAL/UHF packets, your real controller requires:
//
// remarks === ""
//
// Therefore DO NOT put:
// - SIM
// - COLLECTION
// - WARD
// - random text
//
// into remarks.
//
// =====================================================

function generateRemarks() {
  return "";
}

// =====================================================
// CREATE TELEMETRY PACKET
// =====================================================
//
// EXACT MANUAL TELEMETRY CONTRACT:
//
// rfidNumber  -> E... RFID
// iotTimestamp
// driverName
// vehicleId
// latitude
// longitude
// weight
// firmwareVersion
// unitNumber  -> SEWAC_01_UHF
// remarks     -> ""
// errCode
//
// =====================================================

function createPacket(vehicle) {
  const citizen = chooseCitizen(vehicle);

  const rfid = chooseRFID(citizen);

  // -----------------------------------------------
  // SMALL GPS MOVEMENT
  // -----------------------------------------------
  //
  // Start from the actual citizen coordinate.
  //
  // The tiny random offset makes the vehicle
  // movement less perfectly static.
  //

  const latitudeNoise = randomFloat(-0.000005, 0.000005);

  const longitudeNoise = randomFloat(-0.000005, 0.000005);

  const latitude = Number((citizen.latitude + latitudeNoise).toFixed(7));

  const longitude = Number((citizen.longitude + longitudeNoise).toFixed(7));

  // -----------------------------------------------
  // TIMESTAMP
  // -----------------------------------------------

  const iotTimestamp = new Date().toISOString();

  // -----------------------------------------------
  // WEIGHT
  // -----------------------------------------------

  const weight = generateWeight();

  // -----------------------------------------------
  // REMARKS
  // -----------------------------------------------

  const remarks = generateRemarks();

  // -----------------------------------------------
  // ERROR CODE
  // -----------------------------------------------

  const errCode = generateErrorCode();

  return {
    rfidNumber: rfid.rfid,

    iotTimestamp,

    driverName: vehicle.driverName,

    vehicleId: vehicle.vehicleId,

    latitude,

    longitude,

    weight,

    firmwareVersion: vehicle.firmwareVersion,

    unitNumber: vehicle.unitNumber,

    remarks,

    errCode,
  };
}

// =====================================================
// BUILD URL
// =====================================================
//
// IMPORTANT:
//
// URLSearchParams correctly handles:
//
// - timestamps
// - empty remarks
// - special characters
// - query encoding
//
// =====================================================

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

  // IMPORTANT:
  //
  // This produces:
  //
  // remarks=
  //
  // exactly as required by the manual API.

  params.set("remarks", packet.remarks);

  params.set("errCode", packet.errCode);

  url.search = params.toString();

  return url;
}

// =====================================================
// SEND PACKET
// =====================================================

async function sendPacket(vehicle, packet) {
  const url = buildRequestURL(packet);

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

        "User-Agent": "SEWAC-Stress-Simulator",
      },
    });

    const responseText = await response.text();

    // =============================================
    // SUCCESS
    // =============================================

    if (response.ok) {
      stats.packetsSuccessful++;

      statistics.successfulPackets++;

      stats.lastRFID = packet.rfidNumber;

      stats.lastLatitude = packet.latitude;

      stats.lastLongitude = packet.longitude;

      console.log(
        `[${new Date().toISOString()}] ` +
          `${vehicle.vehicleId} ` +
          `WARD=${vehicle.wardNo} ` +
          `RFID=${packet.rfidNumber} ` +
          `LAT=${packet.latitude} ` +
          `LNG=${packet.longitude} ` +
          `WEIGHT=${packet.weight}kg ` +
          `UNIT=${packet.unitNumber} ` +
          `REMARKS="${packet.remarks}" ` +
          `STATUS=${response.status}`,
      );

      return {
        success: true,

        status: response.status,

        body: responseText,
      };
    }

    // =============================================
    // FAILURE
    // =============================================

    stats.packetsFailed++;

    statistics.failedPackets++;

    console.error("");

    console.error("===============================================");

    console.error("TELEMETRY PACKET FAILED");

    console.error("===============================================");

    console.error(`Vehicle     : ${vehicle.vehicleId}`);

    console.error(`Ward        : ${vehicle.wardNo}`);

    console.error(`RFID        : ${packet.rfidNumber}`);

    console.error(`Unit        : ${packet.unitNumber}`);

    console.error(`Remarks     : ${packet.remarks}`);

    console.error(`Error Code  : ${packet.errCode}`);

    console.error(`Status      : ${response.status}`);

    console.error(`Response    : ${responseText}`);

    console.error(`URL         : ${url.toString()}`);

    console.error("===============================================");

    console.error("");

    return {
      success: false,

      status: response.status,

      body: responseText,
    };
  } catch (error) {
    stats.packetsFailed++;

    statistics.failedPackets++;

    console.error("");

    console.error("===============================================");

    console.error("REQUEST ERROR");

    console.error("===============================================");

    console.error(`Vehicle : ${vehicle.vehicleId}`);

    console.error(`Ward    : ${vehicle.wardNo}`);

    console.error(`RFID    : ${packet.rfidNumber}`);

    console.error(`Error   : ${error.message}`);

    console.error(`URL     : ${url.toString()}`);

    console.error("===============================================");

    console.error("");

    return {
      success: false,

      error: error.message,
    };
  }
}

// =====================================================
// VEHICLE LOOP
// =====================================================
//
// Each vehicle operates independently.
//
// This is intentionally NOT:
//
// packet 1
// packet 2
// packet 3
//
// Instead:
//
// Vehicle A -> random delay
// Vehicle B -> random delay
// Vehicle C -> random delay
//
// All three run concurrently.
//
// =====================================================

async function runVehicle(vehicle, stopTime) {
  console.log(`${vehicle.vehicleId} simulation started`);

  while (Date.now() < stopTime) {
    // -----------------------------------------------
    // RANDOM WAIT
    // -----------------------------------------------

    const delay = randomDelay(
      TEST_CONFIG.minDelaySeconds,
      TEST_CONFIG.maxDelaySeconds,
    );

    await new Promise((resolve) => setTimeout(resolve, delay));

    // -----------------------------------------------
    // STOP CHECK
    // -----------------------------------------------

    if (Date.now() >= stopTime) {
      break;
    }

    // -----------------------------------------------
    // CREATE PACKET
    // -----------------------------------------------

    const packet = createPacket(vehicle);

    // -----------------------------------------------
    // SEND PACKET
    // -----------------------------------------------

    await sendPacket(vehicle, packet);
  }

  console.log(`${vehicle.vehicleId} simulation stopped`);
}

// =====================================================
// PRINT SUMMARY
// =====================================================

function printSummary() {
  console.log("");

  console.log("=================================================");

  console.log("SIMULATION COMPLETE");

  console.log("=================================================");

  console.log("");

  console.log(`Test Number      : ${TEST_NUMBER}`);

  console.log(`Test Name        : ${TEST_CONFIG.name}`);

  console.log(`Duration         : 10 minutes`);

  console.log(
    `Random Delay     : ` +
      `${TEST_CONFIG.minDelaySeconds}s - ` +
      `${TEST_CONFIG.maxDelaySeconds}s`,
  );

  console.log(`Total Packets    : ${statistics.totalPackets}`);

  console.log(`Successful       : ${statistics.successfulPackets}`);

  console.log(`Failed           : ${statistics.failedPackets}`);

  console.log("");

  for (const vehicle of VEHICLES) {
    const stats = statistics.vehicles[vehicle.vehicleId];

    console.log("-------------------------------------------------");

    console.log(`Vehicle : ${vehicle.vehicleId}`);

    console.log(`Ward    : ${vehicle.wardNo}`);

    console.log(`Unit    : ${vehicle.unitNumber}`);

    console.log(`Packets : ${stats.packetsSent}`);

    console.log(`Success : ${stats.packetsSuccessful}`);

    console.log(`Failed  : ${stats.packetsFailed}`);

    console.log(`Last RFID : ${stats.lastRFID || "N/A"}`);

    console.log(
      `Last Position : ` +
        `${stats.lastLatitude ?? "N/A"}, ` +
        `${stats.lastLongitude ?? "N/A"}`,
    );
  }

  console.log("");

  console.log("=================================================");
}

// =====================================================
// MAIN
// =====================================================

async function main() {
  try {
    console.log("");

    console.log("=================================================");

    console.log("SEWAC RANDOMIZED VEHICLE STRESS SIMULATION");

    console.log("=================================================");

    console.log("");

    console.log(`Test       : ${TEST_NUMBER}`);

    console.log(`Scenario   : ${TEST_CONFIG.name}`);

    console.log(`Description: ${TEST_CONFIG.description}`);

    console.log(`Duration   : 10 minutes`);

    console.log(
      `Delay      : ` +
        `${TEST_CONFIG.minDelaySeconds}s - ` +
        `${TEST_CONFIG.maxDelaySeconds}s`,
    );

    console.log("");

    console.log("Telemetry Mode:");

    console.log("  MANUAL / UHF");

    console.log("  unitNumber = SEWAC_01_UHF");

    console.log('  remarks = ""');

    console.log("");

    console.log("Vehicles:");

    for (const vehicle of VEHICLES) {
      console.log(`  ${vehicle.vehicleId} -> ` + `Ward ${vehicle.wardNo}`);
    }

    console.log("");

    // -----------------------------------------------
    // LOAD REAL CITIZENS
    // -----------------------------------------------

    loadVehicleData();

    // -----------------------------------------------
    // START TIMER
    // -----------------------------------------------

    statistics.startedAt = new Date();

    const stopTime = Date.now() + SIMULATION_DURATION_MS;

    console.log("=================================================");

    console.log("SIMULATION STARTED");

    console.log("=================================================");

    console.log("");

    // -----------------------------------------------
    // RUN THREE VEHICLES CONCURRENTLY
    // -----------------------------------------------

    await Promise.all(VEHICLES.map((vehicle) => runVehicle(vehicle, stopTime)));

    // -----------------------------------------------
    // FINISH
    // -----------------------------------------------

    statistics.finishedAt = new Date();

    printSummary();
  } catch (error) {
    console.error("");

    console.error("=================================================");

    console.error("SIMULATION FAILED");

    console.error("=================================================");

    console.error("");

    console.error(error);

    console.error("");

    process.exit(1);
  }
}

// =====================================================
// START
// =====================================================

main();
