const repository =
  require("./masterCitizenDivision.repository");

const {
  generateDivisionTableName,
  createDivisionTable,
  divisionTableExists,
  dropDynamicTable,
} = require("../utils/masterCitizenTables");

const masterCitizenPrisma =
  require("../config/masterCitizenPrisma");


/**
 * =====================================================
 * FIND ZONE INSIDE CITY
 * =====================================================
 */

async function findZone(cityTableName, zoneId) {
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
 * CREATE DIVISION
 * =====================================================
 */

async function createDivision({
  cityId,
  zoneId,
  divisionName,
  geoBoundary,
}) {

  if (!Number.isInteger(cityId)) {
    throw new Error("Invalid city ID");
  }


  if (!Number.isInteger(zoneId)) {
    throw new Error("Invalid zone ID");
  }


  if (
    !divisionName ||
    typeof divisionName !== "string"
  ) {
    throw new Error(
      "divisionName is required"
    );
  }


  const cleanedDivisionName =
    divisionName.trim();


  if (!cleanedDivisionName) {
    throw new Error(
      "divisionName cannot be empty"
    );
  }


  /**
   * Find City.
   */

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


  /**
   * Find Zone inside City.
   */

  const zone =
    await findZone(
      city.city_table_name,
      zoneId
    );


  if (!zone) {
    throw new Error("Zone not found");
  }


  if (!zone.zone_table_name) {
    throw new Error(
      "Zone has not been initialized yet"
    );
  }


  const zoneTableName =
    zone.zone_table_name;


  /**
   * Generate Division table.
   *
   * Division A
   *      ↓
   * division_a
   */

  const divisionTableName =
    generateDivisionTableName(
      cleanedDivisionName
    );


  /**
   * Check for physical table collision.
   */

  const tableAlreadyExists =
    await divisionTableExists(
      divisionTableName
    );


  if (tableAlreadyExists) {
    throw new Error(
      `Division table "${divisionTableName}" already exists`
    );
  }


  /**
   * Create Division record inside Zone table.
   */

  const division =
    await repository.createDivision(
      zoneTableName,
      {
        divisionName:
          cleanedDivisionName,

        geoBoundary,
      }
    );


  try {

    /**
     * Create physical Division table.
     */

    await createDivisionTable(
      divisionTableName
    );


    /**
     * Store physical table name.
     */

    const updatedDivision =
      await repository.updateDivisionTableName(
        zoneTableName,
        division.division_id,
        divisionTableName
      );


    /**
     * Increment City's total divisions.
     */

    await masterCitizenPrisma.$queryRawUnsafe(
      `
        UPDATE "${city.city_table_name}"
        SET total_divisions =
          COALESCE(total_divisions, 0) + 1
        WHERE zone_id = $1
      `,
      zoneId
    );


    return updatedDivision;

  } catch (error) {

    /**
     * Rollback Division record.
     */

    try {
      await repository.deleteDivision(
        zoneTableName,
        division.division_id
      );
    } catch (rollbackError) {
      console.error(
        "Division rollback failed:",
        rollbackError
      );
    }


    throw error;
  }
}


/**
 * =====================================================
 * GET ALL DIVISIONS
 * =====================================================
 */

async function getDivisions(
  cityId,
  zoneId
) {

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
    await findZone(
      city.city_table_name,
      zoneId
    );


  if (!zone) {
    throw new Error("Zone not found");
  }


  if (!zone.zone_table_name) {
    throw new Error(
      "Zone has not been initialized yet"
    );
  }


  return repository.getDivisions(
    zone.zone_table_name
  );
}


/**
 * =====================================================
 * GET ONE DIVISION
 * =====================================================
 */

async function getDivision(
  cityId,
  zoneId,
  divisionId
) {

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
    await findZone(
      city.city_table_name,
      zoneId
    );


  if (!zone) {
    throw new Error("Zone not found");
  }


  const division =
    await repository.getDivision(
      zone.zone_table_name,
      divisionId
    );


  if (!division) {
    throw new Error(
      "Division not found"
    );
  }


  return division;
}


/**
 * =====================================================
 * UPDATE DIVISION
 * =====================================================
 */

async function updateDivision(
  cityId,
  zoneId,
  divisionId,
  data
) {

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
    await findZone(
      city.city_table_name,
      zoneId
    );


  if (!zone) {
    throw new Error("Zone not found");
  }


  const existingDivision =
    await repository.getDivision(
      zone.zone_table_name,
      divisionId
    );


  if (!existingDivision) {
    throw new Error(
      "Division not found"
    );
  }


  if (
    data.divisionName !== undefined
  ) {

    if (
      typeof data.divisionName !== "string" ||
      !data.divisionName.trim()
    ) {
      throw new Error(
        "divisionName must be a non-empty string"
      );
    }


    data.divisionName =
      data.divisionName.trim();
  }


  return repository.updateDivision(
    zone.zone_table_name,
    divisionId,
    data
  );
}


/**
 * =====================================================
 * DELETE DIVISION
 * =====================================================
 */

async function deleteDivision(
  cityId,
  zoneId,
  divisionId
) {

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
    await findZone(
      city.city_table_name,
      zoneId
    );


  if (!zone) {
    throw new Error("Zone not found");
  }


  const division =
    await repository.getDivision(
      zone.zone_table_name,
      divisionId
    );


  if (!division) {
    throw new Error(
      "Division not found"
    );
  }


  /**
   * Don't delete a Division if its
   * dynamic table already contains Wards.
   */

  if (division.division_table_name) {

    const result =
      await masterCitizenPrisma.$queryRawUnsafe(
        `
          SELECT COUNT(*)::int AS count
          FROM "${division.division_table_name}"
        `
      );


    const rowCount =
      result[0]?.count ?? 0;


    if (rowCount > 0) {
      throw new Error(
        "Division cannot be deleted because it contains data"
      );
    }


    await dropDynamicTable(
      division.division_table_name
    );
  }


  await repository.deleteDivision(
    zone.zone_table_name,
    divisionId
  );


  /**
   * Decrease total divisions.
   */

  await masterCitizenPrisma.$queryRawUnsafe(
    `
      UPDATE "${city.city_table_name}"
      SET total_divisions =
        GREATEST(
          COALESCE(total_divisions, 0) - 1,
          0
        )
      WHERE zone_id = $1
    `,
    zoneId
  );


  return {
    division_id: divisionId,
    deleted: true,
  };
}


module.exports = {
  createDivision,
  getDivisions,
  getDivision,
  updateDivision,
  deleteDivision,
};