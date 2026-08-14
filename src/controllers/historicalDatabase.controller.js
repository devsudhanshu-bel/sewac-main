const telemetryDb =
  require("../config/telemetryDb");

const historicalDb =
  require("../config/citizenHistoricalPrisma");


// ============================================================
// MONTH NAMES
// ============================================================

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


// ============================================================
// HELPERS
// ============================================================

function pad(value) {
  return String(value).padStart(2, "0");
}


// ============================================================
// SQL IDENTIFIER VALIDATION
// ============================================================

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


function quoteIdentifier(value) {
  return `"${validateIdentifier(value)}"`;
}


// ============================================================
// DATE PARSING
// ============================================================
//
// IMPORTANT
//
// Daily table format:
//
// day_DDMMYYYY
//
// Example:
//
// 14 August 2026
//
// day_14082026
//
// ============================================================

function parseRequestDate(dateString) {
  if (
    typeof dateString !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(dateString)
  ) {
    throw new Error(
      "Invalid date format. Use YYYY-MM-DD."
    );
  }

  const [
    year,
    month,
    day,
  ] = dateString
    .split("-")
    .map(Number);

  const date = new Date(
    year,
    month - 1,
    day
  );

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error(
      "Invalid calendar date."
    );
  }

  return date;
}


// ============================================================
// DATE INFORMATION
// ============================================================

function getDateInfo(date) {
  const year =
    date.getFullYear();

  const monthNumber =
    date.getMonth() + 1;

  const month =
    pad(monthNumber);

  const day =
    pad(date.getDate());

  return {
    year,
    monthNumber,
    month,
    day,
  };
}


// ============================================================
// DAILY TABLE NAME
// ============================================================
//
// Example:
//
// 2026-08-14
//
// becomes:
//
// day_14082026
//
// ============================================================

function getDayTableName(date) {
  const {
    year,
    month,
    day,
  } = getDateInfo(date);

  return `day_${day}${month}${year}`;
}


// ============================================================
// HISTORICAL YEAR TABLE
// ============================================================
//
// Example:
//
// ward_174_2026
//
// ============================================================

function getYearTableName(
  wardNo,
  year
) {
  return `ward_${wardNo}_${year}`;
}


// ============================================================
// HISTORICAL MONTH TABLE
// ============================================================
//
// Example:
//
// ward_174_082026
//
// ============================================================

function getMonthTableName(
  wardNo,
  monthNumber,
  year
) {
  return `ward_${wardNo}_${pad(monthNumber)}${year}`;
}


// ============================================================
// CHECK TABLE EXISTS
// ============================================================
//
// prismaClient can be:
//
// telemetryDb
//
// OR
//
// historicalDb
//
// ============================================================

async function tableExists(
  prismaClient,
  tableName
) {
  validateIdentifier(tableName);

  const result =
    await prismaClient.$queryRawUnsafe(
      `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = $1
      ) AS exists;
      `,
      tableName
    );

  return result[0]?.exists === true;
}


// ============================================================
// GET TABLE COLUMNS
// ============================================================

async function getTableColumns(
  prismaClient,
  tableName
) {
  validateIdentifier(tableName);

  return prismaClient.$queryRawUnsafe(
    `
    SELECT
      column_name,
      data_type,
      udt_name,
      is_nullable,
      ordinal_position
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = $1
    ORDER BY ordinal_position ASC;
    `,
    tableName
  );
}


// ============================================================
// GET DAILY TABLE
// ============================================================
//
// THIS ALWAYS READS FROM:
//
// master_telemetry_db
//
// through:
//
// telemetryDb
//
// ============================================================

async function getDailyTable(date) {
  const dayTableName =
    getDayTableName(date);

  const exists =
    await tableExists(
      telemetryDb,
      dayTableName
    );

  return {
    dayTableName,
    exists,
  };
}


// ============================================================
// GET VEHICLES FROM DAILY TABLE
// ============================================================
//
// IMPORTANT:
//
// ward_no comes DIRECTLY from:
//
// day_14082026
//
// No ward lookup.
// No GPS calculation.
// No external ward table.
//
// ============================================================

