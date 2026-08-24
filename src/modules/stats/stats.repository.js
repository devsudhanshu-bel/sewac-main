import {
  PrismaClient as MasterCitizenPrismaClient
} from "../../generated/master_citizen/client.js";

import citizenHistoricalPrisma
  from "../../config/citizenHistoricalPrisma.js";


// =====================================================
// MASTER CITIZEN PRISMA
// =====================================================
//
// master_citizen_map:
//
// id
// phone_number
// ward_id
// created_at
// updated_at
//
// IMPORTANT:
//
// There is NO citizen_id column here.
//
// =====================================================

const masterCitizenPrisma =
  new MasterCitizenPrismaClient();


// =====================================================
// STATS REPOSITORY
// =====================================================
//
// Data sources:
//
// 1. MASTER CITIZEN DATABASE
//
//    master_citizen_map
//
//    phone_number → ward_id
//
// 2. CITIZEN HISTORICAL DATABASE
//
//    ward_<WARD_NO>_<MM><YYYY>
//
//    Example:
//
//    ward_216_082026
//
// =====================================================

class StatsRepository {


  // ===================================================
  // NORMALIZE PHONE NUMBER
  // ===================================================
  //
  // Supports:
  //
  // 9740839779
  //
  // 919740839779
  //
  // +919740839779
  //
  // ===================================================

  normalizePhoneNumber(
    phoneNumber
  ) {

    if (
      phoneNumber === null ||
      phoneNumber === undefined
    ) {

      return null;

    }


    const digits =
      String(phoneNumber)
        .trim()
        .replace(/\D/g, "");


    if (!digits) {

      return null;

    }


    // -----------------------------------------------
    // 10 digit Indian number
    // -----------------------------------------------

    if (
      digits.length === 10
    ) {

      return {

        local: digits,

        withoutPlusCountryCode:
          `91${digits}`,

        international:
          `+91${digits}`,

      };

    }


    // -----------------------------------------------
    // 91 + 10 digit number
    // -----------------------------------------------

    if (
      digits.length === 12 &&
      digits.startsWith("91")
    ) {

      const local =
        digits.substring(2);


      return {

        local,

        withoutPlusCountryCode:
          digits,

        international:
          `+${digits}`,

      };

    }


    // -----------------------------------------------
    // Fallback
    // -----------------------------------------------

    return {

      local: digits,

      withoutPlusCountryCode:
        digits,

      international:
        `+${digits}`,

    };

  }


  // ===================================================
  // GET CITIZEN WARD
  // ===================================================
  //
  // Flow:
  //
  // phone
  //   ↓
  // normalize
  //   ↓
  // master_citizen_map
  //   ↓
  // ward_id
  //
  // ===================================================

  async getCitizenWard(
    phoneNumber
  ) {

    if (!phoneNumber) {

      throw new Error(
        "Citizen phone information not found."
      );

    }


    const normalized =
      this.normalizePhoneNumber(
        phoneNumber
      );


    if (!normalized) {

      throw new Error(
        "Citizen phone information not found."
      );

    }


    console.log(
      `[Stats Repository] Looking up citizen ward for phone: ${phoneNumber}`
    );


    console.log(
      `[Stats Repository] Phone candidates: ${JSON.stringify(normalized)}`
    );


    // -----------------------------------------------
    // MASTER CITIZEN LOOKUP
    // -----------------------------------------------

    const mapping =
      await masterCitizenPrisma
        .master_citizen_map
        .findFirst({

          where: {

            OR: [

              {
                phone_number:
                  normalized.local
              },

              {
                phone_number:
                  normalized.withoutPlusCountryCode
              },

              {
                phone_number:
                  normalized.international
              }

            ]

          },

          select: {

            id: true,

            phone_number: true,

            ward_id: true

          }

        });


    // -----------------------------------------------
    // NOT FOUND
    // -----------------------------------------------

    if (!mapping) {

      console.log(
        "[Stats Repository] No master citizen mapping found for phone candidates."
      );


      throw new Error(
        "Ward information not found for citizen."
      );

    }


    // -----------------------------------------------
    // WARD
    // -----------------------------------------------

    const wardNo =
      Number(mapping.ward_id);


    if (
      !Number.isInteger(wardNo) ||
      wardNo <= 0
    ) {

      console.log(
        `[Stats Repository] Invalid ward_id: ${mapping.ward_id}`
      );


      throw new Error(
        "Ward information not found for citizen."
      );

    }


    console.log(
      `[Stats Repository] Phone mapping found: ${mapping.phone_number} -> Ward ${wardNo}`
    );


    return wardNo;

  }


