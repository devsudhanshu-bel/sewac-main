const { PrismaClient: SewacClient } = require("../generated/sewac");

const sewacPrisma = new SewacClient();

const masterCitizenPrisma =
  require("../config/masterCitizenPrisma");

const logEdit = require("../utils/editLogger");

/*
|--------------------------------------------------------------------------
| SAFE DATABASE IDENTIFIER
|--------------------------------------------------------------------------
|
| Dynamic table names come from our own hierarchy metadata.
| They are NEVER accepted directly from the client.
|
|--------------------------------------------------------------------------
*/

const IDENTIFIER_REGEX =
  /^[A-Za-z_][A-Za-z0-9_]*$/;

const quoteIdentifier = (identifier) => {
  if (
    typeof identifier !== "string" ||
    !IDENTIFIER_REGEX.test(identifier)
  ) {
    throw new Error(
      `Unsafe database identifier: ${identifier}`
    );
  }

  return `"${identifier.replace(/"/g, '""')}"`;
};

/*
|--------------------------------------------------------------------------
| ID PARSER
|--------------------------------------------------------------------------
*/

const parseId = (value, fieldName) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const parsed = Number(value);

  if (
    !Number.isInteger(parsed) ||
    parsed <= 0
  ) {
    throw new Error(
      `${fieldName} must be a positive integer`
    );
  }

  return parsed;
};

/*
|--------------------------------------------------------------------------
| SEARCH NORMALIZER
|--------------------------------------------------------------------------
*/

const normalizeSearch = (value) => {
  if (
    value === undefined ||
    value === null
  ) {
    return "";
  }

  return String(value).trim();
};

/*
|--------------------------------------------------------------------------
| GEOGRAPHIC SCOPE
|--------------------------------------------------------------------------
|
| Header selection:
|
| cityId
|   ↓
| city_table
|   ↓
| city dynamic table
|   ↓
| zone
|   ↓
| zone dynamic table
|   ↓
| division
|   ↓
| division dynamic table
|   ↓
| ward
|   ↓
| actual citizen table
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET ALL WARDS
|--------------------------------------------------------------------------
|
| Used when no geographic filter is supplied.
|
|--------------------------------------------------------------------------
*/

const getAllWardScope = async () => {
  const cities =
    await masterCitizenPrisma.city_table.findMany({
      orderBy: {
        city_id: "asc",
      },
    });

  const wards = [];

  for (const city of cities) {
    if (!city.city_table_name) {
      continue;
    }

    const cityTable =
      quoteIdentifier(city.city_table_name);

    const zones =
      await masterCitizenPrisma.$queryRawUnsafe(
        `
          SELECT
            zone_id,
            zone_name,
            zone_table_name
          FROM ${cityTable}
          ORDER BY zone_id ASC
        `
      );

    for (const zone of zones) {
      if (!zone.zone_table_name) {
        continue;
      }

      const zoneTable =
        quoteIdentifier(
          zone.zone_table_name
        );

      const divisions =
        await masterCitizenPrisma.$queryRawUnsafe(
          `
            SELECT
              division_id,
              division_name,
              division_table_name
            FROM ${zoneTable}
            ORDER BY division_id ASC
          `
        );

      for (const division of divisions) {
        if (!division.division_table_name) {
          continue;
        }

        const divisionTable =
          quoteIdentifier(
            division.division_table_name
          );

        const wardRows =
          await masterCitizenPrisma.$queryRawUnsafe(
            `
              SELECT
                ward_id,
                ward_no,
                ward_name,
                ward_table_name
              FROM ${divisionTable}
              ORDER BY ward_no ASC
            `
          );

        for (const ward of wardRows) {
          wards.push({
            cityId: Number(city.city_id),

            cityName: city.city_name,

            zoneId: Number(zone.zone_id),

            zoneName: zone.zone_name,

            divisionId:
              Number(division.division_id),

            divisionName:
              division.division_name,

            wardId: Number(ward.ward_id),

            wardNo:
              ward.ward_no === null
                ? null
                : Number(ward.ward_no),

            wardName: ward.ward_name,

            wardTableName:
              ward.ward_table_name,
          });
        }
      }
    }
  }

  return wards;
};

/*
|--------------------------------------------------------------------------
| GET SELECTED WARD SCOPE
|--------------------------------------------------------------------------
|
| This is the important part.
|
| We DO NOT search citizens using:
|
| city = "Bangalore"
| ward = "Ibbalur"
|
| Instead we use the IDs from the Header to navigate
| the actual hierarchy.
|
|--------------------------------------------------------------------------
*/

