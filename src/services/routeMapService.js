const mainDb = require("../config/mainDb");
const masterCitizenPrisma = require("../config/masterCitizenPrisma");
const telemetryDb = require("../config/telemetryDb");

/*
|--------------------------------------------------------------------------
| DATABASE IDENTIFIER SAFETY
|--------------------------------------------------------------------------
*/

const IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;

const quoteIdentifier = (identifier) => {
  if (typeof identifier !== "string" || !IDENTIFIER_REGEX.test(identifier)) {
    throw new Error(`Unsafe database identifier: ${identifier}`);
  }

  return `"${identifier.replace(/"/g, '""')}"`;
};

/*
|--------------------------------------------------------------------------
| INPUT PARSERS
|--------------------------------------------------------------------------
*/

const parsePositiveInteger = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    const error = new Error(
      "latitude, longitude, cityId, zoneId, divisionId and wardId are required.",
    );

    error.statusCode = 400;

    throw error;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    const error = new Error(`${fieldName} must be a positive integer`);

    error.statusCode = 400;

    throw error;
  }

  return parsed;
};

const parseCoordinate = (value, fieldName, min, max) => {
  if (value === undefined || value === null || value === "") {
    const error = new Error(
      "latitude, longitude, cityId, zoneId, divisionId and wardId are required.",
    );

    error.statusCode = 400;

    throw error;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    const error = new Error("Invalid latitude or longitude.");

    error.statusCode = 400;

    throw error;
  }

  return parsed;
};

/*
|--------------------------------------------------------------------------
| DAY TABLE
|--------------------------------------------------------------------------
|
| Example:
|
| 24 August 2026
|       ↓
| day_24082026
|
|--------------------------------------------------------------------------
*/

const getDayTableName = (date) => {
  const dd = String(date.getDate()).padStart(2, "0");

  const mm = String(date.getMonth() + 1).padStart(2, "0");

  const yyyy = date.getFullYear();

  return `day_${dd}${mm}${yyyy}`;
};

/*
|--------------------------------------------------------------------------
| CITY → ZONE → DIVISION → WARD
|--------------------------------------------------------------------------
*/

const getSelectedWard = async ({ cityId, zoneId, divisionId, wardId }) => {
  const selectedCityId = parsePositiveInteger(cityId, "cityId");

  const selectedZoneId = parsePositiveInteger(zoneId, "zoneId");

  const selectedDivisionId = parsePositiveInteger(divisionId, "divisionId");

  const selectedWardId = parsePositiveInteger(wardId, "wardId");

  /*
   * CITY
   */

  const city = await masterCitizenPrisma.city_table.findUnique({
    where: {
      city_id: selectedCityId,
    },
  });

  if (!city) {
    const error = new Error("City not found");

    error.statusCode = 400;

    throw error;
  }

  if (!city.city_table_name) {
    const error = new Error("City has no dynamic table registered");

    error.statusCode = 400;

    throw error;
  }

  const cityTable = quoteIdentifier(city.city_table_name);

  /*
   * ZONE
   */

  const zones = await masterCitizenPrisma.$queryRawUnsafe(
    `
        SELECT
          zone_id,
          zone_name,
          zone_table_name
        FROM ${cityTable}
        WHERE zone_id = $1
        LIMIT 1
      `,
    selectedZoneId,
  );

  if (zones.length === 0) {
    const error = new Error("Zone not found in selected city");

    error.statusCode = 400;

    throw error;
  }

  const zone = zones[0];

  if (!zone.zone_table_name) {
    const error = new Error("Selected zone has no dynamic table registered");

    error.statusCode = 400;

    throw error;
  }

  const zoneTable = quoteIdentifier(zone.zone_table_name);

  /*
   * DIVISION
   */

  const divisions = await masterCitizenPrisma.$queryRawUnsafe(
    `
        SELECT
          division_id,
          division_name,
          division_table_name
        FROM ${zoneTable}
        WHERE division_id = $1
        LIMIT 1
      `,
    selectedDivisionId,
  );

  if (divisions.length === 0) {
    const error = new Error("Division not found in selected zone");

    error.statusCode = 400;

    throw error;
  }

  const division = divisions[0];

  if (!division.division_table_name) {
    const error = new Error(
      "Selected division has no dynamic table registered",
    );

    error.statusCode = 400;

    throw error;
  }

  const divisionTable = quoteIdentifier(division.division_table_name);

  /*
   * WARD
   *
   * IMPORTANT:
   *
   * Citizen sends wardId = 216.
   *
   * Depending on Master Citizen data:
   *
   * ward_id may be an internal ID
   * ward_no may be the actual ward number.
   *
   * We therefore accept either.
   */

  const wards = await masterCitizenPrisma.$queryRawUnsafe(
    `
        SELECT
          ward_id,
          ward_no,
          ward_name,
          ward_table_name
        FROM ${divisionTable}
        WHERE ward_id = $1
           OR ward_no = $1
        ORDER BY
          CASE
            WHEN ward_id = $1 THEN 0
            ELSE 1
          END
        LIMIT 1
      `,
    selectedWardId,
  );

  if (wards.length === 0) {
    const error = new Error("Ward not found in selected division");

    error.statusCode = 400;

    throw error;
  }

  const ward = wards[0];

  const wardNo = Number(ward.ward_no);

  if (!Number.isInteger(wardNo)) {
    const error = new Error("Selected ward has an invalid ward number");

    error.statusCode = 400;

    throw error;
  }

  return {
    cityId: selectedCityId,

    cityName: city.city_name,

    zoneId: selectedZoneId,

    zoneName: zone.zone_name,

    divisionId: selectedDivisionId,

    divisionName: division.division_name,

    wardId: selectedWardId,

    wardNo,

    wardName: ward.ward_name,

    wardTableName: ward.ward_table_name,

    masterWardId: Number(ward.ward_id),
  };
};

