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
  // STEP 1
  // CREATE BUFFER ROW
  // ======================================================
  //
  // IMPORTANT:
  // This is intentionally OUTSIDE the final transaction.
  //
  // Therefore if final processing fails, this row survives
  // and can be marked FAILED.
  //
  // ======================================================

  async createBufferPacket(packet) {
    console.log("");
    console.log("==================================");
    console.log("CREATING MASTER TELEMETRY BUFFER");
    console.log("==================================");

    const result = await telemetryDb.$queryRawUnsafe(
      queries.insertMasterTelemetry(),

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

    const masterTelemetryId = Number(result[0].id);

    console.log(
      `Master telemetry buffer created | id=${masterTelemetryId} | status=PROCESSING`,
    );

    return masterTelemetryId;
  }

  // ======================================================
  // STEP 2
  // FINAL TELEMETRY PROCESSING
  // ======================================================
  //
  // EVERYTHING HERE runs inside the transaction created
  // by TelemetryPipelineService.
  //
  // If anything fails:
  //
  // vehicle cumulative → ROLLBACK
  // master cumulative  → ROLLBACK
  // vehicle table      → ROLLBACK
  // hierarchy          → ROLLBACK
  //
  // BUT the original master buffer row remains because
  // it was created BEFORE this transaction.
  //
  // ======================================================

  async processPacket(tx, packet, vehicleTable, masterTelemetryId) {
    console.log("==================================");
    console.log("Processing Telemetry Packet");
    console.log("==================================");

    console.log("Vehicle Table :", vehicleTable);

    console.log("Master Buffer ID :", masterTelemetryId);

    // ==================================================
    // STEP 1 - CURRENT PACKET WEIGHT
    // ==================================================

    const currentWeight =
      Number(packet.wetWeight || 0) +
      Number(packet.dryWeight || 0) +
      Number(packet.otherWeight || 0);

    console.log("Current Packet Weight :", currentWeight);

    // ==================================================
    // STEP 2 - ATOMIC VEHICLE CUMULATIVE
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
    // STEP 3 - UPDATE MASTER BUFFER CUMULATIVE
    // ==================================================

    await tx.$executeRawUnsafe(
      queries.updateMasterTelemetryCumulative(),

      cumulativeWeight,

      masterTelemetryId,
    );

    console.log("Master telemetry cumulative updated");

    // ==================================================
    // STEP 4 - VEHICLE DAILY TELEMETRY
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
    // STEP 5 - HIERARCHY
    // ==================================================

    const hierarchy = await hierarchyManager.process(
      tx,

      packet.receivedTimestamp || new Date(),

      packet.vehicleNumber,

      vehicleTable,
    );

    console.log("Hierarchy Updated :", hierarchy);

    // ==================================================
    // FINAL RESULT
    // ==================================================

    return {
      vehicleTable,

      cumulativeWeight,

      masterTelemetryId,
    };
  }

  // ======================================================
  // MARK MASTER ROW COMPLETED
  // ======================================================

  async markCompleted(masterTelemetryId) {
    await telemetryDb.$executeRawUnsafe(
      queries.markMasterTelemetryCompleted(),

      masterTelemetryId,
    );

    console.log(`Master telemetry completed | id=${masterTelemetryId}`);
  }

  // ======================================================
  // MARK MASTER ROW FAILED
  // ======================================================

  async markFailed(masterTelemetryId) {
    await telemetryDb.$executeRawUnsafe(
      queries.markMasterTelemetryFailed(),

      masterTelemetryId,
    );

    console.log(`Master telemetry FAILED | id=${masterTelemetryId}`);
  }

  // ======================================================
  // CLEANUP COMPLETED BUFFER
  // ======================================================

  async cleanupCompletedBuffer() {
    const result = await telemetryDb.$executeRawUnsafe(
      queries.cleanupCompletedMasterTelemetry(),
    );

    console.log(`Master telemetry cleanup executed | deleted=${result}`);

    return result;
  }
}

module.exports = new MasterTelemetryService();
