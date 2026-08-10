require("./config/loadEnv");

const initializeTelemetryDB =
  require("./telemetry/initialize/initializeTelemetryDB");

const telemetryPipelineService =
  require("./telemetry/services/TelemetryPipelineService");

const telemetryDailyRepository =
  require("./repositories/telemetryDaily.repository");

const citizenHistoricalDailyWorker =
  require("./services/citizenHistoricalDailyWorker.service");

const historicalProcessingManager =
  require("./citizenHistorical/processing/HistoricalProcessingManager");

const citizenHistoricalPrisma =
  require("./config/citizenHistoricalPrisma");


// =====================================================
// CITIZEN HISTORICAL MULTI VEHICLE TEST
// =====================================================
//
// PURPOSE:
//
// Test that:
//
// 1. Multiple vehicles can be read.
// 2. Their telemetry can be processed.
// 3. Historical records are written.
// 4. Historical processing is idempotent.
// 5. Running the same job again does NOT duplicate data.
// 6. Failed records remain at zero.
// 7. Ward 101 is the only historical ward required
//    for this test.
//
// =====================================================
//
// IMPORTANT:
//
// The current test database already contains the
// MULTI TEST telemetry and historical records.
//
// Therefore this test primarily validates the
// IDEMPOTENT RE-RUN:
//
//     Total    = 7
//     Processed = 0
//     Skipped   = 7
//     Failed    = 0
//
// =====================================================


const processingDate =
  new Date(
    "2026-08-09T14:38:12.314Z"
  );


const VEHICLE_1 =
  "KA01AB1234";


const VEHICLE_2 =
  "KA02AB5678";


const EXPECTED_TOTAL_RECORDS =
  7;


const EXPECTED_PROCESSED_RECORDS =
  0;


const EXPECTED_SKIPPED_RECORDS =
  7;


const EXPECTED_FAILED_RECORDS =
  0;


const EXPECTED_MONTHLY_TABLE =
  "ward_101_082026";


const EXPECTED_YEARLY_TABLE =
  "ward_101_2026";


const MIN_EXPECTED_HISTORICAL_RECORDS =
  1;


// =====================================================
// SAFE JSON STRINGIFY
// =====================================================

function safeStringify(
  value
) {

  return JSON.stringify(
    value,
    (
      key,
      currentValue
    ) => {

      if (
        typeof currentValue ===
        "bigint"
      ) {

        return currentValue.toString();

      }

      return currentValue;

    },
    2
  );

}


// =====================================================
// GET VEHICLE TELEMETRY
// =====================================================

async function getVehicleRecords(
  vehicleTableName
) {

  try {

    return await telemetryDailyRepository
      .getTelemetryRecords(
        vehicleTableName
      );

  } catch (
    error
  ) {

    console.error(
      "Unable to load vehicle records:",
      vehicleTableName
    );

    console.error(
      error.message
    );

    return [];

  }

}


// =====================================================
// FIND MULTI TEST RECORDS
// =====================================================

async function findMultiTestRecords(
  snapshot
) {

  const records =
    [];


  for (
    const vehicle
    of snapshot.vehicles
  ) {

    const vehicleTableName =
      vehicle.vehicle_table_name;


    const vehicleRecords =
      await getVehicleRecords(
        vehicleTableName
      );


    for (
      const record
      of vehicleRecords
    ) {

      if (
        typeof record.remarks ===
          "string" &&
        record.remarks.startsWith(
          "MULTI TEST"
        )
      ) {

        records.push({
          vehicleTableName,
          record,
        });

      }

    }

  }


  return records;

}


// =====================================================
// PRINT MULTI TEST RECORDS
// =====================================================