async function getVehiclesFromDailyTable(
  dayTableName
) {
  const columns =
    await getTableColumns(
      telemetryDb,
      dayTableName
    );

  const columnNames =
    columns.map(
      (column) =>
        column.column_name
    );


  // ----------------------------------------------------------
  // Required columns
  // ----------------------------------------------------------

  const requiredColumns = [
    "vehicle_number",
    "vehicle_table_name",
    "ward_no",
  ];


  const missingColumns =
    requiredColumns.filter(
      (column) =>
        !columnNames.includes(column)
    );


  if (
    missingColumns.length > 0
  ) {
    throw new Error(
      `Daily table '${dayTableName}' is missing required columns: ${missingColumns.join(", ")}`
    );
  }


  return telemetryDb.$queryRawUnsafe(
    `
    SELECT
      vehicle_number,
      vehicle_table_name,
      ward_no
    FROM ${quoteIdentifier(dayTableName)}
    ORDER BY vehicle_number ASC;
    `
  );
}


// ============================================================
// GET VEHICLE TELEMETRY
// ============================================================
//
// READS FROM MASTER TELEMETRY DB.
//
// ============================================================

async function getVehicleTelemetry(
  vehicleTableName
) {
  validateIdentifier(
    vehicleTableName
  );


  const exists =
    await tableExists(
      telemetryDb,
      vehicleTableName
    );


  if (!exists) {
    return {
      exists: false,
      records: [],
    };
  }


  const records =
    await telemetryDb.$queryRawUnsafe(
      `
      SELECT *
      FROM ${quoteIdentifier(vehicleTableName)}
      ORDER BY id ASC;
      `
    );


  return {
    exists: true,
    records,
  };
}


// ============================================================
// CREATE YEAR INDEX TABLE
// ============================================================
//
// HISTORICAL DATABASE
//
// Example:
//
// ward_174_2026
//
// ============================================================

async function createYearTable(
  tableName
) {
  await historicalDb.$executeRawUnsafe(
    `
    CREATE TABLE IF NOT EXISTS
    ${quoteIdentifier(tableName)}
    (
      month_number INTEGER PRIMARY KEY,

      month_name VARCHAR(20) NOT NULL,

      month_table_name VARCHAR(150) NOT NULL,

      created_at
        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `
  );
}


// ============================================================
// CREATE MONTH HISTORICAL TABLE
// ============================================================
//
// HISTORICAL DATABASE
//
// Example:
//
// ward_174_082026
//
// ============================================================

async function createMonthTable(
  tableName
) {
  await historicalDb.$executeRawUnsafe(
    `
    CREATE TABLE IF NOT EXISTS
    ${quoteIdentifier(tableName)}
    (
      historical_id BIGSERIAL PRIMARY KEY,

      source_telemetry_id BIGINT NOT NULL,

      source_vehicle_table
        VARCHAR(150) NOT NULL,

      vehicle_number
        VARCHAR(100),

      ward_no
        INTEGER NOT NULL,

      iot_timestamp
        TIMESTAMP,

      received_timestamp
        TIMESTAMP,

      rfid_epc
        VARCHAR(255),

      citizen_id
        INTEGER,

      waste_type
        VARCHAR(100),

      latitude
        DECIMAL(10,7),

      longitude
        DECIMAL(10,7),

      wet_weight
        DECIMAL(10,2),

      dry_weight
        DECIMAL(10,2),

      other_weight
        DECIMAL(10,2),

      cumulative_weight
        DECIMAL(10,2),

      driver_name
        VARCHAR(150),

      firmware_version
        VARCHAR(100),

      unit_number
        VARCHAR(100),

      collection_type
        VARCHAR(100),

      remarks
        TEXT,

      error_code
        VARCHAR(100),

      citizen_contact
        VARCHAR(100),

      driver_action
        VARCHAR(100),

      source_day_table
        VARCHAR(100),

      archived_at
        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      UNIQUE (
        source_vehicle_table,
        source_telemetry_id
      )
    );
    `
  );
}


// ============================================================
// REGISTER MONTH
// ============================================================
//
// Example:
//
// ward_174_2026
//
// 8 | August | ward_174_082026
//
// ============================================================

async function registerMonth(
  yearTableName,
  monthNumber,
  monthName,
  monthTableName
) {
  await historicalDb.$executeRawUnsafe(
    `
    INSERT INTO
    ${quoteIdentifier(yearTableName)}
    (
      month_number,
      month_name,
      month_table_name
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

      month_table_name =
        EXCLUDED.month_table_name;
    `,
    monthNumber,
    monthName,
    monthTableName
  );
}


// ============================================================
// FIELD HELPER
// ============================================================
//
// Supports both:
//
// camelCase
//
// and:
//
// snake_case
//
// ============================================================

function getField(
  record,
  ...names
) {
  for (
    const name of names
  ) {
    if (
      record[name] !== undefined
    ) {
      return record[name];
    }
  }

  return null;
}


// ============================================================
// INSERT HISTORICAL RECORD
// ============================================================

