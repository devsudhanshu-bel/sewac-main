const citizenHistoricalPrisma = require(
  "../config/citizenHistoricalPrisma"
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
// VALIDATE SQL IDENTIFIER
// =====================================================

function validateIdentifier(value) {
  if (
    typeof value !== "string" ||
    !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)
  ) {
    throw new Error(
      `Invalid SQL identifier: ${value}`
    );
  }

  return value;
}


// =====================================================
// GENERATE YEAR TABLE
// =====================================================

function generateYearlyIndexTableName(
  wardNo,
  year
) {
  const numericWard = Number(wardNo);
  const numericYear = Number(year);

  if (
    !Number.isInteger(numericWard) ||
    numericWard <= 0
  ) {
    throw new Error("Invalid ward number");
  }

  if (
    !Number.isInteger(numericYear) ||
    numericYear < 2000
  ) {
    throw new Error("Invalid year");
  }

  return `ward_${numericWard}_${numericYear}`;
}


// =====================================================
// GENERATE MONTH TABLE
// =====================================================

function generateMonthlyTableName(
  wardNo,
  month,
  year
) {
  const numericWard = Number(wardNo);
  const numericMonth = Number(month);
  const numericYear = Number(year);

  if (
    !Number.isInteger(numericWard) ||
    numericWard <= 0
  ) {
    throw new Error("Invalid ward number");
  }

  if (
    !Number.isInteger(numericMonth) ||
    numericMonth < 1 ||
    numericMonth > 12
  ) {
    throw new Error("Invalid month");
  }

  if (
    !Number.isInteger(numericYear) ||
    numericYear < 2000
  ) {
    throw new Error("Invalid year");
  }

  return `ward_${numericWard}_${String(
    numericMonth
  ).padStart(2, "0")}${numericYear}`;
}


// =====================================================
// TABLE EXISTS
// =====================================================

