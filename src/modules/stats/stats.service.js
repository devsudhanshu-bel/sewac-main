import statsRepository
  from "./stats.repository.js";

import {
  STATS_MESSAGES
} from "./stats.constants.js";


// =====================================================
// STATS SERVICE
// =====================================================

class StatsService {


  // ===================================================
  // ANALYTICS
  // ===================================================

  async getAnalytics(
    citizenId,
    phoneNumber,
    startDate,
    endDate
  ) {


    // ================================================
    // VALIDATE START DATE
    // ================================================

    if (
      !startDate ||
      isNaN(
        Date.parse(startDate)
      )
    ) {

      throw new Error(
        STATS_MESSAGES.INVALID_START_DATE
      );

    }


    // ================================================
    // VALIDATE END DATE
    // ================================================

    if (
      !endDate ||
      isNaN(
        Date.parse(endDate)
      )
    ) {

      throw new Error(
        STATS_MESSAGES.INVALID_END_DATE
      );

    }


    // ================================================
    // CREATE DATE OBJECTS
    // ================================================

    const start =
      new Date(startDate);


    // -----------------------------------------------
    // Start of selected day
    // -----------------------------------------------

    start.setHours(
      0,
      0,
      0,
      0
    );


    const end =
      new Date(endDate);


    // -----------------------------------------------
    // Include complete end day
    // -----------------------------------------------

    end.setHours(
      23,
      59,
      59,
      999
    );


    // ================================================
    // VALIDATE RANGE
    // ================================================

    if (
      start > end
    ) {

      throw new Error(
        STATS_MESSAGES.INVALID_DATE_RANGE
      );

    }


    console.log(
      `[Stats Service] Analytics range: ${start.toISOString()} -> ${end.toISOString()}`
    );


    // ================================================
    // FETCH HISTORICAL COLLECTIONS
    // ================================================

    const collections =
      await statsRepository
        .getAnalyticsLogs(

          citizenId,

          phoneNumber,

          start,

          end

        );


    // ================================================
    // STATISTICS
    // ================================================

    let dryCompleted = 0;

    let wetCompleted = 0;


    const attendedDates =
      new Set();


    // ================================================
    // PROCESS COLLECTIONS
    // ================================================

    collections.forEach(
      collection => {

        // --------------------------------------------
        // DRY
        // --------------------------------------------

        if (
          collection.remarks === "D"
        ) {

          dryCompleted++;

        }


        // --------------------------------------------
        // WET
        // --------------------------------------------

        else if (
          collection.remarks === "W"
        ) {

          wetCompleted++;

        }


        // --------------------------------------------
        // ATTENDED DATE
        // --------------------------------------------

        const collectionDate =
          new Date(
            collection.iot_timestamp
          );


        const dateKey =
          collectionDate
            .toISOString()
            .split("T")[0];


        attendedDates.add(
          dateKey
        );

      }
    );


    // ================================================
    // EXPECTED COLLECTIONS
    // ================================================
    //
    // Same logic as Home:
    //
    // Wednesday + Saturday = DRY
    //
    // All other days = WET
    //
    // ================================================

    let dryTotal = 0;

    let wetTotal = 0;


    const current =
      new Date(start);


    current.setHours(
      0,
      0,
      0,
      0
    );


    const finalDate =
      new Date(end);


    finalDate.setHours(
      0,
      0,
      0,
      0
    );


    while (
      current <= finalDate
    ) {

      const weekday =
        current.getDay();


      if (
        weekday === 3 ||
        weekday === 6
      ) {

        dryTotal++;

      }

      else {

        wetTotal++;

      }


      current.setDate(
        current.getDate() + 1
      );

    }


    // ================================================
    // PARTICIPATION
    // ================================================

    const totalExpected =
      dryTotal +
      wetTotal;


    const totalCompleted =
      attendedDates.size;


    const participation =
      totalExpected === 0

        ? 0

        : Math.round(

            (
              totalCompleted /
              totalExpected
            ) * 100

          );


    // ================================================
    // ATTENDANCE STREAK
    // ================================================

    let streak = 0;


    const sortedDates =
      [
        ...attendedDates
      ]
      .sort();


    if (
      sortedDates.length > 0
    ) {

      streak = 1;


      for (
        let i =
          sortedDates.length - 1;

        i > 0;

        i--
      ) {

        const currentDate =
          new Date(
            `${sortedDates[i]}T00:00:00`
          );


        const previousDate =
          new Date(
            `${sortedDates[i - 1]}T00:00:00`
          );


        const difference =
          Math.round(

            (
              currentDate -
              previousDate
            )
            /
            (
              1000 *
              60 *
              60 *
              24
            )

          );


        if (
          difference === 1
        ) {

          streak++;

        }

        else {

          break;

        }

      }

    }


    // ================================================
    // RESPONSE
    // ================================================

    return {

      success: true,

      message:
        STATS_MESSAGES
          .ANALYTICS_FETCHED,

      data: {

        range: {

          startDate,

          endDate,

        },


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


        participation,

      }

    };

  }

}


// =====================================================
// EXPORT
// =====================================================

export default new StatsService();