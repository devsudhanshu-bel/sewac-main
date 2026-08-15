require("../config/loadEnv");

const telemetryDb =
  require("../config/telemetryDb");

const citizenHistoricalPrisma =
  require("../config/citizenHistoricalPrisma");


// =====================================================
// MULTI VEHICLE TEST CLEANUP
// =====================================================
//
// PURPOSE:
//
// Remove ONLY old MULTI TEST records created by the
// multi-vehicle testing.
//
// TELEMETRY DATABASE:
//
//   day_09082026
//   KA01AB1234_09082026
//   KA02AB5678_09082026
//
// CITIZEN HISTORICAL DATABASE:
//
//   ward_101_082026
//
// IMPORTANT:
//
// Original telemetry ID 1 is NOT deleted.
//
// Only records where:
//
//   remarks LIKE 'MULTI TEST%'
//
// are deleted.
//
// =====================================================


// =====================================================
// PROCESSING DATE
// =====================================================

const processingDate =
  new Date(
    "2026-08-09T14:38:12.314Z"
  );


// =====================================================
// VEHICLE TABLES
// =====================================================

const vehicleTables = [
  "KA01AB1234_09082026",
  "KA02AB5678_09082026",
];


// =====================================================
// HISTORICAL MONTHLY TABLE
// =====================================================
//
// This is the actual historical data table.
//
// DO NOT touch:
//
//   ward_101_2026
//
// because that table is only the yearly/monthly index.
//
// =====================================================

const historicalMonthlyTable =
  "ward_101_082026";


// =====================================================
// SAFE JSON STRINGIFY
// =====================================================

