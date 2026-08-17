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

  /*
  |--------------------------------------------------------------------------
  | HIERARCHY VALIDATION
  |--------------------------------------------------------------------------
  */

  if (selectedZoneId && !selectedCityId) {
    throw new Error("zoneId requires cityId");
  }

  if (selectedDivisionId && !selectedZoneId) {
    throw new Error("divisionId requires zoneId");
  }

  if (selectedWardId && !selectedDivisionId) {
    throw new Error("wardId requires divisionId");
  }

  /*
  |--------------------------------------------------------------------------
  | NO FILTER
  |--------------------------------------------------------------------------
  */

  if (!selectedCityId) {
    return {
      filtered: false,

      wards: await getAllWardScope(),
    };
  }

  /*
  |--------------------------------------------------------------------------
  | CITY
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | CITY → ZONES
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | ZONE → DIVISION
  |--------------------------------------------------------------------------
  */

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

    /*
    |--------------------------------------------------------------------------
    | DIVISION → WARD
    |--------------------------------------------------------------------------
    */

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

          wardId: Number(ward.ward_id),

          wardNo: ward.ward_no === null ? null : Number(ward.ward_no),

          wardName: ward.ward_name,

          wardTableName: ward.ward_table_name,
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
| GET CITIZENS FROM PHYSICAL WARD TABLE
|--------------------------------------------------------------------------
*/

