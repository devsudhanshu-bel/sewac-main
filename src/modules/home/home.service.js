import homeRepository
  from "./home.repository.js";

import {
  HOME_MESSAGES
} from "./home.constants.js";


// =====================================================
// HOME SERVICE
// =====================================================

class HomeService {


  // ===================================================
  // MONTHLY CALENDAR
  // ===================================================

  async getCalendar(
    citizenId,
    phoneNumber,
    year,
    month
  ) {


    // =============================================
    // VALIDATE INPUT
    // =============================================

    year =
      Number(year);

    month =
      Number(month);


    if (
      !year ||
      year < 2000 ||
      year > 2100
    ) {

      throw new Error(
        HOME_MESSAGES.INVALID_YEAR
      );

    }


    if (
      !month ||
      month < 1 ||
      month > 12
    ) {

      throw new Error(
        HOME_MESSAGES.INVALID_MONTH
      );

    }


    // =============================================
    // RESOLVE CITIZEN WARD
    // =============================================
    //
    // Citizen
    //   ↓
    // phone
    //   ↓
    // master_citizen_map
    //   ↓
    // ward_id
    //
    // =============================================

    const wardNo =
      await homeRepository
        .getCitizenWard(
          phoneNumber
        );


    if (
      !Number.isInteger(wardNo) ||
      wardNo <= 0
    ) {

      throw new Error(
        "Ward information not found for citizen."
      );

    }


    console.log(
      `[Home Service] Citizen ${citizenId} resolved to Ward ${wardNo}`
    );


    // =============================================
    // SELECTED MONTH
    // =============================================

    const selectedYear =
      year;


    const selectedMonth =
      month - 1;


    const startDate =
      new Date(
        selectedYear,
        selectedMonth,
        1
      );


    const endDate =
      new Date(
        selectedYear,
        selectedMonth + 1,
        1
      );


    // =============================================
    // TODAY
    // =============================================

    const today =
      new Date();


    const todayOnly =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );


    // =============================================
    // DATABASE FETCH
    // =============================================

    const collections =
      await homeRepository
        .getMonthlyCollections(

          citizenId,

          wardNo,

          selectedYear,

          month,

          startDate,

          endDate

        );


    // =============================================
    // STATISTICS
    // =============================================

    let dryCompleted = 0;

    let wetCompleted = 0;


    const attendedDays =
      new Set();


    collections.forEach(
      collection => {


        if (
          collection.remarks === "D"
        ) {

          dryCompleted++;

        }


        else if (
          collection.remarks === "W"
        ) {

          wetCompleted++;

        }


        const collectionDate =
          new Date(
            collection.iot_timestamp
          );


        attendedDays.add(
          collectionDate.getDate()
        );

      }
    );


    // =============================================
    // MONTH CALCULATION
    // =============================================

    const daysInMonth =
      new Date(

        selectedYear,

        selectedMonth + 1,

        0

      ).getDate();


    let dryTotal = 0;


    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {


      const currentDate =
        new Date(

          selectedYear,

          selectedMonth,

          day

        );


      const weekday =
        currentDate.getDay();


      if (
        weekday === 3 ||
        weekday === 6
      ) {

        dryTotal++;

      }

    }


    const wetTotal =
      daysInMonth - dryTotal;


    // =============================================
    // CALENDAR GENERATE
    // =============================================

    const calendar = [];

    let streak = 0;


    const selectedMonthDate =
      new Date(

        selectedYear,

        selectedMonth,

        1

      );


    const currentMonthDate =
      new Date(

        today.getFullYear(),

        today.getMonth(),

        1

      );


    const isPastMonth =
      selectedMonthDate <
      currentMonthDate;


    const isCurrentMonth =

      selectedMonthDate.getFullYear()
      ===
      currentMonthDate.getFullYear()

      &&

      selectedMonthDate.getMonth()
      ===
      currentMonthDate.getMonth();


    const isFutureMonth =
      selectedMonthDate >
      currentMonthDate;


    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {


      const currentDate =
        new Date(

          selectedYear,

          selectedMonth,

          day

        );


      const weekday =
        currentDate.getDay();


      const isDryDay =

        weekday === 3 ||
        weekday === 6;


      let status =
        "UPCOMING";


      // =========================================
      // PAST MONTH
      // =========================================

      if (isPastMonth) {


        status =
          attendedDays.has(day)

            ? "ATTENDED"

            : "MISSED";

      }


      // =========================================
      // CURRENT MONTH
      // =========================================

      else if (isCurrentMonth) {


        const currentOnly =
          new Date(

            currentDate.getFullYear(),

            currentDate.getMonth(),

            currentDate.getDate()

          );


        if (
          currentOnly < todayOnly
        ) {


          status =
            attendedDays.has(day)

              ? "ATTENDED"

              : "MISSED";

        }


        else if (
          currentOnly.getTime()
          ===
          todayOnly.getTime()
        ) {


          status =
            attendedDays.has(day)

              ? "ATTENDED"

              : "TODAY";

        }

      }


      calendar.push({

        day,

        date:
          currentDate
            .toISOString()
            .split("T")[0],

        weekday,

        collectionType:
          isDryDay
            ? "DRY"
            : "WET",

        status,

      });

    }


    // =============================================
    // CALCULATE STREAK
    // =============================================

    if (!isFutureMonth) {


      const completedDays =
        [
          ...attendedDays
        ]
        .sort(
          (a, b) => a - b
        );


      if (
        completedDays.length > 0
      ) {


        streak = 1;


        for (
          let i =
            completedDays.length - 1;

          i > 0;

          i--
        ) {


          if (
            completedDays[i]
            -
            completedDays[i - 1]
            ===
            1
          ) {

            streak++;

          }

          else {

            break;

          }

        }

      }

    }


    // =============================================
    // RESPONSE OBJECT
    // =============================================
    //
    // DO NOT CHANGE.
    //
    // =============================================

    const response = {

      success: true,

      message:
        HOME_MESSAGES
          .CALENDAR_FETCHED,

      data: {

        year:
          selectedYear,

        month,

        dry: {

          completed:
            dryCompleted,

          total:
            dryTotal,

        },

        wet: {

          completed:
            wetCompleted,

          total:
            wetTotal,

        },

        streak,

        calendar,

      }

    };


    return response;

  }


  // ===================================================
  // TODAY'S COLLECTION
  // ===================================================

  async getTodayCollection() {


    const today =
      new Date();


    const weekday =
      today.getDay();


    const collectionType =

      weekday === 3 ||
      weekday === 6

        ? "DRY"

        : "WET";


    const response = {

      success: true,

      message:
        HOME_MESSAGES
          .TODAY_COLLECTION_FETCHED,

      data: {

        collectionType,

        city: "Bengaluru",

        date:
          today
            .toISOString()
            .split("T")[0],

        day:
          today.toLocaleDateString(
            "en-US",
            {
              weekday: "long"
            }
          ),

      }

    };


    return response;

  }

}


export default new HomeService();