async function insertHistoricalRecord(
  historicalTableName,
  record
) {
  const sourceTelemetryId =
    getField(
      record,
      "id"
    );


  if (
    sourceTelemetryId === null ||
    sourceTelemetryId === undefined
  ) {
    throw new Error(
      `Telemetry record does not contain an id. Vehicle table: ${record.sourceVehicleTable}`
    );
  }


  const result =
    await historicalDb.$queryRawUnsafe(
      `
      INSERT INTO
      ${quoteIdentifier(historicalTableName)}
      (
        source_telemetry_id,

        source_vehicle_table,

        vehicle_number,

        ward_no,

        iot_timestamp,

        received_timestamp,

        rfid_epc,

        citizen_id,

        waste_type,

        latitude,

        longitude,

        wet_weight,

        dry_weight,

        other_weight,

        cumulative_weight,

        driver_name,

        firmware_version,

        unit_number,

        collection_type,

        remarks,

        error_code,

        citizen_contact,

        driver_action,

        source_day_table
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14,
        $15,
        $16,
        $17,
        $18,
        $19,
        $20,
        $21,
        $22,
        $23,
        $24
      )
      ON CONFLICT
      (
        source_vehicle_table,
        source_telemetry_id
      )
      DO NOTHING
      RETURNING historical_id;
      `,

      Number(sourceTelemetryId),

      record.sourceVehicleTable,

      record.vehicleNumber,

      record.wardNo,

      record.iotTimestamp,

      record.receivedTimestamp,

      record.rfidEpc,

      record.citizenId,

      record.wasteType,

      record.latitude,

      record.longitude,

      record.wetWeight,

      record.dryWeight,

      record.otherWeight,

      record.cumulativeWeight,

      record.driverName,

      record.firmwareVersion,

      record.unitNumber,

      record.collectionType,

      record.remarks,

      record.errorCode,

      record.citizenContact,

      record.driverAction,

      record.sourceDayTable
    );


  return {
    inserted:
      result.length > 0,

    historicalId:
      result[0]?.historical_id ??
      null,
  };
}


// ============================================================
// PROCESS ARCHIVE DATE
// ============================================================
//
// MAIN BUSINESS LOGIC
//
// Example:
//
// 2026-08-14
//
// ↓
//
// master_telemetry_db
//
// day_14082026
//
// ↓
//
// ward_no
//
// ↓
//
// vehicle_table_name
//
// ↓
//
// vehicle telemetry
//
// ↓
//
// historical DB
//
// ward_174_082026
//
// ============================================================

