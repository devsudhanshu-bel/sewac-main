const telemetryDb = require("../../config/telemetryDb");
const queries = require("../queries/query");

class InitializeTelemetryDB {
  async initialize() {
    console.log("Initializing Telemetry Database...");

    // ================================================
    // VEHICLE CUMULATIVE TABLE
    // ================================================

    await telemetryDb.$executeRawUnsafe(queries.createVehicleCumulativeTable());

    // ================================================
    // MASTER TELEMETRY STATUS
    // ================================================

    await telemetryDb.$executeRawUnsafe(
      queries.addMasterTelemetryStatusColumn(),
    );

    await telemetryDb.$executeRawUnsafe(
      queries.createMasterTelemetryStatusIndex(),
    );

    console.log("Telemetry Database Initialized Successfully.");
  }
}

module.exports = new InitializeTelemetryDB();
