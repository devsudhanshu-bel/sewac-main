const { PrismaClient: SewacClient } = require("../generated/sewac");

const sewacPrisma = new SewacClient();

const masterCitizenPrisma = require("../config/masterCitizenPrisma");

const telemetryDb = require("../config/telemetryDb");

const logEdit = require("../utils/editLogger");

/*
|--------------------------------------------------------------------------
| SAFE DATABASE IDENTIFIER
|--------------------------------------------------------------------------
*/

const IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;

const quoteIdentifier = (identifier) => {
  if (typeof identifier !== "string" || !IDENTIFIER_REGEX.test(identifier)) {
    throw new Error(`Unsafe database identifier: ${identifier}`);
  }

  return `"${identifier.replace(/"/g, '""')}"`;
};

/*
|--------------------------------------------------------------------------
| POSTGRES MISSING RELATION ERROR
|--------------------------------------------------------------------------
|
| Prisma wraps PostgreSQL 42P01 errors from $queryRawUnsafe()
| as Prisma P2010 errors.
|
| Therefore:
|
| PostgreSQL:
|   42P01 = relation does not exist
|
| Prisma:
|   P2010
|   meta.code = 42P01
|
|--------------------------------------------------------------------------
*/

const isMissingRelationError = (error) => {
  return (
    error?.code === "42P01" ||
    (error?.code === "P2010" && error?.meta?.code === "42P01") ||
    String(error?.message || "").includes("42P01") ||
    String(error?.message || "").includes("does not exist")
  );
};

/*
|--------------------------------------------------------------------------
| ID PARSER
|--------------------------------------------------------------------------
*/

const parseId = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${fieldName} must be a positive integer`);
  }

  return parsed;
};

/*
|--------------------------------------------------------------------------
| SEARCH NORMALIZER
|--------------------------------------------------------------------------
*/

const normalizeSearch = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
};

/*
|--------------------------------------------------------------------------
| DATE VALIDATION
|--------------------------------------------------------------------------
*/

const validateDate = (date) => {
  const selectedDate = date || new Date().toISOString().split("T")[0];

  if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
    throw new Error("date must be in YYYY-MM-DD format");
  }

  const parsed = new Date(`${selectedDate}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date");
  }

  const normalized = parsed.toISOString().split("T")[0];

  if (normalized !== selectedDate) {
    throw new Error("Invalid date");
  }

  return {
    value: selectedDate,
    date: parsed,
  };
};

/*
|--------------------------------------------------------------------------
| DAY TABLE
|--------------------------------------------------------------------------
*/

const getDayTableName = (date) => {
  const dd = String(date.getDate()).padStart(2, "0");

  const mm = String(date.getMonth() + 1).padStart(2, "0");

  const yyyy = date.getFullYear();

  return `day_${dd}${mm}${yyyy}`;
};

/*
|--------------------------------------------------------------------------
| GET ALL WARDS
|--------------------------------------------------------------------------
*/

const getAllWardScope = async () => {
  const cities = await masterCitizenPrisma.city_table.findMany({
    orderBy: {
      city_id: "asc",
    },
  });

  const wards = [];

  for (const city of cities) {
    if (!city.city_table_name) {
      continue;
    }

    const cityTable = quoteIdentifier(city.city_table_name);

    const zones = await masterCitizenPrisma.$queryRawUnsafe(
      `
          SELECT
            zone_id,
            zone_name,
            zone_table_name
          FROM ${cityTable}
          ORDER BY zone_id ASC
        `,
    );

    for (const zone of zones) {
      if (!zone.zone_table_name) {
        continue;
      }

      const zoneTable = quoteIdentifier(zone.zone_table_name);

      const divisions = await masterCitizenPrisma.$queryRawUnsafe(
        `
            SELECT
              division_id,
              division_name,
              division_table_name
            FROM ${zoneTable}
            ORDER BY division_id ASC
          `,
      );

      for (const division of divisions) {
        if (!division.division_table_name) {
          continue;
        }

        const divisionTable = quoteIdentifier(division.division_table_name);

        const wardRows = await masterCitizenPrisma.$queryRawUnsafe(
          `
              SELECT
                ward_id,
                ward_no,
                ward_name,
                ward_table_name
              FROM ${divisionTable}
              ORDER BY ward_no ASC
            `,
        );

        for (const ward of wardRows) {
          wards.push({
            cityId: Number(city.city_id),

            cityName: city.city_name,

            zoneId: Number(zone.zone_id),

            zoneName: zone.zone_name,

            divisionId: Number(division.division_id),

            divisionName: division.division_name,

            divisionTableName: division.division_table_name,

            wardId: Number(ward.ward_id),

            wardNo: ward.ward_no === null ? null : Number(ward.ward_no),

            wardName: ward.ward_name,

            wardTableName: ward.ward_table_name,
          });
        }
      }
    }
  }

  return wards;
};

/*
|--------------------------------------------------------------------------
| SELECTED GEOGRAPHIC SCOPE
|--------------------------------------------------------------------------
*/

