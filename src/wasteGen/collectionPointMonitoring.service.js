/**
 * ==========================================================
 * SEWAC COLLECTION POINT MONITORING SERVICE
 * ==========================================================
 *
 * Flow:
 *
 * Ward number
 *      ↓
 * Today's day table
 *      ↓
 * Vehicles belonging to ward
 *      ↓
 * Vehicle telemetry tables
 *      ↓
 * Latitude + Longitude + Complete telemetry data
 *
 * Example:
 *
 * GET
 * /api/collection-point-monitoring?wardNo=216&date=2026-08-18
 *
 * ==========================================================
 */

const pool = require("../config/db");

/* ==========================================================
   HELPERS
========================================================== */

/**
 * Validate SQL identifiers before using them in a dynamic
 * table name.
 *
 * PostgreSQL parameters cannot be used for table names,
 * therefore we validate the names before inserting them
 * into SQL.
 */
function validateTableName(tableName) {
  if (
    typeof tableName !== "string" ||
    !/^[a-zA-Z0-9_]+$/.test(tableName)
  ) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  return tableName;
}

/**
 * Safely quote a PostgreSQL identifier.
 */
function quoteIdentifier(identifier) {
  const validated = validateTableName(identifier);

  return `"${validated.replace(/"/g, '""')}"`;
}

/**
 * Convert:
 *
 * 2026-08-18
 *
 * into:
 *
 * day_18082026
 */
function buildDayTableName(dateInput) {
  if (!dateInput) {
    throw new Error("Date is required");
  }

  const date = new Date(`${dateInput}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD");
  }

  const day = String(date.getDate()).padStart(2, "0");

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const year = date.getFullYear();

  return `day_${day}${month}${year}`;
}

/* ==========================================================
   GET COLLECTION POINT MONITORING DATA
========================================================== */

async function getCollectionPointMonitoring({
  wardNo,
  date,
}) {
  /* ========================================================
     VALIDATE WARD
  ======================================================== */

  const parsedWardNo = Number(wardNo);

  if (!Number.isInteger(parsedWardNo)) {
    throw new Error("Invalid ward number");
  }

  /* ========================================================
     BUILD DAY TABLE
  ======================================================== */

  const dayTableName = buildDayTableName(date);

  const quotedDayTable = quoteIdentifier(dayTableName);

  /* ========================================================
     STEP 1
     
     Find all vehicles registered for this ward
     in today's day table.
  ======================================================== */

  const vehicleQuery = `
    SELECT
      vehicle_number,
      vehicle_table_name,
      ward_no,
      created_at
    FROM ${quotedDayTable}
    WHERE ward_no = $1
    ORDER BY vehicle_number ASC;
  `;

  let vehicleResult;

  try {
    vehicleResult = await pool.query(vehicleQuery, [
      parsedWardNo,
    ]);
  } catch (error) {
    /*
     * PostgreSQL error 42P01 = undefined_table.
     *
     * This normally means today's day table does not
     * exist yet.
     */
    if (error.code === "42P01") {
      return {
        ward_id: parsedWardNo,
        date: dayTableName,
        vehicles: {},
        vehicle_count: 0,
        point_count: 0,
      };
    }

    throw error;
  }

  const registeredVehicles = vehicleResult.rows;

  /* ========================================================
     STEP 2
     
     Read telemetry from ONLY the vehicle tables returned
     above.
  ======================================================== */

  const vehicles = {};

  let totalPointCount = 0;

  await Promise.all(
    registeredVehicles.map(async (vehicle) => {
      const vehicleNumber = vehicle.vehicle_number;

      const vehicleTableName = vehicle.vehicle_table_name;

      /*
       * Ignore invalid table names rather than allowing a
       * malformed value to reach the SQL query.
       */
      let quotedVehicleTable;

      try {
        quotedVehicleTable = quoteIdentifier(
          vehicleTableName,
        );
      } catch (error) {
        console.error(
          `Skipping invalid vehicle table: ${vehicleTableName}`,
          error,
        );

        return;
      }

      /* ====================================================
         GET ALL TELEMETRY POINTS
      ==================================================== */

      const telemetryQuery = `
        SELECT *
        FROM ${quotedVehicleTable}
        WHERE latitude IS NOT NULL
          AND longitude IS NOT NULL
        ORDER BY
          COALESCE(
            "iotTimestamp",
            "receivedTimestamp",
            created_at
          ) ASC,
          id ASC;
      `;

      let telemetryResult;

      try {
        telemetryResult = await pool.query(
          telemetryQuery,
        );
      } catch (error) {
        /*
         * If the vehicle table does not exist, keep the
         * vehicle in the response but return zero points.
         */
        if (error.code === "42P01") {
          vehicles[vehicleNumber] = {
            vehicle_number: vehicleNumber,
            vehicle_table_name: vehicleTableName,
            ward_no: vehicle.ward_no,
            registered_at: vehicle.created_at,
            point_count: 0,
            points: [],
          };

          return;
        }

        throw error;
      }

      /* ====================================================
         TRANSFORM TELEMETRY
      ==================================================== */

      const points = telemetryResult.rows.map((row) => ({
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),

        /*
         * Keep the COMPLETE original database row.
         *
         * This is what the frontend will use for the
         * hover information.
         */
        data: row,
      }));

      totalPointCount += points.length;

      /* ====================================================
         STORE VEHICLE
      ==================================================== */

      vehicles[vehicleNumber] = {
        vehicle_number: vehicleNumber,

        vehicle_table_name: vehicleTableName,

        ward_no: vehicle.ward_no,

        registered_at: vehicle.created_at,

        point_count: points.length,

        points,
      };
    }),
  );

  /* ========================================================
     FINAL RESPONSE
  ======================================================== */

  return {
    ward_id: parsedWardNo,

    date: dayTableName,

    vehicle_count: Object.keys(vehicles).length,

    point_count: totalPointCount,

    vehicles,
  };
}

module.exports = {
  getCollectionPointMonitoring,
};