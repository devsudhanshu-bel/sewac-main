require("../config/loadEnv");

const historicalProcessingManager =
  require(
    "../citizenHistorical/processing/HistoricalProcessingManager"
  );


// =====================================================
// TEST DATE
// =====================================================

const TEST_DATE =
  new Date(
    2026,
    7,
    9
  );


// =====================================================
// BIGINT SAFE JSON
// =====================================================

function safeStringify(
  value
) {

  return JSON.stringify(
    value,
    (key, value) =>
      typeof value === "bigint"
        ? value.toString()
        : value,
    2
  );

}


// =====================================================
// MAIN
// =====================================================

async function test() {

  try {

    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "HISTORICAL PROCESSING MANAGER TEST"
    );

    console.log(
      "================================================="
    );

    console.log("");


    // =================================================
    // STEP 1
    // =================================================

    console.log(
      "Initializing processing tables..."
    );

    await historicalProcessingManager
      .initialize();


    console.log("");


    // =================================================
    // STEP 2
    // =================================================

    console.log(
      "Getting processing job..."
    );

    const job =
      await historicalProcessingManager
        .getOrCreateJob(
          TEST_DATE
        );


    console.log("");

    console.log(
      "PROCESSING JOB:"
    );

    console.log("");

    console.log(
      safeStringify(
        job
      )
    );


    // =================================================
    // STEP 3
    // =================================================

    console.log("");

    console.log(
      "Starting job..."
    );


    const startedJob =
      await historicalProcessingManager
        .startJob(
          job.job_id
        );


    console.log("");

    console.log(
      "STARTED JOB:"
    );

    console.log("");

    console.log(
      safeStringify(
        startedJob
      )
    );


    // =================================================
    // STEP 4
    // =================================================

    console.log("");

    console.log(
      "Updating heartbeat..."
    );


    await historicalProcessingManager
      .heartbeat(
        job.job_id
      );


    console.log(
      "Heartbeat updated."
    );


    // =================================================
    // STEP 5
    // =================================================

    console.log("");

    console.log(
      "Getting final job summary..."
    );


    const summary =
      await historicalProcessingManager
        .getJobSummary(
          job.job_id
        );


    console.log("");

    console.log(
      "JOB SUMMARY:"
    );

    console.log("");

    console.log(
      safeStringify(
        summary
      )
    );


    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "PROCESSING MANAGER TEST PASSED"
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
      "PROCESSING MANAGER TEST FAILED"
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