const getSelectedWardScope = async ({ cityId, zoneId, divisionId, wardId }) => {
  const selectedCityId = parseId(cityId, "cityId");

  const selectedZoneId = parseId(zoneId, "zoneId");

  const selectedDivisionId = parseId(divisionId, "divisionId");

  const selectedWardId = parseId(wardId, "wardId");

  if (selectedZoneId && !selectedCityId) {
    throw new Error("zoneId requires cityId");
  }

  if (selectedDivisionId && !selectedZoneId) {
    throw new Error("divisionId requires zoneId");
  }

  if (selectedWardId && !selectedDivisionId) {
    throw new Error("wardId requires divisionId");
  }

  if (!selectedCityId) {
    return {
      filtered: false,
      wards: await getAllWardScope(),
    };
  }

  const city = await masterCitizenPrisma.city_table.findUnique({
    where: {
      city_id: selectedCityId,
    },
  });

  if (!city) {
    throw new Error("City not found");
  }

  if (!city.city_table_name) {
    throw new Error("City has no dynamic table registered");
  }

  const cityTable = quoteIdentifier(city.city_table_name);

  const zones = await masterCitizenPrisma.$queryRawUnsafe(
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
    ...(selectedZoneId ? [selectedZoneId] : []),
  );

  if (selectedZoneId && zones.length === 0) {
    throw new Error("Zone not found in selected city");
  }

  const wards = [];

  for (const zone of zones) {
    if (!zone.zone_table_name) {
      continue;
    }

    const zoneTable = quoteIdentifier(zone.zone_table_name);

    const divisions = await masterCitizenPrisma.$queryRawUnsafe(
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
      ...(selectedDivisionId ? [selectedDivisionId] : []),
    );

    if (selectedDivisionId && divisions.length === 0) {
      throw new Error("Division not found in selected zone");
    }

    for (const division of divisions) {
      if (!division.division_table_name) {
        continue;
      }

      const divisionTable = quoteIdentifier(division.division_table_name);

      const wardRows = await masterCitizenPrisma.$queryRawUnsafe(
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
        ...(selectedWardId ? [selectedWardId] : []),
      );

      if (selectedWardId && wardRows.length === 0) {
        throw new Error("Ward not found in selected division");
      }

      for (const ward of wardRows) {
        wards.push({
          cityId: selectedCityId,

          cityName: city.city_name,

          zoneId: Number(zone.zone_id),

          zoneName: zone.zone_name,

          divisionId: Number(division.division_id),

          divisionName: division.division_name,

          divisionTableName: division.division_table_name,

          wardId: Number(ward.ward_id),

          wardNo: ward.ward_no === null ? null : Number(ward.ward_no),

          wardName: ward.ward_name,

          wardTableName: ward.ward_table_name,
        });
      }
    }
  }

  if (selectedWardId && wards.length === 0) {
    throw new Error("Ward not found");
  }

  return {
    filtered: true,
    wards,
  };
};

/*
|--------------------------------------------------------------------------
| CITIZEN SEARCH
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| DIRECTORY SEARCH
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| The Waste Generator Directory is REPRESENTATIONAL.
|
| SOURCE:
|     helper DB → master_citizen_data
|
| IMPORTANT:
|     We DO NOT INSERT
|     We DO NOT UPDATE
|     We DO NOT DELETE
|     master_citizen_data
|
|--------------------------------------------------------------------------
*/

const citizenMatchesSearch = (citizen, search) => {
  const needle = normalizeSearch(search).toLowerCase();

  if (!needle) {
    return true;
  }

  const fields = [
    citizen.personName,
    citizen.phoneNumber,
    citizen.contactNumber,
    citizen.area,
    citizen.houseNumber,
    citizen.dryRFID,
    citizen.drySlno,
    citizen.wetRFID,
    citizen.wetSlno,
    citizen.wardName,
    citizen.wardNo,
  ];

  return fields.some(
    (field) =>
      field !== null &&
      field !== undefined &&
      String(field).toLowerCase().includes(needle),
  );
};

/*
|--------------------------------------------------------------------------
| GET MASTER CITIZENS FOR SELECTED WARD
|--------------------------------------------------------------------------
|
| This is the IMPORTANT replacement.
|
| OLD:
|
|     selected ward
|          ↓
|     physical ward table
|
| NEW:
|
|     selected ward
|          ↓
|     master_citizen_data
|
| master_citizen_data remains READ ONLY.
|--------------------------------------------------------------------------
*/

const getMasterCitizensForWard = async (ward) => {
  if (!ward || !Number.isInteger(Number(ward.wardNo))) {
    return [];
  }

  const wardNo = Number(ward.wardNo);

  /*
  |--------------------------------------------------------------------------
  | IMPORTANT
  |--------------------------------------------------------------------------
  |
  | The master table stores ward as String.
  |
  | Existing data can represent it as:
  |
  |     "216"
  |     "Ward 216"
  |     "216 - Ibbalur"
  |
  | Therefore we normalize the numeric portion before comparing.
  |
  |--------------------------------------------------------------------------
  */

  const rows = await masterCitizenPrisma.$queryRawUnsafe(
    `
      SELECT
        id,

        "phoneNumber",

        city,

        ward,

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

      FROM "master_citizen_data"

      WHERE
        (
          TRIM("ward") = $1
          OR
          regexp_replace(
            TRIM("ward"),
            '[^0-9]',
            '',
            'g'
          ) = $1
        )

      ORDER BY
        "createdAt" DESC,
        id DESC
    `,
    String(wardNo),
  );

  /*
  |--------------------------------------------------------------------------
  | ATTACH HIERARCHY INFORMATION
  |--------------------------------------------------------------------------
  |
  | This does NOT modify the master table.
  |
  | These are response-only fields generated from the selected
  | Header hierarchy.
  |--------------------------------------------------------------------------
  */

  return rows.map((citizen) => ({
    ...citizen,

    cityId: ward.cityId,

    cityName: ward.cityName,

    zoneId: ward.zoneId,

    zoneName: ward.zoneName,

    divisionId: ward.divisionId,

    divisionName: ward.divisionName,

    wardId: ward.wardId,

    wardNo: ward.wardNo,

    wardName: ward.wardName,
  }));
};

/*
|--------------------------------------------------------------------------
| DIRECTORY
|--------------------------------------------------------------------------
|
| HEADER FILTER FLOW:
|
| City
|   ↓
| Zone
|   ↓
| Division
|   ↓
| Ward
|   ↓
| master_citizen_data
|
| The Directory is intentionally shown only after a Ward
| has been selected.
|--------------------------------------------------------------------------
*/

