const masterCitizenPrisma =
  require("../config/masterCitizenPrisma");


/**
 * ============================================================
 * HELPERS
 * ============================================================
 */


/**
 * ------------------------------------------------------------
 * Validate dynamic PostgreSQL table names
 * ------------------------------------------------------------
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
 * ------------------------------------------------------------
 * Normalize PostgreSQL JSON / JSONB
 * ------------------------------------------------------------
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
 * ------------------------------------------------------------
 * Check whether a table exists
 * ------------------------------------------------------------
 */
async function tableExists(tableName) {

  const safeTableName =
    validateTableName(tableName);


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
      safeTableName
    );


  return (
    result?.[0]?.exists === true ||
    result?.[0]?.exists === "true"
  );
}


/**
 * ============================================================
 * GET COMPLETE CITY MAP DATA
 * ============================================================
 *
 * HIERARCHY:
 *
 * CITY
 *   ↓
 * ZONES
 *   ↓
 * DIVISIONS
 *   ↓
 * WARDS
 *
 *
 * IMPORTANT:
 *
 * We DO NOT return citizen data.
 *
 * The division-level table may contain multiple rows for
 * citizens belonging to the same ward.
 *
 * Therefore wards are fetched as UNIQUE ward boundaries.
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
   * 3. CITY TABLE
   * ==========================================================
   */

  const cityTableName =
    validateTableName(
      city.city_table_name
    );


  const cityTableExists =
    await tableExists(
      cityTableName
    );


  if (!cityTableExists) {

    throw new Error(
      `City table "${cityTableName}" does not exist.`
    );

  }


  /**
   * ==========================================================
   * 4. FETCH ZONES
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
   * 5. BUILD ZONES
   * ==========================================================
   */

  const zones = [];


  for (
    const zoneRow of zoneRows
  ) {

    const zoneName =
      zoneRow.zone_name;


    if (
      zoneName === null ||
      zoneName === undefined ||
      String(zoneName).trim() === ""
    ) {

      continue;

    }


    const zoneTableName =
      zoneRow.zone_table_name
        ? validateTableName(
            zoneRow.zone_table_name
          )
        : null;


    const zone = {

      zoneName,

      geoBoundary:
        normalizeGeoBoundary(
          zoneRow.geo_boundary
        ),

      zoneTableName,

      divisions: [],

    };


    /**
     * ========================================================
     * 6. ZONE TABLE
     * ========================================================
     */

    if (!zoneTableName) {

      zones.push(zone);

      continue;

    }


    const zoneExists =
      await tableExists(
        zoneTableName
      );


    if (!zoneExists) {

      console.warn(
        `⚠️ Zone table "${zoneTableName}" does not exist.`
      );

      zones.push(zone);

      continue;

    }


    /**
     * ========================================================
     * 7. FETCH DIVISIONS
     * ========================================================
     */

    const divisionRows =
      await masterCitizenPrisma.$queryRawUnsafe(
        `
          SELECT
            division_name,
            geo_boundary,
            division_table_name
          FROM "${zoneTableName}"
          WHERE division_name IS NOT NULL
          ORDER BY division_id ASC
        `
      );


    /**
     * ========================================================
     * 8. BUILD DIVISIONS
     * ========================================================
     */

    for (
      const divisionRow of divisionRows
    ) {

      const divisionName =
        divisionRow.division_name;


      if (
        divisionName === null ||
        divisionName === undefined ||
        String(divisionName).trim() === ""
      ) {

        continue;

      }


      const divisionTableName =
        divisionRow.division_table_name
          ? validateTableName(
              divisionRow.division_table_name
            )
          : null;


      const division = {

        divisionName,

        geoBoundary:
          normalizeGeoBoundary(
            divisionRow.geo_boundary
          ),

        divisionTableName,

        wards: [],

      };


      /**
       * ======================================================
       * 9. DIVISION TABLE
       * ======================================================
       */

      if (!divisionTableName) {

        zone.divisions.push(
          division
        );

        continue;

      }


      const divisionExists =
        await tableExists(
          divisionTableName
        );


      if (!divisionExists) {

        console.warn(
          `⚠️ Division table "${divisionTableName}" does not exist.`
        );

        zone.divisions.push(
          division
        );

        continue;

      }


      /**
       * ======================================================
       * 10. FETCH UNIQUE WARD BOUNDARIES
       * ======================================================
       *
       * THIS IS THE IMPORTANT FIX.
       *
       * The underlying division table may contain multiple
       * citizen rows belonging to the same ward.
       *
       * Example:
       *
       * Citizen 1 -> Ward 1
       * Citizen 2 -> Ward 1
       * Citizen 3 -> Ward 1
       * Citizen 4 -> Ward 2
       *
       * A normal SELECT would return:
       *
       * 4 rows
       *
       * But the geographical hierarchy contains:
       *
       * 2 wards
       *
       * Therefore we use DISTINCT ON (ward_name).
       *
       * We only return:
       *
       * ward_name
       * geo_boundary
       *
       * No citizen columns are returned.
       *
       * ======================================================
       */

      const wardRows =
        await masterCitizenPrisma.$queryRawUnsafe(
          `
            SELECT DISTINCT ON (ward_name)
              ward_name,
              geo_boundary
            FROM "${divisionTableName}"
            WHERE
              ward_name IS NOT NULL
              AND geo_boundary IS NOT NULL
            ORDER BY
              ward_name ASC
          `
        );


      /**
       * ======================================================
       * 11. BUILD UNIQUE WARDS
       * ======================================================
       */

      division.wards =
        wardRows
          .filter(
            (ward) => {

              return (
                ward.ward_name !== null &&
                ward.ward_name !== undefined &&
                String(
                  ward.ward_name
                ).trim() !== ""
              );

            }
          )
          .map(
            (ward) => ({

              wardName:
                ward.ward_name,

              geoBoundary:
                normalizeGeoBoundary(
                  ward.geo_boundary
                ),

            })
          );


      /**
       * ======================================================
       * 12. ADD DIVISION
       * ======================================================
       */

      zone.divisions.push(
        division
      );

    }


    /**
     * ========================================================
     * 13. ADD ZONE
     * ========================================================
     */

    zones.push(zone);

  }


  /**
   * ==========================================================
   * 14. CALCULATE GEOGRAPHICAL SUMMARY
   * ==========================================================
   */

  const totalZones =
    zones.length;


  const totalDivisions =
    zones.reduce(
      (
        total,
        zone
      ) => {

        return (
          total +
          zone.divisions.length
        );

      },
      0
    );


  const totalWards =
    zones.reduce(
      (
        zoneTotal,
        zone
      ) => {

        return (
          zoneTotal +
          zone.divisions.reduce(
            (
              divisionTotal,
              division
            ) => {

              return (
                divisionTotal +
                division.wards.length
              );

            },
            0
          )
        );

      },
      0
    );


  /**
   * ==========================================================
   * 15. LOG FINAL COUNTS
   * ==========================================================
   */

  console.log("");
  console.log(
    "============================================================"
  );

  console.log(
    "🗺️ CITY MAP HIERARCHY"
  );

  console.log(
    "============================================================"
  );

  console.log(
    "City:",
    city.city_name
  );

  console.log(
    "Zones:",
    totalZones
  );

  console.log(
    "Divisions:",
    totalDivisions
  );

  console.log(
    "Unique Wards:",
    totalWards
  );

  console.log(
    "Citizen data:",
    "NOT LOADED"
  );

  console.log(
    "============================================================"
  );


  /**
   * ==========================================================
   * 16. FINAL RESPONSE
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


    summary: {

      totalZones,

      totalDivisions,

      totalWards,

    },

  };

}


/**
 * ============================================================
 * GET ZONE DIVISIONS
 * ============================================================
 *
 * BACKWARD COMPATIBILITY ENDPOINT
 *
 * Returns:
 *
 * ZONE
 *   ↓
 * DIVISIONS
 *   ↓
 * UNIQUE WARDS
 *
 * No citizen data.
 *
 * ============================================================
 */

