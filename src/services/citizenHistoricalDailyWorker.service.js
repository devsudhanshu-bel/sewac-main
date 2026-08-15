const {
  archiveDate,
} = require("../controllers/historicalDatabase.controller");


// ============================================================
// CITIZEN HISTORICAL DAILY WORKER
// ============================================================
//
// PURPOSE:
//
// This worker is responsible ONLY for triggering the existing
// historical telemetry archive.
//
// It does NOT:
//
// ❌ Process citizen GPS
// ❌ Resolve citizen boundaries
// ❌ Lookup ward boundaries
// ❌ Process citizen historical data
// ❌ Create another historical pipeline
//
// CURRENT FLOW:
//
// Scheduler
//     ↓
// Daily Worker
//     ↓
// historicalDatabase.controller
//     ↓
// archiveDate()
//     ↓
// master_telemetry_db
//     ↓
// day_DDMMYYYY
//     ↓
// vehicle_table_name
//     ↓
// actual vehicle telemetry table
//     ↓
// ward_no
//     ↓
// citizen historical database
//
// IMPORTANT:
//
// The archive controller already contains the actual archive
// logic. This worker should NOT duplicate it.
//
// ============================================================


// ============================================================
// GET TODAY
// ============================================================

function getToday() {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(date) {
  const year =
    date.getFullYear();

  const month =
    String(date.getMonth() + 1)
      .padStart(2, "0");

  const day =
    String(date.getDate())
      .padStart(2, "0");

  return `${year}-${month}-${day}`;
}


// ============================================================
// PROCESS DAY
// ============================================================
//
// The scheduler calls:
//
// processDay()
//
// or:
//
// processDay(date)
//
//
//
// If no date is supplied:
//
// TODAY is archived.
//
// ============================================================

async function processDay(
  processingDate = null
) {

  const date =
    processingDate
      ? new Date(processingDate)
      : getToday();


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    throw new Error(
      "Invalid processing date."
    );

  }


  const formattedDate =
    formatDate(date);


  console.log("");

  console.log(
    "============================================================"
  );

  console.log(
    "🚛 SEWAC DAILY HISTORICAL ARCHIVE WORKER"
  );

  console.log(
    "============================================================"
  );

  console.log(
    "Archive target:",
    formattedDate
  );

  console.log(
    "Mode:",
    "TODAY"
  );

  console.log(
    "============================================================"
  );


  try {

    // ========================================================
    // CALL THE EXISTING ARCHIVE LOGIC
    // ========================================================

    const result =
      await archiveDate(
        formattedDate
      );


    console.log("");

    console.log(
      "============================================================"
  );

    console.log(
      "✅ DAILY HISTORICAL ARCHIVE COMPLETED"
    );

    console.log(
      "============================================================"
    );

    console.log(
      "Date:",
      formattedDate
    );

    console.log(
      "Vehicles archived:",
      result.archivedVehicles ?? 0
    );

    console.log(
      "Records inserted:",
      result.archivedRecords ?? 0
    );

    console.log(
      "Duplicates:",
      result.duplicateRecords ?? 0
    );

    console.log(
      "Failed vehicles:",
      result.failedVehicles?.length ?? 0
    );

    console.log(
      "============================================================"
    );


    return {

      status:
        "COMPLETED",

      processingDate:
        formattedDate,

      result,

    };

  } catch (error) {

    console.error("");

    console.error(
      "============================================================"
    );

    console.error(
      "❌ DAILY HISTORICAL ARCHIVE FAILED"
    );

    console.error(
      "============================================================"
    );

    console.error(
      "Date:",
      formattedDate
    );

    console.error(
      "Error:",
      error.message
    );

    console.error(
      "============================================================"
    );


    return {

      status:
        "FAILED",

      processingDate:
        formattedDate,

      error:
        error.message,

    };

  }

}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

  processDay,

  getToday,

  formatDate,

};