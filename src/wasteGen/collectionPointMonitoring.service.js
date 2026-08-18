/**
 * ==========================================================
 * SEWAC COLLECTION POINT MONITORING SERVICE
 * ==========================================================
 *
 * FILE:
 *
 * src/wasteGen/collectionPointMonitoring.service.js
 *
 * ==========================================================
 *
 * FLOW:
 *
 * Ward Number
 *      ↓
 * day_DDMMYYYY
 *      ↓
 * Vehicles belonging to ward
 *      ↓
 * vehicle_table_name
 *      ↓
 * Vehicle telemetry table
 *      ↓
 * latitude + longitude + complete row
 *
 * ==========================================================
 */

const {
  PrismaClient,
} = require("../../generated/telemetry");


/* ==========================================================
   TELEMETRY PRISMA CLIENT
========================================================== */

const telemetryDb =
  new PrismaClient({

    log: [
      "error",
    ],

  });


/* ==========================================================
   JSON SAFE VALUE CONVERTER
========================================================== */

/*
 * PostgreSQL / Prisma can return values which native
 * JSON.stringify() cannot serialize.
 *
 * Most importantly:
 *
 * BigInt
 *
 * The telemetry table has:
 *
 * id BigInt
 *
 * Therefore:
 *
 * BigInt → String
 *
 * We intentionally keep it as a STRING instead of Number
 * so that very large database IDs can never lose precision.
 *
 * Dates are converted to ISO strings.
 *
 * Decimal-like Prisma values are converted to strings.
 *
 * Objects and arrays are handled recursively.
 */

function makeJsonSafe(value) {

  /* --------------------------------------------------------
     NULL / undefined
  -------------------------------------------------------- */

  if (
    value === null ||
    value === undefined
  ) {

    return value;

  }


  /* --------------------------------------------------------
     BIGINT
  -------------------------------------------------------- */

  if (
    typeof value === "bigint"
  ) {

    return value.toString();

  }


  /* --------------------------------------------------------
     DATE
  -------------------------------------------------------- */

  if (
    value instanceof Date
  ) {

    return value.toISOString();

  }


  /* --------------------------------------------------------
     NUMBER
  -------------------------------------------------------- */

  if (
    typeof value === "number"
  ) {

    if (
      Number.isNaN(value) ||
      !Number.isFinite(value)
    ) {

      return null;

    }

    return value;

  }


  /* --------------------------------------------------------
     STRING / BOOLEAN
  -------------------------------------------------------- */

  if (
    typeof value === "string" ||
    typeof value === "boolean"
  ) {

    return value;

  }


  /* --------------------------------------------------------
     ARRAY
  -------------------------------------------------------- */

  if (
    Array.isArray(value)
  ) {

    return value.map(
      makeJsonSafe
    );

  }


  /* --------------------------------------------------------
     PRISMA DECIMAL / DECIMAL-LIKE OBJECT
  -------------------------------------------------------- */

  /*
   * Prisma Decimal objects usually expose toJSON().
   *
   * We don't want to accidentally turn every object into
   * a string, so only handle objects that clearly expose
   * Decimal-style conversion.
   */

  if (
    value &&
    typeof value === "object" &&
    typeof value.toNumber === "function" &&
    typeof value.toString === "function"
  ) {

    return value.toString();

  }


  /* --------------------------------------------------------
     GENERIC OBJECT
  -------------------------------------------------------- */

  if (
    typeof value === "object"
  ) {

    const result = {};


    for (
      const key of Object.keys(value)
    ) {

      result[key] =
        makeJsonSafe(
          value[key]
        );

    }


    return result;

  }


  /* --------------------------------------------------------
     FALLBACK
  -------------------------------------------------------- */

  return value;

}


/* ==========================================================
   VALIDATE TABLE NAME
========================================================== */

function validateTableName(
  tableName
) {

  if (
    typeof tableName !== "string"
  ) {

    throw new Error(
      `Invalid table name: ${tableName}`
    );

  }


  /*
   * Dynamic table names must only contain:
   *
   * letters
   * numbers
   * underscore
   */

  if (
    !/^[a-zA-Z0-9_]+$/.test(
      tableName
    )
  ) {

    throw new Error(
      `Invalid table name: ${tableName}`
    );

  }


  return tableName;

}


/* ==========================================================
   BUILD DAY TABLE NAME
========================================================== */

/*
 * Input:
 *
 * 2026-08-17
 *
 * Output:
 *
 * day_17082026
 */

