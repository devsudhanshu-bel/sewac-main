const helperPrisma =
  require("../config/helperPrisma");

const masterCitizenPrisma =
  require("../config/masterCitizenPrisma");


// =====================================================
// CONFIGURATION
// =====================================================

const DEFAULT_BATCH_SIZE =
  5000;

// PostgreSQL has a parameter limit.
// 2000 citizens × 19 columns = 38,000 params,
// which stays safely below the PostgreSQL limit.
const WARD_UPSERT_CHUNK_SIZE =
  2000;


// =====================================================
// SAFE SQL IDENTIFIER
// =====================================================
//
// Dynamic table names are used throughout the
// Master Citizen hierarchy.
//
// Since table names are SQL identifiers, they cannot
// be passed as normal Prisma parameters.
//
// Therefore every dynamic table name MUST be validated.
//
// =====================================================

function validateTableName(
  tableName
) {

  if (
    typeof tableName !== "string" ||
    !tableName.trim()
  ) {

    throw new Error(
      `Invalid dynamic table name: ${tableName}`
    );
  }


  const trimmed =
    tableName.trim();


  if (
    !/^[A-Za-z0-9_]+$/.test(
      trimmed
    )
  ) {

    throw new Error(
      `Unsafe dynamic table name: ${trimmed}`
    );
  }


  return trimmed;
}


// =====================================================
// NORMALIZE WARD NUMBER
// =====================================================
//
// Supported:
//
// 216
// "216"
// "Ward 216"
// "WARD 216"
// "ward-216"
// "Ibbaluru-216"
//
// Returns:
//
// 216
//
// or:
//
// null
//
// =====================================================

function normalizeWardNumber(
  wardValue
) {

  if (
    wardValue === null ||
    wardValue === undefined
  ) {

    return null;
  }


  const value =
    String(
      wardValue
    ).trim();


  if (!value) {

    return null;
  }


  // ---------------------------------------------------
  // Pure numeric value
  // ---------------------------------------------------

  if (
    /^\d+$/.test(
      value
    )
  ) {

    const number =
      Number(
        value
      );


    return Number.isInteger(
      number
    )
      ? number
      : null;
  }


  // ---------------------------------------------------
  // Extract first numeric sequence
  // ---------------------------------------------------

  const match =
    value.match(
      /\d+/
    );


  if (!match) {

    return null;
  }


  const number =
    Number(
      match[0]
    );


  return Number.isInteger(
    number
  )
    ? number
    : null;
}


// =====================================================
// NORMALIZE PHONE NUMBER
// =====================================================
//
// Converts Indian phone numbers into:
//
// +919876543210
//
// Examples:
//
// 9876543210
// +919876543210
// 919876543210
// +91 9876543210
// 98765-43210
//
// =====================================================

function normalizePhoneNumber(
  phoneValue
) {

  if (
    phoneValue === null ||
    phoneValue === undefined
  ) {

    return null;
  }


  let value =
    String(
      phoneValue
    ).trim();


  if (!value) {

    return null;
  }


  // ---------------------------------------------------
  // Remove common formatting
  // ---------------------------------------------------

  value =
    value.replace(
      /[\s\-().]/g,
      ""
    );


  // ---------------------------------------------------
  // Keep digits and optional +
  // ---------------------------------------------------

  if (
    value.startsWith("+")
  ) {

    value =
      "+" +
      value
        .slice(1)
        .replace(
          /\D/g,
          ""
        );

  } else {

    value =
      value.replace(
        /\D/g,
        ""
      );
  }


  if (!value) {

    return null;
  }


  // ---------------------------------------------------
  // Already canonical
  // ---------------------------------------------------

  if (
    /^\+91\d{10}$/.test(
      value
    )
  ) {

    return value;
  }


  // ---------------------------------------------------
  // 91XXXXXXXXXX
  // ---------------------------------------------------

  if (
    /^91\d{10}$/.test(
      value
    )
  ) {

    return `+${value}`;
  }


  // ---------------------------------------------------
  // XXXXXXXXXX
  // ---------------------------------------------------

  if (
    /^\d{10}$/.test(
      value
    )
  ) {

    return `+91${value}`;
  }


  // ---------------------------------------------------
  // Other international format
  // ---------------------------------------------------

  if (
    /^\+\d{8,15}$/.test(
      value
    )
  ) {

    return value;
  }


  return null;
}


