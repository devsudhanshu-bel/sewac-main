const queries = require("../queries/query");
const hierarchyManager = require("../managers/HierarchyManager");

function toRawDate(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value;
}

class MasterTelemetryService {
  async processPacket(tx, packet, vehicleTable) {
    console.log("==================================");
    console.log("Processing Telemetry Packet");
    console.log("==================================");

    console.log("Vehicle Table :", vehicleTable);

    // =====================================================
    // STEP 1 - Calculate current packet weight
    // =====================================================

    const currentWeight =
      Number(packet.wetWeight || 0) +
      Number(packet.dryWeight || 0) +
      Number(packet.otherWeight || 0);

    // =====================================================
    // STEP 2 - Atomic vehicle cumulative
    // =====================================================

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

    // =====================================================
    // STEP 3 - Master telemetry
    // =====================================================

    await tx.$executeRawUnsafe(
      queries.insertMasterTelemetry(),

      toRawDate(packet.iotTimestamp),
      toRawDate(packet.receivedTimestamp),
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

    console.log("Inserted into master_telemetry");

    // =====================================================
    // STEP 4 - Vehicle daily telemetry
    // =====================================================

    await tx.$executeRawUnsafe(
      queries.insertVehicleTelemetry(vehicleTable),

      toRawDate(packet.iotTimestamp),
      toRawDate(packet.receivedTimestamp),
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

    // =====================================================
    // STEP 5 - Hierarchy
    // =====================================================

    const hierarchy = await hierarchyManager.process(
      tx,
      packet.receivedTimestamp || new Date(),
      packet.vehicleNumber,
      vehicleTable,
    );

    console.log("Hierarchy Updated :", hierarchy);

    // =====================================================
    // NO FIFO HERE
    // =====================================================
    //
    // FIFO was intentionally removed from the
    // packet hot path for performance.
    //
    // =====================================================

    return {
      vehicleTable,
      cumulativeWeight,
    };
  }
}

module.exports = new MasterTelemetryService();