async function tableExists(
  tableName
) {
  validateIdentifier(tableName);

  const result =
    await citizenHistoricalPrisma.$queryRawUnsafe(
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

  return result[0]?.exists === true;
}


// =====================================================
// CREATE YEARLY INDEX
// =====================================================

async function createYearlyIndexTable(
  tableName
) {
  validateIdentifier(tableName);

  await citizenHistoricalPrisma.$queryRawUnsafe(
    `
    CREATE TABLE IF NOT EXISTS "${tableName}" (

      month_number INTEGER PRIMARY KEY,

      month_name VARCHAR(20) NOT NULL,

      table_name VARCHAR(100) NOT NULL,

      created_at TIMESTAMP
        WITHOUT TIME ZONE
        DEFAULT NOW()

    )
    `
  );
}


// =====================================================
// CREATE MONTHLY HISTORY TABLE
// =====================================================
//
// IMPORTANT:
//
// The historical monthly table uses the same telemetry
// attributes as the source vehicle table, but with the
// historical naming convention.
//
// =====================================================

async function createMonthlyHistoryTable(
  tableName
) {
  validateIdentifier(tableName);

  await citizenHistoricalPrisma.$queryRawUnsafe(
    `
    CREATE TABLE IF NOT EXISTS "${tableName}" (

      historical_id BIGINT
        GENERATED ALWAYS AS IDENTITY
        PRIMARY KEY,

      source_telemetry_id BIGINT NOT NULL,

      source_vehicle_table VARCHAR(150) NOT NULL,

      vehicle_number VARCHAR(100),

      ward_no INTEGER NOT NULL,

      iot_timestamp TIMESTAMP WITHOUT TIME ZONE,

      received_timestamp TIMESTAMP WITHOUT TIME ZONE,

      rfid_epc VARCHAR(255),

      citizen_id INTEGER,

      waste_type VARCHAR(100),

      latitude NUMERIC(10,7),

      longitude NUMERIC(10,7),

      wet_weight NUMERIC(10,2),

      dry_weight NUMERIC(10,2),

      other_weight NUMERIC(10,2),

      cumulative_weight NUMERIC(10,2),

      driver_name VARCHAR(150),

      firmware_version VARCHAR(100),

      unit_number VARCHAR(100),

      collection_type VARCHAR(100),

      remarks TEXT,

      error_code VARCHAR(100),

      citizen_contact VARCHAR(100),

      driver_action VARCHAR(100),

      source_day_table VARCHAR(100),

      archived_at TIMESTAMP
        WITHOUT TIME ZONE
        DEFAULT NOW()

    )
    `
  );


  // ===================================================
  // UNIQUE SOURCE RECORD
  // ===================================================

  const indexName =
    `${tableName}_source_record_unique`;

  validateIdentifier(indexName);

  await citizenHistoricalPrisma.$queryRawUnsafe(
    `
    CREATE UNIQUE INDEX IF NOT EXISTS
      "${indexName}"

    ON "${tableName}"
    (
      source_vehicle_table,
      source_telemetry_id
    )
    `
  );
}


// =====================================================
// ENSURE WARD HISTORICAL TABLES
// =====================================================

async function ensureWardHistoricalTables({
  wardNo,
  month,
  year,
}) {

  const numericWard =
    Number(wardNo);

  const numericMonth =
    Number(month);

  const numericYear =
    Number(year);


  const monthName =
    MONTH_NAMES[
      numericMonth - 1
    ];


  if (!monthName) {
    throw new Error(
      "Invalid month"
    );
  }


  // ---------------------------------------------------
  // TABLE NAMES
  // ---------------------------------------------------

  const yearlyTableName =
    generateYearlyIndexTableName(
      numericWard,
      numericYear
    );


  const monthlyTableName =
    generateMonthlyTableName(
      numericWard,
      numericMonth,
      numericYear
    );


  // ---------------------------------------------------
  // YEAR TABLE
  // ---------------------------------------------------

  const yearlyExists =
    await tableExists(
      yearlyTableName
    );


  if (!yearlyExists) {

    await createYearlyIndexTable(
      yearlyTableName
    );

  }


  // ---------------------------------------------------
  // MONTH TABLE
  // ---------------------------------------------------

  const monthlyExists =
    await tableExists(
      monthlyTableName
    );


  if (!monthlyExists) {

    await createMonthlyHistoryTable(
      monthlyTableName
    );

  }


  // ---------------------------------------------------
  // REGISTER MONTH
  // ---------------------------------------------------

  await registerMonthlyTable(
    yearlyTableName,
    numericMonth,
    monthName,
    monthlyTableName
  );


  return {

    wardNo:
      numericWard,

    year:
      numericYear,

    month:
      numericMonth,

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
// REGISTER MONTH
// =====================================================

async function registerMonthlyTable(
  yearlyTableName,
  month,
  monthName,
  monthlyTableName
) {

  validateIdentifier(
    yearlyTableName
  );

  validateIdentifier(
    monthlyTableName
  );


  await citizenHistoricalPrisma.$queryRawUnsafe(
    `
    INSERT INTO "${yearlyTableName}"
    (
      month_number,
      month_name,
      table_name
    )

    VALUES
    (
      $1,
      $2,
      $3
    )

    ON CONFLICT (
      month_number
    )

    DO UPDATE SET

      month_name =
        EXCLUDED.month_name,

      table_name =
        EXCLUDED.table_name
    `,
    Number(month),
    monthName,
    monthlyTableName
  );
}


// =====================================================
// GET YEAR INDEX
// =====================================================

async function getYearlyIndex(
  wardNo,
  year
) {

  const tableName =
    generateYearlyIndexTableName(
      wardNo,
      year
    );


  const exists =
    await tableExists(
      tableName
    );


  if (!exists) {
    return [];
  }


  return citizenHistoricalPrisma.$queryRawUnsafe(
    `
    SELECT

      month_number,

      month_name,

      table_name,

      created_at

    FROM "${tableName}"

    ORDER BY
      month_number ASC
    `
  );
}


// =====================================================
// GET MONTHLY ROW COUNT
// =====================================================

async function getMonthlyRowCount(
  tableName
) {

  validateIdentifier(
    tableName
  );


  const result =
    await citizenHistoricalPrisma.$queryRawUnsafe(
      `
      SELECT
        COUNT(*)::BIGINT AS count

      FROM "${tableName}"
      `
    );


  return Number(
    result[0]?.count ?? 0
  );
}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  MONTH_NAMES,

  validateIdentifier,

  generateYearlyIndexTableName,

  generateMonthlyTableName,

  tableExists,

  createYearlyIndexTable,

  createMonthlyHistoryTable,

  ensureWardHistoricalTables,

  registerMonthlyTable,

  getYearlyIndex,

  getMonthlyRowCount,

};