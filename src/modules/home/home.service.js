import homeRepository from "./home.repository.js";
import { HOME_MESSAGES } from "./home.constants.js";

class HomeService {
  /**
   * Monthly Calendar
   * Supports Previous, Current and Future Months
   */
  async getCalendar(citizenId, year, month) {
    // -----------------------------
    // Validate Inputs
    // -----------------------------
    year = Number(year);
    month = Number(month);

    if (!year || year < 2000 || year > 2100) {
      throw new Error(HOME_MESSAGES.INVALID_YEAR);
    }

    if (!month || month < 1 || month > 12) {
      throw new Error(HOME_MESSAGES.INVALID_MONTH);
    }

    // -----------------------------
    // Selected Month
    // -----------------------------
    const selectedYear = year;
    const selectedMonth = month - 1;

    const startDate = new Date(
      selectedYear,
      selectedMonth,
      1
    );

    const endDate = new Date(
      selectedYear,
      selectedMonth + 1,
      1
    );

    // -----------------------------
    // Today's Date
    // -----------------------------
    const today = new Date();

    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // -----------------------------
    // Fetch Collections
    // -----------------------------
    const collections =
      await homeRepository.getMonthlyCollections(
        citizenId,
        startDate,
        endDate
      );
          // -----------------------------
    // Collection Statistics
    // -----------------------------
    let dryCompleted = 0;
    let wetCompleted = 0;

    // Keep track of attended days
    // One entry per day even if multiple records exist
    const attendedDays = new Set();

    collections.forEach((collection) => {
      if (collection.remarks === "D") {
        dryCompleted++;
      } else if (collection.remarks === "W") {
        wetCompleted++;
      }

      const collectionDate = new Date(
        collection.iot_timestamp
      );

      const day = collectionDate.getDate();

      attendedDays.add(day);
    });

    // -----------------------------
    // Month Information
    // -----------------------------
    const daysInMonth = new Date(
      selectedYear,
      selectedMonth + 1,
      0
    ).getDate();

    let dryTotal = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(
        selectedYear,
        selectedMonth,
        day
      );

      const weekday = currentDate.getDay();

      // Wednesday or Saturday
      if (weekday === 3 || weekday === 6) {
        dryTotal++;
      }
    }

    const wetTotal = daysInMonth - dryTotal;

    // -----------------------------
    // Calendar
    // -----------------------------
    const calendar = [];

    // -----------------------------
    // Streak
    // -----------------------------
    let streak = 0;
        // -----------------------------
    // Generate Calendar
    // -----------------------------
    const selectedMonthDate = new Date(
      selectedYear,
      selectedMonth,
      1
    );

    const currentMonthDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const isPastMonth =
      selectedMonthDate < currentMonthDate;

    const isCurrentMonth =
      selectedMonthDate.getFullYear() ===
        currentMonthDate.getFullYear() &&
      selectedMonthDate.getMonth() ===
        currentMonthDate.getMonth();

    const isFutureMonth =
      selectedMonthDate > currentMonthDate;

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(
        selectedYear,
        selectedMonth,
        day
      );

      const weekday = currentDate.getDay();

      // Dry Collection Days
      const isDryDay =
        weekday === 3 || weekday === 6;

      // Wet Collection Days
      const isWetDay = !isDryDay;

      let status = "UPCOMING";

      // --------------------------------
      // Previous Months
      // --------------------------------
      if (isPastMonth) {
        status = attendedDays.has(day)
          ? "ATTENDED"
          : "MISSED";
      }

      // --------------------------------
      // Current Month
      // --------------------------------
      else if (isCurrentMonth) {
        const currentOnly = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        );

        if (currentOnly < todayOnly) {
          status = attendedDays.has(day)
            ? "ATTENDED"
            : "MISSED";
        } else if (
          currentOnly.getTime() ===
          todayOnly.getTime()
        ) {
          status = attendedDays.has(day)
            ? "ATTENDED"
            : "TODAY";
        } else {
          status = "UPCOMING";
        }
      }

      // --------------------------------
      // Future Months
      // --------------------------------
      else if (isFutureMonth) {
        status = "UPCOMING";
      }

      calendar.push({
        day,
        date: currentDate
          .toISOString()
          .split("T")[0],
        weekday,
        collectionType: isDryDay
          ? "DRY"
          : "WET",
        status,
      });
    }
        // -----------------------------
    // Calculate Streak
    // -----------------------------
    if (!isFutureMonth) {
      const completedDays = [...attendedDays].sort(
        (a, b) => a - b
      );

      if (completedDays.length > 0) {
        streak = 1;

        for (let i = completedDays.length - 1; i > 0; i--) {
          if (
            completedDays[i] - completedDays[i - 1] ===
            1
          ) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    // -----------------------------
    // Return Response
    // -----------------------------
    return {
      success: true,
      message: HOME_MESSAGES.CALENDAR_FETCHED,
      data: {
        year: selectedYear,
        month: month,

        dry: {
          completed: dryCompleted,
          total: dryTotal,
        },

        wet: {
          completed: wetCompleted,
          total: wetTotal,
        },

        streak,

        calendar,
      },
    };
  }
    /**
   * Today's Collection
   */
  async getTodayCollection() {
    const today = new Date();

    const weekday = today.getDay();

    const collectionType =
      weekday === 3 || weekday === 6
        ? "DRY"
        : "WET";

    return {
      success: true,
      message:
        HOME_MESSAGES.TODAY_COLLECTION_FETCHED,
      data: {
        collectionType,
        city: "Bengaluru",
        date: today.toISOString().split("T")[0],
        day: today.toLocaleDateString("en-US", {
          weekday: "long",
        }),
      },
    };
  }
}

export default new HomeService();