const getAllWasteGenerators = async (query = {}) => {
  const page = Number(query.page) || 1;

  const limit = Number(query.limit) || 10;

  const safePage = page < 1 ? 1 : Math.floor(page);

  const safeLimit = limit < 1 ? 10 : Math.min(Math.floor(limit), 50);

  const search = normalizeSearch(query.search);

  /*
  |--------------------------------------------------------------------------
  | REQUIRE COMPLETE HEADER HIERARCHY
  |--------------------------------------------------------------------------
  */

  const cityId = parseId(query.cityId, "cityId");

  const zoneId = parseId(query.zoneId, "zoneId");

  const divisionId = parseId(query.divisionId, "divisionId");

  const wardId = parseId(query.wardId, "wardId");

  /*
  |--------------------------------------------------------------------------
  | DIRECTORY REQUIRES WARD
  |--------------------------------------------------------------------------
  |
  | User requirement:
  |
  | City → Zone → Division → Ward
  |
  | Once Ward is selected, show its master citizens.
  |--------------------------------------------------------------------------
  */

  if (!cityId || !zoneId || !divisionId || !wardId) {
    return {
      wasteGenerators: [],

      pagination: {
        page: safePage,

        limit: safeLimit,

        total: 0,

        totalPages: 0,
      },

      filter: {
        cityId,

        zoneId,

        divisionId,

        wardId,
      },
    };
  }

  /*
  |--------------------------------------------------------------------------
  | RESOLVE THE SELECTED WARD
  |--------------------------------------------------------------------------
  |
  | This uses the SAME geographic hierarchy already used by the
  | working maps.
  |--------------------------------------------------------------------------
  */

  const wardScope = await getSelectedWardScope({
    cityId,

    zoneId,

    divisionId,

    wardId,
  });

  const wards = wardScope.wards || [];

  /*
  |--------------------------------------------------------------------------
  | SAFETY
  |--------------------------------------------------------------------------
  */

  if (wards.length !== 1) {
    return {
      wasteGenerators: [],

      pagination: {
        page: safePage,

        limit: safeLimit,

        total: 0,

        totalPages: 0,
      },

      filter: {
        cityId,

        zoneId,

        divisionId,

        wardId,
      },
    };
  }

  const selectedWard = wards[0];

  /*
  |--------------------------------------------------------------------------
  | READ MASTER CITIZENS
  |--------------------------------------------------------------------------
  */

  let citizens = await getMasterCitizensForWard(selectedWard);

  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  if (search) {
    citizens = citizens.filter((citizen) =>
      citizenMatchesSearch(citizen, search),
    );
  }

  /*
  |--------------------------------------------------------------------------
  | TOTAL
  |--------------------------------------------------------------------------
  */

  const total = citizens.length;

  const totalPages = total === 0 ? 0 : Math.ceil(total / safeLimit);

  /*
  |--------------------------------------------------------------------------
  | PAGE SAFETY
  |--------------------------------------------------------------------------
  */

  const effectivePage =
    totalPages > 0 && safePage > totalPages ? totalPages : safePage;

  /*
  |--------------------------------------------------------------------------
  | PAGINATION
  |--------------------------------------------------------------------------
  */

  const skip = (effectivePage - 1) * safeLimit;

  const paginated = citizens.slice(skip, skip + safeLimit);

  /*
  |--------------------------------------------------------------------------
  | RESPONSE
  |--------------------------------------------------------------------------
  */

  return {
    wasteGenerators: paginated,
    pagination: {
      page: effectivePage,
      limit: safeLimit,
      total,
      totalPages,
    },

    filter: {
      cityId,
      zoneId,
      divisionId,
      wardId,
      wardNo: selectedWard.wardNo,
      wardName: selectedWard.wardName,
    },
  };
};

/*
|--------------------------------------------------------------------------
| FIND CURRENT CITIZEN BY PHONE
|--------------------------------------------------------------------------
*/

const getWasteGeneratorByPhone = async (phoneNumber, query = {}) => {
  if (!phoneNumber) {
    throw new Error("Phone number is required");
  }

  const wardScope = await getSelectedWardScope({
    cityId: query.cityId,
    zoneId: query.zoneId,
    divisionId: query.divisionId,
    wardId: query.wardId,
  });

  const wards = wardScope.wards || [];

  for (const ward of wards) {
    if (!ward.wardTableName) {
      continue;
    }

    const table = quoteIdentifier(ward.wardTableName);

    const rows = await masterCitizenPrisma.$queryRawUnsafe(
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
      phoneNumber,
    );

    if (rows.length > 0) {
      return {
        ...rows[0],

        cityId: ward.cityId,

        cityName: ward.cityName,

        zoneId: ward.zoneId,

        zoneName: ward.zoneName,

        divisionId: ward.divisionId,

        divisionName: ward.divisionName,

        wardId: ward.wardId,

        wardNo: ward.wardNo,

        wardName: ward.wardName,

        wardTableName: ward.wardTableName,
      };
    }
  }

  throw new Error("Waste Generator not found");
};

/*
|--------------------------------------------------------------------------
| UPDATE CURRENT CITIZEN
|--------------------------------------------------------------------------
*/

const updateWasteGenerator = async (phoneNumber, body, req) => {
  const existing = await getWasteGeneratorByPhone(phoneNumber);

  if (!existing) {
    throw new Error("Waste Generator not found");
  }

  const table = quoteIdentifier(existing.wardTableName);

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
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new Error("No valid fields supplied for update");
  }

  const setParts = [];
  const values = [];

  let parameterIndex = 1;

  for (const [field, value] of Object.entries(updates)) {
    const quotedField = quoteIdentifier(field);

    setParts.push(`${quotedField} = $${parameterIndex}`);

    values.push(value);

    parameterIndex++;
  }

  setParts.push(`"updatedAt" = CURRENT_TIMESTAMP`);

  const query = `
      UPDATE ${table}
      SET
        ${setParts.join(",\n        ")}
      WHERE
        "phoneNumber" = $${parameterIndex}
      RETURNING *
    `;

  values.push(phoneNumber);

  const result = await masterCitizenPrisma.$queryRawUnsafe(query, ...values);

  if (!result || result.length === 0) {
    throw new Error("Waste Generator not found");
  }

  const updated = result[0];

  await logEdit({
    user: req.user,
    req,
    module: "Waste Generators",
    action: "UPDATE",
    recordId: updated.phoneNumber,
    description: `Updated Waste Generator ${updated.personName}`,
  });

  return {
    ...updated,

    cityId: existing.cityId,

    cityName: existing.cityName,

    zoneId: existing.zoneId,

    zoneName: existing.zoneName,

    divisionId: existing.divisionId,

    divisionName: existing.divisionName,

    wardId: existing.wardId,

    wardNo: existing.wardNo,

    wardName: existing.wardName,

    wardTableName: existing.wardTableName,
  };
};

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

