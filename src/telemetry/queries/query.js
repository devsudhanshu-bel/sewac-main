/**
 * ==========================================================
 * SEWAC TELEMETRY SQL FACTORY
 * ==========================================================
 */

// ==========================================================
// VEHICLE TELEMETRY TABLE
// ==========================================================

const createVehicleTelemetryTable = (tableName) => `
CREATE TABLE IF NOT EXISTS "${tableName}" (

    id BIGSERIAL PRIMARY KEY,

    iotTimestamp TIMESTAMP,

    receivedTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    rfidEpc VARCHAR(100),

    citizenId INTEGER,

    wasteType VARCHAR(20),

    latitude DECIMAL(10,7),

    longitude DECIMAL(10,7),

    wetWeight DECIMAL(10,2),

    dryWeight DECIMAL(10,2),

    otherWeight DECIMAL(10,2),

    cumulativeWeight DECIMAL(10,2),

    driverName VARCHAR(100),

    vehicleNumber VARCHAR(30),

    firmwareVersion VARCHAR(50),

    unitNumber VARCHAR(50),

    collectionType VARCHAR(30),

    remarks TEXT,

    errorCode VARCHAR(20),

    citizenContact VARCHAR(30),

    driverAction VARCHAR(50),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
`;

// ==========================================================
// MASTER TELEMETRY BUFFER INSERT
// ==========================================================

const insertMasterTelemetry = () => `
INSERT INTO master_telemetry (

    "iotTimestamp",
    "receivedTimestamp",
    "rfidEpc",
    "citizenId",
    "wasteType",
    "latitude",
    "longitude",
    "wetWeight",
    "dryWeight",
    "otherWeight",
    "cumulativeWeight",
    "driverName",
    "vehicleNumber",
    "firmwareVersion",
    "unitNumber",
    "collectionType",
    "remarks",
    "errorCode",
    "citizenContact",
    "driverAction",
    "processing_status"

)
VALUES (

    $1::timestamp,
    $2::timestamp,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,

    NULL,

    $11,
    $12,
    $13,
    $14,
    $15,
    $16,
    $17,
    $18,
    $19,
    'PROCESSING'

)

RETURNING id;
`;

// ==========================================================
// UPDATE MASTER CUMULATIVE WEIGHT
// ==========================================================

const updateMasterTelemetryCumulative = () => `
UPDATE master_telemetry

SET "cumulativeWeight" = $1

WHERE id = $2;
`;

// ==========================================================
// VEHICLE TELEMETRY
// ==========================================================

const insertVehicleTelemetry = (tableName) => `
INSERT INTO "${tableName}" (

    iotTimestamp,

    receivedTimestamp,

    rfidEpc,

    citizenId,

    wasteType,

    latitude,

    longitude,

    wetWeight,

    dryWeight,

    otherWeight,

    cumulativeWeight,

    driverName,

    vehicleNumber,

    firmwareVersion,

    unitNumber,

    collectionType,

    remarks,

    errorCode,

    citizenContact,

    driverAction

)
VALUES (

    $1::timestamp,

    $2::timestamp,

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

    $20

);
`;

// ==========================================================
// DAY TABLE
// ==========================================================

const createDayTable = (tableName) => `
CREATE TABLE IF NOT EXISTS "${tableName}" (

    vehicle_number VARCHAR(30) PRIMARY KEY,

    vehicle_table_name VARCHAR(100) NOT NULL,

    vehicle_table_name_hb VARCHAR(100) NOT NULL,

    ward_no INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
`;

const addDayHeartbeatColumn = (tableName) => `
ALTER TABLE "${tableName}"

ADD COLUMN IF NOT EXISTS
vehicle_table_name_hb VARCHAR(100);
`;

const registerVehicleInDayTable = (tableName) => `
INSERT INTO "${tableName}" (

    vehicle_number,

    vehicle_table_name,

    vehicle_table_name_hb,

    ward_no

)

VALUES (

    $1,

    $2,

    $3,

    $4

)

ON CONFLICT (vehicle_number)

DO UPDATE SET

    vehicle_table_name = EXCLUDED.vehicle_table_name,

    vehicle_table_name_hb = EXCLUDED.vehicle_table_name_hb,

    ward_no = EXCLUDED.ward_no;
`;

// ==========================================================
// DAILY VEHICLE HEARTBEAT TABLE
// ==========================================================

const createHeartbeatTable = (tableName) => `
CREATE TABLE IF NOT EXISTS "${tableName}" (

    id BIGSERIAL PRIMARY KEY,

    latitude DECIMAL(10,7) NOT NULL,

    longitude DECIMAL(10,7) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
`;

const insertHeartbeat = (tableName) => `
INSERT INTO "${tableName}" (

    latitude,

    longitude

)

VALUES (

    $1,

    $2

)

RETURNING id, latitude, longitude, created_at;
`;

// ==========================================================
// WEEK TABLE
// ==========================================================

