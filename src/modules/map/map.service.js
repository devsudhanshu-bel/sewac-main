import mapRepository from "./map.repository.js";
import mapRedis from "./map.redis.js";
import { emitTruckLocationUpdated } from "./map.socket.js";

import telemetryDb from "../../config/telemetryDb.js";
import masterCitizenPrisma from "../../config/masterCitizenPrisma.js";
import sewacPrisma from "../../config/sewacPrisma.js";

class MapService {
  // ==========================================================
  // EXISTING CACHE INITIALIZATION
  // ==========================================================

  async initializeCache() {
    const telemetry = await mapRepository.getTodayTelemetry();

    if (!telemetry.length) {
      console.log("⚠️ No telemetry data found.");
      return;
    }

    const grouped = new Map();

    for (const row of telemetry) {
      if (!row.vehicle_id) continue;

      if (!grouped.has(row.vehicle_id)) {
        grouped.set(row.vehicle_id, []);
      }

      grouped.get(row.vehicle_id).push(row);
    }

    for (const [vehicleId, records] of grouped.entries()) {
      const first = records[0];
      const latest = records[records.length - 1];

      const previous =
        records.length > 1 ? records[records.length - 2] : latest;

      const truck = {
        vehicleId,

        initialPoint: {
          latitude: Number(first.latitude),
          longitude: Number(first.longitude),
        },

        previousPoint: {
          latitude: Number(previous.latitude),
          longitude: Number(previous.longitude),
        },

        currentPoint: {
          latitude: Number(latest.latitude),
          longitude: Number(latest.longitude),
        },

        speed: latest.speed_kmh ? Number(latest.speed_kmh) : 0,

        status: "ONLINE",

        updatedAt: this.getTelemetryTime(latest),
      };

      await mapRedis.setTruck(truck);

      console.log(`🚛 Loaded ${vehicleId}`);
    }

    console.log(`✅ Redis Map Ready (${grouped.size} trucks)`);
  }

  // ==========================================================
  // EXISTING LIVE LOCATION SYNC
  // ==========================================================

  async syncLiveLocations() {
    const latestTelemetry = await mapRepository.getLatestTelemetry();

    if (!latestTelemetry.length) {
      return;
    }

    for (const telemetry of latestTelemetry) {
      const vehicleId = telemetry.vehicle_id;

      if (!vehicleId) {
        continue;
      }

      const latitude = Number(telemetry.latitude);

      const longitude = Number(telemetry.longitude);

      const recordedAt = this.getTelemetryTime(telemetry);

      const truck = await mapRedis.getTruck(vehicleId);

      if (!truck) {
        const newTruck = {
          vehicleId,

          initialPoint: {
            latitude,
            longitude,
          },

          previousPoint: {
            latitude,
            longitude,
          },

          currentPoint: {
            latitude,
            longitude,
          },

          speed: 0,

          status: "ONLINE",

          updatedAt: recordedAt,
        };

        await mapRedis.setTruck(newTruck);

        console.log(`🚛 New Truck Added ${vehicleId}`);

        emitTruckLocationUpdated(newTruck);

        continue;
      }

      const sameLocation =
        truck.currentPoint.latitude === latitude &&
        truck.currentPoint.longitude === longitude;

      const sameTimestamp =
        new Date(truck.updatedAt).getTime() === new Date(recordedAt).getTime();

      if (sameLocation && sameTimestamp) {
        continue;
      }

      const updatedTruck = {
        ...truck,

        previousPoint: truck.currentPoint,

        currentPoint: {
          latitude,
          longitude,
        },

        speed: telemetry.speed_kmh ? Number(telemetry.speed_kmh) : truck.speed,

        status: "ONLINE",

        updatedAt: recordedAt,
      };

      await mapRedis.setTruck(updatedTruck);

      await mapRedis.addTrail(vehicleId, {
        latitude,
        longitude,
        timestamp: recordedAt,
      });

      console.log(`📍 ${vehicleId} moved -> ${latitude}, ${longitude}`);

      emitTruckLocationUpdated(updatedTruck);
    }
  }

