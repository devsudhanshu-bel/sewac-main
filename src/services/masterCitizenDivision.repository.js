const masterCitizenPrisma = require("../config/masterCitizenPrisma");


/**
 * =====================================================
 * CITY
 * =====================================================
 */

async function findCityById(cityId) {
  return masterCitizenPrisma.city_table.findUnique({
    where: {
      city_id: cityId,
    },
  });
}


/**
 * =====================================================
 * ZONE
 * =====================================================
 *
 * The Zone exists as a physical dynamic table.
 *
 * We therefore check the city table first and then
 * access the Zone table dynamically.
 */


/**
 * =====================================================
 * DIVISION - CREATE
 * =====================================================
 */

async function createDivision(zoneTableName, data) {
  const query = `
    INSERT INTO "${zoneTableName}"
    (
      division_name,
      geo_boundary
    )
    VALUES
    (
      $1,
      $2::jsonb
    )
    RETURNING
      division_id,
      division_name,
      geo_boundary,
      created_at,
      division_table_name
  `;

  const result =
    await masterCitizenPrisma.$queryRawUnsafe(
      query,
      data.divisionName,
      JSON.stringify(data.geoBoundary ?? null)
    );

  return result[0];
}


/**
 * =====================================================
 * DIVISION - GET ALL
 * =====================================================
 */

async function getDivisions(zoneTableName) {
  const query = `
    SELECT
      division_id,
      division_name,
      geo_boundary,
      created_at,
      division_table_name
    FROM "${zoneTableName}"
    ORDER BY division_id ASC
  `;

  return masterCitizenPrisma.$queryRawUnsafe(query);
}


/**
 * =====================================================
 * DIVISION - GET ONE
 * =====================================================
 */

async function getDivision(
  zoneTableName,
  divisionId
) {
  const query = `
    SELECT
      division_id,
      division_name,
      geo_boundary,
      created_at,
      division_table_name
    FROM "${zoneTableName}"
    WHERE division_id = $1
    LIMIT 1
  `;

  const result =
    await masterCitizenPrisma.$queryRawUnsafe(
      query,
      divisionId
    );

  return result[0] || null;
}


/**
 * =====================================================
 * DIVISION - UPDATE
 * =====================================================
 *
 * Updating the Division name does NOT change
 * division_table_name.
 */

async function updateDivision(
  zoneTableName,
  divisionId,
  data
) {
  const fields = [];
  const values = [];
  let parameterIndex = 1;


  if (data.divisionName !== undefined) {
    fields.push(
      `division_name = $${parameterIndex}`
    );

    values.push(data.divisionName);

    parameterIndex++;
  }


  if (data.geoBoundary !== undefined) {
    fields.push(
      `geo_boundary = $${parameterIndex}::jsonb`
    );

    values.push(
      JSON.stringify(data.geoBoundary)
    );

    parameterIndex++;
  }


  if (fields.length === 0) {
    throw new Error(
      "No fields provided for update"
    );
  }


  values.push(divisionId);


  const query = `
    UPDATE "${zoneTableName}"
    SET ${fields.join(", ")}
    WHERE division_id = $${parameterIndex}
    RETURNING
      division_id,
      division_name,
      geo_boundary,
      created_at,
      division_table_name
  `;


  const result =
    await masterCitizenPrisma.$queryRawUnsafe(
      query,
      ...values
    );


  return result[0] || null;
}


/**
 * =====================================================
 * DIVISION - DELETE
 * =====================================================
 */

async function deleteDivision(
  zoneTableName,
  divisionId
) {
  const query = `
    DELETE FROM "${zoneTableName}"
    WHERE division_id = $1
    RETURNING
      division_id,
      division_name,
      geo_boundary,
      created_at,
      division_table_name
  `;

  const result =
    await masterCitizenPrisma.$queryRawUnsafe(
      query,
      divisionId
    );

  return result[0] || null;
}


/**
 * =====================================================
 * UPDATE DIVISION TABLE NAME
 * =====================================================
 */

async function updateDivisionTableName(
  zoneTableName,
  divisionId,
  tableName
) {
  const query = `
    UPDATE "${zoneTableName}"
    SET division_table_name = $1
    WHERE division_id = $2
    RETURNING
      division_id,
      division_name,
      geo_boundary,
      created_at,
      division_table_name
  `;

  const result =
    await masterCitizenPrisma.$queryRawUnsafe(
      query,
      tableName,
      divisionId
    );

  return result[0] || null;
}


/**
 * =====================================================
 * UPDATE ZONE COUNTER
 * =====================================================
 */

async function updateZoneDivisionCount(
  zoneTableName,
  totalDivisions
) {
  // No-op here because total_divisions lives
  // in the City table, not the Zone table.
  //
  // The counter will be updated by the service
  // through the parent City table.
}


module.exports = {
  findCityById,

  createDivision,
  getDivisions,
  getDivision,
  updateDivision,
  deleteDivision,

  updateDivisionTableName,
  updateZoneDivisionCount,
};