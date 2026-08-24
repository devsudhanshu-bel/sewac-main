const repository =
  require("../repositories/masterCitizenSync.repository");


// =====================================================
// CONFIGURATION
// =====================================================

const BATCH_SIZE =
  5000;


// =====================================================
// REPOSITORY VALIDATION
// =====================================================
//
// This gives a clear startup/runtime error instead of:
//     repository.getAllWardMappings is not a function
//
// =====================================================

function validateRepository() {

  const requiredFunctions = [
    "getHelperCitizens",
    "getAllWardMappings",
    "bulkUpsertWardCitizens",
    "syncCitizenWardMappings",
    "normalizeWardNumber",
  ];


  const missing =
    requiredFunctions.filter(
      (functionName) =>
        typeof repository[functionName] !==
        "function"
    );


  if (
    missing.length > 0
  ) {

    throw new Error(
      `masterCitizenSync.repository is missing required functions: ${missing.join(
        ", "
      )}`
    );
  }
}


// =====================================================
// BUILD WARD MAP
// =====================================================
//
// IMPORTANT:
//
// The lookup key is:
//
//     ACTUAL WARD NUMBER
//
// NOT:
//
//     internal ward_id
//
// Example:
//
//     wardNo 216
//          ↓
//     {
//       wardId: 3,
//       wardNo: 216,
//       wardName: "Ibbalur",
//       wardTableName: "ward_ibbalur"
//     }
//
// =====================================================

function buildWardMap(
  wardMappings
) {

  const wardMap =
    new Map();


  for (
    const ward of wardMappings
  ) {

    const wardNo =
      Number(
        ward?.wardNo
      );


    if (
      !Number.isInteger(
        wardNo
      )
    ) {
      continue;
    }


    /*
     * If the same actual ward number appears more
     * than once, do not silently overwrite it.
     *
     * The first valid registry entry is retained.
     */
    if (
      !wardMap.has(
        wardNo
      )
    ) {

      wardMap.set(
        wardNo,
        ward
      );

    }

  }


  return wardMap;
}


// =====================================================
// CREATE EMPTY WARD REPORT
// =====================================================

function createWardReport(
  ward
) {

  return {

    // -----------------------------------------------
    // WARD INFORMATION
    // -----------------------------------------------

    wardId:
      ward.wardId,

    wardNo:
      ward.wardNo,

    wardName:
      ward.wardName,

    wardTableName:
      ward.wardTableName,


    // -----------------------------------------------
    // WARD SYNC
    // -----------------------------------------------

    sourceRecords:
      0,

    processed:
      0,

    insertedOrUpdated:
      0,

    unmatchedWard:
      0,

    failed:
      0,


    // -----------------------------------------------
    // PHONE → WARD MAPPING
    // -----------------------------------------------

    mappingReceived:
      0,

    mappingValidPhones:
      0,

    mappingInserted:
      0,

    mappingSkippedExisting:
      0,

    mappingSkippedInvalidPhone:
      0,

    mappingFailed:
      0,


    // -----------------------------------------------
    // STATUS
    // -----------------------------------------------

    wardSyncStatus:
      "NOT_STARTED",

    mappingSyncStatus:
      "NOT_STARTED",

    status:
      "NOT_STARTED",

  };

}


// =====================================================
// FINALIZE WARD STATUS
// =====================================================

function finalizeWardStatus(
  report
) {

  /*
   * Ward synchronization.
   */

  if (
    report.failed === 0 &&
    report.unmatchedWard === 0 &&
    report.processed ===
      report.sourceRecords
  ) {

    report.wardSyncStatus =
      "SUCCESS";

  } else if (
    report.processed > 0
  ) {

    report.wardSyncStatus =
      "PARTIAL";

  } else {

    report.wardSyncStatus =
      "FAILED";

  }


  /*
   * Mapping synchronization.
   */

  if (
    report.mappingFailed === 0
  ) {

    report.mappingSyncStatus =
      "SUCCESS";

  } else if (
    report.mappingReceived > 0
  ) {

    report.mappingSyncStatus =
      "PARTIAL";

  } else {

    report.mappingSyncStatus =
      "FAILED";

  }


  /*
   * Overall ward status.
   */

  if (
    report.wardSyncStatus ===
      "SUCCESS" &&
    report.mappingSyncStatus ===
      "SUCCESS"
  ) {

    report.status =
      "SUCCESS";

  } else if (
    report.wardSyncStatus ===
      "FAILED" ||
    report.mappingSyncStatus ===
      "FAILED"
  ) {

    report.status =
      "FAILED";

  } else {

    report.status =
      "PARTIAL";

  }


  return report;
}