const createWasteGenerator = async (body, req) => {
  throw new Error(
    "Creating Waste Generators is disabled. Citizens are managed through the ward citizen tables.",
  );
};

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

const deleteWasteGenerator = async (phoneNumber, req) => {
  throw new Error(
    "Deleting Waste Generators is disabled. Current citizen records are managed through the ward citizen tables.",
  );
};

/*
|--------------------------------------------------------------------------
| VEHICLE TABLES FOR SELECTED DATE
|--------------------------------------------------------------------------
*/

const getVehicleTablesForDate = async (date, wardNos = null) => {
  const dayTable = getDayTableName(date);

  const dayIdentifier = quoteIdentifier(dayTable);

  if (Array.isArray(wardNos) && wardNos.length === 0) {
    return [];
  }

  try {
    let rows;

    if (Array.isArray(wardNos)) {
      rows = await telemetryDb.$queryRawUnsafe(
        `
              SELECT
                vehicle_number,
                vehicle_table_name,
                ward_no
              FROM ${dayIdentifier}
              WHERE ward_no =
                    ANY($1::integer[])
              ORDER BY
                vehicle_number ASC
            `,
        wardNos,
      );
    } else {
      rows = await telemetryDb.$queryRawUnsafe(
        `
              SELECT
                vehicle_number,
                vehicle_table_name,
                ward_no
              FROM ${dayIdentifier}
              ORDER BY
                vehicle_number ASC
            `,
      );
    }

    return rows.map((row) => ({
      vehicleNumber:
        row.vehicle_number === null || row.vehicle_number === undefined
          ? null
          : String(row.vehicle_number).trim(),

      vehicleTableName: row.vehicle_table_name,

      wardNo:
        row.ward_no === null || row.ward_no === undefined
          ? null
          : Number(row.ward_no),
    }));
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(
        `Waste Generator: telemetry day table ${dayTable} does not exist. Returning no data.`,
      );

      return [];
    }

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| TELEMETRY UNION
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| Every vehicle table keeps its own local ID sequence.
|
| Therefore the source vehicle table is explicitly attached
| to every row.
|--------------------------------------------------------------------------
*/

const buildTelemetryUnion = (vehicleTables) => {
  if (!Array.isArray(vehicleTables) || vehicleTables.length === 0) {
    return null;
  }

  return vehicleTables
    .filter(
      ({ vehicleTableName }) =>
        vehicleTableName &&
        typeof vehicleTableName === "string" &&
        IDENTIFIER_REGEX.test(vehicleTableName),
    )
    .map(({ vehicleTableName, wardNo }) => {
      const table = quoteIdentifier(vehicleTableName);

      const safeWardNo = Number.isInteger(Number(wardNo))
        ? Number(wardNo)
        : null;

      return `
            SELECT
              id,

              iottimestamp,

              receivedtimestamp,

              citizenid,

              latitude,

              longitude,

              wetweight,

              dryweight,

              otherweight,

              cumulativeweight,

              vehiclenumber,

              unitnumber,

              remarks,

              citizencontact,

              ${
                safeWardNo === null ? "NULL::integer" : `${safeWardNo}::integer`
              }
                AS "wardNo",

              '${vehicleTableName.replace(/'/g, "''")}'::text
                AS "sourceVehicleTable"

            FROM ${table}
          `;
    })
    .join("\nUNION ALL\n");
};

/*
|--------------------------------------------------------------------------
| TELEMETRY ROWS
|--------------------------------------------------------------------------
*/

const getTelemetryRows = async (vehicleTables, selectedDate) => {
  const unionSql = buildTelemetryUnion(vehicleTables);

  if (!unionSql) {
    return [];
  }

  try {
    const result = await telemetryDb.$queryRawUnsafe(
      `
            SELECT

              id,

              iottimestamp
                AS "iotTimestamp",

              receivedtimestamp
                AS "receivedTimestamp",

              citizenid
                AS "citizenId",

              latitude,

              longitude,

              wetweight
                AS "wetWeight",

              dryweight
                AS "dryWeight",

              otherweight
                AS "otherWeight",

              cumulativeweight
                AS "cumulativeWeight",

              vehiclenumber
                AS "vehicleNumber",

              unitnumber
                AS "unitNumber",

              remarks,

              citizencontact
                AS "citizenContact",

              "wardNo",

              "sourceVehicleTable"

            FROM (
              ${unionSql}
            ) telemetry

            WHERE iottimestamp >=
                  $1::date

              AND iottimestamp <
                  (
                    $1::date +
                    INTERVAL '1 day'
                  )

            ORDER BY
              "wardNo" ASC,
              "vehicleNumber" ASC,
              iottimestamp ASC,
              id ASC
          `,
      selectedDate,
    );

    return result;
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(
        "Waste Generator: one or more vehicle telemetry tables do not exist.",
      );

      return [];
    }

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| CITIZEN COUNT
|--------------------------------------------------------------------------
*/

const getCitizenCountForWards = async (wards) => {
  if (!Array.isArray(wards) || wards.length === 0) {
    return 0;
  }

  let total = 0;

  for (const ward of wards) {
    if (!ward.wardTableName) {
      continue;
    }

    const table = quoteIdentifier(ward.wardTableName);

    try {
      const result = await masterCitizenPrisma.$queryRawUnsafe(
        `
              SELECT
                COUNT(*)::bigint
                  AS total
              FROM ${table}
            `,
      );

      total += Number(result?.[0]?.total || 0);
    } catch (error) {
      if (error?.code === "42P01") {
        console.warn(
          `Waste Generator: ward table ${ward.wardTableName} does not exist.`,
        );

        continue;
      }

      throw error;
    }
  }

  return total;
};

/*
|--------------------------------------------------------------------------
| SUMMARY
|--------------------------------------------------------------------------
*/

const getSummary = async ({
  date,
  cityId,
  zoneId,
  divisionId,
  wardId,
} = {}) => {
  const { value: selectedDate, date: dateObject } = validateDate(date);

  const wardScope = await getSelectedWardScope({
    cityId,
    zoneId,
    divisionId,
    wardId,
  });

  const wards = wardScope.wards || [];

  if (wards.length === 0) {
    return {
      totalWasteGenerators: 0,
      activeWasteGenerators: 0,
      inactiveWasteGenerators: 0,
      totalWasteGenerated: 0,
      averageWaste: 0,
      aboveAverage: 0,
      belowAverage: 0,
    };
  }

  const wardNos = wards
    .map((ward) => Number(ward.wardNo))
    .filter((wardNo) => Number.isInteger(wardNo));

  if (wardNos.length === 0) {
    return {
      totalWasteGenerators: await getCitizenCountForWards(wards),

      activeWasteGenerators: 0,

      inactiveWasteGenerators: await getCitizenCountForWards(wards),

      totalWasteGenerated: 0,

      averageWaste: 0,

      aboveAverage: 0,

      belowAverage: 0,
    };
  }

  const totalWasteGenerators = await getCitizenCountForWards(wards);

  const vehicleTables = await getVehicleTablesForDate(dateObject, wardNos);

  if (vehicleTables.length === 0) {
    return {
      totalWasteGenerators,

      activeWasteGenerators: 0,

      inactiveWasteGenerators: totalWasteGenerators,

      totalWasteGenerated: 0,

      averageWaste: 0,

      aboveAverage: 0,

      belowAverage: 0,
    };
  }

  const telemetryRows = await getTelemetryRows(vehicleTables, selectedDate);

  const citizenWaste = new Map();

  for (const row of telemetryRows) {
    if (row.citizenId === null || row.citizenId === undefined) {
      continue;
    }

    const citizenId = String(row.citizenId).trim();

    if (!citizenId) {
      continue;
    }

    const wet = Number(row.wetWeight || 0);

    const dry = Number(row.dryWeight || 0);

    const other = Number(row.otherWeight || 0);

    const waste = wet + dry + other;

    const existing = citizenWaste.get(citizenId) || 0;

    citizenWaste.set(citizenId, existing + waste);
  }

  let totalWasteGenerated = 0;

  for (const waste of citizenWaste.values()) {
    totalWasteGenerated += waste;
  }

  const activeWasteGenerators = Math.min(
    citizenWaste.size,
    totalWasteGenerators,
  );

  const inactiveWasteGenerators = Math.max(
    totalWasteGenerators - activeWasteGenerators,
    0,
  );

  const averageWaste =
    activeWasteGenerators > 0 ? totalWasteGenerated / activeWasteGenerators : 0;

  let aboveAverage = 0;
  let belowAverage = 0;

  for (const waste of citizenWaste.values()) {
    if (waste >= averageWaste) {
      aboveAverage++;
    } else {
      belowAverage++;
    }
  }

  return {
    totalWasteGenerators,

    activeWasteGenerators,

    inactiveWasteGenerators,

    totalWasteGenerated: Number(totalWasteGenerated.toFixed(2)),

    averageWaste: Number(averageWaste.toFixed(2)),

    aboveAverage,

    belowAverage,
  };
};

/*
|--------------------------------------------------------------------------
| GVP TREND
|--------------------------------------------------------------------------
*/

const getGVPTrend = async ({
  date,
  cityId,
  zoneId,
  divisionId,
  wardId,
} = {}) => {
  const { value: selectedDate, date: dateObject } = validateDate(date);

  /*
  |--------------------------------------------------------------------------
  | GET WARDS
  |--------------------------------------------------------------------------
  */

  const wardScope = await getSelectedWardScope({
    cityId,
    zoneId,
    divisionId,
    wardId,
  });

  const wards = wardScope.wards || [];

  if (wards.length === 0) {
    return [];
  }

  /*
  |--------------------------------------------------------------------------
  | WARD NUMBERS
  |--------------------------------------------------------------------------
  */

  const wardNos = wards
    .map((ward) => Number(ward.wardNo))
    .filter((wardNo) => Number.isInteger(wardNo));

  if (wardNos.length === 0) {
    return [];
  }

  /*
  |--------------------------------------------------------------------------
  | GET VEHICLE TABLES FOR SELECTED DATE
  |--------------------------------------------------------------------------
  */

  const vehicleTables = await getVehicleTablesForDate(dateObject, wardNos);

  /*
  |--------------------------------------------------------------------------
  | NO TELEMETRY
  |--------------------------------------------------------------------------
  */

  if (vehicleTables.length === 0) {
    return wards
      .map((ward) => ({
        wardId: ward.wardId,
        wardNo: ward.wardNo,
        wardName: ward.wardName,
        divisionName: ward.divisionName,
        zoneName: ward.zoneName,
        date: selectedDate,
        value: 0,
        gvp: 0,
        color: "#16A34A",
      }))
      .sort((a, b) => Number(a.wardNo || 0) - Number(b.wardNo || 0));
  }

  /*
  |--------------------------------------------------------------------------
  | GET TELEMETRY
  |--------------------------------------------------------------------------
  */

  const telemetryRows = await getTelemetryRows(vehicleTables, selectedDate);

  /*
  |--------------------------------------------------------------------------
  | MAP WARD NUMBER → WARD
  |--------------------------------------------------------------------------
  */

  const wardMap = new Map();

  for (const ward of wards) {
    wardMap.set(Number(ward.wardNo), ward);
  }

  /*
  |--------------------------------------------------------------------------
  | INITIALISE GVP TOTAL FOR EVERY WARD
  |--------------------------------------------------------------------------
  */

  const wardGVP = new Map();

  for (const ward of wards) {
    wardGVP.set(Number(ward.wardNo), 0);
  }

  /*
  |--------------------------------------------------------------------------
  | PREVIOUS CUMULATIVE WEIGHT
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | We DO NOT assume the previous cumulative value is 0.
  |
  | The first telemetry packet for a vehicle is only the
  | baseline. It must NOT itself be counted as GVP waste.
  |
  | Example:
  |
  | First packet:
  |     cumulative = 9024.39
  |
  | This gives:
  |     GVP = 0
  |
  | Next packet:
  |     cumulative = 9030.10
  |
  | Actual GVP:
  |     9030.10 - 9024.39
  |     = 5.71 KG
  |--------------------------------------------------------------------------
  */

  const previousCumulative = new Map();

  /*
  |--------------------------------------------------------------------------
  | PROCESS TELEMETRY IN CHRONOLOGICAL ORDER
  |--------------------------------------------------------------------------
  */

  for (const row of telemetryRows) {
    const vehicleNumber = row.vehicleNumber
      ? String(row.vehicleNumber).trim()
      : "";

    if (!vehicleNumber) {
      continue;
    }

    /*
    |--------------------------------------------------------------------------
    | USE VEHICLE TABLE + VEHICLE NUMBER AS UNIQUE STREAM
    |--------------------------------------------------------------------------
    |
    | This prevents cumulative sequences from different vehicle tables
    | from interfering with each other.
    |--------------------------------------------------------------------------
    */

    const sourceVehicleTable = row.sourceVehicleTable
      ? String(row.sourceVehicleTable).trim()
      : "";

    const vehicleKey = `${sourceVehicleTable}::${vehicleNumber}`;

    /*
    |--------------------------------------------------------------------------
    | CURRENT CUMULATIVE VALUE
    |--------------------------------------------------------------------------
    */

    const current = Number(row.cumulativeWeight || 0);

    /*
    |--------------------------------------------------------------------------
    | FIRST PACKET = BASELINE ONLY
    |--------------------------------------------------------------------------
    */

    const hasPrevious = previousCumulative.has(vehicleKey);

    const previous = previousCumulative.get(vehicleKey);

    const actualWaste = hasPrevious ? Math.max(current - previous, 0) : 0;

    /*
    |--------------------------------------------------------------------------
    | REQUIRED GVP CONDITION
    |--------------------------------------------------------------------------
    |
    | DO NOT CHANGE THIS LOGIC.
    |
    | GVP:
    |
    | 1. unitNumber must exist
    | 2. unitNumber must NOT contain UHF
    | 3. remarks must be "O"
    | 4. citizenContact must be null / empty
    |--------------------------------------------------------------------------
    */

    const unitNumber = row.unitNumber ? String(row.unitNumber).trim() : "";

    const citizenContact = row.citizenContact;

    const isGVP =
      Boolean(unitNumber) &&
      !unitNumber.toUpperCase().includes("UHF") &&
      row.remarks === "O" &&
      (citizenContact === null ||
        citizenContact === undefined ||
        String(citizenContact).trim() === "");

    /*
    |--------------------------------------------------------------------------
    | ADD ONLY THE INCREMENTAL GVP WASTE
    |--------------------------------------------------------------------------
    */

    if (isGVP && actualWaste > 0) {
      const wardNo = Number(row.wardNo);

      if (Number.isInteger(wardNo) && wardGVP.has(wardNo)) {
        const existing = wardGVP.get(wardNo) || 0;

        wardGVP.set(wardNo, existing + actualWaste);
      }
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE BASELINE
    |--------------------------------------------------------------------------
    */

    previousCumulative.set(vehicleKey, current);
  }

  /*
  |--------------------------------------------------------------------------
  | RETURN ONE POINT PER WARD
  |--------------------------------------------------------------------------
  */

  return wards
    .map((ward) => {
      const wardNo = Number(ward.wardNo);

      const value = wardGVP.get(wardNo) || 0;

      return {
        wardId: ward.wardId,

        wardNo: ward.wardNo,

        wardName: ward.wardName,

        divisionName: ward.divisionName,

        zoneName: ward.zoneName,

        date: selectedDate,

        /*
        | GVP in KG
        */
        value: Number(value.toFixed(2)),

        /*
        | Same value exposed as GVP
        */
        gvp: Number(value.toFixed(2)),

        /*
        | No 6500 KG threshold logic.
        | Keep the points green because the graph
        | is now simply representing ward GVP.
        */
        color: "#16A34A",
      };
    })
    .sort((a, b) => Number(a.wardNo || 0) - Number(b.wardNo || 0));
};

/*
|--------------------------------------------------------------------------
| MAP TELEMETRY ROWS
|--------------------------------------------------------------------------
|
| selected date
|   ↓
| day_DDMMYYYY
|   ↓
| ALL vehicle_table_name rows for selected ward
|   ↓
| ALL vehicle_DDMMYYYY tables
|   ↓
| iottimestamp selected date
|   ↓
| latitude / longitude
|
| NO boundary filtering happens here.
|--------------------------------------------------------------------------
*/

const getMapTelemetryRows = async (vehicleTables, selectedDate) => {
  const unionSql = buildTelemetryUnion(vehicleTables);

  if (!unionSql) {
    return [];
  }

  try {
    const result = await telemetryDb.$queryRawUnsafe(
      `
            SELECT
              id,

              iottimestamp
                AS "iotTimestamp",

              receivedtimestamp
                AS "receivedTimestamp",

              citizenid
                AS "citizenId",

              latitude,

              longitude,

              wetweight
                AS "wetWeight",

              dryweight
                AS "dryWeight",

              otherweight
                AS "otherWeight",

              cumulativeweight
                AS "cumulativeWeight",

              vehiclenumber
                AS "vehicleNumber",

              unitnumber
                AS "unitNumber",

              remarks,

              citizencontact
                AS "citizenContact",

              "wardNo",

              "sourceVehicleTable"

            FROM (
              ${unionSql}
            ) telemetry

            WHERE iottimestamp >=
                  $1::date

              AND iottimestamp <
                  (
                    $1::date +
                    INTERVAL '1 day'
                  )

              AND latitude IS NOT NULL

              AND longitude IS NOT NULL

            ORDER BY
              "vehicleNumber" ASC,
              iottimestamp ASC,
              id ASC
          `,
      selectedDate,
    );

    return result;
  } catch (error) {
    if (isMissingRelationError(error)) {
      console.warn(
        "Waste Generator: one or more vehicle telemetry tables do not exist.",
      );

      return [];
    }

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| MAP
|--------------------------------------------------------------------------
|
| FINAL FLOW:
|
| selected date
|   ↓
| day_DDMMYYYY
|   ↓
| ward_no = selected ward
|   ↓
| ALL vehicle tables
|   ↓
| UNION ALL
|   ↓
| iottimestamp selected date
|   ↓
| ALL valid coordinates
|
| IMPORTANT:
|
| The ward boundary is returned for visualization only.
| Telemetry points are NOT removed using point-in-polygon.
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| MAP
|--------------------------------------------------------------------------
|
| FINAL FLOW:
|
| selected date
|   ↓
| day_DDMMYYYY
|   ↓
| selected ward
|   ↓
| ALL vehicle tables registered for that ward
|   ↓
| UNION ALL vehicle telemetry tables
|   ↓
| selected date
|   ↓
| ALL valid coordinates
|
| TWO MAP LAYERS:
|
| 1. points
|    → ALL telemetry coordinates
|    → GREEN
|
| 2. gvpPoints
|    → telemetry satisfying the existing GVP rules
|    → RED
|
| GVP RULE:
|
| unitNumber exists
| AND unitNumber does NOT contain "UHF"
| AND remarks = "O"
| AND citizenContact is NULL / empty
|
| IMPORTANT:
|
| We do NOT use point-in-polygon filtering.
| The selected ward is used to select its vehicle tables.
|--------------------------------------------------------------------------
*/

const getWasteGeneratorMap = async ({
  date,
  cityId,
  zoneId,
  divisionId,
  wardId,
}) => {
  const { value: selectedDate, date: dateObject } = validateDate(date);

  const wardScope = await getSelectedWardScope({
    cityId,
    zoneId,
    divisionId,
    wardId,
  });

  const wards = wardScope.wards || [];

  if (wards.length !== 1) {
    throw new Error("Map requires exactly one selected ward");
  }

  const ward = wards[0];

  if (!ward.divisionTableName) {
    throw new Error("Selected ward has no division table name");
  }

  const divisionTable = quoteIdentifier(ward.divisionTableName);

  /*
  |--------------------------------------------------------------------------
  | GET SELECTED WARD BOUNDARY
  |--------------------------------------------------------------------------
  */

  const boundaryRows = await masterCitizenPrisma.$queryRawUnsafe(
    `
      SELECT
        ward_id,
        ward_no,
        ward_name,
        geo_boundary
      FROM ${divisionTable}
      WHERE ward_id = $1
      LIMIT 1
    `,
    ward.wardId,
  );

  const boundaryRow = boundaryRows[0];

  const wardNo = Number(ward.wardNo);

  if (!Number.isInteger(wardNo)) {
    throw new Error("Selected ward has an invalid ward number");
  }

  /*
  |--------------------------------------------------------------------------
  | GET ALL VEHICLE TABLES FOR SELECTED DATE + WARD
  |--------------------------------------------------------------------------
  */

  const vehicleTables = await getVehicleTablesForDate(dateObject, [wardNo]);

  /*
  |--------------------------------------------------------------------------
  | GET ALL TELEMETRY FROM ALL VEHICLE TABLES
  |--------------------------------------------------------------------------
  */

  const telemetryRows = await getMapTelemetryRows(vehicleTables, selectedDate);

  /*
  |--------------------------------------------------------------------------
  | ALL TELEMETRY POINTS
  |--------------------------------------------------------------------------
  */

  const points = [];

  /*
  |--------------------------------------------------------------------------
  | GVP POINTS
  |--------------------------------------------------------------------------
  */

  const gvpPoints = [];

  /*
  |--------------------------------------------------------------------------
  | PREVIOUS CUMULATIVE WEIGHT
  |--------------------------------------------------------------------------
  |
  | This is maintained separately for every vehicle.
  |
  | vehicle A:
  |   100 -> 120 -> 145
  |
  | deltas:
  |   100 -> 20 -> 25
  |
  | vehicle B has its own independent sequence.
  |--------------------------------------------------------------------------
  */

  const previousCumulative = new Map();

  /*
  |--------------------------------------------------------------------------
  | PROCESS EVERY TELEMETRY ROW
  |--------------------------------------------------------------------------
  */

  for (const row of telemetryRows) {
    const latitude = Number(row.latitude);

    const longitude = Number(row.longitude);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      continue;
    }

    const sourceVehicleTable = row.sourceVehicleTable
      ? String(row.sourceVehicleTable)
      : null;

    const vehicleNumber = row.vehicleNumber
      ? String(row.vehicleNumber).trim()
      : null;

    const rawId = Number(row.id);

    /*
    |--------------------------------------------------------------------------
    | GLOBAL POINT KEY
    |--------------------------------------------------------------------------
    |
    | Every vehicle table can have id = 1.
    |
    | Therefore:
    |
    | vehicleTable + vehicle + id + timestamp + coordinates
    |
    | is used instead of id alone.
    |--------------------------------------------------------------------------
    */

    const pointKey = [
      sourceVehicleTable || "UNKNOWN_TABLE",
      vehicleNumber || "UNKNOWN_VEHICLE",
      Number.isFinite(rawId) ? rawId : "NO_ID",
      row.iotTimestamp
        ? new Date(row.iotTimestamp).toISOString()
        : "NO_TIMESTAMP",
      latitude.toFixed(7),
      longitude.toFixed(7),
    ].join("|");

    /*
    |--------------------------------------------------------------------------
    | VEHICLE CUMULATIVE WEIGHT
    |--------------------------------------------------------------------------
    */

    const currentCumulative = Number(row.cumulativeWeight || 0);

    const previousCumulativeWeight =
      previousCumulative.get(vehicleNumber || sourceVehicleTable) || 0;

    const weightDelta = Math.max(
      currentCumulative - previousCumulativeWeight,
      0,
    );

    /*
    |--------------------------------------------------------------------------
    | GVP QUALIFICATION
    |--------------------------------------------------------------------------
    |
    | SAME LOGIC ALREADY USED BY getGVPTrend()
    |--------------------------------------------------------------------------
    */

    const unitNumber = row.unitNumber ? String(row.unitNumber).trim() : "";

    const citizenContact = row.citizenContact;

    const isGVP =
      Boolean(unitNumber) &&
      !unitNumber.toUpperCase().includes("UHF") &&
      row.remarks === "O" &&
      (citizenContact === null ||
        citizenContact === undefined ||
        String(citizenContact).trim() === "");

    /*
    |--------------------------------------------------------------------------
    | COMMON POINT OBJECT
    |--------------------------------------------------------------------------
    */

    const point = {
      id: Number.isFinite(rawId) ? rawId : null,

      pointKey,

      sourceVehicleTable,

      latitude,

      longitude,

      vehicleNumber,

      citizenId:
        row.citizenId === null || row.citizenId === undefined
          ? null
          : Number(row.citizenId),

      iotTimestamp: row.iotTimestamp || null,

      receivedTimestamp: row.receivedTimestamp || null,

      wetWeight:
        row.wetWeight === null || row.wetWeight === undefined
          ? null
          : Number(row.wetWeight),

      dryWeight:
        row.dryWeight === null || row.dryWeight === undefined
          ? null
          : Number(row.dryWeight),

      otherWeight:
        row.otherWeight === null || row.otherWeight === undefined
          ? null
          : Number(row.otherWeight),

      cumulativeWeight:
        row.cumulativeWeight === null || row.cumulativeWeight === undefined
          ? null
          : Number(row.cumulativeWeight),

      /*
      |--------------------------------------------------------------
      | INCREMENTAL WEIGHT
      |--------------------------------------------------------------
      */

      weightDelta: Number(weightDelta.toFixed(3)),

      unitNumber: row.unitNumber || null,

      remarks: row.remarks || null,

      citizenContact: row.citizenContact || null,

      wardNo:
        row.wardNo === null || row.wardNo === undefined
          ? wardNo
          : Number(row.wardNo),

      /*
      |--------------------------------------------------------------
      | GVP FLAG
      |--------------------------------------------------------------
      */

      isGVP,
    };

    /*
    |--------------------------------------------------------------------------
    | ADD TO ALL TELEMETRY POINTS
    |--------------------------------------------------------------------------
    */

    points.push(point);

    /*
    |--------------------------------------------------------------------------
    | ADD GVP POINT
    |--------------------------------------------------------------------------
    */

    if (isGVP) {
      gvpPoints.push({
        ...point,

        /*
        | Explicit GVP type makes frontend handling easier.
        */
        pointType: "GVP",

        /*
        | Keep the incremental waste available for tooltip.
        */
        gvpWaste: Number(weightDelta.toFixed(3)),
      });
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE PREVIOUS CUMULATIVE WEIGHT
    |--------------------------------------------------------------------------
    */

    previousCumulative.set(
      vehicleNumber || sourceVehicleTable,
      currentCumulative,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | VEHICLE POINT COUNTS
  |--------------------------------------------------------------------------
  */

  const vehiclePointCounts = new Map();

  const vehicleGVPCounts = new Map();

  for (const point of points) {
    const tableKey = point.sourceVehicleTable || "UNKNOWN_TABLE";

    const existing = vehiclePointCounts.get(tableKey) || 0;

    vehiclePointCounts.set(tableKey, existing + 1);
  }

  for (const point of gvpPoints) {
    const tableKey = point.sourceVehicleTable || "UNKNOWN_TABLE";

    const existing = vehicleGVPCounts.get(tableKey) || 0;

    vehicleGVPCounts.set(tableKey, existing + 1);
  }

  /*
  |--------------------------------------------------------------------------
  | VEHICLE SUMMARY
  |--------------------------------------------------------------------------
  */

  const vehicles = vehicleTables.map((vehicle) => ({
    vehicleNumber: vehicle.vehicleNumber,

    vehicleTableName: vehicle.vehicleTableName,

    wardNo: vehicle.wardNo,

    points: vehiclePointCounts.get(vehicle.vehicleTableName) || 0,

    gvpPoints: vehicleGVPCounts.get(vehicle.vehicleTableName) || 0,
  }));

  /*
  |--------------------------------------------------------------------------
  | SERVER DIAGNOSTIC
  |--------------------------------------------------------------------------
  */

  console.log("Waste Generator Map:", {
    selectedDate,

    dayTable: getDayTableName(dateObject),

    wardNo,

    vehicleTables: vehicleTables.length,

    telemetryRows: telemetryRows.length,

    validCoordinatePoints: points.length,

    gvpPoints: gvpPoints.length,

    vehicles,
  });

  /*
  |--------------------------------------------------------------------------
  | FINAL RESPONSE
  |--------------------------------------------------------------------------
  */

  const uniqueCollectionPointKeys = new Set(
    points.map(
      (point) =>
        `${Number(point.latitude).toFixed(7)},${Number(point.longitude).toFixed(7)}`,
    ),
  );

  const totalCollectionPoints = uniqueCollectionPointKeys.size;

  return {
    date: selectedDate,

    dayTable: getDayTableName(dateObject),

    ward: {
      wardId: Number(ward.wardId),

      wardNo: Number(ward.wardNo),

      wardName: ward.wardName,

      divisionId: Number(ward.divisionId),

      divisionName: ward.divisionName,

      zoneId: Number(ward.zoneId),

      zoneName: ward.zoneName,
    },

    /*
    |--------------------------------------------------------------------------
    | WARD BOUNDARY
    |--------------------------------------------------------------------------
    */

    boundary: boundaryRow?.geo_boundary || null,

    boundaryAvailable: Boolean(boundaryRow?.geo_boundary),

    /*
    |--------------------------------------------------------------------------
    | VEHICLES
    |--------------------------------------------------------------------------
    */

    vehicles,

    /*
    |--------------------------------------------------------------------------
    | ALL COLLECTION TELEMETRY
    |--------------------------------------------------------------------------
    */

    points,

    totalPoints: totalCollectionPoints,

    /*
    |--------------------------------------------------------------------------
    | GVP TELEMETRY
    |--------------------------------------------------------------------------
    */

    gvpPoints,

    totalGVPPoints: gvpPoints.length,
  };
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
  getWasteGeneratorMap,
};
