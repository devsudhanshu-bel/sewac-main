const telemetryDb = require("../config/telemetryDb");

const historicalDb = require("../config/citizenHistoricalPrisma");

const historicalTableRepository = require(
  "../repositories/citizenHistoricalTable.repository"
);


// ============================================================
// CONFIG
// ============================================================

const BATCH_SIZE = 500;


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
// SQL IDENTIFIER VALIDATION
// ============================================================

function validateIdentifier(value) {
  if (
    typeof value !== "string" ||
    !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)
  ) {
    throw new Error(`Invalid SQL identifier: ${value}`);
  }

  return value;
}


// ============================================================
// QUOTE SQL IDENTIFIER
// ============================================================

function quoteIdentifier(value) {
  validateIdentifier(value);

  return `"${value}"`;
}


// ============================================================
// NORMALIZE DATE
// ============================================================

function normalizeDate(input) {
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) {
      throw new Error("Invalid date");
    }

    return new Date(
      input.getFullYear(),
      input.getMonth(),
      input.getDate()
    );
  }

  if (typeof input === "string") {
    const value = input.trim();

    // YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value
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
        throw new Error(`Invalid date: ${value}`);
      }

      return date;
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new Error(`Invalid date: ${value}`);
    }

    return new Date(
      parsed.getFullYear(),
      parsed.getMonth(),
      parsed.getDate()
    );
  }

  throw new Error(`Invalid date: ${input}`);
}


// ============================================================
// DATE INFORMATION
// ============================================================

function getDateInformation(input) {
  const date = normalizeDate(input);

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const monthNumber =
    date.getMonth() + 1;

  const year =
    date.getFullYear();

  // SEWAC day table format:
  //
  // day_14082026
  //
  const dayTable =
    `day_${day}${month}${year}`;

  return {
    date,

    day: Number(day),

    month: monthNumber,

    year,

    monthString: month,

    dayString: day,

    dayTable,

    monthName:
      MONTH_NAMES[monthNumber - 1],
  };
}


// ============================================================
// DATABASE TABLE EXISTS
// ============================================================

async function tableExists(
  db,
  tableName
) {
  validateIdentifier(tableName);

  const result =
    await db.$queryRawUnsafe(
      `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
          AND table_name = $1
      ) AS exists
      `,
      tableName
    );

  return result[0]?.exists === true;
}


// ============================================================
// GET VEHICLES FROM DAY TABLE
// ============================================================
//
// IMPORTANT:
//
// We DO NOT construct vehicle table names.
//
// We first open:
//
// day_DDMMYYYY
//
// Example:
//
// day_14082026
//
// Then we read:
//
// vehicle_number
// vehicle_table_name
// ward_no
//
// directly from that table.
//
// ============================================================

async function getVehiclesFromDayTable(
  dayTableName
) {
  validateIdentifier(dayTableName);

  const exists =
    await tableExists(
      telemetryDb,
      dayTableName
    );

  if (!exists) {
    throw new Error(
      `Day table "${dayTableName}" does not exist in master_telemetry_db`
    );
  }

  const rows =
    await telemetryDb.$queryRawUnsafe(
      `
      SELECT
        vehicle_number,
        vehicle_table_name,
        ward_no
      FROM ${quoteIdentifier(dayTableName)}
      WHERE vehicle_table_name IS NOT NULL
      ORDER BY vehicle_number ASC
      `
    );

  return rows;
}


// ============================================================
// GET VEHICLE TABLE COLUMNS
// ============================================================

async function getVehicleTableColumns(
  vehicleTableName
) {
  validateIdentifier(vehicleTableName);

  return telemetryDb.$queryRawUnsafe(
    `
    SELECT
      column_name,
      data_type,
      ordinal_position
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = $1
    ORDER BY ordinal_position ASC
    `,
    vehicleTableName
  );
}


// ============================================================
// VALIDATE VEHICLE TABLE
// ============================================================

