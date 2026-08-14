const citizenHistoricalPrisma = require(
  "../config/citizenHistoricalPrisma"
);


// ==========================================================
// HELPERS
// ==========================================================

const pad = (value) =>
  String(value).padStart(2, "0");


// ==========================================================
// GET DATE PARTS
// ==========================================================
//
// Returns:
//
// {
//   year: 2026,
//   month: "08",
//   week: 33
// }
//
// ==========================================================

const getDateParts = (
  date = new Date()
) => {

  const year =
    date.getFullYear();

  const month =
    pad(
      date.getMonth() + 1
    );

  // --------------------------------------------------------
  // ISO WEEK
  // --------------------------------------------------------

  const temp =
    new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )
    );

  const dayNum =
    temp.getUTCDay() || 7;

  temp.setUTCDate(
    temp.getUTCDate() +
    4 -
    dayNum
  );

  const yearStart =
    new Date(
      Date.UTC(
        temp.getUTCFullYear(),
        0,
        1
      )
    );

  const week =
    Math.ceil(
      (
        (
          (temp - yearStart) /
          86400000
        ) +
        1
      ) / 7
    );

  return {
    year,
    month,
    week,
  };
};


// ==========================================================
// SAFE SQL IDENTIFIER
// ==========================================================
//
// Table names cannot be parameterized using $1.
//
// Therefore we validate them before interpolation.
//
// ==========================================================

const assertSafeIdentifier = (
  name
) => {

  if (
    typeof name !== "string" ||
    !/^[a-zA-Z0-9_]+$/.test(name)
  ) {

    throw new Error(
      `Unsafe table name: ${name}`
    );
  }

  return `"${name}"`;
};


// ==========================================================
// CHECK TABLE EXISTS
// ==========================================================

const tableExists = async (
  tableName
) => {

  const result =
    await citizenHistoricalPrisma
      .$queryRawUnsafe(
        `
        SELECT EXISTS (

          SELECT 1

          FROM information_schema.tables

          WHERE table_schema = 'public'

          AND table_name = $1

        ) AS exists;
        `,
        tableName
      );

  return (
    result[0]?.exists === true
  );
};


// ==========================================================
// CREATE YEAR INDEX TABLE
// ==========================================================
//
// Example:
//
// historical_2026
//
// This table only stores references to months.
//
// ==========================================================

const createYearTable = async (
  yearName
) => {

  await citizenHistoricalPrisma
    .$executeRawUnsafe(
      `
      CREATE TABLE IF NOT EXISTS
      ${assertSafeIdentifier(yearName)}
      (

        id BIGSERIAL PRIMARY KEY,

        month_table_name
          VARCHAR(150) NOT NULL,

        created_at
          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        UNIQUE (
          month_table_name
        )

      );
      `
    );
};


// ==========================================================
// CREATE MONTH INDEX TABLE
// ==========================================================
//
// Example:
//
// historical_2026_month_08
//
// Stores references to weekly tables.
//
// ==========================================================

const createMonthTable = async (
  monthName
) => {

  await citizenHistoricalPrisma
    .$executeRawUnsafe(
      `
      CREATE TABLE IF NOT EXISTS
      ${assertSafeIdentifier(monthName)}
      (

        id BIGSERIAL PRIMARY KEY,

        week_table_name
          VARCHAR(150) NOT NULL,

        created_at
          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        UNIQUE (
          week_table_name
        )

      );
      `
    );
};


// ==========================================================
// CREATE WEEK INDEX TABLE
// ==========================================================
//
// Example:
//
// historical_2026_month_08_week_33
//
// Stores references to daily tables.
//
// ==========================================================

const createWeekTable = async (
  weekName
) => {

  await citizenHistoricalPrisma
    .$executeRawUnsafe(
      `
      CREATE TABLE IF NOT EXISTS
      ${assertSafeIdentifier(weekName)}
      (

        id BIGSERIAL PRIMARY KEY,

        day_table_name
          VARCHAR(150) NOT NULL,

        created_at
          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        UNIQUE (
          day_table_name
        )

      );
      `
    );
};


// ==========================================================
// CREATE HISTORICAL VEHICLE TABLE
// ==========================================================
//
// Example:
//
// historical_2026_08_ward_174_vehicle_KA01AB1234
//
// ==========================================================

const createHistoricalVehicleTable =
  async (
    tableName
  ) => {

    await citizenHistoricalPrisma
      .$executeRawUnsafe(
        `
        CREATE TABLE IF NOT EXISTS
        ${assertSafeIdentifier(tableName)}
        (

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

          created_at
            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          ward_no INTEGER,

          source_day_table VARCHAR(100),

          archived_at
            TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        );
        `
      );
  };


// ==========================================================
// ARCHIVE TODAY
// ==========================================================
//
// POST
//
// /api/historical-database/archive-today
//
// ==========================================================

