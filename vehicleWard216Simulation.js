require("dotenv").config();

const { randomInt } = require("crypto");

const helperPrisma =
  require("../config/helperPrisma");

const masterCitizenPrisma =
  require("../config/masterCitizenPrisma");

// =====================================================
// SEWAC - WARD 216 LIVE VEHICLE SIMULATION
// =====================================================
//
// HIERARCHY
//
// Bangalore
//   ↓
// Bengaluru South City Corporation
//   ↓
// Bommanahalli Division
//   ↓
// Ward 216
//   ↓
// Ibbluru
//
// VEHICLES
//
// KA05AB1237 -> Ward 216
// KA05AB1238 -> Ward 216
//
// DATA SOURCE
//
// Citizens:
//     master_citizen_data
//
// Ward boundary:
//     Master Citizen hierarchy
//
// Therefore this simulation does NOT use:
//     - hardcoded citizen coordinates
//     - CSV files
//     - hardcoded RFID values
//     - hardcoded ward boundary
//
// It reads the actual data from the databases.
//
// =====================================================


// =====================================================
// API
// =====================================================

const API_URL =
  process.env.TELEMETRY_API_URL ||
  "https://sewac-main.onrender.com/api/iot/telemetry/record";


// =====================================================
// WARD
// =====================================================

const TARGET_WARD_NO =
  216;

const TARGET_WARD_NAME =
  "Ibbluru";


// =====================================================
// SIMULATION
// =====================================================
//
// Default:
// 10 minutes
//
// Override:
//
// $env:SIMULATION_MINUTES="10"
//

const SIMULATION_MINUTES =
  Number(
    process.env.SIMULATION_MINUTES ||
      10
  );

const SIMULATION_DURATION_MS =
  SIMULATION_MINUTES *
  60 *
  1000;


// =====================================================
// PACKET INTERVAL
// =====================================================
//
// The truck does NOT send every packet at a fixed time.
//
// Each vehicle independently waits for a randomized interval.
//
// Default:
//
// 5 - 12 seconds
//
// Override:
//
// $env:MIN_DELAY_SECONDS="5"
// $env:MAX_DELAY_SECONDS="12"
//

const MIN_DELAY_SECONDS =
  Number(
    process.env.MIN_DELAY_SECONDS ||
      5
  );

const MAX_DELAY_SECONDS =
  Number(
    process.env.MAX_DELAY_SECONDS ||
      12
  );


// =====================================================
// MOVEMENT
// =====================================================
//
// Instead of teleporting directly from citizen A to citizen B,
// the vehicle moves gradually toward the next collection point.
//
// Movement speed is simulated in small GPS increments.
//
// One telemetry packet represents one movement step.
//
// =====================================================

const MOVEMENT_FRACTION_MIN =
  0.08;

const MOVEMENT_FRACTION_MAX =
  0.20;


// =====================================================
// TELEMETRY UNIT
// =====================================================

const TELEMETRY_UNIT =
  "SEWAC_01_UHF";


// =====================================================
// VEHICLES
// =====================================================
//
// Both vehicles operate independently.
//
// =====================================================

const VEHICLES = [

  {
    vehicleId:
      "KA05AB1237",

    wardNo:
      TARGET_WARD_NO,

    wardName:
      TARGET_WARD_NAME,

    driverName:
      "Ravi Kumar",

    firmwareVersion:
      "SEWAC-V1.0.0",

    unitNumber:
      TELEMETRY_UNIT,

    citizens: [],

    route: [],

    routeIndex:
      0,

    currentPosition:
      null,

    targetPosition:
      null,

    currentCitizen:
      null,
  },


  {
    vehicleId:
      "KA05AB1238",

    wardNo:
      TARGET_WARD_NO,

    wardName:
      TARGET_WARD_NAME,

    driverName:
      "Manjunath Rao",

    firmwareVersion:
      "SEWAC-V1.0.0",

    unitNumber:
      TELEMETRY_UNIT,

    citizens: [],

    route: [],

    routeIndex:
      0,

    currentPosition:
      null,

    targetPosition:
      null,

    currentCitizen:
      null,
  },

];


// =====================================================
// STATISTICS
// =====================================================

const statistics = {

  totalPackets:
    0,

  successfulPackets:
    0,

  failedPackets:
    0,

  vehicles: {},

};


// =====================================================
// INITIALIZE STATISTICS
// =====================================================

