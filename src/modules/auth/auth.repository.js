import masterCitizenPrisma
  from "../../config/masterCitizenPrisma.js";


// =====================================================
// AUTH REPOSITORY
// =====================================================
//
// AUTHENTICATION FLOW
//
// Phone
//   ↓
// master_citizen_map
//   ↓
// ward_id
//   ↓
// ACTUAL WARD NUMBER
//   ↓
// City
//   ↓
// Zone
//   ↓
// Division
//   ↓
// Ward
//   ↓
// ward_no
//   ↓
// ward_table_name
//   ↓
// Citizen Profile
//
// IMPORTANT:
//
// master_citizen_map.ward_id is the ACTUAL WARD NUMBER.
//
// Example:
//
// master_citizen_map:
//
// phone_number = +919901015589
// ward_id      = 216
//
// Ward registry:
//
// ward_id = 3
// ward_no = 216
//
// Therefore:
//
// mapping.ward_id === ward.ward_no
//
// NOT:
//
// mapping.ward_id === ward.ward_id
//
// =====================================================


class AuthRepository {


  // ===================================================
  // NORMALIZE PHONE
  // ===================================================

  normalizePhone(
    phoneNumber
  ) {

    if (
      phoneNumber === undefined ||
      phoneNumber === null
    ) {

      return null;

    }


    const value =
      String(
        phoneNumber
      ).trim();


    if (
      !value
    ) {

      return null;

    }


    let digits =
      value.replace(
        /\D/g,
        ""
      );


    // -------------------------------------------------
    // +919901015589
    // 919901015589
    //
    // →
    //
    // 9901015589
    // -------------------------------------------------

    if (
      digits.startsWith("91") &&
      digits.length === 12
    ) {

      digits =
        digits.substring(2);

    }


    if (
      digits.length !== 10
    ) {

      return null;

    }


    return digits;

  }


  // ===================================================
  // NORMALIZE WARD NUMBER
  // ===================================================

  normalizeWardNumber(
    wardNo
  ) {

    if (
      wardNo === undefined ||
      wardNo === null
    ) {

      return null;

    }


    const value =
      Number(
        wardNo
      );


    if (
      !Number.isInteger(value) ||
      value <= 0
    ) {

      return null;

    }


    return value;

  }


  // ===================================================
  // VALIDATE DYNAMIC TABLE NAME
  // ===================================================

  validateTableName(
    tableName
  ) {

    if (
      typeof tableName !== "string"
    ) {

      throw new Error(
        "Invalid dynamic table name"
      );

    }


    const trimmed =
      tableName.trim();


    if (
      !trimmed
    ) {

      throw new Error(
        "Invalid dynamic table name"
      );

    }


    // -------------------------------------------------
    // PostgreSQL identifier validation
    // -------------------------------------------------

    if (
      !/^[A-Za-z_][A-Za-z0-9_]*$/.test(
        trimmed
      )
    ) {

      throw new Error(
        `Unsafe dynamic table name: ${trimmed}`
      );

    }


    return trimmed;

  }


  // ===================================================
  // FIND PHONE → WARD MAPPING
  // ===================================================
  //
  // PRIMARY:
  //
  // master_citizen_map
  //
  // BACKUP:
  //
  // master_citizen_map_backup
  //
  // ===================================================

  async findCitizenMappingByPhone(
    phoneNumber
  ) {

    // =================================================
    // PRIMARY MAPPING
    // =================================================

    const primaryMapping =
      await masterCitizenPrisma
        .master_citizen_map
        .findUnique({

          where: {

            phone_number:
              phoneNumber,

          },

          select: {

            id:
              true,

            phone_number:
              true,

            ward_id:
              true,

            created_at:
              true,

            updated_at:
              true,

          },

        });


    if (
      primaryMapping
    ) {

      console.log(

        `[Auth Repository] Phone mapping found: ${phoneNumber} → Ward Number ${primaryMapping.ward_id}`

      );


      return {

        source:
          "PRIMARY",

        id:
          primaryMapping.id,

        phoneNumber:
          primaryMapping.phone_number,

        wardId:
          primaryMapping.ward_id,

        createdAt:
          primaryMapping.created_at,

        updatedAt:
          primaryMapping.updated_at,

      };

    }


    // =================================================
    // BACKUP MAPPING
    // =================================================

    const backupMapping =
      await masterCitizenPrisma
        .master_citizen_map_backup
        .findFirst({

          where: {

            phone_number:
              phoneNumber,

          },

          orderBy: {

            id:
              "desc",

          },

          select: {

            id:
              true,

            phone_number:
              true,

            ward_id:
              true,

            created_at:
              true,

            updated_at:
              true,

          },

        });


    if (
      backupMapping
    ) {

      console.log(

        `[Auth Repository] Backup phone mapping found: ${phoneNumber} → Ward Number ${backupMapping.ward_id}`

      );


      return {

        source:
          "BACKUP",

        id:
          backupMapping.id,

        phoneNumber:
          backupMapping.phone_number,

        wardId:
          backupMapping.ward_id,

        createdAt:
          backupMapping.created_at,

        updatedAt:
          backupMapping.updated_at,

      };

    }


    console.log(

      `[Auth Repository] No mapping found for ${phoneNumber}`

    );


    return null;

  }


