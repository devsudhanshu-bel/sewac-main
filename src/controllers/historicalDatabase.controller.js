const telemetryDb =
  require("../config/telemetryDb");

const historicalDb =
  require("../config/citizenHistoricalPrisma");

const historicalTableRepository =
  require(
    "../repositories/citizenHistoricalTable.repository"
  );


// =====================================================
// CONFIG
// =====================================================

const BATCH_SIZE = 500;


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
// SQL IDENTIFIER VALIDATION
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
// QUOTE IDENTIFIER
// =====================================================

function quoteIdentifier(value) {

  validateIdentifier(value);

  return `"${value}"`;
}


// =====================================================
// NORMALIZE DATE
// =====================================================

function normalizeDate(input) {

  if (input instanceof Date) {

    if (
      Number.isNaN(
        input.getTime()
      )
    ) {
      throw new Error("Invalid date");
    }

    return input;
  }


  if (
    typeof input === "string"
  ) {

    const value =
      input.trim();


    if (
      /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {

      const [
        year,
        month,
        day,
      ] =
        value
          .split("-")
          .map(Number);


      const date =
        new Date(
          Date.UTC(
            year,
            month - 1,
            day
          )
        );


      if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
      ) {

        throw new Error(
          `Invalid date: ${value}`
        );

      }


      return date;
    }


    const parsed =
      new Date(value);


    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {

      throw new Error(
        `Invalid date: ${value}`
      );

    }


    return parsed;
  }


  throw new Error(
    `Invalid date: ${input}`
  );
}


// =====================================================
// DATE INFORMATION
// =====================================================

function getDateInformation(input) {

  const date =
    normalizeDate(input);


  const day =
    String(
      date.getUTCDate()
    ).padStart(2, "0");


  const month =
    date.getUTCMonth() + 1;


  const monthString =
    String(month).padStart(
      2,
      "0"
    );


  const year =
    date.getUTCFullYear();


  // IMPORTANT
  //
  // SEWAC DAY TABLE FORMAT:
  //
  // day_14082026
  //
  // NOT:
  //
  // day_2026_08_14
  //

  const dayTable =
    `day_${day}${monthString}${year}`;


  return {

    date,

    day:
      Number(day),

    month,

    year,

    monthString,

    dayString:
      day,

    dayTable,

    monthName:
      MONTH_NAMES[
        month - 1
      ],

  };
}


// =====================================================
// TABLE EXISTS
// =====================================================

async function tableExists(
  db,
  tableName
) {

  validateIdentifier(
    tableName
  );


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


  return (
    result[0]?.exists === true
  );
}


// =====================================================
// GET DAY TABLE COLUMNS
// =====================================================

async function getDayTableColumns(
  dayTableName
) {

  validateIdentifier(
    dayTableName
  );


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
    dayTableName
  );
}


// =====================================================
// FIND VEHICLE TABLE COLUMN
// =====================================================

function findVehicleTableColumn(
  columns
) {

  const names =
    columns.map(
      column =>
        column.column_name
    );


  const possibleNames = [

    "vehicle_table_name",

    "vehicleTableName",

    "vehicle_table",

    "vehicleTable",

    "table_name",

    "tablename",

  ];


  const found =
    possibleNames.find(
      name =>
        names.includes(name)
    );


  if (!found) {

    throw new Error(
      `Could not find vehicle table name column. Available columns: ${names.join(
        ", "
      )}`
    );

  }


  return found;
}


// =====================================================
// GET VEHICLES FROM DAY TABLE
// =====================================================
//
// IMPORTANT:
//
// vehicle_table_name is read DIRECTLY
// from day_14082026.
//
// We DO NOT construct the vehicle table name.
//
// =====================================================

