const masterCitizenPrisma =
  require("../config/masterCitizenPrisma");

/**
 * =====================================================
 * TABLE NAME HELPERS
 * =====================================================
 */

/**
 * Convert a name into a safe PostgreSQL identifier.
 *
 * Examples:
 *
 * Bangalore        -> bangalore
 * East Zone        -> east_zone
 * North Bangalore  -> north_bangalore
 */
function generateSafeName(name) {
  const normalized = String(name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (!normalized) {
    throw new Error(
      "Invalid name for table generation"
    );
  }

  return normalized;
}

/**
 * =====================================================
 * POSTGRES IDENTIFIER HELPER
 * =====================================================
 *
 * PostgreSQL identifiers have a maximum length of
 * 63 characters.
 *
 * We therefore keep generated constraint names
 * within that limit.
 */
function generateConstraintName(prefix, tableName) {
  const safeTableName =
    generateSafeName(tableName);

  const fullName =
    `${prefix}_${safeTableName}`;

  if (fullName.length <= 63) {
    return fullName;
  }

  return fullName.substring(0, 63);
}

/**
 * =====================================================
 * CITY TABLE NAME
 * =====================================================
 */

function generateCityTableName(cityName) {
  const baseName =
    generateSafeName(cityName);

  if (baseName.endsWith("_city")) {
    return baseName;
  }

  return `${baseName}_city`;
}

/**
 * =====================================================
 * ZONE TABLE NAME
 * =====================================================
 */

function generateZoneTableName(zoneName) {
  const baseName =
    generateSafeName(zoneName);

  if (baseName.endsWith("_zone")) {
    return baseName;
  }

  return `${baseName}_zone`;
}

/**
 * =====================================================
 * DIVISION TABLE NAME
 * =====================================================
 */

function generateDivisionTableName(
  divisionName
) {
  const baseName =
    generateSafeName(divisionName);

  if (baseName.endsWith("_division")) {
    return baseName;
  }

  return `${baseName}_division`;
}

/**
 * =====================================================
 * WARD TABLE NAME
 * =====================================================
 *
 * Examples:
 *
 * Ward 25  -> ward_25
 * JP Nagar -> ward_jp_nagar
 */
function generateWardTableName(
  wardName,
  wardNo
) {
  let baseName;

  if (wardName) {
    baseName =
      generateSafeName(wardName);
  } else {
    baseName = `ward_${wardNo}`;
  }

  if (baseName.startsWith("ward_")) {
    return baseName;
  }

  return `ward_${baseName}`;
}

/**
 * =====================================================
 * TABLE NAME VALIDATION
 * =====================================================
 */

function validateTableName(tableName) {
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
 * =====================================================
 * TABLE EXISTENCE
 * =====================================================
 */

async function tableExists(
  tableName
) {
  validateTableName(tableName);

  const result =
    await masterCitizenPrisma.$queryRawUnsafe(
      `
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = $1
        ) AS exists
      `,
      tableName
    );

  return result[0]?.exists === true;
}

async function cityTableExists(
  tableName
) {
  return tableExists(tableName);
}

async function zoneTableExists(
  tableName
) {
  return tableExists(tableName);
}

async function divisionTableExists(
  tableName
) {
  return tableExists(tableName);
}

async function wardTableExists(
  tableName
) {
  return tableExists(tableName);
}

/**
 * =====================================================
 * CREATE CITY TABLE
 * =====================================================
 *
 * A City dynamic table contains the Zones belonging
 * to that City.
 */

async function createCityTable(
  tableName
) {
  validateTableName(tableName);

  const query = `
    CREATE TABLE IF NOT EXISTS "${tableName}" (

      zone_id SERIAL PRIMARY KEY,

      zone_name VARCHAR(150) NOT NULL,

      geo_boundary JSONB,

      total_divisions INTEGER
        DEFAULT 0,

      total_wards INTEGER
        DEFAULT 0,

      created_at TIMESTAMP(6)
        DEFAULT CURRENT_TIMESTAMP,

      zone_table_name VARCHAR(150)
    )
  `;

  await masterCitizenPrisma.$executeRawUnsafe(
    query
  );
}

/**
 * =====================================================
 * CREATE ZONE TABLE
 * =====================================================
 *
 * A Zone dynamic table contains the Divisions
 * belonging to that Zone.
 */

async function createZoneTable(
  tableName
) {
  validateTableName(tableName);

  const query = `
    CREATE TABLE IF NOT EXISTS "${tableName}" (

      division_id SERIAL PRIMARY KEY,

      division_name VARCHAR(150) NOT NULL,

      geo_boundary JSONB,

      created_at TIMESTAMP(6)
        DEFAULT CURRENT_TIMESTAMP,

      division_table_name VARCHAR(150)
    )
  `;

  await masterCitizenPrisma.$executeRawUnsafe(
    query
  );
}

/**
 * =====================================================
 * CREATE DIVISION TABLE
 * =====================================================
 *
 * A Division dynamic table contains the Wards
 * belonging to that Division.
 *
 * IMPORTANT:
 *
 * The UNIQUE constraint name MUST be unique
 * across the PostgreSQL schema.
 *
 * We therefore generate:
 *
 * unique_ward_no_<division_table_name>
 *
 * Example:
 *
 * unique_ward_no_hsr_division_1_division
 *
 * unique_ward_no_bengaluru_east_test_division
 */

async function createDivisionTable(
  tableName
) {
  validateTableName(tableName);

  const uniqueWardConstraint =
    generateConstraintName(
      "unique_ward_no",
      tableName
    );

  const query = `
    CREATE TABLE IF NOT EXISTS "${tableName}" (

      ward_id SERIAL PRIMARY KEY,

      ward_no INTEGER NOT NULL,

      ward_name VARCHAR(150) NOT NULL,

      geo_boundary JSONB,

      created_at TIMESTAMP(6)
        DEFAULT CURRENT_TIMESTAMP,

      ward_table_name VARCHAR(150),

      CONSTRAINT "${uniqueWardConstraint}"
        UNIQUE (ward_no)
    )
  `;

  await masterCitizenPrisma.$executeRawUnsafe(
    query
  );
}

/**
 * =====================================================
 * CREATE WARD TABLE
 * =====================================================
 *
 * IMPORTANT:
 *
 * This is NOT a Ward registry table.
 *
 * This is the actual CITIZEN DATA table belonging
 * to the Ward.
 *
 * Example:
 *
 * ward_25
 *
 * contains citizens belonging to Ward 25.
 *
 * The hierarchy itself determines:
 *
 * City
 *   ↓
 * Zone
 *   ↓
 * Division
 *   ↓
 * Ward
 *
 * We therefore do not duplicate those hierarchy
 * fields inside every citizen record.
 */

async function createWardTable(
  tableName
) {
  validateTableName(tableName);

  const query = `
    CREATE TABLE IF NOT EXISTS "${tableName}" (

      /**
       * -------------------------------------------------
       * PRIMARY KEY
       * -------------------------------------------------
       */

      id SERIAL PRIMARY KEY,

      /**
       * -------------------------------------------------
       * CONTACT / IDENTIFICATION
       * -------------------------------------------------
       */

      "phoneNumber" TEXT,

      "area" TEXT,

      "wasteGeneratorTypes" TEXT,

      /**
       * -------------------------------------------------
       * HOUSE INFORMATION
       * -------------------------------------------------
       */

      "houseNumber" TEXT,

      "floorNumber" TEXT,

      "householdType" TEXT,

      /**
       * -------------------------------------------------
       * PERSON INFORMATION
       * -------------------------------------------------
       */

      "personName" TEXT,

      "contactNumber" TEXT,

      "numberOfPeople" TEXT,

      /**
       * -------------------------------------------------
       * BUILDING INFORMATION
       * -------------------------------------------------
       */

      "buildingPhoto" TEXT,

      /**
       * -------------------------------------------------
       * TIMESTAMPS
       * -------------------------------------------------
       */

      "createdAt"
        TIMESTAMP(3)
        DEFAULT CURRENT_TIMESTAMP,

      "updatedAt"
        TIMESTAMP(3)
        DEFAULT CURRENT_TIMESTAMP,

      /**
       * -------------------------------------------------
       * DRY WASTE RFID
       * -------------------------------------------------
       */

      "dryRFID" TEXT,

      "drySlno" TEXT,

      /**
       * -------------------------------------------------
       * WET WASTE RFID
       * -------------------------------------------------
       */

      "wetRFID" TEXT,

      "wetSlno" TEXT,

      /**
       * -------------------------------------------------
       * LOCATION
       * -------------------------------------------------
       */

      lat NUMERIC(10,8),

      lng NUMERIC(11,8)
    )
  `;

  await masterCitizenPrisma.$executeRawUnsafe(
    query
  );
}

/**
 * =====================================================
 * DROP DYNAMIC TABLE
 * =====================================================
 */

async function dropDynamicTable(
  tableName
) {
  validateTableName(tableName);

  const query = `
    DROP TABLE IF EXISTS "${tableName}"
  `;

  await masterCitizenPrisma.$executeRawUnsafe(
    query
  );
}

/**
 * =====================================================
 * EXPORTS
 * =====================================================
 */

module.exports = {

  /**
   * Name generators
   */
  generateSafeName,

  generateCityTableName,

  generateZoneTableName,

  generateDivisionTableName,

  generateWardTableName,

  /**
   * Constraint helper
   */
  generateConstraintName,

  /**
   * Validation
   */
  validateTableName,

  /**
   * Table existence
   */
  tableExists,

  cityTableExists,

  zoneTableExists,

  divisionTableExists,

  wardTableExists,

  /**
   * Dynamic table creation
   */
  createCityTable,

  createZoneTable,

  createDivisionTable,

  createWardTable,

  /**
   * Dynamic table deletion
   */
  dropDynamicTable,
};