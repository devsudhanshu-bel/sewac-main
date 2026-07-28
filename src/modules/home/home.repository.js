import sewacPrisma from "../../config/sewacPrisma.js";

class HomeRepository {
  /**
   * Get all collection records for a citizen
   * between the provided start and end dates.
   *
   * @param {number} citizenId
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Promise<Array>}
   */
  async getMonthlyCollections(citizenId, startDate, endDate) {
    return await sewacPrisma.telemetry_logs.findMany({
      where: {
        citizen_id: citizenId,
        iot_timestamp: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        remarks: true,
        iot_timestamp: true,
      },
      orderBy: {
        iot_timestamp: "asc",
      },
    });
  }
}

export default new HomeRepository();