async function validateVehicleTable(
  vehicleTableName
) {
  const exists =
    await tableExists(
      telemetryDb,
      vehicleTableName
    );

  if (!exists) {
    return {
      exists: false,
      columns: [],
    };
  }

  const columns =
    await getVehicleTableColumns(
      vehicleTableName
    );

  const names =
    columns.map(
      (column) =>
        column.column_name
    );

  const requiredColumns = [
    "id",
    "iottimestamp",
    "receivedtimestamp",
    "rfidepc",
    "citizenid",
    "wastetype",
    "latitude",
    "longitude",
    "wetweight",
    "dryweight",
    "otherweight",
    "cumulativeweight",
    "drivername",
    "vehiclenumber",
    "firmwareversion",
    "unitnumber",
    "collectiontype",
    "remarks",
    "errorcode",
    "citizencontact",
    "driveraction",
  ];

  const missing =
    requiredColumns.filter(
      (column) =>
        !names.includes(column)
    );

  if (missing.length > 0) {
    throw new Error(
      `Vehicle table "${vehicleTableName}" is missing columns: ${missing.join(
        ", "
      )}`
    );
  }

  return {
    exists: true,
    columns,
  };
}


// ============================================================
// ENSURE HISTORICAL TABLES
// ============================================================
//
// wardNo + month + year
//
// Example:
//
// ward 1
// August 2026
//
// yearly index:
//
// ward_1_2026
//
// monthly table:
//
// ward_1_082026
//
// The repository is responsible for creating/registering
// these tables.
//
// ============================================================

async function ensureHistoricalTables(
  wardNo,
  month,
  year
) {
  if (
    !Number.isInteger(Number(wardNo)) ||
    Number(wardNo) <= 0
  ) {
    throw new Error(
      `Invalid ward number: ${wardNo}`
    );
  }

  if (
    !Number.isInteger(Number(month)) ||
    Number(month) < 1 ||
    Number(month) > 12
  ) {
    throw new Error(
      `Invalid month: ${month}`
    );
  }

  if (
    !Number.isInteger(Number(year)) ||
    Number(year) < 2000
  ) {
    throw new Error(
      `Invalid year: ${year}`
    );
  }

  if (
    typeof historicalTableRepository
      .ensureWardHistoricalTables !==
    "function"
  ) {
    throw new Error(
      "historicalTableRepository.ensureWardHistoricalTables is not a function. Check citizenHistoricalTable.repository.js exports."
    );
  }

  return historicalTableRepository
    .ensureWardHistoricalTables({
      wardNo: Number(wardNo),
      month: Number(month),
      year: Number(year),
    });
}


// ============================================================
// GET HISTORICAL TABLE COLUMNS
// ============================================================

async function getHistoricalTableColumns(
  tableName
) {
  validateIdentifier(tableName);

  return historicalDb.$queryRawUnsafe(
    `
    SELECT
      column_name,
      data_type,
      ordinal_position
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = $1
    ORDER BY ordinal_position ASC
    `,
    tableName
  );
}


// ============================================================
// VALIDATE HISTORICAL TABLE
// ============================================================

async function validateHistoricalTable(
  tableName
) {
  const exists =
    await tableExists(
      historicalDb,
      tableName
    );

  if (!exists) {
    throw new Error(
      `Historical table "${tableName}" does not exist`
    );
  }

  const columns =
    await getHistoricalTableColumns(
      tableName
    );

  const names =
    columns.map(
      (column) =>
        column.column_name
    );

  const requiredColumns = [
    "historical_id",
    "source_telemetry_id",
    "source_vehicle_table",
    "vehicle_number",
    "ward_no",
    "iot_timestamp",
    "received_timestamp",
    "rfid_epc",
    "citizen_id",
    "waste_type",
    "latitude",
    "longitude",
    "wet_weight",
    "dry_weight",
    "other_weight",
    "cumulative_weight",
    "driver_name",
    "firmware_version",
    "unit_number",
    "collection_type",
    "remarks",
    "error_code",
    "citizen_contact",
    "driver_action",
    "source_day_table",
    "archived_at",
  ];

  const missing =
    requiredColumns.filter(
      (column) =>
        !names.includes(column)
    );

  if (missing.length > 0) {
    throw new Error(
      `Historical table "${tableName}" is missing columns: ${missing.join(
        ", "
      )}`
    );
  }

  return true;
}


