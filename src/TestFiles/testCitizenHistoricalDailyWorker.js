require("../config/loadEnv");


const citizenHistoricalDailyWorker =
  require(
    "../services/citizenHistoricalDailyWorker.service"
  );


// =====================================================
// TEST DATE
// =====================================================
//
// IMPORTANT:
//
// Use a STRING here.
//
// This prevents the UTC/local timezone problem
// we saw earlier.
//
// =====================================================

const PROCESSING_DATE =
  "2026-08-09";


// =====================================================
// MAIN TEST
// =====================================================

async function test() {

  try {

    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "CITIZEN HISTORICAL DAILY WORKER TEST"
    );

    console.log(
      "================================================="
    );

    console.log("");

    console.log(
      "Processing Date:",
      PROCESSING_DATE
    );


    // =================================================
    // RUN WORKER
    // =================================================

    const result =
      await citizenHistoricalDailyWorker
        .processDay(
          PROCESSING_DATE
        );


    // =================================================
    // RESULT
    // =================================================

    console.log("");

    console.log(
      "FINAL RESULT:"
    );

    console.log("");

    console.log(
      citizenHistoricalDailyWorker
        .safeStringify(
          result
        )
    );


    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "DAILY WORKER TEST COMPLETED"
    );

    console.log(
      "================================================="
    );

  } catch (error) {

    console.error("");

    console.error(
      "================================================="
    );

    console.error(
      "DAILY WORKER TEST FAILED"
    );

    console.error(
      "================================================="
    );

    console.error("");

    console.error(
      error
    );

  } finally {

    process.exit(0);

  }

}


// =====================================================
// RUN
// =====================================================

test();