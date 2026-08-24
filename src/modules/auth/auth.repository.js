import masterCitizenPrisma
  from "../../config/masterCitizenPrisma.js";


// =====================================================
// AUTH REPOSITORY
// =====================================================
//
// AUTHENTICATION FLOW:
//
// phone
//   ↓
// master_citizen_map
//   ↓
// ward_id
//   ↓
// ACTUAL WARD NUMBER
//   ↓
// ward registry
//   ↓
// wardNo
//   ↓
// wardTableName
//   ↓
// citizen profile
//
// IMPORTANT:
//
// master_citizen_map.ward_id IS THE ACTUAL WARD NUMBER.
//
// Example:
//
// master_citizen_map
//     ward_id = 216
//
// ward registry
//     wardNo = 216
//     id     = 3
//
// Therefore:
//
// mapping.ward_id === ward.wardNo
//
// NOT:
//
// mapping.ward_id === ward.id
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


    if (!value) {

      return null;

    }


    let digits =
      value.replace(
        /\D/g,
        ""
      );


    // -------------------------------------------------
    // Remove Indian country code
    // -------------------------------------------------

    if (
      digits.startsWith("91") &&
      digits.length === 12
    ) {

      digits =
        digits.substring(2);

    }


    // -------------------------------------------------
    // Only valid 10 digit number
    // -------------------------------------------------

    if (
      digits.length !== 10
    ) {

      return null;

    }


    return digits;

  }


  // ===================================================
  // PHONE FORMATS
  // ===================================================

  getPhoneFormats(
    phoneNumber
  ) {

    const localPhone =
      this.normalizePhone(
        phoneNumber
      );


    if (!localPhone) {

      return [];

    }


    return [

      localPhone,

      `+91${localPhone}`,

      `91${localPhone}`,

    ];

  }


  // ===================================================
  // FIND PHONE → WARD MAPPING
  // ===================================================

  async findCitizenMappingByPhone(
    phoneNumber
  ) {

    const formats =
      this.getPhoneFormats(
        phoneNumber
      );


    if (!formats.length) {

      return null;

    }


    // =================================================
    // PRIMARY MAPPING
    // =================================================

    for (
      const formattedPhone
      of formats
    ) {

      const mapping =
        await masterCitizenPrisma
          .master_citizen_map
          .findFirst({

            where: {

              phone_number:
                formattedPhone,

            },

            select: {

              id: true,

              phone_number: true,

              ward_id: true,

              created_at: true,

              updated_at: true,

            },

          });


      if (mapping) {

        console.log(

          `[Auth Repository] Phone mapping found: ${phoneNumber} → Ward Number ${mapping.ward_id}`

        );


        return {

          source:
            "PRIMARY",

          id:
            mapping.id,

          phoneNumber:
            mapping.phone_number,

          wardId:
            mapping.ward_id,

          createdAt:
            mapping.created_at,

          updatedAt:
            mapping.updated_at,

        };

      }

    }


    // =================================================
    // BACKUP MAPPING
    // =================================================

    for (
      const formattedPhone
      of formats
    ) {

      const mapping =
        await masterCitizenPrisma
          .master_citizen_map_backup
          .findFirst({

            where: {

              phone_number:
                formattedPhone,

            },

            orderBy: {

              id:
                "desc",

            },

            select: {

              id: true,

              phone_number: true,

              ward_id: true,

              created_at: true,

              updated_at: true,

            },

          });


      if (mapping) {

        console.log(

          `[Auth Repository] Backup phone mapping found: ${phoneNumber} → Ward Number ${mapping.ward_id}`

        );


        return {

          source:
            "BACKUP",

          id:
            mapping.id,

          phoneNumber:
            mapping.phone_number,

          wardId:
            mapping.ward_id,

          createdAt:
            mapping.created_at,

          updatedAt:
            mapping.updated_at,

        };

      }

    }


    console.log(

      `[Auth Repository] No phone mapping found for ${phoneNumber}`

    );


    return null;

  }


  // ===================================================
  // VALIDATE TABLE NAME
  // ===================================================

  validateTableName(
    tableName
  ) {

    if (
      !tableName ||
      typeof tableName !== "string"
    ) {

      return null;

    }


    if (
      !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(
        tableName
      )
    ) {

      return null;

    }


    return tableName;

  }


  // ===================================================
  // NORMALIZE WARD NUMBER
  // ===================================================

  normalizeWardNumber(
    wardNo
  ) {

    const number =
      Number(
        wardNo
      );


    if (
      !Number.isInteger(number) ||
      number <= 0
    ) {

      return null;

    }


    return number;

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


    if (!tableName) {

      console.error(

        `[Auth Repository] Invalid ward table name: ${ward.wardTableName}`

      );


      return null;

    }


    const formats =
      this.getPhoneFormats(
        phoneNumber
      );


    if (!formats.length) {

      return null;

    }


    const rows =
      await masterCitizenPrisma
        .$queryRawUnsafe(

          `

          SELECT

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

          FROM "${tableName}"

          WHERE

            "phoneNumber" = $1

            OR

            "phoneNumber" = $2

            OR

            "phoneNumber" = $3

          LIMIT 1

          `,

          formats[0],

          formats[1],

          formats[2]

        );


    if (
      Array.isArray(rows) &&
      rows.length > 0
    ) {

      return rows[0];

    }


    return null;

  }


  // ===================================================
  // GET COMPLETE WARD REGISTRY
  // ===================================================
  //
  // Builds:
  //
  // City
  //   ↓
  // Zone
  //   ↓
  // Division
  //   ↓
  // Ward
  //
  // ===================================================

  async getWardMappings() {

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

            city_id:
              "asc",

          },

        });


    const wardMappings =
      [];


    for (
      const city
      of cities
    ) {

      if (
        !city.city_table_name
      ) {

        continue;

      }


      const cityTableName =
        this.validateTableName(
          city.city_table_name
        );


      if (!cityTableName) {

        continue;

      }


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


      for (
        const zone
        of zones
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


        if (!zoneTableName) {

          continue;

        }


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


        for (
          const division
          of divisions
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


          if (!divisionTableName) {

            continue;

          }


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


          for (
            const ward
            of wards
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

              continue;

            }


            const wardTableName =
              this.validateTableName(
                ward.ward_table_name
              );


            if (!wardTableName) {

              continue;

            }


            wardMappings.push({

              cityId:
                city.city_id,

              cityName:
                city.city_name,

              zoneId:
                zone.zone_id,

              zoneName:
                zone.zone_name,

              divisionId:
                division.division_id,

              divisionName:
                division.division_name,

              // INTERNAL DATABASE ID
              wardId:
                ward.ward_id,

              // ACTUAL MUNICIPAL WARD NUMBER
              wardNo:
                normalizedWardNo,

              wardName:
                ward.ward_name,

              wardTableName,

            });

          }

        }

      }

    }


    console.log(

      `[Auth Repository] Ward registry loaded: ${wardMappings.length} wards`

    );


    return wardMappings;

  }


  // ===================================================
  // BUILD CITIZEN RESULT
  // ===================================================

  buildCitizenResult(
    profile,
    mapping,
    ward
  ) {

    const wardNo =
      this.normalizeWardNumber(
        ward.wardNo
      );


    return {

      id:
        profile.id,

      personName:
        profile.personName ||
        profile.name ||
        null,

      phoneNumber:
        profile.phoneNumber,

      drySlno:
        profile.drySlno,

      wetSlno:
        profile.wetSlno,

      // ------------------------------------------------
      // IMPORTANT:
      //
      // wardId in AUTH response is the actual ward number.
      // ------------------------------------------------

      wardId:
        wardNo,

      wardNo,

      wardName:
        ward.wardName,

      wardTableName:
        ward.wardTableName,

      cityId:
        ward.cityId,

      cityName:
        ward.cityName,

      zoneId:
        ward.zoneId,

      zoneName:
        ward.zoneName,

      divisionId:
        ward.divisionId,

      divisionName:
        ward.divisionName,

      profile,

      mappingSource:
        mapping.source,

    };

  }


  // ===================================================
  // FIND CITIZEN BY PHONE
  // ===================================================
  //
  // FINAL FLOW:
  //
  // phone
  //   ↓
  // mapping
  //   ↓
  // mapping.ward_id
  //   ↓
  // ward.wardNo
  //   ↓
  // ward table
  //   ↓
  // profile
  //
  // ===================================================

  async findCitizenByPhone(
    phoneNumber
  ) {

    console.log(

      `[Auth Repository] Looking up phone: ${phoneNumber}`

    );


    // =================================================
    // 1. PHONE → WARD MAPPING
    // =================================================

    const mapping =
      await this.findCitizenMappingByPhone(
        phoneNumber
      );


    if (!mapping) {

      return null;

    }


    // =================================================
    // 2. LOAD WARD REGISTRY
    // =================================================

    const wards =
      await this.getWardMappings();


    // =================================================
    // 3. FIND WARD BY ACTUAL WARD NUMBER
    // =================================================

    const wardNo =
      Number(
        mapping.wardId
      );


    const mappedWard =
      wards.find(

        (ward) =>

          Number(
            ward.wardNo
          ) ===
          wardNo

      );


    if (!mappedWard) {

      console.error(

        `[Auth Repository] Ward Number ${wardNo} does not exist in ward registry`

      );


      return null;

    }


    console.log(

      `[Auth Repository] Mapping resolved: ${phoneNumber} → Ward ${mappedWard.wardNo} (${mappedWard.wardName}) → ${mappedWard.wardTableName}`

    );


    // =================================================
    // 4. SEARCH MAPPED WARD
    // =================================================

    const profile =
      await this.findProfileInWard(

        mappedWard,

        phoneNumber

      );


    if (profile) {

      console.log(

        `[Auth Repository] ✅ Citizen profile found in ${mappedWard.wardTableName}`

      );


      return this.buildCitizenResult(

        profile,

        mapping,

        mappedWard

      );

    }


    // =================================================
    // 5. FALLBACK SEARCH
    // =================================================
    //
    // IMPORTANT:
    //
    // The mapping remains authoritative.
    //
    // Fallback only prevents a stale mapping from
    // permanently blocking authentication.
    //
    // We DO NOT automatically rewrite the mapping.
    //
    // =================================================

    console.log(

      `[Auth Repository] Mapping points to Ward ${wardNo}, but profile was not found in ${mappedWard.wardTableName}. Starting fallback search.`

    );


    for (
      const ward
      of wards
    ) {

      if (
        Number(
          ward.wardNo
        ) === wardNo
      ) {

        continue;

      }


      if (
        !ward.wardTableName
      ) {

        continue;

      }


      const fallbackProfile =
        await this.findProfileInWard(

          ward,

          phoneNumber

        );


      if (
        fallbackProfile
      ) {

        console.log(

          `[Auth Repository] Profile found in fallback Ward ${ward.wardNo}: ${ward.wardTableName}`

        );


        return this.buildCitizenResult(

          fallbackProfile,

          mapping,

          ward

        );

      }

    }


    // =================================================
    // 6. NOT FOUND
    // =================================================

    console.log(

      `[Auth Repository] Profile not found in any registered ward for ${phoneNumber}`

    );


    return null;

  }

}


export default new AuthRepository();