  // ==========================================================
  // EXISTING TELEMETRY TIME HELPER
  // ==========================================================

  getTelemetryTime(record) {
    return (
      record.received_at ||
      record.recorded_at ||
      record.iot_timestamp ||
      new Date()
    );
  }

  // ==========================================================
  // EXISTING GET ALL LIVE TRUCKS
  // ==========================================================

  async getLiveTruckLocations() {
    return await mapRedis.getAllTrucks();
  }

  // ==========================================================
  // EXISTING GET SPECIFIC TRUCK
  // ==========================================================

  async getTruck(vehicleId) {
    return await mapRedis.getTruck(vehicleId);
  }

  // ==========================================================
  // EXISTING FIND NEAREST TRUCK
  // ==========================================================

  async findNearestTruck(latitude, longitude) {
    const truck = await mapRedis.findNearestTruck(latitude, longitude);

    if (!truck) {
      return null;
    }

    const distance = this.haversineDistance(
      latitude,
      longitude,
      truck.currentPoint.latitude,
      truck.currentPoint.longitude,
    );

    return {
      ...truck,

      distance: Number(distance.toFixed(2)),
    };
  }

  // ==========================================================
  // NEW: LIVE VEHICLE LOCATIONS
  // ==========================================================

  async getLiveVehicleLocations({
    latitude,
    longitude,
    cityId,
    zoneId,
    divisionId,
    wardId,
  }) {
    // --------------------------------------------------------
    // 1. VALIDATE CITY → ZONE → DIVISION → WARD
    // --------------------------------------------------------

    const hierarchy = await this.validateGeographicHierarchy(
      cityId,
      zoneId,
      divisionId,
      wardId,
    );

    if (!hierarchy) {
      const error = new Error(
        "Invalid city, zone, division or ward selection.",
      );

      error.statusCode = 400;

      error.publicMessage = "Invalid city, zone, division or ward selection.";

      throw error;
    }

    // --------------------------------------------------------
    // 2. GET VEHICLES FOR SELECTED WARD
    // --------------------------------------------------------

    const vehicles = await this.getVehiclesForWard(hierarchy);

    const liveVehicles = [];

    // --------------------------------------------------------
    // 3. PROCESS EACH VEHICLE
    // --------------------------------------------------------

    for (const vehicle of vehicles) {
      try {
        const rawVehicleId =
          vehicle.vehicle_id ?? vehicle.vehicleId ?? vehicle.id;

        if (rawVehicleId === undefined || rawVehicleId === null) {
          continue;
        }

        const vehicleId = String(rawVehicleId);

        // ----------------------------------------------------
        // LATEST GPS
        // ----------------------------------------------------

        const latestTelemetry = await this.getLatestVehicleTelemetry(vehicleId);

        // ----------------------------------------------------
        // NO TELEMETRY
        // ----------------------------------------------------

        if (!latestTelemetry) {
          liveVehicles.push({
            vehicleId,

            latitude: null,

            longitude: null,

            distance: null,

            distanceUnit: "km",

            status: "INACTIVE",

            lastUpdated: null,
          });

          continue;
        }

        // ----------------------------------------------------
        // GPS VALUES
        // ----------------------------------------------------

        const vehicleLatitude = Number(latestTelemetry.latitude);

        const vehicleLongitude = Number(latestTelemetry.longitude);

        // ----------------------------------------------------
        // GPS VALIDATION
        // ----------------------------------------------------

        if (
          !Number.isFinite(vehicleLatitude) ||
          !Number.isFinite(vehicleLongitude) ||
          vehicleLatitude < -90 ||
          vehicleLatitude > 90 ||
          vehicleLongitude < -180 ||
          vehicleLongitude > 180
        ) {
          liveVehicles.push({
            vehicleId,

            latitude: null,

            longitude: null,

            distance: null,

            distanceUnit: "km",

            status: "INACTIVE",

            lastUpdated: null,
          });

          continue;
        }

        // ----------------------------------------------------
        // TELEMETRY TIME
        // ----------------------------------------------------

        const telemetryTime = this.getTelemetryTime(latestTelemetry);

        const lastUpdated = new Date(telemetryTime);

        // ----------------------------------------------------
        // ACTIVE / INACTIVE
        // ----------------------------------------------------

        const ageMilliseconds = Date.now() - lastUpdated.getTime();

        const status =
          ageMilliseconds >= 0 && ageMilliseconds <= 30 * 60 * 1000
            ? "ACTIVE"
            : "INACTIVE";

        // ----------------------------------------------------
        // HAVERSINE DISTANCE
        // ----------------------------------------------------

        const distance = this.haversineDistance(
          latitude,
          longitude,
          vehicleLatitude,
          vehicleLongitude,
        );

        liveVehicles.push({
          vehicleId,

          latitude: vehicleLatitude,

          longitude: vehicleLongitude,

          distance: Number(distance.toFixed(2)),

          distanceUnit: "km",

          status,

          lastUpdated: lastUpdated.toISOString(),
        });
      } catch (error) {
        // One vehicle must not break the entire response.

        console.error("Unable to fetch live telemetry:", error);
      }
    }

    // --------------------------------------------------------
    // 4. SORT NEAREST → FARTHEST
    // --------------------------------------------------------

    liveVehicles.sort((a, b) => {
      if (a.distance === null && b.distance === null) {
        return 0;
      }

      if (a.distance === null) {
        return 1;
      }

      if (b.distance === null) {
        return -1;
      }

      return a.distance - b.distance;
    });

    // --------------------------------------------------------
    // 5. RESPONSE
    // --------------------------------------------------------

    return {
      personLocation: {
        latitude,

        longitude,
      },

      filters: {
        cityId,

        zoneId,

        divisionId,

        wardId,
      },

      vehicles: liveVehicles,
    };
  }

