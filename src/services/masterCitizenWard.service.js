const repository =
  require("./masterCitizenWard.repository");

const {
  generateWardTableName,
  createWardTable,
  wardTableExists,
  dropDynamicTable,
} = require("../utils/masterCitizenTables");

const masterCitizenPrisma =
  require("../config/masterCitizenPrisma");


/**
 * =====================================================
 * CREATE WARD
 * =====================================================
 */

async function createWard({
  cityId,
  zoneId,
  divisionId,
  wardNo,
  wardName,
  geoBoundary,
}) {

  /**
   * -----------------------------------------------------
   * VALIDATION
   * -----------------------------------------------------
   */

  if (!Number.isInteger(cityId)) {
    throw new Error(
      "Invalid city ID"
    );
  }

  if (!Number.isInteger(zoneId)) {
    throw new Error(
      "Invalid zone ID"
    );
  }

  if (!Number.isInteger(divisionId)) {
    throw new Error(
      "Invalid division ID"
    );
  }

  if (
    !Number.isInteger(wardNo) ||
    wardNo <= 0
  ) {
    throw new Error(
      "wardNo must be a positive integer"
    );
  }

  if (
    !wardName ||
    typeof wardName !== "string"
  ) {
    throw new Error(
      "wardName is required"
    );
  }

  const cleanedWardName =
    wardName.trim();

  if (!cleanedWardName) {
    throw new Error(
      "wardName cannot be empty"
    );
  }


  /**
   * -----------------------------------------------------
   * FIND CITY
   * -----------------------------------------------------
   */

  const city =
    await repository.findCityById(
      cityId
    );

  if (!city) {
    throw new Error(
      "City not found"
    );
  }

  if (!city.city_table_name) {
    throw new Error(
      "City has not been initialized yet"
    );
  }


  /**
   * -----------------------------------------------------
   * FIND ZONE
   * -----------------------------------------------------
   */

  const zone =
    await repository.findZone(
      city.city_table_name,
      zoneId
    );

  if (!zone) {
    throw new Error(
      "Zone not found"
    );
  }

  if (!zone.zone_table_name) {
    throw new Error(
      "Zone has not been initialized yet"
    );
  }


  /**
   * -----------------------------------------------------
   * FIND DIVISION
   * -----------------------------------------------------
   */

  const division =
    await repository.findDivision(
      zone.zone_table_name,
      divisionId
    );

  if (!division) {
    throw new Error(
      "Division not found"
    );
  }

  if (!division.division_table_name) {
    throw new Error(
      "Division has not been initialized yet"
    );
  }


  /**
   * -----------------------------------------------------
   * GENERATE WARD TABLE NAME
   * -----------------------------------------------------
   */

  const wardTableName =
    generateWardTableName(
      cleanedWardName,
      wardNo
    );


  /**
   * -----------------------------------------------------
   * CHECK PHYSICAL TABLE COLLISION
   * -----------------------------------------------------
   */

  const tableAlreadyExists =
    await wardTableExists(
      wardTableName
    );

  if (tableAlreadyExists) {
    throw new Error(
      `Ward table "${wardTableName}" already exists`
    );
  }


  /**
   * -----------------------------------------------------
   * CHECK DUPLICATE WARD NUMBER
   * -----------------------------------------------------
   */

  const existingWards =
    await repository.getWards(
      division.division_table_name
    );

  const duplicateWard =
    existingWards.find(
      (ward) =>
        Number(ward.ward_no) === wardNo
    );

  if (duplicateWard) {
    throw new Error(
      `Ward number ${wardNo} already exists in this division`
    );
  }


  /**
   * -----------------------------------------------------
   * CREATE REGISTRY RECORD
   * -----------------------------------------------------
   */

  const ward =
    await repository.createWard(
      division.division_table_name,
      {
        wardNo,
        wardName:
          cleanedWardName,
        geoBoundary,
      }
    );


  try {

    /**
     * ---------------------------------------------------
     * CREATE PHYSICAL WARD TABLE
     * ---------------------------------------------------
     */

    await createWardTable(
      wardTableName
    );


    /**
     * ---------------------------------------------------
     * SAVE PHYSICAL TABLE NAME
     * ---------------------------------------------------
     */

    const updatedWard =
      await repository.updateWardTableName(
        division.division_table_name,
        ward.ward_id,
        wardTableName
      );


    /**
     * ---------------------------------------------------
     * UPDATE ZONE WARD COUNTER
     * ---------------------------------------------------
     */

    await masterCitizenPrisma.$queryRawUnsafe(
      `
        UPDATE "${city.city_table_name}"
        SET total_wards =
          COALESCE(total_wards, 0) + 1
        WHERE zone_id = $1
      `,
      zoneId
    );


    return updatedWard;

  } catch (error) {

    /**
     * ---------------------------------------------------
     * ROLLBACK REGISTRY RECORD
     * ---------------------------------------------------
     */

    try {
      await repository.deleteWard(
        division.division_table_name,
        ward.ward_id
      );
    } catch (rollbackError) {
      console.error(
        "Ward rollback failed:",
        rollbackError
      );
    }

    throw error;
  }
}