for (
  const vehicle of VEHICLES
) {

  statistics.vehicles[
    vehicle.vehicleId
  ] = {

    packetsSent:
      0,

    packetsSuccessful:
      0,

    packetsFailed:
      0,

    firstPacketAt:
      null,

    lastPacketAt:
      null,

    lastRFID:
      null,

    lastLatitude:
      null,

    lastLongitude:
      null,

  };

}


// =====================================================
// VALIDATE NUMBER
// =====================================================

function isValidCoordinate(
  value
) {

  return (
    Number.isFinite(
      Number(value)
    )
  );

}


// =====================================================
// RANDOM FLOAT
// =====================================================

function randomFloat(
  min,
  max
) {

  return (
    Math.random() *
      (max - min) +
    min
  );

}


// =====================================================
// RANDOM INDEX
// =====================================================

function randomIndex(
  length
) {

  if (
    length <= 0
  ) {

    throw new Error(
      "Cannot select from empty array"
    );

  }

  return randomInt(
    0,
    length
  );

}


// =====================================================
// RANDOM DELAY
// =====================================================

function randomDelay(
  minSeconds,
  maxSeconds
) {

  return Math.round(
    randomFloat(
      minSeconds,
      maxSeconds
    ) * 1000
  );

}


// =====================================================
// SLEEP
// =====================================================

function sleep(
  milliseconds
) {

  return new Promise(
    (resolve) =>
      setTimeout(
        resolve,
        milliseconds
      )
  );

}


// =====================================================
// NORMALIZE WARD
// =====================================================

function normalizeWardNumber(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return null;

  }

  const text =
    String(value)
      .trim();

  if (
    /^\d+$/.test(text)
  ) {

    return Number(text);

  }

  const match =
    text.match(/\d+/);

  if (!match) {

    return null;

  }

  return Number(
    match[0]
  );

}


// =====================================================
// SQL IDENTIFIER VALIDATION
// =====================================================

function validateIdentifier(
  value
) {

  if (
    typeof value !==
      "string" ||
    !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(
      value
    )
  ) {

    throw new Error(
      `Unsafe SQL identifier: ${value}`
    );

  }

  return value;

}


// =====================================================
// POINT IN POLYGON
// =====================================================
//
// GeoJSON coordinates are:
//
// [longitude, latitude]
//
// Our telemetry coordinates are:
//
// latitude, longitude
//
// =====================================================

function pointInPolygon(
  latitude,
  longitude,
  polygon
) {

  if (
    !Array.isArray(
      polygon
    ) ||
    polygon.length < 3
  ) {

    return false;

  }

  let inside =
    false;

  for (
    let i = 0,
      j = polygon.length - 1;

    i < polygon.length;

    j = i++
  ) {

    const xi =
      Number(
        polygon[i][1]
      );

    const yi =
      Number(
        polygon[i][0]
      );

    const xj =
      Number(
        polygon[j][1]
      );

    const yj =
      Number(
        polygon[j][0]
      );

    const intersect =
      (
        yi > latitude
      ) !==
        (
          yj > latitude
        ) &&
      longitude <
        (
          (xj - xi) *
            (latitude - yi)) /
            (yj - yi) +
          xi
        );

    if (
      intersect
    ) {

      inside =
        !inside;

    }

  }

  return inside;

}


// =====================================================
// GEOJSON POINT CHECK
// =====================================================

function pointInsideGeoJSON(
  latitude,
  longitude,
  geoBoundary
) {

  if (
    !geoBoundary
  ) {

    return true;

  }

  let geometry =
    geoBoundary;

  // -----------------------------------------------
  // Feature
  // -----------------------------------------------

  if (
    geometry.type ===
    "Feature"
  ) {

    geometry =
      geometry.geometry;

  }

  // -----------------------------------------------
  // FeatureCollection
  // -----------------------------------------------

  if (
    geometry.type ===
    "FeatureCollection"
  ) {

    return geometry.features.some(
      (
        feature
      ) =>
        pointInsideGeoJSON(
          latitude,
          longitude,
          feature
        )
    );

  }

  // -----------------------------------------------
  // Polygon
  // -----------------------------------------------

  if (
    geometry.type ===
    "Polygon"
  ) {

    const rings =
      geometry.coordinates;

    if (
      !rings?.length
    ) {

      return false;

    }

    // Outer boundary
    const outer =
      pointInPolygon(
        latitude,
        longitude,
        rings[0]
      );

    if (
      !outer
    ) {

      return false;

    }

    // Holes
    for (
      let i = 1;
      i < rings.length;
      i++
    ) {

      if (
        pointInPolygon(
          latitude,
          longitude,
          rings[i]
        )
      ) {

        return false;

      }

    }

    return true;

  }

  // -----------------------------------------------
  // MultiPolygon
  // -----------------------------------------------

  if (
    geometry.type ===
    "MultiPolygon"
  ) {

    return geometry.coordinates.some(
      (
        polygon
      ) => {

        if (
          !polygon?.length
        ) {

          return false;

        }

        const outer =
          pointInPolygon(
            latitude,
            longitude,
            polygon[0]
          );

        if (
          !outer
        ) {

          return false;

        }

        for (
          let i = 1;
          i < polygon.length;
          i++
        ) {

          if (
            pointInPolygon(
              latitude,
              longitude,
              polygon[i]
            )
          ) {

            return false;

          }

        }

        return true;

      }
    );

  }

  return false;

}


