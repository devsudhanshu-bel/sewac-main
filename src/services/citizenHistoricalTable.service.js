const telemetryDb = require(
  "../config/telemetryDb"
);

const historicalDb = require(
  "../config/citizenHistoricalPrisma"
);

const historicalTableRepository =
  require(
    "../repositories/citizenHistoricalTable.repository"
  );

// =====================================================
// CONFIGURATION
// =====================================================

const BATCH_SIZE = 500;

// =====================================================
// VALIDATE IDENTIFIER
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
// DAY TABLE NAME
// =====================================================

function generateDayTableName(
  dateInput
) {
  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      "Invalid date"
    );
  }

  const day = String(
    date.getUTCDate()
  ).padStart(2, "0");

  const month = String(
    date.getUTCMonth() + 1
  ).padStart(2, "0");

  const year =
    date.getUTCFullYear();

  return `day_${day}${month}${year}`;
}

// =====================================================
// GET DAY TABLE COLUMNS
// =====================================================

async function getDayTableColumns(
  dayTableName
) {
  validateIdentifier(dayTableName);

  return telemetryDb.$queryRawUnsafe(
    `
    SELECT
      column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = $1
    ORDER BY ordinal_position ASC
    `,
    dayTableName
  );
}

// =====================================================
// FIND DAY TABLE VEHICLE COLUMN
// =====================================================

