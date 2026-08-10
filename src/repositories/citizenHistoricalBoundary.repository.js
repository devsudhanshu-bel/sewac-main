const masterCitizenPrisma =
  require("../config/masterCitizenPrisma");


// =====================================================
// SQL IDENTIFIER VALIDATION
// =====================================================
//
// Dynamic Master Citizen tables are used for:
//
// City
//   ↓
// Zone
//   ↓
// Division
//   ↓
// Ward
//
// Table names MUST be validated before interpolation.
//
// =====================================================

function validateIdentifier(value) {
  if (
    typeof value !== "string" ||
    !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)
  ) {
    throw new Error(
      `Invalid SQL identifier: ${value}`
    );
  }

  return value;
}


// =====================================================
// CITY
// =====================================================
//
// Returns every city with its boundary.
//
// City is the first level of GPS resolution.
//
// =====================================================

async function getAllCities() {
  return masterCitizenPrisma.city_table.findMany({
    select: {
      city_id: true,
      city_name: true,
      geo_boundary: true,
      city_table_name: true,
    },

    orderBy: {
      city_id: "asc",
    },
  });
}


// =====================================================
// ZONES
// =====================================================
//
// The City table contains the Zone records.
//
// Example:
//
// Bangalore City
//      ↓
// city_table
//      ↓
// HSR Zone
//
// =====================================================

async function getZonesForCity(
  cityTableName
) {
  validateIdentifier(
    cityTableName
  );

  const query = `
    SELECT

      zone_id,

      zone_name,

      geo_boundary,

      zone_table_name

    FROM "${cityTableName}"

    ORDER BY zone_id ASC
  `;

  return masterCitizenPrisma.$queryRawUnsafe(
    query
  );
}


// =====================================================
// DIVISIONS
// =====================================================
//
// A Zone physical table contains its Divisions.
//
// =====================================================

async function getDivisionsForZone(
  zoneTableName
) {
  validateIdentifier(
    zoneTableName
  );

  const query = `
    SELECT

      division_id,

      division_name,

      geo_boundary,

      division_table_name

    FROM "${zoneTableName}"

    ORDER BY division_id ASC
  `;

  return masterCitizenPrisma.$queryRawUnsafe(
    query
  );
}


// =====================================================
// WARDS
// =====================================================
//
// A Division physical table contains its Wards.
//
// =====================================================

async function getWardsForDivision(
  divisionTableName
) {
  validateIdentifier(
    divisionTableName
  );

  const query = `
    SELECT

      ward_id,

      ward_no,

      ward_name,

      geo_boundary,

      ward_table_name

    FROM "${divisionTableName}"

    ORDER BY ward_no ASC
  `;

  return masterCitizenPrisma.$queryRawUnsafe(
    query
  );
}


// =====================================================
// GET COMPLETE BOUNDARY HIERARCHY
// =====================================================
//
// This is useful for building an in-memory resolver.
//
// Instead of querying the database for every telemetry
// packet, the historical worker can load the boundaries
// once and resolve thousands of GPS points in memory.
//
// =====================================================

async function getCompleteBoundaryHierarchy() {

  const cities =
    await getAllCities();


  const hierarchy = [];


  for (
    const city of cities
  ) {

    const cityEntry = {

      cityId:
        city.city_id,

      cityName:
        city.city_name,

      cityBoundary:
        city.geo_boundary,

      cityTableName:
        city.city_table_name,

      zones: [],

    };


    if (
      !city.city_table_name
    ) {
      hierarchy.push(
        cityEntry
      );

      continue;
    }


    const zones =
      await getZonesForCity(
        city.city_table_name
      );


    for (
      const zone of zones
    ) {

      const zoneEntry = {

        zoneId:
          zone.zone_id,

        zoneName:
          zone.zone_name,

        zoneBoundary:
          zone.geo_boundary,

        zoneTableName:
          zone.zone_table_name,

        divisions: [],

      };


      if (
        !zone.zone_table_name
      ) {
        cityEntry.zones.push(
          zoneEntry
        );

        continue;
      }


      const divisions =
        await getDivisionsForZone(
          zone.zone_table_name
        );


      for (
        const division of divisions
      ) {

        const divisionEntry = {

          divisionId:
            division.division_id,

          divisionName:
            division.division_name,

          divisionBoundary:
            division.geo_boundary,

          divisionTableName:
            division.division_table_name,

          wards: [],

        };


        if (
          !division.division_table_name
        ) {
          zoneEntry.divisions.push(
            divisionEntry
          );

          continue;
        }


        const wards =
          await getWardsForDivision(
            division.division_table_name
          );


        for (
          const ward of wards
        ) {

          divisionEntry.wards.push({

            wardId:
              ward.ward_id,

            wardNo:
              ward.ward_no,

            wardName:
              ward.ward_name,

            wardBoundary:
              ward.geo_boundary,

            wardTableName:
              ward.ward_table_name,

          });
        }


        zoneEntry.divisions.push(
          divisionEntry
        );
      }


      cityEntry.zones.push(
        zoneEntry
      );
    }


    hierarchy.push(
      cityEntry
    );
  }


  return hierarchy;
}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  validateIdentifier,

  getAllCities,

  getZonesForCity,

  getDivisionsForZone,

  getWardsForDivision,

  getCompleteBoundaryHierarchy,

};