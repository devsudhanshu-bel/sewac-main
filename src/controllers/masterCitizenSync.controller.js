const service =
  require("../services/masterCitizenSync.service");


// =====================================================
// FULL MASTER CITIZEN SYNC
// =====================================================
//
// POST
// /api/master-citizen/sync
//
// The response contains:
//
// - Global sync statistics
// - Every ward that was synced
// - Citizens processed per ward
// - Inserted / updated per ward
// - Phone mapping statistics per ward
//
// =====================================================

async function syncAllCitizens(
  req,
  res
) {

  const startedAt =
    Date.now();


  try {

    console.log(
      "================================================="
    );

    console.log(
      "MASTER CITIZEN FULL SYNC STARTED"
    );

    console.log(
      "================================================="
    );


    // =================================================
    // CALL SERVICE
    // =================================================

    const result =
      await service.syncAllCitizens();


    // =================================================
    // GLOBAL SUMMARY
    // =================================================

    console.log(
      "================================================="
    );

    console.log(
      "MASTER CITIZEN FULL SYNC COMPLETED"
    );

    console.log(
      "================================================="
    );


    console.log(
      `Duration: ${result.durationMs} ms`
    );

    console.log(
      `Source records: ${result.sourceRecords}`
    );

    console.log(
      `Processed: ${result.processed}`
    );

    console.log(
      `Inserted / Updated: ${result.insertedOrUpdated}`
    );

    console.log(
      `Unmatched Ward: ${result.unmatchedWard}`
    );

    console.log(
      `Failed: ${result.failed}`
    );

    console.log(
      `Batches: ${result.batches}`
    );


    // =================================================
    // WARD SUMMARY
    // =================================================

    console.log(
      "-------------------------------------------------"
    );

    console.log(
      "WARDS SYNCED"
    );

    console.log(
      `Total wards attempted: ${result.wardsAttempted}`
    );

    console.log(
      `Successful wards: ${result.wardsSuccessful}`
    );

    console.log(
      `Failed wards: ${result.wardsFailed}`
    );

    console.log(
      "-------------------------------------------------"
    );


    // =================================================
    // PRINT EVERY WARD
    // =================================================

    if (
      result.wardsSynced &&
      result.wardsSynced.length
    ) {

      for (
        const ward of result.wardsSynced
      ) {

        console.log(
          `Ward ${ward.wardNo} | ${ward.wardName || "N/A"}`
        );

        console.log(
          `  Ward ID: ${ward.wardId}`
        );

        console.log(
          `  Table: ${ward.wardTableName}`
        );

        console.log(
          `  Citizens: ${ward.processed}`
        );

        console.log(
          `  Inserted / Updated: ${ward.insertedOrUpdated}`
        );

        console.log(
          `  Ward Sync: ${ward.wardSyncStatus}`
        );

        console.log(
          `  Mapping Received: ${ward.mappingReceived}`
        );

        console.log(
          `  Mapping Inserted: ${ward.mappingInserted}`
        );

        console.log(
          `  Existing Mapping: ${ward.mappingSkippedExisting}`
        );

        console.log(
          `  Invalid Phones: ${ward.mappingSkippedInvalidPhone}`
        );

        console.log(
          `  Mapping Sync: ${ward.mappingSyncStatus}`
        );

        console.log(
          "-------------------------------------------------"
        );
      }

    } else {

      console.log(
        "No wards were synchronized."
      );
    }


    // =================================================
    // GLOBAL PHONE MAPPING
    // =================================================

    console.log(
      "PHONE → WARD MAPPING"
    );

    console.log(
      `Mapping received: ${result.mappingReceived}`
    );

    console.log(
      `Valid phones: ${result.mappingValidPhones}`
    );

    console.log(
      `New mappings inserted: ${result.mappingInserted}`
    );

    console.log(
      `Existing mappings skipped: ${result.mappingSkippedExisting}`
    );

    console.log(
      `Invalid phones skipped: ${result.mappingSkippedInvalidPhone}`
    );

    console.log(
      `Mapping failures: ${result.mappingFailed}`
    );


    console.log(
      "================================================="
    );


    // =================================================
    // SUCCESS RESPONSE
    // =================================================

    return res
      .status(200)
      .json({

        success:
          true,

        message:
          "Master citizen synchronization completed successfully.",

        data: {

          // -------------------------------------------
          // GLOBAL
          // -------------------------------------------

          sourceRecords:
            result.sourceRecords,

          processed:
            result.processed,

          insertedOrUpdated:
            result.insertedOrUpdated,

          unmatchedWard:
            result.unmatchedWard,

          failed:
            result.failed,

          batches:
            result.batches,


          // -------------------------------------------
          // WARD SUMMARY
          // -------------------------------------------

          wardsAttempted:
            result.wardsAttempted,

          wardsSuccessful:
            result.wardsSuccessful,

          wardsFailed:
            result.wardsFailed,


          // -------------------------------------------
          // THIS IS THE IMPORTANT PART
          //
          // Complete list of wards synchronized.
          // -------------------------------------------

          wardsSynced:
            result.wardsSynced,


          // -------------------------------------------
          // PHONE MAPPING
          // -------------------------------------------

          mappingReceived:
            result.mappingReceived,

          mappingValidPhones:
            result.mappingValidPhones,

          mappingInserted:
            result.mappingInserted,

          mappingSkippedExisting:
            result.mappingSkippedExisting,

          mappingSkippedInvalidPhone:
            result.mappingSkippedInvalidPhone,

          mappingFailed:
            result.mappingFailed,


          // -------------------------------------------
          // DURATION
          // -------------------------------------------

          durationMs:
            result.durationMs,

          totalDurationMs:
            Date.now() -
            startedAt,

        },

      });

  } catch (
    error
  ) {

    console.error(
      "================================================="
    );

    console.error(
      "MASTER CITIZEN FULL SYNC FAILED"
    );

    console.error(
      "Error:",
      error
    );

    console.error(
      "================================================="
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          "Master citizen synchronization failed.",

        error:
          error.message,

      });
  }
}