async function printCurrentMultiTestData(
  snapshot
) {

  console.log("");

  console.log(
    "================================================="
  );

  console.log(
    "CURRENT MULTI TEST TELEMETRY"
  );

  console.log(
    "================================================="
  );


  const records =
    await findMultiTestRecords(
      snapshot
    );


  console.log("");

  console.log(
    "Existing multi-test telemetry:",
    records.length
  );


  for (
    const item
    of records
  ) {

    console.log("");

    console.log(
      "Vehicle Table:",
      item.vehicleTableName
    );

    console.log(
      "Telemetry ID:",
      String(
        item.record.id
      )
    );

    console.log(
      "Remarks:",
      item.record.remarks
    );

  }


  return records;

}


// =====================================================
// RESET COMPLETED JOB FOR IDEMPOTENCY TEST
// =====================================================
//
// IMPORTANT:
//
// We reset the processing job itself, but we DO NOT
// delete historical processing records.
//
// That means the worker sees the same telemetry again
// and should correctly identify every record as already
// processed.
//
// Expected:
//
//     processed = 0
//     skipped   = 7
//
// =====================================================

async function resetCompletedJobForIdempotencyTest() {

  const normalizedDate =
    "2026-08-09";


  const job =
    await historicalProcessingManager
      .getJobByDate(
        normalizedDate
      );


  if (
    !job
  ) {

    console.log("");

    console.log(
      "No processing job exists."
    );

    console.log(
      "The worker will create one."
    );

    return null;

  }


  console.log("");

  console.log(
    "Existing Processing Job:"
  );

  console.log(
    safeStringify(
      job
    )
  );


  if (
    job.status ===
    "RUNNING"
  ) {

    throw new Error(
      "Historical processing job is currently RUNNING."
    );

  }


  if (
    job.status ===
    "COMPLETED"
  ) {

    console.log("");

    console.log(
      "Job is already COMPLETED."
    );

    console.log(
      "Resetting only the job summary for idempotency testing."
    );

  }


  if (
    job.status ===
    "FAILED"
  ) {

    console.log("");

    console.log(
      "Job is FAILED."
    );

    console.log(
      "Resetting job for retry."
    );

  }


  // ===================================================
  // RESET JOB SUMMARY
  // ===================================================
  //
  // DO NOT DELETE historical_processing_records.
  //
  // Those records are exactly what allow the worker
  // to detect that telemetry has already been processed.
  //
  // ===================================================

  await citizenHistoricalPrisma
    .$executeRawUnsafe(
      `
      UPDATE historical_processing_jobs

      SET

        status = 'PENDING',

        started_at = NULL,

        completed_at = NULL,

        last_heartbeat_at = NULL,

        total_vehicles = 0,

        total_records = 0,

        processed_records = 0,

        failed_records = 0,

        skipped_records = 0,

        updated_at =
          CURRENT_TIMESTAMP

      WHERE job_id = $1
      `,
      job.job_id
    );


  console.log("");

  console.log(
    "Processing job reset."
  );


  return job.job_id;

}


// =====================================================
// GET PROCESSING JOB
// =====================================================

async function getProcessingJob() {

  const job =
    await historicalProcessingManager
      .getJobByDate(
        "2026-08-09"
      );


  return job;

}


// =====================================================
// VERIFY MONTHLY TABLE EXISTS
// =====================================================

async function monthlyTableExists(
  tableName
) {

  const result =
    await citizenHistoricalPrisma
      .$queryRawUnsafe(
        `
        SELECT EXISTS (

          SELECT 1

          FROM information_schema.tables

          WHERE table_schema = 'public'

          AND table_name = $1

        ) AS exists
        `,
        tableName
      );


  return Boolean(
    result[0]?.exists
  );

}


// =====================================================
// VERIFY YEARLY TABLE EXISTS
// =====================================================

async function yearlyTableExists(
  tableName
) {

  const result =
    await citizenHistoricalPrisma
      .$queryRawUnsafe(
        `
        SELECT EXISTS (

          SELECT 1

          FROM information_schema.tables

          WHERE table_schema = 'public'

          AND table_name = $1

        ) AS exists
        `,
        tableName
      );


  return Boolean(
    result[0]?.exists
  );

}


// =====================================================
// COUNT MONTHLY HISTORICAL RECORDS
// =====================================================

