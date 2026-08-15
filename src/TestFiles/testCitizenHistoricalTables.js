require("../config/loadEnv");

const citizenHistoricalPrisma =
  require("../config/citizenHistoricalPrisma");


// =====================================================
// CONFIGURATION
// =====================================================

const WARD_NO = 101;

const TEST_DATE =
  new Date(
    2026,
    7,
    9
  );


// =====================================================
// TABLE NAME GENERATORS
// =====================================================

function generateYearlyTableName(
  wardNo,
  date
) {

  const year =
    date.getFullYear();

  return `ward_${wardNo}_${year}`;

}


function generateMonthlyTableName(
  wardNo,
  date
) {

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const year =
    date.getFullYear();

  return `ward_${wardNo}_${month}${year}`;

}


// =====================================================
// TABLE EXISTENCE
// =====================================================

async function tableExists(
  tableName
) {

  const result =
    await citizenHistoricalPrisma
      .$queryRawUnsafe(
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
// CREATE YEARLY INDEX TABLE
// =====================================================
//
// Example:
//
// ward_101_2026
//
// This table does NOT contain telemetry.
//
// It stores the monthly table registry:
//
// August
// ward_101_082026
//
// =====================================================

async function createYearlyTable(
  tableName
) {

  await citizenHistoricalPrisma
    .$executeRawUnsafe(
      `
      CREATE TABLE IF NOT EXISTS "${tableName}" (

        id SERIAL PRIMARY KEY,

        month_number INTEGER NOT NULL,

        month_name VARCHAR(20) NOT NULL,

        table_name VARCHAR(150) NOT NULL,

        record_count BIGINT NOT NULL
          DEFAULT 0,

        first_record_at TIMESTAMP(6),

        last_record_at TIMESTAMP(6),

        created_at TIMESTAMP(6)
          DEFAULT CURRENT_TIMESTAMP,

        updated_at TIMESTAMP(6)
          DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "${tableName}_month_unique"
          UNIQUE (month_number),

        CONSTRAINT "${tableName}_table_unique"
          UNIQUE (table_name)

      )
      `
    );

}


// =====================================================
// CREATE MONTHLY HISTORY TABLE
// =====================================================
//
// Example:
//
// ward_101_082026
//
// THIS table contains the actual historical
// telemetry records.
//
// =====================================================

async function createMonthlyTable(
  tableName
) {

  await citizenHistoricalPrisma
    .$executeRawUnsafe(
      `
      CREATE TABLE IF NOT EXISTS "${tableName}" (

        telemetry_id BIGINT PRIMARY KEY,

        iot_timestamp TIMESTAMP(6),

        received_timestamp TIMESTAMP(6),

        created_at TIMESTAMP(6)
          DEFAULT CURRENT_TIMESTAMP,


        -- =============================================
        -- VEHICLE
        -- =============================================

        vehicle_number VARCHAR(100),

        driver_name VARCHAR(150),

        unit_number VARCHAR(100),

        firmware_version VARCHAR(100),


        -- =============================================
        -- GPS
        -- =============================================

        latitude NUMERIC(10,7),

        longitude NUMERIC(10,7),


        -- =============================================
        -- MASTER CITIZEN HIERARCHY
        -- =============================================

        city_id INTEGER,

        zone_id INTEGER,

        division_id INTEGER,

        ward_id INTEGER,

        ward_no INTEGER,


        -- =============================================
        -- CITIZEN
        -- =============================================

        citizen_id INTEGER,

        rfid_epc VARCHAR(150),

        citizen_contact VARCHAR(50),


        -- =============================================
        -- COLLECTION
        -- =============================================

        waste_type VARCHAR(50),

        collection_type VARCHAR(100),

        wet_weight NUMERIC(10,2),

        dry_weight NUMERIC(10,2),

        other_weight NUMERIC(10,2),

        cumulative_weight NUMERIC(10,2),


        -- =============================================
        -- ADDITIONAL TELEMETRY
        -- =============================================

        remarks TEXT,

        error_code VARCHAR(100),

        driver_action TEXT

      )
      `
    );


  // ===================================================
  // INDEXES
  // ===================================================

  await citizenHistoricalPrisma
    .$executeRawUnsafe(
      `
      CREATE INDEX IF NOT EXISTS
      "${tableName}_vehicle_idx"

      ON "${tableName}"
      (vehicle_number)
      `
    );


  await citizenHistoricalPrisma
    .$executeRawUnsafe(
      `
      CREATE INDEX IF NOT EXISTS
      "${tableName}_citizen_idx"

      ON "${tableName}"
      (citizen_id)
      `
    );


  await citizenHistoricalPrisma
    .$executeRawUnsafe(
      `
      CREATE INDEX IF NOT EXISTS
      "${tableName}_rfid_idx"

      ON "${tableName}"
      (rfid_epc)
      `
    );


  await citizenHistoricalPrisma
    .$executeRawUnsafe(
      `
      CREATE INDEX IF NOT EXISTS
      "${tableName}_timestamp_idx"

      ON "${tableName}"
      (iot_timestamp)
      `
    );


  await citizenHistoricalPrisma
    .$executeRawUnsafe(
      `
      CREATE INDEX IF NOT EXISTS
      "${tableName}_ward_idx"

      ON "${tableName}"
      (ward_no)
      `
    );

}


// =====================================================
// REGISTER MONTH IN YEARLY TABLE
// =====================================================

async function registerMonthlyTable(
  yearlyTableName,
  date,
  monthlyTableName
) {

  const monthNumber =
    date.getMonth() + 1;

  const monthName =
    date.toLocaleString(
      "en-US",
      {
        month: "long",
      }
    );


  await citizenHistoricalPrisma
    .$executeRawUnsafe(
      `
      INSERT INTO "${yearlyTableName}"
      (
        month_number,
        month_name,
        table_name
      )

      VALUES
      (
        $1,
        $2,
        $3
      )

      ON CONFLICT (month_number)

      DO UPDATE SET

        month_name =
          EXCLUDED.month_name,

        table_name =
          EXCLUDED.table_name,

        updated_at =
          CURRENT_TIMESTAMP
      `,

      monthNumber,

      monthName,

      monthlyTableName
    );

}


// =====================================================
// MAIN
// =====================================================

async function test() {

  try {

    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "CITIZEN HISTORICAL TABLE SETUP TEST"
    );

    console.log(
      "================================================="
    );

    console.log("");


    // =================================================
    // GENERATE TABLE NAMES
    // =================================================

    const yearlyTableName =
      generateYearlyTableName(
        WARD_NO,
        TEST_DATE
      );


    const monthlyTableName =
      generateMonthlyTableName(
        WARD_NO,
        TEST_DATE
      );


    const monthNumber =
      TEST_DATE.getMonth() + 1;


    const monthName =
      TEST_DATE.toLocaleString(
        "en-US",
        {
          month: "long",
        }
      );


    console.log(
      "Ward Number:",
      WARD_NO
    );

    console.log(
      "Date:",
      TEST_DATE.toDateString()
    );

    console.log("");

    console.log(
      "Yearly Table:",
      yearlyTableName
    );

    console.log(
      "Monthly Table:",
      monthlyTableName
    );

    console.log("");


    // =================================================
    // CHECK BEFORE CREATION
    // =================================================

    const yearlyBefore =
      await tableExists(
        yearlyTableName
      );


    const monthlyBefore =
      await tableExists(
        monthlyTableName
      );


    console.log(
      "Yearly table before:",
      yearlyBefore
    );

    console.log(
      "Monthly table before:",
      monthlyBefore
    );

    console.log("");


    // =================================================
    // CREATE YEARLY TABLE
    // =================================================

    await createYearlyTable(
      yearlyTableName
    );


    console.log(
      "Yearly table ensured."
    );


    // =================================================
    // CREATE MONTHLY TABLE
    // =================================================

    await createMonthlyTable(
      monthlyTableName
    );


    console.log(
      "Monthly table ensured."
    );


    // =================================================
    // REGISTER MONTH
    // =================================================

    await registerMonthlyTable(
      yearlyTableName,
      TEST_DATE,
      monthlyTableName
    );


    console.log(
      "Monthly table registered in yearly index."
    );


    // =================================================
    // CHECK AFTER CREATION
    // =================================================

    const yearlyAfter =
      await tableExists(
        yearlyTableName
      );


    const monthlyAfter =
      await tableExists(
        monthlyTableName
      );


    // =================================================
    // FINAL RESULT
    // =================================================

    console.log("");

    console.log(
      "Historical table setup result:"
    );

    console.log("");

    console.log(
      JSON.stringify(
        {
          wardNo:
            WARD_NO,

          year:
            TEST_DATE.getFullYear(),

          month:
            monthNumber,

          monthName,

          yearlyTableName,

          monthlyTableName,

          yearlyTableCreated:
            !yearlyBefore &&
            yearlyAfter,

          monthlyTableCreated:
            !monthlyBefore &&
            monthlyAfter,

          yearlyTableExists:
            yearlyAfter,

          monthlyTableExists:
            monthlyAfter,

        },
        null,
        2
      )
    );


    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "HISTORICAL TABLE SETUP COMPLETED"
    );

    console.log(
      "================================================="
    );


  } catch (error) {

    console.error("");

    console.error(
      "================================================="
    );

    console.error(
      "HISTORICAL TABLE SETUP FAILED"
    );

    console.error(
      "================================================="
    );

    console.error("");

    console.error(
      error
    );

  } finally {

    await citizenHistoricalPrisma
      .$disconnect();

    process.exit(0);

  }

}


// =====================================================
// RUN
// =====================================================

test();