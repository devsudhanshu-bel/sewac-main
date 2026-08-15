const {
  archiveDate,
} = require(
  "../controllers/citizenHistoricalArchive.controller"
);


// ============================================================
// 🛠️ HISTORICAL ARCHIVE CONFIGURATION
// ============================================================
//
// PRODUCTION:
//
//   archiveDate: null
//   targetHour: 14
//   targetMinute: 0
//
// This means:
//
// Every day at:
//
//       02:00 PM IST
//
// the scheduler will archive:
//
//       TODAY
//
// Example:
//
// 15 August 2026 at 2:00 PM
//              ↓
// archive 2026-08-15
//
// ============================================================
//
// 🧪 TESTING
//
// You can temporarily change:
//
// targetHour: 13,
// targetMinute: 30,
//
// to test at 1:30 PM.
//
// You can also force a particular date:
//
// archiveDate: "2026-08-14"
//
// After testing, ALWAYS change archiveDate back to null.
//
// ============================================================

const ARCHIVE_CONFIG = {

  // ==========================================================
  // DATE TO ARCHIVE
  // ==========================================================
  //
  // null = automatically archive TODAY in IST
  //
  // Example fixed date:
  //
  // archiveDate: "2026-08-14"
  //
  // PRODUCTION:
  //
  archiveDate: null,


  // ==========================================================
  // SCHEDULED TIME
  // ==========================================================
  //
  // 14 = 2 PM
  //
  targetHour: 14,

  // 00 = exactly xx:00
  targetMinute: 0,

};


// ============================================================
// HISTORICAL ARCHIVE SCHEDULER
// ============================================================

class HistoricalArchiveScheduler {

  constructor() {

    this.timer =
      null;

    this.isRunning =
      false;

    this.lastRun =
      null;

    this.lastResult =
      null;


    // ========================================================
    // LOAD CONFIGURATION
    // ========================================================

    this.TARGET_HOUR =
      Number(
        ARCHIVE_CONFIG.targetHour
      );

    this.TARGET_MINUTE =
      Number(
        ARCHIVE_CONFIG.targetMinute
      );

    this.ARCHIVE_DATE =
      ARCHIVE_CONFIG.archiveDate;


    // ========================================================
    // VALIDATE CONFIGURATION
    // ========================================================

    this.validateConfiguration();

  }


  // ============================================================
  // VALIDATE CONFIGURATION
  // ============================================================

