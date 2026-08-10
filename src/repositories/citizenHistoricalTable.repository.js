const citizenHistoricalPrisma = require(
  "../config/citizenHistoricalPrisma"
);


// =====================================================
// CONFIGURATION
// =====================================================

// PostgreSQL has a limit on the number of parameters
// allowed in a single query.
//
// Our historical record currently contains 27 values.
//
// 500 records × 27 parameters = 13,500 parameters.
//
// This is safely below PostgreSQL's parameter limit.
//
// =====================================================

const BULK_INSERT_BATCH_SIZE = 500;


// =====================================================
// TABLE NAME VALIDATION
// =====================================================

function validateIdentifier(value) {
  if (
    typeof value !== "string" ||
    !/^[a-z][a-z0-9_]*$/.test(value)
  ) {
    throw new Error(
      `Invalid SQL identifier: ${value}`
    );
  }

  return value;
}


// =====================================================
// GENERATE MONTHLY TABLE NAME
// =====================================================
//
// Example:
//
// Ward 174
// August 2026
//
// → ward_174_082026
//
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
    throw new Error(
      "Invalid ward number"
    );
  }

  if (
    !Number.isInteger(numericMonth) ||
    numericMonth < 1 ||
    numericMonth > 12
  ) {
    throw new Error(
      "Invalid month"
    );
  }

  if (
    !Number.isInteger(numericYear) ||
    numericYear < 2000 ||
    numericYear > 9999
  ) {
    throw new Error(
      "Invalid year"
    );
  }

  const monthString =
    String(numericMonth).padStart(2, "0");

  return `ward_${numericWard}_${monthString}${numericYear}`;
}


// =====================================================
// GENERATE YEARLY INDEX TABLE NAME
// =====================================================
//
// Example:
//
// Ward 174
// Year 2026
//
// → ward_174_2026
//
// IMPORTANT:
//
// This table contains ONLY indexing information.
// It does NOT contain telemetry records.
//
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
    throw new Error(
      "Invalid ward number"
    );
  }

  if (
    !Number.isInteger(numericYear) ||
    numericYear < 2000 ||
    numericYear > 9999
  ) {
    throw new Error(
      "Invalid year"
    );
  }

  return `ward_${numericWard}_${numericYear}`;
}


// =====================================================
// TABLE EXISTENCE
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
// CREATE YEARLY INDEX TABLE
// =====================================================
//
// Example:
//
// ward_174_2026
//
// Stores:
//
// month_number
// month_name
// table_name
// record_count
// first_record_at
// last_record_at
//
// NO historical telemetry is stored here.
//
// =====================================================

async function createYearlyIndexTable(
  tableName
) {
  validateIdentifier(tableName);

  await citizenHistoricalPrisma.$executeRawUnsafe(
    `
    CREATE TABLE IF NOT EXISTS "${tableName}" (

      id SERIAL PRIMARY KEY,

      month_number INTEGER NOT NULL,

      month_name VARCHAR(20) NOT NULL,

      table_name VARCHAR(150) NOT NULL,

      record_count BIGINT NOT NULL DEFAULT 0,

      first_record_at TIMESTAMP(6),

      last_record_at TIMESTAMP(6),

      created_at TIMESTAMP(6)
        DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP(6)
        DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT "${tableName}_month_unique"
        UNIQUE (month_number),

      CONSTRAINT "${tableName}_table_unique"
        UNIQUE (table_name)

    )
    `
  );

  return tableName;
}


// =====================================================
// CREATE MONTHLY HISTORY TABLE
// =====================================================
//
// Example:
//
// ward_174_082026
//
// This table contains the ACTUAL historical records.
//
// Existing telemetry files are NOT modified.
//
// =====================================================