const archiveToday =
  async (
    req,
    res
  ) => {

    try {

      // ====================================================
      // 1. CURRENT DATE
      // ====================================================

      const now =
        new Date();

      const {
        year,
        month,
        week,
      } =
        getDateParts(
          now
        );

      const day =
        pad(
          now.getDate()
        );


      // ====================================================
      // 2. TABLE NAMES
      // ====================================================

      const yearName =
        `historical_${year}`;

      const monthName =
        `${yearName}_month_${month}`;

      const weekName =
        `${monthName}_week_${week}`;

      const dayName =
        `day_${year}_${month}_${day}`;


      // ====================================================
      // 3. CHECK DAY TABLE
      // ====================================================

      const dayExists =
        await tableExists(
          dayName
        );

      if (!dayExists) {

        return res
          .status(404)
          .json({

            success: false,

            message:
              `Today's day table '${dayName}' does not exist.`,

            dayTable:
              dayName,

          });
      }


      // ====================================================
      // 4. READ VEHICLES FROM DAY TABLE
      // ====================================================
      //
      // IMPORTANT:
      //
      // ward_no comes DIRECTLY
      // from today's day table.
      //
      // We DO NOT:
      //
      // GPS → city
      // GPS → zone
      // GPS → division
      // GPS → ward
      //
      // ====================================================

      const vehicles =
        await citizenHistoricalPrisma
          .$queryRawUnsafe(
            `
            SELECT

              vehicle_number,

              vehicle_table_name,

              ward_no

            FROM
              ${assertSafeIdentifier(dayName)}

            ORDER BY
              vehicle_number ASC;
            `
          );


      // ====================================================
      // 5. NO VEHICLES
      // ====================================================

      if (
        vehicles.length === 0
      ) {

        return res
          .status(200)
          .json({

            success: true,

            message:
              "No vehicles found in today's day table.",

            date:
              `${year}-${month}-${day}`,

            dayTable:
              dayName,

            archivedVehicles:
              0,

            archivedRecords:
              0,

          });
      }


      // ====================================================
      // 6. CREATE YEAR TABLE
      // ====================================================

      await createYearTable(
        yearName
      );


      // ====================================================
      // 7. CREATE MONTH TABLE
      // ====================================================

      await createMonthTable(
        monthName
      );


      // ====================================================
      // 8. CREATE WEEK TABLE
      // ====================================================

      await createWeekTable(
        weekName
      );


      // ====================================================
      // 9. REGISTER MONTH IN YEAR
      // ====================================================

      await citizenHistoricalPrisma
        .$executeRawUnsafe(
          `
          INSERT INTO
          ${assertSafeIdentifier(yearName)}
          (
            month_table_name
          )

          VALUES ($1)

          ON CONFLICT (
            month_table_name
          )

          DO NOTHING;
          `,
          monthName
        );


      // ====================================================
      // 10. REGISTER WEEK IN MONTH
      // ====================================================

      await citizenHistoricalPrisma
        .$executeRawUnsafe(
          `
          INSERT INTO
          ${assertSafeIdentifier(monthName)}
          (
            week_table_name
          )

          VALUES ($1)

          ON CONFLICT (
            week_table_name
          )

          DO NOTHING;
          `,
          weekName
        );


      // ====================================================
      // RESULTS
      // ====================================================

      let archivedVehicles = 0;

      let archivedRecords = 0;

      const vehicleResults = [];


      // ====================================================
      // 11. PROCESS EVERY VEHICLE
      // ====================================================

      for (
        const vehicle
        of vehicles
      ) {

        const vehicleNumber =
          vehicle.vehicle_number;

        const vehicleTableName =
          vehicle.vehicle_table_name;

        const wardNo =
          Number(
            vehicle.ward_no
          );


        // --------------------------------------------------
        // VALIDATION
        // --------------------------------------------------

        if (
          !vehicleTableName
        ) {

          vehicleResults.push({

            vehicleNumber,

            wardNo,

            archived:
              false,

            reason:
              "MISSING_VEHICLE_TABLE_NAME",

          });

          continue;
        }


        if (
          !Number.isInteger(
            wardNo
          )
        ) {

          vehicleResults.push({

            vehicleNumber,

            vehicleTableName,

            archived:
              false,

            reason:
              "INVALID_WARD_NO",

          });

          continue;
        }


        // --------------------------------------------------
        // SOURCE TABLE
        // --------------------------------------------------

        const sourceTable =
          assertSafeIdentifier(
            vehicleTableName
          );


        // --------------------------------------------------
        // CLEAN VEHICLE NAME
        // --------------------------------------------------

        const cleanVehicle =
          String(
            vehicleNumber ||
            vehicleTableName
          )
            .replace(
              /[^a-zA-Z0-9]/g,
              "_"
            );


        // --------------------------------------------------
        // HISTORICAL VEHICLE TABLE
        // --------------------------------------------------

        const historicalVehicleTable =
          `historical_${year}_month_${month}_ward_${wardNo}_vehicle_${cleanVehicle}`;


        const destinationTable =
          assertSafeIdentifier(
            historicalVehicleTable
          );


        // --------------------------------------------------
        // CREATE HISTORICAL TABLE
        // --------------------------------------------------

        await createHistoricalVehicleTable(
          historicalVehicleTable
        );


        // --------------------------------------------------
        // COPY TODAY'S TELEMETRY
        // --------------------------------------------------
        //
        // IMPORTANT:
        //
        // We use today's date from the actual
        // requested day, rather than CURRENT_DATE.
        //
        // This makes the endpoint safe when testing
        // historical dates.
        //
        // --------------------------------------------------

        const insertResult =
          await citizenHistoricalPrisma
            .$executeRawUnsafe(
              `
              INSERT INTO
              ${destinationTable}
              (

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

              FROM
                ${sourceTable}

              WHERE
                DATE(iotTimestamp) =
                $3::date;
              `,
              wardNo,
              dayName,
              `${year}-${month}-${day}`
            );


        const copied =
          Number(
            insertResult
          );


        archivedRecords +=
          copied;

        archivedVehicles +=
          1;


        // --------------------------------------------------
        // REGISTER DAY IN WEEK
        // --------------------------------------------------

        await citizenHistoricalPrisma
          .$executeRawUnsafe(
            `
            INSERT INTO
            ${assertSafeIdentifier(
              weekName
            )}
            (
              day_table_name
            )

            VALUES ($1)

            ON CONFLICT (
              day_table_name
            )

            DO NOTHING;
            `,
            dayName
          );


        // --------------------------------------------------
        // RESULT
        // --------------------------------------------------

        vehicleResults.push({

          vehicleNumber,

          wardNo,

          sourceTable:
            vehicleTableName,

          historicalTable:
            historicalVehicleTable,

          recordsArchived:
            copied,

          archived:
            true,

        });

      }


      // ====================================================
      // 12. SUCCESS
      // ====================================================

      return res
        .status(200)
        .json({

          success: true,

          message:
            "Today's telemetry successfully archived.",

          date:
            `${year}-${month}-${day}`,

          hierarchy: {

            yearTable:
              yearName,

            monthTable:
              monthName,

            weekTable:
              weekName,

            dayTable:
              dayName,

          },

          archivedVehicles,

          archivedRecords,

          vehicles:
            vehicleResults,

        });

    } catch (
      error
    ) {

      // ====================================================
      // ERROR
      // ====================================================

      console.error(
        "❌ Historical archive failed:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Failed to archive today's telemetry.",

          error:
            error.message,

          stack:
            process.env.NODE_ENV ===
            "development"
              ? error.stack
              : undefined,

        });
    }
  };