// ============================================================
// INSERT VEHICLE RECORDS
// ============================================================
//
// IMPORTANT:
//
// The source is:
//
// master_telemetry_db
//
// The destination is:
//
// citizen historical DB
//
// So we cannot JOIN the two databases.
//
// Instead:
//
// 1. Read vehicle table from telemetryDb.
// 2. Read its rows from telemetryDb.
// 3. Insert those values into historicalDb.
//
// ============================================================

async function insertHistoricalBatch(
  historicalTableName,
  vehicleTableName,
  vehicleNumber,
  wardNo,
  sourceDayTable,
  limit,
  offset
) {
  validateIdentifier(
    historicalTableName
  );

  validateIdentifier(
    vehicleTableName
  );

  validateIdentifier(
    sourceDayTable
  );

  const safeLimit =
    Number(limit);

  const safeOffset =
    Number(offset);

  if (
    !Number.isInteger(safeLimit) ||
    safeLimit <= 0 ||
    safeLimit > 5000
  ) {
    throw new Error(
      "Invalid batch size"
    );
  }

  if (
    !Number.isInteger(safeOffset) ||
    safeOffset < 0
  ) {
    throw new Error(
      "Invalid offset"
    );
  }


  // ========================================================
  // READ FROM MASTER TELEMETRY DB
  // ========================================================

  const sourceRows =
    await telemetryDb.$queryRawUnsafe(
      `
      SELECT
        id,
        iottimestamp,
        receivedtimestamp,
        rfidepc,
        citizenid,
        wastetype,
        latitude,
        longitude,
        wetweight,
        dryweight,
        otherweight,
        cumulativeweight,
        drivername,
        vehiclenumber,
        firmwareversion,
        unitnumber,
        collectiontype,
        remarks,
        errorcode,
        citizencontact,
        driveraction
      FROM ${quoteIdentifier(
        vehicleTableName
      )}
      ORDER BY id ASC
      LIMIT $1
      OFFSET $2
      `,
      safeLimit,
      safeOffset
    );


  if (
    sourceRows.length === 0
  ) {
    return {
      inserted: 0,
      sourceRows: 0,
    };
  }


  // ========================================================
  // INSERT INTO HISTORICAL DB
  // ========================================================

  let inserted = 0;


  for (
    const row of sourceRows
  ) {

    const result =
      await historicalDb.$queryRawUnsafe(
        `
        INSERT INTO ${quoteIdentifier(
          historicalTableName
        )}
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
        RETURNING historical_id
        `,
        Number(row.id),
        vehicleTableName,
        row.vehiclenumber ??
          vehicleNumber ??
          null,
        Number(wardNo),
        row.iottimestamp,
        row.receivedtimestamp,
        row.rfidepc,
        row.citizenid,
        row.wastetype,
        row.latitude,
        row.longitude,
        row.wetweight,
        row.dryweight,
        row.otherweight,
        row.cumulativeweight,
        row.drivername,
        row.firmwareversion,
        row.unitnumber,
        row.collectiontype,
        row.remarks,
        row.errorcode,
        row.citizencontact,
        row.driveraction,
        sourceDayTable
      );


    inserted +=
      result.length;
  }


  return {
    inserted,
    sourceRows:
      sourceRows.length,
  };
}


// ============================================================
// GET VEHICLE ROW COUNT
// ============================================================

async function getVehicleRowCount(
  vehicleTableName
) {
  validateIdentifier(
    vehicleTableName
  );

  const result =
    await telemetryDb.$queryRawUnsafe(
      `
      SELECT
        COUNT(*)::BIGINT AS count
      FROM ${quoteIdentifier(
        vehicleTableName
      )}
      `
    );

  return Number(
    result[0]?.count ?? 0
  );
}


// ============================================================
// ARCHIVE ONE VEHICLE
// ============================================================

