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
// PRODUCTION DAILY PROCESSING ENGINE
//
// FLOW:
//
// DAY TABLE
//     ↓
// ALL VEHICLES
//     ↓
// ALL TELEMETRY RECORDS
//     ↓
// GPS RESOLVER
//     ↓
// CITY / ZONE / DIVISION / WARD
//     ↓
// MONTHLY HISTORICAL TABLE
//     ↓
// YEARLY MONTH INDEX
//
// =====================================================
//
// IMPORTANT:
//
// MONTHLY TABLE
//     = ACTUAL TELEMETRY DATA
//
// YEARLY TABLE
//     = INDEX ONLY
//
// =====================================================
//
// The worker is idempotent.
//
// If the same daily job is run again:
//
//     already processed record
//             ↓
//          SKIPPED
//
// If the monthly historical record already exists:
//
//     duplicate telemetry_id
//             ↓
//       repository ignores it
//             ↓
//       yearly index is still updated
//
// =====================================================


class CitizenHistoricalDailyWorker {


  // ===================================================
  // PROCESS COMPLETE DAY
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
    // GET OR CREATE PROCESSING JOB
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
    // DO NOT PROCESS COMPLETED JOB
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
    // GET DAY SNAPSHOT
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
    // GET ALL VEHICLES
    // =================================================

    const vehicles =
      Array.isArray(
        snapshot.vehicles
      )
        ? snapshot.vehicles
        : [];


    console.log("");

    console.log(
      "Vehicles Found:",
      vehicles.length
    );


    // =================================================
    // UPDATE VEHICLE COUNT
    // =================================================

    await historicalProcessingManager
      .updateVehicleCount(
        job.job_id,
        vehicles.length
      );


    // =================================================
    // PROCESS EVERY VEHICLE
    // =================================================

    let totalRecords =
      0;


    for (
      const vehicle
      of vehicles
    ) {

      const vehicleNumber =
        vehicle.vehicle_number ??
        vehicle.vehicleNumber ??
        null;


      const vehicleTableName =
        vehicle.vehicle_table_name ??
        vehicle.vehicleTableName ??
        null;


      console.log("");

      console.log(
        "-----------------------------------------------"
      );

      console.log(
        "VEHICLE:",
        vehicleNumber
      );

      console.log(
        "Vehicle Table:",
        vehicleTableName
      );


      // ===============================================
      // VALIDATE VEHICLE TABLE NAME
      // ===============================================

      if (
        !vehicleTableName
      ) {

        console.warn(
          "Vehicle table name missing."
        );

        continue;
      }


      // ===============================================
      // CHECK VEHICLE TABLE
      // ===============================================

      const vehicleExists =
        await telemetryDailyRepository
          .vehicleTableExists(
            vehicleTableName
          );


      if (
        !vehicleExists
      ) {

        console.warn(
          "Vehicle table does not exist:",
          vehicleTableName
        );

        continue;
      }


      // ===============================================
      // GET VEHICLE TELEMETRY COUNT
      // ===============================================

      const vehicleRecordCount =
        await telemetryDailyRepository
          .getTelemetryCount(
            vehicleTableName
          );


      console.log(
        "Telemetry Records:",
        vehicleRecordCount
      );


      totalRecords +=
        Number(
          vehicleRecordCount || 0
        );


      // ===============================================
      // GET ALL TELEMETRY RECORDS
      // ===============================================

      const records =
        await telemetryDailyRepository
          .getTelemetryRecords(
            vehicleTableName
          );


      console.log(
        "Records Loaded:",
        records.length
      );


      // ===============================================
      // PROCESS EVERY TELEMETRY RECORD
      // ===============================================

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
      // HEARTBEAT AFTER VEHICLE
      // ===============================================

      await historicalProcessingManager
        .heartbeat(
          job.job_id
        );

    }


    // =================================================
    // UPDATE TOTAL RECORD COUNT
    // =================================================

    await historicalProcessingManager
      .updateTotalRecords(
        job.job_id,
        totalRecords
      );


    console.log("");

    console.log(
      "Total telemetry records:",
      totalRecords
    );


    // =================================================
    // GET CURRENT JOB SUMMARY
    // =================================================

    let finalJob =
      await historicalProcessingManager
        .getJobSummary(
          job.job_id
        );


    // =================================================
    // CHECK FAILURES
    // =================================================

    const failedCount =
      Number(
        finalJob.failed_records || 0
      );


    const processedCount =
      Number(
        finalJob.processed_records || 0
      );


    const skippedCount =
      Number(
        finalJob.skipped_records || 0
      );


    console.log("");

    console.log(
      "Processing Summary:"
    );

    console.log(
      "Total Records:",
      finalJob.total_records
    );

    console.log(
      "Processed:",
      processedCount
    );

    console.log(
      "Skipped:",
      skippedCount
    );