function buildDayTableName(
  dateInput
) {

  if (
    !dateInput
  ) {

    throw new Error(
      "Date is required"
    );

  }


  /* --------------------------------------------------------
     Validate YYYY-MM-DD
  -------------------------------------------------------- */

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      dateInput
    )
  ) {

    throw new Error(
      "Invalid date format. Expected YYYY-MM-DD"
    );

  }


  const [
    year,
    month,
    day,
  ] =
    dateInput.split("-");


  /* --------------------------------------------------------
     Validate actual calendar date
  -------------------------------------------------------- */

  const date =
    new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    throw new Error(
      "Invalid date"
    );

  }


  if (
    date.getFullYear() !==
      Number(year) ||

    date.getMonth() !==
      Number(month) - 1 ||

    date.getDate() !==
      Number(day)
  ) {

    throw new Error(
      "Invalid date"
    );

  }


  /* --------------------------------------------------------
     Return dynamic day table
  -------------------------------------------------------- */

  return `day_${day}${month}${year}`;

}


/* ==========================================================
   GET COLLECTION POINT MONITORING
========================================================== */

async function getCollectionPointMonitoring({

  wardNo,

  date,

}) {

  /* ========================================================
     1. VALIDATE WARD
  ======================================================== */

  const parsedWardNo =
    Number(
      wardNo
    );


  if (
    !Number.isInteger(
      parsedWardNo
    )
  ) {

    throw new Error(
      "Invalid ward number"
    );

  }


  /* ========================================================
     2. BUILD DAY TABLE
  ======================================================== */

  const dayTableName =
    buildDayTableName(
      date
    );


  validateTableName(
    dayTableName
  );


  console.log("");

  console.log(
    "================================================"
  );

  console.log(
    "📍 COLLECTION POINT MONITORING"
  );

  console.log(
    "Ward:",
    parsedWardNo
  );

  console.log(
    "Date:",
    date
  );

  console.log(
    "Day table:",
    dayTableName
  );

  console.log(
    "================================================"
  );


  /* ========================================================
     3. GET VEHICLES FROM DAY TABLE
  ======================================================== */

  let registeredVehicles;


  try {

    registeredVehicles =
      await telemetryDb.$queryRawUnsafe(

        `
        SELECT
          vehicle_number,
          vehicle_table_name,
          ward_no,
          created_at

        FROM "${dayTableName}"

        WHERE ward_no = $1

        ORDER BY vehicle_number ASC;
        `,

        parsedWardNo

      );

  } catch (error) {

    /* ------------------------------------------------------
       DAY TABLE DOES NOT EXIST
    ------------------------------------------------------ */

    if (
      error.code === "42P01"
    ) {

      console.warn(
        `⚠️ Table ${dayTableName} does not exist`
      );


      return {

        ward_id:
          parsedWardNo,

        date:
          dayTableName,

        vehicle_count:
          0,

        point_count:
          0,

        vehicles:
          {},

      };

    }


    throw error;

  }


  console.log(
    "🚛 Vehicles found:",
    registeredVehicles.length
  );


  /* ========================================================
     4. RESPONSE OBJECT
  ======================================================== */

  const vehicles =
    {};


  let totalPointCount =
    0;


  /* ========================================================
     5. LOOP THROUGH REGISTERED VEHICLES
  ======================================================== */

  for (
    const vehicle
    of registeredVehicles
  ) {

    const vehicleNumber =
      vehicle.vehicle_number;


    const vehicleTableName =
      vehicle.vehicle_table_name;


    console.log("");

    console.log(
      "🚛 Vehicle:",
      vehicleNumber
    );

    console.log(
      "   Table:",
      vehicleTableName
    );


    /* ======================================================
       6. VALIDATE VEHICLE TABLE
    ====================================================== */

    try {

      validateTableName(
        vehicleTableName
      );

    } catch (error) {

      console.error(
        `❌ Invalid vehicle table: ${vehicleTableName}`
      );


      vehicles[
        vehicleNumber
      ] = {

        vehicle_number:
          vehicleNumber,

        vehicle_table_name:
          vehicleTableName,

        ward_no:
          vehicle.ward_no,

        registered_at:
          makeJsonSafe(
            vehicle.created_at
          ),

        point_count:
          0,

        points:
          [],

      };


      continue;

    }


    /* ======================================================
       7. GET TELEMETRY DATA
    ====================================================== */

    let telemetryRows;


    try {

      /*
       * SELECT *
       *
       * We intentionally retrieve the COMPLETE row.
       *
       * This means the frontend will have access to:
       *
       * id
       * iotTimestamp
       * receivedTimestamp
       * rfidEpc
       * citizenId
       * wasteType
       * latitude
       * longitude
       * wetWeight
       * dryWeight
       * otherWeight
       * cumulativeWeight
       * driverName
       * vehicleNumber
       * firmwareVersion
       * unitNumber
       * collectionType
       * remarks
       * errorCode
       * citizenContact
       * driverAction
       * created_at
       *
       * and any additional columns present in the table.
       */

      telemetryRows =
        await telemetryDb.$queryRawUnsafe(

          `
          SELECT *

          FROM "${vehicleTableName}"

          WHERE latitude IS NOT NULL

            AND longitude IS NOT NULL

          ORDER BY id ASC;
          `

        );

    } catch (error) {

      /* ----------------------------------------------------
         VEHICLE TABLE DOES NOT EXIST
      ---------------------------------------------------- */

      if (
        error.code === "42P01"
      ) {

        console.warn(
          `⚠️ Vehicle table ${vehicleTableName} does not exist`
        );


        vehicles[
          vehicleNumber
        ] = {

          vehicle_number:
            vehicleNumber,

          vehicle_table_name:
            vehicleTableName,

          ward_no:
            vehicle.ward_no,

          registered_at:
            makeJsonSafe(
              vehicle.created_at
            ),

          point_count:
            0,

          points:
            [],

        };


        continue;

      }


      throw error;

    }


    /* ======================================================
       8. TRANSFORM TELEMETRY ROWS
    ====================================================== */

    const points =
      telemetryRows
        .map(
          (row) => {

            /* ------------------------------------------------
               Convert coordinates
            ------------------------------------------------ */

            const latitude =
              Number(
                row.latitude
              );


            const longitude =
              Number(
                row.longitude
              );


            /* ------------------------------------------------
               Validate coordinates
            ------------------------------------------------ */

            if (
              !Number.isFinite(
                latitude
              ) ||

              !Number.isFinite(
                longitude
              )
            ) {

              return null;

            }


            /* ------------------------------------------------
               COMPLETE JSON-SAFE DATA
            ------------------------------------------------ */

            const safeData =
              makeJsonSafe(
                row
              );


            /* ------------------------------------------------
               MAP POINT
            ------------------------------------------------ */

            return {

              latitude,

              longitude,

              data:
                safeData,

            };

          }
        )
        .filter(
          Boolean
        );


    /* ======================================================
       9. UPDATE TOTAL POINT COUNT
    ====================================================== */

    totalPointCount +=
      points.length;


    /* ======================================================
       10. STORE VEHICLE
    ====================================================== */

    vehicles[
      vehicleNumber
    ] = {

      vehicle_number:
        vehicleNumber,

      vehicle_table_name:
        vehicleTableName,

      ward_no:
        vehicle.ward_no,

      registered_at:
        makeJsonSafe(
          vehicle.created_at
        ),

      point_count:
        points.length,

      points,

    };


    console.log(
      `   📍 GPS points: ${points.length}`
    );

  }


  /* ========================================================
     11. FINAL RESPONSE
  ======================================================== */

  const response = {

    ward_id:
      parsedWardNo,

    date:
      dayTableName,

    vehicle_count:
      Object.keys(
        vehicles
      ).length,

    point_count:
      totalPointCount,

    vehicles,

  };


  /* ========================================================
     12. FINAL SAFETY PASS
  ======================================================== */

  /*
   * This guarantees that absolutely nothing containing
   * BigInt/Date/Decimal-like values can escape into
   * Express's JSON.stringify().
   */

  const safeResponse =
    makeJsonSafe(
      response
    );


  /* ========================================================
     13. LOG RESULT
  ======================================================== */

  console.log("");

  console.log(
    "================================================"
  );

  console.log(
    "✅ COLLECTION POINT MONITORING COMPLETE"
  );

  console.log(
    "Ward:",
    parsedWardNo
  );

  console.log(
    "Vehicles:",
    safeResponse.vehicle_count
  );

  console.log(
    "GPS Points:",
    safeResponse.point_count
  );

  console.log(
    "================================================"
  );

  console.log("");


  return safeResponse;

}


/* ==========================================================
   EXPORT
========================================================== */

module.exports = {

  getCollectionPointMonitoring,

};