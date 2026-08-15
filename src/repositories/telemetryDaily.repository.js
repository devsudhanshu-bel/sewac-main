const telemetryDb =
  require("../config/telemetryDb");

// =====================================================
// CONFIGURATION
// =====================================================

const DEFAULT_BATCH_SIZE = 500;

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
// GET DAY TABLE NAME
// =====================================================
//
// FORMAT:
//
// day_14082026
//
// NOT:
//
// day_2026_08_14
//
// =====================================================

function getDayTableName(
  date
) {
  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const year =
    date.getFullYear();

  return `day_${day}${month}${year}`;
}

// =====================================================
// CHECK DAY TABLE
// =====================================================

async function dayTableExists(
  date
) {
  const tableName =
    getDayTableName(date);

  const result =
    await telemetryDb.$queryRawUnsafe(
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

  return {
    exists:
      result[0]?.exists === true,

    tableName,
  };
}

// =====================================================
// GET VEHICLES FROM DAY TABLE
// =====================================================
//
// IMPORTANT:
//
// ward_no comes DIRECTLY from the day table.
//
// =====================================================

async function getVehiclesFromDayTable(
  processingDate
) {
  const tableInfo =
    await dayTableExists(
      processingDate
    );

  if (!tableInfo.exists) {
    return [];
  }

  const tableName =
    validateIdentifier(
      tableInfo.tableName
    );

  const vehicles =
    await telemetryDb.$queryRawUnsafe(
      `
      SELECT

        vehicle_number,

        vehicle_table_name,

        ward_no,

        created_at

      FROM "${tableName}"

      ORDER BY
        vehicle_number ASC
      `
    );

  return vehicles;
}

// =====================================================
// GET VEHICLE TELEMETRY
// =====================================================
//
// Reads the actual vehicle table.
//
// Example:
//
// KA05AB1234_14082026
//
// =====================================================

async function getVehicleTelemetry(
  vehicleTableName,
  offset = 0,
  limit = DEFAULT_BATCH_SIZE
) {
  validateIdentifier(
    vehicleTableName
  );

  const safeOffset =
    Number(offset);

  const safeLimit =
    Number(limit);

  if (
    !Number.isInteger(safeOffset) ||
    safeOffset < 0
  ) {
    throw new Error(
      "Invalid offset"
    );
  }

  if (
    !Number.isInteger(safeLimit) ||
    safeLimit <= 0 ||
    safeLimit > 5000
  ) {
    throw new Error(
      "Invalid batch size"
    );
  }

  return telemetryDb.$queryRawUnsafe(
    `
    SELECT

      id,

      iottimestamp AS "iotTimestamp",

      receivedtimestamp AS "receivedTimestamp",

      rfidepc AS "rfidEpc",

      citizenid AS "citizenId",

      wastetype AS "wasteType",

      latitude,

      longitude,

      wetweight AS "wetWeight",

      dryweight AS "dryWeight",

      otherweight AS "otherWeight",

      cumulativeweight AS "cumulativeWeight",

      drivername AS "driverName",

      vehiclenumber AS "vehicleNumber",

      firmwareversion AS "firmwareVersion",

      unitnumber AS "unitNumber",

      collectiontype AS "collectionType",

      remarks,

      errorcode AS "errorCode",

      citizencontact AS "citizenContact",

      driveraction AS "driverAction",

      created_at AS "createdAt"

    FROM "${vehicleTableName}"

    ORDER BY id ASC

    LIMIT $1

    OFFSET $2
    `,
    safeLimit,
    safeOffset
  );
}

// =====================================================
// GET VEHICLE TELEMETRY AFTER ID
// =====================================================
//
// Better for large tables.
//
// =====================================================

async function getVehicleTelemetryAfterId(
  vehicleTableName,
  lastId = 0,
  limit = DEFAULT_BATCH_SIZE
) {
  validateIdentifier(
    vehicleTableName
  );

  const safeLastId =
    Number(lastId);

  const safeLimit =
    Number(limit);

  if (
    !Number.isInteger(safeLastId) ||
    safeLastId < 0
  ) {
    throw new Error(
      "Invalid lastId"
    );
  }

  if (
    !Number.isInteger(safeLimit) ||
    safeLimit <= 0 ||
    safeLimit > 5000
  ) {
    throw new Error(
      "Invalid batch size"
    );
  }

  return telemetryDb.$queryRawUnsafe(
    `
    SELECT

      id,

      iottimestamp AS "iotTimestamp",

      receivedtimestamp AS "receivedTimestamp",

      rfidepc AS "rfidEpc",

      citizenid AS "citizenId",

      wastetype AS "wasteType",

      latitude,

      longitude,

      wetweight AS "wetWeight",

      dryweight AS "dryWeight",

      otherweight AS "otherWeight",

      cumulativeweight AS "cumulativeWeight",

      drivername AS "driverName",

      vehiclenumber AS "vehicleNumber",

      firmwareversion AS "firmwareVersion",

      unitnumber AS "unitNumber",

      collectiontype AS "collectionType",

      remarks,

      errorcode AS "errorCode",

      citizencontact AS "citizenContact",

      driveraction AS "driverAction",

      created_at AS "createdAt"

    FROM "${vehicleTableName}"

    WHERE id > $1

    ORDER BY id ASC

    LIMIT $2
    `,
    safeLastId,
    safeLimit
  );
}

// =====================================================
// COUNT VEHICLE RECORDS
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
// EXPORTS
// =====================================================

module.exports = {

  DEFAULT_BATCH_SIZE,

  validateIdentifier,

  getDayTableName,

  dayTableExists,

  getVehiclesFromDayTable,

  getVehicleTelemetry,

  getVehicleTelemetryAfterId,

  getVehicleRowCount,

};