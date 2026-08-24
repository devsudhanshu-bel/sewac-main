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
|
| Uses the existing Master Citizen hierarchy.
|
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
  };
};

/*
|--------------------------------------------------------------------------
| VEHICLES FOR SELECTED WARD
|--------------------------------------------------------------------------
|
| vehicle_master is the source of registered vehicles.
|
| day_DDMMYYYY is used only to resolve the existing
| vehicle-specific telemetry table.
|
|--------------------------------------------------------------------------
*/

const getVehicleTablesForWard = async (date, ward) => {
  /*
   * Get registered vehicles from vehicle_master.
   *
   * The geographic hierarchy has already been validated
   * above, so the selected ward is now matched against
   * the existing vehicle_master fields.
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
          AND city = $2
          AND zone = $3
          AND division = $4
          AND ward = $5
        ORDER BY vehicle_id ASC
      `,
    [
      ward.wardNo,
      ward.cityName,
      ward.zoneName,
      ward.divisionName,
      ward.wardName,
    ],
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
   * No registered vehicles.
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
     * Missing day table simply means there is no
     * telemetry mapping for today.
     */

    if (error?.code !== "42P01") {
      throw error;
    }
  }

  /*
   * Keep ALL registered vehicles.
   *
   * Vehicles without telemetry are returned as:
   *
   * latitude: null
   * longitude: null
   * status: INACTIVE
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
|
| This allows the 30-minute status calculation to work
| correctly around midnight.
|
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
   * Existing SEWAC live-status rule:
   *
   * <= 30 minutes = ACTIVE
   * > 30 minutes = INACTIVE
   */

  const inactivityLimit = new Date(now.getTime() - 30 * 60 * 1000);

  const results = [];

  for (const vehicle of vehicleTables) {
    if (!vehicle.vehicleNumber) {
      continue;
    }

    const tableNames = [
      vehicle.vehicleTableName,

      vehicle.additionalVehicleTableName,
    ].filter(
      (name, index, array) =>
        name && IDENTIFIER_REGEX.test(name) && array.indexOf(name) === index,
    );

    let latest = null;

    /*
     * Look through the existing dynamic
     * telemetry tables and keep only the
     * newest valid GPS packet.
     */

    for (const vehicleTableName of tableNames) {
      const table = quoteIdentifier(vehicleTableName);

      try {
        const rows = await telemetryDb.$queryRawUnsafe(
          `
                SELECT
                  id,
                  latitude,
                  longitude,
                  vehicleNumber,
                  receivedTimestamp,
                  iotTimestamp,
                  driverName,
                  unitNumber
                FROM ${table}
                WHERE latitude IS NOT NULL
                  AND longitude IS NOT NULL
                ORDER BY
                  receivedTimestamp DESC NULLS LAST,
                  id DESC
                LIMIT 1
              `,
        );

        if (rows.length === 0) {
          continue;
        }

        const row = rows[0];

        const latitude = Number(row.latitude);

        const longitude = Number(row.longitude);

        /*
         * Ignore malformed GPS.
         */

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

        const receivedTimestamp = row.receivedTimestamp
          ? new Date(row.receivedTimestamp)
          : null;

        if (!receivedTimestamp || Number.isNaN(receivedTimestamp.getTime())) {
          continue;
        }

        /*
         * Keep only newest packet.
         */

        if (!latest || receivedTimestamp > latest.receivedTimestamp) {
          latest = {
            latitude,
            longitude,

            receivedTimestamp,

            iotTimestamp: row.iotTimestamp || null,

            driverName: row.driverName || null,

            unitNumber: row.unitNumber || null,
          };
        }
      } catch (error) {
        /*
         * One bad telemetry table must
         * never crash the complete map.
         */

        if (error?.code === "42P01") {
          continue;
        }

        console.warn(
          `Live route map: unable to inspect telemetry table ${vehicleTableName}:`,
          error.message,
        );
      }
    }

    /*
     * No valid telemetry.
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
     * Determine live status.
     */

    const status =
      latest.receivedTimestamp >= inactivityLimit ? "ACTIVE" : "INACTIVE";

    results.push({
      vehicleId: vehicle.vehicleNumber,

      latitude: latest.latitude,

      longitude: latest.longitude,

      distance: null,

      distanceUnit: "km",

      status,

      lastUpdated: latest.receivedTimestamp.toISOString(),

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
   * 2. VALIDATE CITY → ZONE → DIVISION → WARD
   */

  const ward = await getSelectedWard({
    cityId,
    zoneId,
    divisionId,
    wardId,
  });

  /*
   * 3. REGISTERED VEHICLES
   */

  let vehicleTables = await getVehicleTablesForWard(new Date(), ward);

  /*
   * 4. CHECK YESTERDAY TOO
   *
   * Needed around midnight for the 30-minute
   * ACTIVE/INACTIVE calculation.
   */

  vehicleTables = await addYesterdayTelemetryMappings(
    vehicleTables,
    ward.wardNo,
  );

  /*
   * 5. LATEST GPS
   */

  let vehicles = await getLatestVehiclePositions(vehicleTables);

  /*
   * 6. DISTANCE
   */

  vehicles = vehicles.map((vehicle) => {
    /*
     * Vehicle has no valid GPS.
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
   * 7. NEAREST → FARTHEST
   *
   * Vehicles without GPS go last.
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
   * 8. FLUTTER-FRIENDLY RESPONSE
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
