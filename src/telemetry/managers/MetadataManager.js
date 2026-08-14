const telemetryDb = require("../../config/telemetryDb");
const mainDb = require("../../config/mainDb");
const queries = require("../queries/query");

// =====================================================
// VEHICLE → WARD CACHE
// =====================================================
//
// Cache structure:
//
// KA05AB1234 -> 1
// KA05AB1235 -> 2
// KA05AB1236 -> 20
//
// IMPORTANT:
//
// null is also cached.
//
// That means an unregistered vehicle is NOT repeatedly
// queried against vehicle_master on every retry.
//
// =====================================================

const vehicleWardCache = new Map();

// =====================================================
// LOOKUP PROMISE CACHE
// =====================================================
//
// Prevents multiple simultaneous packets for the same
// vehicle from issuing duplicate vehicle_master queries.
//
// Example:
//
// Packet 1 -> lookup KA05AB1234
// Packet 2 -> same vehicle arrives immediately
//
// Packet 2 waits for Packet 1's lookup instead of
// creating another DB query.
//
// =====================================================

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
  //
  // FIRST REQUEST:
  //     main DB query
  //
  // FUTURE REQUESTS:
  //     memory cache
  //
  // UNREGISTERED:
  //     null cached
  //
  // =====================================================

  async getVehicleWard(vehicleNumber) {
    const key = String(vehicleNumber || "").trim();

    if (!key) {
      throw new UnregisteredVehicleError(key, "Invalid vehicle ID");
    }

    // ---------------------------------------------------
    // CACHE HIT
    // ---------------------------------------------------

    if (vehicleWardCache.has(key)) {
      const cachedWard = vehicleWardCache.get(key);

      if (cachedWard === null || cachedWard === undefined) {
        throw new UnregisteredVehicleError(key);
      }

      return cachedWard;
    }

    // ---------------------------------------------------
    // LOOKUP ALREADY IN PROGRESS
    // ---------------------------------------------------

    if (vehicleWardPromises.has(key)) {
      const ward = await vehicleWardPromises.get(key);

      if (ward === null || ward === undefined) {
        throw new UnregisteredVehicleError(key);
      }

      return ward;
    }

    // ---------------------------------------------------
    // CREATE ONE LOOKUP PROMISE
    // ---------------------------------------------------

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

        // -----------------------------------------------
        // VEHICLE NOT FOUND
        // -----------------------------------------------

        if (result.rows.length === 0) {
          vehicleWardCache.set(key, null);

          console.error(`❌ Unregistered vehicle: ${key}`);

          return null;
        }

        const wardNo = result.rows[0].ward_no;

        // -----------------------------------------------
        // VEHICLE EXISTS BUT WARD IS MISSING
        // -----------------------------------------------

        if (wardNo === null || wardNo === undefined) {
          vehicleWardCache.set(key, null);

          console.error(`❌ Vehicle ${key} has no ward_no`);

          return null;
        }

        // -----------------------------------------------
        // VALID VEHICLE
        // -----------------------------------------------

        vehicleWardCache.set(key, Number(wardNo));

        console.log(`✅ Vehicle master: ${key} → Ward ${wardNo}`);

        return Number(wardNo);
      } catch (error) {
        // ------------------------------------------------
        // IMPORTANT:
        //
        // A database/network error is NOT the same thing
        // as an unregistered vehicle.
        //
        // Do NOT cache the failure.
        //
        // This allows the packet to be retried later.
        // ------------------------------------------------

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

    return this.ensureTable(tx, tableName, queries.createDayTable);
  }

  // =====================================================
  // VEHICLE → DAY
  // =====================================================

  async registerVehicleInDayTable(tx, dayTable, vehicleNumber, vehicleTable) {
    // ===================================================
    // FETCH WARD
    // ===================================================

    const wardNo = await this.getVehicleWard(vehicleNumber);

    console.log(`Vehicle Ward Resolved: ${vehicleNumber} → Ward ${wardNo}`);

    // ===================================================
    // REGISTER VEHICLE + WARD
    // ===================================================

    await tx.$executeRawUnsafe(
      queries.registerVehicleInDayTable(dayTable),

      vehicleNumber,

      vehicleTable,

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

    await this.registerDayInWeekTable(
      tx,

      weekTable,

      dayTable,
    );

    // ---------------------------------------------------
    // 3. WEEK → MONTH
    // ---------------------------------------------------

    await this.registerWeekInMonthTable(
      tx,

      monthTable,

      weekTable,
    );

    // ---------------------------------------------------
    // 4. MONTH → YEAR
    // ---------------------------------------------------

    await this.registerMonthInYearTable(
      tx,

      yearTable,

      monthTable,
    );

    return {
      dayTable,

      weekTable,

      monthTable,

      yearTable,
    };
  }
}

// =====================================================
// EXPORT
// =====================================================

const metadataManager = new MetadataManager();

metadataManager.UnregisteredVehicleError = UnregisteredVehicleError;

module.exports = metadataManager;
