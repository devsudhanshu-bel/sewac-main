const citizenHistoricalPrisma = require(
  "../config/citizenHistoricalPrisma"
);


// ==========================================================
// MONTH NAMES
// ==========================================================

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


// ==========================================================
// BASIC HELPERS
// ==========================================================

const pad = (value) =>
  String(value).padStart(2, "0");


// ==========================================================
// SQL IDENTIFIER VALIDATION
// ==========================================================
//
// Table names cannot be passed as normal SQL parameters.
//
// Therefore every dynamic table name must be validated
// before being inserted into SQL.
//
// ==========================================================

function assertSafeIdentifier(
  value
) {

  if (
    typeof value !== "string" ||
    !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(
      value
    )
  ) {

    throw new Error(
      `Invalid SQL identifier: ${value}`
    );
  }

  return `"${value}"`;
}


// ==========================================================
// GET DATE PARTS
// ==========================================================

function getDateParts(
  date
) {

  const year =
    date.getFullYear();

  const monthNumber =
    date.getMonth() + 1;

  const month =
    pad(monthNumber);

  const day =
    pad(
      date.getDate()
    );

  return {

    year,

    monthNumber,

    month,

    day,

  };
}


// ==========================================================
// GET ISO WEEK NUMBER
// ==========================================================

function getISOWeek(
  date
) {

  const temp =
    new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )
    );

  const dayNumber =
    temp.getUTCDay() || 7;

  temp.setUTCDate(
    temp.getUTCDate() +
    4 -
    dayNumber
  );

  const yearStart =
    new Date(
      Date.UTC(
        temp.getUTCFullYear(),
        0,
        1
      )
    );

  return Math.ceil(
    (
      (
        temp - yearStart
      ) /
      86400000 +
      1
    ) /
    7
  );
}


// ==========================================================
// GET DAILY TABLE NAME
// ==========================================================
//
// IMPORTANT:
//
// YOUR ACTUAL FORMAT:
//
// day_14082026
//
// DDMMYYYY
//
// ==========================================================

function getDayTableName(
  date
) {

  const {
    year,
    month,
    day,
  } =
    getDateParts(
      date
    );

  return (
    `day_${day}${month}${year}`
  );
}


// ==========================================================
// GET HISTORICAL YEAR TABLE
// ==========================================================
//
// Example:
//
// ward_174_2026
//
// ==========================================================

function getYearTableName(
  wardNo,
  year
) {

  return (
    `ward_${wardNo}_${year}`
  );
}


// ==========================================================
// GET HISTORICAL MONTH TABLE
// ==========================================================
//
// Example:
//
// ward_174_082026
//
// ==========================================================

function getMonthTableName(
  wardNo,
  monthNumber,
  year
) {

  const month =
    pad(monthNumber);

  return (
    `ward_${wardNo}_${month}${year}`
  );
}


