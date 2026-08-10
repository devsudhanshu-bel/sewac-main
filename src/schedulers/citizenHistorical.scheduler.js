const citizenHistoricalDailyWorker =
  require("../services/citizenHistoricalDailyWorker.service");


// =====================================================
// CITIZEN HISTORICAL AUTOMATIC SCHEDULER
// =====================================================
//
// PURPOSE:
//
// Automatically process the previous day's telemetry.
//
// Example:
//
// August 10 at 00:05
//        ↓
// Process August 9
//
// IMPORTANT:
//
// The scheduler contains NO historical processing logic.
//
// It only decides WHEN processing should start.
//
// The actual processing is handled by:
//
// citizenHistoricalDailyWorker
//
// =====================================================


class CitizenHistoricalScheduler {

  constructor() {

    this.timer =
      null;

    this.isRunning =
      false;

    this.lastRun =
      null;

    this.lastResult =
      null;

  }


  // ===================================================
  // GET PREVIOUS DAY
  // ===================================================

  getPreviousDay(
    date = new Date()
  ) {

    const previousDay =
      new Date(date);


    previousDay.setDate(
      previousDay.getDate() - 1
    );


    return previousDay;

  }


  // ===================================================
  // FORMAT DATE
  // ===================================================

  formatDate(
    date
  ) {

    const year =
      date.getFullYear();


    const month =
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const day =
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      );


    return `${year}-${month}-${day}`;

  }


  // ===================================================
  // RUN PROCESSING
  // ===================================================

  async run(
    processingDate
  ) {

    if (
      this.isRunning
    ) {

      console.log(
        "[Historical Scheduler] Processing already running."
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


    const date =
      processingDate
        ? new Date(processingDate)
        : this.getPreviousDay();


    const formattedDate =
      this.formatDate(
        date
      );


    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "AUTOMATIC HISTORICAL PROCESSING"
    );

    console.log(
      "================================================="
    );

    console.log("");

    console.log(
      "Processing Date:",
      formattedDate
    );


    try {

      this.lastRun =
        new Date();


      const result =
        await citizenHistoricalDailyWorker
          .processDay(
            date
          );


      this.lastResult =
        result;


      console.log("");

      console.log(
        "[Historical Scheduler] Processing completed."
      );


      console.log(
        result
      );


      return {

        started:
          true,

        processingDate:
          formattedDate,

        result,

      };

    } catch (
      error
    ) {

      console.error(
        "[Historical Scheduler] Processing failed:"
      );

      console.error(
        error
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
          formattedDate,

        error:
          error.message,

      };

    } finally {

      this.isRunning =
        false;

    }

  }


  // ===================================================
  // START AUTOMATIC SCHEDULER
  // ===================================================
//
// Runs every day.
//
// The scheduler checks every minute.
//
// It only starts processing at:
//
// 00:05
//
// ===================================================

  start() {

    if (
      this.timer
    ) {

      console.log(
        "[Historical Scheduler] Already started."
      );

      return;

    }


    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "STARTING CITIZEN HISTORICAL SCHEDULER"
    );

    console.log(
      "================================================="
    );

    console.log("");

    console.log(
      "Automatic processing time: 00:05"
    );


    // =================================================
    // CHECK IMMEDIATELY
    // =================================================

    this.checkSchedule();


    // =================================================
    // CHECK EVERY MINUTE
    // =================================================

    this.timer =
      setInterval(
        () => {

          this.checkSchedule();

        },
        60 * 1000
      );

  }


  // ===================================================
  // CHECK SCHEDULE
  // ===================================================

  async checkSchedule() {

    const now =
      new Date();


    const hour =
      now.getHours();


    const minute =
      now.getMinutes();


    if (
      hour !== 0 ||
      minute !== 5
    ) {

      return;

    }


    // =================================================
    // PREVENT DOUBLE EXECUTION
    // =================================================

    const todayKey =
      this.formatDate(
        now
      );


    if (
      this.lastRun
    ) {

      const lastRunKey =
        this.formatDate(
          this.lastRun
        );


      if (
        lastRunKey ===
        todayKey
      ) {

        return;

      }

    }


    await this.run();

  }


  // ===================================================
  // STOP
  // ===================================================

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
      "[Historical Scheduler] Stopped."
    );

  }


  // ===================================================
  // STATUS
  // ===================================================

  getStatus() {

    return {

      schedulerRunning:
        Boolean(
          this.timer
        ),

      processingRunning:
        this.isRunning,

      lastRun:
        this.lastRun,

      lastResult:
        this.lastResult,

    };

  }

}


module.exports =
  new CitizenHistoricalScheduler();