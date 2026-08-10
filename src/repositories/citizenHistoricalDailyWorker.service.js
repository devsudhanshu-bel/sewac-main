const telemetryDailyRepository =
  require("../repositories/telemetryDaily.repository");


const historicalProcessingManager =
  require(
    "../citizenHistorical/processing/HistoricalProcessingManager"
  );


const citizenHistoricalProcessor =
  require(
    "./citizenHistoricalProcessor.service"
  );


// =====================================================
// CITIZEN HISTORICAL DAILY WORKER
// =====================================================
//
// This is the production processing engine.
//
// It:
//
// 1. Finds the day's day table
// 2. Discovers every vehicle
// 3. Reads every telemetry record
// 4. Registers processing state
// 5. Sends records to the historical processor
// 6. Marks records PROCESSED / FAILED
// 7. Updates job statistics
//
// =====================================================


class CitizenHistoricalDailyWorker {

  // ===================================================
  // PROCESS DAY
  // ===================================================

  async processDay(
    processingDate
  ) {

    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "CITIZEN HISTORICAL DAILY WORKER"
    );

    console.log(
      "================================================="
    );

    console.log("");

    console.log(
      "Processing Date:",
      processingDate
    );


    // =================================================
    // GET OR CREATE JOB
    // =================================================

    const job =
      await historicalProcessingManager
        .getOrCreateJob(
          processingDate
        );


    console.log(
      "Processing Job:",
      job.job_id.toString()
    );


    // =================================================
    // PROTECT COMPLETED JOB
    // =================================================

    if (
      job.status === "COMPLETED"
    ) {

      console.log("");

      console.log(
        "Job already completed."
      );

      console.log(
        "Nothing to process."
      );


      return job;

    }


    // =================================================
    // START JOB
    // =================================================

    await historicalProcessingManager
      .startJob(
        job.job_id
      );


    // =================================================
    // DAY SNAPSHOT
    // =================================================

    const snapshot =
      await telemetryDailyRepository
        .getDaySnapshot(
          processingDate
        );


    console.log("");

    console.log(
      "Day Table:",
      snapshot.dayTableName
    );

    console.log(
      "Day Table Exists:",
      snapshot.dayTableExists
    );


    // =================================================
    // NO DAY TABLE
    // =================================================

    if (
      !snapshot.dayTableExists
    ) {

      console.log("");

      console.log(
        "No telemetry day table exists."
      );

      console.log(
        "Nothing to process."
      );


      await historicalProcessingManager
        .completeJob(
          job.job_id
        );


      return await historicalProcessingManager
        .getJobSummary(
          job.job_id
        );

    }


    // =================================================
    // VEHICLES
    // =================================================

    const vehicles =
      snapshot.vehicles;


    console.log("");

    console.log(
      "Vehicles Found:",
      vehicles.length
    );


    await historicalProcessingManager
      .updateVehicleCount(
        job.job_id,
        vehicles.length
      );


    // =================================================
    // PROCESS EACH VEHICLE
    // =================================================

    let totalRecords =
      0;


    for (
      const vehicle
      of vehicles
    ) {

      console.log("");

      console.log(
        "-----------------------------------------------"
      );

      console.log(
        "VEHICLE:",
        vehicle.vehicle_number
      );

      console.log(
        "Vehicle Table:",
        vehicle.vehicle_table_name
      );


      // ===============================================
      // VEHICLE TABLE CHECK
      // ===============================================

      const vehicleExists =
        await telemetryDailyRepository
          .vehicleTableExists(
            vehicle.vehicle_table_name
          );


      if (
        !vehicleExists
      ) {

        console.warn(
          "Vehicle table does not exist:",
          vehicle.vehicle_table_name
        );

        continue;

      }


      // ===============================================
      // GET RECORD COUNT
      // ===============================================

      const vehicleRecordCount =
        await telemetryDailyRepository
          .getTelemetryCount(
            vehicle.vehicle_table_name
          );


      console.log(
        "Telemetry Records:",
        vehicleRecordCount
      );


      totalRecords +=
        vehicleRecordCount;


      // ===============================================
      // PROCESS TELEMETRY
      // ===============================================

      const records =
        await telemetryDailyRepository
          .getTelemetryRecords(
            vehicle.vehicle_table_name
          );


      for (
        const telemetry
        of records
      ) {

        await this.processTelemetryRecord(
          job,
          vehicle,
          telemetry,
          processingDate
        );

      }


      // ===============================================
      // HEARTBEAT
      // ===============================================

      await historicalProcessingManager
        .heartbeat(
          job.job_id
        );

    }