async function getVehiclesFromDayTable(
  dayTableName
) {

  validateIdentifier(
    dayTableName
  );


  const columns =
    await getDayTableColumns(
      dayTableName
    );


  const availableColumns =
    columns.map(
      column =>
        column.column_name
    );


  const vehicleTableColumn =
    findVehicleTableColumn(
      columns
    );


  // ---------------------------------------------------
  // REQUIRED DAY TABLE COLUMNS
  // ---------------------------------------------------

  if (
    !availableColumns.includes(
      "vehicle_number"
    )
  ) {

    throw new Error(
      `Day table "${dayTableName}" does not contain vehicle_number`
    );

  }


  if (
    !availableColumns.includes(
      "ward_no"
    )
  ) {

    throw new Error(
      `Day table "${dayTableName}" does not contain ward_no`
    );

  }


  // ---------------------------------------------------
  // READ DISTINCT VEHICLES
  // ---------------------------------------------------

  const sql = `

    SELECT DISTINCT

      vehicle_number,

      ward_no,

      "${vehicleTableColumn}"
        AS vehicle_table_name

    FROM "${dayTableName}"

    WHERE
      "${vehicleTableColumn}" IS NOT NULL

      AND TRIM(
        "${vehicleTableColumn}"
      ) <> ''

    ORDER BY
      vehicle_number ASC

  `;


  return telemetryDb.$queryRawUnsafe(
    sql
  );
}


// =====================================================
// SOURCE VEHICLE TABLE EXISTS
// =====================================================

async function sourceVehicleTableExists(
  tableName
) {

  validateIdentifier(
    tableName
  );


  return tableExists(
    telemetryDb,
    tableName
  );
}


// =====================================================
// GET VEHICLE TABLE COLUMNS
// =====================================================

async function getVehicleColumns(
  tableName
) {

  validateIdentifier(
    tableName
  );


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
    tableName
  );
}


// =====================================================
// VALIDATE VEHICLE TABLE
// =====================================================

async function validateVehicleTableStructure(
  tableName
) {

  const columns =
    await getVehicleColumns(
      tableName
    );


  const names =
    columns.map(
      column =>
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
      column =>
        !names.includes(
          column
        )
    );


  if (
    missing.length > 0
  ) {

    throw new Error(
      `Vehicle table "${tableName}" is missing columns: ${missing.join(
        ", "
      )}`
    );

  }


  return true;
}


// =====================================================
// ENSURE HISTORICAL TABLES
// =====================================================
//
// IMPORTANT FIX:
//
// The previous code tried:
//
// historicalTableRepository.ensureWardHistoricalTables()
//
// BUT that function does not exist in the repository
// you showed.
//
// Therefore we perform the exact operations here using
// the functions that ACTUALLY exist in the repository.
//
// =====================================================