const getSelectedWardScope = async ({
  cityId,
  zoneId,
  divisionId,
  wardId,
}) => {
  const selectedCityId =
    parseId(cityId, "cityId");

  const selectedZoneId =
    parseId(zoneId, "zoneId");

  const selectedDivisionId =
    parseId(
      divisionId,
      "divisionId"
    );

  const selectedWardId =
    parseId(
      wardId,
      "wardId"
    );

  /*
  |--------------------------------------------------------------------------
  | Validate hierarchy
  |--------------------------------------------------------------------------
  */

  if (
    selectedZoneId &&
    !selectedCityId
  ) {
    throw new Error(
      "zoneId requires cityId"
    );
  }

  if (
    selectedDivisionId &&
    !selectedZoneId
  ) {
    throw new Error(
      "divisionId requires zoneId"
    );
  }

  if (
    selectedWardId &&
    !selectedDivisionId
  ) {
    throw new Error(
      "wardId requires divisionId"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | No filter
  |--------------------------------------------------------------------------
  */

  if (!selectedCityId) {
    return {
      filtered: false,
      wards:
        await getAllWardScope(),
    };
  }

  /*
  |--------------------------------------------------------------------------
  | CITY
  |--------------------------------------------------------------------------
  */

  const city =
    await masterCitizenPrisma.city_table.findUnique({
      where: {
        city_id: selectedCityId,
      },
    });

  if (!city) {
    throw new Error(
      "City not found"
    );
  }

  if (!city.city_table_name) {
    throw new Error(
      "City has no dynamic table registered"
    );
  }

  const cityTable =
    quoteIdentifier(
      city.city_table_name
    );

  /*
  |--------------------------------------------------------------------------
  | CITY → ZONE
  |--------------------------------------------------------------------------
  */

  const zones =
    await masterCitizenPrisma.$queryRawUnsafe(
      selectedZoneId
        ? `
            SELECT
              zone_id,
              zone_name,
              zone_table_name
            FROM ${cityTable}
            WHERE zone_id = $1
            ORDER BY zone_id ASC
          `
        : `
            SELECT
              zone_id,
              zone_name,
              zone_table_name
            FROM ${cityTable}
            ORDER BY zone_id ASC
          `,
      ...(selectedZoneId
        ? [selectedZoneId]
        : [])
    );

  if (
    selectedZoneId &&
    zones.length === 0
  ) {
    throw new Error(
      "Zone not found in selected city"
    );
  }

  const wards = [];

  /*
  |--------------------------------------------------------------------------
  | ZONE → DIVISION
  |--------------------------------------------------------------------------
  */

  for (const zone of zones) {
    if (!zone.zone_table_name) {
      continue;
    }

    const zoneTable =
      quoteIdentifier(
        zone.zone_table_name
      );

    const divisions =
      await masterCitizenPrisma.$queryRawUnsafe(
        selectedDivisionId
          ? `
              SELECT
                division_id,
                division_name,
                division_table_name
              FROM ${zoneTable}
              WHERE division_id = $1
              ORDER BY division_id ASC
            `
          : `
              SELECT
                division_id,
                division_name,
                division_table_name
              FROM ${zoneTable}
              ORDER BY division_id ASC
            `,
        ...(selectedDivisionId
          ? [selectedDivisionId]
          : [])
      );

    if (
      selectedDivisionId &&
      divisions.length === 0
    ) {
      throw new Error(
        "Division not found in selected zone"
      );
    }

    /*
    |--------------------------------------------------------------------------
    | DIVISION → WARD
    |--------------------------------------------------------------------------
    */

    for (const division of divisions) {
      if (!division.division_table_name) {
        continue;
      }

      const divisionTable =
        quoteIdentifier(
          division.division_table_name
        );

      const wardRows =
        await masterCitizenPrisma.$queryRawUnsafe(
          selectedWardId
            ? `
                SELECT
                  ward_id,
                  ward_no,
                  ward_name,
                  ward_table_name
                FROM ${divisionTable}
                WHERE ward_id = $1
                ORDER BY ward_no ASC
              `
            : `
                SELECT
                  ward_id,
                  ward_no,
                  ward_name,
                  ward_table_name
                FROM ${divisionTable}
                ORDER BY ward_no ASC
              `,
          ...(selectedWardId
            ? [selectedWardId]
            : [])
        );

      if (
        selectedWardId &&
        wardRows.length === 0
      ) {
        throw new Error(
          "Ward not found in selected division"
        );
      }

      for (const ward of wardRows) {
        wards.push({
          cityId:
            selectedCityId,

          cityName:
            city.city_name,

          zoneId:
            Number(zone.zone_id),

          zoneName:
            zone.zone_name,

          divisionId:
            Number(
              division.division_id
            ),

          divisionName:
            division.division_name,

          wardId:
            Number(ward.ward_id),

          wardNo:
            ward.ward_no === null
              ? null
              : Number(ward.ward_no),

          wardName:
            ward.ward_name,

          wardTableName:
            ward.ward_table_name,
        });
      }
    }
  }

  return {
    filtered: true,
    wards,
  };
};

/*
|--------------------------------------------------------------------------
| GET CITIZENS FROM A WARD TABLE
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| This reads the ACTUAL CURRENT citizen table.
|
| It does NOT read master_citizen_data.
|
|--------------------------------------------------------------------------
*/

const getCitizensFromWardTable = async (
  ward
) => {
  if (!ward.wardTableName) {
    return [];
  }

  const table =
    quoteIdentifier(
      ward.wardTableName
    );

  try {
    const rows =
      await masterCitizenPrisma.$queryRawUnsafe(
        `
          SELECT

            id,

            "phoneNumber",

            "area",

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

          FROM ${table}

          ORDER BY
            "createdAt" DESC,
            id DESC
        `
      );

    return rows.map((citizen) => ({
      ...citizen,

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

      wardId:
        ward.wardId,

      wardNo:
        ward.wardNo,

      wardName:
        ward.wardName,

      wardTableName:
        ward.wardTableName,
    }));
  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | Ward table may be registered but physically absent.
    |--------------------------------------------------------------------------
    */

    if (
      error?.code === "42P01"
    ) {
      console.warn(
        `Waste Generator: ward table ${ward.wardTableName} does not exist.`
      );

      return [];
    }

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| SEARCH CURRENT CITIZENS
|--------------------------------------------------------------------------
*/

const citizenMatchesSearch = (
  citizen,
  search
) => {
  if (!search) {
    return true;
  }

  const value =
    search.toLowerCase();

  const fields = [
    citizen.phoneNumber,
    citizen.personName,
    citizen.wetRFID,
    citizen.dryRFID,
    citizen.area,
    citizen.wardName,
    citizen.wardNo,
  ];

  return fields.some(
    (field) =>
      field !== null &&
      field !== undefined &&
      String(field)
        .toLowerCase()
        .includes(value)
  );
};

/*
|--------------------------------------------------------------------------
| GET ALL CURRENT WASTE GENERATORS
|--------------------------------------------------------------------------
|
| Query parameters supported:
|
| ?page=1
| ?limit=10
| ?search=...
| ?cityId=...
| ?zoneId=...
| ?divisionId=...
| ?wardId=...
|
|--------------------------------------------------------------------------
*/

const getAllWasteGenerators =
  async (query = {}) => {
    const page =
      Number(query.page) || 1;

    const limit =
      Number(query.limit) || 10;

    const safePage =
      page < 1 ? 1 : page;

    const safeLimit =
      limit < 1
        ? 10
        : Math.min(limit, 100);

    const search =
      normalizeSearch(
        query.search
      );

    /*
    |--------------------------------------------------------------------------
    | Resolve Header geographic selection
    |--------------------------------------------------------------------------
    */

    const wardScope =
      await getSelectedWardScope({
        cityId:
          query.cityId,

        zoneId:
          query.zoneId,

        divisionId:
          query.divisionId,

        wardId:
          query.wardId,
      });

    const wards =
      wardScope.wards || [];

    /*
    |--------------------------------------------------------------------------
    | Load citizens from physical ward tables
    |--------------------------------------------------------------------------
    */

    let citizens = [];

    for (const ward of wards) {
      const rows =
        await getCitizensFromWardTable(
          ward
        );

      citizens.push(
        ...rows
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (search) {
      citizens =
        citizens.filter(
          (citizen) =>
            citizenMatchesSearch(
              citizen,
              search
            )
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Sort newest first
    |--------------------------------------------------------------------------
    */

    citizens.sort(
      (a, b) => {
        const dateA =
          a.createdAt
            ? new Date(a.createdAt).getTime()
            : 0;

        const dateB =
          b.createdAt
            ? new Date(b.createdAt).getTime()
            : 0;

        if (dateB !== dateA) {
          return dateB - dateA;
        }

        return (
          Number(b.id || 0) -
          Number(a.id || 0)
        );
      }
    );

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const total =
      citizens.length;

    const totalPages =
      Math.ceil(
        total / safeLimit
      );

    const skip =
      (safePage - 1) *
      safeLimit;

    const paginated =
      citizens.slice(
        skip,
        skip + safeLimit
      );

    /*
    |--------------------------------------------------------------------------
    | Return
    |--------------------------------------------------------------------------
    */

    return {
      wasteGenerators:
        paginated,

      pagination: {
        page: safePage,

        limit: safeLimit,

        total,

        totalPages,
      },

      filter: {
        cityId:
          parseId(
            query.cityId,
            "cityId"
          ),

        zoneId:
          parseId(
            query.zoneId,
            "zoneId"
          ),

        divisionId:
          parseId(
            query.divisionId,
            "divisionId"
          ),

        wardId:
          parseId(
            query.wardId,
            "wardId"
          ),
      },
    };
  };

/*
|--------------------------------------------------------------------------
| FIND CURRENT CITIZEN BY PHONE
|--------------------------------------------------------------------------
|
| Searches physical ward citizen tables.
|
|--------------------------------------------------------------------------
*/

const getWasteGeneratorByPhone =
  async (
    phoneNumber,
    query = {}
  ) => {
    if (!phoneNumber) {
      throw new Error(
        "Phone number is required"
      );
    }

    const wardScope =
      await getSelectedWardScope({
        cityId:
          query.cityId,

        zoneId:
          query.zoneId,

        divisionId:
          query.divisionId,

        wardId:
          query.wardId,
      });

    const wards =
      wardScope.wards || [];

    for (const ward of wards) {
      if (!ward.wardTableName) {
        continue;
      }

      const table =
        quoteIdentifier(
          ward.wardTableName
        );

      const rows =
        await masterCitizenPrisma.$queryRawUnsafe(
          `
            SELECT

              id,

              "phoneNumber",

              "area",

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

            FROM ${table}

            WHERE "phoneNumber" = $1

            LIMIT 1
          `,
          phoneNumber
        );

      if (rows.length > 0) {
        return {
          ...rows[0],

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

          wardId:
            ward.wardId,

          wardNo:
            ward.wardNo,

          wardName:
            ward.wardName,

          wardTableName:
            ward.wardTableName,
        };
      }
    }

    throw new Error(
      "Waste Generator not found"
    );
  };

/*
|--------------------------------------------------------------------------
| UPDATE CURRENT CITIZEN
|--------------------------------------------------------------------------
|
| The current citizen belongs to a physical ward table.
|
| We first find the citizen.
| Then we update that exact physical table.
|
|--------------------------------------------------------------------------
*/

const updateWasteGenerator =
  async (
    phoneNumber,
    body,
    req
  ) => {
    const existing =
      await getWasteGeneratorByPhone(
        phoneNumber
      );

    if (!existing) {
      throw new Error(
        "Waste Generator not found"
      );
    }

    const table =
      quoteIdentifier(
        existing.wardTableName
      );

    /*
    |--------------------------------------------------------------------------
    | Only allow editable citizen fields.
    |--------------------------------------------------------------------------
    |
    | We intentionally DO NOT allow the client to change:
    |
    | city
    | zone
    | division
    | ward
    |
    | because geographic membership belongs to the hierarchy.
    |
    */

    const allowedFields = [
      "personName",
      "phoneNumber",
      "area",
      "wasteGeneratorTypes",
      "houseNumber",
      "floorNumber",
      "householdType",
      "contactNumber",
      "numberOfPeople",
      "buildingPhoto",
      "dryRFID",
      "drySlno",
      "wetRFID",
      "wetSlno",
      "lat",
      "lng",
    ];

    const updates = {};
    
    for (const field of allowedFields) {
      if (
        Object.prototype.hasOwnProperty.call(
          body,
          field
        )
      ) {
        updates[field] =
          body[field];
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Nothing to update
    |--------------------------------------------------------------------------
    */

    if (
      Object.keys(updates).length === 0
    ) {
      throw new Error(
        "No valid fields supplied for update"
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Build SET clause
    |--------------------------------------------------------------------------
    */

    const setParts = [];

    const values = [];

    let parameterIndex = 1;

    for (
      const [field, value]
      of Object.entries(updates)
    ) {
      const quotedField =
        quoteIdentifier(
          field
        );

      setParts.push(
        `${quotedField} = $${parameterIndex}`
      );

      values.push(value);

      parameterIndex++;
    }

    /*
    |--------------------------------------------------------------------------
    | updatedAt
    |--------------------------------------------------------------------------
    */

    setParts.push(
      `"updatedAt" = CURRENT_TIMESTAMP`
    );

    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */

    const query = `
      UPDATE ${table}

      SET
        ${setParts.join(",\n        ")}

      WHERE
        "phoneNumber" = $${parameterIndex}

      RETURNING
        *
    `;

    values.push(
      phoneNumber
    );

    const result =
      await masterCitizenPrisma.$queryRawUnsafe(
        query,
        ...values
      );

    if (
      !result ||
      result.length === 0
    ) {
      throw new Error(
        "Waste Generator not found"
      );
    }

    const updated =
      result[0];

    /*
    |--------------------------------------------------------------------------
    | Audit log
    |--------------------------------------------------------------------------
    */

    await logEdit({
      user:
        req.user,

      req,

      module:
        "Waste Generators",

      action:
        "UPDATE",

      recordId:
        updated.phoneNumber,

      description:
        `Updated Waste Generator ${updated.personName}`,
    });

    return {
      ...updated,

      cityId:
        existing.cityId,

      cityName:
        existing.cityName,

      zoneId:
        existing.zoneId,

      zoneName:
        existing.zoneName,

      divisionId:
        existing.divisionId,

      divisionName:
        existing.divisionName,

      wardId:
        existing.wardId,

      wardNo:
        existing.wardNo,

      wardName:
        existing.wardName,

      wardTableName:
        existing.wardTableName,
    };
  };

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
|
| Kept here so the existing backend does not break if the route
| still exists.
|
| Your frontend no longer needs to expose Create.
|
|--------------------------------------------------------------------------
*/

const createWasteGenerator =
  async (
    body,
    req
  ) => {
    throw new Error(
      "Creating Waste Generators is disabled. Citizens are managed through the ward citizen tables."
    );
  };

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
|
| Kept here for backend compatibility.
|
| Your frontend no longer exposes Delete.
|
|--------------------------------------------------------------------------
*/

const deleteWasteGenerator =
  async (
    phoneNumber,
    req
  ) => {
    throw new Error(
      "Deleting Waste Generators is disabled. Current citizen records are managed through the ward citizen tables."
    );
  };

/*
|--------------------------------------------------------------------------
| SUMMARY
|--------------------------------------------------------------------------
|
| Current citizens only.
|
| No historical data.
| No date.
|
|--------------------------------------------------------------------------
*/

const getSummary =
  async ({
    cityId,
    zoneId,
    divisionId,
    wardId,
  } = {}) => {
    const wardScope =
      await getSelectedWardScope({
        cityId,
        zoneId,
        divisionId,
        wardId,
      });

    const wards =
      wardScope.wards || [];

    let totalWasteGenerators = 0;

    for (const ward of wards) {
      if (!ward.wardTableName) {
        continue;
      }

      const table =
        quoteIdentifier(
          ward.wardTableName
        );

      try {
        const result =
          await masterCitizenPrisma.$queryRawUnsafe(
            `
              SELECT
                COUNT(*)::bigint AS total
              FROM ${table}
            `
          );

        totalWasteGenerators +=
          Number(
            result?.[0]?.total || 0
          );
      } catch (error) {
        if (
          error?.code === "42P01"
        ) {
          continue;
        }

        throw error;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Summary is deliberately based on CURRENT citizen records only.
    |--------------------------------------------------------------------------
    */

    return {
      totalWasteGenerators,

      activeWasteGenerators:
        totalWasteGenerators,

      inactiveWasteGenerators:
        0,

      totalWasteGenerated:
        0,

      averageWaste:
        0,

      aboveAverage:
        0,

      belowAverage:
        0,
    };
  };

/*
|--------------------------------------------------------------------------
| GVP TREND
|--------------------------------------------------------------------------
|
| Historical/telemetry functionality is intentionally not mixed
| into current citizen retrieval.
|
| Keep endpoint compatibility.
|
|--------------------------------------------------------------------------
*/

const getGVPTrend =
  async () => {
    return [];
  };

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  getAllWasteGenerators,

  getWasteGeneratorByPhone,

  getSummary,

  getGVPTrend,

  createWasteGenerator,

  updateWasteGenerator,

  deleteWasteGenerator,

  getSelectedWardScope,
};