async function archiveVehicle({
  vehicleNumber,
  wardNo,
  vehicleTableName,
  sourceDayTable,
  month,
  year,
}) {
  const numericWard =
    Number(wardNo);

  const numericMonth =
    Number(month);

  const numericYear =
    Number(year);


  // ========================================================
  // VALIDATION
  // ========================================================

  if (
    !Number.isInteger(numericWard) ||
    numericWard <= 0
  ) {
    throw new Error(
      `Invalid ward number: ${wardNo}`
    );
  }

  if (!vehicleTableName) {
    throw new Error(
      `Vehicle table is missing for ${vehicleNumber}`
    );
  }

  validateIdentifier(
    vehicleTableName
  );


  // ========================================================
  // VALIDATE ACTUAL VEHICLE TABLE
  // ========================================================

  const vehicleValidation =
    await validateVehicleTable(
      vehicleTableName
    );

  if (
    !vehicleValidation.exists
  ) {
    throw new Error(
      `Vehicle table "${vehicleTableName}" does not exist in master_telemetry_db`
    );
  }

  console.log(
    `✅ Vehicle table validated in master_telemetry_db: ${vehicleTableName}`
  );


  // ========================================================
  // ENSURE WARD HISTORICAL TABLES
  // ========================================================

  const historicalTables =
    await ensureHistoricalTables(
      numericWard,
      numericMonth,
      numericYear
    );


  const monthlyTableName =
    historicalTables.monthlyTableName;

  const yearlyTableName =
    historicalTables.yearlyTableName;


  if (!monthlyTableName) {
    throw new Error(
      `Historical repository did not return monthlyTableName for ward ${numericWard}`
    );
  }


  // ========================================================
  // VALIDATE DESTINATION TABLE
  // ========================================================

  await validateHistoricalTable(
    monthlyTableName
  );

  console.log(
    `✅ Historical destination validated: ${monthlyTableName}`
  );


  // ========================================================
  // SOURCE RECORD COUNT
  // ========================================================

  const sourceRecords =
    await getVehicleRowCount(
      vehicleTableName
    );

  console.log(
    `📊 ${vehicleTableName}: ${sourceRecords} source records`
  );


  // ========================================================
  // ARCHIVE IN BATCHES
  // ========================================================

  let offset = 0;

  let inserted = 0;

  let processed = 0;


  while (
    processed < sourceRecords
  ) {

    const batch =
      await insertHistoricalBatch(
        monthlyTableName,
        vehicleTableName,
        vehicleNumber,
        numericWard,
        sourceDayTable,
        BATCH_SIZE,
        offset
      );


    inserted +=
      batch.inserted;

    processed +=
      batch.sourceRows;


    console.log(
      `   Batch ${offset} → ${
        offset + batch.sourceRows
      }: source ${batch.sourceRows}, inserted ${batch.inserted}`
    );


    offset +=
      BATCH_SIZE;


    if (
      batch.sourceRows === 0
    ) {
      break;
    }
  }


  // ========================================================
  // DUPLICATES
  // ========================================================

  const duplicates =
    Math.max(
      sourceRecords - inserted,
      0
    );


  // ========================================================
  // RESULT
  // ========================================================

  return {
    vehicleNumber,

    vehicleTableName,

    wardNo:
      numericWard,

    sourceDatabase:
      "master_telemetry_db",

    sourceDayTable,

    historicalYearTable:
      yearlyTableName,

    historicalMonthTable:
      monthlyTableName,

    sourceRecords,

    inserted,

    duplicates,

    archived:
      inserted > 0 ||
      sourceRecords === 0,
  };
}


// ============================================================
// ARCHIVE DATE
// ============================================================
//
// FLOW:
//
// requested date
//       ↓
// day_DDMMYYYY
//       ↓
// read vehicle_number
// read vehicle_table_name
// read ward_no
//       ↓
// actual vehicle table
//       ↓
// read telemetry rows
//       ↓
// ward monthly historical table
//       ↓
// insert
//
// NO boundary lookup.
//
// ============================================================