    // =================================================
    // UPDATE TOTAL
    // =================================================

    await historicalProcessingManager
      .updateTotalRecords(
        job.job_id,
        totalRecords
      );


    // =================================================
    // FINAL SUMMARY
    // =================================================

    const finalJob =
      await historicalProcessingManager
        .getJobSummary(
          job.job_id
        );


    // =================================================
    // DETERMINE COMPLETION
    // =================================================

    const failedCount =
      Number(
        finalJob.failed_records || 0
      );


    if (
      failedCount > 0
    ) {

      console.warn("");

      console.warn(
        "Historical processing completed with failures:",
        failedCount
      );


      await historicalProcessingManager
        .failJob(
          job.job_id
        );

    } else {

      await historicalProcessingManager
        .completeJob(
          job.job_id
        );

    }


    // =================================================
    // FINAL RESULT
    // =================================================

    const result =
      await historicalProcessingManager
        .getJobSummary(
          job.job_id
        );


    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "DAILY HISTORICAL WORKER FINISHED"
    );

    console.log(
      "================================================="
    );

    console.log("");

    console.log(
      this.safeStringify(
        result
      )
    );


    return result;

  }


  // ===================================================
  // PROCESS SINGLE TELEMETRY RECORD
  // ===================================================

  async processTelemetryRecord(
    job,
    vehicle,
    telemetry,
    processingDate
  ) {

    const telemetryId =
      telemetry.id;


    console.log("");

    console.log(
      "Telemetry:",
      telemetryId.toString()
    );


    // =================================================
    // REGISTER PROCESSING RECORD
    // =================================================

    const processingRecord =
      await historicalProcessingManager
        .registerRecord(
          job.job_id,
          vehicle.vehicle_table_name,
          telemetryId
        );


    // =================================================
    // ALREADY PROCESSED
    // =================================================

    if (
      processingRecord.status ===
      "PROCESSED"
    ) {

      console.log(
        "Already processed:",
        telemetryId.toString()
      );


      await historicalProcessingManager
        .incrementSkipped(
          job.job_id
        );


      return {

        status:
          "SKIPPED",

        telemetryId,

      };

    }


    // =================================================
    // START RECORD
    // =================================================

    await historicalProcessingManager
      .startRecord(
        processingRecord.processing_record_id
      );


    try {

      // ===============================================
      // PROCESS THROUGH EXISTING PROCESSOR
      // ===============================================

      const result =
        await citizenHistoricalProcessor
          .processRecord(
            telemetry,
            processingDate
          );


      // ===============================================
      // DETERMINE HISTORICAL TABLE
      // ===============================================

      let historicalTableName =
        result?.monthlyTableName ||
        result?.historicalTableName ||
        result?.tableName ||
        null;


      // ===============================================
      // COMPLETE PROCESSING RECORD
      // ===============================================

      await historicalProcessingManager
        .completeRecord(
          processingRecord.processing_record_id,
          historicalTableName
        );


      await historicalProcessingManager
        .incrementProcessed(
          job.job_id
        );


      console.log(
        "Telemetry processed:",
        telemetryId.toString()
      );


      return {

        status:
          "PROCESSED",

        telemetryId,

        result,

      };

    } catch (error) {

      // ===============================================
      // FAILED RECORD
      // ===============================================

      const errorMessage =
        error?.message ||
        String(error);


      await historicalProcessingManager
        .failRecord(
          processingRecord.processing_record_id,
          errorMessage
        );


      await historicalProcessingManager
        .incrementFailed(
          job.job_id
        );


      console.error(
        "Telemetry processing failed:",
        telemetryId.toString()
      );


      console.error(
        errorMessage
      );


      return {

        status:
          "FAILED",

        telemetryId,

        error:
          errorMessage,

      };

    }

  }


  // ===================================================
  // SAFE JSON
  // ===================================================

  safeStringify(
    value
  ) {

    return JSON.stringify(
      value,
      (
        key,
        value
      ) =>
        typeof value === "bigint"
          ? value.toString()
          : value,
      2
    );

  }

}


module.exports =
  new CitizenHistoricalDailyWorker();