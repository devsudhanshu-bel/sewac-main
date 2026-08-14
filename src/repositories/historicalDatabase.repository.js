const telemetryDb = require("../config/telemetryDb");
const citizenHistoricalPrisma = require(
  "../config/citizenHistoricalPrisma"
);

// =====================================================
// CONFIG
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
// DAY TABLE
// =====================================================

function getDayTableName(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `day_${day}${month}${year}`;
}

// =====================================================
// HISTORICAL TABLE NAMES
// =====================================================
//
// Example:
//
// wardNo = 174
// year = 2026
// month = 8
//
// Year:
// ward_174_2026
//
// Month:
// ward_174_082026
// =====================================================

function getYearTableName(wardNo, year) {
  return `ward_${wardNo}_${year}`;
}

function getMonthTableName(
  wardNo,
  month,
  year
) {
  const monthValue =
    String(month).padStart(2, "0");

  return `ward_${wardNo}_${monthValue}${year}`;
}

// =====================================================
// CHECK TABLE
// =====================================================

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
        AND table_name = $1
      ) AS exists
      `,
      tableName
    );

  return result[0]?.exists === true;
}

// =====================================================
// GET TODAY'S VEHICLES
// =====================================================
//
// IMPORTANT:
//
// ward_no comes DIRECTLY from the day table.
//
// No GPS.
// No ward lookup.
// No city.
// No zone.
// No division.
// =====================================================

async function getVehiclesFromDayTable(
  date
) {
  const dayTable =
    getDayTableName(date);

  validateIdentifier(dayTable);

  const exists =
    await tableExists(
      telemetryDb,
      dayTable
    );

  if (!exists) {
    return {
      dayTable,
      exists: false,
      vehicles: [],
    };
  }

  const vehicles =
    await telemetryDb.$queryRawUnsafe(
      `
      SELECT

        vehicle_number,
        vehicle_table_name,
        ward_no

      FROM "${dayTable}"

      ORDER BY vehicle_number ASC
      `
    );

  return {
    dayTable,
    exists: true,
    vehicles,
  };
}

// =====================================================
// GET VEHICLE TELEMETRY
// =====================================================

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
    return [];
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

      created_at

    FROM "${vehicleTableName}"

    ORDER BY id ASC
    `
  );
}

// =====================================================
// CREATE YEAR INDEX TABLE
// =====================================================
//
// Example:
//
// ward_174_2026
//
// This table contains ONLY month indexes.
// =====================================================

async function createYearTable(
  tableName
) {
  validateIdentifier(tableName);

  await citizenHistoricalPrisma.$executeRawUnsafe(
    `
    CREATE TABLE IF NOT EXISTS "${tableName}" (

      month_number INTEGER PRIMARY KEY,

      month_name VARCHAR(20) NOT NULL,

      month_table_name VARCHAR(100) NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    )
    `
  );
}

// =====================================================
// CREATE MONTH HISTORICAL TABLE
// =====================================================
//
// Example:
//
// ward_174_082026
//
// This contains ACTUAL telemetry.
// =====================================================

async function createMonthTable(
  tableName
) {
  validateIdentifier(tableName);

  await citizenHistoricalPrisma.$executeRawUnsafe(
    `
    CREATE TABLE IF NOT EXISTS "${tableName}" (

      historical_id BIGSERIAL PRIMARY KEY,

      source_telemetry_id BIGINT NOT NULL,

      source_vehicle_table VARCHAR(100) NOT NULL,

      vehicle_number VARCHAR(30),

      ward_no INTEGER NOT NULL,

      iot_timestamp TIMESTAMP,

      received_timestamp TIMESTAMP,

      rfid_epc VARCHAR(100),

      citizen_id INTEGER,

      waste_type VARCHAR(20),

      latitude DECIMAL(10,7),

      longitude DECIMAL(10,7),

      wet_weight DECIMAL(10,2),

      dry_weight DECIMAL(10,2),

      other_weight DECIMAL(10,2),

      cumulative_weight DECIMAL(10,2),

      driver_name VARCHAR(100),

      firmware_version VARCHAR(50),

      unit_number VARCHAR(50),

      collection_type VARCHAR(30),

      remarks TEXT,

      error_code VARCHAR(20),

      citizen_contact VARCHAR(30),

      driver_action VARCHAR(50),

      archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      UNIQUE (
        source_vehicle_table,
        source_telemetry_id
      )

    )
    `
  );
}

// =====================================================
// REGISTER MONTH IN YEAR INDEX
// =====================================================

async function registerMonthInYear(
  yearTableName,
  month,
  year,
  monthTableName
) {
  validateIdentifier(yearTableName);

  await citizenHistoricalPrisma.$executeRawUnsafe(
    `
    INSERT INTO "${yearTableName}" (

      month_number,
      month_name,
      month_table_name

    )

    VALUES ($1, $2, $3)

    ON CONFLICT (month_number)

    DO UPDATE SET

      month_name =
        EXCLUDED.month_name,

      month_table_name =
        EXCLUDED.month_table_name
    `,
    month,
    MONTH_NAMES[month - 1],
    monthTableName
  );
}

// =====================================================
// INSERT HISTORICAL TELEMETRY
// =====================================================

async function insertHistoricalRecord(
  tableName,
  record
) {
  validateIdentifier(tableName);

  const result =
    await citizenHistoricalPrisma.$queryRawUnsafe(
      `
      INSERT INTO "${tableName}" (

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

        driver_action

      )

      VALUES (

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
        $23

      )

      ON CONFLICT (
        source_vehicle_table,
        source_telemetry_id
      )

      DO NOTHING

      RETURNING *
      `,
      record.sourceTelemetryId,
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
      record.driverAction
    );

  return {
    inserted: result.length > 0,
    record: result[0] || null,
  };
}

// =====================================================
// COUNT HISTORICAL RECORDS
// =====================================================

async function getHistoricalCount(
  tableName
) {
  validateIdentifier(tableName);

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
// EXPORT
// =====================================================

module.exports = {

  getDayTableName,

  getYearTableName,

  getMonthTableName,

  getVehiclesFromDayTable,

  getVehicleTelemetry,

  createYearTable,

  createMonthTable,

  registerMonthInYear,

  insertHistoricalRecord,

  getHistoricalCount,

};