const createWeekTable = (tableName) => `
CREATE TABLE IF NOT EXISTS "${tableName}" (

    day_table_name VARCHAR(50) PRIMARY KEY,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
`;

const registerDayInWeekTable = (tableName) => `
INSERT INTO "${tableName}" (

    day_table_name

)

VALUES (

    $1

)

ON CONFLICT (day_table_name)

DO NOTHING;
`;

// ==========================================================
// MONTH TABLE
// ==========================================================

const createMonthTable = (tableName) => `
CREATE TABLE IF NOT EXISTS "${tableName}" (

    week_table_name VARCHAR(50) PRIMARY KEY,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
`;

const registerWeekInMonthTable = (tableName) => `
INSERT INTO "${tableName}" (

    week_table_name

)

VALUES (

    $1

)

ON CONFLICT (week_table_name)

DO NOTHING;
`;

// ==========================================================
// YEAR TABLE
// ==========================================================

const createYearTable = (tableName) => `
CREATE TABLE IF NOT EXISTS "${tableName}" (

    month_table_name VARCHAR(50) PRIMARY KEY,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
`;

const registerMonthInYearTable = (tableName) => `
INSERT INTO "${tableName}" (

    month_table_name

)

VALUES (

    $1

)

ON CONFLICT (month_table_name)

DO NOTHING;
`;

// ==========================================================
// VEHICLE CUMULATIVE TABLE
// ==========================================================

const createVehicleCumulativeTable = () => `
CREATE TABLE IF NOT EXISTS vehicle_cumulative (

    vehicle_number VARCHAR(50) PRIMARY KEY,

    cumulative_weight DECIMAL(12,2)
    NOT NULL DEFAULT 0,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
`;

const updateVehicleCumulative = () => `
INSERT INTO vehicle_cumulative (

    vehicle_number,

    cumulative_weight,

    updated_at

)

VALUES (

    $1,

    $2,

    CURRENT_TIMESTAMP

)

ON CONFLICT (vehicle_number)

DO UPDATE SET

    cumulative_weight =
        vehicle_cumulative.cumulative_weight
        + EXCLUDED.cumulative_weight,

    updated_at = CURRENT_TIMESTAMP

RETURNING cumulative_weight;
`;

// ==========================================================
// MASTER TELEMETRY STATUS COLUMN
// ==========================================================

const addMasterTelemetryStatusColumn = () => `
ALTER TABLE master_telemetry

ADD COLUMN IF NOT EXISTS
processing_status VARCHAR(20)
DEFAULT 'COMPLETED';
`;

// ==========================================================
// MASTER TELEMETRY CUMULATIVE COLUMN
// ==========================================================

const addMasterTelemetryCumulativeColumn = () => `
ALTER TABLE master_telemetry

ADD COLUMN IF NOT EXISTS
"cumulativeWeight" DECIMAL(10,2);
`;

// ==========================================================
// MASTER TELEMETRY INDEX
// ==========================================================

const createMasterTelemetryStatusIndex = () => `
CREATE INDEX IF NOT EXISTS
idx_master_telemetry_status_received

ON master_telemetry (

    processing_status,

    "receivedTimestamp"

);
`;

// ==========================================================
// MARK COMPLETED
// ==========================================================

const markMasterTelemetryCompleted = () => `
UPDATE master_telemetry

SET processing_status = 'COMPLETED'

WHERE id = $1;
`;

// ==========================================================
// MARK FAILED
// ==========================================================

const markMasterTelemetryFailed = () => `
UPDATE master_telemetry

SET processing_status = 'FAILED'

WHERE id = $1;
`;

// ==========================================================
// MASTER BUFFER CLEANUP
// ==========================================================

const cleanupCompletedMasterTelemetry = () => `
DELETE FROM master_telemetry

WHERE id IN (

    SELECT id

    FROM master_telemetry

    WHERE processing_status = 'COMPLETED'

    ORDER BY

        "receivedTimestamp" ASC,

        id ASC

    LIMIT 1000

)

AND (

    SELECT COUNT(*)

    FROM master_telemetry

) >= 2000;  // Only cleanup if there are at least 2000 records in the table
`;

// ==========================================================
// EXPORTS 
// ==========================================================

module.exports = {
  createVehicleTelemetryTable,

  insertMasterTelemetry,

  updateMasterTelemetryCumulative,

  insertVehicleTelemetry,

  createDayTable,

  addDayHeartbeatColumn,

  createHeartbeatTable,

  insertHeartbeat,

  createWeekTable,

  createMonthTable,

  createYearTable,

  registerVehicleInDayTable,

  registerDayInWeekTable,

  registerWeekInMonthTable,

  registerMonthInYearTable,

  createVehicleCumulativeTable,

  updateVehicleCumulative,

  addMasterTelemetryStatusColumn,

  addMasterTelemetryCumulativeColumn,

  createMasterTelemetryStatusIndex,

  markMasterTelemetryCompleted,

  markMasterTelemetryFailed,

  cleanupCompletedMasterTelemetry,
};
