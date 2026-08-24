import citizenHistoricalPrisma
  from "../../config/citizenHistoricalPrisma.js";


// =====================================================
// HOME REPOSITORY
// =====================================================
//
// Citizen Home data source:
//
// citizen_historical_db
//
// Monthly table format:
//
// ward_<WARD_NO>_<MM><YYYY>
//
// Example:
//
// ward_216_082026
//
// =====================================================


class HomeRepository {


  // ===================================================
  // BUILD HISTORICAL TABLE NAME
  // ===================================================

  getMonthlyTableName(
    wardNo,
    year,
    month
  ) {

    const numericWard =
      Number(wardNo);

    const numericYear =
      Number(year);

    const numericMonth =
      Number(month);


    // -----------------------------------------------
    // VALIDATE WARD
    // -----------------------------------------------

    if (
      !Number.isInteger(numericWard) ||
      numericWard <= 0
    ) {

      throw new Error(
        "Invalid ward number."
      );

    }


    // -----------------------------------------------
    // VALIDATE YEAR
    // -----------------------------------------------

    if (
      !Number.isInteger(numericYear) ||
      numericYear < 2000 ||
      numericYear > 2100
    ) {

      throw new Error(
        "Invalid year."
      );

    }


    // -----------------------------------------------
    // VALIDATE MONTH
    // -----------------------------------------------

    if (
      !Number.isInteger(numericMonth) ||
      numericMonth < 1 ||
      numericMonth > 12
    ) {

      throw new Error(
        "Invalid month."
      );

    }


    const paddedMonth =
      String(numericMonth)
        .padStart(2, "0");


    return (
      `ward_${numericWard}_${paddedMonth}${numericYear}`
    );

  }


  // ===================================================
  // CHECK TABLE EXISTS
  // ===================================================

  async tableExists(
    tableName
  ) {

    const result =
      await citizenHistoricalPrisma.$queryRaw`

        SELECT EXISTS (

          SELECT 1

          FROM information_schema.tables

          WHERE table_schema = 'public'

          AND table_name = ${tableName}

        ) AS "exists"

      `;


    return Boolean(
      result?.[0]?.exists
    );

  }


  // ===================================================
  // GET MONTHLY COLLECTIONS
  // ===================================================
  //
  // IMPORTANT:
  //
  // The old Home logic expects:
  //
  // remarks
  // iot_timestamp
  //
  //
  // Historical DB stores the collection type as:
  //
  // waste_type
  //
  // Example:
  //
  // DRY
  // WET
  //
  // Therefore we normalize it here.
  //
  // The service logic remains unchanged.
  //
  // ===================================================

  async getMonthlyCollections(
    citizenId,
    wardNo,
    year,
    month,
    startDate,
    endDate
  ) {


    const tableName =
      this.getMonthlyTableName(
        wardNo,
        year,
        month
      );


    console.log(
      `[Home Repository] Historical table: ${tableName}`
    );


    // -----------------------------------------------
    // CHECK TABLE
    // -----------------------------------------------

    const exists =
      await this.tableExists(
        tableName
      );


    if (!exists) {

      console.log(
        `[Home Repository] Table ${tableName} does not exist.`
      );

      return [];

    }


    // -----------------------------------------------
    // CITIZEN ID
    // -----------------------------------------------
    //
    // citizen_id exists in the historical table.
    //
    // -----------------------------------------------


    const rows =
      await citizenHistoricalPrisma.$queryRawUnsafe(

        `
        SELECT
          CASE
            WHEN UPPER(COALESCE(waste_type, '')) = 'DRY'
              THEN 'D'
            WHEN UPPER(COALESCE(waste_type, '')) = 'WET'
              THEN 'W'
            ELSE UPPER(waste_type)
          END AS "remarks",

          iot_timestamp AS "iot_timestamp"

        FROM "${tableName}"

        WHERE citizen_id = $1

          AND iot_timestamp >= $2

          AND iot_timestamp < $3

        ORDER BY iot_timestamp ASC
        `,

        Number(citizenId),

        startDate,

        endDate

      );


    return rows;

  }


}


// =====================================================
// EXPORT
// =====================================================

export default new HomeRepository();