// =====================================================
// SYNC ALL CITIZENS
// =====================================================
//
// POST:
//
// /api/master-citizen/sync
//
// FULL FLOW:
//
// Helper DB
//     ↓
// master_citizen_data
//     ↓
// citizen.ward
//     ↓
// ACTUAL WARD NUMBER
//     ↓
// Master Ward Registry
//     ↓
// Dynamic Ward Table
//
// IN PARALLEL:
//
// citizen.phoneNumber
//     ↓
// master_citizen_map
//     ↓
// ward_id = ACTUAL WARD NUMBER
//
// =====================================================

async function syncAllCitizens() {

  const startedAt =
    Date.now();


  // ===================================================
  // VALIDATE REPOSITORY
  // ===================================================

  validateRepository();


  console.log(
    "================================================="
  );

  console.log(
    "MASTER CITIZEN FULL SYNC STARTED"
  );

  console.log(
    "================================================="
  );


  // ===================================================
  // LOAD MASTER WARD REGISTRY
  // ===================================================

  const wardMappings =
    await repository.getAllWardMappings();


  console.log(
    `[Master Citizen Sync] Ward registry loaded: ${wardMappings.length} wards`
  );


  // ===================================================
  // NO WARDS
  // ===================================================

  if (
    !wardMappings.length
  ) {

    return {

      sourceRecords:
        0,

      processed:
        0,

      insertedOrUpdated:
        0,

      unmatchedWard:
        0,

      failed:
        0,

      batches:
        0,


      wardsDiscovered:
        0,

      wardsAttempted:
        0,

      wardsSuccessful:
        0,

      wardsFailed:
        0,


      wardsSynced:
        [],

      wardsFailedDetails:
        [],


      mappingReceived:
        0,

      mappingValidPhones:
        0,

      mappingInserted:
        0,

      mappingSkippedExisting:
        0,

      mappingSkippedInvalidPhone:
        0,

      mappingFailed:
        0,


      durationMs:
        Date.now() - startedAt,

    };

  }


  // ===================================================
  // BUILD WARD MAP
  // ===================================================

  const wardMap =
    buildWardMap(
      wardMappings
    );


  // ===================================================
  // GLOBAL COUNTERS
  // ===================================================

  let skip =
    0;

  let sourceRecords =
    0;

  let processed =
    0;

  let insertedOrUpdated =
    0;

  let unmatchedWard =
    0;

  let failed =
    0;

  let batches =
    0;


  // ===================================================
  // MAPPING COUNTERS
  // ===================================================

  let mappingReceived =
    0;

  let mappingValidPhones =
    0;

  let mappingInserted =
    0;

  let mappingSkippedExisting =
    0;

  let mappingSkippedInvalidPhone =
    0;

  let mappingFailed =
    0;


  // ===================================================
  // WARD REPORTS
  // ===================================================
  //
  // KEY:
  //
  //     actual ward number
  //
  // NOT internal ward ID.
  //
  // ===================================================

  const wardReports =
    new Map();


  // ===================================================
  // PROCESS HELPER DATA
  // ===================================================

  while (true) {

    const citizens =
      await repository.getHelperCitizens(
        skip,
        BATCH_SIZE
      );


    // -------------------------------------------------
    // NO MORE CITIZENS
    // -------------------------------------------------

    if (
      !citizens.length
    ) {

      break;

    }


    batches++;

    sourceRecords +=
      citizens.length;


    console.log(
      `[Master Citizen Sync] Processing batch ${batches}: ${citizens.length} records`
    );


    // =================================================
    // GROUP CITIZENS BY ACTUAL WARD NUMBER
    // =================================================

    const citizensByWard =
      new Map();


    for (
      const citizen of citizens
    ) {

      // -----------------------------------------------
      // NORMALIZE SOURCE WARD
      // -----------------------------------------------

      const wardNo =
        repository.normalizeWardNumber(
          citizen.ward
        );


      // -----------------------------------------------
      // INVALID WARD
      // -----------------------------------------------

      if (
        wardNo === null
      ) {

        unmatchedWard++;

        console.warn(
          `[Master Citizen Sync] Could not resolve ward for citizen ${citizen.id}`
        );

        continue;

      }


      // -----------------------------------------------
      // FIND WARD USING ACTUAL WARD NUMBER
      // -----------------------------------------------

      const ward =
        wardMap.get(
          wardNo
        );


      // -----------------------------------------------
      // WARD DOES NOT EXIST
      // -----------------------------------------------

      if (
        !ward
      ) {

        unmatchedWard++;

        console.warn(
          `[Master Citizen Sync] Ward number ${wardNo} not found in master ward registry`
        );

        continue;

      }


      // -----------------------------------------------
      // VALIDATE DYNAMIC TABLE
      // -----------------------------------------------

      if (
        !ward.wardTableName
      ) {

        unmatchedWard++;

        console.warn(
          `[Master Citizen Sync] Ward ${wardNo} has no ward table`
        );

        continue;

      }


      // -----------------------------------------------
      // CREATE WARD REPORT
      // -----------------------------------------------

      if (
        !wardReports.has(
          wardNo
        )
      ) {

        wardReports.set(
          wardNo,
          createWardReport(
            ward
          )
        );

      }


      const report =
        wardReports.get(
          wardNo
        );


      report.sourceRecords++;


      // -----------------------------------------------
      // REMOVE SOURCE-ONLY ward FIELD
      // -----------------------------------------------

      const {
        ward: _ward,
        ...citizenData
      } =
        citizen;


      // -----------------------------------------------
      // ADD CITIZEN TO WARD GROUP
      // -----------------------------------------------

      if (
        !citizensByWard.has(
          wardNo
        )
      ) {

        citizensByWard.set(
          wardNo,
          {
            ward,
            citizens: [],
          }
        );

      }


      citizensByWard
        .get(
          wardNo
        )
        .citizens
        .push(
          citizenData
        );

    }


    // =================================================
    // PROCESS EACH WARD GROUP
    // =================================================

    for (
      const [
        wardNo,
        wardGroup,
      ]
      of citizensByWard
    ) {

      const ward =
        wardGroup.ward;

      const wardCitizens =
        wardGroup.citizens;


      const report =
        wardReports.get(
          wardNo
        );


      // =================================================
      // IMPORTANT
      // =================================================
      //
      // ward.wardId
      //     = INTERNAL DATABASE ID
      //
      // ward.wardNo
      //     = ACTUAL MUNICIPAL WARD NUMBER
      //
      // master_citizen_map.ward_id MUST RECEIVE:
      //
      //     ward.wardNo
      //
      // NOT:
      //
      //     ward.wardId
      //
      // =================================================

      const actualWardNumber =
        Number(
          ward.wardNo
        );


      // =================================================
      // PARALLEL SYNC
      // =================================================

      const [
        wardResult,
        mappingResult,
      ] =
        await Promise.allSettled([

          // ---------------------------------------------
          // EXISTING WARD TABLE SYNC
          // ---------------------------------------------

          repository.bulkUpsertWardCitizens(
            ward.wardTableName,
            wardCitizens
          ),


          // ---------------------------------------------
          // PHONE → ACTUAL WARD NUMBER
          // ---------------------------------------------
          //
          // IMPORTANT:
          //
          // Passing wardNo here.
          //
          // This means:
          //
          // 216 → ward_id = 216
          //
          // NOT:
          //
          // 3 → ward_id = 3
          //
          // ---------------------------------------------

          repository.syncCitizenWardMappings(
            wardCitizens,
            actualWardNumber
          ),

        ]);


      // =================================================
      // HANDLE WARD TABLE RESULT
      // =================================================

      if (
        wardResult.status ===
        "fulfilled"
      ) {

        const result =
          wardResult.value;


        const upserted =
          Number(
            result?.insertedOrUpdated ||
            0
          );


        processed +=
          wardCitizens.length;


        insertedOrUpdated +=
          upserted;


        report.processed +=
          wardCitizens.length;


        report.insertedOrUpdated +=
          upserted;


        report.wardSyncStatus =
          "SUCCESS";


        console.log(
          `[Master Citizen Sync] Ward ${actualWardNumber} → ${ward.wardTableName}: ${wardCitizens.length} citizens synced`
        );

      } else {

        failed +=
          wardCitizens.length;


        report.failed +=
          wardCitizens.length;


        report.wardSyncStatus =
          "FAILED";


        console.error(
          `[Master Citizen Sync] Ward table sync failed for Ward ${actualWardNumber}:`,
          wardResult.reason
        );

      }


      // =================================================
      // HANDLE PHONE → WARD MAPPING RESULT
      // =================================================

      if (
        mappingResult.status ===
        "fulfilled"
      ) {

        const result =
          mappingResult.value;


        const received =
          Number(
            result?.received ||
            0
          );

        const validPhones =
          Number(
            result?.validPhones ||
            0
          );

        const inserted =
          Number(
            result?.inserted ||
            0
          );

        const skippedExisting =
          Number(
            result?.skippedExisting ||
            0
          );

        const skippedInvalidPhone =
          Number(
            result?.skippedInvalidPhone ||
            0
          );


        // ---------------------------------------------
        // GLOBAL
        // ---------------------------------------------

        mappingReceived +=
          received;

        mappingValidPhones +=
          validPhones;

        mappingInserted +=
          inserted;

        mappingSkippedExisting +=
          skippedExisting;

        mappingSkippedInvalidPhone +=
          skippedInvalidPhone;


        // ---------------------------------------------
        // WARD REPORT
        // ---------------------------------------------

        report.mappingReceived +=
          received;

        report.mappingValidPhones +=
          validPhones;

        report.mappingInserted +=
          inserted;

        report.mappingSkippedExisting +=
          skippedExisting;

        report.mappingSkippedInvalidPhone +=
          skippedInvalidPhone;


        report.mappingSyncStatus =
          "SUCCESS";


        console.log(
          `[Master Citizen Sync] Phone → Ward ${actualWardNumber}: received=${received}, valid=${validPhones}, inserted=${inserted}, existing=${skippedExisting}, invalid=${skippedInvalidPhone}`
        );

      } else {

        mappingFailed +=
          wardCitizens.length;


        report.mappingFailed +=
          wardCitizens.length;


        report.mappingSyncStatus =
          "FAILED";


        console.error(
          `[Master Citizen Sync] Phone → Ward mapping failed for Ward ${actualWardNumber}:`,
          mappingResult.reason
        );

      }


      // =================================================
      // UPDATE WARD STATUS
      // =================================================

      finalizeWardStatus(
        report
      );

    }


    // =================================================
    // NEXT BATCH
    // =================================================

    skip +=
      citizens.length;

  }


  // ===================================================
  // FINALIZE ALL WARD REPORTS
  // ===================================================

  const allWardReports =
    Array.from(
      wardReports.values()
    );


  for (
    const report of allWardReports
  ) {

    finalizeWardStatus(
      report
    );

  }


  // ===================================================
  // SUCCESSFUL WARDS
  // ===================================================

  const wardsSynced =
    allWardReports.filter(
      (ward) =>
        ward.status ===
        "SUCCESS"
    );


  // ===================================================
  // FAILED / PARTIAL WARDS
  // ===================================================

  const wardsFailedDetails =
    allWardReports.filter(
      (ward) =>
        ward.status !==
        "SUCCESS"
    );


  // ===================================================
  // DURATION
  // ===================================================

  const durationMs =
    Date.now() -
    startedAt;


  console.log(
    "================================================="
  );

  console.log(
    "MASTER CITIZEN FULL SYNC COMPLETED"
  );

  console.log(
    `Source records: ${sourceRecords}`
  );

  console.log(
    `Processed: ${processed}`
  );

  console.log(
    `Inserted / Updated: ${insertedOrUpdated}`
  );

  console.log(
    `Unmatched Ward: ${unmatchedWard}`
  );

  console.log(
    `Failed: ${failed}`
  );

  console.log(
    `Wards synced: ${wardsSynced.length}`
  );

  console.log(
    `Wards failed/partial: ${wardsFailedDetails.length}`
  );

  console.log(
    `Duration: ${durationMs} ms`
  );

  console.log(
    "================================================="
  );


  // ===================================================
  // RETURN
  // ===================================================

  return {

    // -----------------------------------------------
    // GLOBAL SYNC
    // -----------------------------------------------

    sourceRecords,

    processed,

    insertedOrUpdated,

    unmatchedWard,

    failed,

    batches,


    // -----------------------------------------------
    // WARD SUMMARY
    // -----------------------------------------------

    wardsDiscovered:
      allWardReports.length,

    wardsAttempted:
      allWardReports.length,

    wardsSuccessful:
      wardsSynced.length,

    wardsFailed:
      wardsFailedDetails.length,


    // -----------------------------------------------
    // SUCCESSFUL / COMPLETED WARDS
    // -----------------------------------------------

    wardsSynced,


    // -----------------------------------------------
    // FAILED / PARTIAL WARDS
    // -----------------------------------------------

    wardsFailedDetails,


    // -----------------------------------------------
    // PHONE → WARD MAPPING
    // -----------------------------------------------

    mappingReceived,

    mappingValidPhones,

    mappingInserted,

    mappingSkippedExisting,

    mappingSkippedInvalidPhone,

    mappingFailed,


    // -----------------------------------------------
    // DURATION
    // -----------------------------------------------

    durationMs,

  };

}


