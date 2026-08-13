const telemetryDb = require("../../config/telemetryDb");
const masterTelemetryService = require("./MasterTelemetryService");
const tableManager = require("../managers/TableManager");

class TelemetryPipelineService {
  async process(packet) {
    // ==================================================
    // STEP 1
    // ENSURE VEHICLE TABLE
    // ==================================================

    const vehicleTable = await tableManager.ensureVehicleTable(
      packet.vehicleNumber,

      packet.receivedTimestamp || new Date(),
    );

    console.log(`Vehicle table ready: ${vehicleTable}`);

    // ==================================================
    // STEP 2
    // CREATE MASTER BUFFER ROW
    // ==================================================
    //
    // This is OUTSIDE the transaction.
    //
    // Therefore a failed packet remains in
    // master_telemetry.
    //
    // ==================================================

    const masterTelemetryId =
      await masterTelemetryService.createBufferPacket(packet);

    console.log(`Master buffer ID: ${masterTelemetryId}`);

    // ==================================================
    // STEP 3
    // FINAL DATABASE TRANSACTION
    // ==================================================

    let result;

    try {
      result = await telemetryDb.$transaction(
        async (tx) => {
          console.log("");
          console.log("========================================");

          console.log("STARTING TELEMETRY PIPELINE");

          console.log("========================================");

          return await masterTelemetryService.processPacket(
            tx,

            packet,

            vehicleTable,

            masterTelemetryId,
          );
        },

        {
          maxWait: 10000,

          timeout: 10000,
        },
      );
    } catch (error) {
      // =================================================
      // FINAL TRANSACTION FAILED
      // =================================================

      console.error("");
      console.error("========================================");

      console.error("TELEMETRY PIPELINE FAILED");

      console.error("========================================");

      console.error(error);

      // =================================================
      // IMPORTANT:
      //
      // Transaction already rolled back.
      //
      // Master buffer row survives because it was
      // created BEFORE the transaction.
      // =================================================

      try {
        await masterTelemetryService.markFailed(masterTelemetryId);
      } catch (statusError) {
        console.error("❌ Could not mark master packet FAILED:", statusError);
      }

      // Send error back to VehicleProcessorManager
      // so existing Redis requeue logic can execute.

      throw error;
    }

    // ==================================================
    // STEP 4
    // FINAL TRANSACTION SUCCESSFUL
    // ==================================================

    try {
      await masterTelemetryService.markCompleted(masterTelemetryId);
    } catch (statusError) {
      console.error(
        "❌ Transaction succeeded but COMPLETED status update failed:",
        statusError,
      );

      // IMPORTANT:
      // Do NOT mark this packet FAILED because the
      // final transaction already committed.
      //
      // Leave it PROCESSING for recovery/inspection.

      throw statusError;
    }

    // ==================================================
    // STEP 5
    // CLEANUP
    // ==================================================

    await masterTelemetryService.cleanupCompletedBuffer();

    // ==================================================
    // STEP 6
    // SUCCESS
    // ==================================================

    console.log("");
    console.log("========================================");

    console.log("TELEMETRY PIPELINE COMPLETED");

    console.log("========================================");

    return result;
  }
}

module.exports = new TelemetryPipelineService();