async function archiveDate(
  dateInput
) {
  const {
    date,
    day,
    month,
    year,
    dayTable,
    monthName,
  } =
    getDateInformation(
      dateInput
    );


  console.log("");

  console.log(
    "============================================================"
  );

  console.log(
    "🚛 SEWAC HISTORICAL DATABASE ARCHIVE"
  );

  console.log(
    "============================================================"
  );

  console.log(
    "Date:",
    `${year}-${String(month).padStart(
      2,
      "0"
    )}-${String(day).padStart(
      2,
      "0"
    )}`
  );

  console.log(
    "Source database:",
    "master_telemetry_db"
  );

  console.log(
    "Source day table:",
    dayTable
  );

  console.log(
    "============================================================"
  );


  // ========================================================
  // CHECK DAY TABLE
  // ========================================================

  const dayExists =
    await tableExists(
      telemetryDb,
      dayTable
    );


  if (!dayExists) {
    return {
      success: false,

      reason:
        "DAY_TABLE_NOT_FOUND",

      sourceDatabase:
        "master_telemetry_db",

      dayTable,

      date,

      year,

      month,

      monthName,

      archivedVehicles: 0,

      archivedRecords: 0,

      duplicateRecords: 0,

      vehicles: [],
    };
  }


  // ========================================================
  // READ VEHICLES FROM DAY TABLE
  // ========================================================

  const vehicles =
    await getVehiclesFromDayTable(
      dayTable
    );


  if (
    !vehicles ||
    vehicles.length === 0
  ) {
    return {
      success: false,

      reason:
        "NO_VEHICLES",

      sourceDatabase:
        "master_telemetry_db",

      sourceDayTable:
        dayTable,

      date,

      year,

      month,

      monthName,

      archivedVehicles: 0,

      archivedRecords: 0,

      duplicateRecords: 0,

      vehicles: [],
    };
  }


  console.log(
    `🚚 Vehicles found in ${dayTable}: ${vehicles.length}`
  );


  // ========================================================
  // TOTALS
  // ========================================================

  let archivedVehicles = 0;

  let archivedRecords = 0;

  let duplicateRecords = 0;


  const vehicleResults = [];

  const failedVehicles = [];


  // ========================================================
  // PROCESS EVERY VEHICLE
  // ========================================================

  for (
    const vehicle of vehicles
  ) {

    const vehicleNumber =
      vehicle.vehicle_number ??
      vehicle.vehicleNumber ??
      null;


    const vehicleTableName =
      vehicle.vehicle_table_name ??
      vehicle.vehicleTableName ??
      null;


    const wardNoRaw =
      vehicle.ward_no ??
      vehicle.wardNo ??
      null;


    const wardNo =
      Number(wardNoRaw);


    console.log("");

    console.log(
      "------------------------------------------------------------"
    );

    console.log(
      "Vehicle:",
      vehicleNumber
    );

    console.log(
      "Vehicle table from day table:",
      vehicleTableName
    );

    console.log(
      "Ward from day table:",
      wardNo
    );

    console.log(
      "------------------------------------------------------------"
    );


    // ======================================================
    // VEHICLE TABLE NAME
    // ======================================================

    if (!vehicleTableName) {

      failedVehicles.push({
        vehicleNumber,

        vehicleTableName:
          null,

        wardNo,

        archived:
          false,

        reason:
          "MISSING_VEHICLE_TABLE_NAME",
      });

      continue;
    }


    // ======================================================
    // WARD
    // ======================================================

    if (
      !Number.isInteger(wardNo) ||
      wardNo <= 0
    ) {

      failedVehicles.push({
        vehicleNumber,

        vehicleTableName,

        wardNo:
          wardNoRaw,

        archived:
          false,

        reason:
          "INVALID_WARD_NO",
      });

      continue;
    }


    // ======================================================
    // ARCHIVE VEHICLE
    // ======================================================

    try {

      const result =
        await archiveVehicle({
          vehicleNumber,

          wardNo,

          vehicleTableName,

          sourceDayTable:
            dayTable,

          month,

          year,
        });


      vehicleResults.push(
        result
      );


      archivedVehicles +=
        result.archived
          ? 1
          : 0;


      archivedRecords +=
        result.inserted;


      duplicateRecords +=
        result.duplicates;

    } catch (error) {

      console.error(
        `❌ Failed vehicle ${vehicleNumber}:`,
        error.message
      );


      failedVehicles.push({
        vehicleNumber,

        vehicleTableName,

        wardNo,

        archived:
          false,

        error:
          error.message,
      });
    }
  }


  // ========================================================
  // FINAL RESULT
  // ========================================================

  console.log("");

  console.log(
    "============================================================"
  );

  console.log(
    "✅ HISTORICAL ARCHIVE COMPLETE"
  );

  console.log(
    "============================================================"
  );

  console.log(
    "Source database:",
    "master_telemetry_db"
  );

  console.log(
    "Source day table:",
    dayTable
  );

  console.log(
    "Vehicles archived:",
    archivedVehicles
  );

  console.log(
    "Records inserted:",
    archivedRecords
  );

  console.log(
    "Duplicates:",
    duplicateRecords
  );

  console.log(
    "Failed vehicles:",
    failedVehicles.length
  );

  console.log(
    "============================================================"
  );


  return {
    success: true,

    sourceDatabase:
      "master_telemetry_db",

    sourceDayTable:
      dayTable,

    year,

    month,

    monthName,

    archivedVehicles,

    archivedRecords,

    duplicateRecords,

    failedVehicles,

    vehicles:
      vehicleResults,
  };
}


