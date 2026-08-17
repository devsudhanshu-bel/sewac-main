const masterCitizenPrisma =
  require("../config/masterCitizenPrisma");


/**
 * ============================================================
 * MASTER CITIZEN MAP SERVICE
 * ============================================================
 *
 * HIERARCHY
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
 * IMPORTANT
 * ------------------------------------------------------------
 * This service returns ONLY geographical hierarchy data.
 *
 * NO:
 * - citizen records
 * - citizen counts
 * - household data
 * - phone numbers
 * - RFID data
 * - personal information
 *
 *
 * IMPORTANT FIX
 * ------------------------------------------------------------
 *
 * We DO NOT blindly trust:
 *
 * zone_table_name
 * division_table_name
 *
 * from parent rows when resolving the hierarchy.
 *
 * Instead:
 *
 * zoneName
 *    ↓
 * generateZoneTableName(zoneName)
 *
 * divisionName
 *    ↓
 * generateDivisionTableName(divisionName)
 *
 * This guarantees that the selected zone loads only
 * its own divisions and the selected division loads only
 * its own wards.
 *
 * ============================================================
 */


/**
 * ============================================================
 * SAFE NAME GENERATOR
 * ============================================================
 *
 * SAME naming rule used by the dynamic table creator.
 *
 * Example:
 *
 * Bengaluru East City Corporation
 *
 * →
 *
 * bengaluru_east_city_corporation
 *
 * ============================================================
 */

function generateSafeName(name) {

  const normalized =
    String(name)
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9]+/g,
        "_"
      )
      .replace(
        /^_+|_+$/g,
        ""
      );


  if (!normalized) {

    throw new Error(
      `Invalid name for table generation: ${name}`
    );

  }


  return normalized;

}


/**
 * ============================================================
 * CITY TABLE NAME
 * ============================================================
 */

function generateCityTableName(
  cityName
) {

  const baseName =
    generateSafeName(
      cityName
    );


  if (
    baseName.endsWith(
      "_city"
    )
  ) {

    return baseName;

  }


  return `${baseName}_city`;

}


/**
 * ============================================================
 * ZONE TABLE NAME
 * ============================================================
 *
 * THIS IS THE IMPORTANT PART.
 *
 * The zone table is derived from the actual zone name.
 *
 * Example:
 *
 * Bengaluru East City Corporation
 *
 * →
 *
 * bengaluru_east_city_corporation_zone
 *
 * ============================================================
 */

function generateZoneTableName(
  zoneName
) {

  const baseName =
    generateSafeName(
      zoneName
    );


  if (
    baseName.endsWith(
      "_zone"
    )
  ) {

    return baseName;

  }


  return `${baseName}_zone`;

}


/**
 * ============================================================
 * DIVISION TABLE NAME
 * ============================================================
 *
 * Example:
 *
 * Gandhi Nagar Division
 *
 * →
 *
 * gandhi_nagar_division
 *
 * ============================================================
 */

function generateDivisionTableName(
  divisionName
) {

  const baseName =
    generateSafeName(
      divisionName
    );


  if (
    baseName.endsWith(
      "_division"
    )
  ) {

    return baseName;

  }


  return `${baseName}_division`;

}


/**
 * ============================================================
 * WARD TABLE NAME
 * ============================================================
 */

function generateWardTableName(
  wardName,
  wardNo
) {

  let baseName;


  if (wardName) {

    baseName =
      generateSafeName(
        wardName
      );

  } else {

    baseName =
      `ward_${wardNo}`;

  }


  if (
    baseName.startsWith(
      "ward_"
    )
  ) {

    return baseName;

  }


  return `ward_${baseName}`;

}


/**
 * ============================================================
 * TABLE NAME VALIDATION
 * ============================================================
 */

function validateTableName(
  tableName
) {

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
 * ============================================================
 * NORMALIZE GEO BOUNDARY
 * ============================================================
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

      return JSON.parse(
        value
      );

    } catch (
      error
    ) {

      console.warn(
        "⚠️ Failed to parse geo_boundary JSON"
      );

      return null;

    }

  }


  return value;

}


/**
 * ============================================================
 * TABLE EXISTS
 * ============================================================
 */