async function countMonthlyRecords(
  tableName
) {

  const result =
    await citizenHistoricalPrisma
      .$queryRawUnsafe(
        `
        SELECT
          COUNT(*)::BIGINT AS count

        FROM "${tableName}"
        `
      );


  return Number(
    result[0]?.count ||
    0
  );

}


// =====================================================
// GET MONTHLY HISTORICAL RECORDS
// =====================================================

async function getMonthlyHistoricalRecords(
  tableName
) {

  return await citizenHistoricalPrisma
    .$queryRawUnsafe(
      `
      SELECT *

      FROM "${tableName}"

      ORDER BY
        "telemetry_id"
      `
    );

}


// =====================================================
// GET YEARLY INDEX
// =====================================================
//
// The yearly table is NOT a copy of the monthly
// historical data.
//
// It is an INDEX of monthly tables.
//
// =====================================================

async function getYearlyIndex(
  tableName
) {

  return await citizenHistoricalPrisma
    .$queryRawUnsafe(
      `
      SELECT *

      FROM "${tableName}"

      ORDER BY
        month_number
      `
    );

}


// =====================================================
// VERIFY HISTORICAL RESULTS
// =====================================================

async function verifyHistoricalResults() {

  console.log("");

  console.log(
    "================================================="
  );

  console.log(
    "VERIFYING WARD 101 HISTORICAL TABLE"
  );

  console.log(
    "================================================="
  );


  // ===================================================
  // MONTHLY TABLE
  // ===================================================

  const monthlyExists =
    await monthlyTableExists(
      EXPECTED_MONTHLY_TABLE
    );


  console.log("");

  console.log(
    "Monthly Table:",
    EXPECTED_MONTHLY_TABLE
  );

  console.log(
    "Monthly Table Exists:",
    monthlyExists
  );


  if (
    !monthlyExists
  ) {

    throw new Error(
      `Monthly historical table does not exist: ${EXPECTED_MONTHLY_TABLE}`
    );

  }


  const monthlyCount =
    await countMonthlyRecords(
      EXPECTED_MONTHLY_TABLE
    );


  console.log("");

  console.log(
    `${EXPECTED_MONTHLY_TABLE} → ${monthlyCount} records`
  );


  const monthlyRecords =
    await getMonthlyHistoricalRecords(
      EXPECTED_MONTHLY_TABLE
    );


  console.log("");

  console.log(
    "Monthly Historical Records:"
  );

  console.log(
    safeStringify(
      monthlyRecords
    )
  );


  // ===================================================
  // YEARLY INDEX
  // ===================================================

  const yearlyExists =
    await yearlyTableExists(
      EXPECTED_YEARLY_TABLE
    );


  console.log("");

  console.log(
    "Yearly Table:",
    EXPECTED_YEARLY_TABLE
  );

  console.log(
    "Yearly Table Exists:",
    yearlyExists
  );


  if (
    !yearlyExists
  ) {

    throw new Error(
      `Yearly historical index does not exist: ${EXPECTED_YEARLY_TABLE}`
    );

  }


  const yearlyIndex =
    await getYearlyIndex(
      EXPECTED_YEARLY_TABLE
    );


  console.log("");

  console.log(
    "Yearly Index:"
  );

  console.log(
    safeStringify(
      yearlyIndex
    )
  );


  return {

    monthlyTable:
      EXPECTED_MONTHLY_TABLE,

    monthlyExists,

    monthlyCount,

    monthlyRecords,

    yearlyTable:
      EXPECTED_YEARLY_TABLE,

    yearlyExists,

    yearlyIndex,

  };

}


// =====================================================
// VALIDATE YEARLY INDEX
// =====================================================

function validateYearlyIndex(
  yearlyIndex
) {

  if (
    !Array.isArray(
      yearlyIndex
    )
  ) {

    return false;

  }


  const augustEntry =
    yearlyIndex.find(
      entry =>
        Number(
          entry.month_number
        ) === 8
    );


  if (
    !augustEntry
  ) {

    return false;

  }


  if (
    augustEntry.table_name !==
      EXPECTED_MONTHLY_TABLE
  ) {

    return false;

  }


  return true;

}


