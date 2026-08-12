const telemetryDb = require("../../config/telemetryDb");
const queries = require("../queries/query");

// =====================================================
// TABLE CREATION PROMISES
// =====================================================
//
// PostgreSQL is the source of truth.

class MetadataManager {
  // =====================================================
  // GENERIC TABLE CREATION
  // =====================================================

  async ensureTable(tx, tableName, createQuery) {
    await tx.$executeRawUnsafe(createQuery(tableName));

    console.log(`Hierarchy table ready: ${tableName}`);

    return tableName;
  }

  // =====================================================
  // DAY TABLE
  // =====================================================

  getDayTableName(date = new Date()) {
    const dd = String(date.getDate()).padStart(2, "0");

    const mm = String(date.getMonth() + 1).padStart(2, "0");

    const yyyy = date.getFullYear();

    return `day_${dd}${mm}${yyyy}`;
  }

  async ensureDayTable(tx, date = new Date()) {
    const tableName = this.getDayTableName(date);

    return this.ensureTable(tx, tableName, queries.createDayTable);
  }

  // =====================================================
  // VEHICLE → DAY
  // =====================================================

  async registerVehicleInDayTable(tx, dayTable, vehicleNumber, vehicleTable) {
    await tx.$executeRawUnsafe(
      queries.registerVehicleInDayTable(dayTable),
      vehicleNumber,
      vehicleTable,
    );
  }

  // =====================================================
  // WEEK TABLE
  // =====================================================

  getWeekTableName(date = new Date()) {
    const year = date.getFullYear();

    const start = new Date(year, 0, 1);

    const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));

    const week = Math.ceil((days + start.getDay() + 1) / 7);

    return `week_${week}_${year}`;
  }

  async ensureWeekTable(tx, date = new Date()) {
    const tableName = this.getWeekTableName(date);

    return this.ensureTable(tx, tableName, queries.createWeekTable);
  }

  // =====================================================
  // MONTH TABLE
  // =====================================================

  getMonthTableName(date = new Date()) {
    const mm = String(date.getMonth() + 1).padStart(2, "0");

    const yyyy = date.getFullYear();

    return `month_${mm}${yyyy}`;
  }

  async ensureMonthTable(tx, date = new Date()) {
    const tableName = this.getMonthTableName(date);

    return this.ensureTable(tx, tableName, queries.createMonthTable);
  }

  // =====================================================
  // YEAR TABLE
  // =====================================================

  getYearTableName(date = new Date()) {
    return `year_${date.getFullYear()}`;
  }

  async ensureYearTable(tx, date = new Date()) {
    const tableName = this.getYearTableName(date);

    return this.ensureTable(tx, tableName, queries.createYearTable);
  }

  // =====================================================
  // MONTH → YEAR
  // =====================================================

  async registerMonthInYearTable(tx, yearTable, monthTable) {
    await tx.$executeRawUnsafe(
      queries.registerMonthInYearTable(yearTable),
      monthTable,
    );
  }

  // =====================================================
  // WEEK → MONTH
  // =====================================================

  async registerWeekInMonthTable(tx, monthTable, weekTable) {
    await tx.$executeRawUnsafe(
      queries.registerWeekInMonthTable(monthTable),
      weekTable,
    );
  }

  // =====================================================
  // DAY → WEEK
  // =====================================================

  async registerDayInWeekTable(tx, weekTable, dayTable) {
    await tx.$executeRawUnsafe(
      queries.registerDayInWeekTable(weekTable),
      dayTable,
    );
  }

  // =====================================================
  // COMPLETE HIERARCHY REGISTRATION
  // =====================================================

  async registerHierarchy(
    tx,
    { dayTable, weekTable, monthTable, yearTable, vehicleNumber, vehicleTable },
  ) {
    // ---------------------------------------------------
    // 1. VEHICLE → DAY
    // ---------------------------------------------------

    await this.registerVehicleInDayTable(
      tx,
      dayTable,
      vehicleNumber,
      vehicleTable,
    );

    // ---------------------------------------------------
    // 2. DAY → WEEK
    // ---------------------------------------------------

    await this.registerDayInWeekTable(tx, weekTable, dayTable);

    // ---------------------------------------------------
    // 3. WEEK → MONTH
    // ---------------------------------------------------

    await this.registerWeekInMonthTable(tx, monthTable, weekTable);

    // ---------------------------------------------------
    // 4. MONTH → YEAR
    // ---------------------------------------------------

    await this.registerMonthInYearTable(tx, yearTable, monthTable);

    return {
      dayTable,
      weekTable,
      monthTable,
      yearTable,
    };
  }
}

module.exports = new MetadataManager();