/**
 * =====================================================
 * GET ALL WARDS
 * =====================================================
 */

async function getWards(
  cityId,
  zoneId,
  divisionId
) {

  const city =
    await repository.findCityById(
      cityId
    );

  if (!city) {
    throw new Error(
      "City not found"
    );
  }

  if (!city.city_table_name) {
    throw new Error(
      "City has not been initialized yet"
    );
  }


  const zone =
    await repository.findZone(
      city.city_table_name,
      zoneId
    );

  if (!zone) {
    throw new Error(
      "Zone not found"
    );
  }

  if (!zone.zone_table_name) {
    throw new Error(
      "Zone has not been initialized yet"
    );
  }


  const division =
    await repository.findDivision(
      zone.zone_table_name,
      divisionId
    );

  if (!division) {
    throw new Error(
      "Division not found"
    );
  }

  if (!division.division_table_name) {
    throw new Error(
      "Division has not been initialized yet"
    );
  }


  return repository.getWards(
    division.division_table_name
  );
}


/**
 * =====================================================
 * GET ONE WARD BY WARD NUMBER
 * =====================================================
 */

async function getWard(
  cityId,
  zoneId,
  divisionId,
  wardNo
) {

  if (
    !Number.isInteger(wardNo) ||
    wardNo <= 0
  ) {
    throw new Error(
      "Invalid ward number"
    );
  }


  const city =
    await repository.findCityById(
      cityId
    );

  if (!city) {
    throw new Error(
      "City not found"
    );
  }

  if (!city.city_table_name) {
    throw new Error(
      "City has not been initialized yet"
    );
  }


  const zone =
    await repository.findZone(
      city.city_table_name,
      zoneId
    );

  if (!zone) {
    throw new Error(
      "Zone not found"
    );
  }

  if (!zone.zone_table_name) {
    throw new Error(
      "Zone has not been initialized yet"
    );
  }


  const division =
    await repository.findDivision(
      zone.zone_table_name,
      divisionId
    );

  if (!division) {
    throw new Error(
      "Division not found"
    );
  }

  if (!division.division_table_name) {
    throw new Error(
      "Division has not been initialized yet"
    );
  }


  const ward =
    await repository.getWardByNumber(
      division.division_table_name,
      wardNo
    );

  if (!ward) {
    throw new Error(
      "Ward not found"
    );
  }


  return ward;
}


/**
 * =====================================================
 * UPDATE WARD
 * =====================================================
 *
 * PATCH uses ward_id.
 *
 * Example:
 *
 * PATCH
 * /cities/1/zones/2/divisions/1/wards/2
 *
 * ward_id = 2
 *
 * The ward_no can remain 25.
 *
 * If wardNo is changed, we make sure another
 * ward does not already use that number.
 */

async function updateWard(
  cityId,
  zoneId,
  divisionId,
  wardId,
  data
) {

  /**
   * -----------------------------------------------------
   * VALIDATE WARD ID
   * -----------------------------------------------------
   */

  if (
    !Number.isInteger(wardId) ||
    wardId <= 0
  ) {
    throw new Error(
      "Invalid ward ID"
    );
  }


  /**
   * -----------------------------------------------------
   * FIND CITY
   * -----------------------------------------------------
   */

  const city =
    await repository.findCityById(
      cityId
    );

  if (!city) {
    throw new Error(
      "City not found"
    );
  }

  if (!city.city_table_name) {
    throw new Error(
      "City has not been initialized yet"
    );
  }


  /**
   * -----------------------------------------------------
   * FIND ZONE
   * -----------------------------------------------------
   */

  const zone =
    await repository.findZone(
      city.city_table_name,
      zoneId
    );

  if (!zone) {
    throw new Error(
      "Zone not found"
    );
  }

  if (!zone.zone_table_name) {
    throw new Error(
      "Zone has not been initialized yet"
    );
  }


  /**
   * -----------------------------------------------------
   * FIND DIVISION
   * -----------------------------------------------------
   */

  const division =
    await repository.findDivision(
      zone.zone_table_name,
      divisionId
    );

  if (!division) {
    throw new Error(
      "Division not found"
    );
  }

  if (!division.division_table_name) {
    throw new Error(
      "Division has not been initialized yet"
    );
  }


  /**
   * -----------------------------------------------------
   * FIND CURRENT WARD BY ID
   * -----------------------------------------------------
   *
   * This is IMPORTANT.
   *
   * PATCH uses ward_id.
   */

  const currentWard =
    await repository.getWardById(
      division.division_table_name,
      wardId
    );

  if (!currentWard) {
    throw new Error(
      "Ward not found"
    );
  }


  /**
   * -----------------------------------------------------
   * VALIDATE WARD NUMBER
   * -----------------------------------------------------
   */

  if (
    data.wardNo !== undefined
  ) {

    if (
      !Number.isInteger(data.wardNo) ||
      data.wardNo <= 0
    ) {
      throw new Error(
        "wardNo must be a positive integer"
      );
    }


    /**
     * ---------------------------------------------------
     * CHECK DUPLICATE WARD NUMBER
     * ---------------------------------------------------
     *
     * If Ward 25 already belongs to THIS SAME ward,
     * that is completely fine.
     *
     * Only reject it when another ward owns it.
     */

    const existingWard =
      await repository.getWardByNumber(
        division.division_table_name,
        data.wardNo
      );

    if (
      existingWard &&
      Number(existingWard.ward_id) !== wardId
    ) {
      throw new Error(
        `Ward number ${data.wardNo} already exists`
      );
    }
  }


  /**
   * -----------------------------------------------------
   * VALIDATE WARD NAME
   * -----------------------------------------------------
   */

  if (
    data.wardName !== undefined
  ) {

    if (
      typeof data.wardName !== "string" ||
      !data.wardName.trim()
    ) {
      throw new Error(
        "wardName must be a non-empty string"
      );
    }

    data.wardName =
      data.wardName.trim();
  }


  /**
   * -----------------------------------------------------
   * UPDATE
   * -----------------------------------------------------
   */

  const updatedWard =
    await repository.updateWard(
      division.division_table_name,
      wardId,
      data
    );

  if (!updatedWard) {
    throw new Error(
      "Ward not found"
    );
  }


  return updatedWard;
}


