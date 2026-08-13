const telemetryDb = require("../../config/telemetryDb");
const queries = require("../queries/query");

class InitializeTelemetryDB {
  async initialize() {
    console.log("Initializing Telemetry Database...");

    // ==================================================
    // VEHICLE CUMULATIVE TABLE
    // ==================================================

    await telemetryDb.$executeRawUnsafe(queries.createVehicleCumulativeTable());

    // ==================================================
    // MASTER TELEMETRY STATUS
    // ==================================================

    await telemetryDb.$executeRawUnsafe(
      queries.addMasterTelemetryStatusColumn(),
    );

    // ==================================================
    // MASTER TELEMETRY CUMULATIVE
    // ==================================================
    //
    // Your current database already has this column,
    // so IF NOT EXISTS simply leaves it unchanged.
    //
    // ==================================================

    await telemetryDb.$executeRawUnsafe(
      queries.addMasterTelemetryCumulativeColumn(),
    );

    // ==================================================
    // MASTER TELEMETRY INDEX
    // ==================================================

    await telemetryDb.$executeRawUnsafe(
      queries.createMasterTelemetryStatusIndex(),
    );

    console.log("Telemetry Database Initialized Successfully.");
  }
}

module.exports = new InitializeTelemetryDB();
