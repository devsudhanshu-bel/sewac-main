const telemetryDb =
  require("../config/telemetryDb");


// =====================================================
// TELEMETRY DAILY REPOSITORY
// =====================================================
//
// Reads the daily telemetry hierarchy:
//
// day_DDMMYYYY
//      ↓
// vehicle_number
// vehicle_table_name
//      ↓
// vehicle daily telemetry table
//
// IMPORTANT:
//
// PostgreSQL automatically lowercases unquoted column
// names.
//
// Therefore the physical telemetry columns are:
//
// iottimestamp
// receivedtimestamp
// rfidepc
// citizenid
// wastetype
// latitude
// longitude
// wetweight
// dryweight
// otherweight
// cumulativeweight
// drivername
// vehiclenumber
// firmwareversion
// unitnumber
// collectiontype
// remarks
// errorcode
// citizencontact
// driveraction
//
// We alias them back to camelCase so the rest of the
// application receives:
//
// iotTimestamp
// receivedTimestamp
// rfidEpc
// citizenId
// wasteType
// wetWeight
// dryWeight
// otherWeight
// cumulativeWeight
// driverName
// vehicleNumber
// firmwareVersion
// unitNumber
// collectionType
// errorCode
// citizenContact
// driverAction
//
// =====================================================


class TelemetryDailyRepository {


  // ===================================================
  // SAFE TABLE NAME VALIDATOR
  // ===================================================

  validateTableName(
    tableName
  ) {

    if (
      typeof tableName !== "string"
    ) {

      throw new Error(
        `Invalid table name: ${tableName}`
      );

    }


    if (
      !/^[a-zA-Z0-9_]+$/.test(
        tableName
      )
    ) {

      throw new Error(
        `Unsafe table name: ${tableName}`
      );

    }


    return tableName;

  }


  // ===================================================
  // NORMALIZE DATE
  // ===================================================

  normalizeDate(
    processingDate
  ) {

    // -----------------------------------------------
    // STRING
    // -----------------------------------------------

    if (
      typeof processingDate === "string"
    ) {

      const value =
        processingDate.trim();


      // YYYY-MM-DD

      if (
        /^\d{4}-\d{2}-\d{2}$/.test(
          value
        )
      ) {

        const [
          year,
          month,
          day
        ] =
          value.split("-")
            .map(Number);


        return new Date(
          year,
          month - 1,
          day
        );

      }

    }


    // -----------------------------------------------
    // DATE
    // -----------------------------------------------

    if (
      processingDate instanceof Date
    ) {

      if (
        Number.isNaN(
          processingDate.getTime()
        )
      ) {

        throw new Error(
          "Invalid processing date"
        );

      }


      return processingDate;

    }


    throw new Error(
      `Invalid processing date: ${processingDate}`
    );

  }


  // ===================================================
  // DAY TABLE NAME
  // ===================================================

  getDayTableName(
    processingDate
  ) {

    const date =
      this.normalizeDate(
        processingDate
      );


    const dd =
      String(
        date.getDate()
      ).padStart(
        2,
        "0"
      );


    const mm =
      String(
        date.getMonth() + 1
      ).padStart(
        2,
        "0"
      );


    const yyyy =
      date.getFullYear();


    return `day_${dd}${mm}${yyyy}`;

  }


  // ===================================================
  // CHECK DAY TABLE
  // ===================================================

  async dayTableExists(
    processingDate
  ) {

    const tableName =
      this.validateTableName(
        this.getDayTableName(
          processingDate
        )
      );


    const result =
      await telemetryDb
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


    return {

      tableName,

      exists:
        result[0]?.exists === true,

    };

  }


  // ===================================================
  // GET VEHICLES FROM DAY TABLE
  // ===================================================

  async getVehiclesFromDayTable(
    processingDate
  ) {

    const tableInfo =
      await this.dayTableExists(
        processingDate
      );


    if (
      !tableInfo.exists
    ) {

      return [];

    }


    const tableName =
      this.validateTableName(
        tableInfo.tableName
      );


    const vehicles =
      await telemetryDb
        .$queryRawUnsafe(
          `
          SELECT

            vehicle_number,

            vehicle_table_name,

            created_at

          FROM "${tableName}"

          ORDER BY
            vehicle_number ASC
          `
        );


    return vehicles;

  }


  // ===================================================
  // ALIAS TELEMETRY COLUMNS
  // ===================================================
  //
  // VERY IMPORTANT:
  //
  // Physical PostgreSQL columns are lowercase because
  // the CREATE TABLE query did not quote camelCase names.
  //
  // We therefore read:
  //
  // iottimestamp
  //
  // and return:
  //
  // "iotTimestamp"
  //
  // ===================================================