    console.log(
      "Failed:",
      failedCount
    );


    // =================================================
    // COMPLETE / FAIL JOB
    // =================================================

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
    // GET FINAL RESULT
    // =================================================

    finalJob =
      await historicalProcessingManager
        .getJobSummary(
          job.job_id
        );


    // =================================================
    // FINAL OUTPUT
    // =================================================

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
        finalJob
      )
    );


    return finalJob;
  }


  // ===================================================
  // PROCESS ONE TELEMETRY RECORD
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
      telemetryId?.toString
        ? telemetryId.toString()
        : telemetryId
    );


    // =================================================
    // REGISTER PROCESSING RECORD
    // =================================================
    //
    // IMPORTANT:
    //
    // If this record was previously FAILED,
    // HistoricalProcessingManager should allow it to
    // be retried.
    //
    // If it was already PROCESSED, we skip it.
    //
    // =================================================

    const processingRecord =
      await historicalProcessingManager
        .registerRecord(
          job.job_id,
          vehicle.vehicle_table_name ??
            vehicle.vehicleTableName,
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
        telemetryId?.toString
          ? telemetryId.toString()
          : telemetryId
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
    // START PROCESSING RECORD
    // =================================================

    await historicalProcessingManager
      .startRecord(
        processingRecord.processing_record_id
      );


    try {

      // ===============================================
      // SEND TELEMETRY TO HISTORICAL PROCESSOR
      // ===============================================

      const result =
        await citizenHistoricalProcessor
          .processRecord(
            telemetry,
            processingDate
          );


      // ===============================================
      // PROCESSOR MAY RETURN A NON-MATCH
      // ===============================================
      //
      // Example:
      //
      // GPS outside city
      // WARD_NOT_FOUND
      //
      // This is NOT a successful historical insert.
      //
      // ===============================================

      if (
        !result ||
        result.processed !== true
      ) {

        const reason =
          result?.reason ||
          "HISTORICAL_PROCESSING_NOT_COMPLETED";


        console.warn(
          "Telemetry was not processed:",
          telemetryId?.toString
            ? telemetryId.toString()
            : telemetryId
        );


        console.warn(
          "Reason:",
          reason
        );


        // ---------------------------------------------
        // Treat this as skipped rather than pretending
        // the historical record was inserted.
        // ---------------------------------------------

        await historicalProcessingManager
          .completeRecord(
            processingRecord.processing_record_id,
            null
          );


        await historicalProcessingManager
          .incrementSkipped(
            job.job_id
          );


        return {

          status:
            "SKIPPED",

          telemetryId,

          reason,

          result,

        };
      }


      // ===============================================
      // DETERMINE MONTHLY HISTORICAL TABLE
      // ===============================================
      //
      // Current processor returns:
      //
      // monthlyTable
      //
      // Keep fallbacks for compatibility.
      //
      // ===============================================

      const historicalTableName =
        result.monthlyTable ||
        result.monthlyTableName ||
        result.historicalTableName ||
        result.tableName ||
        null;


      // ===============================================
      // COMPLETE PROCESSING RECORD
      // ===============================================

      await historicalProcessingManager
        .completeRecord(
          processingRecord.processing_record_id,
          historicalTableName
        );


      // ===============================================
      // INCREMENT PROCESSED
      // ===============================================

      await historicalProcessingManager
        .incrementProcessed(
          job.job_id
        );


      console.log(
        "Telemetry processed:",
        telemetryId?.toString
          ? telemetryId.toString()
          : telemetryId
      );


      if (
        historicalTableName
      ) {

        console.log(
          "Historical Table:",
          historicalTableName
        );

      }


      return {

        status:
          "PROCESSED",

        telemetryId,

        result,

      };

    } catch (
      error
    ) {

      // ===============================================
      // GET ERROR MESSAGE
      // ===============================================

      const errorMessage =
        error?.message ||
        String(error);


      // ===============================================
      // MARK PROCESSING RECORD FAILED
      // ===============================================

      await historicalProcessingManager
        .failRecord(
          processingRecord.processing_record_id,
          errorMessage
        );


      // ===============================================
      // INCREMENT JOB FAILURE COUNT
      // ===============================================

      await historicalProcessingManager
        .incrementFailed(
          job.job_id
        );


      console.error(
        "Telemetry processing failed:",
        telemetryId?.toString
          ? telemetryId.toString()
          : telemetryId
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
  // SAFE JSON STRINGIFY
  // ===================================================

  safeStringify(
    value
  ) {

    return JSON.stringify(
      value,

      (
        key,
        value
      ) => {

        if (
          typeof value ===
          "bigint"
        ) {

          return value.toString();
        }


        return value;

      },

      2
    );
  }

}


// =====================================================
// EXPORT
// =====================================================

module.exports =
  new CitizenHistoricalDailyWorker();