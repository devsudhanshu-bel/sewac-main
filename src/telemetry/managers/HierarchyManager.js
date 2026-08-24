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
    // 2. HEARTBEAT TABLE
    // ===================================================

    const heartbeatTable = await metadataManager.ensureHeartbeatTable(
      tx,
      vehicleNumber,
      packetDate,
    );

    // ===================================================
    // 3. WEEK TABLE
    // ===================================================

    const weekTable = await metadataManager.ensureWeekTable(tx, packetDate);

    // ===================================================
    // 4. MONTH TABLE
    // ===================================================

    const monthTable = await metadataManager.ensureMonthTable(tx, packetDate);

    // ===================================================
    // 5. YEAR TABLE
    // ===================================================

    const yearTable = await metadataManager.ensureYearTable(tx, packetDate);

    // ===================================================
    // 6. REGISTER COMPLETE HIERARCHY
    // ===================================================

    await metadataManager.registerHierarchy(tx, {
      dayTable,
      weekTable,
      monthTable,
      yearTable,
      vehicleNumber,
      vehicleTable,
      heartbeatTable,
    });

    // ===================================================
    // 7. RETURN HIERARCHY
    // ===================================================

    return {
      dayTable,

      weekTable,

      monthTable,

      yearTable,

      heartbeatTable,
    };
  }
}

module.exports = new HierarchyManager();