/*
|--------------------------------------------------------------------------
| VEHICLES FOR SELECTED WARD
|--------------------------------------------------------------------------
|
| IMPORTANT FIX:
|
| vehicle_master is matched using ward_no.
|
| We do NOT additionally require city/zone/division/ward
| names to match because those textual values can differ
| from the Master Citizen hierarchy.
|
|--------------------------------------------------------------------------
*/

const getVehicleTablesForWard = async (date, ward) => {
  /*
   * Get vehicles registered for this ward.
   *
   * IMPORTANT:
   *
   * Your vehicle_master contains ward_no = 216.
   *
   * Therefore ward_no is the authoritative
   * vehicle-to-ward mapping here.
   */

  const vehicleResult = await mainDb.query(
    `
        SELECT
          vehicle_id,
          vehicle_type,
          city,
          zone,
          division,
          ward,
          ward_no
        FROM vehicle_master
        WHERE ward_no = $1
        ORDER BY vehicle_id ASC
      `,
    [ward.wardNo],
  );

  const registeredVehicles = vehicleResult.rows.map((row) => ({
    vehicleNumber:
      row.vehicle_id === null || row.vehicle_id === undefined
        ? null
        : String(row.vehicle_id).trim(),

    vehicleType: row.vehicle_type || null,

    wardNo:
      row.ward_no === null || row.ward_no === undefined
        ? ward.wardNo
        : Number(row.ward_no),

    vehicleTableName: null,
  }));

  /*
   * No vehicles registered.
   */

  if (registeredVehicles.length === 0) {
    return [];
  }

  /*
   * Resolve today's vehicle telemetry tables.
   */

  const dayTable = getDayTableName(date);

  const dayIdentifier = quoteIdentifier(dayTable);

  const mappingByVehicle = new Map();

  try {
    const rows = await telemetryDb.$queryRawUnsafe(
      `
          SELECT
            vehicle_number,
            vehicle_table_name,
            ward_no
          FROM ${dayIdentifier}
          WHERE ward_no = $1
            AND vehicle_number IS NOT NULL
            AND vehicle_table_name IS NOT NULL
        `,
      ward.wardNo,
    );

    for (const row of rows) {
      const vehicleNumber =
        row.vehicle_number === null || row.vehicle_number === undefined
          ? null
          : String(row.vehicle_number).trim();

      if (
        !vehicleNumber ||
        typeof row.vehicle_table_name !== "string" ||
        !IDENTIFIER_REGEX.test(row.vehicle_table_name)
      ) {
        continue;
      }

      mappingByVehicle.set(vehicleNumber, row.vehicle_table_name);
    }
  } catch (error) {
    /*
     * No day table means no telemetry
     * mapping for today.
     */

    if (error?.code !== "42P01") {
      throw error;
    }
  }

  /*
   * Keep ALL registered vehicles.
   *
   * Vehicles without telemetry are returned
   * with null GPS and INACTIVE status.
   */

  return registeredVehicles.map((vehicle) => ({
    ...vehicle,

    vehicleTableName: mappingByVehicle.get(vehicle.vehicleNumber) || null,
  }));
};

/*
|--------------------------------------------------------------------------
| ADD YESTERDAY'S TELEMETRY TABLE REFERENCES
|--------------------------------------------------------------------------
*/

