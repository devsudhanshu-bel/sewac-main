const telemetryDb = require("../../config/telemetryDb");
const queries = require("../queries/query");

const vehicleTableCreationPromises = new Map();

class TableManager {
  getVehicleTableName(vehicleNumber, packetDate = new Date()) {
    const dd = String(packetDate.getDate()).padStart(2, "0");
    const mm = String(packetDate.getMonth() + 1).padStart(2, "0");
    const yyyy = packetDate.getFullYear();

    return `${vehicleNumber}_${dd}${mm}${yyyy}`;
  }

  async ensureVehicleTable(vehicleNumber, packetDate = new Date()) {
    const tableName = this.getVehicleTableName(vehicleNumber, packetDate);

    // -------------------------------------------------
    // Another worker is already creating this table.
    // Wait for that operation instead of creating again.
    // -------------------------------------------------

    if (vehicleTableCreationPromises.has(tableName)) {
      await vehicleTableCreationPromises.get(tableName);
      return tableName;
    }

    // -------------------------------------------------
    // PostgreSQL is the source of truth.
    //
    // CREATE TABLE IF NOT EXISTS makes this safe even
    // when the table already exists.
    // -------------------------------------------------

    const creationPromise = (async () => {
      try {
        await telemetryDb.$executeRawUnsafe(
          queries.createVehicleTelemetryTable(tableName),
        );

        console.log(`Dynamic Vehicle Table Ready: ${tableName}`);
      } finally {
        vehicleTableCreationPromises.delete(tableName);
      }
    })();

    vehicleTableCreationPromises.set(tableName, creationPromise);

    await creationPromise;

    return tableName;
  }
}

module.exports = new TableManager();