async function getZoneDivisions(
  zoneTableName
) {

  /**
   * ----------------------------------------------------------
   * 1. VALIDATE
   * ----------------------------------------------------------
   */

  const safeZoneTableName =
    validateTableName(
      zoneTableName
    );


  /**
   * ----------------------------------------------------------
   * 2. CHECK TABLE
   * ----------------------------------------------------------
   */

  const exists =
    await tableExists(
      safeZoneTableName
    );


  if (!exists) {

    throw new Error(
      `Zone table "${safeZoneTableName}" does not exist.`
    );

  }


  /**
   * ----------------------------------------------------------
   * 3. FETCH DIVISIONS
   * ----------------------------------------------------------
   */

  const divisionRows =
    await masterCitizenPrisma.$queryRawUnsafe(
      `
        SELECT
          division_name,
          geo_boundary,
          division_table_name
        FROM "${safeZoneTableName}"
        WHERE division_name IS NOT NULL
        ORDER BY division_id ASC
      `
    );


  const divisions = [];


  /**
   * ----------------------------------------------------------
   * 4. BUILD DIVISIONS
   * ----------------------------------------------------------
   */

  for (
    const divisionRow of divisionRows
  ) {

    const divisionName =
      divisionRow.division_name;


    if (
      divisionName === null ||
      divisionName === undefined ||
      String(
        divisionName
      ).trim() === ""
    ) {

      continue;

    }


    const divisionTableName =
      divisionRow.division_table_name
        ? validateTableName(
            divisionRow.division_table_name
          )
        : null;


    const division = {

      divisionName,

      geoBoundary:
        normalizeGeoBoundary(
          divisionRow.geo_boundary
        ),

      divisionTableName,

      wards: [],

    };


    /**
     * --------------------------------------------------------
     * 5. FETCH UNIQUE WARDS
     * --------------------------------------------------------
     */

    if (
      divisionTableName &&
      await tableExists(
        divisionTableName
      )
    ) {

      const wardRows =
        await masterCitizenPrisma.$queryRawUnsafe(
          `
            SELECT DISTINCT ON (ward_name)
              ward_name,
              geo_boundary
            FROM "${divisionTableName}"
            WHERE
              ward_name IS NOT NULL
              AND geo_boundary IS NOT NULL
            ORDER BY
              ward_name ASC
          `
        );


      /**
       * ------------------------------------------------------
       * 6. BUILD WARDS
       * ------------------------------------------------------
       */

      division.wards =
        wardRows
          .filter(
            (ward) => {

              return (
                ward.ward_name !== null &&
                ward.ward_name !== undefined &&
                String(
                  ward.ward_name
                ).trim() !== ""
              );

            }
          )
          .map(
            (ward) => ({

              wardName:
                ward.ward_name,

              geoBoundary:
                normalizeGeoBoundary(
                  ward.geo_boundary
                ),

            })
          );

    }


    divisions.push(
      division
    );

  }


  /**
   * ----------------------------------------------------------
   * 7. RETURN
   * ----------------------------------------------------------
   */

  return {

    zoneTableName:
      safeZoneTableName,

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