  // ===================================================
  // FIND PROFILE INSIDE WARD
  // ===================================================

  async findProfileInWard(
    ward,
    phoneNumber
  ) {

    if (
      !ward ||
      !ward.wardTableName
    ) {

      return null;

    }


    const tableName =
      this.validateTableName(
        ward.wardTableName
      );


    // =================================================
    // NORMALIZE PHONE
    // =================================================

    const localPhone =
      this.normalizePhone(
        phoneNumber
      );


    if (
      !localPhone
    ) {

      return null;

    }


    const databasePhone =
      `+91${localPhone}`;


    // =================================================
    // SEARCH PROFILE
    // =================================================
    //
    // Ward table normally stores:
    //
    // 9901015589
    //
    // But we support:
    //
    // 9901015589
    // +919901015589
    // 919901015589
    //
    // =================================================

    const rows =
      await masterCitizenPrisma
        .$queryRawUnsafe(

          `

          SELECT *

          FROM "${tableName}"

          WHERE

            "phoneNumber" = $1

            OR "phoneNumber" = $2

            OR "phoneNumber" = $3

          LIMIT 1

          `,

          localPhone,

          databasePhone,

          `91${localPhone}`

        );


    if (
      !rows ||
      !rows.length
    ) {

      return null;

    }


    return rows[0];

  }


  // ===================================================
  // GET COMPLETE WARD MAPPINGS
  // ===================================================
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
  //
  // This follows the SAME hierarchy used by your
  // master citizen synchronization.
  //
  // ===================================================

  async getWardMappings() {

    console.log(
      "[Auth Repository] Loading master citizen ward hierarchy..."
    );


    // =================================================
    // CITY
    // =================================================

    const cities =
      await masterCitizenPrisma
        .city_table
        .findMany({

          select: {

            city_id:
              true,

            city_name:
              true,

            city_table_name:
              true,

          },

          orderBy: {

            city_id:
              "asc",

          },

        });


    const wardMappings =
      [];


    // =================================================
    // CITY LOOP
    // =================================================

    for (
      const city of cities
    ) {

      if (
        !city.city_table_name
      ) {

        console.warn(

          `[Auth Repository] City ${city.city_name} has no dynamic table`

        );

        continue;

      }


      const cityTableName =
        this.validateTableName(
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

          continue;

        }


        const zoneTableName =
          this.validateTableName(
            zone.zone_table_name
          );


        // =================================================
        // DIVISIONS
        // =================================================

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


        // =================================================
        // DIVISION LOOP
        // =================================================

        for (
          const division of divisions
        ) {

          if (
            !division.division_table_name
          ) {

            continue;

          }


          const divisionTableName =
            this.validateTableName(
              division.division_table_name
            );


          // =================================================
          // WARDS
          // =================================================

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


          // =================================================
          // WARD LOOP
          // =================================================

          for (
            const ward of wards
          ) {

            if (
              !ward.ward_table_name
            ) {

              continue;

            }


            const normalizedWardNo =
              this.normalizeWardNumber(
                ward.ward_no
              );


            if (
              normalizedWardNo === null
            ) {

              console.warn(

                `[Auth Repository] Invalid ward number: ${ward.ward_no}`

              );

              continue;

            }


            wardMappings.push({

              // -------------------------------------------
              // CITY
              // -------------------------------------------

              cityId:
                city.city_id,

              cityName:
                city.city_name,


              // -------------------------------------------
              // ZONE
              // -------------------------------------------

              zoneId:
                zone.zone_id,

              zoneName:
                zone.zone_name,


              // -------------------------------------------
              // DIVISION
              // -------------------------------------------

              divisionId:
                division.division_id,

              divisionName:
                division.division_name,


              // -------------------------------------------
              // INTERNAL WARD DATABASE ID
              // -------------------------------------------

              wardId:
                ward.ward_id,


              // -------------------------------------------
              // ACTUAL MUNICIPAL WARD NUMBER
              // -------------------------------------------

              wardNo:
                normalizedWardNo,


              // -------------------------------------------
              // WARD NAME
              // -------------------------------------------

              wardName:
                ward.ward_name,


              // -------------------------------------------
              // CITIZEN TABLE
              // -------------------------------------------

              wardTableName:
                this.validateTableName(
                  ward.ward_table_name
                ),

            });

          }

        }

      }

    }


    console.log(

      `[Auth Repository] Ward registry loaded: ${wardMappings.length} wards`

    );