async function processArchiveDate(
  processingDate
) {
  const {
    year,
    monthNumber,
  } =
    getDateInfo(
      processingDate
    );


  const monthName =
    MONTH_NAMES[
      monthNumber - 1
    ];


  // ========================================================
  // FIND DAILY TABLE
  // ========================================================

  const {
    dayTableName,
    exists: dayTableExists,
  } =
    await getDailyTable(
      processingDate
    );


  if (
    !dayTableExists
  ) {
    return {
      success: false,

      reason:
        "DAY_TABLE_NOT_FOUND",

      sourceDatabase:
        "master_telemetry_db",

      dayTable:
        dayTableName,
    };
  }


  // ========================================================
  // GET DAILY VEHICLES
  // ========================================================

  const vehicles =
    await getVehiclesFromDailyTable(
      dayTableName
    );


  if (
    vehicles.length === 0
  ) {
    return {
      success: true,

      reason:
        "NO_VEHICLES",

      sourceDatabase:
        "master_telemetry_db",

      sourceDayTable:
        dayTableName,

      archivedVehicles:
        0,

      archivedRecords:
        0,

      vehicles: [],
    };
  }


  // ========================================================
  // COUNTERS
  // ========================================================

  let archivedVehicles = 0;

  let archivedRecords = 0;

  let duplicateRecords = 0;

  const vehicleResults = [];


  // ========================================================
  // PROCESS EACH VEHICLE
  // ========================================================

  for (
    const vehicle
    of vehicles
  ) {

    const vehicleNumber =
      vehicle.vehicle_number;

    const vehicleTableName =
      vehicle.vehicle_table_name;


    // ======================================================
    // WARD COMES DIRECTLY FROM DAILY TABLE
    // ======================================================

    const wardNo =
      Number(
        vehicle.ward_no
      );


    // ======================================================
    // VALIDATE VEHICLE TABLE
    // ======================================================

    if (
      !vehicleTableName
    ) {
      vehicleResults.push({
        vehicleNumber,

        wardNo,

        archived: false,

        reason:
          "MISSING_VEHICLE_TABLE_NAME",
      });

      continue;
    }


    // ======================================================
    // VALIDATE WARD
    // ======================================================

    if (
      !Number.isInteger(wardNo)
    ) {
      vehicleResults.push({
        vehicleNumber,

        vehicleTableName,

        wardNo:
          vehicle.ward_no,

        archived: false,

        reason:
          "INVALID_WARD_NO",
      });

      continue;
    }


    // ======================================================
    // HISTORICAL TABLE NAMES
    // ======================================================

    const yearTableName =
      getYearTableName(
        wardNo,
        year
      );


    const monthTableName =
      getMonthTableName(
        wardNo,
        monthNumber,
        year
      );


    // ======================================================
    // CREATE YEAR TABLE
    // ======================================================

    const yearExists =
      await tableExists(
        historicalDb,
        yearTableName
      );


    if (
      !yearExists
    ) {
      await createYearTable(
        yearTableName
      );
    }


    // ======================================================
    // CREATE MONTH TABLE
    // ======================================================

    const monthExists =
      await tableExists(
        historicalDb,
        monthTableName
      );


    if (
      !monthExists
    ) {
      await createMonthTable(
        monthTableName
      );
    }


    // ======================================================
    // REGISTER MONTH
    // ======================================================

    await registerMonth(
      yearTableName,
      monthNumber,
      monthName,
      monthTableName
    );


    // ======================================================
    // READ VEHICLE TELEMETRY
    // ======================================================
    //
    // MASTER TELEMETRY DB
    //
    // ======================================================

    const telemetry =
      await getVehicleTelemetry(
        vehicleTableName
      );


    if (
      !telemetry.exists
    ) {
      vehicleResults.push({
        vehicleNumber,

        vehicleTableName,

        wardNo,

        archived: false,

        reason:
          "VEHICLE_TABLE_NOT_FOUND",
      });

      continue;
    }


    // ======================================================
    // INSERT TELEMETRY RECORDS
    // ======================================================

    let inserted = 0;

    let duplicates = 0;


    for (
      const record
      of telemetry.records
    ) {

      const normalizedRecord = {

        sourceVehicleTable:
          vehicleTableName,

        vehicleNumber:
          getField(
            record,
            "vehicleNumber",
            "vehicle_number"
          ) ??
          vehicleNumber,

        wardNo,

        iotTimestamp:
          getField(
            record,
            "iotTimestamp",
            "iot_timestamp"
          ),

        receivedTimestamp:
          getField(
            record,
            "receivedTimestamp",
            "received_timestamp"
          ),

        rfidEpc:
          getField(
            record,
            "rfidEpc",
            "rfid_epc"
          ),

        citizenId:
          getField(
            record,
            "citizenId",
            "citizen_id"
          ),

        wasteType:
          getField(
            record,
            "wasteType",
            "waste_type"
          ),

        latitude:
          getField(
            record,
            "latitude"
          ),

        longitude:
          getField(
            record,
            "longitude"
          ),

        wetWeight:
          getField(
            record,
            "wetWeight",
            "wet_weight"
          ),

        dryWeight:
          getField(
            record,
            "dryWeight",
            "dry_weight"
          ),

        otherWeight:
          getField(
            record,
            "otherWeight",
            "other_weight"
          ),

        cumulativeWeight:
          getField(
            record,
            "cumulativeWeight",
            "cumulative_weight"
          ),

        driverName:
          getField(
            record,
            "driverName",
            "driver_name"
          ),

        firmwareVersion:
          getField(
            record,
            "firmwareVersion",
            "firmware_version"
          ),

        unitNumber:
          getField(
            record,
            "unitNumber",
            "unit_number"
          ),

        collectionType:
          getField(
            record,
            "collectionType",
            "collection_type"
          ),

        remarks:
          getField(
            record,
            "remarks"
          ),

        errorCode:
          getField(
            record,
            "errorCode",
            "error_code"
          ),

        citizenContact:
          getField(
            record,
            "citizenContact",
            "citizen_contact"
          ),

        driverAction:
          getField(
            record,
            "driverAction",
            "driver_action"
          ),

        sourceDayTable:
          dayTableName,
      };


      const result =
        await insertHistoricalRecord(
          monthTableName,
          {
            ...record,
            ...normalizedRecord,
          }
        );


      if (
        result.inserted
      ) {
        inserted++;
      } else {
        duplicates++;
      }
    }


    // ======================================================
    // UPDATE TOTALS
    // ======================================================

    archivedVehicles++;

    archivedRecords +=
      inserted;

    duplicateRecords +=
      duplicates;


    // ======================================================
    // VEHICLE RESULT
    // ======================================================

    vehicleResults.push({

      vehicleNumber,

      vehicleTableName,

      wardNo,

      sourceDatabase:
        "master_telemetry_db",

      sourceDayTable:
        dayTableName,

      historicalYearTable:
        yearTableName,

      historicalMonthTable:
        monthTableName,

      sourceRecords:
        telemetry.records.length,

      inserted,

      duplicates,

      archived:
        true,
    });
  }


  // ========================================================
  // FINAL RESULT
  // ========================================================

  return {

    success: true,

    sourceDatabase:
      "master_telemetry_db",

    sourceDayTable:
      dayTableName,

    year,

    month:
      monthNumber,

    monthName,

    archivedVehicles,

    archivedRecords,

    duplicateRecords,

    vehicles:
      vehicleResults,
  };
}


