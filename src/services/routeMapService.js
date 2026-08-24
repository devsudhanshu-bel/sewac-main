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
| ID PARSER
|--------------------------------------------------------------------------
*/

const parsePositiveInteger = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    throw new Error(`${fieldName} is required`);
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} must be a positive integer`);
  }

  return parsed;
};

/*
|--------------------------------------------------------------------------
| COORDINATE PARSER
|--------------------------------------------------------------------------
*/

const parseCoordinate = (value, fieldName, min, max) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${fieldName} must be a valid number`);
  }

  if (parsed < min || parsed > max) {
    throw new Error(`${fieldName} is outside valid range`);
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
| GET SELECTED WARD
|--------------------------------------------------------------------------
|
| City
|   ↓
| Zone
|   ↓
| Division
|   ↓
| Ward
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
    throw new Error("City not found");
  }

  if (!city.city_table_name) {
    throw new Error("City has no dynamic table registered");
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
    throw new Error("Zone not found in selected city");
  }

  const zone = zones[0];

  if (!zone.zone_table_name) {
    throw new Error("Selected zone has no dynamic table registered");
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
    throw new Error("Division not found in selected zone");
  }

  const division = divisions[0];

  if (!division.division_table_name) {
    throw new Error("Selected division has no dynamic table registered");
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
    throw new Error("Ward not found in selected division");
  }

  const ward = wards[0];

  const wardNo = Number(ward.ward_no);

  if (!Number.isInteger(wardNo)) {
    throw new Error("Selected ward has an invalid ward number");
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
| GET VEHICLE TABLES FOR WARD
|--------------------------------------------------------------------------
*/

const getVehicleTablesForWard = async (date, wardNo) => {
  const dayTable = getDayTableName(date);

  const dayIdentifier = quoteIdentifier(dayTable);

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
            ORDER BY vehicle_number ASC
          `,
      wardNo,
    );

    return rows
      .filter(
        (row) =>
          typeof row.vehicle_table_name === "string" &&
          IDENTIFIER_REGEX.test(row.vehicle_table_name),
      )
      .map((row) => ({
        vehicleNumber: row.vehicle_number
          ? String(row.vehicle_number).trim()
          : null,

        vehicleTableName: row.vehicle_table_name,

        wardNo: Number(row.ward_no),
      }));
  } catch (error) {
    if (error?.code === "42P01") {
      return [];
    }

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| HAVERSINE DISTANCE
|--------------------------------------------------------------------------
|
| Returns straight-line geographic distance.
|
| Result:
|   meters
|   kilometers
|
|--------------------------------------------------------------------------
*/

const calculateDistance = (latitude1, longitude1, latitude2, longitude2) => {
  const EARTH_RADIUS_METERS = 6371000;

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const dLatitude = toRadians(latitude2 - latitude1);

  const dLongitude = toRadians(longitude2 - longitude1);

  const lat1 = toRadians(latitude1);

  const lat2 = toRadians(latitude2);

  const a =
    Math.sin(dLatitude / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLongitude / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const meters = EARTH_RADIUS_METERS * c;

  return {
    meters: Number(meters.toFixed(2)),

    kilometers: Number((meters / 1000).toFixed(3)),
  };
};

/*
|--------------------------------------------------------------------------
| GET LATEST TELEMETRY FOR VEHICLES
|--------------------------------------------------------------------------
*/

const getLatestVehiclePositions = async (vehicleTables) => {
  const latestVehicles = [];

  for (const vehicle of vehicleTables) {
    if (!vehicle.vehicleTableName) {
      continue;
    }

    const table = quoteIdentifier(vehicle.vehicleTableName);

    try {
      /*
       * IMPORTANT:
       *
       * Get the latest GPS packet
       * from THIS vehicle table.
       */

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
                receivedTimestamp DESC,
                id DESC
              LIMIT 1
            `,
      );

      if (rows.length === 0) {
        /*
         * Vehicle exists in the ward
         * but has no GPS packet.
         */

        latestVehicles.push({
          vehicleId: vehicle.vehicleNumber,

          vehicleNumber: vehicle.vehicleNumber,

          wardNo: vehicle.wardNo,

          latitude: null,

          longitude: null,

          receivedTimestamp: null,

          iotTimestamp: null,

          driverName: null,

          unitNumber: null,

          hasGps: false,
        });

        continue;
      }

      const row = rows[0];

      const latitude = Number(row.latitude);

      const longitude = Number(row.longitude);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        latestVehicles.push({
          vehicleId: vehicle.vehicleNumber,

          vehicleNumber: vehicle.vehicleNumber,

          wardNo: vehicle.wardNo,

          latitude: null,

          longitude: null,

          receivedTimestamp: row.receivedTimestamp || null,

          iotTimestamp: row.iotTimestamp || null,

          driverName: row.driverName || null,

          unitNumber: row.unitNumber || null,

          hasGps: false,
        });

        continue;
      }

      latestVehicles.push({
        vehicleId: vehicle.vehicleNumber,

        vehicleNumber: row.vehicleNumber || vehicle.vehicleNumber,

        wardNo: vehicle.wardNo,

        latitude,

        longitude,

        receivedTimestamp: row.receivedTimestamp || null,

        iotTimestamp: row.iotTimestamp || null,

        driverName: row.driverName || null,

        unitNumber: row.unitNumber || null,

        hasGps: true,
      });
    } catch (error) {
      if (error?.code === "42P01") {
        continue;
      }

      throw error;
    }
  }

  return latestVehicles;
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
   * ========================================================
   * 1. PERSON LOCATION
   * ========================================================
   */

  const personLatitude = parseCoordinate(latitude, "latitude", -90, 90);

  const personLongitude = parseCoordinate(longitude, "longitude", -180, 180);

  /*
   * ========================================================
   * 2. RESOLVE GEOGRAPHIC HIERARCHY
   * ========================================================
   */

  const ward = await getSelectedWard({
    cityId,
    zoneId,
    divisionId,
    wardId,
  });

  /*
   * ========================================================
   * 3. TODAY
   * ========================================================
   */

  const now = new Date();

  /*
   * ========================================================
   * 4. VEHICLES REGISTERED TO SELECTED WARD
   * ========================================================
   */

  const vehicleTables = await getVehicleTablesForWard(now, ward.wardNo);

  /*
   * ========================================================
   * 5. LATEST GPS
   * ========================================================
   */

  const vehicles = await getLatestVehiclePositions(vehicleTables);

  /*
   * ========================================================
   * 6. DISTANCE FROM PERSON
   * ========================================================
   */

  const enrichedVehicles = vehicles
    .map((vehicle) => {
      if (!vehicle.hasGps) {
        return {
          ...vehicle,

          distanceMeters: null,

          distanceKm: null,
        };
      }

      const distance = calculateDistance(
        personLatitude,
        personLongitude,
        vehicle.latitude,
        vehicle.longitude,
      );

      return {
        ...vehicle,

        distanceMeters: distance.meters,

        distanceKm: distance.kilometers,
      };
    })
    .sort((a, b) => {
      if (a.distanceMeters === null) {
        return 1;
      }

      if (b.distanceMeters === null) {
        return -1;
      }

      return a.distanceMeters - b.distanceMeters;
    });

  /*
   * ========================================================
   * 7. RETURN
   * ========================================================
   */

  return {
    success: true,

    person: {
      latitude: personLatitude,

      longitude: personLongitude,
    },

    location: {
      city: {
        id: ward.cityId,
        name: ward.cityName,
      },

      zone: {
        id: ward.zoneId,
        name: ward.zoneName,
      },

      division: {
        id: ward.divisionId,
        name: ward.divisionName,
      },

      ward: {
        id: ward.wardId,

        number: ward.wardNo,

        name: ward.wardName,
      },
    },

    vehicles: enrichedVehicles,

    totalVehicles: enrichedVehicles.length,

    vehiclesWithGps: enrichedVehicles.filter((vehicle) => vehicle.hasGps)
      .length,

    timestamp: now.toISOString(),
  };
};

module.exports = {
  getLiveRouteMap,
};
