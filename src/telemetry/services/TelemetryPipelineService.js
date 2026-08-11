const telemetryDb = require("../../config/telemetryDb");
const masterTelemetryService = require("./MasterTelemetryService");
const tableManager = require("../managers/TableManager");

class TelemetryPipelineService {
  async process(packet) {
    /*
     * IMPORTANT:
     *
     * Dynamic vehicle table creation happens BEFORE
     * opening the telemetry transaction.
     *
     * This prevents a transaction from trying to INSERT
     * into a table whose CREATE TABLE operation is still
     * being performed by another worker.
     */
    const vehicleTable = await tableManager.ensureVehicleTable(
      packet.vehicleNumber,
      packet.receivedTimestamp || new Date(),
    );

    console.log(`Vehicle table ready: ${vehicleTable}`);

    /*
     * Only packet data operations are inside the transaction.
     */
    return await telemetryDb.$transaction(
      async (tx) => {
        console.log("");
        console.log("========================================");
        console.log("STARTING TELEMETRY PIPELINE");
        console.log("========================================");

        const result = await masterTelemetryService.processPacket(
          tx,
          packet,
          vehicleTable,
        );

        console.log("");
        console.log("PIPELINE COMPLETED");

        return result;
      },
      {
        /*
         * Multiple workers are now processing packets
         * concurrently, so give the transaction enough
         * time without unnecessarily holding it open.
         */
        maxWait: 10000,
        timeout: 10000,
      },
    );
  }
}

module.exports = new TelemetryPipelineService();