  // ===================================================
  // BUILD MONTHLY TABLE NAME
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


    if (
      !Number.isInteger(numericWard) ||
      numericWard <= 0
    ) {

      throw new Error(
        "Invalid ward number."
      );

    }


    if (
      !Number.isInteger(numericYear) ||
      numericYear < 2000 ||
      numericYear > 2100
    ) {

      throw new Error(
        "Invalid year."
      );

    }


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
      await citizenHistoricalPrisma
        .$queryRaw`

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
  // GET ANALYTICS LOGS
  // ===================================================
  //
  // IMPORTANT:
  //
  // We query every monthly historical table that
  // overlaps the requested date range.
  //
  // Example:
  //
  // 2026-08-01 → 2026-08-24
  //
  // becomes:
  //
  // ward_216_082026
  //
  // ===================================================

  async getAnalyticsLogs(
    citizenId,
    phoneNumber,
    startDate,
    endDate
  ) {

    // -----------------------------------------------
    // RESOLVE WARD
    // -----------------------------------------------

    const wardNo =
      await this.getCitizenWard(
        phoneNumber
      );


    console.log(
      `[Stats Repository] Citizen ${citizenId} resolved to Ward ${wardNo}`
    );


    // -----------------------------------------------
    // BUILD MONTH LIST
    // -----------------------------------------------

    const months = [];


    const cursor =
      new Date(

        startDate.getFullYear(),

        startDate.getMonth(),

        1

      );


    const finalMonth =
      new Date(

        endDate.getFullYear(),

        endDate.getMonth(),

        1

      );


    while (
      cursor <= finalMonth
    ) {

      months.push({

        year:
          cursor.getFullYear(),

        month:
          cursor.getMonth() + 1,

      });


      cursor.setMonth(
        cursor.getMonth() + 1
      );

    }


    // -----------------------------------------------
    // FETCH ALL MONTHS
    // -----------------------------------------------

    const allRows = [];


    for (
      const item of months
    ) {

      const tableName =
        this.getMonthlyTableName(

          wardNo,

          item.year,

          item.month

        );


      console.log(
        `[Stats Repository] Checking historical table: ${tableName}`
      );


      const exists =
        await this.tableExists(
          tableName
        );


      if (!exists) {

        console.log(
          `[Stats Repository] Table ${tableName} does not exist.`
        );

        continue;

      }


      // ---------------------------------------------
      // FETCH DATA
      // ---------------------------------------------

      const rows =
        await citizenHistoricalPrisma
          .$queryRawUnsafe(

            `

            SELECT

              CASE

                WHEN UPPER(
                  COALESCE(waste_type, '')
                ) = 'DRY'

                  THEN 'D'

                WHEN UPPER(
                  COALESCE(waste_type, '')
                ) = 'WET'

                  THEN 'W'

                ELSE UPPER(
                  COALESCE(waste_type, '')
                )

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


      console.log(
        `[Stats Repository] ${tableName}: ${rows.length} records found.`
      );


      allRows.push(
        ...rows
      );

    }


    // -----------------------------------------------
    // SORT EVERYTHING
    // -----------------------------------------------

    allRows.sort(
      (
        a,
        b
      ) => {

        return (
          new Date(a.iot_timestamp)
          -
          new Date(b.iot_timestamp)
        );

      }
    );


    console.log(
      `[Stats Repository] Total analytics records found: ${allRows.length}`
    );


    return allRows;

  }

}


// =====================================================
// EXPORT
// =====================================================

export default new StatsRepository();