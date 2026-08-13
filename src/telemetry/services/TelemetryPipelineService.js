const telemetryDb = require("../../config/telemetryDb");
const masterTelemetryService = require("./MasterTelemetryService");
const tableManager = require("../managers/TableManager");

// ==========================================================
// TELEMETRY PIPELINE SERVICE
// ==========================================================
//
// MASTER TELEMETRY
//       ↓
// PROCESSING
//       ↓
// FINAL DATABASE TRANSACTION
//       ↓
// ┌───────────────┐
// │               │
// SUCCESS       FAILURE
// │               │
// ▼               ▼
// COMPLETED      FAILED
// │               │
// ▼               └── retained
// CLEANUP
//
// ==========================================================

class TelemetryPipelineService {
  async process(packet) {
    // ==================================================
    // STEP 1
    // ENSURE VEHICLE TABLE EXISTS
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
    // IMPORTANT:
    //
    // This is OUTSIDE the final transaction.
    //
    // Therefore the row survives a transaction
    // rollback.
    //
    // ==================================================

    const masterTelemetryId =
      await masterTelemetryService.createBufferPacket(packet);

    console.log(`Master buffer ID: ${masterTelemetryId}`);

    // ==================================================
    // STEP 3
    // FINAL DATABASE TRANSACTION
    // ==================================================

    try {
      const result = await telemetryDb.$transaction(
        async (tx) => {
          console.log("");
          console.log("========================================");

          console.log("STARTING TELEMETRY PIPELINE");

          console.log("========================================");

          const pipelineResult = await masterTelemetryService.processPacket(
            tx,

            packet,

            vehicleTable,

            masterTelemetryId,
          );

          console.log("");
          console.log("PIPELINE TRANSACTION READY TO COMMIT");

          return pipelineResult;
        },

        {
          maxWait: 10000,

          timeout: 10000,
        },
      );

      // ==============================================
      // STEP 4
      // TRANSACTION SUCCESS
      // ==============================================

      await masterTelemetryService.markCompleted(masterTelemetryId);

      // ==============================================
      // STEP 5
      // CLEANUP
      // ==============================================
      //
      // Only COMPLETED packets can be deleted.
      //
      // FAILED and PROCESSING packets remain.
      //
      // ==============================================

      await masterTelemetryService.cleanupCompletedBuffer();

      console.log("");
      console.log("========================================");

      console.log("TELEMETRY PIPELINE COMPLETED");

      console.log("========================================");

      return result;
    } catch (error) {
      // ==============================================
      // TRANSACTION FAILED
      // ==============================================

      console.error("");
      console.error("========================================");

      console.error("TELEMETRY PIPELINE FAILED");

      console.error("========================================");

      console.error(error);

      // ==============================================
      // IMPORTANT
      // ==============================================
      //
      // The transaction has already rolled back.
      //
      // The master buffer row still exists because
      // it was created BEFORE the transaction.
      //
      // Mark it FAILED.
      //
      // ==============================================

      try {
        await masterTelemetryService.markFailed(masterTelemetryId);
      } catch (statusError) {
        console.error(
          "❌ Failed to mark master telemetry as FAILED:",
          statusError,
        );
      }

      // ==============================================
      // Re-throw
      // ==============================================
      //
      // VehicleProcessorManager will receive the
      // failure and perform its existing Redis
      // requeue logic.
      //
      // ==============================================

      throw error;
    }
  }
}

module.exports = new TelemetryPipelineService();