// =====================================================
// GET WARD MAPPING
// =====================================================
//
// MASTER CITIZEN HIERARCHY:
//
// city
//   ↓
// dynamic city table
//   ↓
// zone
//   ↓
// dynamic zone table
//   ↓
// division
//   ↓
// dynamic division table
//   ↓
// ward
//
// =====================================================

async function getWardMapping() {

  console.log("");

  console.log(
    "============================================================"
  );

  console.log(
    "LOADING WARD 216 FROM MASTER CITIZEN HIERARCHY"
  );

  console.log(
    "============================================================"
  );


  const cities =
    await masterCitizenPrisma
      .city_table.findMany({

        select: {

          city_id:
            true,

          city_name:
            true,

          city_table_name:
            true,

        },

      });


  for (
    const city of cities
  ) {

    if (
      !city.city_table_name
    ) {

      continue;

    }

    const cityTable =
      validateIdentifier(
        city.city_table_name
      );


    const zones =
      await masterCitizenPrisma
        .$queryRawUnsafe(
          `
          SELECT
            zone_id,
            zone_name,
            zone_table_name
          FROM "${cityTable}"
          `
        );


    for (
      const zone of zones
    ) {

      if (
        !zone.zone_table_name
      ) {

        continue;

      }

      const zoneTable =
        validateIdentifier(
          zone.zone_table_name
        );


      const divisions =
        await masterCitizenPrisma
          .$queryRawUnsafe(
            `
            SELECT
              division_id,
              division_name,
              division_table_name
            FROM "${zoneTable}"
            `
          );


      for (
        const division
        of divisions
      ) {

        if (
          !division.division_table_name
        ) {

          continue;

        }

        const divisionTable =
          validateIdentifier(
            division.division_table_name
          );


        const wards =
          await masterCitizenPrisma
            .$queryRawUnsafe(
              `
              SELECT
                ward_id,
                ward_no,
                ward_name,
                ward_table_name,
                geo_boundary
              FROM "${divisionTable}"
              WHERE ward_no::text = $1
              `,
              String(
                TARGET_WARD_NO
              )
            );


        for (
          const ward of wards
        ) {

          if (
            normalizeWardNumber(
              ward.ward_no
            ) !==
            TARGET_WARD_NO
          ) {

            continue;

          }


          console.log("");

          console.log(
            "Ward mapping found:"
          );

          console.log(
            `City       : ${city.city_name}`
          );

          console.log(
            `Zone       : ${zone.zone_name}`
          );

          console.log(
            `Division   : ${division.division_name}`
          );

          console.log(
            `Ward ID    : ${ward.ward_id}`
          );

          console.log(
            `Ward No    : ${ward.ward_no}`
          );

          console.log(
            `Ward Name  : ${ward.ward_name}`
          );

          console.log(
            `Ward Table : ${ward.ward_table_name}`
          );

          console.log(
            `Boundary   : ${
              ward.geo_boundary
                ? "FOUND"
                : "NOT FOUND"
            }`
          );

          console.log("");


          return {

            cityId:
              city.city_id,

            cityName:
              city.city_name,

            zoneId:
              zone.zone_id,

            zoneName:
              zone.zone_name,

            divisionId:
              division.division_id,

            divisionName:
              division.division_name,

            wardId:
              ward.ward_id,

            wardNo:
              Number(
                ward.ward_no
              ),

            wardName:
              ward.ward_name,

            wardTableName:
              ward.ward_table_name,

            geoBoundary:
              ward.geo_boundary,

          };

        }

      }

    }

  }


  throw new Error(
    `Ward number ${TARGET_WARD_NO} not found in Master Citizen hierarchy`
  );

}


// =====================================================
// LOAD ACTUAL CITIZENS
// =====================================================
//
// IMPORTANT:
//
// These are NOT synthetic citizens.
//
// They are read from:
//
// master_citizen_data
//
// Ward is normalized because your Helper DB stores
// ward as text.
//
// =====================================================