function findVehicleTableColumn(
  columns
) {
  const names =
    columns.map(
      (row) => row.column_name
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
      (name) =>
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
// GET DAY TABLE VEHICLES
// =====================================================
//
// We use the vehicle table name ALREADY STORED
// inside the day table.
//
// We do NOT construct:
//
// KA05AB1234_14082026
//
// ourselves.
//
// =====================================================

async function getDayVehicles(
  dayTableName
) {
  validateIdentifier(dayTableName);

  const columns =
    await getDayTableColumns(
      dayTableName
    );

  const vehicleTableColumn =
    findVehicleTableColumn(
      columns
    );

  const availableColumns =
    columns.map(
      (row) => row.column_name
    );

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

  const sql = `
    SELECT DISTINCT
      vehicle_number,
      ward_no,
      "${vehicleTableColumn}" AS vehicle_table_name
    FROM "${dayTableName}"
    WHERE "${vehicleTableColumn}" IS NOT NULL
      AND TRIM("${vehicleTableColumn}") <> ''
    ORDER BY vehicle_number ASC
  `;

  return telemetryDb.$queryRawUnsafe(
    sql
  );
}

// =====================================================
// CHECK SOURCE VEHICLE TABLE
// =====================================================

async function sourceVehicleTableExists(
  tableName
) {
  validateIdentifier(tableName);

  const result =
    await telemetryDb.$queryRawUnsafe(
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

// =====================================================
// GET SOURCE VEHICLE COLUMNS
// =====================================================

async function getVehicleColumns(
  tableName
) {
  validateIdentifier(tableName);

  return telemetryDb.$queryRawUnsafe(
    `
    SELECT
      column_name,
      data_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = $1
    ORDER BY ordinal_position ASC
    `,
    tableName
  );
}

// =====================================================
// VALIDATE VEHICLE TABLE STRUCTURE
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

async function ensureHistoricalTables(
  wardNo,
  month,
  year
) {
  const result =
    await historicalTableRepository.ensureWardHistoricalTables
      ? await historicalTableRepository.ensureWardHistoricalTables({
          wardNo,
          month,
          year,
        })
      : null;

  return result;
}

// =====================================================
// ARCHIVE VEHICLE
// =====================================================
//
// THIS IS THE FIX.
//
// Every source field is explicitly mapped.
//
// Source:
//   iottimestamp
//
// Historical:
//   iot_timestamp
//
// Source:
//   receivedtimestamp
//
// Historical:
//   received_timestamp
//
// etc.
//
// =====================================================

async function archiveVehicle(
  {
    vehicleNumber,
    wardNo,
    vehicleTableName,
    sourceDayTable,
    month,
    year,
  }
) {
  validateIdentifier(
    vehicleTableName
  );

  validateIdentifier(
    sourceDayTable
  );

  const numericWard =
    Number(wardNo);

  const numericMonth =
    Number(month);

  const numericYear =
    Number(year);

  if (
    !Number.isInteger(numericWard) ||
    numericWard <= 0
  ) {
    throw new Error(
      `Invalid ward number: ${wardNo}`
    );
  }

  // ===================================================
  // SOURCE TABLE MUST EXIST
  // ===================================================

  const exists =
    await sourceVehicleTableExists(
      vehicleTableName
    );

  if (!exists) {
    throw new Error(
      `Vehicle table "${vehicleTableName}" does not exist in master_telemetry_db`
    );
  }

  // ===================================================
  // SOURCE STRUCTURE MUST MATCH
  // ===================================================

  await validateVehicleTableStructure(
    vehicleTableName
  );

  // ===================================================
  // HISTORICAL TABLE
  // ===================================================

  const monthlyTableName =
    historicalTableRepository.generateMonthlyTableName(
      numericWard,
      numericMonth,
      numericYear
    );

  // ===================================================
  // ENSURE TABLE EXISTS
  // ===================================================

  const monthlyExists =
    await historicalTableRepository.tableExists(
      monthlyTableName
    );

  if (!monthlyExists) {
    await historicalTableRepository.createMonthlyHistoryTable(
      monthlyTableName
    );
  }

  // ===================================================
  // COUNT SOURCE
  // ===================================================

  const countResult =
    await telemetryDb.$queryRawUnsafe(
      `
      SELECT COUNT(*)::BIGINT AS count
      FROM "${vehicleTableName}"
      `
    );

  const sourceRecords =
    Number(
      countResult[0]?.count ?? 0
    );

  // ===================================================
  // INSERT EXACT SOURCE VALUES
  // ===================================================
  //
  // DO NOT change these source column names.
  //
  // They exactly match your screenshot.
  //
  // ===================================================

  const insertResult =
    await historicalDb.$queryRawUnsafe(
      `
      INSERT INTO "${monthlyTableName}" (

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

        id,

        $1,

        $2,

        $3,

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

        firmwareversion,

        unitnumber,

        collectiontype,

        remarks,

        errorcode,

        citizencontact,

        driveraction,

        $4,

        NOW()

      FROM "${vehicleTableName}"

      ON CONFLICT (
        source_vehicle_table,
        source_telemetry_id
      )

      DO NOTHING

      RETURNING historical_id
      `,
      vehicleTableName,
      vehicleNumber,
      numericWard,
      sourceDayTable
    );

  const inserted =
    insertResult.length;

  const duplicates =
    Math.max(
      sourceRecords - inserted,
      0
    );

  return {
    vehicleNumber,

    vehicleTableName,

    wardNo: numericWard,

    sourceDatabase:
      "master_telemetry_db",

    sourceDayTable,

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
// ARCHIVE DAY
// =====================================================

async function archiveDay(
  dateInput
) {
  const date =
    new Date(dateInput);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    throw new Error(
      "Invalid archive date"
    );
  }

  const day =
    String(
      date.getUTCDate()
    ).padStart(2, "0");

  const month =
    date.getUTCMonth() + 1;

  const year =
    date.getUTCFullYear();

  const monthName =
    historicalTableRepository.MONTH_NAMES[
      month - 1
    ];

  const sourceDayTable =
    `day_${day}${String(month).padStart(
      2,
      "0"
    )}${year}`;

  // ===================================================
  // CHECK DAY TABLE
  // ===================================================

  const dayExists =
    await sourceVehicleTableExists(
      sourceDayTable
    );

  if (!dayExists) {
    throw new Error(
      `Day table "${sourceDayTable}" does not exist in master_telemetry_db`
    );
  }

  // ===================================================
  // READ VEHICLES FROM DAY TABLE
  // ===================================================

  const vehicles =
    await getDayVehicles(
      sourceDayTable
    );

  const results = [];

  let archivedVehicles = 0;
  let archivedRecords = 0;
  let duplicateRecords = 0;

  // ===================================================
  // PROCESS EVERY VEHICLE
  // ===================================================

  for (
    const vehicle of vehicles
  ) {
    try {
      const result =
        await archiveVehicle({
          vehicleNumber:
            vehicle.vehicle_number,

          wardNo:
            vehicle.ward_no,

          vehicleTableName:
            vehicle.vehicle_table_name,

          sourceDayTable,

          month,

          year,
        });

      results.push(
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

    } catch (error) {
      results.push({
        vehicleNumber:
          vehicle.vehicle_number,

        vehicleTableName:
          vehicle.vehicle_table_name,

        wardNo:
          Number(
            vehicle.ward_no
          ),

        archived: false,

        error:
          error.message,
      });
    }
  }

  // ===================================================
  // RETURN
  // ===================================================

  return {
    success: true,

    sourceDatabase:
      "master_telemetry_db",

    sourceDayTable,

    year,

    month,

    monthName,

    archivedVehicles,

    archivedRecords,

    duplicateRecords,

    vehicles: results,
  };
}

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  generateDayTableName,
  getDayVehicles,
  archiveVehicle,
  archiveDay,
};