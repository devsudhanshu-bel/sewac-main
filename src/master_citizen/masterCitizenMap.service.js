const masterCitizenPrisma =
  require("../config/masterCitizenPrisma");


// ============================================================
// HELPERS
// ============================================================

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


// ============================================================
// GEOJSON NORMALIZER
// ============================================================

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

    } catch {

      return null;

    }

  }


  return value;

}


// ============================================================
// TABLE EXISTS
// ============================================================

async function tableExists(
  tableName
) {

  const safeTableName =
    validateTableName(
      tableName
    );


  const result =
    await masterCitizenPrisma.$queryRawUnsafe(
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


// ============================================================
// GET CITY MAP
// ============================================================
//
// IMPORTANT:
//
// This endpoint returns:
//
// CITY
//   ↓
// ZONES
//
// It does NOT load divisions and wards.
//
// This keeps the initial payload small.
//
// ============================================================

async function getCityMapData(
  cityId
) {

  // ----------------------------------------------------------
  // VALIDATE CITY ID
  // ----------------------------------------------------------

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
    Number(
      cityId
    );


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


  // ----------------------------------------------------------
  // FETCH CITY
  // ----------------------------------------------------------

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


  // ----------------------------------------------------------
  // CITY TABLE
  // ----------------------------------------------------------

  const cityTableName =
    validateTableName(
      city.city_table_name
    );


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


  // ----------------------------------------------------------
  // FETCH ZONES
  // ----------------------------------------------------------

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
        WHERE
          zone_name IS NOT NULL
        ORDER BY
          zone_id ASC
      `
    );


  // ----------------------------------------------------------
  // FORMAT ZONES
  // ----------------------------------------------------------

  const zones =
    zoneRows
      .map(
        (
          zone
        ) => {

          const zoneTableName =
            zone.zone_table_name
              ? validateTableName(
                  zone.zone_table_name
                )
              : null;


          return {

            id:
              zone.zone_id !== null &&
              zone.zone_id !== undefined
                ? Number(
                    zone.zone_id
                  )
                : null,

            zoneName:
              zone.zone_name,

            geoBoundary:
              normalizeGeoBoundary(
                zone.geo_boundary
              ),

            zoneTableName,

            totalDivisions:
              zone.total_divisions !== null &&
              zone.total_divisions !== undefined
                ? Number(
                    zone.total_divisions
                  )
                : 0,

            totalWards:
              zone.total_wards !== null &&
              zone.total_wards !== undefined
                ? Number(
                    zone.total_wards
                  )
                : 0,

            createdAt:
              zone.created_at ||
              null,

          };

        }
      )
      .filter(
        (
          zone
        ) => {

          return (
            zone.zoneName !== null &&
            zone.zoneName !== undefined &&
            String(
              zone.zoneName
            ).trim() !== ""
          );

        }
      );


  // ----------------------------------------------------------
  // LOG
  // ----------------------------------------------------------

  console.log("");

  console.log(
    "============================================================"
  );

  console.log(
    "🗺️ CITY MAP"
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
    zones.length
  );

  console.log(
    "Divisions:",
    "NOT LOADED"
  );

  console.log(
    "Wards:",
    "NOT LOADED"
  );

  console.log(
    "Citizen data:",
    "NOT LOADED"
  );

  console.log(
    "============================================================"
  );


  // ----------------------------------------------------------
  // RETURN
  // ----------------------------------------------------------

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

      cityTableName,

    },

    zones,

    summary: {

      totalZones:
        zones.length,

      totalDivisions:
        0,

      totalWards:
        0,

    },

  };

}


// ============================================================
// GET DIVISIONS FOR ONE SPECIFIC ZONE
// ============================================================
//
// THIS IS THE IMPORTANT PART.
//
// We receive the EXACT zone table name.
//
// Example:
//
// bengaluru_east_city_corporation_zone
//
// We open ONLY that table.
//
// Therefore:
//
// East Zone
//    ↓
// East Zone Table
//    ↓
// ONLY East divisions
//
// ============================================================

async function getZoneDivisions(
  zoneTableName
) {

  // ----------------------------------------------------------
  // VALIDATE
  // ----------------------------------------------------------

  if (
    !zoneTableName
  ) {

    throw new Error(
      "Zone table name is required."
    );

  }


  const safeZoneTableName =
    validateTableName(
      zoneTableName
    );


  // ----------------------------------------------------------
  // CHECK TABLE
  // ----------------------------------------------------------

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


  console.log("");

  console.log(
    "============================================================"
  );

  console.log(
    "🏢 ZONE DIVISION REQUEST"
  );

  console.log(
    "============================================================"
  );

  console.log(
    "Zone Table:",
    safeZoneTableName
  );


  // ----------------------------------------------------------
  // FETCH ONLY THIS ZONE'S DIVISIONS
  // ----------------------------------------------------------

  const divisionRows =
    await masterCitizenPrisma.$queryRawUnsafe(
      `
        SELECT
          division_id,
          division_name,
          geo_boundary,
          division_table_name
        FROM "${safeZoneTableName}"
        WHERE
          division_name IS NOT NULL
          AND TRIM(division_name) <> ''
        ORDER BY
          division_id ASC
      `
    );


  // ----------------------------------------------------------
  // FORMAT
  // ----------------------------------------------------------

  const divisions = [];


  for (
    const row
    of divisionRows
  ) {

    const divisionName =
      row.division_name;


    if (
      !divisionName
    ) {

      continue;

    }


    // --------------------------------------------------------
    // USE THE STORED TABLE NAME
    //
    // DO NOT GENERATE IT.
    //
    // The zone table explicitly tells us which division
    // table belongs to this division.
    // --------------------------------------------------------

    let divisionTableName =
      null;


    if (
      row.division_table_name
    ) {

      divisionTableName =
        validateTableName(
          row.division_table_name
        );

    }


    const division = {

      id:
        row.division_id !== null &&
        row.division_id !== undefined
          ? Number(
              row.division_id
            )
          : null,

      divisionName,

      geoBoundary:
        normalizeGeoBoundary(
          row.geo_boundary
        ),

      divisionTableName,

      wards: [],

    };


    // --------------------------------------------------------
    // FETCH WARDS ONLY FROM THIS DIVISION TABLE
    // --------------------------------------------------------

    if (
      divisionTableName
    ) {

      const divisionExists =
        await tableExists(
          divisionTableName
        );


      if (
        divisionExists
      ) {

        const wardRows =
          await masterCitizenPrisma.$queryRawUnsafe(
            `
              SELECT
                ward_id,
                ward_name,
                geo_boundary,
                ward_table_name
              FROM "${divisionTableName}"
              WHERE
                ward_name IS NOT NULL
                AND TRIM(ward_name) <> ''
              ORDER BY
                ward_id ASC
            `
          );


        const seenWards =
          new Set();


        division.wards =
          wardRows
            .filter(
              (
                ward
              ) => {

                const key =
                  String(
                    ward.ward_id ??
                    ward.ward_name
                  );


                if (
                  seenWards.has(
                    key
                  )
                ) {

                  return false;

                }


                seenWards.add(
                  key
                );

                return true;

              }
            )
            .map(
              (
                ward
              ) => ({

                id:
                  ward.ward_id !== null &&
                  ward.ward_id !== undefined
                    ? Number(
                        ward.ward_id
                      )
                    : null,

                wardName:
                  ward.ward_name,

                geoBoundary:
                  normalizeGeoBoundary(
                    ward.geo_boundary
                  ),

                wardTableName:
                  ward.ward_table_name
                    ? validateTableName(
                        ward.ward_table_name
                      )
                    : null,

              })
            );

      }

    }


    divisions.push(
      division
    );

  }


  // ----------------------------------------------------------
  // LOG
  // ----------------------------------------------------------

  console.log(
    "Divisions Loaded:",
    divisions.length
  );


  console.log(
    "Division Names:"
  );


  divisions.forEach(
    (
      division,
      index
    ) => {

      console.log(
        `  ${index + 1}. ${division.divisionName}`
      );

    }
  );


  console.log(
    "============================================================"
  );


  // ----------------------------------------------------------
  // RETURN
  // ----------------------------------------------------------

  return {

    success:
      true,

    zoneTableName:
      safeZoneTableName,

    totalDivisions:
      divisions.length,

    totalWards:
      divisions.reduce(
        (
          total,
          division
        ) =>
          total +
          division.wards.length,
        0
      ),

    divisions,

  };

}


// ============================================================
// GET WARDS FOR ONE SPECIFIC DIVISION
// ============================================================
//
// This is intentionally separate.
//
// Division selected
//       ↓
// exact divisionTableName
//       ↓
// ONLY its wards
//
// ============================================================

async function getDivisionWards(
  divisionTableName
) {

  if (
    !divisionTableName
  ) {

    throw new Error(
      "Division table name is required."
    );

  }


  const safeDivisionTableName =
    validateTableName(
      divisionTableName
    );


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


  const wardRows =
    await masterCitizenPrisma.$queryRawUnsafe(
      `
        SELECT
          ward_id,
          ward_name,
          geo_boundary,
          ward_table_name
        FROM "${safeDivisionTableName}"
        WHERE
          ward_name IS NOT NULL
          AND TRIM(ward_name) <> ''
        ORDER BY
          ward_id ASC
      `
    );


  const seen =
    new Set();


  const wards =
    wardRows
      .filter(
        (
          ward
        ) => {

          const key =
            String(
              ward.ward_id ??
              ward.ward_name
            );


          if (
            seen.has(
              key
            )
          ) {

            return false;

          }


          seen.add(
            key
          );

          return true;

        }
      )
      .map(
        (
          ward
        ) => ({

          id:
            ward.ward_id !== null &&
            ward.ward_id !== undefined
              ? Number(
                  ward.ward_id
                )
              : null,

          wardName:
            ward.ward_name,

          geoBoundary:
            normalizeGeoBoundary(
              ward.geo_boundary
            ),

          wardTableName:
            ward.ward_table_name
              ? validateTableName(
                  ward.ward_table_name
                )
              : null,

        })
      );


  return {

    success:
      true,

    divisionTableName:
      safeDivisionTableName,

    totalWards:
      wards.length,

    wards,

  };

}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

  getCityMapData,

  getZoneDivisions,

  getDivisionWards,

};