// =====================================================
// GET CITIZENS FROM HELPER DATABASE
// =====================================================
//
// Source:
//
// Helper DB
//     ↓
// master_citizen_data
//
// IMPORTANT:
//
// `ward` is used by the service to decide which
// Ward table receives the citizen.
//
// The actual `ward` field itself is NOT inserted
// into the dynamic Ward table.
//
// =====================================================

async function getHelperCitizens(
  skip = 0,
  take = DEFAULT_BATCH_SIZE
) {

  return helperPrisma
    .master_citizen_data
    .findMany({

      skip,

      take,

      orderBy: {
        id: "asc",
      },

      select: {

        id: true,

        phoneNumber: true,

        ward: true,

        area: true,

        wasteGeneratorTypes: true,

        houseNumber: true,

        floorNumber: true,

        householdType: true,

        personName: true,

        contactNumber: true,

        numberOfPeople: true,

        buildingPhoto: true,

        createdAt: true,

        updatedAt: true,

        dryRFID: true,

        drySlno: true,

        wetRFID: true,

        wetSlno: true,

        lat: true,

        lng: true,

      },

    });
}


// =====================================================
// GET ALL WARD MAPPINGS
// =====================================================
//
// COMPLETE MASTER CITIZEN HIERARCHY:
//
// City
//   ↓
// Zone
//   ↓
// Division
//   ↓
// Ward
//   ↓
// Dynamic Ward Citizen Table
//
// IMPORTANT:
//
// wardId = INTERNAL DATABASE WARD ID
//
// wardNo = ACTUAL MUNICIPAL WARD NUMBER
//
// Example:
//
// wardId = 3
// wardNo = 216
// wardName = Ibbaluru
// wardTableName = ward_ibbaluru
//
// =====================================================