// =====================================================
// VALIDATE HISTORICAL RECORDS
// =====================================================

function validateHistoricalRecords(
  monthlyRecords
) {

  if (
    !Array.isArray(
      monthlyRecords
    )
  ) {

    return false;

  }


  if (
    monthlyRecords.length <
    MIN_EXPECTED_HISTORICAL_RECORDS
  ) {

    return false;

  }


  return true;

}


// =====================================================
// MAIN TEST
// =====================================================

async function test() {

  console.log("");

  console.log(
    "================================================="
  );

  console.log(
    "CITIZEN HISTORICAL MULTI VEHICLE TEST"
  );

  console.log(
    "================================================="
  );

  console.log("");

  console.log(
    "Processing Date:",
    processingDate
  );


  try {

    // =================================================
    // INITIALIZE TELEMETRY DATABASE
    // =================================================

    await initializeTelemetryDB.initialize();


    console.log("");

    console.log(
      "Telemetry database initialized."
    );


    // =================================================
    // GET DAY SNAPSHOT
    // =================================================

    const snapshot =
      await telemetryDailyRepository
        .getDaySnapshot(
          processingDate
        );


    console.log("");

    console.log(
      "Current day table:",
      snapshot.dayTableName
    );


    if (
      !snapshot.dayTableExists
    ) {

      throw new Error(
        `Day table does not exist: ${snapshot.dayTableName}`
      );

    }


    // =================================================
    // VERIFY BOTH VEHICLES EXIST
    // =================================================

    const vehicleNumbers =
      snapshot.vehicles.map(
        vehicle =>
          vehicle.vehicle_number
      );


    console.log("");

    console.log(
      "Vehicles Found:",
      vehicleNumbers.length
    );


    console.log(
      "Vehicles:",
      vehicleNumbers
    );


    if (
      !vehicleNumbers.includes(
        VEHICLE_1
      )
    ) {

      throw new Error(
        `${VEHICLE_1} was not found in the day table.`
      );

    }


    if (
      !vehicleNumbers.includes(
        VEHICLE_2
      )
    ) {

      throw new Error(
        `${VEHICLE_2} was not found in the day table.`
      );

    }


    // =================================================
    // PRINT CURRENT TEST DATA
    // =================================================

    await printCurrentMultiTestData(
      snapshot
    );


    // =================================================
    // GET CURRENT JOB
    // =================================================

    const existingJob =
      await getProcessingJob();


    if (
      existingJob
    ) {

      console.log("");

      console.log(
        "Existing Processing Job:"
      );

      console.log(
        safeStringify(
          existingJob
        )
      );

    }


    // =================================================
    // RESET JOB ONLY
    // =================================================
    //
    // IMPORTANT:
    //
    // We keep historical_processing_records.
    //
    // Therefore the worker should classify all 7
    // telemetry records as already processed.
    //
    // =================================================

    await resetCompletedJobForIdempotencyTest();


    // =================================================
    // START WORKER
    // =================================================

    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "STARTING HISTORICAL DAILY WORKER"
    );

    console.log(
      "================================================="
    );

    console.log("");


    const result =
      await citizenHistoricalDailyWorker
        .processDay(
          processingDate
        );


    // =================================================
    // RESULT
    // =================================================

    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "MULTI VEHICLE TEST RESULT"
    );

    console.log(
      "================================================="
    );

    console.log("");

    console.log(
      safeStringify(
        result
      )
    );


    // =================================================
    // COUNTERS
    // =================================================

    const total =
      Number(
        result?.total_records ||
        0
      );


    const processed =
      Number(
        result?.processed_records ||
        0
      );


    const skipped =
      Number(
        result?.skipped_records ||
        0
      );


    const failed =
      Number(
        result?.failed_records ||
        0
      );


    // =================================================
    // EXPECTED VS ACTUAL
    // =================================================

    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "EXPECTED VS ACTUAL"
    );

    console.log(
      "================================================="
    );

    console.log("");

    console.log(
      "Expected total:",
      EXPECTED_TOTAL_RECORDS
    );

    console.log(
      "Actual total:",
      total
    );

    console.log("");

    console.log(
      "Expected processed:",
      EXPECTED_PROCESSED_RECORDS
    );

    console.log(
      "Actual processed:",
      processed
    );

    console.log("");

    console.log(
      "Expected skipped:",
      EXPECTED_SKIPPED_RECORDS
    );

    console.log(
      "Actual skipped:",
      skipped
    );

    console.log("");

    console.log(
      "Expected failed:",
      EXPECTED_FAILED_RECORDS
    );

    console.log(
      "Actual failed:",
      failed
    );


    // =================================================
    // VERIFY HISTORICAL DATA
    // =================================================

    const historical =
      await verifyHistoricalResults();


    // =================================================
    // VALIDATE HISTORICAL DATA
    // =================================================

    const historicalRecordsValid =
      validateHistoricalRecords(
        historical.monthlyRecords
      );


    const yearlyIndexValid =
      validateYearlyIndex(
        historical.yearlyIndex
      );


    // =================================================
    // WORKER VALIDATION
    // =================================================

    const workerPassed =
      (
        total ===
          EXPECTED_TOTAL_RECORDS &&

        processed ===
          EXPECTED_PROCESSED_RECORDS &&

        skipped ===
          EXPECTED_SKIPPED_RECORDS &&

        failed ===
          EXPECTED_FAILED_RECORDS &&

        result?.status ===
          "COMPLETED"
      );


    // =================================================
    // HISTORICAL VALIDATION
    // =================================================

    const historicalPassed =
      (
        historical.monthlyExists ===
          true &&

        historical.monthlyTable ===
          EXPECTED_MONTHLY_TABLE &&

        historical.yearlyExists ===
          true &&

        historical.yearlyTable ===
          EXPECTED_YEARLY_TABLE &&

        historicalRecordsValid &&

        yearlyIndexValid
      );


    // =================================================
    // FINAL VALIDATION
    // =================================================

    const passed =
      (
        workerPassed &&
        historicalPassed
      );


    // =================================================
    // SUMMARY
    // =================================================

    console.log("");

    console.log(
      "================================================="
    );

    if (
      passed
    ) {

      console.log(
        "MULTI VEHICLE HISTORICAL TEST PASSED"
      );

    } else {

      console.log(
        "MULTI VEHICLE HISTORICAL TEST FAILED"
      );

    }

    console.log(
      "================================================="
    );


    console.log("");

    console.log(
      "FINAL HISTORICAL SUMMARY:"
    );

    console.log("");

    console.log(
      "Historical Table:",
      historical.monthlyTable
    );

    console.log(
      "Historical Records:",
      historical.monthlyCount
    );

    console.log(
      "Yearly Index:",
      historical.yearlyTable
    );

    console.log("");

    console.log(
      "Worker Status:",
      result?.status
    );

    console.log(
      "Worker Total:",
      total
    );

    console.log(
      "Worker Processed:",
      processed
    );

    console.log(
      "Worker Skipped:",
      skipped
    );

    console.log(
      "Worker Failed:",
      failed
    );

    console.log("");

    console.log(
      "Historical data validation:",
      historicalPassed
        ? "PASSED"
        : "FAILED"
    );

    console.log(
      "Yearly index validation:",
      yearlyIndexValid
        ? "PASSED"
        : "FAILED"
    );


    // =================================================
    // FAIL PROCESS IF VALIDATION FAILED
    // =================================================

    if (
      !passed
    ) {

      throw new Error(
        "Multi vehicle historical validation failed."
      );

    }


  } catch (
    error
  ) {

    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "MULTI VEHICLE TEST ERROR"
    );

    console.log(
      "================================================="
    );

    console.error(
      error
    );


    process.exitCode =
      1;

  } finally {

    process.exit();

  }

}


// =====================================================
// RUN TEST
// =====================================================

test();