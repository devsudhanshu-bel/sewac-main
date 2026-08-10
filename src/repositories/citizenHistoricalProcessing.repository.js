const citizenHistoricalPrisma = require(
  "../config/citizenHistoricalPrisma"
);


// =====================================================
// CONFIGURATION
// =====================================================

const DEFAULT_BATCH_SIZE = 500;


// =====================================================
// SQL IDENTIFIER VALIDATION
// =====================================================
//
// Table names cannot be passed as normal SQL parameters,
// so they MUST be validated before being interpolated.
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
// GET ALL USER TABLES
// =====================================================
//
// Used to discover the dynamic historical/daily tables.
//
// We only return tables from the public schema.
//
// System Prisma tables are excluded.
//
// =====================================================

async function getPublicTables() {
  const tables =
    await citizenHistoricalPrisma.$queryRawUnsafe(
      `
      SELECT
        table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name ASC
      `
    );

  return tables.map(
    (row) => row.table_name
  );
}


// =====================================================
// GET TABLE COLUMNS
// =====================================================
//
// Allows the processor to inspect the schema of a
// discovered daily vehicle table.
//
// =====================================================

async function getTableColumns(
  tableName
) {
  validateIdentifier(tableName);

  return citizenHistoricalPrisma.$queryRawUnsafe(
    `
    SELECT

      column_name,

      data_type,

      udt_name,

      is_nullable,

      ordinal_position

    FROM information_schema.columns

    WHERE table_schema = 'public'

      AND table_name = $1

    ORDER BY ordinal_position ASC
    `,
    tableName
  );
}


// =====================================================
// CHECK TABLE EXISTS
// =====================================================

async function tableExists(
  tableName
) {
  validateIdentifier(tableName);

  const result =
    await citizenHistoricalPrisma.$queryRawUnsafe(
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


// =====================================================
// GET TABLE ROW COUNT
// =====================================================

async function getTableRowCount(
  tableName
) {
  validateIdentifier(tableName);

  const result =
    await citizenHistoricalPrisma.$queryRawUnsafe(
      `
      SELECT COUNT(*)::BIGINT AS count

      FROM "${tableName}"
      `
    );

  return Number(
    result[0]?.count ?? 0
  );
}


// =====================================================
// READ DAILY TABLE BATCH
// =====================================================
//
// IMPORTANT:
//
// This function ONLY READS the source table.
//
// It never updates/deletes/inserts anything into the
// existing daily vehicle table.
//
// =====================================================

async function getDailyTableBatch(
  tableName,
  offset = 0,
  limit = DEFAULT_BATCH_SIZE
) {
  validateIdentifier(tableName);

  const safeOffset =
    Number(offset);

  const safeLimit =
    Number(limit);

  if (
    !Number.isInteger(safeOffset) ||
    safeOffset < 0
  ) {
    throw new Error(
      "Invalid offset"
    );
  }

  if (
    !Number.isInteger(safeLimit) ||
    safeLimit <= 0 ||
    safeLimit > 5000
  ) {
    throw new Error(
      "Invalid batch size"
    );
  }


  return citizenHistoricalPrisma.$queryRawUnsafe(
    `
    SELECT *

    FROM "${tableName}"

    ORDER BY id ASC

    LIMIT $1
    OFFSET $2
    `,
    safeLimit,
    safeOffset
  );
}


// =====================================================
// GET DAILY TABLE BATCH USING KEYSET PAGINATION
// =====================================================
//
// This is preferable for very large tables.
//
// Instead of:
//
// OFFSET 50000
//
// we use:
//
// WHERE id > lastId
//
// This prevents PostgreSQL from scanning and skipping
// thousands of old rows repeatedly.
//
// =====================================================

async function getDailyTableBatchAfterId(
  tableName,
  lastId = 0,
  limit = DEFAULT_BATCH_SIZE
) {
  validateIdentifier(tableName);

  const safeLastId =
    Number(lastId);

  const safeLimit =
    Number(limit);

  if (
    !Number.isInteger(safeLastId) ||
    safeLastId < 0
  ) {
    throw new Error(
      "Invalid lastId"
    );
  }

  if (
    !Number.isInteger(safeLimit) ||
    safeLimit <= 0 ||
    safeLimit > 5000
  ) {
    throw new Error(
      "Invalid batch size"
    );
  }


  return citizenHistoricalPrisma.$queryRawUnsafe(
    `
    SELECT *

    FROM "${tableName}"

    WHERE id > $1

    ORDER BY id ASC

    LIMIT $2
    `,
    safeLastId,
    safeLimit
  );
}


// =====================================================
// GET FIRST ID / LAST ID
// =====================================================

async function getTableIdRange(
  tableName
) {
  validateIdentifier(tableName);

  const result =
    await citizenHistoricalPrisma.$queryRawUnsafe(
      `
      SELECT

        MIN(id)::BIGINT AS first_id,

        MAX(id)::BIGINT AS last_id

      FROM "${tableName}"
      `
    );

  return {
    firstId:
      result[0]?.first_id ??
      null,

    lastId:
      result[0]?.last_id ??
      null,
  };
}


// =====================================================
// GET DATE RANGE
// =====================================================
//
// We will use this later to determine exactly which
// daily tables need to be processed.
//
// The function checks common timestamp columns.
//
// =====================================================

async function getTableTimestampColumns(
  tableName
) {
  validateIdentifier(tableName);

  const columns =
    await getTableColumns(
      tableName
    );

  const possibleTimestampColumns = [
    "iot_timestamp",
    "iotTimestamp",
    "received_timestamp",
    "receivedTimestamp",
    "created_at",
    "createdAt",
  ];

  return columns
    .map(
      (column) =>
        column.column_name
    )
    .filter(
      (columnName) =>
        possibleTimestampColumns.includes(
          columnName
        )
    );
}


// =====================================================
// GET TABLE SAMPLE
// =====================================================
//
// Useful during development to inspect the actual
// daily-table structure before building the mapper.
//
// =====================================================

async function getTableSample(
  tableName,
  limit = 5
) {
  validateIdentifier(tableName);

  const safeLimit =
    Number(limit);

  if (
    !Number.isInteger(safeLimit) ||
    safeLimit <= 0 ||
    safeLimit > 100
  ) {
    throw new Error(
      "Invalid sample size"
    );
  }

  return citizenHistoricalPrisma.$queryRawUnsafe(
    `
    SELECT *

    FROM "${tableName}"

    ORDER BY id ASC

    LIMIT $1
    `,
    safeLimit
  );
}


// =====================================================
// GET TABLES MATCHING PATTERN
// =====================================================
//
// Example:
//
// vehicle daily tables:
//
// KA01AB1234_08082026
//
// The actual pattern will be finalized after checking
// your existing telemetry daily-table implementation.
//
// =====================================================

async function getTablesMatchingPattern(
  pattern
) {
  if (
    typeof pattern !== "string" ||
    !pattern.trim()
  ) {
    throw new Error(
      "Invalid table pattern"
    );
  }

  return citizenHistoricalPrisma.$queryRawUnsafe(
    `
    SELECT
      table_name

    FROM information_schema.tables

    WHERE table_schema = 'public'

      AND table_type = 'BASE TABLE'

      AND table_name LIKE $1

    ORDER BY table_name ASC
    `,
    pattern
  );
}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  DEFAULT_BATCH_SIZE,

  validateIdentifier,

  getPublicTables,

  getTableColumns,

  tableExists,

  getTableRowCount,

  getDailyTableBatch,

  getDailyTableBatchAfterId,

  getTableIdRange,

  getTableTimestampColumns,

  getTableSample,

  getTablesMatchingPattern,

};