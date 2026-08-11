const telemetryDb = require("../../config/telemetryDb");
const queries = require("../queries/query");
const createdVehicleTables = new Set();

class TableManager {
  getVehicleTableName(vehicleNumber, packetDate = new Date()) {
    const dd = String(packetDate.getDate()).padStart(2, "0");
    const mm = String(packetDate.getMonth() + 1).padStart(2, "0");
    const yyyy = packetDate.getFullYear();

    return `${vehicleNumber}_${dd}${mm}${yyyy}`;
  }

  async ensureVehicleTable(vehicleNumber, packetDate = new Date()) {
    const tableName = this.getVehicleTableName(vehicleNumber, packetDate);

    if (!createdVehicleTables.has(tableName)) {
      await telemetryDb.$executeRawUnsafe(
        queries.createVehicleTelemetryTable(tableName),
      );

      createdVehicleTables.add(tableName);
    }

    return tableName;
  }
}

module.exports = new TableManager();
