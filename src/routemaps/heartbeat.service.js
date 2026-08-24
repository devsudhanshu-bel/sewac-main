const mainDb = require("../config/mainDb");

/**
 * ============================================================
 * Convert YYYY-MM-DD -> DDMMYYYY
 * Example:
 * 2026-08-23 -> 23082026
 * ============================================================
 */
const formatDateForTable = (date) => {
  if (!date) {
    return null;
  }

  const parts = date.split("-");

  if (parts.length !== 3) {
    return null;
  }

  const [year, month, day] = parts;

  return `${day}${month}${year}`;
};

/**
 * ============================================================
 * Check whether a PostgreSQL table exists
 * ============================================================
 */
const tableExists = async (tableName) => {
  const result = await mainDb.query(
    `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = $1
      ) AS exists
    `,
    [tableName]
  );

  return result.rows[0]?.exists === true;
};

/**
 * ============================================================
 * GET AVERAGE WEIGHT GRAPH DATA
 *
 * Expected query:
 *
 * GET /api/average-weight?date=2026-08-23
 *
 * The selected date comes from the header.
 *
 * The corresponding daily table is:
 *
 * 2026-08-23
 *       ↓
 * day_23082026
 *
 * ============================================================
 */
const getAverageWeightGraph = async (date) => {
  // ----------------------------------------------------------
  // Validate date
  // ----------------------------------------------------------

  if (!date) {
    return {
      message: "Date is required.",
      data: [],
    };
  }

  const formattedDate = formatDateForTable(date);

  if (!formattedDate) {
    return {
      message: "Invalid date format. Expected YYYY-MM-DD.",
      data: [],
    };
  }

  const dayTable = `day_${formattedDate}`;

  // ----------------------------------------------------------
  // 1. CHECK WHETHER DAILY TABLE EXISTS
  // ----------------------------------------------------------

  const exists = await tableExists(dayTable);

  if (!exists) {
    return {
      message: `No data available for ${date}.`,
      data: [],
    };
  }

  // ----------------------------------------------------------
  // 2. GET VEHICLE MAPPING FROM DAILY TABLE
  //
  // day_DDMMYYYY contains:
  //
  // vehicle_number
  // vehicle_table_name
  // ward_no
  // created_at
  //
  // ----------------------------------------------------------

  const dayResult = await mainDb.query(
    `
      SELECT
        vehicle_number,
        vehicle_table_name,
        ward_no,
        created_at
      FROM "${dayTable}"
      ORDER BY created_at ASC
    `
  );

  // ----------------------------------------------------------
  // 3. TABLE EXISTS BUT HAS NO DATA
  // ----------------------------------------------------------

  if (
    !dayResult.rows ||
    dayResult.rows.length === 0
  ) {
    return {
      message: `No vehicle data available for ${date}.`,
      data: [],
    };
  }

  // ----------------------------------------------------------
  // 4. REMOVE INVALID VEHICLE TABLE REFERENCES
  // ----------------------------------------------------------

  const vehicleMappings = dayResult.rows.filter(
    (row) =>
      row.vehicle_table_name &&
      String(row.vehicle_table_name).trim() !== ""
  );

  if (vehicleMappings.length === 0) {
    return {
      message: `No vehicle telemetry data available for ${date}.`,
      data: [],
    };
  }

  // ----------------------------------------------------------
  // 5. FETCH TELEMETRY FROM EACH VEHICLE TABLE
  //
  // NOTE:
  // We only query tables that actually exist.
  // ----------------------------------------------------------

  const graphData = [];

  for (const vehicle of vehicleMappings) {
    const vehicleTable = String(
      vehicle.vehicle_table_name
    ).trim();

    // ----------------------------------------------
    // Check vehicle telemetry table
    // ----------------------------------------------

    const vehicleTableExists =
      await tableExists(vehicleTable);

    if (!vehicleTableExists) {
      continue;
    }

    // ----------------------------------------------
    // Get telemetry columns dynamically
    //
    // This prevents the API from crashing if a
    // particular telemetry table has a slightly
    // different structure.
    // ----------------------------------------------

    const columnsResult = await mainDb.query(
      `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
      `,
      [vehicleTable]
    );

    const columns = columnsResult.rows.map(
      (row) => row.column_name
    );

    // ------------------------------------------------
    // Find the weight column
    // ------------------------------------------------

    const possibleWeightColumns = [
      "weight",
      "waste_weight",
      "waste_generated",
      "weight_generated",
      "total_weight",
      "waste_weight_ton",
      "weight_ton",
    ];

    const weightColumn =
      possibleWeightColumns.find(
        (column) =>
          columns.includes(column)
      );

    // ------------------------------------------------
    // If this telemetry table doesn't contain a
    // weight field, skip it.
    // ------------------------------------------------

    if (!weightColumn) {
      continue;
    }

    // ------------------------------------------------
    // Get weight records
    // ------------------------------------------------

    const telemetryResult =
      await mainDb.query(
        `
          SELECT
            "${weightColumn}" AS weight
          FROM "${vehicleTable}"
          WHERE "${weightColumn}" IS NOT NULL
        `
      );

    if (
      !telemetryResult.rows ||
      telemetryResult.rows.length === 0
    ) {
      continue;
    }

    // ------------------------------------------------
    // Calculate vehicle average weight
    // ------------------------------------------------

    const weights =
      telemetryResult.rows
        .map((row) =>
          Number(row.weight)
        )
        .filter(
          (value) =>
            Number.isFinite(value)
        );

    if (weights.length === 0) {
      continue;
    }

    const totalWeight =
      weights.reduce(
        (sum, value) =>
          sum + value,
        0
      );

    const averageWeight =
      totalWeight /
      weights.length;

    // ------------------------------------------------
    // Add vehicle result
    // ------------------------------------------------

    graphData.push({
      vehicleNumber:
        vehicle.vehicle_number,

      zone:
        vehicle.ward_no,

      averageWeight:
        Number(
          averageWeight.toFixed(2)
        ),
    });
  }

  // ----------------------------------------------------------
  // 6. ALL VEHICLE TABLES EXIST BUT NO WEIGHT DATA
  // ----------------------------------------------------------

  if (graphData.length === 0) {
    return {
      message:
        `No weight data available for ${date}.`,
      data: [],
    };
  }

  // ----------------------------------------------------------
  // 7. RETURN GRAPH DATA
  // ----------------------------------------------------------

  return {
    message:
      "Average weight data fetched successfully.",

    date,

    data: graphData,
  };
};

module.exports = {
  getAverageWeightGraph,
};