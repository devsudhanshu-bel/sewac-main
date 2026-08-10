const masterCitizenPrisma =
  require("../config/masterCitizenPrisma");

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
 * FIND ZONE
 * =====================================================
 */

async function findZone(
  cityTableName,
  zoneId
) {
  const query = `
    SELECT
      zone_id,
      zone_name,
      zone_table_name
    FROM "${cityTableName}"
    WHERE zone_id = $1
    LIMIT 1
  `;

  const result =
    await masterCitizenPrisma.$queryRawUnsafe(
      query,
      zoneId
    );

  return result[0] || null;
}


/**
 * =====================================================
 * FIND DIVISION
 * =====================================================
 */

async function findDivision(
  zoneTableName,
  divisionId
) {
  const query = `
    SELECT
      division_id,
      division_name,
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
 * CREATE WARD
 * =====================================================
 */

async function createWard(
  divisionTableName,
  data
) {
  const query = `
    INSERT INTO "${divisionTableName}"
    (
      ward_no,
      ward_name,
      geo_boundary
    )
    VALUES
    (
      $1,
      $2,
      $3::jsonb
    )
    RETURNING
      ward_id,
      ward_no,
      ward_name,
      geo_boundary,
      created_at,
      ward_table_name
  `;

  const result =
    await masterCitizenPrisma.$queryRawUnsafe(
      query,
      data.wardNo,
      data.wardName,
      JSON.stringify(
        data.geoBoundary ?? null
      )
    );

  return result[0];
}


/**
 * =====================================================
 * GET ALL WARDS
 * =====================================================
 */

async function getWards(
  divisionTableName
) {
  const query = `
    SELECT
      ward_id,
      ward_no,
      ward_name,
      geo_boundary,
      created_at,
      ward_table_name
    FROM "${divisionTableName}"
    ORDER BY ward_no ASC
  `;

  return masterCitizenPrisma.$queryRawUnsafe(
    query
  );
}


/**
 * =====================================================
 * GET ONE WARD BY WARD NUMBER
 * =====================================================
 *
 * ward_no is the business identifier.
 *
 * Example:
 *
 * ward_no = 25
 *
 * This is used by:
 *
 * GET /wards/no/:wardNo
 */

async function getWardByNumber(
  divisionTableName,
  wardNo
) {
  const query = `
    SELECT
      ward_id,
      ward_no,
      ward_name,
      geo_boundary,
      created_at,
      ward_table_name
    FROM "${divisionTableName}"
    WHERE ward_no = $1
    LIMIT 1
  `;

  const result =
    await masterCitizenPrisma.$queryRawUnsafe(
      query,
      wardNo
    );

  return result[0] || null;
}


/**
 * =====================================================
 * GET ONE WARD BY INTERNAL WARD ID
 * =====================================================
 *
 * This is different from ward_no.
 *
 * ward_id:
 * Internal database primary key.
 *
 * ward_no:
 * Business-facing ward number.
 *
 * PATCH and DELETE use ward_id.
 */

async function getWardById(
  divisionTableName,
  wardId
) {
  const query = `
    SELECT
      ward_id,
      ward_no,
      ward_name,
      geo_boundary,
      created_at,
      ward_table_name
    FROM "${divisionTableName}"
    WHERE ward_id = $1
    LIMIT 1
  `;

  const result =
    await masterCitizenPrisma.$queryRawUnsafe(
      query,
      wardId
    );

  return result[0] || null;
}


/**
 * =====================================================
 * UPDATE WARD
 * =====================================================
 *
 * PATCH uses the internal ward_id.
 *
 * Updating:
 *
 * - ward_no
 * - ward_name
 * - geo_boundary
 *
 * does NOT automatically rename the physical
 * ward_table_name.
 */

async function updateWard(
  divisionTableName,
  wardId,
  data
) {
  const fields = [];
  const values = [];

  let parameterIndex = 1;


/**
 * -----------------------------------------------------
 * WARD NUMBER
 * -----------------------------------------------------
 */

  if (
    data.wardNo !== undefined
  ) {
    fields.push(
      `ward_no = $${parameterIndex}`
    );

    values.push(
      data.wardNo
    );

    parameterIndex++;
  }


/**
 * -----------------------------------------------------
 * WARD NAME
 * -----------------------------------------------------
 */

  if (
    data.wardName !== undefined
  ) {
    fields.push(
      `ward_name = $${parameterIndex}`
    );

    values.push(
      data.wardName
    );

    parameterIndex++;
  }


/**
 * -----------------------------------------------------
 * GEO BOUNDARY
 * -----------------------------------------------------
 */

  if (
    data.geoBoundary !== undefined
  ) {
    fields.push(
      `geo_boundary = $${parameterIndex}::jsonb`
    );

    values.push(
      JSON.stringify(
        data.geoBoundary
      )
    );

    parameterIndex++;
  }


/**
 * -----------------------------------------------------
 * NOTHING TO UPDATE
 * -----------------------------------------------------
 */

  if (
    fields.length === 0
  ) {
    throw new Error(
      "No fields provided for update"
    );
  }


/**
 * -----------------------------------------------------
 * WARD ID
 * -----------------------------------------------------
 */

  values.push(
    wardId
  );


/**
 * -----------------------------------------------------
 * UPDATE
 * -----------------------------------------------------
 */

  const query = `
    UPDATE "${divisionTableName}"
    SET ${fields.join(", ")}
    WHERE ward_id = $${parameterIndex}
    RETURNING
      ward_id,
      ward_no,
      ward_name,
      geo_boundary,
      created_at,
      ward_table_name
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
 * UPDATE WARD TABLE NAME
 * =====================================================
 */

async function updateWardTableName(
  divisionTableName,
  wardId,
  tableName
) {
  const query = `
    UPDATE "${divisionTableName}"
    SET ward_table_name = $1
    WHERE ward_id = $2
    RETURNING
      ward_id,
      ward_no,
      ward_name,
      geo_boundary,
      created_at,
      ward_table_name
  `;

  const result =
    await masterCitizenPrisma.$queryRawUnsafe(
      query,
      tableName,
      wardId
    );

  return result[0] || null;
}


/**
 * =====================================================
 * DELETE WARD
 * =====================================================
 */

async function deleteWard(
  divisionTableName,
  wardId
) {
  const query = `
    DELETE FROM "${divisionTableName}"
    WHERE ward_id = $1
    RETURNING
      ward_id,
      ward_no,
      ward_name,
      geo_boundary,
      created_at,
      ward_table_name
  `;

  const result =
    await masterCitizenPrisma.$queryRawUnsafe(
      query,
      wardId
    );

  return result[0] || null;
}


/**
 * =====================================================
 * EXPORTS
 * =====================================================
 */

module.exports = {
  findCityById,
  findZone,
  findDivision,

  createWard,

  getWards,

  getWardByNumber,
  getWardById,

  updateWard,
  updateWardTableName,

  deleteWard,
};