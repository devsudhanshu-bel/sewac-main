const telemetryDb = require("../../config/telemetryDb");
const queries = require("../queries/query");

// =====================================================
// TABLE CREATION CACHE
// =====================================================

const createdMetadataTables = new Set();
const metadataTableCreationPromises = new Map();

class MetadataManager {
  // =====================================================
  // GENERIC TABLE ENSURER
  // =====================================================

  async ensureTable(tableName, createQuery) {
    // Fast path
    if (createdMetadataTables.has(tableName)) {
      return tableName;
    }

    // Another worker is already creating it
    if (metadataTableCreationPromises.has(tableName)) {
      await metadataTableCreationPromises.get(tableName);
      return tableName;
    }

    const creationPromise = (async () => {
      try {
        await telemetryDb.$executeRawUnsafe(createQuery(tableName));

        createdMetadataTables.add(tableName);
      } finally {
        metadataTableCreationPromises.delete(tableName);
      }
    })();

    metadataTableCreationPromises.set(tableName, creationPromise);

    await creationPromise;

    return tableName;
  }

  // =====================================================
  // DAY
  // =====================================================

  getDayTableName(date = new Date()) {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `day_${dd}${mm}${yyyy}`;
  }

  async ensureDayTable(date = new Date()) {
    const tableName = this.getDayTableName(date);

    return this.ensureTable(tableName, queries.createDayTable);
  }

  // =====================================================
  // WEEK
  // =====================================================

  getWeekTableName(date = new Date()) {
    const year = date.getFullYear();

    const start = new Date(year, 0, 1);

    const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));

    const week = Math.ceil((days + start.getDay() + 1) / 7);

    return `week_${week}_${year}`;
  }

  async ensureWeekTable(date = new Date()) {
    const tableName = this.getWeekTableName(date);

    return this.ensureTable(tableName, queries.createWeekTable);
  }

  // =====================================================
  // MONTH
  // =====================================================

  getMonthTableName(date = new Date()) {
    const mm = String(date.getMonth() + 1).padStart(2, "0");

    const yyyy = date.getFullYear();

    return `month_${mm}${yyyy}`;
  }

  async ensureMonthTable(date = new Date()) {
    const tableName = this.getMonthTableName(date);

    return this.ensureTable(tableName, queries.createMonthTable);
  }

  // =====================================================
  // YEAR
  // =====================================================

  getYearTableName(date = new Date()) {
    return `year_${date.getFullYear()}`;
  }

  async ensureYearTable(date = new Date()) {
    const tableName = this.getYearTableName(date);

    return this.ensureTable(tableName, queries.createYearTable);
  }

  // =====================================================
  // HIERARCHY REGISTRATION
  // =====================================================

  async registerHierarchy(
    tx,
    { dayTable, weekTable, monthTable, yearTable, vehicleNumber, vehicleTable },
  ) {
    await tx.$executeRawUnsafe(
      queries.registerHierarchy(dayTable, weekTable, monthTable, yearTable),

      vehicleNumber,
      vehicleTable,
      dayTable,
      weekTable,
      monthTable,
    );
  }
}

module.exports = new MetadataManager();
