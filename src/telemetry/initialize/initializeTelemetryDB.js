const telemetryDb = require("../../config/telemetryDb");
const queries = require("../queries/query");

class InitializeTelemetryDB {
  async initialize() {
    await telemetryDb.$executeRawUnsafe(queries.createVehicleCumulativeTable());
    console.log("Initializing Telemetry Database...");
    console.log("Telemetry Database Initialized Successfully.");
  }
}

module.exports = new InitializeTelemetryDB();
