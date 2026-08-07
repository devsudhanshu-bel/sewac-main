const telemetryDb = require("../../config/telemetryDb");
const tableManager = require("../managers/TableManager");
const queries = require("../queries/query");
const hierarchyManager = require("../managers/HierarchyManager");

class MasterTelemetryService {
  async processPacket(packet) {
    return await telemetryDb.$transaction(async (tx) => {
      console.log("==================================");
      console.log("Processing Telemetry Packet");
      console.log("==================================");

      // Step 1 - Ensure Vehicle Table
      const vehicleTable = await tableManager.ensureVehicleTable(
        packet.vehicleNumber,
        packet.receivedTimestamp || new Date(),
      );

      console.log("Vehicle Table :", vehicleTable);

      // Step 3 - Insert into Master Telemetry
      await tx.$executeRawUnsafe(
        queries.insertMasterTelemetry(),

        packet.iotTimestamp,
        packet.receivedTimestamp,
        packet.rfidEpc,
        packet.citizenId,
        packet.wasteType,
        packet.latitude,
        packet.longitude,
        packet.wetWeight,
        packet.dryWeight,
        packet.otherWeight,
        packet.cumulativeWeight,
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

      // Step 4 - Insert into Vehicle Daily Table
      await tx.$executeRawUnsafe(
        queries.insertVehicleTelemetry(vehicleTable),

        packet.iotTimestamp,
        packet.receivedTimestamp,
        packet.rfidEpc,
        packet.citizenId,
        packet.wasteType,
        packet.latitude,
        packet.longitude,
        packet.wetWeight,
        packet.dryWeight,
        packet.otherWeight,
        packet.cumulativeWeight,
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
      const hierarchy = await hierarchyManager.process(
        tx,

        packet.receivedTimestamp || new Date(),

        packet.vehicleNumber,

        vehicleTable,
      );

      console.log("Hierarchy Updated :", hierarchy);

      // Step 5 - Maintain Master FIFO (1000 packets)
      await tx.$executeRawUnsafe(queries.maintainMasterFIFO());

      console.log("Master FIFO Maintained");

      return {
        vehicleTable,
      };
    });
  }
}

module.exports = new MasterTelemetryService();
