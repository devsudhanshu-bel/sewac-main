import sewacPrisma from "../../config/sewacPrisma.js";

class MapRepository {

  /**
   * Used once when server starts.
   * Loads today's truck telemetry.
   */
  async getTodayTelemetry() {

    const startOfDay = new Date();

    startOfDay.setHours(0, 0, 0, 0);


    return await sewacPrisma.telemetry_logs.findMany({

      where: {
        received_at: {
          gte: startOfDay,
        },

        vehicle_id: {
          not: null,
        },

        latitude: {
          not: null,
        },

        longitude: {
          not: null,
        },
      },


      orderBy: [
        {
          vehicle_id: "asc",
        },
        {
          received_at: "asc",
        },
      ],


      select: {

        id: true,

        vehicle_id: true,

        latitude: true,

        longitude: true,

        received_at: true,

        vehicle_number: true,

        driver_name: true,
      },
    });
  }



  /**
   * Called every 2 seconds.
   * Returns only latest location per truck.
   */
  async getLatestTelemetry() {


    return await sewacPrisma.$queryRaw`

      SELECT DISTINCT ON (vehicle_id)

        id,

        vehicle_id,

        latitude,

        longitude,

        received_at,

        vehicle_number,

        driver_name


      FROM telemetry_logs


      WHERE received_at >= CURRENT_DATE

      AND vehicle_id IS NOT NULL

      AND latitude IS NOT NULL

      AND longitude IS NOT NULL


      ORDER BY vehicle_id, received_at DESC;

    `;
  }

}


export default new MapRepository();