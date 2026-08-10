const repository =
  require("../repositories/masterCitizenSync.repository");

// =====================================================
// CONFIGURATION
// =====================================================

const BATCH_SIZE = 5000;

// =====================================================
// NORMALIZE WARD VALUE
// =====================================================
//
// Helper DB stores ward as String.
//
// Supported examples:
//
// "174"          -> 174
// "Ward 174"     -> 174
// "WARD 174"     -> 174
// "ward-174"     -> 174
// "Ibbaluru-174" -> 174
//
// This allows the Helper database to contain
// different textual representations of the same ward.
// =====================================================

function normalizeWardNumber(wardValue) {
  if (
    wardValue === null ||
    wardValue === undefined
  ) {
    return null;
  }

  const value =
    String(wardValue).trim();

  if (!value) {
    return null;
  }

  // -----------------------------------------------
  // Complete numeric value
  // -----------------------------------------------

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  // -----------------------------------------------
  // Extract first numeric sequence
  //
  // Example:
  //
  // "Ward 174"     -> 174
  // "Ibbaluru-174" -> 174
  // -----------------------------------------------

  const match =
    value.match(/\d+/);

  if (!match) {
    return null;
  }

  const wardNo =
    Number(match[0]);

  return Number.isInteger(wardNo)
    ? wardNo
    : null;
}

