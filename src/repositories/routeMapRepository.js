const telemetryDb = require("../config/telemetryDb");

/*
|--------------------------------------------------------------------------
| SAFE DATABASE IDENTIFIER
|--------------------------------------------------------------------------
|
| Dynamic table names come from our own database metadata:
|
| day_16082026
| KA05AB1236_16082026
|
| They are NEVER accepted directly from the frontend.
|
|--------------------------------------------------------------------------
*/

const IDENTIFIER_REGEX =
  /^[A-Za-z_][A-Za-z0-9_]*$/;

const quoteIdentifier = (identifier) => {
  if (
    typeof identifier !== "string" ||
    !IDENTIFIER_REGEX.test(identifier)
  ) {
    throw new Error(
      `Unsafe database identifier: ${identifier}`
    );
  }

  return `"${identifier.replace(/"/g, '""')}"`;
};

/*
|--------------------------------------------------------------------------
| CHECK TABLE EXISTS
|--------------------------------------------------------------------------
*/

const tableExists = async (tableName) => {
  const result =
    await telemetryDb.$queryRawUnsafe(
      `
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
          AND table_name = $1
        ) AS exists;
      `,
      tableName
    );

  return result[0]?.exists === true;
};

/*
|--------------------------------------------------------------------------
| GET DAY TABLE
|--------------------------------------------------------------------------
|
| 2026-08-16
|      ↓
| day_16082026
|
|--------------------------------------------------------------------------
*/

const getDayTableName = (date) => {
  const [year, month, day] =
    date.split("-").map(Number);

  return `day_${String(day).padStart(2, "0")}${String(
    month
  ).padStart(2, "0")}${year}`;
};

/*
|--------------------------------------------------------------------------
| GET VEHICLES FOR SELECTED WARD
|--------------------------------------------------------------------------
|
| We first read the selected day's table.
|
| Example:
|
| day_16082026
|
| Then:
|
| WHERE ward_no = 20
|
| We DO NOT construct the vehicle table name.
|
| We use the vehicle_table_name already stored in the day table.
|
|--------------------------------------------------------------------------
*/

const getVehiclesForWard = async (
  dayTableName,
  wardNo
) => {
  const exists =
    await tableExists(dayTableName);

  if (!exists) {
    return {
      exists: false,
      vehicles: [],
    };
  }

  const dayTable =
    quoteIdentifier(dayTableName);

  const vehicles =
    await telemetryDb.$queryRawUnsafe(
      `
        SELECT
          vehicle_number,
          vehicle_table_name,
          ward_no
        FROM ${dayTable}
        WHERE ward_no = $1
          AND vehicle_table_name IS NOT NULL
          AND TRIM(vehicle_table_name) <> ''
        ORDER BY vehicle_number ASC;
      `,
      wardNo
    );

  return {
    exists: true,
    vehicles,
  };
};

/*
|--------------------------------------------------------------------------
| GET ALL TELEMETRY FROM VEHICLE TABLE
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| We SELECT *
|
| This means the frontend receives the COMPLETE ROW.
|
| Nothing is manually removed here.
|
| The route is ordered chronologically using iottimestamp.
|
| id is used as a secondary ordering field.
|
|--------------------------------------------------------------------------
*/

const getVehicleTelemetry = async (
  vehicleTableName
) => {
  if (
    !vehicleTableName ||
    !IDENTIFIER_REGEX.test(vehicleTableName)
  ) {
    throw new Error(
      `Invalid vehicle table name: ${vehicleTableName}`
    );
  }

  const exists =
    await tableExists(
      vehicleTableName
    );

  if (!exists) {
    return {
      exists: false,
      records: [],
    };
  }

  const vehicleTable =
    quoteIdentifier(vehicleTableName);

  const records =
    await telemetryDb.$queryRawUnsafe(
      `
        SELECT *
        FROM ${vehicleTable}
        ORDER BY
          iottimestamp ASC NULLS LAST,
          id ASC;
      `
    );

  return {
    exists: true,
    records,
  };
};

/*
|--------------------------------------------------------------------------
| GET ROUTE DATA
|--------------------------------------------------------------------------
|
| MAIN DATABASE FLOW:
|
| date
|   ↓
| day_DDMMYYYY
|   ↓
| ward_no
|   ↓
| vehicle_table_name
|   ↓
| SELECT * FROM vehicle table
|   ↓
| ORDER BY iottimestamp
|
|--------------------------------------------------------------------------
*/

const getRouteData = async ({
  date,
  wardNo,
}) => {
  const dayTableName =
    getDayTableName(date);

  /*
  |--------------------------------------------------------------------------
  | STEP 1
  |--------------------------------------------------------------------------
  | Find vehicles registered for this ward on this date.
  */

  const dayResult =
    await getVehiclesForWard(
      dayTableName,
      wardNo
    );

  if (!dayResult.exists) {
    return {
      success: false,
      reason: "DAY_TABLE_NOT_FOUND",
      date,
      wardNo,
      dayTable: dayTableName,
      vehicles: [],
    };
  }

  /*
  |--------------------------------------------------------------------------
  | STEP 2
  |--------------------------------------------------------------------------
  | No vehicles for this ward.
  */

  if (
    !dayResult.vehicles ||
    dayResult.vehicles.length === 0
  ) {
    return {
      success: true,
      reason: "NO_VEHICLES",
      date,
      wardNo,
      dayTable: dayTableName,
      vehicles: [],
    };
  }

  /*
  |--------------------------------------------------------------------------
  | STEP 3
  |--------------------------------------------------------------------------
  | Read every vehicle table.
  */

  const vehicles = [];

  for (
    const vehicle of dayResult.vehicles
  ) {
    const vehicleNumber =
      vehicle.vehicle_number;

    const vehicleTableName =
      vehicle.vehicle_table_name;

    const vehicleWardNo =
      Number(vehicle.ward_no);

    /*
    |--------------------------------------------------------------------------
    | Read complete telemetry
    |--------------------------------------------------------------------------
    */

    const telemetry =
      await getVehicleTelemetry(
        vehicleTableName
      );

    /*
    |--------------------------------------------------------------------------
    | Only keep records containing
    | usable GPS coordinates.
    |--------------------------------------------------------------------------
    */

    const points =
      telemetry.records.filter(
        (record) => {
          const latitude =
            Number(record.latitude);

          const longitude =
            Number(record.longitude);

          return (
            Number.isFinite(latitude) &&
            Number.isFinite(longitude)
          );
        }
      );

    vehicles.push({
      vehicleNumber,
      vehicleTableName,
      wardNo: vehicleWardNo,
      totalRecords:
        telemetry.records.length,
      gpsPoints:
        points.length,
      points,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Return everything.
  |--------------------------------------------------------------------------
  */

  return {
    success: true,
    date,
    wardNo,
    dayTable: dayTableName,
    totalVehicles:
      vehicles.length,
    vehicles,
  };
};

module.exports = {
  getRouteData,
};