async function getAllWardMappings() {

  console.log(
    "[Master Citizen Repository] Loading hierarchy..."
  );


  // ===================================================
  // CITY
  // ===================================================

  const cities =
    await masterCitizenPrisma
      .city_table
      .findMany({

        select: {

          city_id: true,

          city_name: true,

          city_table_name: true,

        },

        orderBy: {

          city_id: "asc",

        },

      });


  const wardMappings = [];


  // ===================================================
  // CITY LOOP
  // ===================================================

  for (
    const city of cities
  ) {

    if (
      !city.city_table_name
    ) {

      console.warn(
        `[Master Citizen Repository] City ${city.city_name} has no dynamic table`
      );

      continue;
    }


    const cityTableName =
      validateTableName(
        city.city_table_name
      );


    // =================================================
    // ZONES
    // =================================================

    const zones =
      await masterCitizenPrisma
        .$queryRawUnsafe(
          `
          SELECT
            zone_id,
            zone_name,
            zone_table_name
          FROM "${cityTableName}"
          ORDER BY zone_id ASC
          `
        );


    // =================================================
    // ZONE LOOP
    // =================================================

    for (
      const zone of zones
    ) {

      if (
        !zone.zone_table_name
      ) {

        console.warn(
          `[Master Citizen Repository] Zone ${zone.zone_name} has no dynamic table`
        );

        continue;
      }


      const zoneTableName =
        validateTableName(
          zone.zone_table_name
        );


      // ===============================================
      // DIVISIONS
      // ===============================================

      const divisions =
        await masterCitizenPrisma
          .$queryRawUnsafe(
            `
            SELECT
              division_id,
              division_name,
              division_table_name
            FROM "${zoneTableName}"
            ORDER BY division_id ASC
            `
          );


      // ===============================================
      // DIVISION LOOP
      // ===============================================

      for (
        const division of divisions
      ) {

        if (
          !division.division_table_name
        ) {

          console.warn(
            `[Master Citizen Repository] Division ${division.division_name} has no dynamic table`
          );

          continue;
        }


        const divisionTableName =
          validateTableName(
            division.division_table_name
          );


        // =============================================
        // WARDS
        // =============================================

        const wards =
          await masterCitizenPrisma
            .$queryRawUnsafe(
              `
              SELECT
                ward_id,
                ward_no,
                ward_name,
                ward_table_name
              FROM "${divisionTableName}"
              ORDER BY ward_id ASC
              `
            );


        // =============================================
        // WARD LOOP
        // =============================================

        for (
          const ward of wards
        ) {

          if (
            !ward.ward_table_name
          ) {

            console.warn(
              `[Master Citizen Repository] Ward ${ward.ward_name} has no dynamic table`
            );

            continue;
          }


          const wardTableName =
            validateTableName(
              ward.ward_table_name
            );


          const normalizedWardNo =
            normalizeWardNumber(
              ward.ward_no
            );


          if (
            normalizedWardNo === null
          ) {

            console.warn(
              `[Master Citizen Repository] Invalid ward number for ${ward.ward_name}:`,
              ward.ward_no
            );

            continue;
          }


          wardMappings.push({

            // ---------------------------------------
            // CITY
            // ---------------------------------------

            cityId:
              city.city_id,

            cityName:
              city.city_name,


            // ---------------------------------------
            // ZONE
            // ---------------------------------------

            zoneId:
              zone.zone_id,

            zoneName:
              zone.zone_name,


            // ---------------------------------------
            // DIVISION
            // ---------------------------------------

            divisionId:
              division.division_id,

            divisionName:
              division.division_name,


            // ---------------------------------------
            // WARD
            // ---------------------------------------

            // INTERNAL DB ID
            wardId:
              ward.ward_id,

            // ACTUAL MUNICIPAL WARD NUMBER
            wardNo:
              normalizedWardNo,

            wardName:
              ward.ward_name,

            wardTableName:
              wardTableName,

          });
        }
      }
    }
  }


  // ===================================================
  // DEBUG SUMMARY
  // ===================================================

  console.log(
    `[Master Citizen Repository] Cities found: ${cities.length}`
  );

  console.log(
    `[Master Citizen Repository] Wards mapped: ${wardMappings.length}`
  );


  // ===================================================
  // DEBUG WARD 216
  // ===================================================

  const ward216 =
    wardMappings.find(
      (ward) =>
        Number(
          ward.wardNo
        ) === 216
    );


  if (
    ward216
  ) {

    console.log(
      "[Master Citizen Repository] Ward 216 mapping:",
      {

        city:
          ward216.cityName,

        zone:
          ward216.zoneName,

        division:
          ward216.divisionName,

        internalWardId:
          ward216.wardId,

        actualWardNo:
          ward216.wardNo,

        wardName:
          ward216.wardName,

        wardTableName:
          ward216.wardTableName,

      }
    );

  } else {

    console.log(
      "[Master Citizen Repository] Ward 216 not present in hierarchy"
    );
  }


  return wardMappings;
}


// =====================================================
// BULK UPSERT CITIZENS INTO WARD TABLE
// =====================================================
//
// Existing Ward synchronization.
//
// This remains independent from the phone → ward
// mapping system.
//
// =====================================================