// =====================================================
// BUILD WARD MAP
// =====================================================
//
// Creates an in-memory lookup:
//
// ward number -> ward information
//
// Example:
//
// 174 -> {
//   wardId: 2,
//   wardNo: 174,
//   wardName: "Ibbaluru",
//   wardTableName: "ward_ibbaluru"
// }
//
// NOTE:
// Ward numbers should ideally be unique within the
// Master Citizen hierarchy.
//
// If duplicate ward numbers are found, the first
// valid mapping is retained for FULL SYNC.
//
// For WARD-WISE SYNC we explicitly detect duplicates.
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
      Number(ward.wardNo);

    if (
      !Number.isInteger(wardNo)
    ) {
      continue;
    }

    if (
      !wardMap.has(wardNo)
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
// SYNC ALL CITIZENS
// =====================================================
//
// Synchronizes all citizens from the Helper DB.
//
// Flow:
//
// Helper DB
//     ↓
// Read citizens in batches
//     ↓
// Normalize ward value
//     ↓
// Find matching Master Citizen Ward
//     ↓
// Group citizens by physical ward table
//     ↓
// Bulk upsert
// =====================================================

async function syncAllCitizens() {
  const startedAt =
    Date.now();

  // ---------------------------------------------------
  // LOAD WARD REGISTRY ONCE
  // ---------------------------------------------------

  const wardMappings =
    await repository.getAllWardMappings();

  if (
    !wardMappings.length
  ) {
    return {
      sourceRecords: 0,
      processed: 0,
      insertedOrUpdated: 0,
      unmatchedWard: 0,
      failed: 0,
      batches: 0,
      durationMs:
        Date.now() - startedAt,
    };
  }

  const wardMap =
    buildWardMap(
      wardMappings
    );

  // ---------------------------------------------------
  // INITIAL STATE
  // ---------------------------------------------------

  let skip = 0;

  let sourceRecords = 0;
  let processed = 0;
  let insertedOrUpdated = 0;
  let unmatchedWard = 0;
  let failed = 0;
  let batches = 0;

  // ---------------------------------------------------
  // PROCESS BATCHES
  // ---------------------------------------------------

  while (true) {
    const citizens =
      await repository.getHelperCitizens(
        skip,
        BATCH_SIZE
      );

    // -------------------------------------------------
    // NO MORE RECORDS
    // -------------------------------------------------

    if (
      !citizens.length
    ) {
      break;
    }

    batches++;

    sourceRecords +=
      citizens.length;

    // -------------------------------------------------
    // GROUP CITIZENS BY WARD TABLE
    // -------------------------------------------------

    const citizensByWard =
      new Map();

    for (
      const citizen of citizens
    ) {
      const wardNo =
        normalizeWardNumber(
          citizen.ward
        );

      // -----------------------------------------------
      // WARD VALUE COULD NOT BE RESOLVED
      // -----------------------------------------------

      if (
        wardNo === null
      ) {
        unmatchedWard++;
        continue;
      }

      // -----------------------------------------------
      // FIND MASTER CITIZEN WARD
      // -----------------------------------------------

      const ward =
        wardMap.get(
          wardNo
        );

      // -----------------------------------------------
      // WARD DOES NOT EXIST
      // -----------------------------------------------

      if (!ward) {
        unmatchedWard++;
        continue;
      }

      // -----------------------------------------------
      // WARD TABLE NOT INITIALIZED
      // -----------------------------------------------

      const tableName =
        ward.wardTableName;

      if (!tableName) {
        unmatchedWard++;
        continue;
      }

      // -----------------------------------------------
      // CREATE GROUP
      // -----------------------------------------------

      if (
        !citizensByWard.has(
          tableName
        )
      ) {
        citizensByWard.set(
          tableName,
          []
        );
      }

      // -----------------------------------------------
      // REMOVE SOURCE-ONLY WARD FIELD
      //
      // The physical Ward table does not need the
      // original Helper "ward" string.
      // -----------------------------------------------

      const {
        ward: _ward,
        ...citizenData
      } = citizen;

      citizensByWard
        .get(tableName)
        .push(citizenData);
    }

    // -------------------------------------------------
    // BULK UPSERT EACH WARD
    // -------------------------------------------------

    for (
      const [
        tableName,
        wardCitizens,
      ] of citizensByWard
    ) {
      try {
        const result =
          await repository.bulkUpsertWardCitizens(
            tableName,
            wardCitizens
          );

        insertedOrUpdated +=
          result.insertedOrUpdated;

        processed +=
          wardCitizens.length;
      } catch (error) {
        failed +=
          wardCitizens.length;

        console.error(
          `Sync failed for ${tableName}:`,
          error
        );
      }
    }

    // -------------------------------------------------
    // NEXT BATCH
    // -------------------------------------------------

    skip +=
      citizens.length;
  }

  // ---------------------------------------------------
  // RESULT
  // ---------------------------------------------------

  return {
    sourceRecords,

    processed,

    insertedOrUpdated,

    unmatchedWard,

    failed,

    batches,

    durationMs:
      Date.now() - startedAt,
  };
}

// =====================================================
// SYNC ONE WARD
// =====================================================
//
// IMPORTANT:
//
// This function now accepts:
//
//     wardNo
//
// NOT:
//
//     wardId
//
// Example:
//
// syncOneWard(174)
//
// The endpoint will therefore be:
//
// POST /api/master-citizen/sync/ward/174
//
// Flow:
//
// wardNo 174
//     ↓
// Find Master Citizen Ward where ward_no = 174
//     ↓
// Get ward_table_name
//     ↓
// Read Helper citizens
//     ↓
// Normalize Helper ward values
//     ↓
// Keep only ward 174
//     ↓
// Bulk upsert into the Ward table
// =====================================================

async function syncOneWard(
  wardNo
) {
  const startedAt =
    Date.now();

  // ---------------------------------------------------
  // VALIDATE WARD NUMBER
  // ---------------------------------------------------

  const targetWardNo =
    Number(wardNo);

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

  // ---------------------------------------------------
  // LOAD MASTER CITIZEN WARD REGISTRY
  // ---------------------------------------------------

  const wardMappings =
    await repository.getAllWardMappings();

  // ---------------------------------------------------
  // FIND WARD USING ward_no
  //
  // We intentionally DO NOT use ward_id here.
  // ---------------------------------------------------

  const matchingWards =
    wardMappings.filter(
      (item) =>
        Number(item.wardNo) ===
        targetWardNo
    );

  // ---------------------------------------------------
  // WARD DOES NOT EXIST
  // ---------------------------------------------------

  if (
    matchingWards.length === 0
  ) {
    throw new Error(
      `Ward number ${targetWardNo} not found`
    );
  }

  // ---------------------------------------------------
  // DUPLICATE WARD NUMBER
  //
  // A ward number should identify one Ward in the
  // current Master Citizen configuration.
  //
  // If duplicate ward numbers exist, we should NOT
  // randomly choose one physical table.
  // ---------------------------------------------------

  if (
    matchingWards.length > 1
  ) {
    throw new Error(
      `Multiple wards found with ward number ${targetWardNo}. Ward number must be unique.`
    );
  }

  const ward =
    matchingWards[0];

  // ---------------------------------------------------
  // VALIDATE WARD TABLE
  // ---------------------------------------------------

  if (
    !ward.wardTableName
  ) {
    throw new Error(
      `Ward number ${targetWardNo} does not have an initialized ward table`
    );
  }

  // ---------------------------------------------------
  // INITIAL STATE
  // ---------------------------------------------------

  let skip = 0;

  let sourceRecords = 0;
  let processed = 0;
  let unmatchedWard = 0;
  let batches = 0;
  let insertedOrUpdated = 0;

  // ---------------------------------------------------
  // READ HELPER DATA IN BATCHES
  // ---------------------------------------------------

  while (true) {
    const citizens =
      await repository.getHelperCitizens(
        skip,
        BATCH_SIZE
      );

    // -------------------------------------------------
    // NO MORE RECORDS
    // -------------------------------------------------

    if (
      !citizens.length
    ) {
      break;
    }

    batches++;

    sourceRecords +=
      citizens.length;

    // -------------------------------------------------
    // FILTER ONLY TARGET WARD
    // -------------------------------------------------

    const wardCitizens =
      citizens
        .filter(
          (citizen) =>
            normalizeWardNumber(
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

    // -------------------------------------------------
    // BULK UPSERT
    // -------------------------------------------------

    if (
      wardCitizens.length
    ) {
      const result =
        await repository.bulkUpsertWardCitizens(
          ward.wardTableName,
          wardCitizens
        );

      processed +=
        wardCitizens.length;

      insertedOrUpdated +=
        result.insertedOrUpdated;
    }

    // -------------------------------------------------
    // NEXT BATCH
    // -------------------------------------------------

    skip +=
      citizens.length;
  }

  // ---------------------------------------------------
  // RESULT
  // ---------------------------------------------------

  return {
    wardId:
      ward.wardId,

    wardNo:
      ward.wardNo,

    wardName:
      ward.wardName,

    wardTableName:
      ward.wardTableName,

    sourceRecords,

    processed,

    insertedOrUpdated,

    unmatchedWard,

    batches,

    durationMs:
      Date.now() - startedAt,
  };
}

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  syncAllCitizens,
  syncOneWard,
  normalizeWardNumber,
};