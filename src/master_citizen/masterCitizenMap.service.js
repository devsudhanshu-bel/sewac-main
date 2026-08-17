const masterCitizenPrisma =
  require("../../config/masterCitizenPrisma");

/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

/**
 * Validate a dynamic PostgreSQL table name.
 *
 * Dynamic identifiers cannot be passed as normal Prisma
 * query parameters, so we validate them before interpolation.
 */
function validateTableName(tableName) {
  if (
    typeof tableName !== "string" ||
    !/^[a-z][a-z0-9_]*$/.test(
      tableName
    )
  ) {
    throw new Error(
      `Invalid table name: ${tableName}`
    );
  }

  return tableName;
}

/**
 * Convert PostgreSQL JSON/JSONB values into a JS object.
 */
function normalizeGeoBoundary(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  if (
    typeof value === "string"
  ) {
    try {
      return JSON.parse(value);
    } catch (
      error
    ) {
      return null;
    }
  }

  return value;
}

/**
 * ============================================================
 * GET CITY + ZONES
 * ============================================================
 *
 * Returns:
 *
 * {
 *   id,
 *   cityName,
 *   geoBoundary,
 *   cityTableName,
 *   zones: []
 * }
 *
 * ============================================================
 */

async function getCityMapData(
  cityId
) {
  /**
   * ----------------------------------------------------------
   * VALIDATE CITY ID
   * ----------------------------------------------------------
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
   * ----------------------------------------------------------
   * FETCH CITY FROM MASTER CITY TABLE
   * ----------------------------------------------------------
   *
   * Expected structure:
   *
   * city
   * ├── id
   * ├── city_name
   * ├── geoboundary
   * └── city_table_name
   *
   * ----------------------------------------------------------
   */

  const cityRows =
    await masterCitizenPrisma.$queryRawUnsafe(
      `
        SELECT
          id,
          city_name,
          geoboundary,
          city_table_name
        FROM "city"
        WHERE id = $1
        LIMIT 1
      `,
      numericCityId
    );

  /**
   * ----------------------------------------------------------
   * CITY NOT FOUND
   * ----------------------------------------------------------
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
   * ----------------------------------------------------------
   * CITY TABLE NAME
   * ----------------------------------------------------------
   *
   * Example:
   *
   * Bangalore
   *      ↓
   * bangalore_city
   *
   * The actual value comes from the DB.
   * ----------------------------------------------------------
   */

  const cityTableName =
    validateTableName(
      city.city_table_name
    );

  /**
   * ----------------------------------------------------------
   * CHECK CITY TABLE
   * ----------------------------------------------------------
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
    tableCheck?.[0]?.exists ===
    true;

  if (
    !cityTableExists
  ) {
    throw new Error(
      `City table "${cityTableName}" does not exist.`
    );
  }

  /**
   * ----------------------------------------------------------
   * FETCH ALL ZONES
   * ----------------------------------------------------------
   *
   * Your dynamic city table contains:
   *
   * zone_id
   * zone_name
   * geo_boundary
   * total_divisions
   * total_wards
   * created_at
   * zone_table_name
   *
   * ----------------------------------------------------------
   */

  const zoneRows =
    await masterCitizenPrisma.$queryRawUnsafe(
      `
        SELECT
          zone_id,
          zone_name,
          geo_boundary,
          total_divisions,
          total_wards,
          created_at,
          zone_table_name
        FROM "${cityTableName}"
        ORDER BY zone_id ASC
      `
    );

  /**
   * ----------------------------------------------------------
   * FORMAT ZONES
   * ----------------------------------------------------------
   */

  const zones =
    zoneRows.map(
      (zone) => ({
        id:
          Number(
            zone.zone_id
          ),

        zoneName:
          zone.zone_name,

        geoBoundary:
          normalizeGeoBoundary(
            zone.geo_boundary
          ),

        totalDivisions:
          Number(
            zone.total_divisions ??
              0
          ),

        totalWards:
          Number(
            zone.total_wards ??
              0
          ),

        createdAt:
          zone.created_at,

        zoneTableName:
          zone.zone_table_name ||
          null,
      })
    );

  /**
   * ----------------------------------------------------------
   * FINAL RESPONSE OBJECT
   * ----------------------------------------------------------
   */

  return {
    city: {
      id:
        Number(
          city.id
        ),

      cityName:
        city.city_name,

      geoBoundary:
        normalizeGeoBoundary(
          city.geoboundary
        ),

      cityTableName:
        cityTableName,
    },

    zones,
  };
}

/**
 * ============================================================
 * GET ONLY ZONES
 * ============================================================
 *
 * This is useful later when the frontend needs to refresh
 * only the Zone dropdown.
 *
 * ============================================================
 */

async function getCityZones(
  cityId
) {
  const cityData =
    await getCityMapData(
      cityId
    );

  return cityData.zones;
}

/**
 * ============================================================
 * EXPORTS
 * ============================================================
 */

module.exports = {
  getCityMapData,
  getCityZones,
};