async function loadWardCitizens() {

  console.log(
    "Loading actual citizens from Helper DB..."
  );


  const citizens =
    await helperPrisma
      .master_citizen_data.findMany({

        where: {

          ward:
            String(
              TARGET_WARD_NO
            ),

        },

        orderBy: {

          id:
            "asc",

        },

        select: {

          id:
            true,

          personName:
            true,

          dryRFID:
            true,

          drySlno:
            true,

          wetRFID:
            true,

          wetSlno:
            true,

          lat:
            true,

          lng:
            true,

          ward:
            true,

        },

      });


  console.log(
    `Helper DB returned ${citizens.length} Ward ${TARGET_WARD_NO} citizens.`
  );


  const validCitizens =
    citizens

      .map(
        (
          citizen
        ) => ({

          id:
            citizen.id,

          personName:
            String(
              citizen.personName ||
                ""
            ).trim(),

          dryRFID:
            String(
              citizen.dryRFID ||
                ""
            ).trim(),

          drySlno:
            String(
              citizen.drySlno ||
                ""
            ).trim(),

          wetRFID:
            String(
              citizen.wetRFID ||
                ""
            ).trim(),

          wetSlno:
            String(
              citizen.wetSlno ||
                ""
            ).trim(),

          latitude:
            Number(
              citizen.lat
            ),

          longitude:
            Number(
              citizen.lng
            ),

          ward:
            String(
              citizen.ward ||
                ""
            ).trim(),

        })
      )

      .filter(
        (
          citizen
        ) => {

          const hasRFID =
            (
              citizen.dryRFID &&
              citizen.dryRFID.startsWith(
                "E"
              )
            ) ||
            (
              citizen.wetRFID &&
              citizen.wetRFID.startsWith(
                "E"
              )
            );

          return (
            hasRFID &&
            isValidCoordinate(
              citizen.latitude
            ) &&
            isValidCoordinate(
              citizen.longitude
            )
          );

        }
      );


  if (
    validCitizens.length === 0
  ) {

    throw new Error(
      `No valid RFID/GPS citizens found for Ward ${TARGET_WARD_NO}`
    );

  }


  return validCitizens;

}


// =====================================================
// FILTER CITIZENS BY ACTUAL WARD BOUNDARY
// =====================================================

function filterCitizensInsideBoundary(
  citizens,
  geoBoundary
) {

  // ---------------------------------------------------
  // If boundary does not exist, don't destroy usable
  // real citizen data.
  // ---------------------------------------------------

  if (
    !geoBoundary
  ) {

    console.warn(
      "⚠️ Ward boundary not available. Using all valid Ward citizens."
    );

    return citizens;

  }


  const inside =
    citizens.filter(
      (
        citizen
      ) =>
        pointInsideGeoJSON(
          citizen.latitude,
          citizen.longitude,
          geoBoundary
        )
    );


  console.log("");

  console.log(
    `Citizens inside Ward ${TARGET_WARD_NO} boundary: ${inside.length}/${citizens.length}`
  );


  if (
    inside.length === 0
  ) {

    throw new Error(
      `No citizen coordinates fall inside the actual Ward ${TARGET_WARD_NO} boundary. Check Helper DB coordinates and ward boundary.`
    );

  }


  return inside;

}


// =====================================================
// SHUFFLE
// =====================================================

function shuffle(
  array
) {

  const copy =
    [...array];

  for (
    let i =
      copy.length - 1;

    i > 0;

    i--
  ) {

    const j =
      randomInt(
        0,
        i + 1
      );

    [
      copy[i],
      copy[j],
    ] = [
      copy[j],
      copy[i],
    ];

  }

  return copy;

}


// =====================================================
// BUILD VEHICLE ROUTES
// =====================================================
//
// Each vehicle receives its own randomized route.
//
// This prevents both trucks from following exactly the
// same citizen sequence.
//
// =====================================================

function buildVehicleRoutes(
  citizens
) {

  for (
    const vehicle
    of VEHICLES
  ) {

    vehicle.route =
      shuffle(
        citizens
      );

    vehicle.routeIndex =
      randomIndex(
        vehicle.route.length
      );

    const startingCitizen =
      vehicle.route[
        vehicle.routeIndex
      ];

    vehicle.currentCitizen =
      startingCitizen;

    vehicle.currentPosition = {

      latitude:
        startingCitizen.latitude,

      longitude:
        startingCitizen.longitude,

    };

    vehicle.targetPosition = {

      latitude:
        startingCitizen.latitude,

      longitude:
        startingCitizen.longitude,

    };

  }

}


