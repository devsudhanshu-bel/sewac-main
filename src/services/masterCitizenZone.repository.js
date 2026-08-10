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
 * ZONE - CREATE
 * =====================================================
 */

async function createZone(cityTableName, data) {
  const query = `
    INSERT INTO "${cityTableName}"
    (
      zone_name,
      geo_boundary
    )
    VALUES
    (
      $1,
      $2::jsonb
    )
    RETURNING
      zone_id,
      zone_name,
      geo_boundary,
      total_divisions,
      total_wards,
      created_at,
      zone_table_name
  `;

  const result = await masterCitizenPrisma.$queryRawUnsafe(
    query,
    data.zoneName,
    JSON.stringify(data.geoBoundary ?? null)
  );

  return result[0];
}


/**
 * =====================================================
 * ZONE - GET ALL
 * =====================================================
 */

async function getZones(cityTableName) {
  const query = `
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
  `;

  return masterCitizenPrisma.$queryRawUnsafe(query);
}


/**
 * =====================================================
 * ZONE - GET ONE
 * =====================================================
 */

async function getZone(cityTableName, zoneId) {
  const query = `
    SELECT
      zone_id,
      zone_name,
      geo_boundary,
      total_divisions,
      total_wards,
      created_at,
      zone_table_name
    FROM "${cityTableName}"
    WHERE zone_id = $1
    LIMIT 1
  `;

  const result = await masterCitizenPrisma.$queryRawUnsafe(
    query,
    zoneId
  );

  return result[0] || null;
}


/**
 * =====================================================
 * ZONE - UPDATE
 * =====================================================
 *
 * IMPORTANT:
 *
 * We intentionally DO NOT change zone_table_name
 * when the Zone's display name changes.
 *
 * Example:
 *
 * East Zone
 *     ↓
 * Eastern Zone
 *
 * Physical table remains:
 *
 * east_zone
 */

async function updateZone(cityTableName, zoneId, data) {
  const fields = [];
  const values = [];
  let parameterIndex = 1;


  if (data.zoneName !== undefined) {
    fields.push(`zone_name = $${parameterIndex}`);
    values.push(data.zoneName);
    parameterIndex++;
  }


  if (data.geoBoundary !== undefined) {
    fields.push(`geo_boundary = $${parameterIndex}::jsonb`);
    values.push(JSON.stringify(data.geoBoundary));
    parameterIndex++;
  }


  if (fields.length === 0) {
    throw new Error("No fields provided for update");
  }


  values.push(zoneId);


  const query = `
    UPDATE "${cityTableName}"
    SET ${fields.join(", ")}
    WHERE zone_id = $${parameterIndex}
    RETURNING
      zone_id,
      zone_name,
      geo_boundary,
      total_divisions,
      total_wards,
      created_at,
      zone_table_name
  `;


  const result = await masterCitizenPrisma.$queryRawUnsafe(
    query,
    ...values
  );


  return result[0] || null;
}


/**
 * =====================================================
 * ZONE - DELETE
 * =====================================================
 */

async function deleteZone(cityTableName, zoneId) {
  const query = `
    DELETE FROM "${cityTableName}"
    WHERE zone_id = $1
    RETURNING
      zone_id,
      zone_name,
      geo_boundary,
      total_divisions,
      total_wards,
      created_at,
      zone_table_name
  `;

  const result = await masterCitizenPrisma.$queryRawUnsafe(
    query,
    zoneId
  );

  return result[0] || null;
}


module.exports = {
  findCityById,

  createZone,
  getZones,
  getZone,
  updateZone,
  deleteZone,
};