// ==========================================================
// CHECK TABLE EXISTS
// ==========================================================

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

        ) AS exists;
        `,
        tableName
      );

  return (
    result[0]?.exists === true
  );
}


// ==========================================================
// CREATE YEAR INDEX TABLE
// ==========================================================
//
// Example:
//
// ward_174_2026
//
// This table stores the monthly table references.
//
// ==========================================================

async function createYearTable(
  tableName
) {

  await citizenHistoricalPrisma
    .$executeRawUnsafe(
      `
      CREATE TABLE IF NOT EXISTS
      ${assertSafeIdentifier(
        tableName
      )}
      (

        month_number INTEGER PRIMARY KEY,

        month_name VARCHAR(20) NOT NULL,

        month_table_name VARCHAR(100) NOT NULL,

        created_at
          TIMESTAMP DEFAULT CURRENT_TIMESTAMP

      );
      `
    );
}


// ==========================================================
// CREATE MONTH HISTORICAL TABLE
// ==========================================================
//
// Example:
//
// ward_174_082026
//
// This table stores the historical telemetry.
//
// ==========================================================

async function createMonthTable(
  tableName
) {

  await citizenHistoricalPrisma
    .$executeRawUnsafe(
      `
      CREATE TABLE IF NOT EXISTS
      ${assertSafeIdentifier(
        tableName
      )}
      (

        historical_id BIGSERIAL PRIMARY KEY,

        source_telemetry_id BIGINT NOT NULL,

        source_vehicle_table
          VARCHAR(150) NOT NULL,

        vehicle_number
          VARCHAR(50),

        ward_no
          INTEGER NOT NULL,

        iot_timestamp
          TIMESTAMP,

        received_timestamp
          TIMESTAMP,

        rfid_epc
          VARCHAR(100),

        citizen_id
          INTEGER,

        waste_type
          VARCHAR(50),

        latitude
          DECIMAL(10,7),

        longitude
          DECIMAL(10,7),

        wet_weight
          DECIMAL(12,3),

        dry_weight
          DECIMAL(12,3),

        other_weight
          DECIMAL(12,3),

        cumulative_weight
          DECIMAL(12,3),

        driver_name
          VARCHAR(150),

        firmware_version
          VARCHAR(100),

        unit_number
          VARCHAR(100),

        collection_type
          VARCHAR(100),

        remarks
          TEXT,

        error_code
          VARCHAR(100),

        citizen_contact
          VARCHAR(50),

        driver_action
          VARCHAR(100),

        source_day_table
          VARCHAR(100),

        archived_at
          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        UNIQUE (
          source_vehicle_table,
          source_telemetry_id
        )

      );
      `
    );
}


// ==========================================================
// REGISTER MONTH INSIDE YEAR
// ==========================================================

async function registerMonthInYear(
  yearTableName,
  monthNumber,
  monthName,
  monthTableName
) {

  await citizenHistoricalPrisma
    .$executeRawUnsafe(
      `
      INSERT INTO
      ${assertSafeIdentifier(
        yearTableName
      )}
      (

        month_number,

        month_name,

        month_table_name

      )

      VALUES (

        $1,

        $2,

        $3

      )

      ON CONFLICT (
        month_number
      )

      DO UPDATE SET

        month_name =
          EXCLUDED.month_name,

        month_table_name =
          EXCLUDED.month_table_name;
      `,
      monthNumber,
      monthName,
      monthTableName
    );
}


// ==========================================================
// GET VEHICLES FROM DAILY TABLE
// ==========================================================
//
// IMPORTANT:
//
// ward_no comes DIRECTLY from the daily table.
//
// No GPS lookup.
// No city lookup.
// No zone lookup.
// No division lookup.
//
// ==========================================================

async function getVehiclesFromDayTable(
  dayTableName
) {

  const exists =
    await tableExists(
      dayTableName
    );

  if (!exists) {

    return {

      exists: false,

      vehicles: [],

    };
  }


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
            dayTableName
          )}

        ORDER BY
          vehicle_number ASC;
        `
      );


  return {

    exists: true,

    vehicles,

  };
}


// ==========================================================
// GET VEHICLE TELEMETRY
// ==========================================================

async function getVehicleTelemetry(
  vehicleTableName
) {

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


  const records =
    await citizenHistoricalPrisma
      .$queryRawUnsafe(
        `
        SELECT *

        FROM
          ${assertSafeIdentifier(
            vehicleTableName
          )}

        ORDER BY
          id ASC;
        `
      );


  return {

    exists: true,

    records,

  };
}


// ==========================================================
// INSERT HISTORICAL RECORD
// ==========================================================

