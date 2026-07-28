import sewacPrisma from "../../config/sewacPrisma.js";

class MapRepository {
  async getTodayTruckLocations() {
    const startOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0);

    return await sewacPrisma.vehicle_telemetry.findMany({
      where: {
        recorded_at: {
          gte: startOfDay,
        },
      },

      orderBy: [
        {
          vehicle_id: "asc",
        },
        {
          recorded_at: "asc",
        },
      ],

      select: {
        vehicle_id: true,
        latitude: true,
        longitude: true,
        recorded_at: true,
      },
    });
  }

  async getTruckLocation(vehicleId) {
    const startOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0);

    return await sewacPrisma.vehicle_telemetry.findMany({
      where: {
        vehicle_id: vehicleId,
        recorded_at: {
          gte: startOfDay,
        },
      },

      orderBy: {
        recorded_at: "asc",
      },

      select: {
        vehicle_id: true,
        latitude: true,
        longitude: true,
        recorded_at: true,
      },
    });
  }
}

export default new MapRepository();