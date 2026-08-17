const masterCitizenPrisma =
  require("../config/masterCitizenPrisma");

/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

/**
 * Validate a dynamic PostgreSQL table name.
 *
 * Dynamic table names cannot be passed as normal SQL
 * parameters, therefore we strictly validate them before
 * interpolating them into SQL.
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
 * ============================================================
 * NORMALIZE GEOBOUNDARY
 * ============================================================
 */

function normalizeGeoBoundary(value) {
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
    } catch (error) {
      return null;
    }
  }

  return value;
}


/**
 * ============================================================
 * CHECK TABLE EXISTS
 * ============================================================
 */

async function tableExists(tableName) {

  const result =
    await masterCitizenPrisma.$queryRawUnsafe(
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

  return (
    result?.[0]?.exists === true
  );
}


/**
 * ============================================================
 * GET CITY MAP DATA
 * ============================================================
 *
 * GET:
 *
 * /api/master-citizen/map/city/:cityId
 *
 *
 * RETURNS:
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
   * ----------------------------------------------------------
   * 1. VALIDATE CITY ID
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
   * 2. FETCH CITY
   * ----------------------------------------------------------
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
   * ----------------------------------------------------------
   * 3. CITY NOT FOUND
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
   * 4. VALIDATE CITY TABLE NAME
   * ----------------------------------------------------------
   */

  if (
    !city.city_table_name
  ) {
    throw new Error(
      `City "${city.city_name}" does not have a city table name.`
    );
  }


  const cityTableName =
    validateTableName(
      city.city_table_name
    );


  /**
   * ----------------------------------------------------------
   * 5. CHECK CITY TABLE
   * ----------------------------------------------------------
   */

  const cityTableExists =
    await tableExists(
      cityTableName
    );


  if (
    !cityTableExists
  ) {
    throw new Error(
      `City table "${cityTableName}" does not exist.`
    );
  }


  /**
   * ----------------------------------------------------------
   * 6. GET ALL ZONES
   * ----------------------------------------------------------
   */

  const zoneRows =
    await masterCitizenPrisma.$queryRawUnsafe(
      `
        SELECT
          zone_id,
          zone_name,
          geo_boundary,
          zone_table_name,
          total_divisions,
          total_wards,
          created_at
        FROM "${cityTableName}"
        WHERE zone_name IS NOT NULL
        ORDER BY zone_id ASC
      `
    );


  /**
   * ----------------------------------------------------------
   * 7. FORMAT ZONES
   * ----------------------------------------------------------
   */

  const zones =
    zoneRows
      .map(
        (zone) => ({
          zoneId:
            zone.zone_id !== null &&
            zone.zone_id !== undefined
              ? Number(zone.zone_id)
              : null,

          zoneName:
            zone.zone_name,

          geoBoundary:
            normalizeGeoBoundary(
              zone.geo_boundary
            ),

          zoneTableName:
            zone.zone_table_name ||
            null,

          totalDivisions:
            zone.total_divisions !== null &&
            zone.total_divisions !== undefined
              ? Number(zone.total_divisions)
              : 0,

          totalWards:
            zone.total_wards !== null &&
            zone.total_wards !== undefined
              ? Number(zone.total_wards)
              : 0,

          createdAt:
            zone.created_at ||
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
   * ----------------------------------------------------------
   * 8. FINAL RESPONSE
   * ----------------------------------------------------------
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
 * GET ZONE DIVISIONS
 * ============================================================
 *
 * THIS IS THE NEW ENDPOINT.
 *
 * The frontend sends:
 *
 * zoneTableName
 *
 * Example:
 *
 * bengaluru_east_city_corporation_zone
 *
 *
 * The backend opens that table dynamically and returns:
 *
 * {
 *   zoneTableName,
 *   divisions: [
 *     {
 *       divisionId,
 *       divisionName,
 *       geoBoundary,
 *       divisionTableName
 *     }
 *   ]
 * }
 *
 * ============================================================
 */

async function getZoneDivisions(
  zoneTableName
) {

  /**
   * ----------------------------------------------------------
   * 1. VALIDATE TABLE NAME
   * ----------------------------------------------------------
   */

  if (
    !zoneTableName
  ) {
    throw new Error(
      "Zone table name is required."
    );
  }


  const validatedZoneTableName =
    validateTableName(
      zoneTableName
    );


  /**
   * ----------------------------------------------------------
   * 2. CHECK TABLE EXISTS
   * ----------------------------------------------------------
   */

  const exists =
    await tableExists(
      validatedZoneTableName
    );


  if (!exists) {
    throw new Error(
      `Zone table "${validatedZoneTableName}" does not exist.`
    );
  }


  /**
   * ----------------------------------------------------------
   * 3. FETCH DIVISIONS
   * ----------------------------------------------------------
   *
   * Expected zone table structure:
   *
   * division_id
   * division_name
   * geo_boundary
   * division_table_name
   *
   * ----------------------------------------------------------
   */

  const divisionRows =
    await masterCitizenPrisma.$queryRawUnsafe(
      `
        SELECT
          division_id,
          division_name,
          geo_boundary,
          division_table_name
        FROM "${validatedZoneTableName}"
        WHERE division_name IS NOT NULL
        ORDER BY division_id ASC
      `
    );


  /**
   * ----------------------------------------------------------
   * 4. FORMAT DIVISIONS
   * ----------------------------------------------------------
   */

  const divisions =
    divisionRows
      .map(
        (division) => ({
          divisionId:
            division.division_id !== null &&
            division.division_id !== undefined
              ? Number(
                  division.division_id
                )
              : null,

          divisionName:
            division.division_name,

          geoBoundary:
            normalizeGeoBoundary(
              division.geo_boundary
            ),

          divisionTableName:
            division.division_table_name ||
            null,
        })
      )
      .filter(
        (division) =>
          division.divisionName !== null &&
          division.divisionName !== undefined &&
          String(
            division.divisionName
          ).trim() !== ""
      );


  /**
   * ----------------------------------------------------------
   * 5. RETURN
   * ----------------------------------------------------------
   */

  return {

    zoneTableName:
      validatedZoneTableName,

    divisions,

  };
}


/**
 * ============================================================
 * EXPORTS
 * ============================================================
 */

module.exports = {

  getCityMapData,

  getZoneDivisions,

};