async function bulkUpsertWardCitizens(
  wardTableName,
  citizens
) {

  if (
    !wardTableName
  ) {

    throw new Error(
      "Ward table name is required"
    );
  }


  if (
    !Array.isArray(
      citizens
    )
  ) {

    throw new Error(
      "Citizens must be an array"
    );
  }


  if (
    !citizens.length
  ) {

    return {
      insertedOrUpdated: 0,
    };
  }


  const safeWardTableName =
    validateTableName(
      wardTableName
    );


  // ===================================================
  // CHUNK CITIZENS
  // ===================================================

  let insertedOrUpdated =
    0;


  for (
    let start = 0;
    start < citizens.length;
    start += WARD_UPSERT_CHUNK_SIZE
  ) {

    const chunk =
      citizens.slice(
        start,
        start +
          WARD_UPSERT_CHUNK_SIZE
      );


    // ===============================================
    // VALUES
    // ===============================================

    const values = [];


    for (
      const citizen of chunk
    ) {

      values.push(

        citizen.id,

        citizen.phoneNumber,

        citizen.area,

        citizen.wasteGeneratorTypes,

        citizen.houseNumber,

        citizen.floorNumber,

        citizen.householdType,

        citizen.personName,

        citizen.contactNumber,

        citizen.numberOfPeople,

        citizen.buildingPhoto,

        citizen.createdAt,

        citizen.updatedAt,

        citizen.dryRFID,

        citizen.drySlno,

        citizen.wetRFID,

        citizen.wetSlno,

        citizen.lat,

        citizen.lng,

      );
    }


    // ===============================================
    // PLACEHOLDERS
    // ===============================================

    const placeholders = [];


    let parameterIndex =
      1;


    for (
      let i = 0;
      i < chunk.length;
      i++
    ) {

      placeholders.push(
        `(
          $${parameterIndex++},
          $${parameterIndex++},
          $${parameterIndex++},
          $${parameterIndex++},
          $${parameterIndex++},
          $${parameterIndex++},
          $${parameterIndex++},
          $${parameterIndex++},
          $${parameterIndex++},
          $${parameterIndex++},
          $${parameterIndex++},
          $${parameterIndex++},
          $${parameterIndex++},
          $${parameterIndex++},
          $${parameterIndex++},
          $${parameterIndex++},
          $${parameterIndex++},
          $${parameterIndex++},
          $${parameterIndex++}
        )`
      );
    }


    // ===============================================
    // UPSERT
    // ===============================================

    const query = `

      INSERT INTO "${safeWardTableName}"
      (
        id,
        "phoneNumber",
        area,
        "wasteGeneratorTypes",
        "houseNumber",
        "floorNumber",
        "householdType",
        "personName",
        "contactNumber",
        "numberOfPeople",
        "buildingPhoto",
        "createdAt",
        "updatedAt",
        "dryRFID",
        "drySlno",
        "wetRFID",
        "wetSlno",
        lat,
        lng
      )

      VALUES

        ${placeholders.join(",")}

      ON CONFLICT (id)

      DO UPDATE SET

        "phoneNumber" =
          EXCLUDED."phoneNumber",

        area =
          EXCLUDED.area,

        "wasteGeneratorTypes" =
          EXCLUDED."wasteGeneratorTypes",

        "houseNumber" =
          EXCLUDED."houseNumber",

        "floorNumber" =
          EXCLUDED."floorNumber",

        "householdType" =
          EXCLUDED."householdType",

        "personName" =
          EXCLUDED."personName",

        "contactNumber" =
          EXCLUDED."contactNumber",

        "numberOfPeople" =
          EXCLUDED."numberOfPeople",

        "buildingPhoto" =
          EXCLUDED."buildingPhoto",

        "createdAt" =
          EXCLUDED."createdAt",

        "updatedAt" =
          EXCLUDED."updatedAt",

        "dryRFID" =
          EXCLUDED."dryRFID",

        "drySlno" =
          EXCLUDED."drySlno",

        "wetRFID" =
          EXCLUDED."wetRFID",

        "wetSlno" =
          EXCLUDED."wetSlno",

        lat =
          EXCLUDED.lat,

        lng =
          EXCLUDED.lng

    `;


    await masterCitizenPrisma
      .$executeRawUnsafe(
        query,
        ...values
      );


    insertedOrUpdated +=
      chunk.length;
  }


  return {

    insertedOrUpdated,

  };
}


// =====================================================
// PHONE → WARD MAPPING
// =====================================================
//
// IMPORTANT FINAL RULE:
//
// `wardNo` is the ACTUAL WARD NUMBER.
//
// Example:
//
// Ward registry:
//
// internal ward_id = 3
// actual ward_no   = 216
//
// Mapping table:
//
// phone_number = +919901015589
// ward_id      = 216
//
// Therefore this function MUST receive:
//
// syncCitizenWardMappings(
//   citizens,
//   216
// )
//
// NOT:
//
// syncCitizenWardMappings(
//   citizens,
//   3
// )
//
// Existing phone mappings are NOT changed.
//
// New phone mappings are inserted.
//
// =====================================================