async function tableExists(
  tableName
) {

  const safeTableName =
    validateTableName(
      tableName
    );


  const result =
    await masterCitizenPrisma
      .$queryRawUnsafe(
        `
          SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE
              table_schema = 'public'
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
 * GET COMPLETE CITY MAP
 * ============================================================
 *
 * GET
 *
 * /api/master-citizen/map/city/:cityId
 *
 *
 * RESPONSE
 *
 * CITY
 *   ↓
 * ZONES
 *   ↓
 * DIVISIONS
 *   ↓
 * WARDS
 *
 * ============================================================
 */

async function getCityMapData(
  cityId
) {

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
    await masterCitizenPrisma
      .$queryRawUnsafe(
        `
          SELECT
            city_id,
            city_name,
            geo_boundary,
            city_table_name
          FROM "city"
          WHERE
            city_id = $1
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
   * 3. DETERMINE CITY TABLE
   * ==========================================================
   *
   * We first prefer the registered city table.
   *
   * If it is missing, derive it from city_name.
   *
   * ==========================================================
   */

  let cityTableName = null;


  if (
    city.city_table_name
  ) {

    cityTableName =
      validateTableName(
        city.city_table_name
      );

  }


  if (
    !cityTableName
  ) {

    cityTableName =
      generateCityTableName(
        city.city_name
      );

  }


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
   * ==========================================================
   * 4. FETCH ZONES
   * ==========================================================
   *
   * IMPORTANT:
   *
   * We deduplicate zones.
   *
   * This prevents the same zone appearing multiple times
   * if the city table contains repeated rows.
   *
   * ==========================================================
   */

  const zoneRows =
    await masterCitizenPrisma
      .$queryRawUnsafe(
        `
          SELECT DISTINCT ON (zone_id)
            zone_id,
            zone_name,
            geo_boundary,
            zone_table_name
          FROM "${cityTableName}"
          WHERE
            zone_name IS NOT NULL
          ORDER BY
            zone_id ASC
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
      String(
        zoneName
      ).trim() === ""
    ) {

      continue;

    }


    /**
     * ========================================================
     * CRITICAL FIX
     * ========================================================
     *
     * DO NOT TRUST:
     *
     * zoneRow.zone_table_name
     *
     * for hierarchy resolution.
     *
     * Generate the table from zoneName.
     *
     * ========================================================
     */

    const generatedZoneTableName =
      generateZoneTableName(
        zoneName
      );


    const generatedZoneExists =
      await tableExists(
        generatedZoneTableName
      );


    /**
     * --------------------------------------------------------
     * DEBUG
     * --------------------------------------------------------
     */

    console.log(
      "🗺️ ZONE:",
      zoneName
    );

    console.log(
      "   Stored table:",
      zoneRow.zone_table_name
    );

    console.log(
      "   Generated table:",
      generatedZoneTableName
    );


    /**
     * --------------------------------------------------------
     * CREATE ZONE OBJECT
     * --------------------------------------------------------
     */

    const zone = {

      id:
        zoneRow.zone_id !== null &&
        zoneRow.zone_id !== undefined
          ? Number(
              zoneRow.zone_id
            )
          : null,

      zoneName,

      geoBoundary:
        normalizeGeoBoundary(
          zoneRow.geo_boundary
        ),

      /**
       * ALWAYS expose the generated table name.
       */

      zoneTableName:
        generatedZoneTableName,

      divisions: [],

    };


    /**
     * ========================================================
     * 6. ZONE TABLE NOT FOUND
     * ========================================================
     */

    if (
      !generatedZoneExists
    ) {

      console.error(
        `❌ Generated zone table does not exist: "${generatedZoneTableName}"`
      );

      console.error(
        `   Zone: "${zoneName}"`
      );

      console.error(
        `   Stored table reference: "${zoneRow.zone_table_name}"`
      );


      zones.push(
        zone
      );


      continue;

    }


    /**
     * ========================================================
     * 7. FETCH DIVISIONS
     * ========================================================
     *
     * We now query ONLY the table belonging to THIS zone.
     *
     * Therefore:
     *
     * East zone
     *   ↓
     * east zone table
     *   ↓
     * east divisions ONLY
     *
     * Central zone
     *   ↓
     * central zone table
     *   ↓
     * central divisions ONLY
     *
     * ========================================================
     */

    const divisionRows =
      await masterCitizenPrisma
        .$queryRawUnsafe(
          `
            SELECT DISTINCT ON (division_id)
              division_id,
              division_name,
              geo_boundary,
              division_table_name
            FROM "${generatedZoneTableName}"
            WHERE
              division_name IS NOT NULL
            ORDER BY
              division_id ASC
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
        String(
          divisionName
        ).trim() === ""
      ) {

        continue;

      }


      /**
       * ======================================================
       * CRITICAL FIX
       * ======================================================
       *
       * DO NOT TRUST:
       *
       * divisionRow.division_table_name
       *
       * Generate it from divisionName.
       *
       * ======================================================
       */

      const generatedDivisionTableName =
        generateDivisionTableName(
          divisionName
        );


      const generatedDivisionExists =
        await tableExists(
          generatedDivisionTableName
        );


      /**
       * ------------------------------------------------------
       * DEBUG
       * ------------------------------------------------------
       */

      console.log(
        "   📍 DIVISION:",
        divisionName
      );

      console.log(
        "      Stored table:",
        divisionRow.division_table_name
      );

      console.log(
        "      Generated table:",
        generatedDivisionTableName
      );


      /**
       * ------------------------------------------------------
       * CREATE DIVISION
       * ------------------------------------------------------
       */

      const division = {

        id:
          divisionRow.division_id !== null &&
          divisionRow.division_id !== undefined
            ? Number(
                divisionRow.division_id
              )
            : null,

        divisionName,

        geoBoundary:
          normalizeGeoBoundary(
            divisionRow.geo_boundary
          ),

        divisionTableName:
          generatedDivisionTableName,

        wards: [],

      };


      /**
       * ======================================================
       * 9. DIVISION TABLE NOT FOUND
       * ======================================================
       */

      if (
        !generatedDivisionExists
      ) {

        console.error(
          `❌ Generated division table does not exist: "${generatedDivisionTableName}"`
        );

        console.error(
          `   Division: "${divisionName}"`
        );

        console.error(
          `   Stored table reference: "${divisionRow.division_table_name}"`
        );


        zone.divisions.push(
          division
        );


        continue;

      }


      /**
       * ======================================================
       * 10. FETCH UNIQUE WARDS
       * ======================================================
       *
       * A division table can contain MANY citizen rows.
       *
       * Example:
       *
       * Ward 1
       * Ward 1
       * Ward 1
       * Ward 2
       * Ward 2
       *
       * We only need:
       *
       * Ward 1
       * Ward 2
       *
       * ======================================================
       */

      const wardRows =
        await masterCitizenPrisma
          .$queryRawUnsafe(
            `
              SELECT DISTINCT ON (ward_name)
                ward_name,
                geo_boundary
              FROM "${generatedDivisionTableName}"
              WHERE
                ward_name IS NOT NULL
                AND geo_boundary IS NOT NULL
              ORDER BY
                ward_name ASC
            `
          );


      /**
       * ======================================================
       * 11. BUILD WARDS
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
            (ward) => {

              return {

                wardName:
                  ward.ward_name,

                geoBoundary:
                  normalizeGeoBoundary(
                    ward.geo_boundary
                  ),

              };

            }
          );


      /**
       * ======================================================
       * 12. ADD DIVISION TO ZONE
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

    zones.push(
      zone
    );

  }


  /**
   * ==========================================================
   * 14. CALCULATE SUMMARY
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
   * 15. LOG FINAL RESULT
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
   * 16. RETURN
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

    summary: {

      totalZones,

      totalDivisions,

      totalWards,

    },

    zones,

  };

}


/**
 * ============================================================
 * GET ZONE DIVISIONS
 * ============================================================
 *
 * This function is used when the frontend explicitly requests
 * divisions for a selected zone.
 *
 * IMPORTANT:
 *
 * The supplied zone table is validated and used directly.
 *
 * BUT division tables are still generated from division_name.
 *
 * ============================================================
 */

async function getZoneDivisions(
  zoneTableName
) {

  /**
   * ==========================================================
   * 1. VALIDATE
   * ==========================================================
   */

  const safeZoneTableName =
    validateTableName(
      zoneTableName
    );


  /**
   * ==========================================================
   * 2. CHECK ZONE TABLE
   * ==========================================================
   */

  const exists =
    await tableExists(
      safeZoneTableName
    );


  if (
    !exists
  ) {

    throw new Error(
      `Zone table "${safeZoneTableName}" does not exist.`
    );

  }


  /**
   * ==========================================================
   * 3. FETCH DIVISIONS
   * ==========================================================
   */

  const divisionRows =
    await masterCitizenPrisma
      .$queryRawUnsafe(
        `
          SELECT DISTINCT ON (division_id)
            division_id,
            division_name,
            geo_boundary,
            division_table_name
          FROM "${safeZoneTableName}"
          WHERE
            division_name IS NOT NULL
          ORDER BY
            division_id ASC
        `
      );


  const divisions = [];


  /**
   * ==========================================================
   * 4. BUILD DIVISIONS
   * ==========================================================
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


    /**
     * ========================================================
     * CRITICAL FIX
     * ========================================================
     *
     * ALWAYS derive the division table from the division name.
     *
     * ========================================================
     */

    const generatedDivisionTableName =
      generateDivisionTableName(
        divisionName
      );


    const divisionExists =
      await tableExists(
        generatedDivisionTableName
      );


    /**
     * --------------------------------------------------------
     * DEBUG
     * --------------------------------------------------------
     */

    console.log(
      "📍 DIVISION:",
      divisionName
    );

    console.log(
      "   Stored table:",
      divisionRow.division_table_name
    );

    console.log(
      "   Generated table:",
      generatedDivisionTableName
    );


    /**
     * ========================================================
     * CREATE DIVISION
     * ========================================================
     */

    const division = {

      id:
        divisionRow.division_id !== null &&
        divisionRow.division_id !== undefined
          ? Number(
              divisionRow.division_id
            )
          : null,

      divisionName,

      geoBoundary:
        normalizeGeoBoundary(
          divisionRow.geo_boundary
        ),

      divisionTableName:
        generatedDivisionTableName,

      wards: [],

    };


    /**
     * ========================================================
     * 5. DIVISION TABLE DOES NOT EXIST
     * ========================================================
     */

    if (
      !divisionExists
    ) {

      console.error(
        `❌ Division table does not exist: "${generatedDivisionTableName}"`
      );


      divisions.push(
        division
      );


      continue;

    }


    /**
     * ========================================================
     * 6. FETCH UNIQUE WARDS
     * ========================================================
     */

    const wardRows =
      await masterCitizenPrisma
        .$queryRawUnsafe(
          `
            SELECT DISTINCT ON (ward_name)
              ward_name,
              geo_boundary
            FROM "${generatedDivisionTableName}"
            WHERE
              ward_name IS NOT NULL
              AND geo_boundary IS NOT NULL
            ORDER BY
              ward_name ASC
          `
        );


    /**
     * ========================================================
     * 7. BUILD WARDS
     * ========================================================
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
          (ward) => {

            return {

              wardName:
                ward.ward_name,

              geoBoundary:
                normalizeGeoBoundary(
                  ward.geo_boundary
                ),

            };

          }
        );


    /**
     * ========================================================
     * 8. ADD DIVISION
     * ========================================================
     */

    divisions.push(
      division
    );

  }


  /**
   * ==========================================================
   * 9. RETURN
   * ==========================================================
   */

  return {

    zoneTableName:
      safeZoneTableName,

    divisions,

  };

}


/**
 * ============================================================
 * GET DIVISION WARDS
 * ============================================================
 *
 * OPTIONAL DIRECT FUNCTION
 *
 * This is useful if your frontend/backend later wants:
 *
 * GET /division/:divisionTableName
 *
 * and wants ONLY wards.
 *
 * ============================================================
 */

async function getDivisionWards(
  divisionTableName
) {

  /**
   * ==========================================================
   * 1. VALIDATE
   * ==========================================================
   */

  const safeDivisionTableName =
    validateTableName(
      divisionTableName
    );


  /**
   * ==========================================================
   * 2. CHECK TABLE
   * ==========================================================
   */

  const exists =
    await tableExists(
      safeDivisionTableName
    );


  if (
    !exists
  ) {

    throw new Error(
      `Division table "${safeDivisionTableName}" does not exist.`
    );

  }


  /**
   * ==========================================================
   * 3. FETCH UNIQUE WARDS
   * ==========================================================
   */

  const wardRows =
    await masterCitizenPrisma
      .$queryRawUnsafe(
        `
          SELECT DISTINCT ON (ward_name)
            ward_name,
            geo_boundary
          FROM "${safeDivisionTableName}"
          WHERE
            ward_name IS NOT NULL
            AND geo_boundary IS NOT NULL
          ORDER BY
            ward_name ASC
        `
      );


  /**
   * ==========================================================
   * 4. FORMAT
   * ==========================================================
   */

  const wards =
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
        (ward) => {

          return {

            wardName:
              ward.ward_name,

            geoBoundary:
              normalizeGeoBoundary(
                ward.geo_boundary
              ),

          };

        }
      );


  /**
   * ==========================================================
   * 5. RETURN
   * ==========================================================
   */

  return {

    divisionTableName:
      safeDivisionTableName,

    wards,

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

  getDivisionWards,

};