// =====================================================
// WARD-WISE MASTER CITIZEN SYNC
// =====================================================
//
// POST
// /api/master-citizen/sync/ward/:wardNo
//
// Example:
//
// /api/master-citizen/sync/ward/216
//
// =====================================================

async function syncOneWard(
  req,
  res
) {

  const startedAt =
    Date.now();


  const wardNo =
    Number(
      req.params.wardNo
    );


  try {

    // =================================================
    // VALIDATE
    // =================================================

    if (
      !Number.isInteger(
        wardNo
      ) ||
      wardNo <= 0
    ) {

      return res
        .status(400)
        .json({

          success:
            false,

          message:
            "Invalid ward number.",

          data:
            null,

        });
    }


    // =================================================
    // START LOG
    // =================================================

    console.log(
      "================================================="
    );

    console.log(
      "MASTER CITIZEN WARD SYNC STARTED"
    );

    console.log(
      `Ward Number: ${wardNo}`
    );

    console.log(
      "================================================="
    );


    // =================================================
    // CALL SERVICE
    // =================================================

    const result =
      await service.syncOneWard(
        wardNo
      );


    // =================================================
    // COMPLETION LOG
    // =================================================

    console.log(
      "================================================="
    );

    console.log(
      "MASTER CITIZEN WARD SYNC COMPLETED"
    );

    console.log(
      `Ward Number: ${result.wardNo}`
    );

    console.log(
      `Ward Name: ${result.wardName || "N/A"}`
    );

    console.log(
      `Ward ID: ${result.wardId}`
    );

    console.log(
      `Ward Table: ${result.wardTableName}`
    );

    console.log(
      `Source records scanned: ${result.sourceRecords}`
    );

    console.log(
      `Citizens processed: ${result.processed}`
    );

    console.log(
      `Inserted / Updated: ${result.insertedOrUpdated}`
    );

    console.log(
      "-------------------------------------------------"
    );

    console.log(
      "PHONE → WARD MAPPING"
    );

    console.log(
      `Mapping received: ${result.mappingReceived}`
    );

    console.log(
      `Valid phones: ${result.mappingValidPhones}`
    );

    console.log(
      `New mappings inserted: ${result.mappingInserted}`
    );

    console.log(
      `Existing mappings skipped: ${result.mappingSkippedExisting}`
    );

    console.log(
      `Invalid phones skipped: ${result.mappingSkippedInvalidPhone}`
    );

    console.log(
      `Mapping failures: ${result.mappingFailed}`
    );

    console.log(
      "================================================="
    );


    // =================================================
    // RESPONSE
    // =================================================

    return res
      .status(200)
      .json({

        success:
          true,

        message:
          `Ward ${result.wardNo} synchronization completed successfully.`,

        data: {

          // -------------------------------------------
          // WARD IDENTITY
          // -------------------------------------------

          wardId:
            result.wardId,

          wardNo:
            result.wardNo,

          wardName:
            result.wardName,

          wardTableName:
            result.wardTableName,


          // -------------------------------------------
          // SYNC
          // -------------------------------------------

          sourceRecords:
            result.sourceRecords,

          processed:
            result.processed,

          insertedOrUpdated:
            result.insertedOrUpdated,

          unmatchedWard:
            result.unmatchedWard,

          batches:
            result.batches,


          // -------------------------------------------
          // MAPPING
          // -------------------------------------------

          mappingReceived:
            result.mappingReceived,

          mappingValidPhones:
            result.mappingValidPhones,

          mappingInserted:
            result.mappingInserted,

          mappingSkippedExisting:
            result.mappingSkippedExisting,

          mappingSkippedInvalidPhone:
            result.mappingSkippedInvalidPhone,

          mappingFailed:
            result.mappingFailed,


          // -------------------------------------------
          // DURATION
          // -------------------------------------------

          durationMs:
            result.durationMs,

          totalDurationMs:
            Date.now() -
            startedAt,

        },

      });

  } catch (
    error
  ) {

    console.error(
      "================================================="
    );

    console.error(
      "MASTER CITIZEN WARD SYNC FAILED"
    );

    console.error(
      `Ward Number: ${wardNo}`
    );

    console.error(
      "Error:",
      error
    );

    console.error(
      "================================================="
    );


    // =================================================
    // ERROR STATUS
    // =================================================

    const statusCode =
      error.message &&
      error.message
        .toLowerCase()
        .includes(
          "not found"
        )
        ? 404
        : 500;


    return res
      .status(statusCode)
      .json({

        success:
          false,

        message:
          "Ward synchronization failed.",

        error:
          error.message,

        data:
          null,

      });
  }
}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  syncAllCitizens,

  syncOneWard,

};