const repository = require("./masterCitizenZone.repository");

const {
  generateZoneTableName,
  createZoneTable,
  zoneTableExists,
  dropDynamicTable,
} = require("../utils/masterCitizenTables");


/**
 * =====================================================
 * CREATE ZONE
 * =====================================================
 */

async function createZone({
  cityId,
  zoneName,
  geoBoundary,
}) {

  if (!Number.isInteger(cityId)) {
    throw new Error("Invalid city ID");
  }


  if (!zoneName || typeof zoneName !== "string") {
    throw new Error("zoneName is required");
  }


  const cleanedZoneName = zoneName.trim();


  if (!cleanedZoneName) {
    throw new Error("zoneName cannot be empty");
  }


  /**
   * Find City.
   */
  const city = await repository.findCityById(cityId);


  if (!city) {
    throw new Error("City not found");
  }


  /**
   * The city must already have its
   * dynamic table initialized.
   */
  if (!city.city_table_name) {
    throw new Error(
      "City has not been initialized yet"
    );
  }


  const cityTableName = city.city_table_name;


  /**
   * Generate physical Zone table name.
   *
   * East Zone -> east_zone
   */
  const zoneTableName =
    generateZoneTableName(cleanedZoneName);


  /**
   * Prevent table-name collision.
   */
  const existingZoneTable =
    await zoneTableExists(zoneTableName);


  if (existingZoneTable) {
    throw new Error(
      `Zone table "${zoneTableName}" already exists`
    );
  }


  /**
   * Create Zone record inside the
   * City's dynamic table.
   */
  const zone = await repository.createZone(
    cityTableName,
    {
      zoneName: cleanedZoneName,
      geoBoundary,
    }
  );


  try {

    /**
     * Create the physical Zone table.
     */
    await createZoneTable(zoneTableName);


    /**
     * Store the physical table name
     * inside the City table.
     */
    const updatedZone =
      await repository.updateZone(
        cityTableName,
        zone.zone_id,
        {
          zoneName: cleanedZoneName,
          geoBoundary,
        }
      );


    /**
     * Directly update zone_table_name.
     */
    const masterCitizenPrisma =
      require("../config/masterCitizenPrisma");


    const result =
      await masterCitizenPrisma.$queryRawUnsafe(
        `
          UPDATE "${cityTableName}"
          SET zone_table_name = $1
          WHERE zone_id = $2
          RETURNING
            zone_id,
            zone_name,
            geo_boundary,
            total_divisions,
            total_wards,
            created_at,
            zone_table_name
        `,
        zoneTableName,
        zone.zone_id
      );


    return result[0];

  } catch (error) {

    /**
     * Roll back the Zone record if
     * dynamic table creation fails.
     */
    try {
      await repository.deleteZone(
        cityTableName,
        zone.zone_id
      );
    } catch (rollbackError) {
      console.error(
        "Zone rollback failed:",
        rollbackError
      );
    }


    throw error;
  }
}


/**
 * =====================================================
 * GET ALL ZONES
 * =====================================================
 */

async function getZones(cityId) {

  if (!Number.isInteger(cityId)) {
    throw new Error("Invalid city ID");
  }


  const city =
    await repository.findCityById(cityId);


  if (!city) {
    throw new Error("City not found");
  }


  if (!city.city_table_name) {
    throw new Error(
      "City has not been initialized yet"
    );
  }


  return repository.getZones(
    city.city_table_name
  );
}


/**
 * =====================================================
 * GET ONE ZONE
 * =====================================================
 */

async function getZone(cityId, zoneId) {

  if (!Number.isInteger(cityId)) {
    throw new Error("Invalid city ID");
  }


  if (!Number.isInteger(zoneId)) {
    throw new Error("Invalid zone ID");
  }


  const city =
    await repository.findCityById(cityId);


  if (!city) {
    throw new Error("City not found");
  }


  if (!city.city_table_name) {
    throw new Error(
      "City has not been initialized yet"
    );
  }


  const zone =
    await repository.getZone(
      city.city_table_name,
      zoneId
    );


  if (!zone) {
    throw new Error("Zone not found");
  }


  return zone;
}


/**
 * =====================================================
 * UPDATE ZONE
 * =====================================================
 */

async function updateZone(
  cityId,
  zoneId,
  data
) {

  if (!Number.isInteger(cityId)) {
    throw new Error("Invalid city ID");
  }


  if (!Number.isInteger(zoneId)) {
    throw new Error("Invalid zone ID");
  }


  if (
    data.zoneName === undefined &&
    data.geoBoundary === undefined
  ) {
    throw new Error(
      "Provide zoneName or geoBoundary"
    );
  }


  if (
    data.zoneName !== undefined &&
    (
      typeof data.zoneName !== "string" ||
      !data.zoneName.trim()
    )
  ) {
    throw new Error(
      "zoneName must be a non-empty string"
    );
  }


  const city =
    await repository.findCityById(cityId);


  if (!city) {
    throw new Error("City not found");
  }


  if (!city.city_table_name) {
    throw new Error(
      "City has not been initialized yet"
    );
  }


  const existingZone =
    await repository.getZone(
      city.city_table_name,
      zoneId
    );


  if (!existingZone) {
    throw new Error("Zone not found");
  }


  const updateData = {};


  if (data.zoneName !== undefined) {
    updateData.zoneName =
      data.zoneName.trim();
  }


  if (data.geoBoundary !== undefined) {
    updateData.geoBoundary =
      data.geoBoundary;
  }


  return repository.updateZone(
    city.city_table_name,
    zoneId,
    updateData
  );
}


/**
 * =====================================================
 * DELETE ZONE
 * =====================================================
 */

async function deleteZone(
  cityId,
  zoneId
) {

  if (!Number.isInteger(cityId)) {
    throw new Error("Invalid city ID");
  }


  if (!Number.isInteger(zoneId)) {
    throw new Error("Invalid zone ID");
  }


  const city =
    await repository.findCityById(cityId);


  if (!city) {
    throw new Error("City not found");
  }


  if (!city.city_table_name) {
    throw new Error(
      "City has not been initialized yet"
    );
  }


  const zone =
    await repository.getZone(
      city.city_table_name,
      zoneId
    );


  if (!zone) {
    throw new Error("Zone not found");
  }


  /**
   * For now, prevent deletion if the
   * Zone's dynamic table contains data.
   *
   * This becomes important once Divisions
   * are stored inside the Zone table.
   */
  if (zone.zone_table_name) {

    const masterCitizenPrisma =
      require("../config/masterCitizenPrisma");


    const countResult =
      await masterCitizenPrisma.$queryRawUnsafe(
        `
          SELECT COUNT(*)::int AS count
          FROM "${zone.zone_table_name}"
        `
      );


    const rowCount =
      countResult[0]?.count ?? 0;


    if (rowCount > 0) {
      throw new Error(
        "Zone cannot be deleted because it contains data"
      );
    }


    await dropDynamicTable(
      zone.zone_table_name
    );
  }


  await repository.deleteZone(
    city.city_table_name,
    zoneId
  );


  return {
    zone_id: zoneId,
    deleted: true,
  };
}


module.exports = {
  createZone,
  getZones,
  getZone,
  updateZone,
  deleteZone,
};