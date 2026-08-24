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
// There is NO citizen_id column here.
//
// =====================================================

const masterCitizenPrisma =
  new MasterCitizenPrismaClient();


// =====================================================
// HOME REPOSITORY
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

class HomeRepository {


  // ===================================================
  // NORMALIZE PHONE NUMBER
  // ===================================================
  //
  // We deliberately support both:
  //
  // 9740839779
  //
  // +919740839779
  //
  // 919740839779
  //
  // This is important because Auth may receive/store
  // the number in a different format from the master
  // citizen mapping.
  //
  // ===================================================

  normalizePhoneNumber(phoneNumber) {

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
    // Indian 10 digit number
    // -----------------------------------------------

    if (digits.length === 10) {

      return {
        local: digits,
        withoutPlusCountryCode: `91${digits}`,
        international: `+91${digits}`,
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
        withoutPlusCountryCode: digits,
        international: `+${digits}`,
      };

    }


    // -----------------------------------------------
    // Other formats
    //
    // Keep the raw digits as fallback.
    // -----------------------------------------------

    return {
      local: digits,
      withoutPlusCountryCode: digits,
      international: `+${digits}`,
    };

  }


  // ===================================================
  // GET CITIZEN WARD
  // ===================================================
  //
  // Flow:
  //
  // phone number
  //      ↓
  // normalize
  //      ↓
  // master_citizen_map
  //      ↓
  // ward_id
  //
  // ===================================================

  async getCitizenWard(phoneNumber) {

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
      `[Home Repository] Looking up citizen ward for phone: ${phoneNumber}`
    );

    console.log(
      `[Home Repository] Phone candidates: ${JSON.stringify(normalized)}`
    );


    // -----------------------------------------------
    // MASTER CITIZEN LOOKUP
    // -----------------------------------------------
    //
    // Supports:
    //
    // 9740839779
    // 919740839779
    // +919740839779
    //
    // -----------------------------------------------

    const mapping =
      await masterCitizenPrisma.master_citizen_map.findFirst({

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
    // MAPPING NOT FOUND
    // -----------------------------------------------

    if (!mapping) {

      console.log(
        `[Home Repository] No master citizen mapping found for phone candidates.`
      );

      throw new Error(
        "Ward information not found for citizen."
      );

    }


    // -----------------------------------------------
    // RESOLVE WARD
    // -----------------------------------------------

    const wardNo =
      Number(mapping.ward_id);


    if (
      !Number.isInteger(wardNo) ||
      wardNo <= 0
    ) {

      console.log(
        `[Home Repository] Invalid ward_id in master_citizen_map: ${mapping.ward_id}`
      );

      throw new Error(
        "Ward information not found for citizen."
      );

    }


    console.log(
      `[Home Repository] Phone mapping found: ${mapping.phone_number} -> Ward Number ${wardNo}`
    );


    return wardNo;

  }


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

  async tableExists(tableName) {

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
  // Historical DB:
  //
  // citizen_id
  // waste_type
  // iot_timestamp
  //
  // waste_type is normalized:
  //
  // DRY → D
  // WET → W
  //
  // The service continues using the old calculation
  // logic.
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
    // FETCH HISTORICAL COLLECTIONS
    // -----------------------------------------------
    //
    // IMPORTANT:
    //
    // citizen_id belongs to the historical DB.
    //
    // master_citizen_map is NEVER queried using
    // citizen_id.
    //
    // -----------------------------------------------

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
      `[Home Repository] Historical collections found: ${rows.length}`
    );


    return rows;

  }

}


// =====================================================
// EXPORT
// =====================================================

export default new HomeRepository();