// =====================================================
// GET NEXT CITIZEN
// =====================================================

function getNextCitizen(
  vehicle
) {

  vehicle.routeIndex =
    (
      vehicle.routeIndex +
      1
    ) %
    vehicle.route.length;


  const citizen =
    vehicle.route[
      vehicle.routeIndex
    ];


  vehicle.currentCitizen =
    citizen;


  vehicle.targetPosition = {

    latitude:
      citizen.latitude,

    longitude:
      citizen.longitude,

  };


  return citizen;

}


// =====================================================
// DISTANCE
// =====================================================
//
// Approximate Haversine distance in meters.
//
// =====================================================

function distanceMeters(
  lat1,
  lng1,
  lat2,
  lng2
) {

  const R =
    6371000;

  const toRad =
    (value) =>
      value *
      Math.PI /
      180;

  const dLat =
    toRad(
      lat2 - lat1
    );

  const dLng =
    toRad(
      lng2 - lng1
    );

  const a =
    Math.sin(
      dLat / 2
    ) ** 2 +
    Math.cos(
      toRad(lat1)
    ) *
      Math.cos(
        toRad(lat2)
      ) *
      Math.sin(
        dLng / 2
      ) ** 2;

  return (
    R *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(
        1 - a
      )
    )
  );

}


// =====================================================
// MOVE VEHICLE
// =====================================================
//
// Move a fraction of the distance toward the target.
//
// =====================================================

function moveVehicle(
  vehicle
) {

  if (
    !vehicle.currentPosition
  ) {

    return;

  }


  if (
    !vehicle.targetPosition
  ) {

    getNextCitizen(
      vehicle
    );

  }


  const current =
    vehicle.currentPosition;

  const target =
    vehicle.targetPosition;


  const distance =
    distanceMeters(
      current.latitude,
      current.longitude,
      target.latitude,
      target.longitude
    );


  // ---------------------------------------------------
  // Already at collection point
  // ---------------------------------------------------

  if (
    distance < 3
  ) {

    getNextCitizen(
      vehicle
    );

    return;

  }


  const fraction =
    randomFloat(
      MOVEMENT_FRACTION_MIN,
      MOVEMENT_FRACTION_MAX
    );


  const latitude =
    current.latitude +
    (
      target.latitude -
      current.latitude
    ) *
      fraction;


  const longitude =
    current.longitude +
    (
      target.longitude -
      current.longitude
    ) *
      fraction;


  vehicle.currentPosition = {

    latitude:
      Number(
        latitude.toFixed(7)
      ),

    longitude:
      Number(
        longitude.toFixed(7)
      ),

  };

}


// =====================================================
// RFID SELECTION
// =====================================================

function chooseRFID(
  citizen
) {

  const validRFIDs = [];


  if (
    citizen.dryRFID &&
    citizen.dryRFID.startsWith(
      "E"
    )
  ) {

    validRFIDs.push({

      rfid:
        citizen.dryRFID,

      serial:
        citizen.drySlno,

      type:
        "DRY",

    });

  }


  if (
    citizen.wetRFID &&
    citizen.wetRFID.startsWith(
      "E"
    )
  ) {

    validRFIDs.push({

      rfid:
        citizen.wetRFID,

      serial:
        citizen.wetSlno,

      type:
        "WET",

    });

  }


  if (
    validRFIDs.length === 0
  ) {

    throw new Error(
      `Citizen ${citizen.id} has no valid E-prefixed RFID`
    );

  }


  return validRFIDs[
    randomIndex(
      validRFIDs.length
    )
  ];

}


// =====================================================
// WEIGHT
// =====================================================
//
// Realistic household collection amount.
//
// =====================================================

function generateWeight() {

  const weight =
    randomFloat(
      0.5,
      12
    );

  return Number(
    weight.toFixed(2)
  );

}


// =====================================================
// REMARKS
// =====================================================
//
// IMPORTANT:
//
// Your controller identifies MANUAL/UHF packets using:
//
// remarks === ""
//
// Therefore this MUST remain empty.
//
// =====================================================

function generateRemarks() {

  return "";

}


// =====================================================
// ERROR CODE
// =====================================================

function generateErrorCode() {

  return "R0L0G0D0C1";

}


// =====================================================
// CREATE PACKET
// =====================================================

