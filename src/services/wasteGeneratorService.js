const { PrismaClient: SewacClient } = require("../generated/sewac");

const sewacPrisma = new SewacClient();

const { PrismaClient: HelperClient } = require("../generated/helper");

const helperPrisma = new HelperClient();

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
| LOCAL DATE FORMATTER
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| Do not use toISOString() for the three-day
| activity calculation because that can shift
| the calendar date depending on timezone.
|
|--------------------------------------------------------------------------
*/

const formatDateLocal = (date) => {
  const yyyy = date.getFullYear();

  const mm = String(date.getMonth() + 1).padStart(2, "0");

  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
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
| GET MASTER CITIZENS FOR SELECTED WARD
|--------------------------------------------------------------------------
*/

const getMasterCitizensForWard = async (ward) => {
  if (!ward) {
    return [];
  }

  if (
    ward.wardNo === null ||
    ward.wardNo === undefined ||
    String(ward.wardNo).trim() === ""
  ) {
    return [];
  }

  const wardNo = String(ward.wardNo).trim();

  console.log("[Waste Generator Directory] Reading master_citizen_data", {
    wardNo,

    cityId: ward.cityId,

    zoneId: ward.zoneId,

    divisionId: ward.divisionId,

    wardId: ward.wardId,
  });

  const rows = await helperPrisma.$queryRawUnsafe(
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
            TRIM(ward) = $1
          ORDER BY
            id DESC
        `,
    wardNo,
  );

  console.log(
    `[Waste Generator Directory] Found ${rows.length} citizens for ward ${wardNo}`,
  );

  return rows.map((citizen) => ({
    ...citizen,

    cityId: ward.cityId,

    cityName: ward.cityName,

    zoneId: ward.zoneId,

    zoneName: ward.zoneName,

    divisionId: ward.divisionId,

    divisionName: ward.divisionName,

    wardId: ward.wardId,

    wardNo: Number(wardNo),

    wardName: ward.wardName,
  }));
};

/*
|--------------------------------------------------------------------------
| DIRECTORY SEARCH
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

    citizen.floorNumber,

    citizen.ward,

    citizen.dryRFID,

    citizen.drySlno,

    citizen.wetRFID,

    citizen.wetSlno,

    citizen.city,
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
| GET VEHICLE TABLES FOR SELECTED DATE
|--------------------------------------------------------------------------
|
| Declared before the status calculation so the
| activity logic can safely use it.
|
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
              WHERE
                ward_no =
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

            WHERE
              iottimestamp >=
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
| CITIZEN ACTIVITY STATUS
|--------------------------------------------------------------------------
|
| ACTIVE:
|
| Citizen disposed positive waste on at least
| one of the last 3 consecutive calendar days.
|
| INACTIVE:
|
| Citizen did NOT dispose any waste on all
| three consecutive calendar days.
|
| Example:
|
| selected date = 21 Aug
|
| check:
|
| 21 Aug
| 20 Aug
| 19 Aug
|
| If ANY day has positive waste:
|
| ACTIVE
|
| If all three have zero/missing data:
|
| INACTIVE
|
|--------------------------------------------------------------------------
*/

const getCitizenActivityStatus = async (
  citizens,
  selectedDateObject,
  wardNo,
) => {
  const statusMap = new Map();

  /*
    |--------------------------------------------------------------------------
    | DEFAULT EVERY CITIZEN TO INACTIVE
    |--------------------------------------------------------------------------
    */

  for (const citizen of citizens) {
    const citizenId = Number(citizen.id);

    if (!Number.isInteger(citizenId)) {
      continue;
    }

    statusMap.set(citizenId, "INACTIVE");
  }

  if (statusMap.size === 0) {
    return statusMap;
  }

  /*
    |--------------------------------------------------------------------------
    | BUILD THREE CALENDAR DAYS
    |--------------------------------------------------------------------------
    */

  const dates = [];

  for (let offset = 0; offset < 3; offset++) {
    const date = new Date(selectedDateObject);

    date.setDate(date.getDate() - offset);

    dates.push(date);
  }

  /*
    |--------------------------------------------------------------------------
    | CHECK EACH OF THE THREE DAYS
    |--------------------------------------------------------------------------
    */

  for (const dateObject of dates) {
    /*
      |--------------------------------------------------------------------------
      | GET DAY VEHICLE TABLES
      |--------------------------------------------------------------------------
      */

    const vehicleTables = await getVehicleTablesForDate(dateObject, [
      Number(wardNo),
    ]);

    /*
      |--------------------------------------------------------------------------
      | MISSING DAY TABLE
      |--------------------------------------------------------------------------
      |
      | This is a normal situation.
      |
      | No table = no disposal for that day.
      |
      |--------------------------------------------------------------------------
      */

    if (!Array.isArray(vehicleTables) || vehicleTables.length === 0) {
      continue;
    }

    /*
      |--------------------------------------------------------------------------
      | LOCAL DATE
      |--------------------------------------------------------------------------
      */

    const dateString = formatDateLocal(dateObject);

    /*
      |--------------------------------------------------------------------------
      | GET TELEMETRY
      |--------------------------------------------------------------------------
      */

    const telemetryRows = await getTelemetryRows(vehicleTables, dateString);

    /*
      |--------------------------------------------------------------------------
      | CHECK POSITIVE WASTE
      |--------------------------------------------------------------------------
      */

    for (const row of telemetryRows) {
      if (row.citizenId === null || row.citizenId === undefined) {
        continue;
      }

      const citizenId = Number(row.citizenId);

      if (!Number.isInteger(citizenId)) {
        continue;
      }

      /*
        |--------------------------------------------------------------------------
        | CALCULATE ACTUAL WASTE
        |--------------------------------------------------------------------------
        */

      const wet = Number(row.wetWeight || 0);

      const dry = Number(row.dryWeight || 0);

      const other = Number(row.otherWeight || 0);

      const waste = wet + dry + other;

      /*
        |--------------------------------------------------------------------------
        | POSITIVE WASTE = DISPOSAL
        |--------------------------------------------------------------------------
        */

      if (Number.isFinite(waste) && waste > 0) {
        if (statusMap.has(citizenId)) {
          statusMap.set(citizenId, "ACTIVE");
        }
      }
    }

    /*
      |--------------------------------------------------------------------------
      | EARLY EXIT
      |--------------------------------------------------------------------------
      |
      | If everyone is already active,
      | there is no need to inspect the
      | remaining day tables.
      |
      |--------------------------------------------------------------------------
      */

    let allActive = true;

    for (const status of statusMap.values()) {
      if (status !== "ACTIVE") {
        allActive = false;
        break;
      }
    }

    if (allActive) {
      break;
    }
  }

  return statusMap;
};

/*
|--------------------------------------------------------------------------
| GET ALL WASTE GENERATORS
|--------------------------------------------------------------------------
*/

const getAllWasteGenerators = async (query = {}) => {
  /*
    |--------------------------------------------------------------------------
    | PAGINATION
    |--------------------------------------------------------------------------
    */

  const requestedPage = Number.parseInt(query.page, 10) || 1;

  const requestedLimit = Number.parseInt(query.limit, 10) || 10;

  const page = Math.max(1, requestedPage);

  const limit = [10, 20, 50].includes(requestedLimit) ? requestedLimit : 10;

  /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

  const search = normalizeSearch(query.search);

  /*
    |--------------------------------------------------------------------------
    | DATE
    |--------------------------------------------------------------------------
    */

  const { value: selectedDate, date: dateObject } = validateDate(query.date);

  /*
    |--------------------------------------------------------------------------
    | HEADER FILTERS
    |--------------------------------------------------------------------------
    */

  const cityId = parseId(query.cityId, "cityId");

  const zoneId = parseId(query.zoneId, "zoneId");

  const divisionId = parseId(query.divisionId, "divisionId");

  const wardId = parseId(query.wardId, "wardId");

  /*
    |--------------------------------------------------------------------------
    | REQUIRE COMPLETE HEADER
    |--------------------------------------------------------------------------
    */

  if (!cityId || !zoneId || !divisionId || !wardId) {
    return {
      wasteGenerators: [],

      pagination: {
        page: 1,
        limit,
        total: 0,
        totalPages: 0,
      },

      filter: {
        cityId,
        zoneId,
        divisionId,
        wardId,
        wardNo: null,
      },

      date: selectedDate,
    };
  }

  /*
    |--------------------------------------------------------------------------
    | RESOLVE SELECTED WARD
    |--------------------------------------------------------------------------
    */

  const wardScope = await getSelectedWardScope({
    cityId,
    zoneId,
    divisionId,
    wardId,
  });

  const wards = Array.isArray(wardScope?.wards) ? wardScope.wards : [];

  /*
    |--------------------------------------------------------------------------
    | EXACTLY ONE WARD
    |--------------------------------------------------------------------------
    */

  if (wards.length !== 1) {
    return {
      wasteGenerators: [],

      pagination: {
        page: 1,
        limit,
        total: 0,
        totalPages: 0,
      },

      filter: {
        cityId,
        zoneId,
        divisionId,
        wardId,
        wardNo: null,
      },

      date: selectedDate,
    };
  }

  const selectedWard = wards[0];

  /*
    |--------------------------------------------------------------------------
    | VALIDATE WARD NUMBER
    |--------------------------------------------------------------------------
    */

  const wardNo =
    selectedWard.wardNo ??
    selectedWard.ward_no ??
    selectedWard.wardNumber ??
    selectedWard.ward_number;

  if (wardNo === null || wardNo === undefined || String(wardNo).trim() === "") {
    return {
      wasteGenerators: [],

      pagination: {
        page: 1,
        limit,
        total: 0,
        totalPages: 0,
      },

      filter: {
        cityId,
        zoneId,
        divisionId,
        wardId,
        wardNo: null,
      },

      date: selectedDate,
    };
  }

  /*
    |--------------------------------------------------------------------------
    | READ MASTER CITIZEN DATA
    |--------------------------------------------------------------------------
    */

  let citizens = await getMasterCitizensForWard({
    ...selectedWard,

    cityId,

    zoneId,

    divisionId,

    wardId,

    wardNo: Number(wardNo),
  });

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
    | WASTE METRICS
    |--------------------------------------------------------------------------
    */

  const wasteMetrics = await getDirectoryWasteMetrics({
    citizens,

    wards,

    selectedDate,
  });

  /*
    |--------------------------------------------------------------------------
    | ACTIVITY STATUS
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | Status is calculated independently from
    | the selected day's Total Waste.
    |
    | This checks the last 3 calendar days.
    |
    |--------------------------------------------------------------------------
    */

  const activityStatus = await getCitizenActivityStatus(
    citizens,
    dateObject,
    Number(wardNo),
  );

  /*
    |--------------------------------------------------------------------------
    | ATTACH WASTE + STATUS
    |--------------------------------------------------------------------------
    */

  const citizensWithWaste = citizens.map((citizen) => {
    const citizenId =
      citizen?.id === null || citizen?.id === undefined
        ? null
        : String(citizen.id).trim();

    const metric = citizenId ? wasteMetrics.get(citizenId) : null;

    /*
          |--------------------------------------------------------------------------
          | STATUS
          |--------------------------------------------------------------------------
          */

    const numericCitizenId =
      citizen?.id === null || citizen?.id === undefined
        ? null
        : Number(citizen.id);

    const status =
      numericCitizenId !== null && activityStatus.has(numericCitizenId)
        ? activityStatus.get(numericCitizenId)
        : "INACTIVE";

    return {
      ...citizen,

      /*
            |--------------------------------------------------------------------------
            | SELECTED DAY WASTE
            |--------------------------------------------------------------------------
            */

      totalWaste: metric ? Number(metric.totalWaste || 0) : 0,

      /*
            |--------------------------------------------------------------------------
            | HISTORICAL AVERAGE
            |--------------------------------------------------------------------------
            */

      averageWaste: metric ? Number(metric.averageWaste || 0) : 0,

      /*
            |--------------------------------------------------------------------------
            | ACTIVITY STATUS
            |--------------------------------------------------------------------------
            */

      status,
    };
  });

  /*
    |--------------------------------------------------------------------------
    | TOTAL
    |--------------------------------------------------------------------------
    */

  const total = citizensWithWaste.length;

  /*
    |--------------------------------------------------------------------------
    | TOTAL PAGES
    |--------------------------------------------------------------------------
    */

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  /*
    |--------------------------------------------------------------------------
    | SAFE PAGE
    |--------------------------------------------------------------------------
    */

  const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;

  /*
    |--------------------------------------------------------------------------
    | PAGINATION
    |--------------------------------------------------------------------------
    */

  const start = (safePage - 1) * limit;

  const paginatedCitizens = citizensWithWaste.slice(start, start + limit);

  /*
    |--------------------------------------------------------------------------
    | FINAL RESPONSE
    |--------------------------------------------------------------------------
    */

  return {
    wasteGenerators: paginatedCitizens,

    pagination: {
      page: safePage,

      limit,

      total,

      totalPages,
    },

    filter: {
      cityId,

      zoneId,

      divisionId,

      wardId,

      wardNo: Number(wardNo),
    },

    date: selectedDate,
  };
};

/*
|--------------------------------------------------------------------------
| DIRECTORY WASTE CALCULATION
|--------------------------------------------------------------------------
*/

const getHistoricalDayTables = async (selectedDate) => {
  try {
    const rows = await telemetryDb.$queryRawUnsafe(
      `
            SELECT
              table_name
            FROM information_schema.tables
            WHERE
              table_schema = 'public'
              AND table_name LIKE 'day_%'
            ORDER BY
              table_name ASC
          `,
    );

    const result = [];

    for (const row of rows) {
      const tableName = row.table_name;

      if (
        !tableName ||
        typeof tableName !== "string" ||
        !/^day_\d{8}$/.test(tableName)
      ) {
        continue;
      }

      const match = tableName.match(/^day_(\d{2})(\d{2})(\d{4})$/);

      if (!match) {
        continue;
      }

      const [, dd, mm, yyyy] = match;

      const tableDate = `${yyyy}-${mm}-${dd}`;

      if (tableDate <= selectedDate) {
        result.push({
          tableName,

          date: tableDate,
        });
      }
    }

    return result.sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error("Historical day table lookup error:", error);

    return [];
  }
};

/*
|--------------------------------------------------------------------------
| GET VEHICLE TABLES FOR HISTORICAL DAY
|--------------------------------------------------------------------------
*/

const getHistoricalVehicleTables = async (dayTableName, wardNos) => {
  if (!dayTableName || !Array.isArray(wardNos) || wardNos.length === 0) {
    return [];
  }

  const dayIdentifier = quoteIdentifier(dayTableName);

  try {
    const rows = await telemetryDb.$queryRawUnsafe(
      `
            SELECT
              vehicle_number,
              vehicle_table_name,
              ward_no
            FROM ${dayIdentifier}
            WHERE
              ward_no =
                ANY($1::integer[])
            ORDER BY
              vehicle_number ASC
          `,
      wardNos,
    );

    return rows
      .filter(
        (row) =>
          row.vehicle_table_name &&
          IDENTIFIER_REGEX.test(row.vehicle_table_name),
      )
      .map((row) => ({
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
      return [];
    }

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| GET CITIZEN WASTE FOR ONE DAY
|--------------------------------------------------------------------------
*/

const getCitizenWasteForDay = async (vehicleTables, selectedDate) => {
  if (!Array.isArray(vehicleTables) || vehicleTables.length === 0) {
    return new Map();
  }

  const rows = await getTelemetryRows(vehicleTables, selectedDate);

  const citizenWaste = new Map();

  for (const row of rows) {
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

    if (!Number.isFinite(waste)) {
      continue;
    }

    const previous = citizenWaste.get(citizenId) || 0;

    citizenWaste.set(citizenId, previous + waste);
  }

  return citizenWaste;
};

/*
|--------------------------------------------------------------------------
| GET DIRECTORY WASTE METRICS
|--------------------------------------------------------------------------
*/

const getDirectoryWasteMetrics = async ({ citizens, wards, selectedDate }) => {
  const metrics = new Map();

  for (const citizen of citizens) {
    const citizenId =
      citizen?.id === null || citizen?.id === undefined
        ? null
        : String(citizen.id).trim();

    if (!citizenId) {
      continue;
    }

    metrics.set(citizenId, {
      totalWaste: 0,

      historicalWaste: 0,

      collectionDays: 0,

      averageWaste: 0,
    });
  }

  if (metrics.size === 0 || !Array.isArray(wards) || wards.length === 0) {
    return metrics;
  }

  const wardNos = wards
    .map((ward) => Number(ward.wardNo))
    .filter((wardNo) => Number.isInteger(wardNo));

  if (wardNos.length === 0) {
    return metrics;
  }

  const dayTables = await getHistoricalDayTables(selectedDate);

  if (dayTables.length === 0) {
    return metrics;
  }

  for (const day of dayTables) {
    const vehicleTables = await getHistoricalVehicleTables(
      day.tableName,
      wardNos,
    );

    if (vehicleTables.length === 0) {
      continue;
    }

    const dayWaste = await getCitizenWasteForDay(vehicleTables, day.date);

    for (const [citizenId, waste] of dayWaste.entries()) {
      const metric = metrics.get(citizenId);

      if (!metric) {
        continue;
      }

      const safeWaste = Number(waste || 0);

      if (!Number.isFinite(safeWaste) || safeWaste <= 0) {
        continue;
      }

      metric.historicalWaste += safeWaste;

      metric.collectionDays += 1;

      if (day.date === selectedDate) {
        metric.totalWaste += safeWaste;
      }
    }
  }

  for (const metric of metrics.values()) {
    metric.totalWaste = Number(metric.totalWaste.toFixed(2));

    metric.historicalWaste = Number(metric.historicalWaste.toFixed(2));

    metric.averageWaste =
      metric.collectionDays > 0
        ? Number((metric.historicalWaste / metric.collectionDays).toFixed(2))
        : 0;
  }

  return metrics;
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
            WHERE
              "phoneNumber" = $1
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
    const total = await getCitizenCountForWards(wards);

    return {
      totalWasteGenerators: total,

      activeWasteGenerators: 0,

      inactiveWasteGenerators: total,

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

  const wardNos = wards
    .map((ward) => Number(ward.wardNo))
    .filter((wardNo) => Number.isInteger(wardNo));

  if (wardNos.length === 0) {
    return [];
  }

  const vehicleTables = await getVehicleTablesForDate(dateObject, wardNos);

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

  const telemetryRows = await getTelemetryRows(vehicleTables, selectedDate);

  const wardGVP = new Map();

  for (const ward of wards) {
    wardGVP.set(Number(ward.wardNo), 0);
  }

  const previousCumulative = new Map();

  for (const row of telemetryRows) {
    const vehicleNumber = row.vehicleNumber
      ? String(row.vehicleNumber).trim()
      : "";

    if (!vehicleNumber) {
      continue;
    }

    const sourceVehicleTable = row.sourceVehicleTable
      ? String(row.sourceVehicleTable).trim()
      : "";

    const vehicleKey = `${sourceVehicleTable}::${vehicleNumber}`;

    const current = Number(row.cumulativeWeight || 0);

    const hasPrevious = previousCumulative.has(vehicleKey);

    const previous = previousCumulative.get(vehicleKey);

    const actualWaste = hasPrevious ? Math.max(current - previous, 0) : 0;

    const unitNumber = row.unitNumber ? String(row.unitNumber).trim() : "";

    const citizenContact = row.citizenContact;

    const isGVP =
      Boolean(unitNumber) &&
      !unitNumber.toUpperCase().includes("UHF") &&
      row.remarks === "O" &&
      (citizenContact === null ||
        citizenContact === undefined ||
        String(citizenContact).trim() === "");

    if (isGVP && actualWaste > 0) {
      const wardNo = Number(row.wardNo);

      if (Number.isInteger(wardNo) && wardGVP.has(wardNo)) {
        const existing = wardGVP.get(wardNo) || 0;

        wardGVP.set(wardNo, existing + actualWaste);
      }
    }

    previousCumulative.set(vehicleKey, current);
  }

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

        value: Number(value.toFixed(2)),

        gvp: Number(value.toFixed(2)),

        color: "#16A34A",
      };
    })
    .sort((a, b) => Number(a.wardNo || 0) - Number(b.wardNo || 0));
};

/*
|--------------------------------------------------------------------------
| MAP TELEMETRY ROWS
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

            WHERE
              iottimestamp >=
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
| WASTE GENERATOR MAP
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
    | SELECTED WARD BOUNDARY
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
    | VEHICLE TABLES
    |--------------------------------------------------------------------------
    */

  const vehicleTables = await getVehicleTablesForDate(dateObject, [wardNo]);

  /*
    |--------------------------------------------------------------------------
    | TELEMETRY
    |--------------------------------------------------------------------------
    */

  const telemetryRows = await getMapTelemetryRows(vehicleTables, selectedDate);

  const points = [];

  const gvpPoints = [];

  const previousCumulative = new Map();

  /*
    |--------------------------------------------------------------------------
    | PROCESS TELEMETRY
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

    const currentCumulative = Number(row.cumulativeWeight || 0);

    const vehicleKey = `${sourceVehicleTable || "UNKNOWN_TABLE"}::${
      vehicleNumber || "UNKNOWN_VEHICLE"
    }`;

    const previous = previousCumulative.get(vehicleKey);

    const weightDelta =
      previous === undefined ? 0 : Math.max(currentCumulative - previous, 0);

    const unitNumber = row.unitNumber ? String(row.unitNumber).trim() : "";

    const citizenContact = row.citizenContact;

    const isGVP =
      Boolean(unitNumber) &&
      !unitNumber.toUpperCase().includes("UHF") &&
      row.remarks === "O" &&
      (citizenContact === null ||
        citizenContact === undefined ||
        String(citizenContact).trim() === "");

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

      weightDelta: Number(weightDelta.toFixed(3)),

      unitNumber: row.unitNumber || null,

      remarks: row.remarks || null,

      citizenContact: row.citizenContact || null,

      wardNo:
        row.wardNo === null || row.wardNo === undefined
          ? wardNo
          : Number(row.wardNo),

      isGVP,
    };

    points.push(point);

    if (isGVP) {
      gvpPoints.push({
        ...point,

        pointType: "GVP",

        gvpWaste: Number(weightDelta.toFixed(3)),
      });
    }

    previousCumulative.set(vehicleKey, currentCumulative);
  }

  /*
    |--------------------------------------------------------------------------
    | VEHICLE COUNTS
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
    | DIAGNOSTIC
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
    | UNIQUE COLLECTION POINTS
    |--------------------------------------------------------------------------
    */

  const uniqueCollectionPointKeys = new Set(
    points.map(
      (point) =>
        `${Number(point.latitude).toFixed(7)},${Number(point.longitude).toFixed(
          7,
        )}`,
    ),
  );

  const totalCollectionPoints = uniqueCollectionPointKeys.size;

  /*
    |--------------------------------------------------------------------------
    | FINAL RESPONSE
    |--------------------------------------------------------------------------
    */

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

    boundary: boundaryRow?.geo_boundary || null,

    boundaryAvailable: Boolean(boundaryRow?.geo_boundary),

    vehicles,

    points,

    totalPoints: totalCollectionPoints,

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
