const metadataManager = require("./MetadataManager");

class HierarchyManager {
  async process(tx, packetDate, vehicleNumber, vehicleTable) {
    // DAY
    const dayTable = await metadataManager.ensureDayTable(packetDate);

    await metadataManager.registerVehicleInDayTable(
      tx,
      dayTable,
      vehicleNumber,
      vehicleTable,
    );

    // WEEK
    const weekTable = await metadataManager.ensureWeekTable(packetDate);

    await metadataManager.registerDayInWeekTable(tx, weekTable, dayTable);

    // MONTH
    const monthTable = await metadataManager.ensureMonthTable(packetDate);

    await metadataManager.registerWeekInMonthTable(tx, monthTable, weekTable);

    // YEAR
    const yearTable = await metadataManager.ensureYearTable(packetDate);

    await metadataManager.registerMonthInYearTable(tx, yearTable, monthTable);

    return {
      dayTable,

      weekTable,

      monthTable,

      yearTable,
    };
  }
}

module.exports = new HierarchyManager();
