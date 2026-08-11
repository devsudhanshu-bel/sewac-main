const telemetryDb = require("../../config/telemetryDb");
const queries = require("../queries/query");

class MetadataManager {
  getDayTableName(date = new Date()) {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `day_${dd}${mm}${yyyy}`;
  }

  async ensureDayTable(date = new Date()) {
    const tableName = this.getDayTableName(date);

    if (!createdDayTables.has(tableName)) {
      await telemetryDb.$executeRawUnsafe(queries.createDayTable(tableName));

      createdDayTables.add(tableName);
    }

    return tableName;
  }

  async registerVehicleInDayTable(tx, dayTable, vehicleNumber, vehicleTable) {
    await tx.$executeRawUnsafe(
      queries.registerVehicleInDayTable(dayTable),

      vehicleNumber,

      vehicleTable,
    );
  }

  getWeekTableName(date = new Date()) {
    const year = date.getFullYear();

    const start = new Date(year, 0, 1);

    const days = Math.floor((date - start) / (24 * 60 * 60 * 1000));

    const week = Math.ceil((days + start.getDay() + 1) / 7);

    return `week_${week}_${year}`;
  }
async ensureWeekTable(date = new Date()) {

    const tableName = this.getWeekTableName(date);

    if (!createdWeekTables.has(tableName)) {

        await telemetryDb.$executeRawUnsafe(
            queries.createWeekTable(tableName)
        );

        createdWeekTables.add(tableName);
    }

    return tableName;
}
  getMonthTableName(date = new Date()) {
    const mm = String(date.getMonth() + 1).padStart(2, "0");

    const yyyy = date.getFullYear();

    return `month_${mm}${yyyy}`;
  }

  async ensureMonthTable(date = new Date()) {
    const tableName = this.getMonthTableName(date);

    await telemetryDb.$executeRawUnsafe(queries.createMonthTable(tableName));

    return tableName;
  }
  getYearTableName(date = new Date()) {
    return `year_${date.getFullYear()}`;
  }

  async ensureYearTable(date = new Date()) {
    const tableName = this.getYearTableName(date);

    await telemetryDb.$executeRawUnsafe(queries.createYearTable(tableName));

    return tableName;
  }

  async registerMonthInYearTable(tx, yearTable, monthTable) {
    await tx.$executeRawUnsafe(
      queries.registerMonthInYearTable(yearTable),

      monthTable,
    );
  }

  async registerWeekInMonthTable(tx, monthTable, weekTable) {
    await tx.$executeRawUnsafe(
      queries.registerWeekInMonthTable(monthTable),

      weekTable,
    );
  }
  async registerDayInWeekTable(
    tx,

    weekTable,

    dayTable,
  ) {
    await tx.$executeRawUnsafe(
      queries.registerDayInWeekTable(weekTable),

      dayTable,
    );
  }
}

module.exports = new MetadataManager();