// ============================================================
// CONTROLLER — ARCHIVE TODAY
// ============================================================

async function archiveToday(
  req,
  res
) {
  try {

    const result =
      await archiveDate(
        new Date()
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
            `Day table '${result.dayTable}' does not exist in master_telemetry_db.`,

          data:
            result,
        });
    }


    if (
      result.reason ===
      "NO_VEHICLES"
    ) {

      return res
        .status(404)
        .json({
          success: false,

          message:
            `No vehicles found in '${result.sourceDayTable}'.`,

          data:
            result,
        });
    }


    return res
      .status(200)
      .json({
        success: true,

        message:
          `Historical telemetry for ${result.year}-${String(
            result.month
          ).padStart(2, "0")}-${String(
            result.day
              ? result.day
              : new Date().getDate()
          ).padStart(2, "0")} archived successfully.`,

        data:
          result,
      });

  } catch (error) {

    console.error(
      "\n❌ HISTORICAL ARCHIVE TODAY ERROR\n",
      error
    );


    return res
      .status(500)
      .json({
        success: false,

        message:
          "Failed to archive today's historical telemetry.",

        error:
          error.message,
      });
  }
}


// ============================================================
// CONTROLLER — ARCHIVE SPECIFIC DATE
// ============================================================
//
// POST
//
// /api/historical-database/archive
//
// Body:
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
            "date is required. Use YYYY-MM-DD.",
        });
    }


    if (
      typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(
        date
      )
    ) {

      return res
        .status(400)
        .json({
          success: false,

          message:
            "Invalid date format. Use YYYY-MM-DD.",
        });
    }


    const result =
      await archiveDate(
        date
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
            `Day table '${result.dayTable}' does not exist in master_telemetry_db.`,

          data:
            result,
        });
    }


    if (
      result.reason ===
      "NO_VEHICLES"
    ) {

      return res
        .status(404)
        .json({
          success: false,

          message:
            `No vehicles found in '${result.sourceDayTable}'.`,

          data:
            result,
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
      "\n❌ HISTORICAL ARCHIVE ERROR\n",
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
// CONTROLLER — TEST CONNECTIONS
// ============================================================

async function testConnections(
  req,
  res
) {
  try {

    const telemetryResult =
      await telemetryDb.$queryRawUnsafe(
        `
        SELECT
          current_database() AS database,
          current_schema() AS schema;
        `
      );


    const historicalResult =
      await historicalDb.$queryRawUnsafe(
        `
        SELECT
          current_database() AS database,
          current_schema() AS schema;
        `
      );


    const today =
      new Date();


    const todayInfo =
      getDateInformation(
        today
      );


    const todayExists =
      await tableExists(
        telemetryDb,
        todayInfo.dayTable
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

          todayTable:
            todayInfo.dayTable,

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
      "❌ Historical database connection test failed:",
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