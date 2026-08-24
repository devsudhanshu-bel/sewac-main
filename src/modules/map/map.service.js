import axios from "axios";

import mapRepository from "./map.repository.js";
import mapRedis from "./map.redis.js";
import { emitTruckLocationUpdated } from "./map.socket.js";

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
      if (!row.vehicle_id) {
        continue;
      }

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
  // NEW LIVE VEHICLE LOCATIONS
  //
  // Citizen backend calls the existing Admin
  // live vehicle endpoint.
  // ==========================================================

  async getLiveVehicleLocations({
    latitude,
    longitude,
    cityId,
    zoneId,
    divisionId,
    wardId,
  }) {
    const adminBackendUrl = process.env.ADMIN_BACKEND_URL;

    if (!adminBackendUrl) {
      const error = new Error("ADMIN_BACKEND_URL is not configured.");

      error.statusCode = 500;

      error.publicMessage = "Live vehicle tracking is not configured.";

      throw error;
    }

    const cleanAdminUrl = adminBackendUrl.replace(/\/+$/, "");

    const url = `${cleanAdminUrl}/api/route-map/live`;

    console.log("==================================");

    console.log("GET ADMIN LIVE VEHICLES");

    console.log("ADMIN URL:", url);

    console.log("PARAMS:", {
      latitude,
      longitude,
      cityId,
      zoneId,
      divisionId,
      wardId,
    });

    console.log("==================================");

    try {
      const response = await axios.get(url, {
        params: {
          latitude,
          longitude,
          cityId,
          zoneId,
          divisionId,
          wardId,
        },

        timeout: 15000,
      });

      const adminResponse = response.data;

      console.log("ADMIN STATUS:", response.status);

      if (!adminResponse || adminResponse.success !== true) {
        const error = new Error(
          adminResponse?.message || "Unable to fetch live vehicle locations.",
        );

        error.statusCode = response.status || 500;

        error.publicMessage =
          adminResponse?.message || "Unable to fetch live vehicle locations.";

        throw error;
      }

      const adminData = adminResponse.data || {};

      const adminVehicles = Array.isArray(adminData.vehicles)
        ? adminData.vehicles
        : [];

      const vehicles = adminVehicles.map((vehicle) => {
        const vehicleId = vehicle.vehicleId ?? vehicle.vehicle_id ?? vehicle.id;

        const vehicleLatitude =
          vehicle.latitude == null ? null : Number(vehicle.latitude);

        const vehicleLongitude =
          vehicle.longitude == null ? null : Number(vehicle.longitude);

        let distance = vehicle.distanceKm ?? vehicle.distance ?? null;

        if (distance !== null) {
          distance = Number(Number(distance).toFixed(2));
        }

        return {
          vehicleId: vehicleId == null ? "" : String(vehicleId),

          latitude: Number.isFinite(vehicleLatitude) ? vehicleLatitude : null,

          longitude: Number.isFinite(vehicleLongitude)
            ? vehicleLongitude
            : null,

          distance,

          distanceUnit: "km",

          status: this.resolveVehicleStatus(vehicle),

          lastUpdated:
            vehicle.lastUpdated ??
            vehicle.updatedAt ??
            vehicle.timestamp ??
            null,
        };
      });

      // ------------------------------------------------------
      // NEAREST FIRST
      // Vehicles without GPS/distance go last.
      // ------------------------------------------------------

      vehicles.sort((a, b) => {
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

      return {
        personLocation: {
          latitude: Number(latitude),

          longitude: Number(longitude),
        },

        filters: {
          cityId: Number(cityId),

          zoneId: Number(zoneId),

          divisionId: Number(divisionId),

          wardId: Number(wardId),
        },

        vehicles,
      };
    } catch (error) {
      console.error("==================================");

      console.error("ADMIN LIVE VEHICLE ERROR:", error.message);

      if (error.response) {
        console.error("ADMIN STATUS:", error.response.status);

        console.error("ADMIN BODY:", error.response.data);
      }

      console.error("==================================");

      const serviceError = new Error("Unable to fetch live vehicle locations.");

      /*
       * Preserve meaningful 4xx errors from
       * the Admin backend.
       */

      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500
      ) {
        serviceError.statusCode = error.response.status;

        serviceError.publicMessage =
          error.response.data?.message ||
          "Unable to fetch live vehicle locations.";
      } else {
        serviceError.statusCode = 500;

        serviceError.publicMessage = "Unable to fetch live vehicle locations.";
      }

      throw serviceError;
    }
  }

  // ==========================================================
  // RESOLVE VEHICLE STATUS
  // ==========================================================

  resolveVehicleStatus(vehicle) {
    /*
     * If Admin already sends ACTIVE/INACTIVE,
     * use that value.
     */

    if (vehicle.status === "ACTIVE" || vehicle.status === "INACTIVE") {
      return vehicle.status;
    }

    /*
     * Some existing implementations may use
     * ONLINE/OFFLINE.
     */

    if (vehicle.status === "ONLINE") {
      return "ACTIVE";
    }

    if (vehicle.status === "OFFLINE") {
      return "INACTIVE";
    }

    /*
     * If a timestamp exists, apply the
     * 30-minute inactivity rule.
     */

    const timestamp =
      vehicle.lastUpdated ?? vehicle.updatedAt ?? vehicle.timestamp ?? null;

    if (!timestamp) {
      return "INACTIVE";
    }

    const updatedAt = new Date(timestamp);

    if (Number.isNaN(updatedAt.getTime())) {
      return "INACTIVE";
    }

    const age = Date.now() - updatedAt.getTime();

    return age >= 0 && age <= 30 * 60 * 1000 ? "ACTIVE" : "INACTIVE";
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
