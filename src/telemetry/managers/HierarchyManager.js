const metadataManager = require("./MetadataManager");

// =====================================================
// HIERARCHY CACHE
// =====================================================

const hierarchyCache = new Map();
const hierarchyPromises = new Map();

class HierarchyManager {
  getCacheKey(packetDate) {
    const date = new Date(packetDate);

    const yyyy = date.getFullYear();

    const mm = String(date.getMonth() + 1).padStart(2, "0");

    const dd = String(date.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  }

  async getHierarchyTables(packetDate) {
    const cacheKey = this.getCacheKey(packetDate);

    // Fast path
    if (hierarchyCache.has(cacheKey)) {
      return hierarchyCache.get(cacheKey);
    }

    // Another worker is resolving it
    if (hierarchyPromises.has(cacheKey)) {
      return hierarchyPromises.get(cacheKey);
    }

    const promise = (async () => {
      try {
        const dayTable = await metadataManager.ensureDayTable(packetDate);

        const weekTable = await metadataManager.ensureWeekTable(packetDate);

        const monthTable = await metadataManager.ensureMonthTable(packetDate);

        const yearTable = await metadataManager.ensureYearTable(packetDate);

        const hierarchy = {
          dayTable,
          weekTable,
          monthTable,
          yearTable,
        };

        hierarchyCache.set(cacheKey, hierarchy);

        return hierarchy;
      } finally {
        hierarchyPromises.delete(cacheKey);
      }
    })();

    hierarchyPromises.set(cacheKey, promise);

    return promise;
  }

  async process(tx, packetDate, vehicleNumber, vehicleTable) {
    const hierarchy = await this.getHierarchyTables(packetDate);

    await metadataManager.registerHierarchy(tx, {
      dayTable: hierarchy.dayTable,

      weekTable: hierarchy.weekTable,

      monthTable: hierarchy.monthTable,

      yearTable: hierarchy.yearTable,

      vehicleNumber,

      vehicleTable,
    });

    return hierarchy;
  }
}

module.exports = new HierarchyManager();