const getCitizensFromWardTable = async (ward) => {
  if (!ward.wardTableName) {
    return [];
  }

  const table = quoteIdentifier(ward.wardTableName);

  try {
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
            ORDER BY
              "createdAt" DESC,
              id DESC
          `,
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

      wardNo: ward.wardNo,

      wardName: ward.wardName,

      wardTableName: ward.wardTableName,
    }));
  } catch (error) {
    if (error?.code === "42P01") {
      console.warn(
        `Waste Generator: ward table ${ward.wardTableName} does not exist.`,
      );

      return [];
    }

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| SEARCH
|--------------------------------------------------------------------------
*/

const citizenMatchesSearch = (citizen, search) => {
  if (!search) {
    return true;
  }

  const value = search.toLowerCase();

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
      String(field).toLowerCase().includes(value),
  );
};

/*
|--------------------------------------------------------------------------
| DAY TABLE → VEHICLE TABLES
|--------------------------------------------------------------------------
|
| day_DDMMYYYY
|      ↓
| vehicle_number
| vehicle_table_name
| ward_no
|
| ward_no is retained so the telemetry can be
| aggregated ward-wise.
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
    if (error?.code === "42P01") {
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
| wardNo comes from the day table mapping.
| It is attached to every vehicle telemetry
| table before the UNION.
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
                AS "wardNo"

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

              "wardNo"

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
    if (error?.code === "42P01") {
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
| CITIZEN COUNT FOR SELECTED WARDS
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
| SUMMARY KPIs
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

      inactiveWasteGenerators: 0,

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

  const wasteValues = Array.from(citizenWaste.values());

  const averageWaste =
    wasteValues.length > 0 ? totalWasteGenerated / wasteValues.length : 0;

  let aboveAverage = 0;

  let belowAverage = 0;

  for (const value of wasteValues) {
    if (value >= averageWaste) {
      aboveAverage += 1;
    } else {
      belowAverage += 1;
    }
  }

  return {
    totalWasteGenerators,

    activeWasteGenerators,

    inactiveWasteGenerators,

    totalWasteGenerated,

    averageWaste,

    aboveAverage,

    belowAverage,
  };
};

/*
|--------------------------------------------------------------------------
| GVP TREND
|--------------------------------------------------------------------------
|
| GVP CONDITIONS — ALL REQUIRED:
|
| 1. unitNumber must NOT contain "UHF"
| 2. remarks must be exactly "O"
| 3. citizenContact must be empty/null
|
| These conditions are intentionally preserved.
|--------------------------------------------------------------------------
*/

const getGVPTrend = async ({
  date,
  cityId,
  zoneId,
  divisionId,
  wardId,
} = {}) => {
  /*
  |--------------------------------------------------------------------------
  | 1. DATE
  |--------------------------------------------------------------------------
  */

  const { value: selectedDate, date: dateObject } = validateDate(date);

  /*
  |--------------------------------------------------------------------------
  | 2. GEOGRAPHIC SCOPE
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
  | 3. WARD NUMBERS
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
  | 4. VEHICLE TABLES
  |--------------------------------------------------------------------------
  */

  const vehicleTables = await getVehicleTablesForDate(dateObject, wardNos);

  if (vehicleTables.length === 0) {
    return wards.map((ward) => ({
      wardId: ward.wardId,

      wardNo: ward.wardNo,

      wardName: ward.wardName,

      divisionName: ward.divisionName,

      zoneName: ward.zoneName,

      date: selectedDate,

      value: 0,

      gvp: 0,

      color: "#16A34A",
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | 5. TELEMETRY
  |--------------------------------------------------------------------------
  */

  const telemetryRows = await getTelemetryRows(vehicleTables, selectedDate);

  /*
  |--------------------------------------------------------------------------
  | 6. MAP WARD NUMBERS → WARD METADATA
  |--------------------------------------------------------------------------
  */

  const wardMap = new Map();

  for (const ward of wards) {
    wardMap.set(Number(ward.wardNo), ward);
  }

  /*
  |--------------------------------------------------------------------------
  | 7. INITIALIZE EVERY WARD
  |--------------------------------------------------------------------------
  |
  | This guarantees that wards with no GVP
  | telemetry still appear on the graph
  | with value = 0.
  |--------------------------------------------------------------------------
  */

  const wardGVP = new Map();

  for (const ward of wards) {
    wardGVP.set(Number(ward.wardNo), 0);
  }

  /*
  |--------------------------------------------------------------------------
  | 8. PREVIOUS CUMULATIVE PER VEHICLE
  |--------------------------------------------------------------------------
  */

  const previousCumulative = new Map();

  /*
  |--------------------------------------------------------------------------
  | 9. PROCESS TELEMETRY
  |--------------------------------------------------------------------------
  */

  for (const row of telemetryRows) {
    const vehicleNumber = row.vehicleNumber
      ? String(row.vehicleNumber).trim()
      : "";

    if (!vehicleNumber) {
      continue;
    }

    const current = Number(row.cumulativeWeight || 0);

    const previous = previousCumulative.get(vehicleNumber) || 0;

    const actualWaste = Math.max(current - previous, 0);

    /*
    |--------------------------------------------------------------------------
    | GVP CONDITIONS — DO NOT REMOVE
    |--------------------------------------------------------------------------
    */

    const unitNumber = row.unitNumber ? String(row.unitNumber) : "";

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
    | 10. ADD GVP TO THE CORRECT WARD
    |--------------------------------------------------------------------------
    */

    if (isGVP) {
      const wardNo = Number(row.wardNo);

      if (Number.isInteger(wardNo) && wardGVP.has(wardNo)) {
        const existing = wardGVP.get(wardNo) || 0;

        wardGVP.set(wardNo, existing + actualWaste);
      }
    }

    /*
    |--------------------------------------------------------------------------
    | ALWAYS UPDATE PREVIOUS CUMULATIVE
    |--------------------------------------------------------------------------
    */

    previousCumulative.set(vehicleNumber, current);
  }

  /*
  |--------------------------------------------------------------------------
  | 11. RETURN WARD-WISE GVP
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

        value: Number(value.toFixed(2)),

        gvp: Number(value.toFixed(2)),

        color: value >= 6500 ? "#DC2626" : "#16A34A",
      };
    })
    .sort((a, b) => Number(a.wardNo || 0) - Number(b.wardNo || 0));
};

/*
|--------------------------------------------------------------------------
| GET ALL CURRENT WASTE GENERATORS
|--------------------------------------------------------------------------
*/

const getAllWasteGenerators = async (query = {}) => {
  const page = Number(query.page) || 1;

  const limit = Number(query.limit) || 10;

  const safePage = page < 1 ? 1 : page;

  const safeLimit = limit < 1 ? 10 : Math.min(limit, 100);

  const search = normalizeSearch(query.search);

  const wardScope = await getSelectedWardScope({
    cityId: query.cityId,

    zoneId: query.zoneId,

    divisionId: query.divisionId,

    wardId: query.wardId,
  });

  const wards = wardScope.wards || [];

  let citizens = [];

  for (const ward of wards) {
    const rows = await getCitizensFromWardTable(ward);

    citizens.push(...rows);
  }

  if (search) {
    citizens = citizens.filter((citizen) =>
      citizenMatchesSearch(citizen, search),
    );
  }

  citizens.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;

    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    if (dateB !== dateA) {
      return dateB - dateA;
    }

    return Number(b.id || 0) - Number(a.id || 0);
  });

  const total = citizens.length;

  const totalPages = Math.ceil(total / safeLimit);

  const skip = (safePage - 1) * safeLimit;

  const paginated = citizens.slice(skip, skip + safeLimit);

  return {
    wasteGenerators: paginated,

    pagination: {
      page: safePage,

      limit: safeLimit,

      total,

      totalPages,
    },

    filter: {
      cityId: parseId(query.cityId, "cityId"),

      zoneId: parseId(query.zoneId, "zoneId"),

      divisionId: parseId(query.divisionId, "divisionId"),

      wardId: parseId(query.wardId, "wardId"),
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