function createPacket(
  vehicle
) {

  // ---------------------------------------------------
  // Move truck first
  // ---------------------------------------------------

  moveVehicle(
    vehicle
  );


  // ---------------------------------------------------
  // Current citizen is the collection target
  // ---------------------------------------------------

  const citizen =
    vehicle.currentCitizen;


  if (
    !citizen
  ) {

    throw new Error(
      `${vehicle.vehicleId} has no current citizen`
    );

  }


  // ---------------------------------------------------
  // RFID
  // ---------------------------------------------------

  const rfid =
    chooseRFID(
      citizen
    );


  // ---------------------------------------------------
  // GPS
  // ---------------------------------------------------

  const latitude =
    Number(
      vehicle.currentPosition
        .latitude
        .toFixed(7)
    );

  const longitude =
    Number(
      vehicle.currentPosition
        .longitude
        .toFixed(7)
    );


  // ---------------------------------------------------
  // TIMESTAMP
  // ---------------------------------------------------

  const iotTimestamp =
    new Date()
      .toISOString();


  // ---------------------------------------------------
  // WEIGHT
  // ---------------------------------------------------

  const weight =
    generateWeight();


  // ---------------------------------------------------
  // REMARKS
  // ---------------------------------------------------

  const remarks =
    generateRemarks();


  // ---------------------------------------------------
  // ERROR CODE
  // ---------------------------------------------------

  const errCode =
    generateErrorCode();


  return {

    rfidNumber:
      rfid.rfid,

    iotTimestamp,

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

    remarks,

    errCode,

  };

}


// =====================================================
// BUILD REQUEST URL
// =====================================================

function buildRequestURL(
  packet
) {

  const url =
    new URL(
      API_URL
    );


  const params =
    new URLSearchParams();


  params.set(
    "rfidNumber",
    packet.rfidNumber
  );


  params.set(
    "iotTimestamp",
    packet.iotTimestamp
  );


  params.set(
    "driverName",
    packet.driverName
  );


  params.set(
    "vehicleId",
    packet.vehicleId
  );


  params.set(
    "latitude",
    String(
      packet.latitude
    )
  );


  params.set(
    "longitude",
    String(
      packet.longitude
    )
  );


  params.set(
    "weight",
    String(
      packet.weight
    )
  );


  params.set(
    "firmwareVersion",
    packet.firmwareVersion
  );


  params.set(
    "unitNumber",
    packet.unitNumber
  );


  // MUST remain empty.

  params.set(
    "remarks",
    packet.remarks
  );


  params.set(
    "errCode",
    packet.errCode
  );


  url.search =
    params.toString();


  return url;

}


// =====================================================
// SEND PACKET
// =====================================================

async function sendPacket(
  vehicle,
  packet
) {

  const url =
    buildRequestURL(
      packet
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

          method:
            "GET",

          headers: {

            Accept:
              "application/json",

            "User-Agent":
              "SEWAC-Ward216-Simulator",

          },

        }
      );


    const responseText =
      await response.text();


    // =============================================
    // SUCCESS
    // =============================================

    if (
      response.ok
    ) {

      stats.packetsSuccessful++;

      statistics.successfulPackets++;


      stats.lastRFID =
        packet.rfidNumber;


      stats.lastLatitude =
        packet.latitude;


      stats.lastLongitude =
        packet.longitude;


      console.log(

        `[${new Date().toISOString()}] ` +

        `${vehicle.vehicleId} ` +

        `WARD=${vehicle.wardNo} ` +

        `IBBLURU ` +

        `RFID=${packet.rfidNumber} ` +

        `LAT=${packet.latitude} ` +

        `LNG=${packet.longitude} ` +

        `WEIGHT=${packet.weight}kg ` +

        `STATUS=${response.status}`

      );


      return {

        success:
          true,

        status:
          response.status,

        body:
          responseText,

      };

    }


    // =============================================
    // FAILURE
    // =============================================

    stats.packetsFailed++;

    statistics.failedPackets++;


    console.error("");

    console.error(
      "============================================================"
    );

    console.error(
      "TELEMETRY PACKET FAILED"
    );

    console.error(
      "============================================================"
    );

    console.error(
      `Vehicle    : ${vehicle.vehicleId}`
    );

    console.error(
      `Ward       : ${vehicle.wardNo}`
    );

    console.error(
      `RFID       : ${packet.rfidNumber}`
    );

    console.error(
      `Latitude   : ${packet.latitude}`
    );

    console.error(
      `Longitude  : ${packet.longitude}`
    );

    console.error(
      `Status     : ${response.status}`
    );

    console.error(
      `Response   : ${responseText}`
    );

    console.error(
      "============================================================"
    );


    return {

      success:
        false,

      status:
        response.status,

      body:
        responseText,

    };

  } catch (
    error
  ) {

    stats.packetsFailed++;

    statistics.failedPackets++;


    console.error("");

    console.error(
      "============================================================"
    );

    console.error(
      "REQUEST ERROR"
    );

    console.error(
      "============================================================"
    );

    console.error(
      `Vehicle : ${vehicle.vehicleId}`
    );

    console.error(
      `Ward    : ${vehicle.wardNo}`
    );

    console.error(
      `RFID    : ${packet.rfidNumber}`
    );

    console.error(
      `Error   : ${error.message}`
    );

    console.error(
      `URL     : ${url.toString()}`
    );

    console.error(
      "============================================================"
    );


    return {

      success:
        false,

      error:
        error.message,

    };

  }

}


