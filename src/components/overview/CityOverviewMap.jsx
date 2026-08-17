const masterCitizenPrisma =
  require("../config/masterCitizenPrisma");


// ============================================================
// TABLE NAME VALIDATION
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
// GEO BOUNDARY NORMALIZER
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
// CHECK TABLE EXISTS
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
// GET CITY MAP DATA
// ============================================================
//
// IMPORTANT:
//
// THIS ENDPOINT ONLY LOADS:
//
// CITY
//   ↓
// ZONES
//
// It does NOT load:
//
// divisions
// wards
// citizens
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


  // ----------------------------------------------------------
  // VALIDATE CITY TABLE
  // ----------------------------------------------------------

  const cityTableName =
    validateTableName(
      city.city_table_name
    );


  const cityExists =
    await tableExists(
      cityTableName
    );


  if (
    !cityExists
  ) {

    throw new Error(
      `City table "${cityTableName}" does not exist.`
    );

  }


  // ----------------------------------------------------------
  // FETCH ONLY ZONES
  // ----------------------------------------------------------

  const zoneRows =
    await masterCitizenPrisma.$queryRawUnsafe(
      `
        SELECT
          zone_id,
          zone_name,
          geo_boundary,
          zone_table_name
        FROM "${cityTableName}"
        WHERE
          zone_name IS NOT NULL
          AND TRIM(zone_name) <> ''
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

          let zoneTableName =
            null;


          if (
            zone.zone_table_name
          ) {

            zoneTableName =
              validateTableName(
                zone.zone_table_name
              );

          }


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

          };

        }
      )
      .filter(
        (
          zone
        ) =>
          zone.zoneName !== null &&
          zone.zoneName !== undefined &&
          String(
            zone.zoneName
          ).trim() !== ""
      );


  // ----------------------------------------------------------
  // LOG
  // ----------------------------------------------------------

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
// GET ZONE DIVISIONS
// ============================================================
//
// INPUT:
//
// zoneTableName
//
// Example:
//
// bengaluru_east_city_corporation_zone
//
// RETURNS:
//
// ONLY:
//
// Selected Zone
//   ↓
// Divisions
//   ↓
// Ward boundaries
//
// NO CITIZENS.
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
  // CHECK ZONE TABLE
  // ----------------------------------------------------------

  const zoneExists =
    await tableExists(
      safeZoneTableName
    );


  if (
    !zoneExists
  ) {

    throw new Error(
      `Zone table "${safeZoneTableName}" does not exist.`
    );

  }


  // ----------------------------------------------------------
  // FETCH DIVISIONS
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


  const divisions = [];


  // ----------------------------------------------------------
  // PROCESS DIVISIONS
  // ----------------------------------------------------------

  for (
    const divisionRow
    of divisionRows
  ) {

    const divisionName =
      divisionRow.division_name;


    if (
      !divisionName
    ) {

      continue;

    }


    // --------------------------------------------------------
    // IMPORTANT:
    //
    // USE THE TABLE NAME STORED IN THE ZONE TABLE.
    //
    // DO NOT GENERATE IT FROM division_name.
    // --------------------------------------------------------

    let divisionTableName =
      null;


    if (
      divisionRow.division_table_name
    ) {

      divisionTableName =
        validateTableName(
          divisionRow.division_table_name
        );

    }


    let wards = [];


    // --------------------------------------------------------
    // LOAD WARDS
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
                AND geo_boundary IS NOT NULL
              ORDER BY
                ward_id ASC
            `
          );


        // ----------------------------------------------------
        // REMOVE DUPLICATE WARD RECORDS
        // ----------------------------------------------------

        const seenWards =
          new Set();


        wards =
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
              ) => {

                let wardTableName =
                  null;


                if (
                  ward.ward_table_name
                ) {

                  wardTableName =
                    validateTableName(
                      ward.ward_table_name
                    );

                }


                return {

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

                  wardTableName,

                };

              }
            );

      }

    }


    // --------------------------------------------------------
    // ADD DIVISION
    // --------------------------------------------------------

    divisions.push({

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

      divisionTableName,

      totalWards:
        wards.length,

      wards,

    });

  }


  // ----------------------------------------------------------
  // TOTAL WARDS
  // ----------------------------------------------------------

  const totalWards =
    divisions.reduce(
      (
        total,
        division
      ) =>
        total +
        division.wards.length,
      0
    );


  // ----------------------------------------------------------
  // LOG
  // ----------------------------------------------------------

  console.log("");

  console.log(
    "============================================================"
  );

  console.log(
    "🏢 ZONE DIVISIONS"
  );

  console.log(
    "============================================================"
  );

  console.log(
    "Zone Table:",
    safeZoneTableName
  );

  console.log(
    "Divisions:",
    divisions.length
  );

  console.log(
    "Wards:",
    totalWards
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

    zoneTableName:
      safeZoneTableName,

    totalDivisions:
      divisions.length,

    totalWards,

    divisions,

  };

}


// ============================================================
// GET DIVISION WARDS
// ============================================================
//
// INPUT:
//
// divisionTableName
//
// RETURNS:
//
// ONLY wards belonging to that division.
//
// ============================================================

async function getDivisionWards(
  divisionTableName
) {

  // ----------------------------------------------------------
  // VALIDATE
  // ----------------------------------------------------------

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


  // ----------------------------------------------------------
  // CHECK TABLE
  // ----------------------------------------------------------

  const divisionExists =
    await tableExists(
      safeDivisionTableName
    );


  if (
    !divisionExists
  ) {

    throw new Error(
      `Division table "${safeDivisionTableName}" does not exist.`
    );

  }


  // ----------------------------------------------------------
  // FETCH WARDS
  // ----------------------------------------------------------

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
          AND geo_boundary IS NOT NULL
        ORDER BY
          ward_id ASC
      `
    );


  // ----------------------------------------------------------
  // REMOVE DUPLICATES
  // ----------------------------------------------------------

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
        ) => {

          let wardTableName =
            null;


          if (
            ward.ward_table_name
          ) {

            wardTableName =
              validateTableName(
                ward.ward_table_name
              );

          }


          return {

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

            wardTableName,

          };

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
    "📍 DIVISION WARDS"
  );

  console.log(
    "============================================================"
  );

  console.log(
    "Division Table:",
    safeDivisionTableName
  );

  console.log(
    "Wards:",
    wards.length
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