async function createMonthlyHistoryTable(
  tableName
) {
  validateIdentifier(tableName);

  await citizenHistoricalPrisma.$executeRawUnsafe(
    `
    CREATE TABLE IF NOT EXISTS "${tableName}" (

      telemetry_id BIGINT PRIMARY KEY,

      iot_timestamp TIMESTAMP(6),

      received_timestamp TIMESTAMP(6),

      created_at TIMESTAMP(6)
        DEFAULT CURRENT_TIMESTAMP,

      -- -----------------------------------------------
      -- VEHICLE
      -- -----------------------------------------------

      vehicle_number VARCHAR(100),

      driver_name VARCHAR(150),

      unit_number VARCHAR(100),

      firmware_version VARCHAR(100),

      -- -----------------------------------------------
      -- GPS
      -- -----------------------------------------------

      latitude NUMERIC(10,7),

      longitude NUMERIC(10,7),

      -- -----------------------------------------------
      -- MASTER CITIZEN HIERARCHY
      -- -----------------------------------------------

      city_id INTEGER,

      zone_id INTEGER,

      division_id INTEGER,

      ward_id INTEGER,

      ward_no INTEGER,

      -- -----------------------------------------------
      -- CITIZEN
      -- -----------------------------------------------

      citizen_id INTEGER,

      rfid_epc VARCHAR(150),

      citizen_contact VARCHAR(50),

      -- -----------------------------------------------
      -- COLLECTION
      -- -----------------------------------------------

      waste_type VARCHAR(50),

      collection_type VARCHAR(100),

      wet_weight NUMERIC(10,2),

      dry_weight NUMERIC(10,2),

      other_weight NUMERIC(10,2),

      cumulative_weight NUMERIC(10,2),

      -- -----------------------------------------------
      -- ADDITIONAL TELEMETRY INFORMATION
      -- -----------------------------------------------

      remarks TEXT,

      error_code VARCHAR(100),

      driver_action TEXT

    )
    `
  );


  // ===================================================
  // INDEXES
  // ===================================================

  await citizenHistoricalPrisma.$executeRawUnsafe(
    `
    CREATE INDEX IF NOT EXISTS
    "${tableName}_vehicle_idx"
    ON "${tableName}" (vehicle_number)
    `
  );


  await citizenHistoricalPrisma.$executeRawUnsafe(
    `
    CREATE INDEX IF NOT EXISTS
    "${tableName}_citizen_idx"
    ON "${tableName}" (citizen_id)
    `
  );


  await citizenHistoricalPrisma.$executeRawUnsafe(
    `
    CREATE INDEX IF NOT EXISTS
    "${tableName}_rfid_idx"
    ON "${tableName}" (rfid_epc)
    `
  );


  await citizenHistoricalPrisma.$executeRawUnsafe(
    `
    CREATE INDEX IF NOT EXISTS
    "${tableName}_timestamp_idx"
    ON "${tableName}" (iot_timestamp)
    `
  );


  await citizenHistoricalPrisma.$executeRawUnsafe(
    `
    CREATE INDEX IF NOT EXISTS
    "${tableName}_ward_idx"
    ON "${tableName}" (ward_no)
    `
  );


  return tableName;
}


// =====================================================
// REGISTER MONTH IN YEARLY INDEX
// =====================================================
//
// Example:
//
// ward_174_2026
//
// month_number = 8
// table_name   = ward_174_082026
//
// =====================================================