// =====================================================
// VEHICLE LOOP
// =====================================================
//
// Every vehicle gets its own independent loop.
//
// KA05AB1237
//        ↓
// random wait
//        ↓
// move
//        ↓
// send
//
// KA05AB1238
//        ↓
// random wait
//        ↓
// move
//        ↓
// send
//
// Both happen concurrently.
//
// =====================================================

async function runVehicle(
  vehicle,
  stopTime
) {

  console.log("");

  console.log(
    `🚛 ${vehicle.vehicleId} simulation started`
  );

  console.log(
    `   Ward       : ${vehicle.wardNo}`
  );

  console.log(
    `   Area       : ${vehicle.wardName}`
  );

  console.log(
    `   Citizens   : ${vehicle.citizens.length}`
  );

  console.log("");


  while (
    Date.now() <
    stopTime
  ) {

    // -----------------------------------------------
    // RANDOM WAIT
    // -----------------------------------------------

    const delay =
      randomDelay(
        MIN_DELAY_SECONDS,
        MAX_DELAY_SECONDS
      );


    await sleep(
      delay
    );


    // -----------------------------------------------
    // STOP CHECK
    // -----------------------------------------------

    if (
      Date.now() >=
      stopTime
    ) {

      break;

    }


    try {

      // ---------------------------------------------
      // CREATE PACKET
      // ---------------------------------------------

      const packet =
        createPacket(
          vehicle
        );


      // ---------------------------------------------
      // SEND PACKET
      // ---------------------------------------------

      await sendPacket(
        vehicle,
        packet
      );

    } catch (
      error
    ) {

      console.error("");

      console.error(
        `Vehicle ${vehicle.vehicleId} packet generation failed:`,
        error.message
      );

    }

  }


  console.log("");

  console.log(
    `🛑 ${vehicle.vehicleId} simulation stopped`
  );

}


// =====================================================
// PRINT SUMMARY
// =====================================================

function printSummary() {

  console.log("");

  console.log(
    "============================================================"
  );

  console.log(
    "🚛 WARD 216 IBBLURU SIMULATION COMPLETE"
  );

  console.log(
    "============================================================"
  );

  console.log("");

  console.log(
    `Ward             : ${TARGET_WARD_NO}`
  );

  console.log(
    `Area             : ${TARGET_WARD_NAME}`
  );

  console.log(
    `Duration         : ${SIMULATION_MINUTES} minutes`
  );

  console.log(
    `Random Delay     : ${MIN_DELAY_SECONDS}s - ${MAX_DELAY_SECONDS}s`
  );

  console.log(
    `Total Packets    : ${statistics.totalPackets}`
  );

  console.log(
    `Successful       : ${statistics.successfulPackets}`
  );

  console.log(
    `Failed           : ${statistics.failedPackets}`
  );

  console.log("");

  for (
    const vehicle
    of VEHICLES
  ) {

    const stats =
      statistics.vehicles[
        vehicle.vehicleId
      ];


    console.log(
      "------------------------------------------------------------"
    );

    console.log(
      `Vehicle          : ${vehicle.vehicleId}`
    );

    console.log(
      `Ward             : ${vehicle.wardNo}`
    );

    console.log(
      `Area             : ${vehicle.wardName}`
    );

    console.log(
      `Unit             : ${vehicle.unitNumber}`
    );

    console.log(
      `Citizens Used    : ${vehicle.citizens.length}`
    );

    console.log(
      `Packets          : ${stats.packetsSent}`
    );

    console.log(
      `Success          : ${stats.packetsSuccessful}`
    );

    console.log(
      `Failed           : ${stats.packetsFailed}`
    );

    console.log(
      `Last RFID        : ${stats.lastRFID || "N/A"}`
    );

    console.log(
      `Last Position    : ` +
        `${stats.lastLatitude ?? "N/A"}, ` +
        `${stats.lastLongitude ?? "N/A"}`
    );

  }


  console.log("");

  console.log(
    "============================================================"
  );

}