/**
 * =====================================================
 * DELETE WARD
 * =====================================================
 */

async function deleteWard(
  cityId,
  zoneId,
  divisionId,
  wardId
) {

  if (
    !Number.isInteger(wardId) ||
    wardId <= 0
  ) {
    throw new Error(
      "Invalid ward ID"
    );
  }


  /**
   * -----------------------------------------------------
   * FIND CITY
   * -----------------------------------------------------
   */

  const city =
    await repository.findCityById(
      cityId
    );

  if (!city) {
    throw new Error(
      "City not found"
    );
  }

  if (!city.city_table_name) {
    throw new Error(
      "City has not been initialized yet"
    );
  }


  /**
   * -----------------------------------------------------
   * FIND ZONE
   * -----------------------------------------------------
   */

  const zone =
    await repository.findZone(
      city.city_table_name,
      zoneId
    );

  if (!zone) {
    throw new Error(
      "Zone not found"
    );
  }

  if (!zone.zone_table_name) {
    throw new Error(
      "Zone has not been initialized yet"
    );
  }


  /**
   * -----------------------------------------------------
   * FIND DIVISION
   * -----------------------------------------------------
   */

  const division =
    await repository.findDivision(
      zone.zone_table_name,
      divisionId
    );

  if (!division) {
    throw new Error(
      "Division not found"
    );
  }

  if (!division.division_table_name) {
    throw new Error(
      "Division has not been initialized yet"
    );
  }


  /**
   * -----------------------------------------------------
   * FIND WARD BY ID
   * -----------------------------------------------------
   *
   * IMPORTANT:
   *
   * DELETE uses ward_id.
   *
   * Do NOT use getWardByNumber() here.
   */

  const ward =
    await repository.getWardById(
      division.division_table_name,
      wardId
    );

  if (!ward) {
    throw new Error(
      "Ward not found"
    );
  }


  /**
   * -----------------------------------------------------
   * CHECK PHYSICAL TABLE
   * -----------------------------------------------------
   */

  if (ward.ward_table_name) {

    const result =
      await masterCitizenPrisma.$queryRawUnsafe(
        `
          SELECT COUNT(*)::int AS count
          FROM "${ward.ward_table_name}"
        `
      );

    const rowCount =
      result[0]?.count ?? 0;


    /**
     * ---------------------------------------------------
     * PREVENT DELETE IF CITIZEN DATA EXISTS
     * ---------------------------------------------------
     */

    if (rowCount > 0) {
      throw new Error(
        "Ward cannot be deleted because it contains citizen data"
      );
    }


    /**
     * ---------------------------------------------------
     * DROP PHYSICAL TABLE
     * ---------------------------------------------------
     */

    await dropDynamicTable(
      ward.ward_table_name
    );
  }


  /**
   * -----------------------------------------------------
   * DELETE REGISTRY RECORD
   * -----------------------------------------------------
   */

  await repository.deleteWard(
    division.division_table_name,
    ward.ward_id
  );


  /**
   * -----------------------------------------------------
   * UPDATE ZONE WARD COUNTER
   * -----------------------------------------------------
   */

  await masterCitizenPrisma.$queryRawUnsafe(
    `
      UPDATE "${city.city_table_name}"
      SET total_wards =
        GREATEST(
          COALESCE(total_wards, 0) - 1,
          0
        )
      WHERE zone_id = $1
    `,
    zoneId
  );


  return {
    ward_id: ward.ward_id,
    ward_no: ward.ward_no,
    deleted: true,
  };
}


/**
 * =====================================================
 * EXPORTS
 * =====================================================
 */

module.exports = {
  createWard,
  getWards,
  getWard,
  updateWard,
  deleteWard,
};