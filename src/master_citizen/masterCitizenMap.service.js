const masterCitizenPrisma =
  require("../config/masterCitizenPrisma");

/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

function validateTableName(tableName) {
  if (
    typeof tableName !== "string" ||
    !/^[a-z][a-z0-9_]*$/.test(tableName)
  ) {
    throw new Error(
      `Invalid table name: ${tableName}`
    );
  }

  return tableName;
}


/**
 * Convert PostgreSQL JSON/JSONB values
 * into normal JavaScript objects.
 */
function normalizeGeoBoundary(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }

  return value;
}


/**
 * ============================================================
 * GET CITY MAP DATA
 * ============================================================
 *
 * ONE ENDPOINT
 *
 * Returns:
 *
 * {
 *   city: {
 *     id,
 *     cityName,
 *     geoBoundary,
 *     cityTableName
 *   },
 *
 *   zones: [
 *     {
 *       zoneName,
 *       geoBoundary,
 *       zoneTableName
 *     }
 *   ]
 * }
 *
 * ============================================================
 */

async function getCityMapData(cityId) {

  /**
   * ==========================================================
   * 1. VALIDATE CITY ID
   * ==========================================================
   */

  if (
    cityId === undefined ||
    cityId === null ||
    cityId === ""
  ) {
    throw new Error(
      "City ID is required."
    );
  }


  const numericCityId =
    Number(cityId);


  if (
    !Number.isInteger(
      numericCityId
    ) ||
    numericCityId <= 0
  ) {
    throw new Error(
      "Invalid city ID."
    );
  }


  /**
   * ==========================================================
   * 2. FETCH CITY
   * ==========================================================
   *
   * Actual master city table:
   *
   * city
   *
   * city_id
   * city_name
   * geo_boundary
   * created_at
   * city_table_name
   *
   * ==========================================================
   */

  const cityRows =
    await masterCitizenPrisma.$queryRawUnsafe(
      `
        SELECT
          city_id,
          city_name,
          geo_boundary,
          city_table_name
        FROM "city"
        WHERE city_id = $1
        LIMIT 1
      `,
      numericCityId
    );


  /**
   * ==========================================================
   * 3. CITY NOT FOUND
   * ==========================================================
   */

  if (
    !cityRows ||
    cityRows.length === 0
  ) {
    throw new Error(
      `City with id ${numericCityId} not found.`
    );
  }


  const city =
    cityRows[0];


  /**
   * ==========================================================
   * 4. VALIDATE CITY TABLE NAME
   * ==========================================================
   */

  const cityTableName =
    validateTableName(
      city.city_table_name
    );


  /**
   * ==========================================================
   * 5. CHECK CITY TABLE EXISTS
   * ==========================================================
   */

  const tableCheck =
    await masterCitizenPrisma.$queryRawUnsafe(
      `
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = $1
        ) AS exists
      `,
      cityTableName
    );


  const cityTableExists =
    tableCheck?.[0]?.exists === true;


  if (!cityTableExists) {
    throw new Error(
      `City table "${cityTableName}" does not exist.`
    );
  }


  /**
   * ==========================================================
   * 6. FETCH ZONE INFORMATION
   * ==========================================================
   *
   * We ONLY return the fields required by the frontend:
   *
   * zone_name
   * geo_boundary
   * zone_table_name
   *
   * ==========================================================
   */

  const zoneRows =
    await masterCitizenPrisma.$queryRawUnsafe(
      `
        SELECT
          zone_name,
          geo_boundary,
          zone_table_name
        FROM "${cityTableName}"
        WHERE zone_name IS NOT NULL
        ORDER BY zone_id ASC
      `
    );


  /**
   * ==========================================================
   * 7. FORMAT ZONES
   * ==========================================================
   */

  const zones =
    zoneRows
      .map(
        (zone) => ({

          zoneName:
            zone.zone_name,

          geoBoundary:
            normalizeGeoBoundary(
              zone.geo_boundary
            ),

          zoneTableName:
            zone.zone_table_name ||
            null,

        })
      )
      .filter(
        (zone) =>
          zone.zoneName !== null &&
          zone.zoneName !== undefined &&
          String(
            zone.zoneName
          ).trim() !== ""
      );


  /**
   * ==========================================================
   * 8. FINAL RESPONSE
   * ==========================================================
   */

  return {

    city: {

      id:
        Number(
          city.city_id
        ),

      cityName:
        city.city_name,

      geoBoundary:
        normalizeGeoBoundary(
          city.geo_boundary
        ),

      cityTableName:
        cityTableName,

    },

    zones,

  };
}


/**
 * ============================================================
 * EXPORT
 * ============================================================
 */

module.exports = {
  getCityMapData,
};