// ============================================================
// ARCHIVE TODAY
// ============================================================
//
// POST
//
// /api/historical-database/archive-today
//
// ============================================================

async function archiveToday(
  req,
  res
) {
  try {

    const today =
      new Date();


    const result =
      await processArchiveDate(
        today
      );


    if (
      result.reason ===
      "DAY_TABLE_NOT_FOUND"
    ) {
      return res
        .status(404)
        .json({

          success: false,

          message:
            `Daily table '${result.dayTable}' does not exist in master_telemetry_db.`,

          ...result,
        });
    }


    return res
      .status(200)
      .json({

        success: true,

        message:
          "Today's telemetry archived successfully.",

        data:
          result,
      });

  } catch (error) {

    console.error(
      "❌ archiveToday error:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Failed to archive today's telemetry.",

        error:
          error.message,
      });
  }
}


// ============================================================
// ARCHIVE SPECIFIC DATE
// ============================================================
//
// POST
//
// /api/historical-database/archive
//
// BODY:
//
// {
//   "date": "2026-08-14"
// }
//
// ============================================================

async function archiveSpecificDate(
  req,
  res
) {
  try {

    const {
      date,
    } =
      req.body || {};


    if (!date) {
      return res
        .status(400)
        .json({

          success: false,

          message:
            "date is required.",
        });
    }


    const requestedDate =
      parseRequestDate(
        date
      );


    const result =
      await processArchiveDate(
        requestedDate
      );


    if (
      result.reason ===
      "DAY_TABLE_NOT_FOUND"
    ) {
      return res
        .status(404)
        .json({

          success: false,

          message:
            `Daily table '${result.dayTable}' does not exist in master_telemetry_db.`,

          ...result,
        });
    }


    return res
      .status(200)
      .json({

        success: true,

        message:
          `Historical telemetry for ${date} archived successfully.`,

        data:
          result,
      });

  } catch (error) {

    console.error(
      "❌ archiveSpecificDate error:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Failed to archive historical telemetry.",

        error:
          error.message,
      });
  }
}


// ============================================================
// TEST DATABASE CONNECTIONS
// ============================================================
//
// GET
//
// /api/historical-database/test-connections
//
// ============================================================

async function testConnections(
  req,
  res
) {
  try {

    // ========================================================
    // TELEMETRY DATABASE
    // ========================================================

    const telemetryResult =
      await telemetryDb.$queryRawUnsafe(
        `
        SELECT
          current_database() AS database,
          current_schema() AS schema;
        `
      );


    // ========================================================
    // HISTORICAL DATABASE
    // ========================================================

    const historicalResult =
      await historicalDb.$queryRawUnsafe(
        `
        SELECT
          current_database() AS database,
          current_schema() AS schema;
        `
      );


    // ========================================================
    // TODAY'S DAILY TABLE
    // ========================================================

    const today =
      new Date();


    const todayTable =
      getDayTableName(
        today
      );


    const todayExists =
      await tableExists(
        telemetryDb,
        todayTable
      );


    return res
      .status(200)
      .json({

        success: true,

        telemetryDatabase: {

          database:
            telemetryResult[0]?.database,

          schema:
            telemetryResult[0]?.schema,

          expectedDatabase:
            "master_telemetry_db",

          todayTable,

          todayTableExists:
            todayExists,
        },

        historicalDatabase: {

          database:
            historicalResult[0]?.database,

          schema:
            historicalResult[0]?.schema,
        },
      });

  } catch (error) {

    console.error(
      "❌ testConnections error:",
      error
    );


    return res
      .status(500)
      .json({

        success: false,

        message:
          "Database connection test failed.",

        error:
          error.message,
      });
  }
}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

  archiveToday,

  archiveDate:
    archiveSpecificDate,

  testConnections,

};