const telemetryDb = require("../../config/telemetryDb");
const queries = require("../queries/query");

// Keeps track of tables already created during this Node process.
const createdVehicleTables = new Set();

// Prevents multiple workers from simultaneously creating
// the same vehicle/day table.
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

    // Already created by this Node process.
    if (createdVehicleTables.has(tableName)) {
      return tableName;
    }

    // Another worker is currently creating it.
    if (vehicleTableCreationPromises.has(tableName)) {
      await vehicleTableCreationPromises.get(tableName);

      return tableName;
    }

    // Only one worker reaches the actual CREATE TABLE operation.
    const creationPromise = (async () => {
      try {
        await telemetryDb.$executeRawUnsafe(
          queries.createVehicleTelemetryTable(tableName),
        );

        createdVehicleTables.add(tableName);

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
