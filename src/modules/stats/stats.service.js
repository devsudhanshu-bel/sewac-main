import statsRepository from "./stats.repository.js";
import { STATS_MESSAGES } from "./stats.constants.js";

class StatsService {
  async getAnalytics(
    citizenId,
    startDate,
    endDate
  ) {
    // -----------------------------
    // Validate Dates
    // -----------------------------
    if (!startDate || isNaN(Date.parse(startDate))) {
      throw new Error(
        STATS_MESSAGES.INVALID_START_DATE
      );
    }

    if (!endDate || isNaN(Date.parse(endDate))) {
      throw new Error(
        STATS_MESSAGES.INVALID_END_DATE
      );
    }

    const start = new Date(startDate);

    const end = new Date(endDate);

    // Include the complete end day
    end.setHours(23, 59, 59, 999);

    if (start > end) {
      throw new Error(
        STATS_MESSAGES.INVALID_DATE_RANGE
      );
    }

    // -----------------------------
    // Fetch Telemetry Logs
    // -----------------------------
    const collections =
      await statsRepository.getAnalyticsLogs(
        citizenId,
        start,
        end
      );

    // -----------------------------
    // Statistics
    // -----------------------------
    let dryCompleted = 0;

    let wetCompleted = 0;

    const attendedDays = new Set();

    collections.forEach((collection) => {
      if (collection.remarks === "D") {
        dryCompleted++;
      } else if (collection.remarks === "W") {
        wetCompleted++;
      }

      attendedDays.add(
        new Date(collection.iot_timestamp)
          .toISOString()
          .split("T")[0]
      );
    });
        // -----------------------------
    // Calculate Expected Collections
    // -----------------------------
    let dryTotal = 0;

    let wetTotal = 0;

    for (
      let current = new Date(start);
      current <= end;
      current.setDate(current.getDate() + 1)
    ) {
      const weekday = current.getDay();

      if (weekday === 3 || weekday === 6) {
        dryTotal++;
      } else {
        wetTotal++;
      }
    }

    // -----------------------------
    // Participation Score
    // -----------------------------
    const totalExpected =
      dryTotal + wetTotal;

    const totalCompleted =
      attendedDays.size;

    const participation =
      totalExpected === 0
        ? 0
        : Math.round(
            (totalCompleted / totalExpected) * 100
          );

    // -----------------------------
    // Attendance Streak
    // -----------------------------
    let streak = 0;

    const attendedDates = [...attendedDays].sort();

    if (attendedDates.length > 0) {
      streak = 1;

      for (
        let i = attendedDates.length - 1;
        i > 0;
        i--
      ) {
        const currentDate = new Date(attendedDates[i]);

        const previousDate = new Date(
          attendedDates[i - 1]
        );

        const difference =
          (currentDate - previousDate) /
          (1000 * 60 * 60 * 24);

        if (difference === 1) {
          streak++;
        } else {
          break;
        }
      }
    }
        // -----------------------------
    // Return Response
    // -----------------------------
    return {
      success: true,
      message: STATS_MESSAGES.ANALYTICS_FETCHED,
      data: {
        range: {
          startDate,
          endDate,
        },

        dry: {
          completed: dryCompleted,
          total: dryTotal,
        },

        wet: {
          completed: wetCompleted,
          total: wetTotal,
        },

        streak,

        participation,
      },
    };
  }
}

export default new StatsService();