async function registerMonthlyTable(
  yearlyTableName,
  monthNumber,
  monthName,
  monthlyTableName
) {
  validateIdentifier(yearlyTableName);
  validateIdentifier(monthlyTableName);

  await citizenHistoricalPrisma.$executeRawUnsafe(
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
    ON CONFLICT (month_number)
    DO UPDATE SET

      month_name =
        EXCLUDED.month_name,

      table_name =
        EXCLUDED.table_name,

      updated_at =
        CURRENT_TIMESTAMP
    `,
    monthNumber,
    monthName,
    monthlyTableName
  );
}


// =====================================================
// UPDATE YEARLY INDEX STATISTICS
// =====================================================
//
// The yearly table is an INDEX ONLY.
//
// These statistics allow the dashboard to quickly know
// how much data exists in a monthly table without
// scanning the entire historical table.
//
// =====================================================

async function updateYearlyIndexStats(
  yearlyTableName,
  monthlyTableName,
  recordCount,
  firstRecordAt,
  lastRecordAt
) {
  validateIdentifier(yearlyTableName);
  validateIdentifier(monthlyTableName);

  await citizenHistoricalPrisma.$executeRawUnsafe(
    `
    UPDATE "${yearlyTableName}"
    SET

      record_count = $1,

      first_record_at = $2,

      last_record_at = $3,

      updated_at =
        CURRENT_TIMESTAMP

    WHERE table_name = $4
    `,
    recordCount,
    firstRecordAt,
    lastRecordAt,
    monthlyTableName
  );
}


// =====================================================
// GET YEARLY INDEX
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

  validateIdentifier(
    tableName
  );

  return citizenHistoricalPrisma.$queryRawUnsafe(
    `
    SELECT

      id,

      month_number,

      month_name,

      table_name,

      record_count,

      first_record_at,

      last_record_at,

      created_at,

      updated_at

    FROM "${tableName}"

    ORDER BY
      month_number ASC
    `
  );
}


// =====================================================
// BULK INSERT HISTORICAL RECORDS
// =====================================================
//
// Inserts already-resolved historical records into
// the dynamic monthly Ward table.
//
// IMPORTANT:
//
// This function DOES NOT:
//
// - read telemetry
// - determine GPS Ward
// - query the Master Citizen DB
// - query the Helper DB
// - modify the telemetry database
// - modify existing telemetry files
//
// It ONLY stores records that have already been
// processed and assigned to a Ward.
//
// =====================================================

async function bulkInsertHistoricalRecords(
  tableName,
  records
) {
  validateIdentifier(
    tableName
  );


  if (!Array.isArray(records)) {
    throw new Error(
      "Historical records must be an array"
    );
  }


  if (records.length === 0) {
    return {
      insertedOrUpdated: 0,
      batches: 0,
    };
  }


  // ===================================================
  // TOTAL COUNTERS
  // ===================================================

  let insertedOrUpdated = 0;

  let batches = 0;


  // ===================================================
  // PROCESS SMALL DATABASE BATCHES
  // ===================================================
  //
  // We intentionally don't send thousands of records
  // in one SQL statement.
  //
  // ===================================================

  for (
    let start = 0;
    start < records.length;
    start += BULK_INSERT_BATCH_SIZE
  ) {

    const batch =
      records.slice(
        start,
        start + BULK_INSERT_BATCH_SIZE
      );


    batches++;


    // =================================================
    // BUILD PLACEHOLDERS
    // =================================================

    const placeholders = [];

    const values = [];

    let parameterIndex = 1;


    for (
      const record of batch
    ) {

      // -----------------------------------------------
      // TELEMETRY ID IS REQUIRED
      // -----------------------------------------------

      if (
        record.telemetryId === null ||
        record.telemetryId === undefined
      ) {
        throw new Error(
          "Historical record is missing telemetryId"
        );
      }


      // -----------------------------------------------
      // 27 VALUES
      // -----------------------------------------------

      placeholders.push(
        `(
          $${parameterIndex},
          $${parameterIndex + 1},
          $${parameterIndex + 2},
          $${parameterIndex + 3},
          $${parameterIndex + 4},
          $${parameterIndex + 5},
          $${parameterIndex + 6},
          $${parameterIndex + 7},
          $${parameterIndex + 8},
          $${parameterIndex + 9},
          $${parameterIndex + 10},
          $${parameterIndex + 11},
          $${parameterIndex + 12},
          $${parameterIndex + 13},
          $${parameterIndex + 14},
          $${parameterIndex + 15},
          $${parameterIndex + 16},
          $${parameterIndex + 17},
          $${parameterIndex + 18},
          $${parameterIndex + 19},
          $${parameterIndex + 20},
          $${parameterIndex + 21},
          $${parameterIndex + 22},
          $${parameterIndex + 23},
          $${parameterIndex + 24},
          $${parameterIndex + 25},
          $${parameterIndex + 26}
        )`
      );


      // -----------------------------------------------
      // VALUES
      // -----------------------------------------------

      values.push(

        // ---------------------------------------------
        // IDENTITY
        // ---------------------------------------------

        record.telemetryId,

        record.iotTimestamp ??
          null,

        record.receivedTimestamp ??
          null,

        record.createdAt ??
          null,


        // ---------------------------------------------
        // VEHICLE
        // ---------------------------------------------

        record.vehicleNumber ??
          null,

        record.driverName ??
          null,

        record.unitNumber ??
          null,

        record.firmwareVersion ??
          null,


        // ---------------------------------------------
        // GPS
        // ---------------------------------------------

        record.latitude ??
          null,

        record.longitude ??
          null,


        // ---------------------------------------------
        // HIERARCHY
        // ---------------------------------------------

        record.cityId ??
          null,

        record.zoneId ??
          null,

        record.divisionId ??
          null,

        record.wardId ??
          null,

        record.wardNo ??
          null,


        // ---------------------------------------------
        // CITIZEN
        // ---------------------------------------------

        record.citizenId ??
          null,

        record.rfidEpc ??
          null,

        record.citizenContact ??
          null,


        // ---------------------------------------------
        // COLLECTION
        // ---------------------------------------------

        record.wasteType ??
          null,

        record.collectionType ??
          null,

        record.wetWeight ??
          null,

        record.dryWeight ??
          null,

        record.otherWeight ??
          null,

        record.cumulativeWeight ??
          null,


        // ---------------------------------------------
        // ADDITIONAL
        // ---------------------------------------------

        record.remarks ??
          null,

        record.errorCode ??
          null,

        record.driverAction ??
          null
      );


      parameterIndex += 27;
    }


    // =================================================
    // EXECUTE BULK UPSERT
    // =================================================

    const query = `
      INSERT INTO "${tableName}"
      (
        telemetry_id,

        iot_timestamp,
        received_timestamp,
        created_at,

        vehicle_number,
        driver_name,
        unit_number,
        firmware_version,

        latitude,
        longitude,

        city_id,
        zone_id,
        division_id,
        ward_id,
        ward_no,

        citizen_id,
        rfid_epc,
        citizen_contact,

        waste_type,
        collection_type,

        wet_weight,
        dry_weight,
        other_weight,
        cumulative_weight,

        remarks,
        error_code,
        driver_action
      )

      VALUES

      ${placeholders.join(",")}

      ON CONFLICT (
        telemetry_id
      )

      DO UPDATE SET

        iot_timestamp =
          EXCLUDED.iot_timestamp,

        received_timestamp =
          EXCLUDED.received_timestamp,

        vehicle_number =
          EXCLUDED.vehicle_number,

        driver_name =
          EXCLUDED.driver_name,

        unit_number =
          EXCLUDED.unit_number,

        firmware_version =
          EXCLUDED.firmware_version,

        latitude =
          EXCLUDED.latitude,

        longitude =
          EXCLUDED.longitude,

        city_id =
          EXCLUDED.city_id,

        zone_id =
          EXCLUDED.zone_id,

        division_id =
          EXCLUDED.division_id,

        ward_id =
          EXCLUDED.ward_id,

        ward_no =
          EXCLUDED.ward_no,

        citizen_id =
          EXCLUDED.citizen_id,

        rfid_epc =
          EXCLUDED.rfid_epc,

        citizen_contact =
          EXCLUDED.citizen_contact,

        waste_type =
          EXCLUDED.waste_type,

        collection_type =
          EXCLUDED.collection_type,

        wet_weight =
          EXCLUDED.wet_weight,

        dry_weight =
          EXCLUDED.dry_weight,

        other_weight =
          EXCLUDED.other_weight,

        cumulative_weight =
          EXCLUDED.cumulative_weight,

        remarks =
          EXCLUDED.remarks,

        error_code =
          EXCLUDED.error_code,

        driver_action =
          EXCLUDED.driver_action
    `;


    await citizenHistoricalPrisma.$executeRawUnsafe(
      query,
      ...values
    );


    insertedOrUpdated +=
      batch.length;
  }


  // ===================================================
  // RESULT
  // ===================================================

  return {
    insertedOrUpdated,
    batches,
  };
}


// =====================================================
// GET MONTHLY RECORD COUNT
// =====================================================
//
// Used to update the yearly index.
//
// =====================================================

async function getMonthlyRecordCount(
  tableName
) {
  validateIdentifier(
    tableName
  );

  const result =
    await citizenHistoricalPrisma.$queryRawUnsafe(
      `
      SELECT COUNT(*)::BIGINT AS count
      FROM "${tableName}"
      `
    );

  return Number(
    result[0]?.count ?? 0
  );
}


// =====================================================
// GET MONTHLY RECORD RANGE
// =====================================================
//
// Returns the first and last telemetry timestamps.
//
// =====================================================

async function getMonthlyRecordRange(
  tableName
) {
  validateIdentifier(
    tableName
  );

  const result =
    await citizenHistoricalPrisma.$queryRawUnsafe(
      `
      SELECT

        MIN(iot_timestamp)
          AS first_record_at,

        MAX(iot_timestamp)
          AS last_record_at

      FROM "${tableName}"
      `
    );

  return {
    firstRecordAt:
      result[0]?.first_record_at ??
      null,

    lastRecordAt:
      result[0]?.last_record_at ??
      null,
  };
}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  // -----------------------------------------------
  // Validation
  // -----------------------------------------------

  validateIdentifier,


  // -----------------------------------------------
  // Table name generation
  // -----------------------------------------------

  generateMonthlyTableName,

  generateYearlyIndexTableName,


  // -----------------------------------------------
  // Table management
  // -----------------------------------------------

  tableExists,

  createYearlyIndexTable,

  createMonthlyHistoryTable,


  // -----------------------------------------------
  // Yearly index
  // -----------------------------------------------

  registerMonthlyTable,

  updateYearlyIndexStats,

  getYearlyIndex,


  // -----------------------------------------------
  // Historical data
  // -----------------------------------------------

  bulkInsertHistoricalRecords,

  getMonthlyRecordCount,

  getMonthlyRecordRange,
};