// ==========================================================
// ARCHIVE SPECIFIC DATE
// ==========================================================
//
// POST
//
// /api/historical-database/archive
//
// Body:
//
// {
//   "date": "2026-08-14"
// }
//
// ==========================================================
//
// Rather than duplicating the entire archive logic,
// temporarily set the date and use the same processing
// function.
//
// ==========================================================

const archiveDate =
  async (
    req,
    res
  ) => {

    try {

      const {
        date
      } =
        req.body || {};


      if (!date) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              "date is required.",

          });
      }


      // ----------------------------------------------------
      // Validate YYYY-MM-DD
      // ----------------------------------------------------

      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(
          date
        )
      ) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              "Invalid date format. Use YYYY-MM-DD.",

          });
      }


      const requestedDate =
        new Date(
          `${date}T00:00:00`
        );


      if (
        Number.isNaN(
          requestedDate.getTime()
        )
      ) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              "Invalid date.",

          });
      }


      // ----------------------------------------------------
      // Build table names
      // ----------------------------------------------------

      const {
        year,
        month,
        week,
      } =
        getDateParts(
          requestedDate
        );

      const day =
        pad(
          requestedDate.getDate()
        );


      const yearName =
        `historical_${year}`;

      const monthName =
        `${yearName}_month_${month}`;

      const weekName =
        `${monthName}_week_${week}`;

      const dayName =
        `day_${year}_${month}_${day}`;


      // ----------------------------------------------------
      // CHECK DAY TABLE
      // ----------------------------------------------------

      const exists =
        await tableExists(
          dayName
        );


      if (!exists) {

        return res
          .status(404)
          .json({

            success: false,

            message:
              `Day table '${dayName}' does not exist.`,

            dayTable:
              dayName,

          });
      }


      // ----------------------------------------------------
      // READ VEHICLES
      // ----------------------------------------------------

      const vehicles =
        await citizenHistoricalPrisma
          .$queryRawUnsafe(
            `
            SELECT

              vehicle_number,

              vehicle_table_name,

              ward_no

            FROM
              ${assertSafeIdentifier(
                dayName
              )}

            ORDER BY
              vehicle_number ASC;
            `
          );


      if (
        vehicles.length === 0
      ) {

        return res
          .status(200)
          .json({

            success: true,

            message:
              "No vehicles found in the requested day table.",

            date,

            dayTable:
              dayName,

            archivedVehicles:
              0,

            archivedRecords:
              0,

          });
      }


      // ----------------------------------------------------
      // CREATE INDEX TABLES
      // ----------------------------------------------------

      await createYearTable(
        yearName
      );

      await createMonthTable(
        monthName
      );

      await createWeekTable(
        weekName
      );


      // ----------------------------------------------------
      // REGISTER MONTH
      // ----------------------------------------------------

      await citizenHistoricalPrisma
        .$executeRawUnsafe(
          `
          INSERT INTO
          ${assertSafeIdentifier(
            yearName
          )}
          (
            month_table_name
          )

          VALUES ($1)

          ON CONFLICT (
            month_table_name
          )

          DO NOTHING;
          `,
          monthName
        );


      // ----------------------------------------------------
      // REGISTER WEEK
      // ----------------------------------------------------

      await citizenHistoricalPrisma
        .$executeRawUnsafe(
          `
          INSERT INTO
          ${assertSafeIdentifier(
            monthName
          )}
          (
            week_table_name
          )

          VALUES ($1)

          ON CONFLICT (
            week_table_name
          )

          DO NOTHING;
          `,
          weekName
        );


      let archivedVehicles =
        0;

      let archivedRecords =
        0;

      const vehicleResults =
        [];


      // ----------------------------------------------------
      // PROCESS VEHICLES
      // ----------------------------------------------------

      for (
        const vehicle
        of vehicles
      ) {

        const vehicleNumber =
          vehicle.vehicle_number;

        const vehicleTableName =
          vehicle.vehicle_table_name;

        const wardNo =
          Number(
            vehicle.ward_no
          );


        if (
          !vehicleTableName
        ) {
          continue;
        }


        if (
          !Number.isInteger(
            wardNo
          )
        ) {

          vehicleResults.push({

            vehicleNumber,

            vehicleTableName,

            archived:
              false,

            reason:
              "INVALID_WARD_NO",

          });

          continue;
        }


        const sourceTable =
          assertSafeIdentifier(
            vehicleTableName
          );


        const cleanVehicle =
          String(
            vehicleNumber ||
            vehicleTableName
          )
            .replace(
              /[^a-zA-Z0-9]/g,
              "_"
            );


        const historicalVehicleTable =
          `historical_${year}_month_${month}_ward_${wardNo}_vehicle_${cleanVehicle}`;


        await createHistoricalVehicleTable(
          historicalVehicleTable
        );


        const destinationTable =
          assertSafeIdentifier(
            historicalVehicleTable
          );


        const copied =
          Number(
            await citizenHistoricalPrisma
              .$executeRawUnsafe(
                `
                INSERT INTO
                ${destinationTable}
                (

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

                FROM
                  ${sourceTable}

                WHERE
                  DATE(iotTimestamp) =
                  $3::date;
                `,
                wardNo,
                dayName,
                date
              )
          );


        archivedVehicles +=
          1;

        archivedRecords +=
          copied;


        await citizenHistoricalPrisma
          .$executeRawUnsafe(
            `
            INSERT INTO
            ${assertSafeIdentifier(
              weekName
            )}
            (
              day_table_name
            )

            VALUES ($1)

            ON CONFLICT (
              day_table_name
            )

            DO NOTHING;
            `,
            dayName
          );


        vehicleResults.push({

          vehicleNumber,

          wardNo,

          sourceTable:
            vehicleTableName,

          historicalTable:
            historicalVehicleTable,

          recordsArchived:
            copied,

          archived:
            true,

        });

      }


      // ----------------------------------------------------
      // RESPONSE
      // ----------------------------------------------------

      return res
        .status(200)
        .json({

          success: true,

          message:
            "Historical telemetry successfully archived.",

          date,

          hierarchy: {

            yearTable:
              yearName,

            monthTable:
              monthName,

            weekTable:
              weekName,

            dayTable:
              dayName,

          },

          archivedVehicles,

          archivedRecords,

          vehicles:
            vehicleResults,

        });

    } catch (
      error
    ) {

      console.error(
        "❌ Historical archive failed:",
        error
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Failed to archive historical telemetry.",

          error:
            error.message,

        });
    }
  };


// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

  archiveToday,

  archiveDate,

};