// =====================================================
// MAIN
// =====================================================

async function main() {

  try {

    console.log("");

    console.log(
      "============================================================"
    );

    console.log(
      "🚛 SEWAC WARD 216 VEHICLE SIMULATION"
    );

    console.log(
      "============================================================"
    );

    console.log("");

    console.log(
      "Hierarchy:"
    );

    console.log(
      "  Bangalore"
    );

    console.log(
      "      ↓"
    );

    console.log(
      "  Bengaluru South City Corporation"
    );

    console.log(
      "      ↓"
    );

    console.log(
      "  Bommanahalli Division"
    );

    console.log(
      "      ↓"
    );

    console.log(
      "  Ward 216 - Ibbluru"
    );

    console.log("");

    console.log(
      "Vehicles:"
    );

    console.log(
      "  KA05AB1237"
    );

    console.log(
      "  KA05AB1238"
    );

    console.log("");

    console.log(
      `API: ${API_URL}`
    );

    console.log(
      `Duration: ${SIMULATION_MINUTES} minutes`
    );

    console.log(
      `Packet interval: ${MIN_DELAY_SECONDS}s - ${MAX_DELAY_SECONDS}s`
    );

    console.log("");

    console.log(
      "Telemetry Mode:"
    );

    console.log(
      "  MANUAL / UHF"
    );

    console.log(
      `  unitNumber = ${TELEMETRY_UNIT}`
    );

    console.log(
      '  remarks = ""'
    );

    console.log("");


    // ===================================================
    // LOAD WARD
    // ===================================================

    const ward =
      await getWardMapping();


    // ===================================================
    // LOAD CITIZENS
    // ===================================================

    const citizens =
      await loadWardCitizens();


    // ===================================================
    // FILTER USING ACTUAL BOUNDARY
    // ===================================================

    const usableCitizens =
      filterCitizensInsideBoundary(
        citizens,
        ward.geoBoundary
      );


    console.log("");

    console.log(
      `✅ ${usableCitizens.length} usable Ward ${TARGET_WARD_NO} citizens loaded`
    );


    // ===================================================
    // ASSIGN DATA TO VEHICLES
    // ===================================================

    for (
      const vehicle
      of VEHICLES
    ) {

      vehicle.citizens =
        usableCitizens;

    }


    // ===================================================
    // BUILD ROUTES
    // ===================================================

    buildVehicleRoutes(
      usableCitizens
    );


    // ===================================================
    // PRINT VEHICLE START POSITIONS
    // ===================================================

    console.log("");

    console.log(
      "Initial vehicle positions:"
    );


    for (
      const vehicle
      of VEHICLES
    ) {

      console.log(
        `  ${vehicle.vehicleId} -> ` +
        `${vehicle.currentPosition.latitude}, ` +
        `${vehicle.currentPosition.longitude}`
      );

    }


    console.log("");

    console.log(
      "============================================================"
    );

    console.log(
      "SIMULATION STARTING"
    );

    console.log(
      "============================================================"
    );

    console.log("");


    // ===================================================
    // STOP TIME
    // ===================================================

    const stopTime =
      Date.now() +
      SIMULATION_DURATION_MS;


    // ===================================================
    // RUN BOTH VEHICLES CONCURRENTLY
    // ===================================================

    await Promise.all(

      VEHICLES.map(
        (
          vehicle
        ) =>
          runVehicle(
            vehicle,
            stopTime
          )
      )

    );


    // ===================================================
    // SUMMARY
    // ===================================================

    printSummary();


  } catch (
    error
  ) {

    console.error("");

    console.error(
      "============================================================"
    );

    console.error(
      "❌ SIMULATION FAILED"
    );

    console.error(
      "============================================================"
    );

    console.error(
      error
    );

    console.error(
      "============================================================"
    );

    process.exitCode =
      1;

  } finally {

    try {

      await helperPrisma
        .$disconnect();

    } catch (
      error
    ) {

      console.error(
        "Helper Prisma disconnect error:",
        error.message
      );

    }


    try {

      await masterCitizenPrisma
        .$disconnect();

    } catch (
      error
    ) {

      console.error(
        "Master Citizen Prisma disconnect error:",
        error.message
      );

    }

  }

}


// =====================================================
// START
// =====================================================

main();