const telemetryDb = require("../../config/telemetryDb");
const mainDb = require("../../config/mainDb");
const queries = require("../queries/query");

// =====================================================
// VEHICLE → WARD CACHE
// =====================================================

const vehicleWardCache = new Map();

const vehicleWardPromises = new Map();

// =====================================================
// PERMANENT VEHICLE VALIDATION ERROR
// =====================================================

class UnregisteredVehicleError extends Error {
  constructor(vehicleNumber, reason = "Vehicle not registered") {
    super(`${reason}: ${vehicleNumber}`);

    this.name = "UnregisteredVehicleError";

    this.code = "UNREGISTERED_VEHICLE";

    this.vehicleNumber = vehicleNumber;

    this.isPermanent = true;
  }
}

// =====================================================
// METADATA MANAGER
// =====================================================

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
  // VEHICLE WARD LOOKUP
  // =====================================================

  async getVehicleWard(vehicleNumber) {
    const key = String(vehicleNumber || "").trim();

    if (!key) {
      throw new UnregisteredVehicleError(key, "Invalid vehicle ID");
    }

    if (vehicleWardCache.has(key)) {
      const cachedWard = vehicleWardCache.get(key);

      if (cachedWard === null || cachedWard === undefined) {
        throw new UnregisteredVehicleError(key);
      }

      return cachedWard;
    }

    if (vehicleWardPromises.has(key)) {
      const ward = await vehicleWardPromises.get(key);

      if (ward === null || ward === undefined) {
        throw new UnregisteredVehicleError(key);
      }

      return ward;
    }

    const lookupPromise = (async () => {
      try {
        console.log(`🔎 Vehicle master lookup: ${key}`);

        const result = await mainDb.query(
          `
                SELECT ward_no
                FROM vehicle_master
                WHERE vehicle_id = $1
                LIMIT 1;
              `,
          [key],
        );

        if (result.rows.length === 0) {
          vehicleWardCache.set(key, null);

          console.error(`❌ Unregistered vehicle: ${key}`);

          return null;
        }

        const wardNo = result.rows[0].ward_no;

        if (wardNo === null || wardNo === undefined) {
          vehicleWardCache.set(key, null);

          console.error(`❌ Vehicle ${key} has no ward_no`);

          return null;
        }

        vehicleWardCache.set(key, Number(wardNo));

        console.log(`✅ Vehicle master: ${key} → Ward ${wardNo}`);

        return Number(wardNo);
      } catch (error) {
        console.error(`❌ vehicle_master lookup failed [${key}]:`, error);

        throw error;
      } finally {
        vehicleWardPromises.delete(key);
      }
    })();

    vehicleWardPromises.set(key, lookupPromise);

    const wardNo = await lookupPromise;

    if (wardNo === null || wardNo === undefined) {
      throw new UnregisteredVehicleError(key);
    }

    return wardNo;
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

    await this.ensureTable(tx, tableName, queries.createDayTable);

    await tx.$executeRawUnsafe(queries.addDayHeartbeatColumn(tableName));

    return tableName;
  }

  // =====================================================
  // HEARTBEAT TABLE
  // =====================================================

  getHeartbeatTableName(vehicleNumber, date = new Date()) {
    const cleanVehicle = String(vehicleNumber || "").trim();

    const dd = String(date.getDate()).padStart(2, "0");

    const mm = String(date.getMonth() + 1).padStart(2, "0");

    const yyyy = date.getFullYear();

    return `${cleanVehicle}_HB${dd}${mm}${yyyy}`;
  }

  async ensureHeartbeatTable(tx, vehicleNumber, date = new Date()) {
    const tableName = this.getHeartbeatTableName(vehicleNumber, date);

    return this.ensureTable(tx, tableName, queries.createHeartbeatTable);
  }

  // =====================================================
  // VEHICLE → DAY
  // =====================================================

  async registerVehicleInDayTable(
    tx,
    dayTable,
    vehicleNumber,
    vehicleTable,
    heartbeatTable,
  ) {
    const wardNo = await this.getVehicleWard(vehicleNumber);

    console.log(`Vehicle Ward Resolved: ${vehicleNumber} → Ward ${wardNo}`);

    await tx.$executeRawUnsafe(
      queries.registerVehicleInDayTable(dayTable),

      vehicleNumber,

      vehicleTable,

      heartbeatTable,

      wardNo,
    );

    console.log(`✅ Day registration: ${vehicleNumber} → Ward ${wardNo}`);
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
    {
      dayTable,
      weekTable,
      monthTable,
      yearTable,
      vehicleNumber,
      vehicleTable,
      heartbeatTable,
    },
  ) {
    await this.registerVehicleInDayTable(
      tx,
      dayTable,
      vehicleNumber,
      vehicleTable,
      heartbeatTable,
    );

    await this.registerDayInWeekTable(tx, weekTable, dayTable);

    await this.registerWeekInMonthTable(tx, monthTable, weekTable);

    await this.registerMonthInYearTable(tx, yearTable, monthTable);

    return {
      dayTable,

      weekTable,

      monthTable,

      yearTable,

      heartbeatTable,
    };
  }
}

// =====================================================
// EXPORT
// =====================================================

const metadataManager = new MetadataManager();

metadataManager.UnregisteredVehicleError = UnregisteredVehicleError;

module.exports = metadataManager;