async function insertHistoricalRecord(
  tableName,
  record
) {

  const result =
    await citizenHistoricalPrisma
      .$queryRawUnsafe(
        `
        INSERT INTO
        ${assertSafeIdentifier(
          tableName
        )}
        (

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

          driver_action,

          source_day_table

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

          $23,

          $24

        )

        ON CONFLICT (

          source_vehicle_table,

          source_telemetry_id

        )

        DO NOTHING

        RETURNING historical_id;
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

        record.driverAction,

        record.sourceDayTable

      );


  return {

    inserted:
      result.length > 0,

    historicalId:
      result[0]?.historical_id ??
      null,

  };
}


// ==========================================================
// ARCHIVE DATE
// ==========================================================
//
// THIS IS THE CORE FUNCTION.
//
// Both:
//
// /archive
//
// and:
//
// /archive-today
//
// eventually use this function.
//
// ==========================================================

async function archiveDate(
  processingDate
) {

  const {
    year,
    monthNumber,
    month,
    day,
  } =
    getDateParts(
      processingDate
    );


  const monthName =
    MONTH_NAMES[
      monthNumber - 1
    ];


  const weekNumber =
    getISOWeek(
      processingDate
    );


  // ========================================================
  // SOURCE DAY TABLE
  // ========================================================
  //
  // Example:
  //
  // day_14082026
  //
  // ========================================================

  const dayTableName =
    getDayTableName(
      processingDate
    );


  // ========================================================
  // GET VEHICLES
  // ========================================================

  const dayResult =
    await getVehiclesFromDayTable(
      dayTableName
    );


  if (
    !dayResult.exists
  ) {

    return {

      archived: false,

      reason:
        "DAY_TABLE_NOT_FOUND",

      date:
        `${year}-${month}-${day}`,

      dayTable:
        dayTableName,

      archivedVehicles:
        0,

      archivedRecords:
        0,

    };
  }


  if (
    dayResult.vehicles.length === 0
  ) {

    return {

      archived: false,

      reason:
        "NO_VEHICLES_IN_DAY_TABLE",

      date:
        `${year}-${month}-${day}`,

      dayTable:
        dayTableName,

      archivedVehicles:
        0,

      archivedRecords:
        0,

    };
  }


  // ========================================================
  // VEHICLE RESULTS
  // ========================================================

  const vehicleResults = [];

  let archivedVehicles =
    0;

  let archivedRecords =
    0;


  // ========================================================
  // PROCESS EACH VEHICLE
  // ========================================================

  for (
    const vehicle
    of dayResult.vehicles
  ) {

    const vehicleNumber =
      vehicle.vehicle_number;

    const vehicleTableName =
      vehicle.vehicle_table_name;

    const wardNo =
      Number(
        vehicle.ward_no
      );


    // ------------------------------------------------------
    // VALIDATE VEHICLE TABLE
    // ------------------------------------------------------

    if (
      !vehicleTableName
    ) {

      vehicleResults.push({

        vehicleNumber,

        wardNo,

        archived: false,

        reason:
          "MISSING_VEHICLE_TABLE_NAME",

      });

      continue;
    }


    // ------------------------------------------------------
    // VALIDATE WARD
    // ------------------------------------------------------

    if (
      !Number.isInteger(
        wardNo
      )
    ) {

      vehicleResults.push({

        vehicleNumber,

        vehicleTableName,

        archived: false,

        reason:
          "INVALID_WARD_NO",

      });

      continue;
    }


    // ======================================================
    // HISTORICAL TABLE NAMES
    // ======================================================

    const yearTableName =
      getYearTableName(
        wardNo,
        year
      );


    const monthTableName =
      getMonthTableName(
        wardNo,
        monthNumber,
        year
      );


    // ======================================================
    // CREATE YEAR TABLE
    // ======================================================

    const yearAlreadyExists =
      await tableExists(
        yearTableName
      );


    if (
      !yearAlreadyExists
    ) {

      await createYearTable(
        yearTableName
      );
    }


    // ======================================================
    // CREATE MONTH TABLE
    // ======================================================

    const monthAlreadyExists =
      await tableExists(
        monthTableName
      );


    if (
      !monthAlreadyExists
    ) {

      await createMonthTable(
        monthTableName
      );
    }


    // ======================================================
    // REGISTER MONTH
    // ======================================================

    await registerMonthInYear(

      yearTableName,

      monthNumber,

      monthName,

      monthTableName

    );


    // ======================================================
    // GET TELEMETRY
    // ======================================================

    const telemetryResult =
      await getVehicleTelemetry(
        vehicleTableName
      );


    if (
      !telemetryResult.exists
    ) {

      vehicleResults.push({

        vehicleNumber,

        vehicleTableName,

        wardNo,

        yearTableName,

        monthTableName,

        archived: false,

        reason:
          "VEHICLE_TABLE_NOT_FOUND",

      });

      continue;
    }


    // ======================================================
    // INSERT TELEMETRY
    // ======================================================

    let inserted =
      0;

    let duplicates =
      0;


    for (
      const record
      of telemetryResult.records
    ) {

      const result =
        await insertHistoricalRecord(

          monthTableName,

          {

            sourceTelemetryId:
              Number(
                record.id
              ),

            sourceVehicleTable:
              vehicleTableName,

            vehicleNumber:
              record.vehiclenumber ??
              record.vehicleNumber ??
              vehicleNumber,

            wardNo,

            iotTimestamp:
              record.iottimestamp ??
              record.iotTimestamp ??
              null,

            receivedTimestamp:
              record.receivedtimestamp ??
              record.receivedTimestamp ??
              null,

            rfidEpc:
              record.rfidepc ??
              record.rfidEpc ??
              null,

            citizenId:
              record.citizenid ??
              record.citizenId ??
              null,

            wasteType:
              record.wastetype ??
              record.wasteType ??
              null,

            latitude:
              record.latitude ??
              null,

            longitude:
              record.longitude ??
              null,

            wetWeight:
              record.wetweight ??
              record.wetWeight ??
              null,

            dryWeight:
              record.dryweight ??
              record.dryWeight ??
              null,

            otherWeight:
              record.otherweight ??
              record.otherWeight ??
              null,

            cumulativeWeight:
              record.cumulativeweight ??
              record.cumulativeWeight ??
              null,

            driverName:
              record.drivername ??
              record.driverName ??
              null,

            firmwareVersion:
              record.firmwareversion ??
              record.firmwareVersion ??
              null,

            unitNumber:
              record.unitnumber ??
              record.unitNumber ??
              null,

            collectionType:
              record.collectiontype ??
              record.collectionType ??
              null,

            remarks:
              record.remarks ??
              null,

            errorCode:
              record.errorcode ??
              record.errorCode ??
              null,

            citizenContact:
              record.citizencontact ??
              record.citizenContact ??
              null,

            driverAction:
              record.driveraction ??
              record.driverAction ??
              null,

            sourceDayTable:
              dayTableName,

          }
        );


      if (
        result.inserted
      ) {

        inserted++;

      } else {

        duplicates++;

      }

    }


    // ======================================================
    // UPDATE TOTALS
    // ======================================================

    archivedVehicles++;

    archivedRecords +=
      inserted;


    // ======================================================
    // VEHICLE RESULT
    // ======================================================

    vehicleResults.push({

      vehicleNumber,

      wardNo,

      sourceTable:
        vehicleTableName,

      sourceDayTable:
        dayTableName,

      yearTable:
        yearTableName,

      monthTable:
        monthTableName,

      sourceRecords:
        telemetryResult.records.length,

      inserted,

      duplicates,

      archived: true,

    });

  }


  // ========================================================
  // FINAL RESULT
  // ========================================================

  return {

    archived: true,

    date:
      `${year}-${month}-${day}`,

    dayTable:
      dayTableName,

    year,

    month:
      monthNumber,

    monthName,

    week:
      weekNumber,

    archivedVehicles,

    archivedRecords,

    vehicleResults,

  };
}


// ==========================================================
// CONTROLLER — ARCHIVE TODAY
// ==========================================================
//
// POST
//
// /api/historical-database/archive-today
//
// ==========================================================

async function archiveToday(
  req,
  res
) {

  try {

    const result =
      await archiveDate(
        new Date()
      );


    if (
      result.reason ===
      "DAY_TABLE_NOT_FOUND"
    ) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            `Day table '${result.dayTable}' does not exist.`,

          ...result,

        });
    }


    return res
      .status(200)
      .json({

        success: true,

        message:
          "Today's telemetry archived successfully.",

        data:
          result,

      });

  } catch (
    error
  ) {

    console.error(
      "❌ Historical archive-today error:",
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

      });
  }
}


// ==========================================================
// CONTROLLER — ARCHIVE SPECIFIC DATE
// ==========================================================
//
// POST
//
// /api/historical-database/archive
//
// Body:
//
// {
//   "date": "2026-08-13"
// }
//
// ==========================================================

async function archiveSpecificDate(
  req,
  res
) {

  try {

    const {
      date
    } =
      req.body || {};


    // ======================================================
    // VALIDATE DATE
    // ======================================================

    if (!date) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            "date is required.",

        });
    }


    if (
      typeof date !==
        "string" ||
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


    // ======================================================
    // CREATE LOCAL DATE
    // ======================================================

    const [
      yearString,
      monthString,
      dayString,
    ] =
      date.split("-");


    const requestedDate =
      new Date(
        Number(yearString),
        Number(monthString) - 1,
        Number(dayString)
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


    // ======================================================
    // ARCHIVE
    // ======================================================

    const result =
      await archiveDate(
        requestedDate
      );


    // ======================================================
    // DAY TABLE NOT FOUND
    // ======================================================

    if (
      result.reason ===
      "DAY_TABLE_NOT_FOUND"
    ) {

      return res
        .status(404)
        .json({

          success: false,

          message:
            `Day table '${result.dayTable}' does not exist.`,

          ...result,

        });
    }


    // ======================================================
    // SUCCESS
    // ======================================================

    return res
      .status(200)
      .json({

        success: true,

        message:
          "Historical telemetry archived successfully.",

        data:
          result,

      });

  } catch (
    error
  ) {

    console.error(
      "❌ Historical archive error:",
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
}


// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {

  archiveToday,

  archiveDate:
    archiveSpecificDate,

};