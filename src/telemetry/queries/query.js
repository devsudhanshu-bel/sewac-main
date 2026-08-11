/**
 * ==========================================================
 * SEWAC TELEMETRY SQL FACTORY
 * ==========================================================
 */

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
    "driverAction"

)
VALUES (

    $1,$2,$3,$4,$5,
    $6,$7,$8,$9,$10,
    $11,$12,$13,$14,$15,
    $16,$17,$18,$19,$20

);
`;

const maintainMasterFIFO = () => `
DELETE FROM master_telemetry
WHERE id IN (

    SELECT id
    FROM master_telemetry
    ORDER BY "receivedTimestamp" DESC
    OFFSET 1000

);
`;

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

    $1,$2,$3,$4,$5,
    $6,$7,$8,$9,$10,
    $11,$12,$13,$14,$15,
    $16,$17,$18,$19,$20

);
`;

const createDayTable = (tableName) => `
CREATE TABLE IF NOT EXISTS "${tableName}" (

    vehicle_number VARCHAR(30) PRIMARY KEY,

    vehicle_table_name VARCHAR(100) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
`;

const registerVehicleInDayTable = (tableName) => `
INSERT INTO "${tableName}" (

    vehicle_number,

    vehicle_table_name

)

VALUES (

    $1,

    $2

)

ON CONFLICT (vehicle_number)

DO NOTHING;
`;

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

const createVehicleCumulativeTable = () => `
CREATE TABLE IF NOT EXISTS vehicle_cumulative (
    vehicle_number VARCHAR(50) PRIMARY KEY,
    cumulative_weight DECIMAL(12,2) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const updateVehicleCumulative = () => `
INSERT INTO vehicle_cumulative (
    vehicle_number,
    cumulative_weight,
    updated_at
)
VALUES ($1, $2, CURRENT_TIMESTAMP)
ON CONFLICT (vehicle_number)
DO UPDATE SET
    cumulative_weight =
        vehicle_cumulative.cumulative_weight + EXCLUDED.cumulative_weight,
    updated_at = CURRENT_TIMESTAMP
RETURNING cumulative_weight;
`;

const registerHierarchy = (dayTable, weekTable, monthTable, yearTable) => `
INSERT INTO "${dayTable}" (
    vehicle_number,
    vehicle_table_name
)
VALUES ($1, $2)
ON CONFLICT (vehicle_number)
DO NOTHING;

INSERT INTO "${weekTable}" (
    day_table_name
)
VALUES ($3)
ON CONFLICT (day_table_name)
DO NOTHING;

INSERT INTO "${monthTable}" (
    week_table_name
)
VALUES ($4)
ON CONFLICT (week_table_name)
DO NOTHING;

INSERT INTO "${yearTable}" (
    month_table_name
)
VALUES ($5)
ON CONFLICT (month_table_name)
DO NOTHING;
`;

module.exports = {
  createVehicleTelemetryTable,
  insertMasterTelemetry,
  insertVehicleTelemetry,
  maintainMasterFIFO,
  createDayTable,
  createWeekTable,
  createMonthTable,
  createYearTable,
  registerVehicleInDayTable,
  registerDayInWeekTable,
  registerWeekInMonthTable,
  registerMonthInYearTable,
  createVehicleCumulativeTable,
  updateVehicleCumulative,
  registerHierarchy,
};