  validateConfiguration() {

    // ========================================================
    // VALIDATE HOUR
    // ========================================================

    if (
      !Number.isInteger(
        this.TARGET_HOUR
      ) ||
      this.TARGET_HOUR < 0 ||
      this.TARGET_HOUR > 23
    ) {

      throw new Error(
        `Invalid targetHour: ${this.TARGET_HOUR}. Must be between 0 and 23.`
      );

    }


    // ========================================================
    // VALIDATE MINUTE
    // ========================================================

    if (
      !Number.isInteger(
        this.TARGET_MINUTE
      ) ||
      this.TARGET_MINUTE < 0 ||
      this.TARGET_MINUTE > 59
    ) {

      throw new Error(
        `Invalid targetMinute: ${this.TARGET_MINUTE}. Must be between 0 and 59.`
      );

    }


    // ========================================================
    // VALIDATE FIXED DATE
    // ========================================================

    if (
      this.ARCHIVE_DATE !==
      null
    ) {

      if (
        typeof this.ARCHIVE_DATE !==
        "string"
      ) {

        throw new Error(
          "archiveDate must be either null or a YYYY-MM-DD string."
        );

      }


      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(
          this.ARCHIVE_DATE
        )
      ) {

        throw new Error(
          `Invalid archiveDate: ${this.ARCHIVE_DATE}. Use YYYY-MM-DD.`
        );

      }


      const testDate =
        new Date(
          `${this.ARCHIVE_DATE}T00:00:00`
        );


      if (
        Number.isNaN(
          testDate.getTime()
        )
      ) {

        throw new Error(
          `Invalid archiveDate: ${this.ARCHIVE_DATE}`
        );

      }

    }

  }


  // ============================================================
  // GET CURRENT IST DATE/TIME
  // ============================================================

  getISTDateTime() {

    const now =
      new Date();


    const formatter =
      new Intl.DateTimeFormat(
        "en-CA",
        {

          timeZone:
            "Asia/Kolkata",

          year:
            "numeric",

          month:
            "2-digit",

          day:
            "2-digit",

          hour:
            "2-digit",

          minute:
            "2-digit",

          second:
            "2-digit",

          hourCycle:
            "h23",

        }
      );


    const parts =
      formatter.formatToParts(
        now
      );


    const values =
      {};


    for (
      const part of parts
    ) {

      if (
        part.type !==
        "literal"
      ) {

        values[
          part.type
        ] =
          part.value;

      }

    }


    return {

      date:
        `${values.year}-${values.month}-${values.day}`,

      year:
        Number(
          values.year
        ),

      month:
        Number(
          values.month
        ),

      day:
        Number(
          values.day
        ),

      hour:
        Number(
          values.hour
        ),

      minute:
        Number(
          values.minute
        ),

      second:
        Number(
          values.second
        ),

    };

  }


  // ============================================================
  // GET ARCHIVE DATE
  // ============================================================
  //
  // If archiveDate is null:
  //
  //       TODAY in IST
  //
  // If archiveDate contains a date:
  //
  //       use that exact date
  //
  // ============================================================

  getArchiveDate(
    ist
  ) {

    // ========================================================
    // FIXED DATE
    // ========================================================

    if (
      this.ARCHIVE_DATE
    ) {

      return this.ARCHIVE_DATE;

    }


    // ========================================================
    // AUTOMATIC TODAY
    // ========================================================

    return ist.date;

  }


  // ============================================================
  // RUN ARCHIVE
  // ============================================================

  async run(
    archiveDateValue = null
  ) {

    // ========================================================
    // PREVENT DOUBLE EXECUTION
    // ========================================================

    if (
      this.isRunning
    ) {

      console.log(
        "⚠️ Historical archive is already running."
      );


      return {

        started:
          false,

        reason:
          "ALREADY_RUNNING",

      };

    }


    this.isRunning =
      true;


    // ========================================================
    // CURRENT IST TIME
    // ========================================================

    const ist =
      this.getISTDateTime();


    // ========================================================
    // DETERMINE DATE
    // ========================================================

    const dateToArchive =
      archiveDateValue ||
      this.getArchiveDate(
        ist
      );


    // ========================================================
    // START LOG
    // ========================================================

    console.log("");

    console.log(
      "============================================================"
    );

    console.log(
      "🚛 AUTOMATIC HISTORICAL ARCHIVE STARTED"
    );

    console.log(
      "============================================================"
    );

    console.log(
      "Archive date:",
      dateToArchive
    );

    console.log(
      "Current IST:",
      `${String(ist.day).padStart(2, "0")}/${String(ist.month).padStart(2, "0")}/${ist.year}`,
      `${String(ist.hour).padStart(2, "0")}:${String(ist.minute).padStart(2, "0")}:${String(ist.second).padStart(2, "0")}`
    );

    console.log(
      "Scheduled time:",
      `${String(this.TARGET_HOUR).padStart(2, "0")}:${String(this.TARGET_MINUTE).padStart(2, "0")} IST`
    );

    console.log(
      "Archive mode:",
      this.ARCHIVE_DATE
        ? "FIXED DATE"
        : "TODAY"
    );

    console.log(
      "============================================================"
    );


    try {

      this.lastRun =
        new Date();


      // ======================================================
      // CREATE SAME REQUEST BODY AS API
      // ======================================================
      //
      // This is equivalent to:
      //
      // POST
      // /api/historical-database/archive
      //
      // Body:
      //
      // {
      //   "date": "2026-08-15"
      // }
      //
      // ======================================================

      const req = {

        body: {

          date:
            dateToArchive,

        },

      };


      // ======================================================
      // EXPRESS-LIKE RESPONSE
      // ======================================================

      const result =
        await new Promise(
          async (
            resolve,
            reject
          ) => {

            let statusCode =
              200;


            const res = {

              status(
                code
              ) {

                statusCode =
                  code;

                return this;

              },


              json(
                data
              ) {

                resolve({

                  statusCode,

                  data,

                });


                return this;

              },

            };


            try {

              await archiveDate(
                req,
                res
              );

            } catch (
              error
            ) {

              reject(
                error
              );

            }

          }
        );


      // ======================================================
      // SAVE RESULT
      // ======================================================

      this.lastResult =
        result;


      // ======================================================
      // SUCCESS
      // ======================================================

      if (
        result.statusCode >=
          200 &&
        result.statusCode <
          300
      ) {

        console.log("");

        console.log(
          "============================================================"
        );

        console.log(
          "✅ AUTOMATIC HISTORICAL ARCHIVE COMPLETED"
        );

        console.log(
          "============================================================"
        );

        console.log(
          "Archive date:",
          dateToArchive
        );

        console.log(
          "HTTP status:",
          result.statusCode
        );


        const data =
          result.data?.data;


        if (
          data
        ) {

          console.log(
            "Source database:",
            data.sourceDatabase ??
              "N/A"
          );

          console.log(
            "Source day table:",
            data.sourceDayTable ??
              "N/A"
          );

          console.log(
            "Vehicles archived:",
            data.archivedVehicles ??
              0
          );

          console.log(
            "Records inserted:",
            data.archivedRecords ??
              0
          );

          console.log(
            "Duplicate records:",
            data.duplicateRecords ??
              0
          );

          console.log(
            "Failed vehicles:",
            data.failedVehicles?.length ??
              0
          );

        }


        console.log(
          "============================================================"
        );


      } else {

        // ====================================================
        // CONTROLLER RETURNED ERROR
        // ====================================================

        console.error("");

        console.error(
          "============================================================"
        );

        console.error(
          "❌ AUTOMATIC HISTORICAL ARCHIVE RETURNED AN ERROR"
        );

        console.error(
          "============================================================"
        );

        console.error(
          "Archive date:",
          dateToArchive
        );

        console.error(
          "HTTP status:",
          result.statusCode
        );

        console.error(
          "Response:",
          result.data
        );

        console.error(
          "============================================================"
        );

      }


      return {

        started:
          true,

        processingDate:
          dateToArchive,

        statusCode:
          result.statusCode,

        result:
          result.data,

      };


    } catch (
      error
    ) {

      // ======================================================
      // ARCHIVE FAILED
      // ======================================================

      console.error("");

      console.error(
        "============================================================"
      );

      console.error(
        "❌ AUTOMATIC HISTORICAL ARCHIVE FAILED"
      );

      console.error(
        "============================================================"
      );

      console.error(
        "Archive date:",
        dateToArchive
      );

      console.error(
        "Error:",
        error
      );

      console.error(
        "============================================================"
      );


      this.lastResult = {

        status:
          "FAILED",

        error:
          error.message,

      };


      return {

        started:
          true,

        processingDate:
          dateToArchive,

        error:
          error.message,

      };


    } finally {

      this.isRunning =
        false;

    }

  }


  // ============================================================
  // START SCHEDULER
  // ============================================================

  start() {

    if (
      this.timer
    ) {

      console.log(
        "[Historical Archive Scheduler] Already started."
      );

      return;

    }


    console.log("");

    console.log(
      "============================================================"
    );

    console.log(
      "🚛 SEWAC HISTORICAL ARCHIVE SCHEDULER"
    );

    console.log(
      "============================================================"
    );

    console.log(
      "Status: STARTING"
    );


    console.log(
      "Schedule:",
      `${String(this.TARGET_HOUR).padStart(2, "0")}:${String(this.TARGET_MINUTE).padStart(2, "0")} IST EVERY DAY`
    );


    console.log(
      "Archive target:",
      this.ARCHIVE_DATE ||
        "TODAY"
    );


    console.log(
      "Timezone:",
      "Asia/Kolkata"
    );


    console.log(
      "Checking interval:",
      "10 seconds"
    );


    console.log(
      "============================================================"
    );


    // ========================================================
    // INITIAL CHECK
    // ========================================================

    this.checkSchedule();


    // ========================================================
    // CHECK EVERY 10 SECONDS
    // ========================================================

    this.timer =
      setInterval(
        () => {

          this.checkSchedule();

        },
        10 * 1000
      );


    console.log(
      "✅ Historical archive scheduler started successfully."
    );

  }


  // ============================================================
  // CHECK SCHEDULE
  // ============================================================

  async checkSchedule() {

    const now =
      this.getISTDateTime();


    // ========================================================
    // CHECK HOUR
    // ========================================================

    if (
      now.hour !==
      this.TARGET_HOUR
    ) {

      return;

    }


    // ========================================================
    // CHECK MINUTE
    // ========================================================

    if (
      now.minute !==
      this.TARGET_MINUTE
    ) {

      return;

    }


    // ========================================================
    // PREVENT MULTIPLE RUNS
    // ========================================================
    //
    // Scheduler checks every 10 seconds.
    //
    // At 14:00:
    //
    // 14:00:00
    // 14:00:10
    // 14:00:20
    // 14:00:30
    //
    // Only the first check is allowed to run.
    //
    // ========================================================

    const executionDay =
      now.date;


    if (
      this.lastRun
    ) {

      const lastRunIST =
        new Intl.DateTimeFormat(
          "en-CA",
          {

            timeZone:
              "Asia/Kolkata",

            year:
              "numeric",

            month:
              "2-digit",

            day:
              "2-digit",

          }
        ).format(
          this.lastRun
        );


      if (
        lastRunIST ===
        executionDay
      ) {

        return;

      }

    }


    // ========================================================
    // DETERMINE DATE TO ARCHIVE
    // ========================================================

    const dateToArchive =
      this.getArchiveDate(
        now
      );


    console.log("");

    console.log(
      `[Historical Scheduler] Scheduled time reached: ${now.date} ${String(now.hour).padStart(2, "0")}:${String(now.minute).padStart(2, "0")}`
    );

    console.log(
      `[Historical Scheduler] Archive target: ${dateToArchive}`
    );


    // ========================================================
    // RUN
    // ========================================================

    await this.run(
      dateToArchive
    );

  }


  // ============================================================
  // STOP
  // ============================================================

  stop() {

    if (
      !this.timer
    ) {

      return;

    }


    clearInterval(
      this.timer
    );


    this.timer =
      null;


    console.log("");

    console.log(
      "🛑 Historical archive scheduler stopped."
    );

  }


  // ============================================================
  // STATUS
  // ============================================================

  getStatus() {

    const now =
      this.getISTDateTime();


    return {

      schedulerRunning:
        Boolean(
          this.timer
        ),

      processingRunning:
        this.isRunning,

      currentIST:
        `${now.date} ${String(now.hour).padStart(2, "0")}:${String(now.minute).padStart(2, "0")}:${String(now.second).padStart(2, "0")}`,

      scheduledTime:
        `${String(this.TARGET_HOUR).padStart(2, "0")}:${String(this.TARGET_MINUTE).padStart(2, "0")} IST EVERY DAY`,

      archiveTarget:
        this.ARCHIVE_DATE ||
        "TODAY",

      timezone:
        "Asia/Kolkata",

      lastRun:
        this.lastRun,

      lastResult:
        this.lastResult,

    };

  }

}


// ============================================================
// EXPORT SINGLE INSTANCE
// ============================================================

module.exports =
  new HistoricalArchiveScheduler();