const telemetryDb = require("../../config/telemetryDb");
const masterTelemetryService = require("./MasterTelemetryService");
const tableManager = require("../managers/TableManager");
const metadataManager = require("../managers/MetadataManager");

class TelemetryPipelineService {
  async process(packet) {
    // ==================================================
    // STEP 1
    // CREATE MASTER BUFFER FIRST
    // ==================================================
    //
    // This happens BEFORE vehicle validation so that
    // even a rejected/unregistered packet gets a
    // permanent FAILED record in master_telemetry.
    //
    // ==================================================

    const masterTelemetryId =
      await masterTelemetryService.createBufferPacket(packet);

    console.log(`Master buffer ID: ${masterTelemetryId}`);

    // ==================================================
    // STEP 2
    // VALIDATE VEHICLE BEFORE CREATING ANY VEHICLE TABLE
    // ==================================================
    //
    // This performs:
    //
    // vehicle_master.vehicle_id
    //          ↓
    // ward_no
    //
    // The MetadataManager cache prevents repeated DB
    // lookups for the same vehicle.
    //
    // ==================================================

    try {
      await metadataManager.getVehicleWard(packet.vehicleNumber);
    } catch (error) {
      // =================================================
      // PERMANENT UNREGISTERED VEHICLE
      // =================================================

      if (error && error.code === "UNREGISTERED_VEHICLE") {
        console.error(
          `🚫 Unregistered vehicle rejected: ${packet.vehicleNumber}`,
        );

        try {
          await masterTelemetryService.markFailed(masterTelemetryId);
        } catch (statusError) {
          console.error(
            "❌ Could not mark unregistered packet FAILED:",
            statusError,
          );
        }

        // ------------------------------------------------
        // IMPORTANT:
        //
        // Throw the ORIGINAL error.
        //
        // VehicleProcessorManager will recognize
        // UNREGISTERED_VEHICLE and will NOT requeue.
        // ------------------------------------------------

        throw error;
      }

      // =================================================
      // TRANSIENT MASTER-DATABASE ERROR
      // =================================================
      //
      // Do NOT classify this as unregistered.
      //
      // The processor will retry it.
      // =================================================

      try {
        await masterTelemetryService.markFailed(masterTelemetryId);
      } catch (statusError) {
        console.error("❌ Could not mark packet FAILED:", statusError);
      }

      throw error;
    }

    // ==================================================
    // STEP 3
    // VEHICLE IS VALID
    // NOW CREATE DYNAMIC VEHICLE TABLE
    // ==================================================

    const vehicleTable = await tableManager.ensureVehicleTable(
      packet.vehicleNumber,
      packet.receivedTimestamp || new Date(),
    );

    console.log(`Vehicle table ready: ${vehicleTable}`);

    // ==================================================
    // STEP 4
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
      // TRANSACTION FAILED
      // =================================================

      console.error("");
      console.error("========================================");
      console.error("TELEMETRY PIPELINE FAILED");
      console.error("========================================");

      console.error(error);

      try {
        await masterTelemetryService.markFailed(masterTelemetryId);
      } catch (statusError) {
        console.error("❌ Could not mark master packet FAILED:", statusError);
      }

      // ------------------------------------------------
      // Send error to VehicleProcessorManager.
      // It decides:
      //
      // UNREGISTERED → no retry
      // OTHER         → retry
      // ------------------------------------------------

      throw error;
    }

    // ==================================================
    // STEP 5
    // MARK MASTER BUFFER COMPLETED
    // ==================================================

    try {
      await masterTelemetryService.markCompleted(masterTelemetryId);
    } catch (statusError) {
      console.error(
        "❌ Transaction succeeded but COMPLETED status update failed:",
        statusError,
      );

      // Do NOT mark FAILED because the transaction
      // itself already committed.

      throw statusError;
    }

    // ==================================================
    // STEP 6
    // CLEAN COMPLETED BUFFER
    // ==================================================

    await masterTelemetryService.cleanupCompletedBuffer();

    // ==================================================
    // STEP 7
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