    // =================================================
    // DEBUG WARD 216
    // =================================================

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

        "[Auth Repository] Ward 216 resolved:",

        {

          internalWardId:
            ward216.wardId,

          wardNo:
            ward216.wardNo,

          wardName:
            ward216.wardName,

          wardTableName:
            ward216.wardTableName,

        }

      );

    }


    return wardMappings;

  }


  // ===================================================
  // FIND CITIZEN BY PHONE
  // ===================================================
  //
  // PRIMARY AUTH FLOW:
  //
  // phone
  //   ↓
  // master_citizen_map
  //   ↓
  // ward_id = ACTUAL WARD NUMBER
  //   ↓
  // wardNo
  //   ↓
  // wardTableName
  //   ↓
  // citizen profile
  //
  // ===================================================

  async findCitizenByPhone(
    phoneNumber
  ) {

    // =================================================
    // NORMALIZE PHONE
    // =================================================

    const localPhone =
      this.normalizePhone(
        phoneNumber
      );


    if (
      !localPhone
    ) {

      console.log(
        "[Auth Repository] Invalid phone:",
        phoneNumber
      );

      return null;

    }


    const databasePhone =
      `+91${localPhone}`;


    console.log(
      `[Auth Repository] Looking up phone: ${databasePhone}`
    );


    // =================================================
    // 1. PHONE → WARD NUMBER
    // =================================================

    const mapping =
      await this.findCitizenMappingByPhone(
        databasePhone
      );


    if (
      !mapping
    ) {

      console.log(
        `[Auth Repository] No mapping found for ${databasePhone}`
      );

      return null;

    }


    // =================================================
    // 2. WARD REGISTRY
    // =================================================

    const wardMappings =
      await this.getWardMappings();


    // =================================================
    // 3. FIND BY ACTUAL WARD NUMBER
    // =================================================
    //
    // CRITICAL:
    //
    // mapping.wardId = 216
    //
    // ward.wardNo = 216
    //
    // MATCH.
    //
    // We DO NOT compare:
    //
    // mapping.wardId
    //
    // with:
    //
    // ward.wardId
    //
    // =================================================

    const mappedWard =
      wardMappings.find(

        (ward) =>

          Number(
            ward.wardNo
          ) ===
          Number(
            mapping.wardId
          )

      );


    if (
      !mappedWard
    ) {

      console.error(

        `[Auth Repository] Ward Number ${mapping.wardId} was not found in the master citizen hierarchy`

      );


      return null;

    }


    console.log(

      `[Auth Repository] Mapping resolved: ${databasePhone} → Ward ${mappedWard.wardNo} (${mappedWard.wardName}) → ${mappedWard.wardTableName}`

    );


    // =================================================
    // 4. SEARCH EXACT MAPPED WARD
    // =================================================

    const profile =
      await this.findProfileInWard(
        mappedWard,
        localPhone
      );


    if (
      profile
    ) {

      console.log(

        `[Auth Repository] ✅ Citizen profile found in ${mappedWard.wardTableName}`

      );


      return {

        id:
          profile.id,

        personName:
          profile.personName,

        phoneNumber:
          profile.phoneNumber,

        wardId:
          mappedWard.wardNo,

        wardNo:
          mappedWard.wardNo,

        wardName:
          mappedWard.wardName,

        wardTableName:
          mappedWard.wardTableName,

        cityId:
          mappedWard.cityId,

        cityName:
          mappedWard.cityName,

        zoneId:
          mappedWard.zoneId,

        zoneName:
          mappedWard.zoneName,

        divisionId:
          mappedWard.divisionId,

        divisionName:
          mappedWard.divisionName,

        hierarchy: {

          cityId:
            mappedWard.cityId,

          cityName:
            mappedWard.cityName,

          zoneId:
            mappedWard.zoneId,

          zoneName:
            mappedWard.zoneName,

          divisionId:
            mappedWard.divisionId,

          divisionName:
            mappedWard.divisionName,

          wardId:
            mappedWard.wardNo,

          wardNo:
            mappedWard.wardNo,

          wardName:
            mappedWard.wardName,

          wardTableName:
            mappedWard.wardTableName,

        },

        profile,

        mappingSource:
          mapping.source,

      };

    }


    // =================================================
    // 5. PROFILE NOT FOUND IN MAPPED WARD
    // =================================================

    console.warn(

      `[Auth Repository] Mapping points to Ward ${mappedWard.wardNo}, but profile was not found in ${mappedWard.wardTableName}.`

    );


    // =================================================
    // IMPORTANT
    // =================================================
    //
    // We DO NOT automatically search another ward.
    //
    // Your mapping is authoritative.
    //
    // If:
    //
    // +919901015589 → 216
    //
    // then we search Ward 216.
    //
    // =================================================

    return null;

  }

}


// =====================================================
// EXPORT
// =====================================================

export default new AuthRepository();