const addYesterdayTelemetryMappings = async (vehicleTables, wardNo) => {
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayDayTable = getDayTableName(yesterday);

  const yesterdayIdentifier = quoteIdentifier(yesterdayDayTable);

  const knownVehicles = new Set(
    vehicleTables.map((vehicle) => vehicle.vehicleNumber).filter(Boolean),
  );

  try {
    const rows = await telemetryDb.$queryRawUnsafe(
      `
            SELECT
              vehicle_number,
              vehicle_table_name,
              ward_no
            FROM ${yesterdayIdentifier}
            WHERE ward_no = $1
              AND vehicle_number IS NOT NULL
              AND vehicle_table_name IS NOT NULL
          `,
      wardNo,
    );

    const mappingByVehicle = new Map();

    for (const row of rows) {
      const vehicleNumber =
        row.vehicle_number === null || row.vehicle_number === undefined
          ? null
          : String(row.vehicle_number).trim();

      if (
        !vehicleNumber ||
        !knownVehicles.has(vehicleNumber) ||
        typeof row.vehicle_table_name !== "string" ||
        !IDENTIFIER_REGEX.test(row.vehicle_table_name)
      ) {
        continue;
      }

      mappingByVehicle.set(vehicleNumber, row.vehicle_table_name);
    }

    return vehicleTables.map((vehicle) => {
      const yesterdayTable = mappingByVehicle.get(vehicle.vehicleNumber);

      if (yesterdayTable && yesterdayTable !== vehicle.vehicleTableName) {
        return {
          ...vehicle,

          additionalVehicleTableName: yesterdayTable,
        };
      }

      return vehicle;
    });
  } catch (error) {
    if (error?.code === "42P01") {
      return vehicleTables;
    }

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| HAVERSINE DISTANCE
|--------------------------------------------------------------------------
*/

const calculateDistanceKm = (latitude1, longitude1, latitude2, longitude2) => {
  const EARTH_RADIUS_KM = 6371;

  const toRadians = (value) => (value * Math.PI) / 180;

  const dLatitude = toRadians(latitude2 - latitude1);

  const dLongitude = toRadians(longitude2 - longitude1);

  const lat1 = toRadians(latitude1);

  const lat2 = toRadians(latitude2);

  const a =
    Math.sin(dLatitude / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLongitude / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Number((EARTH_RADIUS_KM * c).toFixed(2));
};

/*
|--------------------------------------------------------------------------
| LATEST GPS + LIVE STATUS
|--------------------------------------------------------------------------
*/

const getLatestVehiclePositions = async (vehicleTables) => {
  const now = new Date();

  /*
  |--------------------------------------------------------------------------
  | VEHICLE IS ACTIVE IF TELEMETRY IS WITHIN LAST 30 MINUTES
  |--------------------------------------------------------------------------
  */

  const inactivityLimit = new Date(now.getTime() - 30 * 60 * 1000);

  const results = [];

  for (const vehicle of vehicleTables) {
    if (!vehicle.vehicleNumber) {
      continue;
    }

    /*
    |--------------------------------------------------------------------------
    | CURRENT + FALLBACK TELEMETRY TABLES
    |--------------------------------------------------------------------------
    */

    const tableNames = [
      vehicle.vehicleTableName,
      vehicle.additionalVehicleTableName,
    ].filter(
      (name, index, array) =>
        name && IDENTIFIER_REGEX.test(name) && array.indexOf(name) === index,
    );

    let latest = null;

    /*
    |--------------------------------------------------------------------------
    | FIND LATEST GPS PACKET
    |--------------------------------------------------------------------------
    */

    for (const vehicleTableName of tableNames) {
      const table = quoteIdentifier(vehicleTableName);

      try {
        /*
        |--------------------------------------------------------------------------
        | IMPORTANT:
        |
        | Telemetry repository confirms that the telemetry
        | timestamp column is `iottimestamp`.
        |
        | DO NOT use receivedTimestamp here.
        |--------------------------------------------------------------------------
        */

        const rows = await telemetryDb.$queryRawUnsafe(
          `
              SELECT
                id,
                latitude,
                longitude,
                iottimestamp
              FROM ${table}
              WHERE latitude IS NOT NULL
                AND longitude IS NOT NULL
              ORDER BY
                iottimestamp DESC NULLS LAST,
                id DESC
              LIMIT 1
            `,
        );

        if (!rows || rows.length === 0) {
          continue;
        }

        const row = rows[0];

        /*
        |--------------------------------------------------------------------------
        | GPS
        |--------------------------------------------------------------------------
        */

        const latitude = Number(row.latitude);

        const longitude = Number(row.longitude);

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude) ||
          latitude < -90 ||
          latitude > 90 ||
          longitude < -180 ||
          longitude > 180
        ) {
          continue;
        }

        /*
        |--------------------------------------------------------------------------
        | TELEMETRY TIMESTAMP
        |--------------------------------------------------------------------------
        */

        const telemetryTimestamp = row.iottimestamp
          ? new Date(row.iottimestamp)
          : null;

        /*
        |--------------------------------------------------------------------------
        | If timestamp is unavailable,
        | still accept the GPS point.
        |--------------------------------------------------------------------------
        */

        if (!telemetryTimestamp || Number.isNaN(telemetryTimestamp.getTime())) {
          /*
           * If we have valid coordinates but no
           * usable timestamp, keep the point.
           */

          if (!latest) {
            latest = {
              latitude,
              longitude,
              timestamp: null,
            };
          }

          continue;
        }

        /*
        |--------------------------------------------------------------------------
        | Keep newest telemetry point
        |--------------------------------------------------------------------------
        */

        if (
          !latest ||
          !latest.timestamp ||
          telemetryTimestamp > latest.timestamp
        ) {
          latest = {
            latitude,
            longitude,
            timestamp: telemetryTimestamp,
          };
        }
      } catch (error) {
        /*
        |--------------------------------------------------------------------------
        | Missing telemetry table
        |--------------------------------------------------------------------------
        */

        if (error?.code === "42P01") {
          continue;
        }

        /*
        |--------------------------------------------------------------------------
        | IMPORTANT:
        |
        | Log the REAL database error.
        |
        | Previously this was being hidden, which made
        | debugging extremely difficult.
        |--------------------------------------------------------------------------
        */

        console.error(
          `Live map telemetry error for ${vehicleTableName}:`,
          error,
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | NO GPS FOUND
    |--------------------------------------------------------------------------
    */

    if (!latest) {
      results.push({
        vehicleId: vehicle.vehicleNumber,

        latitude: null,

        longitude: null,

        distance: null,

        distanceUnit: "km",

        status: "INACTIVE",

        lastUpdated: null,

        ...(vehicle.vehicleType
          ? {
              vehicleType: vehicle.vehicleType,
            }
          : {}),
      });

      continue;
    }

    /*
    |--------------------------------------------------------------------------
    | DETERMINE LIVE STATUS
    |--------------------------------------------------------------------------
    */

    let status = "ACTIVE";

    if (latest.timestamp && latest.timestamp < inactivityLimit) {
      status = "INACTIVE";
    }

    /*
    |--------------------------------------------------------------------------
    | RETURN VEHICLE
    |--------------------------------------------------------------------------
    */

    results.push({
      vehicleId: vehicle.vehicleNumber,

      latitude: latest.latitude,

      longitude: latest.longitude,

      distance: null,

      distanceUnit: "km",

      status,

      lastUpdated: latest.timestamp ? latest.timestamp.toISOString() : null,

      ...(vehicle.vehicleType
        ? {
            vehicleType: vehicle.vehicleType,
          }
        : {}),
    });
  }

  return results;
};

/*
|--------------------------------------------------------------------------
| LIVE ROUTE MAP
|--------------------------------------------------------------------------
*/

const getLiveRouteMap = async ({
  latitude,
  longitude,
  cityId,
  zoneId,
  divisionId,
  wardId,
}) => {
  /*
   * 1. PERSON LOCATION
   */

  const personLatitude = parseCoordinate(latitude, "latitude", -90, 90);

  const personLongitude = parseCoordinate(longitude, "longitude", -180, 180);

  /*
   * 2. VALIDATE HIERARCHY
   */

  const ward = await getSelectedWard({
    cityId,
    zoneId,
    divisionId,
    wardId,
  });

  /*
   * 3. GET REGISTERED VEHICLES
   */

  let vehicleTables = await getVehicleTablesForWard(new Date(), ward);

  /*
   * 4. ALSO CHECK YESTERDAY
   */

  vehicleTables = await addYesterdayTelemetryMappings(
    vehicleTables,
    ward.wardNo,
  );

  /*
   * 5. GET LATEST GPS
   */

  let vehicles = await getLatestVehiclePositions(vehicleTables);

  /*
   * 6. CALCULATE DISTANCE
   */

  vehicles = vehicles.map((vehicle) => {
    /*
     * No GPS.
     */

    if (vehicle.latitude === null || vehicle.longitude === null) {
      return {
        ...vehicle,

        distance: null,

        distanceUnit: "km",

        status: "INACTIVE",

        lastUpdated: null,
      };
    }

    /*
     * Haversine distance.
     */

    const distance = calculateDistanceKm(
      personLatitude,
      personLongitude,
      vehicle.latitude,
      vehicle.longitude,
    );

    return {
      ...vehicle,

      distance,

      distanceUnit: "km",
    };
  });

  /*
   * 7. SORT NEAREST FIRST
   */

  vehicles.sort((a, b) => {
    if (a.distance === null) {
      return 1;
    }

    if (b.distance === null) {
      return -1;
    }

    return a.distance - b.distance;
  });

  /*
   * 8. FLUTTER RESPONSE
   */

  return {
    personLocation: {
      latitude: personLatitude,

      longitude: personLongitude,
    },

    filters: {
      cityId: ward.cityId,

      zoneId: ward.zoneId,

      divisionId: ward.divisionId,

      wardId: ward.wardId,
    },

    vehicles,
  };
};

module.exports = {
  getLiveRouteMap,
};