function safeStringify(value) {

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
// TELEMETRY TABLE EXISTS
// =====================================================

async function telemetryTableExists(
  tableName
) {

  const result =
    await telemetryDb
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
// HISTORICAL TABLE EXISTS
// =====================================================

async function historicalTableExists(
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
// SHOW CURRENT TELEMETRY TEST DATA
// =====================================================
//
// IMPORTANT:
//
// Telemetry DB uses lowercase physical column names:
//
//   iottimestamp
//   receivedtimestamp
//   rfidepc
//   citizenid
//   wastetype
//   etc.
//
// We use SELECT * so this verification does not depend
// on Prisma/camelCase names.
// =====================================================

async function showVehicleTestRecords() {

  console.log("");

  console.log(
    "================================================="
  );

  console.log(
    "CURRENT TELEMETRY TEST DATA"
  );

  console.log(
    "================================================="
  );


  for (
    const tableName
    of vehicleTables
  ) {

    const exists =
      await telemetryTableExists(
        tableName
      );


    if (
      !exists
    ) {

      console.log("");

      console.log(
        "Vehicle table does not exist:",
        tableName
      );

      continue;

    }


    const records =
      await telemetryDb
        .$queryRawUnsafe(
          `
          SELECT *

          FROM "${tableName}"

          WHERE "remarks" LIKE 'MULTI TEST%'

          ORDER BY "id"
          `
        );


    console.log("");

    console.log(
      "Vehicle Table:",
      tableName
    );

    console.log(
      "MULTI TEST records:",
      records.length
    );


    if (
      records.length > 0
    ) {

      console.log(
        safeStringify(
          records
        )
      );

    }

  }

}


// =====================================================
// CLEAN TELEMETRY VEHICLE TABLES
// =====================================================
//
// Uses:
//
//   telemetryDb
//
// NOT:
//
//   citizenHistoricalPrisma
//
// =====================================================

async function cleanupVehicleTables() {

  console.log("");

  console.log(
    "================================================="
  );

  console.log(
    "CLEANING TELEMETRY VEHICLE TABLES"
  );

  console.log(
    "================================================="
  );


  let totalDeleted =
    0;


  for (
    const tableName
    of vehicleTables
  ) {

    const exists =
      await telemetryTableExists(
        tableName
      );


    if (
      !exists
    ) {

      console.log("");

      console.log(
        "Vehicle table does not exist:",
        tableName
      );

      continue;

    }


    // =================================================
    // COUNT
    // =================================================

    const countResult =
      await telemetryDb
        .$queryRawUnsafe(
          `
          SELECT COUNT(*)::BIGINT AS count

          FROM "${tableName}"

          WHERE "remarks" LIKE 'MULTI TEST%'
          `
        );


    const count =
      Number(
        countResult[0]?.count ||
        0
      );


    console.log("");

    console.log(
      "Vehicle Table:",
      tableName
    );

    console.log(
      "MULTI TEST records:",
      count
    );


    if (
      count === 0
    ) {

      console.log(
        "Nothing to delete."
      );

      continue;

    }


    // =================================================
    // DELETE
    // =================================================

    const deleted =
      await telemetryDb
        .$executeRawUnsafe(
          `
          DELETE FROM "${tableName}"

          WHERE "remarks" LIKE 'MULTI TEST%'
          `
        );


    console.log(
      "Deleted:",
      deleted
    );


    totalDeleted +=
      Number(
        deleted
      );

  }


  console.log("");

  console.log(
    "Total telemetry test records deleted:",
    totalDeleted
  );


  return totalDeleted;

}


// =====================================================
// CLEAN HISTORICAL MONTHLY TABLE
// =====================================================
//
// Uses:
//
//   citizenHistoricalPrisma
//
// Only the monthly historical data table is touched.
//
// The yearly table is NEVER treated as telemetry data.
// =====================================================

async function cleanupHistoricalTable() {

  console.log("");

  console.log(
    "================================================="
  );

  console.log(
    "CLEANING HISTORICAL MONTHLY TABLE"
  );

  console.log(
    "================================================="
  );


  const exists =
    await historicalTableExists(
      historicalMonthlyTable
    );


  if (
    !exists
  ) {

    console.log("");

    console.log(
      "Historical monthly table does not exist:",
      historicalMonthlyTable
    );

    return 0;

  }


  // =================================================
  // COUNT
  // =================================================

  const countResult =
    await citizenHistoricalPrisma
      .$queryRawUnsafe(
        `
        SELECT COUNT(*)::BIGINT AS count

        FROM "${historicalMonthlyTable}"

        WHERE "remarks" LIKE 'MULTI TEST%'
        `
      );


  const count =
    Number(
      countResult[0]?.count ||
      0
    );


  console.log("");

  console.log(
    "Historical Table:",
    historicalMonthlyTable
  );

  console.log(
    "MULTI TEST records:",
    count
  );


  if (
    count === 0
  ) {

    console.log(
      "Nothing to delete."
    );

    return 0;

  }


  // =================================================
  // DELETE
  // =================================================

  const deleted =
    await citizenHistoricalPrisma
      .$executeRawUnsafe(
        `
        DELETE FROM "${historicalMonthlyTable}"

        WHERE "remarks" LIKE 'MULTI TEST%'
        `
      );


  console.log(
    "Deleted:",
    deleted
  );


  return Number(
    deleted
  );

}


// =====================================================
// VERIFY ORIGINAL TELEMETRY
// =====================================================
//
// IMPORTANT:
//
// We DO NOT explicitly request:
//
//   "rfidEpc"
//   "citizenId"
//   "iotTimestamp"
//
// because the actual PostgreSQL telemetry schema uses:
//
//   rfidepc
//   citizenid
//   iottimestamp
//
// SELECT * avoids the casing problem entirely.
//
// =====================================================

async function verifyOriginalTelemetry() {

  console.log("");

  console.log(
    "================================================="
  );

  console.log(
    "VERIFYING ORIGINAL TELEMETRY"
  );

  console.log(
    "================================================="
  );


  const tableName =
    "KA01AB1234_09082026";


  const exists =
    await telemetryTableExists(
      tableName
    );


  if (
    !exists
  ) {

    console.log("");

    console.log(
      "Vehicle table does not exist:",
      tableName
    );

    return false;

  }


  // =================================================
  // FIND ORIGINAL RECORD
  // =================================================
  //
  // We only need ID 1.
  //
  // SELECT * ensures compatibility with the actual
  // lowercase PostgreSQL schema.
  // =================================================

  const result =
    await telemetryDb
      .$queryRawUnsafe(
        `
        SELECT *

        FROM "${tableName}"

        WHERE "id" = 1

        LIMIT 1
        `
      );


  if (
    !result.length
  ) {

    console.log("");

    console.log(
      "WARNING:"
    );

    console.log(
      "Original telemetry ID 1 was NOT found."
    );

    return false;

  }


  console.log("");

  console.log(
    "Original telemetry ID 1 still exists:"
  );

  console.log(
    safeStringify(
      result[0]
    )
  );


  return true;

}


// =====================================================
// VERIFY NO TELEMETRY TEST RECORDS REMAIN
// =====================================================

async function verifyNoVehicleTestRecords() {

  console.log("");

  console.log(
    "================================================="
  );

  console.log(
    "VERIFYING TELEMETRY CLEANUP"
  );

  console.log(
    "================================================="
  );


  let remaining =
    0;


  for (
    const tableName
    of vehicleTables
  ) {

    const exists =
      await telemetryTableExists(
        tableName
      );


    if (
      !exists
    ) {

      continue;

    }


    const result =
      await telemetryDb
        .$queryRawUnsafe(
          `
          SELECT COUNT(*)::BIGINT AS count

          FROM "${tableName}"

          WHERE "remarks" LIKE 'MULTI TEST%'
          `
        );


    const count =
      Number(
        result[0]?.count ||
        0
      );


    console.log("");

    console.log(
      tableName,
      "remaining MULTI TEST:",
      count
    );


    remaining +=
      count;

  }


  console.log("");

  console.log(
    "Total remaining telemetry MULTI TEST records:",
    remaining
  );


  return remaining;

}


// =====================================================
// VERIFY NO HISTORICAL TEST RECORDS REMAIN
// =====================================================

async function verifyNoHistoricalTestRecords() {

  console.log("");

  console.log(
    "================================================="
  );

  console.log(
    "VERIFYING HISTORICAL CLEANUP"
  );

  console.log(
    "================================================="
  );


  const exists =
    await historicalTableExists(
      historicalMonthlyTable
    );


  if (
    !exists
  ) {

    console.log("");

    console.log(
      "Historical table does not exist."
    );

    return 0;

  }


  const result =
    await citizenHistoricalPrisma
      .$queryRawUnsafe(
        `
        SELECT COUNT(*)::BIGINT AS count

        FROM "${historicalMonthlyTable}"

        WHERE "remarks" LIKE 'MULTI TEST%'
        `
      );


  const count =
    Number(
      result[0]?.count ||
      0
    );


  console.log("");

  console.log(
    historicalMonthlyTable,
    "remaining MULTI TEST:",
    count
  );


  return count;

}


// =====================================================
// RESET HISTORICAL PROCESSING JOB
// =====================================================
//
// We reset the existing job so the final multi-vehicle
// test can process the day's telemetry again.
//
// =====================================================

async function resetProcessingJob() {

  console.log("");

  console.log(
    "================================================="
  );

  console.log(
    "RESETTING HISTORICAL PROCESSING JOB"
  );

  console.log(
    "================================================="
  );


  const jobs =
    await citizenHistoricalPrisma
      .$queryRawUnsafe(
        `
        SELECT *

        FROM historical_processing_jobs

        WHERE processing_date = $1::date

        ORDER BY job_id DESC

        LIMIT 1
        `,
        "2026-08-09"
      );


  if (
    !jobs.length
  ) {

    console.log("");

    console.log(
      "No processing job found."
    );

    return;

  }


  const job =
    jobs[0];


  console.log("");

  console.log(
    "Current Job:"
  );

  console.log(
    safeStringify(
      job
    )
  );


  // =================================================
  // RESET JOB
  // =================================================

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


  // =================================================
  // CLEAR PROCESSING RECORDS
  // =================================================

  await citizenHistoricalPrisma
    .$executeRawUnsafe(
      `
      DELETE FROM historical_processing_records

      WHERE job_id = $1
      `,
      job.job_id
    );


  console.log("");

  console.log(
    "Processing job reset to PENDING."
  );

}


// =====================================================
// MAIN CLEANUP
// =====================================================

async function cleanup() {

  console.log("");

  console.log(
    "================================================="
  );

  console.log(
    "MULTI VEHICLE TEST CLEANUP"
  );

  console.log(
    "================================================="
  );

  console.log("");

  console.log(
    "Processing Date:",
    processingDate
  );

  console.log("");

  console.log(
    "IMPORTANT:"
  );

  console.log(
    "Original telemetry ID 1 will NOT be deleted."
  );

  console.log(
    'Only records with remarks LIKE "MULTI TEST%"'
  );

  console.log(
    "will be deleted."
  );


  try {

    // =================================================
    // SHOW CURRENT DATA
    // =================================================

    await showVehicleTestRecords();


    // =================================================
    // CLEAN TELEMETRY DATABASE
    // =================================================

    const deletedTelemetry =
      await cleanupVehicleTables();


    // =================================================
    // CLEAN HISTORICAL DATABASE
    // =================================================

    const deletedHistorical =
      await cleanupHistoricalTable();


    // =================================================
    // VERIFY ORIGINAL TELEMETRY
    // =================================================

    const originalExists =
      await verifyOriginalTelemetry();


    // =================================================
    // VERIFY TELEMETRY CLEANUP
    // =================================================

    const remainingVehicle =
      await verifyNoVehicleTestRecords();


    // =================================================
    // VERIFY HISTORICAL CLEANUP
    // =================================================

    const remainingHistorical =
      await verifyNoHistoricalTestRecords();


    // =================================================
    // RESET JOB
    // =================================================

    await resetProcessingJob();


    // =================================================
    // FINAL RESULT
    // =================================================

    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "CLEANUP RESULT"
    );

    console.log(
      "================================================="
    );

    console.log("");

    console.log(
      "Telemetry records deleted:",
      deletedTelemetry
    );

    console.log(
      "Historical records deleted:",
      deletedHistorical
    );

    console.log(
      "Remaining vehicle MULTI TEST:",
      remainingVehicle
    );

    console.log(
      "Remaining historical MULTI TEST:",
      remainingHistorical
    );

    console.log(
      "Original telemetry ID 1 exists:",
      originalExists
    );


    // =================================================
    // FINAL PASS
    // =================================================

    const passed =
      (
        remainingVehicle === 0 &&
        remainingHistorical === 0 &&
        originalExists === true
      );


    console.log("");

    console.log(
      "================================================="
    );


    if (
      passed
    ) {

      console.log(
        "CLEANUP PASSED"
      );

      console.log(
        "================================================="
      );

      console.log("");

      console.log(
        "Database is ready for the final"
      );

      console.log(
        "Ward-101-only multi-vehicle test."
      );

    } else {

      console.log(
        "CLEANUP FAILED"
      );

      console.log(
        "================================================="
      );

      console.log("");

      console.log(
        "DO NOT run the multi-vehicle test yet."
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
      "CLEANUP ERROR"
    );

    console.log(
      "================================================="
    );

    console.error(
      error
    );

  } finally {

    process.exit();

  }

}


// =====================================================
// RUN
// =====================================================

cleanup();