const telemetryDb = require("../../config/telemetryDb");
const queries = require("../queries/query");
const hierarchyManager = require("../managers/HierarchyManager");

// ==========================================================
// DATE NORMALIZATION
// ==========================================================

function toRawDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      return null;
    }

    return value.toISOString();
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

// ==========================================================
// MASTER TELEMETRY SERVICE
// ==========================================================

class MasterTelemetryService {
  // ======================================================
  // CREATE BUFFER PACKET
  // ======================================================
  //
  // OUTSIDE final transaction.
  //
  // Therefore FAILED packets survive rollback.
  // ======================================================

  async createBufferPacket(packet) {
    console.log("");
    console.log("==================================");
    console.log("CREATING MASTER TELEMETRY BUFFER");
    console.log("==================================");

    const result = await telemetryDb.$queryRawUnsafe(
      queries.insertMasterTelemetry(),

      // $1
      toRawDate(packet.iotTimestamp),

      // $2
      toRawDate(packet.receivedTimestamp || new Date()),

      // $3
      packet.rfidEpc,

      // $4
      packet.citizenId,

      // $5
      packet.wasteType,

      // $6
      packet.latitude,

      // $7
      packet.longitude,

      // $8
      packet.wetWeight,

      // $9
      packet.dryWeight,

      // $10
      packet.otherWeight,

      // $11
      packet.driverName,

      // $12
      packet.vehicleNumber,

      // $13
      packet.firmwareVersion,

      // $14
      packet.unitNumber,

      // $15
      packet.collectionType,

      // $16
      packet.remarks,

      // $17
      packet.errorCode,

      // $18
      packet.citizenContact,

      // $19
      packet.driverAction,
    );

    const masterTelemetryId = Number(result[0].id);

    console.log(
      `Master telemetry buffer created | id=${masterTelemetryId} | status=PROCESSING`,
    );

    return masterTelemetryId;
  }

  // ======================================================
  // FINAL DATABASE PROCESSING
  // ======================================================

  async processPacket(tx, packet, vehicleTable, masterTelemetryId) {
    console.log("==================================");
    console.log("Processing Telemetry Packet");
    console.log("==================================");

    console.log("Vehicle Table :", vehicleTable);

    console.log("Master Buffer ID :", masterTelemetryId);

    // ==================================================
    // STEP 1
    // CURRENT PACKET WEIGHT
    // ==================================================

    const currentWeight =
      Number(packet.wetWeight || 0) +
      Number(packet.dryWeight || 0) +
      Number(packet.otherWeight || 0);

    console.log("Current Packet Weight :", currentWeight);

    // ==================================================
    // STEP 2
    // VEHICLE CUMULATIVE
    // ==================================================

    const cumulativeResult = await tx.$queryRawUnsafe(
      queries.updateVehicleCumulative(),

      packet.vehicleNumber,

      currentWeight,
    );

    const cumulativeWeight = Number(cumulativeResult[0].cumulative_weight);

    console.log(
      "Vehicle Cumulative Weight :",
      packet.vehicleNumber,
      cumulativeWeight,
    );

    // ==================================================
    // STEP 3
    // UPDATE MASTER BUFFER CUMULATIVE
    // ==================================================

    await tx.$executeRawUnsafe(
      queries.updateMasterTelemetryCumulative(),

      cumulativeWeight,

      masterTelemetryId,
    );

    console.log("Master telemetry cumulative updated");

    // ==================================================
    // STEP 4
    // INSERT VEHICLE TELEMETRY
    // ==================================================

    await tx.$executeRawUnsafe(
      queries.insertVehicleTelemetry(vehicleTable),

      toRawDate(packet.iotTimestamp),

      toRawDate(packet.receivedTimestamp || new Date()),

      packet.rfidEpc,

      packet.citizenId,

      packet.wasteType,

      packet.latitude,

      packet.longitude,

      packet.wetWeight,

      packet.dryWeight,

      packet.otherWeight,

      cumulativeWeight,

      packet.driverName,

      packet.vehicleNumber,

      packet.firmwareVersion,

      packet.unitNumber,

      packet.collectionType,

      packet.remarks,

      packet.errorCode,

      packet.citizenContact,

      packet.driverAction,
    );

    console.log("Inserted into Vehicle Table");

    // ==================================================
    // STEP 5
    // HIERARCHY
    // ==================================================

    const hierarchy = await hierarchyManager.process(
      tx,

      packet.receivedTimestamp || new Date(),

      packet.vehicleNumber,

      vehicleTable,
    );

    console.log("Hierarchy Updated :", hierarchy);

    // ==================================================
    // RETURN
    // ==================================================

    return {
      vehicleTable,

      cumulativeWeight,

      masterTelemetryId,
    };
  }

  // ======================================================
  // MARK COMPLETED
  // ======================================================

  async markCompleted(masterTelemetryId) {
    await telemetryDb.$executeRawUnsafe(
      queries.markMasterTelemetryCompleted(),

      masterTelemetryId,
    );

    console.log(`Master telemetry COMPLETED | id=${masterTelemetryId}`);
  }

  // ======================================================
  // MARK FAILED
  // ======================================================

  async markFailed(masterTelemetryId) {
    await telemetryDb.$executeRawUnsafe(
      queries.markMasterTelemetryFailed(),

      masterTelemetryId,
    );

    console.log(`Master telemetry FAILED | id=${masterTelemetryId}`);
  }

  // ======================================================
  // CLEANUP
  // ======================================================

  async cleanupCompletedBuffer() {
    const deleted = await telemetryDb.$executeRawUnsafe(
      queries.cleanupCompletedMasterTelemetry(),
    );

    console.log(`Master telemetry cleanup | deleted=${deleted}`);

    return deleted;
  }
}

module.exports = new MasterTelemetryService();