  // ==========================================================
  // VALIDATE CITY → ZONE → DIVISION → WARD
  // ==========================================================

  async validateGeographicHierarchy(cityId, zoneId, divisionId, wardId) {
    // --------------------------------------------------------
    // CITY
    // --------------------------------------------------------

    const cities = await masterCitizenPrisma.city_table.findMany({
      where: {
        city_id: Number(cityId),
      },

      select: {
        city_id: true,

        city_name: true,

        city_table_name: true,
      },
    });

    if (!cities.length || !cities[0].city_table_name) {
      return null;
    }

    const city = cities[0];

    const cityTable = this.validateIdentifier(city.city_table_name);

    if (!cityTable) {
      return null;
    }

    // --------------------------------------------------------
    // ZONE
    // --------------------------------------------------------

    const zones = await masterCitizenPrisma.$queryRawUnsafe(
      `
          SELECT
            zone_id,
            zone_name,
            zone_table_name
          FROM "${cityTable}"
          WHERE zone_id = $1
          LIMIT 1
          `,

      Number(zoneId),
    );

    if (!zones.length || !zones[0].zone_table_name) {
      return null;
    }

    const zone = zones[0];

    const zoneTable = this.validateIdentifier(zone.zone_table_name);

    if (!zoneTable) {
      return null;
    }

    // --------------------------------------------------------
    // DIVISION
    // --------------------------------------------------------

    const divisions = await masterCitizenPrisma.$queryRawUnsafe(
      `
          SELECT
            division_id,
            division_name,
            division_table_name
          FROM "${zoneTable}"
          WHERE division_id = $1
          LIMIT 1
          `,

      Number(divisionId),
    );

    if (!divisions.length || !divisions[0].division_table_name) {
      return null;
    }

    const division = divisions[0];

    const divisionTable = this.validateIdentifier(division.division_table_name);

    if (!divisionTable) {
      return null;
    }

    // --------------------------------------------------------
    // WARD
    // --------------------------------------------------------

    const wards = await masterCitizenPrisma.$queryRawUnsafe(
      `
          SELECT
            ward_id,
            ward_no,
            ward_name,
            ward_table_name
          FROM "${divisionTable}"
          WHERE ward_id = $1
          LIMIT 1
          `,

      Number(wardId),
    );

    if (!wards.length || !wards[0].ward_table_name) {
      return null;
    }

    return {
      city,

      zone,

      division,

      ward: wards[0],
    };
  }

