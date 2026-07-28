import sewacPrisma from "../../config/sewacPrisma.js";

class StatsRepository {
  async getAnalyticsLogs(
    citizenId,
    startDate,
    endDate
  ) {
    return await sewacPrisma.telemetry_logs.findMany({
      where: {
        citizen_id: citizenId,
        iot_timestamp: {
          gte: startDate,
          lte: endDate,
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

export default new StatsRepository();