async function ensureHistoricalTables(
  wardNo,
  month,
  year
) {

  const numericWard =
    Number(wardNo);

  const numericMonth =
    Number(month);

  const numericYear =
    Number(year);


  // ---------------------------------------------------
  // VALIDATION
  // ---------------------------------------------------

  if (
    !Number.isInteger(
      numericWard
    ) ||
    numericWard <= 0
  ) {

    throw new Error(
      `Invalid ward number: ${wardNo}`
    );

  }


  if (
    !Number.isInteger(
      numericMonth
    ) ||
    numericMonth < 1 ||
    numericMonth > 12
  ) {

    throw new Error(
      `Invalid month: ${month}`
    );

  }


  if (
    !Number.isInteger(
      numericYear
    ) ||
    numericYear < 2000
  ) {

    throw new Error(
      `Invalid year: ${year}`
    );

  }


  // ---------------------------------------------------
  // GENERATE TABLE NAMES
  // ---------------------------------------------------

  const yearlyTableName =
    historicalTableRepository
      .generateYearlyIndexTableName(
        numericWard,
        numericYear
      );


  const monthlyTableName =
    historicalTableRepository
      .generateMonthlyTableName(
        numericWard,
        numericMonth,
        numericYear
      );


  const monthName =
    MONTH_NAMES[
      numericMonth - 1
    ];


  // ---------------------------------------------------
  // YEAR TABLE
  // ---------------------------------------------------

  const yearlyExists =
    await historicalTableRepository.tableExists(
      yearlyTableName
    );


  if (
    !yearlyExists
  ) {

    await historicalTableRepository
      .createYearlyIndexTable(
        yearlyTableName
      );

  }


  // ---------------------------------------------------
  // MONTH TABLE
  // ---------------------------------------------------

  const monthlyExists =
    await historicalTableRepository.tableExists(
      monthlyTableName
    );


  if (
    !monthlyExists
  ) {

    await historicalTableRepository
      .createMonthlyHistoryTable(
        monthlyTableName
      );

  }


  // ---------------------------------------------------
  // REGISTER MONTH IN YEAR INDEX
  // ---------------------------------------------------

  await historicalTableRepository
    .registerMonthlyTable(

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
// GET HISTORICAL TABLE COLUMNS
// =====================================================

async function getHistoricalTableColumns(
  tableName
) {

  validateIdentifier(
    tableName
  );


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


// =====================================================
// VALIDATE HISTORICAL TABLE
// =====================================================

async function validateHistoricalTable(
  tableName
) {

  const exists =
    await tableExists(
      historicalDb,
      tableName
    );


  if (
    !exists
  ) {

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
      column =>
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
      column =>
        !names.includes(
          column
        )
    );


  if (
    missing.length > 0
  ) {

    throw new Error(
      `Historical table "${tableName}" is missing columns: ${missing.join(
        ", "
      )}`
    );

  }


  return true;
}


// =====================================================
// GET SOURCE VEHICLE COUNT
// =====================================================

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

      FROM "${vehicleTableName}"
      `
    );


  return Number(
    result[0]?.count ?? 0
  );
}


// =====================================================
// INSERT VEHICLE DATA
// =====================================================
//
// IMPORTANT:
//
// Source database:
//
// master_telemetry_db
//
// Source:
//
// KA05AB1234_14082026
//
// Destination:
//
// ward_1_082026
//
// Mapping is explicit.
//
// =====================================================

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
    !Number.isInteger(
      safeLimit
    ) ||
    safeLimit <= 0 ||
    safeLimit > 5000
  ) {

    throw new Error(
      "Invalid batch size"
    );

  }


  if (
    !Number.isInteger(
      safeOffset
    ) ||
    safeOffset < 0
  ) {

    throw new Error(
      "Invalid offset"
    );

  }


  const result =
    await historicalDb.$queryRawUnsafe(
      `
      INSERT INTO "${historicalTableName}" (

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

        source_day_table,

        archived_at

      )

      SELECT

        v.id,

        $1,

        v.vehiclenumber,

        $2,

        v.iottimestamp,

        v.receivedtimestamp,

        v.rfidepc,

        v.citizenid,

        v.wastetype,

        v.latitude,

        v.longitude,

        v.wetweight,

        v.dryweight,

        v.otherweight,

        v.cumulativeweight,

        v.drivername,

        v.firmwareversion,

        v.unitnumber,

        v.collectiontype,

        v.remarks,

        v.errorcode,

        v.citizencontact,

        v.driveraction,

        $3,

        NOW()

      FROM "${vehicleTableName}" AS v

      ORDER BY
        v.id ASC

      LIMIT $4
      OFFSET $5

      ON CONFLICT (
        source_vehicle_table,
        source_telemetry_id
      )

      DO NOTHING

      RETURNING historical_id
      `,

      vehicleTableName,

      Number(wardNo),

      sourceDayTable,

      safeLimit,

      safeOffset

    );


  return {

    inserted:
      result.length,

  };
}


// =====================================================
// ARCHIVE ONE VEHICLE
// =====================================================

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


  // ---------------------------------------------------
  // VALIDATE
  // ---------------------------------------------------

  if (
    !Number.isInteger(
      numericWard
    ) ||
    numericWard <= 0
  ) {

    throw new Error(
      `Invalid ward number: ${wardNo}`
    );

  }


  if (
    !vehicleTableName
  ) {

    throw new Error(
      `Vehicle table missing for ${vehicleNumber}`
    );

  }


  validateIdentifier(
    vehicleTableName
  );


  // ---------------------------------------------------
  // VEHICLE TABLE EXISTS
  // ---------------------------------------------------

  const vehicleExists =
    await sourceVehicleTableExists(
      vehicleTableName
    );


  if (
    !vehicleExists
  ) {

    throw new Error(
      `Vehicle table "${vehicleTableName}" does not exist in master_telemetry_db`
    );

  }


  // ---------------------------------------------------
  // VALIDATE SOURCE
  // ---------------------------------------------------

  await validateVehicleTableStructure(
    vehicleTableName
  );


  console.log(
    `✅ Vehicle table validated: ${vehicleTableName}`
  );


  // ---------------------------------------------------
  // ENSURE WARD TABLES
  // ---------------------------------------------------

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


  // ---------------------------------------------------
  // VALIDATE DESTINATION
  // ---------------------------------------------------

  await validateHistoricalTable(
    monthlyTableName
  );


  console.log(
    `✅ Historical table validated: ${monthlyTableName}`
  );


  // ---------------------------------------------------
  // SOURCE COUNT
  // ---------------------------------------------------

  const sourceRecords =
    await getVehicleRowCount(
      vehicleTableName
    );


  console.log(
    `📊 ${vehicleTableName}: ${sourceRecords} source records`
  );


  // ---------------------------------------------------
  // INSERT BATCHES
  // ---------------------------------------------------

  let offset =
    0;

  let inserted =
    0;


  while (
    offset < sourceRecords
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


    console.log(
      `   ${vehicleTableName} | offset ${offset} | inserted ${batch.inserted}`
    );


    offset +=
      BATCH_SIZE;

  }


  // ---------------------------------------------------
  // DUPLICATES
  // ---------------------------------------------------

  const duplicates =
    Math.max(
      sourceRecords - inserted,
      0
    );


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


// =====================================================
// ARCHIVE DATE
// =====================================================

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
    "🚛 SEWAC HISTORICAL ARCHIVE"
  );

  console.log(
    "============================================================"
  );

  console.log(
    "Source DB:",
    "master_telemetry_db"
  );

  console.log(
    "Day table:",
    dayTable
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
    "============================================================"
  );


  // ---------------------------------------------------
  // DAY TABLE EXISTS
  // ---------------------------------------------------

  const dayExists =
    await tableExists(
      telemetryDb,
      dayTable
    );


  if (
    !dayExists
  ) {

    return {

      success:
        false,

      reason:
        "DAY_TABLE_NOT_FOUND",

      sourceDatabase:
        "master_telemetry_db",

      sourceDayTable:
        dayTable,

      year,

      month,

      monthName,

      archivedVehicles:
        0,

      archivedRecords:
        0,

      duplicateRecords:
        0,

      vehicles: [],

    };
  }


  // ---------------------------------------------------
  // READ VEHICLES
  // ---------------------------------------------------

  const vehicles =
    await getVehiclesFromDayTable(
      dayTable
    );


  if (
    !vehicles.length
  ) {

    return {

      success:
        false,

      reason:
        "NO_VEHICLES",

      sourceDatabase:
        "master_telemetry_db",

      sourceDayTable:
        dayTable,

      year,

      month,

      monthName,

      archivedVehicles:
        0,

      archivedRecords:
        0,

      duplicateRecords:
        0,

      vehicles: [],

    };
  }


  console.log(
    `🚚 Vehicles found: ${vehicles.length}`
  );


  // ---------------------------------------------------
  // TOTALS
  // ---------------------------------------------------

  let archivedVehicles =
    0;

  let archivedRecords =
    0;

  let duplicateRecords =
    0;


  const vehicleResults = [];

  const failedVehicles = [];


  // ---------------------------------------------------
  // PROCESS VEHICLES
  // ---------------------------------------------------

  for (
    const vehicle
    of vehicles
  ) {

    const vehicleNumber =
      vehicle.vehicle_number ??
      null;


    const vehicleTableName =
      vehicle.vehicle_table_name ??
      null;


    const wardNo =
      Number(
        vehicle.ward_no
      );


    console.log("");

    console.log(
      "------------------------------------------------------------"
    );

    console.log(
      "Vehicle:",
      vehicleNumber
    );

    console.log(
      "Vehicle table:",
      vehicleTableName
    );

    console.log(
      "Ward:",
      wardNo
    );

    console.log(
      "------------------------------------------------------------"
    );


    // -------------------------------------------------
    // VALIDATE
    // -------------------------------------------------

    if (
      !vehicleTableName
    ) {

      failedVehicles.push({

        vehicleNumber,

        vehicleTableName:
          null,

        wardNo,

        archived:
          false,

        error:
          "MISSING_VEHICLE_TABLE_NAME",

      });

      continue;
    }


    if (
      !Number.isInteger(
        wardNo
      ) ||
      wardNo <= 0
    ) {

      failedVehicles.push({

        vehicleNumber,

        vehicleTableName,

        wardNo,

        archived:
          false,

        error:
          "INVALID_WARD_NO",

      });

      continue;
    }


    // -------------------------------------------------
    // ARCHIVE
    // -------------------------------------------------

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


      if (
        result.archived
      ) {

        archivedVehicles++;

      }


      archivedRecords +=
        result.inserted;


      duplicateRecords +=
        result.duplicates;


    } catch (
      error
    ) {

      console.error(
        `❌ Failed ${vehicleNumber}:`,
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


  // ---------------------------------------------------
  // RESULT
  // ---------------------------------------------------

  return {

    success:
      true,

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


// =====================================================
// CONTROLLER — ARCHIVE TODAY
// =====================================================

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

          success:
            false,

          message:
            `Day table '${result.sourceDayTable}' does not exist in master_telemetry_db.`,

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

          success:
            false,

          message:
            `No vehicles found in '${result.sourceDayTable}'.`,

          data:
            result,

        });
    }


    return res
      .status(200)
      .json({

        success:
          true,

        message:
          `Historical telemetry for ${result.year}-${String(
            result.month
          ).padStart(2, "0")}-${String(
            result.sourceDayTable
              .replace(
                "day_",
                ""
              )
              .substring(
                0,
                2
              )
          ).padStart(
            2,
            "0"
          )} archived successfully.`,

        data:
          result,

      });

  } catch (
    error
  ) {

    console.error(
      "\n❌ HISTORICAL ARCHIVE TODAY ERROR\n",
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          "Failed to archive today's historical telemetry.",

        error:
          error.message,

      });
  }
}


// =====================================================
// CONTROLLER — ARCHIVE SPECIFIC DATE
// =====================================================

async function archiveSpecificDate(
  req,
  res
) {

  try {

    const {
      date
    } =
      req.body || {};


    if (
      !date
    ) {

      return res
        .status(400)
        .json({

          success:
            false,

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

          success:
            false,

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

          success:
            false,

          message:
            `Day table '${result.sourceDayTable}' does not exist in master_telemetry_db.`,

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

          success:
            false,

          message:
            `No vehicles found in '${result.sourceDayTable}'.`,

          data:
            result,

        });
    }


    return res
      .status(200)
      .json({

        success:
          true,

        message:
          `Historical telemetry for ${date} archived successfully.`,

        data:
          result,

      });

  } catch (
    error
  ) {

    console.error(
      "\n❌ HISTORICAL ARCHIVE ERROR\n",
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          "Failed to archive historical telemetry.",

        error:
          error.message,

      });
  }
}


// =====================================================
// TEST DATABASE CONNECTIONS
// =====================================================

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


    const todayInfo =
      getDateInformation(
        new Date()
      );


    const todayExists =
      await tableExists(
        telemetryDb,
        todayInfo.dayTable
      );


    return res
      .status(200)
      .json({

        success:
          true,

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

  } catch (
    error
  ) {

    console.error(
      "❌ Database connection test failed:",
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          "Database connection test failed.",

        error:
          error.message,

      });
  }
}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  archiveToday,

  archiveDate:
    archiveSpecificDate,

  testConnections,

};