  // ==========================================================
  // GET VEHICLES FOR SELECTED WARD
  // ==========================================================

  async getVehiclesForWard(hierarchy) {
    const { city, zone, division, ward } = hierarchy;

    /*
     * Use the existing vehicle_master table.
     *
     * Geographic values come from the existing
     * Master Citizen hierarchy.
     */

    const rows = await sewacPrisma.$queryRaw(
      `
        SELECT *
        FROM "vehicle_master"
        WHERE
          LOWER(TRIM(city)) =
            LOWER(TRIM(${city.city_name}))
          AND
          LOWER(TRIM(zone)) =
            LOWER(TRIM(${zone.zone_name}))
          AND
          LOWER(TRIM(division)) =
            LOWER(TRIM(${division.division_name}))
          AND
          LOWER(TRIM(ward)) =
            LOWER(TRIM(${String(ward.ward_no)}))
        `,
    );

    if (!Array.isArray(rows)) {
      return [];
    }

    return rows;
  }

  // ==========================================================
  // GET LATEST VEHICLE TELEMETRY
  // ==========================================================

  async getLatestVehicleTelemetry(vehicleId) {
    /*
     * Existing dynamic telemetry architecture:
     *
     * day_DDMMYYYY
     */

    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");

    const month = String(now.getMonth() + 1).padStart(2, "0");

    const year = now.getFullYear();

    const dayTable = `day_${day}${month}${year}`;

    const safeDayTable = this.validateIdentifier(dayTable);

    if (!safeDayTable) {
      return null;
    }

    // --------------------------------------------------------
    // FIND VEHICLE TELEMETRY TABLE
    // --------------------------------------------------------

    const tableRows = await telemetryDb.$queryRawUnsafe(
      `
          SELECT
            vehicle_table_name
          FROM "${safeDayTable}"
          WHERE vehicle_id = $1
          LIMIT 1
          `,

      vehicleId,
    );

    if (
      !Array.isArray(tableRows) ||
      !tableRows.length ||
      !tableRows[0].vehicle_table_name
    ) {
      return null;
    }

    const vehicleTable = this.validateIdentifier(
      tableRows[0].vehicle_table_name,
    );

    if (!vehicleTable) {
      return null;
    }

    // --------------------------------------------------------
    // LATEST VALID GPS
    // --------------------------------------------------------

    const rows = await telemetryDb.$queryRawUnsafe(
      `
          SELECT *
          FROM "${vehicleTable}"
          WHERE
            latitude IS NOT NULL
            AND longitude IS NOT NULL
          ORDER BY
            COALESCE(
              received_at,
              recorded_at,
              iot_timestamp
            ) DESC
          LIMIT 1
          `,
    );

    if (!Array.isArray(rows) || !rows.length) {
      return null;
    }

    const latest = rows[0];

    const lat = Number(latest.latitude);

    const lng = Number(latest.longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return null;
    }

    return latest;
  }

  // ==========================================================
  // SAFE DYNAMIC SQL IDENTIFIER
  // ==========================================================

  validateIdentifier(identifier) {
    if (typeof identifier !== "string") {
      return null;
    }

    const value = identifier.trim();

    if (!value) {
      return null;
    }

    /*
     * Only safe PostgreSQL identifiers
     * are allowed for dynamic table names.
     */

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
      return null;
    }

    return value;
  }

  // ==========================================================
  // HAVERSINE DISTANCE
  // ==========================================================

  haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371;

    const dLat = toRad(lat2 - lat1);

    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}

export default new MapService();