  getTelemetrySelectColumns() {

    return `
      id,

      iottimestamp AS "iotTimestamp",

      receivedtimestamp AS "receivedTimestamp",

      rfidepc AS "rfidEpc",

      citizenid AS "citizenId",

      wastetype AS "wasteType",

      latitude,

      longitude,

      wetweight AS "wetWeight",

      dryweight AS "dryWeight",

      otherweight AS "otherWeight",

      cumulativeweight AS "cumulativeWeight",

      drivername AS "driverName",

      vehiclenumber AS "vehicleNumber",

      firmwareversion AS "firmwareVersion",

      unitnumber AS "unitNumber",

      collectiontype AS "collectionType",

      remarks,

      errorcode AS "errorCode",

      citizencontact AS "citizenContact",

      driveraction AS "driverAction",

      created_at
    `;

  }


  // ===================================================
  // CHECK VEHICLE TABLE
  // ===================================================

  async vehicleTableExists(
    vehicleTableName
  ) {

    const safeTableName =
      this.validateTableName(
        vehicleTableName
      );


    const result =
      await telemetryDb
        .$queryRawUnsafe(
          `
          SELECT EXISTS (
            SELECT 1

            FROM information_schema.tables

            WHERE table_schema = 'public'

            AND table_name = $1
          ) AS exists
          `,
          safeTableName
        );


    return (
      result[0]?.exists === true
    );

  }


  // ===================================================
  // GET TELEMETRY COUNT
  // ===================================================

  async getTelemetryCount(
    vehicleTableName
  ) {

    const safeTableName =
      this.validateTableName(
        vehicleTableName
      );


    const exists =
      await this.vehicleTableExists(
        safeTableName
      );


    if (
      !exists
    ) {

      return 0;

    }


    const result =
      await telemetryDb
        .$queryRawUnsafe(
          `
          SELECT
            COUNT(*) AS count

          FROM "${safeTableName}"
          `
        );


    return Number(
      result[0]?.count || 0
    );

  }


  // ===================================================
  // GET ALL TELEMETRY RECORDS
  // ===================================================

  async getTelemetryRecords(
    vehicleTableName
  ) {

    const safeTableName =
      this.validateTableName(
        vehicleTableName
      );


    const exists =
      await this.vehicleTableExists(
        safeTableName
      );


    if (
      !exists
    ) {

      return [];

    }


    const records =
      await telemetryDb
        .$queryRawUnsafe(
          `
          SELECT

            ${this.getTelemetrySelectColumns()}

          FROM "${safeTableName}"

          ORDER BY
            id ASC
          `
        );


    return records;

  }


  // ===================================================
  // GET FIRST TELEMETRY RECORD
  // ===================================================

  async getFirstTelemetryRecord(
    vehicleTableName
  ) {

    const safeTableName =
      this.validateTableName(
        vehicleTableName
      );


    const exists =
      await this.vehicleTableExists(
        safeTableName
      );


    if (
      !exists
    ) {

      return null;

    }


    const records =
      await telemetryDb
        .$queryRawUnsafe(
          `
          SELECT

            ${this.getTelemetrySelectColumns()}

          FROM "${safeTableName}"

          ORDER BY
            id ASC

          LIMIT 1
          `
        );


    return records[0] || null;

  }


  // ===================================================
  // GET TELEMETRY BATCH
  // ===================================================

  async getTelemetryBatch(
    vehicleTableName,
    offset = 0,
    limit = 100
  ) {

    const safeTableName =
      this.validateTableName(
        vehicleTableName
      );


    const exists =
      await this.vehicleTableExists(
        safeTableName
      );


    if (
      !exists
    ) {

      return [];

    }


    const safeOffset =
      Math.max(
        0,
        Number(offset) || 0
      );


    const safeLimit =
      Math.max(
        1,
        Math.min(
          Number(limit) || 100,
          1000
        )
      );


    const records =
      await telemetryDb
        .$queryRawUnsafe(
          `
          SELECT

            ${this.getTelemetrySelectColumns()}

          FROM "${safeTableName}"

          ORDER BY
            id ASC

          LIMIT ${safeLimit}

          OFFSET ${safeOffset}
          `
        );


    return records;

  }


  // ===================================================
  // GET DAY SNAPSHOT
  // ===================================================

  async getDaySnapshot(
    processingDate
  ) {

    const tableInfo =
      await this.dayTableExists(
        processingDate
      );


    if (
      !tableInfo.exists
    ) {

      return {

        dayTableName:
          tableInfo.tableName,

        dayTableExists:
          false,

        vehicles: [],

      };

    }


    const vehicles =
      await this.getVehiclesFromDayTable(
        processingDate
      );


    return {

      dayTableName:
        tableInfo.tableName,

      dayTableExists:
        true,

      vehicles,

    };

  }


}


// =====================================================
// EXPORT
// =====================================================

module.exports =
  new TelemetryDailyRepository();