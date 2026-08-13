const metadataManager = require("./MetadataManager");

class HierarchyManager {
  // =====================================================
  // COMPLETE HIERARCHY PROCESSING
  // =====================================================

  async process(tx, packetDate, vehicleNumber, vehicleTable) {
    console.log(`Creating hierarchy tables for date: ${packetDate}`);

    // ===================================================
    // 1. DAY TABLE
    // ===================================================

    const dayTable = await metadataManager.ensureDayTable(tx, packetDate);

    // ===================================================
    // 2. WEEK TABLE
    // ===================================================

    const weekTable = await metadataManager.ensureWeekTable(tx, packetDate);

    // ===================================================
    // 3. MONTH TABLE
    // ===================================================

    const monthTable = await metadataManager.ensureMonthTable(tx, packetDate);

    // ===================================================
    // 4. YEAR TABLE
    // ===================================================

    const yearTable = await metadataManager.ensureYearTable(tx, packetDate);

    // ===================================================
    // 5. REGISTER COMPLETE HIERARCHY
    // ===================================================

    await metadataManager.registerHierarchy(tx, {
      dayTable,
      weekTable,
      monthTable,
      yearTable,
      vehicleNumber,
      vehicleTable,
    });

    // ===================================================
    // 6. RETURN HIERARCHY
    // ===================================================

    return {
      dayTable,
      weekTable,
      monthTable,
      yearTable,
    };
  }
}

module.exports = new HierarchyManager();
