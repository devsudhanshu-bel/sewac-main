const pool = require("../config/db");

const {
  createDayTable,
  createWeekTable,
  createMonthTable,
  createYearTable,
} = require("../sqlFactory");

// ==========================================================
// HELPERS
// ==========================================================

const pad = (value) => String(value).padStart(2, "0");

const getDateParts = (date = new Date()) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);

  // ISO week number
  const temp = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  const dayNum = temp.getUTCDay() || 7;

  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);

  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));

  const week = Math.ceil(
    (((temp - yearStart) / 86400000) + 1) / 7
  );

  return {
    year,
    month,
    week,
  };
};

// ==========================================================
// SAFE TABLE NAME
// ==========================================================

const assertSafeIdentifier = (name) => {
  if (!/^[a-zA-Z0-9_]+$/.test(name)) {
    throw new Error(`Unsafe table name: ${name}`);
  }

  return `"${name}"`;
};

// ==========================================================
// ARCHIVE TODAY
// ==========================================================

const archiveToday = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ------------------------------------------------------
    // 1. GET DATE
    // ------------------------------------------------------

    const now = new Date();

    const { year, month, week } = getDateParts(now);

    const yearName = `historical_${year}`;
    const monthName = `${yearName}_month_${month}`;
    const weekName = `${monthName}_week_${week}`;

    // Today's daily registry table
    const today = `${year}-${month}-${pad(now.getDate())}`;

    const dayName = `day_${today.replaceAll("-", "_")}`;

    // ------------------------------------------------------
    // 2. CHECK TODAY'S DAY TABLE
    // ------------------------------------------------------

    const dayTable = assertSafeIdentifier(dayName);

    const dayExists = await client.query(
      `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = $1
      ) AS exists;
      `,
      [dayName]
    );

    if (!dayExists.rows[0].exists) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: `Today's day table '${dayName}' does not exist.`,
      });
    }

    // ------------------------------------------------------
    // 3. READ VEHICLES + WARD DIRECTLY FROM DAY TABLE
    // ------------------------------------------------------

    const vehiclesResult = await client.query(
      `
      SELECT
        vehicle_number,
        vehicle_table_name,
        ward_no
      FROM ${dayTable}
      ORDER BY vehicle_number;
      `
    );

    if (vehiclesResult.rows.length === 0) {
      await client.query("COMMIT");

      return res.status(200).json({
        success: true,
        message: "No vehicles found in today's day table.",
        archivedVehicles: 0,
        archivedRecords: 0,
      });
    }

    // ------------------------------------------------------
    // 4. CREATE YEAR INDEX
    // ------------------------------------------------------

    await client.query(
      createYearTable(yearName)
    );

    // ------------------------------------------------------
    // 5. CREATE MONTH INDEX
    // ------------------------------------------------------

    await client.query(
      createMonthTable(monthName)
    );

    // ------------------------------------------------------
    // 6. CREATE WEEK INDEX
    // ------------------------------------------------------

    await client.query(
      createWeekTable(weekName)
    );

    // ------------------------------------------------------
    // 7. REGISTER MONTH INSIDE YEAR
    // ------------------------------------------------------

    await client.query(
      `
      INSERT INTO ${assertSafeIdentifier(yearName)}
      (
        month_table_name
      )
      VALUES ($1)
      ON CONFLICT (month_table_name)
      DO NOTHING;
      `,
      [monthName]
    );

    // ------------------------------------------------------
    // 8. REGISTER WEEK INSIDE MONTH
    // ------------------------------------------------------

    await client.query(
      `
      INSERT INTO ${assertSafeIdentifier(monthName)}
      (
        week_table_name
      )
      VALUES ($1)
      ON CONFLICT (week_table_name)
      DO NOTHING;
      `,
      [weekName]
    );

    // ------------------------------------------------------
    // 9. PROCESS EVERY VEHICLE
    // ------------------------------------------------------

    let archivedVehicles = 0;
    let archivedRecords = 0;

    const vehicleResults = [];

    for (const vehicle of vehiclesResult.rows) {

      const {
        vehicle_number,
        vehicle_table_name,
        ward_no,
      } = vehicle;

      if (!vehicle_table_name) {
        continue;
      }

      // ----------------------------------------------------
      // VEHICLE TABLE
      // ----------------------------------------------------

      const sourceTable =
        assertSafeIdentifier(vehicle_table_name);

      // ----------------------------------------------------
      // HISTORICAL VEHICLE TABLE
      //
      // One historical table per vehicle / ward / month.
      //
      // Example:
      //
      // historical_2026_08_ward_12_vehicle_KA01AB1234
      // ----------------------------------------------------

      const cleanVehicle =
        String(vehicle_number)
          .replace(/[^a-zA-Z0-9]/g, "_");

      const historicalVehicleTable =
        `historical_${year}_${month}_ward_${ward_no}_vehicle_${cleanVehicle}`;

      const destinationTable =
        assertSafeIdentifier(historicalVehicleTable);

      // ----------------------------------------------------
      // CREATE HISTORICAL VEHICLE TABLE
      // ----------------------------------------------------

      await client.query(`
        CREATE TABLE IF NOT EXISTS ${destinationTable} (

          id BIGSERIAL PRIMARY KEY,

          iotTimestamp TIMESTAMP,

          receivedTimestamp TIMESTAMP,

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

          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          ward_no INTEGER,

          source_day_table VARCHAR(100),

          archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        );
      `);

      // ----------------------------------------------------
      // COPY TODAY'S TELEMETRY
      // ----------------------------------------------------

      const insertResult = await client.query(
        `
        INSERT INTO ${destinationTable} (

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
          driverAction,
          ward_no,
          source_day_table

        )

        SELECT

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
          driverAction,
          $1,
          $2

        FROM ${sourceTable}

        WHERE
          DATE(iotTimestamp) = CURRENT_DATE;

        `,
        [ward_no, dayName]
      );

      const copied =
        insertResult.rowCount || 0;

      archivedRecords += copied;
      archivedVehicles += 1;

      // ----------------------------------------------------
      // REGISTER DAY IN WEEK INDEX
      // ----------------------------------------------------

      await client.query(
        `
        INSERT INTO ${assertSafeIdentifier(weekName)}
        (
          day_table_name
        )
        VALUES ($1)
        ON CONFLICT (day_table_name)
        DO NOTHING;
        `,
        [dayName]
      );

      vehicleResults.push({
        vehicleNumber: vehicle_number,
        wardNo: ward_no,
        sourceTable: vehicle_table_name,
        historicalTable: historicalVehicleTable,
        recordsArchived: copied,
      });
    }

    // ------------------------------------------------------
    // 10. COMMIT
    // ------------------------------------------------------

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,

      message:
        "Today's telemetry successfully archived.",

      date: today,

      hierarchy: {
        yearTable: yearName,
        monthTable: monthName,
        weekTable: weekName,
        dayTable: dayName,
      },

      archivedVehicles,

      archivedRecords,

      vehicles: vehicleResults,
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(
      "Historical archive failed:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to archive today's telemetry.",
      error: error.message,
    });

  } finally {

    client.release();
  }
};

module.exports = {
  archiveToday,
};