// =====================================================
// SYNC ONE WARD
// =====================================================
//
// POST:
//
// /api/master-citizen/sync/ward/:wardNo
//
// Example:
//
// /api/master-citizen/sync/ward/216
//
// IMPORTANT:
//
// Input is ACTUAL WARD NUMBER.
//
// 216
//   ↓
// ward.wardNo = 216
//   ↓
// ward table = ward_ibbalur
//   ↓
// master_citizen_map.ward_id = 216
//
// =====================================================

async function syncOneWard(
  wardNo
) {

  const startedAt =
    Date.now();


  // ===================================================
  // VALIDATE REPOSITORY
  // ===================================================

  validateRepository();


  // ===================================================
  // VALIDATE WARD NUMBER
  // ===================================================

  const targetWardNo =
    Number(
      wardNo
    );


  if (
    !Number.isInteger(
      targetWardNo
    ) ||
    targetWardNo <= 0
  ) {

    throw new Error(
      "Invalid ward number"
    );

  }


  console.log(
    "================================================="
  );

  console.log(
    "MASTER CITIZEN WARD SYNC STARTED"
  );

  console.log(
    `Ward Number: ${targetWardNo}`
  );

  console.log(
    "================================================="
  );


  // ===================================================
  // LOAD WARD REGISTRY
  // ===================================================

  const wardMappings =
    await repository.getAllWardMappings();


  // ===================================================
  // FIND WARD USING ACTUAL WARD NUMBER
  // ===================================================

  const matchingWards =
    wardMappings.filter(
      (item) =>
        Number(
          item.wardNo
        ) ===
        targetWardNo
    );


  // ===================================================
  // NOT FOUND
  // ===================================================

  if (
    matchingWards.length ===
    0
  ) {

    throw new Error(
      `Ward number ${targetWardNo} not found`
    );

  }


  // ===================================================
  // DUPLICATE
  // ===================================================

  if (
    matchingWards.length >
    1
  ) {

    throw new Error(
      `Multiple wards found with ward number ${targetWardNo}. Ward number must be unique.`
    );

  }


  const ward =
    matchingWards[0];


  // ===================================================
  // VALIDATE TABLE
  // ===================================================

  if (
    !ward.wardTableName
  ) {

    throw new Error(
      `Ward number ${targetWardNo} does not have an initialized ward table`
    );

  }


  // ===================================================
  // COUNTERS
  // ===================================================

  let skip =
    0;

  let sourceRecords =
    0;

  let processed =
    0;

  let unmatchedWard =
    0;

  let batches =
    0;

  let insertedOrUpdated =
    0;


  // ===================================================
  // MAPPING COUNTERS
  // ===================================================

  let mappingReceived =
    0;

  let mappingValidPhones =
    0;

  let mappingInserted =
    0;

  let mappingSkippedExisting =
    0;

  let mappingSkippedInvalidPhone =
    0;

  let mappingFailed =
    0;


  // ===================================================
  // READ HELPER DATA
  // ===================================================

  while (true) {

    const citizens =
      await repository.getHelperCitizens(
        skip,
        BATCH_SIZE
      );


    // -------------------------------------------------
    // END
    // -------------------------------------------------

    if (
      !citizens.length
    ) {

      break;

    }


    batches++;

    sourceRecords +=
      citizens.length;


    // =================================================
    // FILTER TARGET WARD
    // =================================================

    const wardCitizens =
      citizens
        .filter(
          (citizen) =>
            repository.normalizeWardNumber(
              citizen.ward
            ) ===
            targetWardNo
        )
        .map(
          ({
            ward: _ward,
            ...citizen
          }) =>
            citizen
        );


    // =================================================
    // NOTHING IN THIS BATCH
    // =================================================

    if (
      !wardCitizens.length
    ) {

      skip +=
        citizens.length;

      continue;

    }


    // =================================================
    // IMPORTANT:
    //
    // Mapping receives ACTUAL WARD NUMBER.
    //
    // NOT ward.wardId.
    // =================================================

    const actualWardNumber =
      Number(
        ward.wardNo
      );


    // =================================================
    // PARALLEL SYNC
    // =================================================

    const [
      wardResult,
      mappingResult,
    ] =
      await Promise.allSettled([

        // ---------------------------------------------
        // WARD TABLE
        // ---------------------------------------------

        repository.bulkUpsertWardCitizens(
          ward.wardTableName,
          wardCitizens
        ),


        // ---------------------------------------------
        // PHONE → ACTUAL WARD NUMBER
        // ---------------------------------------------

        repository.syncCitizenWardMappings(
          wardCitizens,
          actualWardNumber
        ),

      ]);


    // =================================================
    // HANDLE WARD SYNC
    // =================================================

    if (
      wardResult.status ===
      "fulfilled"
    ) {

      const result =
        wardResult.value;


      processed +=
        wardCitizens.length;


      insertedOrUpdated +=
        Number(
          result?.insertedOrUpdated ||
          0
        );


    } else {

      unmatchedWard +=
        wardCitizens.length;


      console.error(
        `[Master Citizen Sync] Ward ${targetWardNo} table sync failed:`,
        wardResult.reason
      );

    }


    // =================================================
    // HANDLE MAPPING SYNC
    // =================================================

    if (
      mappingResult.status ===
      "fulfilled"
    ) {

      const result =
        mappingResult.value;


      mappingReceived +=
        Number(
          result?.received ||
          0
        );


      mappingValidPhones +=
        Number(
          result?.validPhones ||
          0
        );


      mappingInserted +=
        Number(
          result?.inserted ||
          0
        );


      mappingSkippedExisting +=
        Number(
          result?.skippedExisting ||
          0
        );


      mappingSkippedInvalidPhone +=
        Number(
          result?.skippedInvalidPhone ||
          0
        );


    } else {

      mappingFailed +=
        wardCitizens.length;


      console.error(
        `[Master Citizen Sync] Phone → Ward mapping failed for Ward ${targetWardNo}:`,
        mappingResult.reason
      );

    }


    // =================================================
    // NEXT BATCH
    // =================================================

    skip +=
      citizens.length;

  }


  // ===================================================
  // FINAL STATUS
  // ===================================================

  const wardSyncStatus =
    unmatchedWard === 0 &&
    processed ===
      sourceRecords
      ? "SUCCESS"
      : processed > 0
        ? "PARTIAL"
        : "FAILED";


  const mappingSyncStatus =
    mappingFailed === 0
      ? "SUCCESS"
      : mappingReceived > 0
        ? "PARTIAL"
        : "FAILED";


  const status =
    wardSyncStatus ===
      "SUCCESS" &&
    mappingSyncStatus ===
      "SUCCESS"
      ? "SUCCESS"
      : wardSyncStatus ===
          "FAILED" ||
        mappingSyncStatus ===
          "FAILED"
        ? "FAILED"
        : "PARTIAL";


  // ===================================================
  // RESULT
  // ===================================================

  return {

    // -----------------------------------------------
    // WARD
    // -----------------------------------------------

    wardId:
      ward.wardId,

    wardNo:
      ward.wardNo,

    wardName:
      ward.wardName,

    wardTableName:
      ward.wardTableName,


    // -----------------------------------------------
    // SYNC
    // -----------------------------------------------

    sourceRecords,

    processed,

    insertedOrUpdated,

    unmatchedWard,

    failed:
      unmatchedWard,


    // -----------------------------------------------
    // BATCHES
    // -----------------------------------------------

    batches,


    // -----------------------------------------------
    // PHONE → WARD MAPPING
    // -----------------------------------------------

    mappingReceived,

    mappingValidPhones,

    mappingInserted,

    mappingSkippedExisting,

    mappingSkippedInvalidPhone,

    mappingFailed,


    // -----------------------------------------------
    // STATUS
    // -----------------------------------------------

    wardSyncStatus,

    mappingSyncStatus,

    status,


    // -----------------------------------------------
    // DURATION
    // -----------------------------------------------

    durationMs:
      Date.now() -
      startedAt,

  };

}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  syncAllCitizens,

  syncOneWard,

  buildWardMap,

};