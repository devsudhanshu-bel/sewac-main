const repository =
  require(
    "../repositories/citizenHistoricalTable.repository"
  );


// =====================================================
// MONTH NAMES
// =====================================================

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


// =====================================================
// ENSURE WARD HISTORICAL TABLES
// =====================================================
//
// This is the main function.
//
// Given:
//
// wardNo = 174
// month = 8
// year = 2026
//
// It guarantees:
//
// ward_174_2026
// ward_174_082026
//
// exist.
//
// And guarantees the monthly table is registered
// inside the yearly index.
//
// =====================================================

async function ensureWardHistoricalTables({
  wardNo,
  month,
  year,
}) {
  const numericMonth =
    Number(month);

  const numericYear =
    Number(year);

  const monthName =
    MONTH_NAMES[numericMonth - 1];

  if (!monthName) {
    throw new Error(
      "Invalid month"
    );
  }


  // ===================================================
  // GENERATE NAMES
  // ===================================================

  const yearlyTableName =
    repository.generateYearlyIndexTableName(
      wardNo,
      numericYear
    );

  const monthlyTableName =
    repository.generateMonthlyTableName(
      wardNo,
      numericMonth,
      numericYear
    );


  // ===================================================
  // YEARLY INDEX
  // ===================================================

  const yearlyExists =
    await repository.tableExists(
      yearlyTableName
    );

  if (!yearlyExists) {
    await repository.createYearlyIndexTable(
      yearlyTableName
    );
  }


  // ===================================================
  // MONTHLY HISTORY
  // ===================================================

  const monthlyExists =
    await repository.tableExists(
      monthlyTableName
    );

  if (!monthlyExists) {
    await repository.createMonthlyHistoryTable(
      monthlyTableName
    );
  }


  // ===================================================
  // REGISTER MONTH
  // ===================================================

  await repository.registerMonthlyTable(
    yearlyTableName,
    numericMonth,
    monthName,
    monthlyTableName
  );


  // ===================================================
  // RESULT
  // ===================================================

  return {
    wardNo: Number(wardNo),

    year: numericYear,

    month: numericMonth,

    monthName,

    yearlyTableName,

    monthlyTableName,

    yearlyTableCreated:
      !yearlyExists,

    monthlyTableCreated:
      !monthlyExists,
  };
}


// =====================================================
// GET WARD YEAR INDEX
// =====================================================

async function getWardYearIndex({
  wardNo,
  year,
}) {
  return repository.getYearlyIndex(
    Number(wardNo),
    Number(year)
  );
}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  ensureWardHistoricalTables,
  getWardYearIndex,
};