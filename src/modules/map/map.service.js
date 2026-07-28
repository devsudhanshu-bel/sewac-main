import mapRepository from "./map.repository.js";
import mapCache from "./map.cache.js";
import { emitTruckLocationUpdated } from "./map.socket.js";

class MapService {
  async initializeCache() {
    mapCache.clear();

    const telemetry = await mapRepository.getTodayTruckLocations();

    const grouped = this.groupByVehicle(telemetry);

    for (const [vehicleId, records] of grouped.entries()) {
      const truck = this.buildTruck(vehicleId, records);

      mapCache.initializeTruck(truck);
    }

    console.log(
      `✅ Map Cache Initialized (${grouped.size} trucks)`
    );
  }

  async syncLiveLocations() {
    const telemetry = await mapRepository.getTodayTruckLocations();

    const grouped = this.groupByVehicle(telemetry);

    for (const [vehicleId, records] of grouped.entries()) {
      const truck = this.buildTruck(vehicleId, records);

      const cachedTruck = mapCache.getTruck(vehicleId);

      if (!cachedTruck) {
        const newTruck = mapCache.updateTruck(truck);

        emitTruckLocationUpdated(newTruck);

        continue;
      }

      if (
        cachedTruck.newPoint.latitude === truck.newPoint.latitude &&
        cachedTruck.newPoint.longitude === truck.newPoint.longitude
      ) {
        continue;
      }

      const updatedTruck = mapCache.updateTruck(truck);

      emitTruckLocationUpdated(updatedTruck);

      console.log(
        `📍 ${vehicleId} moved -> (${truck.newPoint.latitude}, ${truck.newPoint.longitude})`
      );
    }
  }

  async getLiveTruckLocations() {
    return mapCache.getAllTrucks();
  }

  async getTruck(vehicleId) {
    return mapCache.getTruck(vehicleId);
  }

  groupByVehicle(records) {
    const grouped = new Map();

    for (const record of records) {
      if (!grouped.has(record.vehicle_id)) {
        grouped.set(record.vehicle_id, []);
      }

      grouped.get(record.vehicle_id).push(record);
    }

    return grouped;
  }

  buildTruck(vehicleId, records) {
    const first = records[0];

    const latest = records[records.length - 1];

    const previous =
      records.length > 1
        ? records[records.length - 2]
        : latest;

    return {
      vehicleId,

      initialPoint: {
        latitude: Number(first.latitude),
        longitude: Number(first.longitude),
      },

      oldPoint: {
        latitude: Number(previous.latitude),
        longitude: Number(previous.longitude),
      },

      newPoint: {
        latitude: Number(latest.latitude),
        longitude: Number(latest.longitude),
      },

      recordedAt: latest.recorded_at,
    };
  }
}

export default new MapService();