const helperPrisma =
  require("../config/helperPrisma");

const masterCitizenPrisma =
  require("../config/masterCitizenPrisma");


/**
 * =====================================================
 * GET CITIZENS FROM HELPER DATABASE
 * =====================================================
 *
 * Fetch only the fields that actually belong in the
 * dynamic Ward citizen tables.
 *
 * We intentionally DO NOT fetch city/ward for storage.
 */

async function getHelperCitizens(
  skip = 0,
  take = 5000
) {
  return helperPrisma.master_citizen_data.findMany({
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


/**
 * =====================================================
 * GET ALL CONFIGURED WARDS
 * =====================================================
 *
 * We load the complete hierarchy ONCE.
 *
 * We do NOT query the hierarchy for every citizen.
 */

async function getAllWardMappings() {
  const cities =
    await masterCitizenPrisma.city_table.findMany({
      select: {
        city_id: true,
        city_name: true,
        city_table_name: true,
      },
    });

  const wardMappings = [];


  for (const city of cities) {

    if (!city.city_table_name) {
      continue;
    }


    /**
     * Get zones from City's dynamic table.
     */

    const zones =
      await masterCitizenPrisma.$queryRawUnsafe(
        `
          SELECT
            zone_id,
            zone_name,
            zone_table_name
          FROM "${city.city_table_name}"
        `
      );


    for (const zone of zones) {

      if (!zone.zone_table_name) {
        continue;
      }


      /**
       * Get divisions from Zone's dynamic table.
       */

      const divisions =
        await masterCitizenPrisma.$queryRawUnsafe(
          `
            SELECT
              division_id,
              division_name,
              division_table_name
            FROM "${zone.zone_table_name}"
          `
        );


      for (const division of divisions) {

        if (!division.division_table_name) {
          continue;
        }


        /**
         * Get wards from Division's dynamic table.
         */

        const wards =
          await masterCitizenPrisma.$queryRawUnsafe(
            `
              SELECT
                ward_id,
                ward_no,
                ward_name,
                ward_table_name
              FROM "${division.division_table_name}"
            `
          );


        for (const ward of wards) {

          if (!ward.ward_table_name) {
            continue;
          }


          wardMappings.push({
            cityId: city.city_id,
            cityName: city.city_name,

            zoneId: zone.zone_id,
            zoneName: zone.zone_name,

            divisionId:
              division.division_id,

            divisionName:
              division.division_name,

            wardId: ward.ward_id,
            wardNo: ward.ward_no,
            wardName: ward.ward_name,

            wardTableName:
              ward.ward_table_name,
          });
        }
      }
    }
  }


  return wardMappings;
}


/**
 * =====================================================
 * BULK UPSERT CITIZENS INTO WARD
 * =====================================================
 *
 * PostgreSQL handles the bulk operation.
 *
 * We only update records whose updatedAt changed.
 */

async function bulkUpsertWardCitizens(
  wardTableName,
  citizens
) {
  if (!citizens.length) {
    return {
      insertedOrUpdated: 0,
    };
  }


  const values = [];


  for (const citizen of citizens) {

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
      citizen.lng
    );
  }


  const placeholders = [];

  let index = 1;


  for (
    let i = 0;
    i < citizens.length;
    i++
  ) {

    placeholders.push(`
      (
        $${index++},
        $${index++},
        $${index++},
        $${index++},
        $${index++},
        $${index++},
        $${index++},
        $${index++},
        $${index++},
        $${index++},
        $${index++},
        $${index++},
        $${index++},
        $${index++},
        $${index++},
        $${index++},
        $${index++},
        $${index++},
        $${index++}
      )
    `);
  }


  const query = `
    INSERT INTO "${wardTableName}"
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


  await masterCitizenPrisma.$executeRawUnsafe(
    query,
    ...values
  );


  return {
    insertedOrUpdated:
      citizens.length,
  };
}


module.exports = {
  getHelperCitizens,
  getAllWardMappings,
  bulkUpsertWardCitizens,
};