async function syncCitizenWardMappings(
  citizens,
  wardNo
) {

  if (
    !Array.isArray(
      citizens
    )
  ) {

    throw new Error(
      "Citizens must be an array"
    );
  }


  if (
    !citizens.length
  ) {

    return {

      received: 0,

      validPhones: 0,

      inserted: 0,

      skippedExisting: 0,

      skippedInvalidPhone: 0,

    };
  }


  // ===================================================
  // NORMALIZE ACTUAL WARD NUMBER
  // ===================================================

  const normalizedWardNo =
    normalizeWardNumber(
      wardNo
    );


  if (
    normalizedWardNo === null ||
    normalizedWardNo <= 0
  ) {

    throw new Error(
      `Invalid actual ward number for citizen mapping: ${wardNo}`
    );
  }


  console.log(
    `[Master Citizen Repository] Creating phone mappings for actual Ward Number ${normalizedWardNo}`
  );


  // ===================================================
  // NORMALIZE + DEDUPLICATE PHONES
  // ===================================================

  const phoneSet =
    new Set();


  let skippedInvalidPhone =
    0;


  for (
    const citizen of citizens
  ) {

    const phone =
      normalizePhoneNumber(
        citizen.phoneNumber
      );


    if (
      !phone
    ) {

      skippedInvalidPhone++;

      continue;
    }


    phoneSet.add(
      phone
    );
  }


  const mappings =
    Array.from(
      phoneSet
    ).map(
      (
        phoneNumber
      ) => ({

        phoneNumber,

        // IMPORTANT:
        // Store ACTUAL WARD NUMBER.
        wardId:
          normalizedWardNo,

      })
    );


  // ===================================================
  // NO VALID PHONES
  // ===================================================

  if (
    !mappings.length
  ) {

    return {

      received:
        citizens.length,

      validPhones: 0,

      inserted: 0,

      skippedExisting: 0,

      skippedInvalidPhone,

    };
  }


  // ===================================================
  // INSERT IN SAFE CHUNKS
  // ===================================================

  const MAPPING_CHUNK_SIZE =
    5000;


  let insertedTotal =
    0;


  for (
    let start = 0;
    start < mappings.length;
    start += MAPPING_CHUNK_SIZE
  ) {

    const chunk =
      mappings.slice(
        start,
        start +
          MAPPING_CHUNK_SIZE
      );


    const values = [];

    const placeholders = [];


    let parameterIndex =
      1;


    for (
      const mapping of chunk
    ) {

      values.push(

        mapping.phoneNumber,

        mapping.wardId

      );


      placeholders.push(
        `(
          $${parameterIndex++},
          $${parameterIndex++}
        )`
      );
    }


    // ===============================================
    // INSERT ONLY NEW PHONES
    // ===============================================

    const query = `

      INSERT INTO "master_citizen_map"
      (
        phone_number,
        ward_id
      )

      VALUES

        ${placeholders.join(",")}

      ON CONFLICT (phone_number)

      DO NOTHING

      RETURNING
        id,
        phone_number,
        ward_id,
        created_at,
        updated_at

    `;


    const insertedMappings =
      await masterCitizenPrisma
        .$queryRawUnsafe(
          query,
          ...values
        );


    insertedTotal +=
      insertedMappings.length;


    // ===============================================
    // BACKUP NEWLY INSERTED MAPPINGS
    // ===============================================

    if (
      insertedMappings.length
    ) {

      const backupValues = [];

      const backupPlaceholders = [];


      let backupParameterIndex =
        1;


      for (
        const mapping of insertedMappings
      ) {

        backupValues.push(

          mapping.phone_number,

          mapping.ward_id,

          mapping.created_at,

          mapping.updated_at

        );


        backupPlaceholders.push(
          `(
            $${backupParameterIndex++},
            $${backupParameterIndex++},
            $${backupParameterIndex++},
            $${backupParameterIndex++}
          )`
        );
      }


      const backupQuery = `

        INSERT INTO "master_citizen_map_backup"
        (
          phone_number,
          ward_id,
          created_at,
          updated_at
        )

        VALUES

          ${backupPlaceholders.join(",")}

        ON CONFLICT (phone_number)

        DO NOTHING

      `;


      await masterCitizenPrisma
        .$executeRawUnsafe(
          backupQuery,
          ...backupValues
        );
    }
  }


  // ===================================================
  // RESULT
  // ===================================================

  return {

    received:
      citizens.length,

    validPhones:
      mappings.length,

    inserted:
      insertedTotal,

    skippedExisting:
      mappings.length -
      insertedTotal,

    skippedInvalidPhone,

  };
}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

  getHelperCitizens,

  getAllWardMappings,

  bulkUpsertWardCitizens,

  syncCitizenWardMappings,

  normalizeWardNumber,

  normalizePhoneNumber,

};