const citizenHistoricalPrisma =
  require("../config/citizenHistoricalPrisma");

// =====================================================
// CITIZEN HISTORICAL REPOSITORY
// =====================================================
//
// Historical database structure:
//
// YEARLY TABLE
//     ward_101_2026
//
//     -> INDEX ONLY
//     -> points to monthly tables
//
// MONTHLY TABLE
//     ward_101_082026
//
//     -> ACTUAL TELEMETRY DATA
//
// =====================================================

class CitizenHistoricalRepository {

  // ===================================================
  // GET YEARLY TABLE NAME
  // ===================================================

  getYearlyTableName(
    wardNo,
    date = new Date()
  ) {

    const year =
      date.getFullYear();

    return `ward_${wardNo}_${year}`;
  }


  // ===================================================
  // GET MONTHLY TABLE NAME
  // ===================================================

  getMonthlyTableName(
    wardNo,
    date = new Date()
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


  // ===================================================
  // GET MONTH NUMBER
  // ===================================================

  getMonthNumber(
    date
  ) {

    return (
      date.getMonth() + 1
    );
  }


  // ===================================================
  // GET MONTH NAME
  // ===================================================

  getMonthName(
    date
  ) {

    const months = [

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
      "December"

    ];

    return months[
      date.getMonth()
    ];
  }


  // ===================================================
  // CHECK TABLE EXISTS
  // ===================================================

  async tableExists(
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

    return Boolean(
      result[0]?.exists
    );
  }


  // ===================================================
  // ENSURE MONTHLY INDEXES
  // ===================================================
  //
  // These indexes belong to the ACTUAL telemetry
  // table.
  //
  // Example:
  //
  // ward_101_082026
  //
  // ===================================================

  async ensureMonthlyIndexes(
    tableName
  ) {

    const safeTableName =
      `"${tableName}"`;


    // RFID

    await citizenHistoricalPrisma
      .$executeRawUnsafe(
        `
        CREATE INDEX IF NOT EXISTS
        "${tableName}_rfid_idx"
        ON ${safeTableName}
        (rfid_epc)
        `
      );


    // Citizen

    await citizenHistoricalPrisma
      .$executeRawUnsafe(
        `
        CREATE INDEX IF NOT EXISTS
        "${tableName}_citizen_idx"
        ON ${safeTableName}
        (citizen_id)
        `
      );


    // Vehicle

    await citizenHistoricalPrisma
      .$executeRawUnsafe(
        `
        CREATE INDEX IF NOT EXISTS
        "${tableName}_vehicle_idx"
        ON ${safeTableName}
        (vehicle_number)
        `
      );


    // Timestamp

    await citizenHistoricalPrisma
      .$executeRawUnsafe(
        `
        CREATE INDEX IF NOT EXISTS
        "${tableName}_timestamp_idx"
        ON ${safeTableName}
        (iot_timestamp)
        `
      );
  }


  // ===================================================
  // UPDATE YEARLY MONTH INDEX
  // ===================================================
  //
  // YEARLY TABLE IS ONLY AN INDEX.
  //
  // Example:
  //
  // ward_101_2026
  //
  // August
  //     ↓
  // ward_101_082026
  //
  // ===================================================

  async updateYearlyMonthIndex(
    yearlyTableName,
    monthlyTableName,
    date
  ) {

    const monthNumber =
      this.getMonthNumber(
        date
      );

    const monthName =
      this.getMonthName(
        date
      );


    // -------------------------------------------------
    // READ ACTUAL MONTHLY TABLE STATISTICS
    // -------------------------------------------------

    const monthlyStats =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          SELECT
            COUNT(*)::BIGINT AS record_count,
            MIN(iot_timestamp) AS first_record_at,
            MAX(iot_timestamp) AS last_record_at
          FROM "${monthlyTableName}"
          `
        );


    const stats =
      monthlyStats[0] || {};


    const recordCount =
      Number(
        stats.record_count || 0
      );


    const firstRecordAt =
      stats.first_record_at ||
      null;


    const lastRecordAt =
      stats.last_record_at ||
      null;


    // -------------------------------------------------
    // CHECK EXISTING MONTH INDEX
    // -------------------------------------------------

    const existing =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          SELECT
            id
          FROM "${yearlyTableName}"
          WHERE month_number = $1
          LIMIT 1
          `,
          monthNumber
        );


    // -------------------------------------------------
    // UPDATE EXISTING INDEX
    // -------------------------------------------------

    if (
      existing.length > 0
    ) {

      const updated =
        await citizenHistoricalPrisma
          .$queryRawUnsafe(
            `
            UPDATE "${yearlyTableName}"
            SET
              month_name = $1,
              table_name = $2,
              record_count = $3,
              first_record_at = $4,
              last_record_at = $5,
              updated_at = NOW()
            WHERE id = $6
            RETURNING *
            `,

            monthName,
            monthlyTableName,
            recordCount,
            firstRecordAt,
            lastRecordAt,
            existing[0].id
          );


      return updated[0] || null;
    }


    // -------------------------------------------------
    // INSERT NEW INDEX
    // -------------------------------------------------

    const inserted =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          INSERT INTO "${yearlyTableName}"
          (
            month_number,
            month_name,
            table_name,
            record_count,
            first_record_at,
            last_record_at,
            created_at,
            updated_at
          )
          VALUES
          (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            NOW(),
            NOW()
          )
          RETURNING *
          `,

          monthNumber,
          monthName,
          monthlyTableName,
          recordCount,
          firstRecordAt,
          lastRecordAt
        );


    return inserted[0] || null;
  }


  // ===================================================
  // INSERT HISTORICAL TELEMETRY RECORD
  // ===================================================
  //
  // IMPORTANT:
  //
  // THIS METHOD IS ONLY FOR MONTHLY TABLES.
  //
  // Duplicate telemetry_id is intentionally ignored.
  //
  // This makes the historical processing idempotent.
  //
  // ===================================================

  async insertHistoricalRecord(
    tableName,
    record
  ) {

    const query = `
      INSERT INTO "${tableName}"
      (
        telemetry_id,
        iot_timestamp,
        received_timestamp,

        vehicle_number,
        driver_name,
        unit_number,
        firmware_version,

        latitude,
        longitude,

        city_id,
        zone_id,
        division_id,
        ward_id,
        ward_no,

        citizen_id,
        rfid_epc,
        citizen_contact,

        waste_type,
        collection_type,

        wet_weight,
        dry_weight,
        other_weight,
        cumulative_weight,

        remarks,
        error_code,
        driver_action
      )
      VALUES
      (
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

        $24,
        $25,
        $26
      )

      ON CONFLICT (telemetry_id)
      DO NOTHING

      RETURNING *
    `;


    const result =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(

          query,

          // 1
          record.telemetryId,

          // 2
          record.iotTimestamp,

          // 3
          record.receivedTimestamp,

          // 4
          record.vehicleNumber,

          // 5
          record.driverName,

          // 6
          record.unitNumber,

          // 7
          record.firmwareVersion,

          // 8
          record.latitude,

          // 9
          record.longitude,

          // 10
          record.cityId,

          // 11
          record.zoneId,

          // 12
          record.divisionId,

          // 13
          record.wardId,

          // 14
          record.wardNo,

          // 15
          record.citizenId,

          // 16
          record.rfidEpc,

          // 17
          record.citizenContact,

          // 18
          record.wasteType,

          // 19
          record.collectionType,

          // 20
          record.wetWeight,

          // 21
          record.dryWeight,

          // 22
          record.otherWeight,

          // 23
          record.cumulativeWeight,

          // 24
          record.remarks,

          // 25
          record.errorCode,

          // 26
          record.driverAction
        );


    // -------------------------------------------------
    // NEW RECORD
    // -------------------------------------------------

    if (
      result.length > 0
    ) {

      return {
        inserted: true,
        duplicate: false,
        record: result[0]
      };
    }


    // -------------------------------------------------
    // DUPLICATE RECORD
    // -------------------------------------------------

    return {
      inserted: false,
      duplicate: true,
      record: null
    };
  }


  // ===================================================
  // COUNT RECORDS
  // ===================================================

  async countRecords(
    tableName
  ) {

    const result =
      await citizenHistoricalPrisma
        .$queryRawUnsafe(
          `
          SELECT
            COUNT(*)::BIGINT AS count
          FROM "${tableName}"
          `
        );


    return Number(
      result[0]?.count || 0
    );
  }

}


// =====================================================
// EXPORT
// =====================================================

module.exports =
  new CitizenHistoricalRepository();