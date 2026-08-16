const { PrismaClient: HelperClient } = require("../generated/helper");
const { PrismaClient: SewacClient } = require("../generated/sewac");

const prisma = new HelperClient();
const sewacPrisma = new SewacClient();

const masterCitizenPrisma = require("../config/masterCitizenPrisma");
const telemetryDb = require("../config/telemetryDb");

const logEdit = require("../utils/editLogger");

/*
|--------------------------------------------------------------------------
| SAFE IDENTIFIER
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

  /*
   * Make sure JS did not silently
   * normalize an invalid date.
   */

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
|
| 2026-08-16
|      ↓
| day_16082026
|
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
| ALL WARD SCOPE
|--------------------------------------------------------------------------
|
| masterCitizenPrisma
|
| city_table
|     ↓
| city dynamic table
|     ↓
| zone dynamic table
|     ↓
| division dynamic table
|     ↓
| ward rows
|
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
   * No geographic filter.
   */

  if (!selectedCityId) {
    return {
      filtered: false,
      wards: await getAllWardScope(),
    };
  }

  /*
   * City
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
   * City → Zones
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

  for (const zone of zones) {
    if (!zone.zone_table_name) {
      continue;
    }

    const zoneTable = quoteIdentifier(zone.zone_table_name);

    /*
     * Zone → Divisions
     */

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

      /*
       * Division → Wards
       */

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
| VEHICLE TABLES FOR DATE
|--------------------------------------------------------------------------
|
| day_DDMMYYYY
|      ↓
| vehicle_number
| vehicle_table_name
| ward_no
|
|--------------------------------------------------------------------------
*/

const getVehicleTablesForDate = async (date, wardNos = null) => {
  const dayTable = getDayTableName(date);

  const dayIdentifier = quoteIdentifier(dayTable);

  /*
   * If a geographic filter was
   * supplied but contains no wards,
   * there is no telemetry.
   */

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

    return rows
      .filter(
        (row) =>
          row.vehicle_table_name &&
          typeof row.vehicle_table_name === "string" &&
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
    /*
     * No day table for selected date.
     *
     * This is NOT a server error.
     */

    if (error?.code === "42P01") {
      console.warn(
        `Waste Generator: telemetry day table ${dayTable} does not exist.`,
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
  if (!vehicleTables.length) {
    return null;
  }

  return vehicleTables
    .filter(
      ({ vehicleTableName }) =>
        vehicleTableName &&
        typeof vehicleTableName === "string" &&
        IDENTIFIER_REGEX.test(vehicleTableName),
    )
    .map(({ vehicleTableName }) => {
      const table = quoteIdentifier(vehicleTableName);

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

              vehiclenumber,

              remarks

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

            vehiclenumber
              AS "vehicleNumber",

            remarks

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
        `,
    selectedDate,
  );

  return result;
};

/*
|--------------------------------------------------------------------------
| CITIZEN COUNT FOR SELECTED WARDS
|--------------------------------------------------------------------------
|
| The new hierarchy owns ward membership.
|
| Therefore:
|
| ward_table_name
|       ↓
| COUNT(*)
|
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
                COUNT(*)::bigint AS total
              FROM ${table}
            `,
      );

      total += Number(result?.[0]?.total || 0);
    } catch (error) {
      /*
       * A registered ward without
       * a physical citizen table
       * contributes zero.
       */

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
| WASTE GENERATOR KPI SUMMARY
|--------------------------------------------------------------------------
|
| HEADER:
|
| date
| cityId
| zoneId
| divisionId
| wardId
|
|--------------------------------------------------------------------------
*/

const getSummary = async ({ date, cityId, zoneId, divisionId, wardId }) => {
  /*
   * ========================================================
   * 1. DATE
   * ========================================================
   */

  const { value: selectedDate, date: dateObject } = validateDate(date);

  /*
   * ========================================================
   * 2. GEOGRAPHIC SCOPE
   * ========================================================
   */

  const wardScope = await getSelectedWardScope({
    cityId,
    zoneId,
    divisionId,
    wardId,
  });

  const wards = wardScope.wards || [];

  if (wards.length === 0) {
    return {
      activeWasteGenerators: 0,

      inactiveWasteGenerators: 0,

      totalWasteGenerators: 0,

      totalWasteGenerated: 0,

      averageWaste: 0,

      aboveAverage: 0,

      belowAverage: 0,
    };
  }

  /*
   * ========================================================
   * 3. WARD NUMBERS
   * ========================================================
   */

  const wardNos = wards
    .map((ward) => Number(ward.wardNo))
    .filter((wardNo) => Number.isInteger(wardNo));

  if (wardNos.length === 0) {
    return {
      activeWasteGenerators: 0,

      inactiveWasteGenerators: 0,

      totalWasteGenerators: 0,

      totalWasteGenerated: 0,

      averageWaste: 0,

      aboveAverage: 0,

      belowAverage: 0,
    };
  }

  /*
   * ========================================================
   * 4. TOTAL REGISTERED WASTE GENERATORS
   * ========================================================
   *
   * This is NOT taken from the old global
   * master_citizen_data table.
   *
   * It comes from the selected physical
   * ward tables.
   */

  const totalWasteGenerators = await getCitizenCountForWards(wards);

  /*
   * ========================================================
   * 5. SELECTED DATE TELEMETRY
   * ========================================================
   */

  const vehicleTables = await getVehicleTablesForDate(dateObject, wardNos);

  /*
   * No day table / no telemetry.
   *
   * Keep the page alive and return zero
   * data instead of throwing.
   */

  if (vehicleTables.length === 0) {
    return {
      activeWasteGenerators: 0,

      inactiveWasteGenerators: 0,

      totalWasteGenerators,

      totalWasteGenerated: 0,

      averageWaste: 0,

      aboveAverage: 0,

      belowAverage: 0,
    };
  }

  const telemetryRows = await getTelemetryRows(vehicleTables, selectedDate);

  /*
   * ========================================================
   * 6. CITIZEN-LEVEL WASTE FOR SELECTED DATE
   * ========================================================
   *
   * Every citizen gets:
   *
   * wet
   * + dry
   * + other
   *
   * Multiple packets for the same citizen
   * are accumulated.
   */

  const citizenWaste = new Map();

  for (const row of telemetryRows) {
    if (
      row.citizenId === null ||
      row.citizenId === undefined ||
      String(row.citizenId).trim() === ""
    ) {
      continue;
    }

    const citizenId = String(row.citizenId).trim();

    const wet = Number(row.wetWeight || 0);

    const dry = Number(row.dryWeight || 0);

    const other = Number(row.otherWeight || 0);

    const waste = wet + dry + other;

    const existing = citizenWaste.get(citizenId) || 0;

    citizenWaste.set(citizenId, existing + waste);
  }

  /*
   * ========================================================
   * 7. TOTAL WASTE GENERATED
   * ========================================================
   */

  let totalWasteGenerated = 0;

  for (const waste of citizenWaste.values()) {
    totalWasteGenerated += waste;
  }

  /*
   * ========================================================
   * 8. ACTIVE GENERATORS
   * ========================================================
   *
   * Existing Waste Generator rule:
   *
   * active if telemetry exists
   * within the last 4 calendar days.
   *
   * Selected date + previous 3 days.
   */

  const activeCitizenIds = new Set();

  /*
   * Selected date already has
   * telemetry in citizenWaste.
   */

  for (const citizenId of citizenWaste.keys()) {
    activeCitizenIds.add(citizenId);
  }

  /*
   * Previous three calendar days.
   */

  for (let offset = 1; offset <= 3; offset++) {
    const previousDate = new Date(dateObject);

    previousDate.setDate(previousDate.getDate() - offset);

    let previousVehicleTables = [];

    try {
      previousVehicleTables = await getVehicleTablesForDate(
        previousDate,
        wardNos,
      );
    } catch (error) {
      console.warn(
        "Waste Generator: unable to resolve previous day telemetry:",
        error.message,
      );

      continue;
    }

    if (previousVehicleTables.length === 0) {
      continue;
    }

    const previousDateString = previousDate.toISOString().split("T")[0];

    let previousTelemetryRows = [];

    try {
      previousTelemetryRows = await getTelemetryRows(
        previousVehicleTables,
        previousDateString,
      );
    } catch (error) {
      console.warn(
        "Waste Generator: unable to read previous day telemetry:",
        error.message,
      );

      continue;
    }

    for (const row of previousTelemetryRows) {
      if (row.citizenId === null || row.citizenId === undefined) {
        continue;
      }

      const citizenId = String(row.citizenId).trim();

      if (citizenId) {
        activeCitizenIds.add(citizenId);
      }
    }
  }

  /*
   * ========================================================
   * 9. ACTIVE COUNT
   * ========================================================
   *
   * We cannot allow active telemetry
   * to increase the generator count
   * beyond the registered generator count.
   */

  const activeWasteGenerators = Math.min(
    activeCitizenIds.size,
    totalWasteGenerators,
  );

  /*
   * ========================================================
   * 10. INACTIVE COUNT
   * ========================================================
   */

  const inactiveWasteGenerators = Math.max(
    totalWasteGenerators - activeWasteGenerators,
    0,
  );

  /*
   * ========================================================
   * 11. AVERAGE WASTE
   * ========================================================
   *
   * Average is calculated among
   * generators that actually have
   * waste telemetry for the selected date.
   *
   * This preserves the meaningful
   * waste average rather than dividing
   * by citizens with zero data.
   */

  const wasteValues = Array.from(citizenWaste.values());

  const averageWaste =
    wasteValues.length > 0 ? totalWasteGenerated / wasteValues.length : 0;

  /*
   * ========================================================
   * 12. ABOVE / BELOW AVERAGE
   * ========================================================
   */

  let aboveAverage = 0;

  let belowAverage = 0;

  for (const value of wasteValues) {
    if (value >= averageWaste) {
      aboveAverage += 1;
    } else {
      belowAverage += 1;
    }
  }

  /*
   * ========================================================
   * 13. FINAL RESPONSE
   * ========================================================
   *
   * Keep EXACTLY the fields expected by
   * WasteGenKPIs.jsx.
   */

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
| WASTE GENERATOR DIRECTORY
|--------------------------------------------------------------------------
|
| EXISTING CRUD/DIRECTORY LOGIC PRESERVED
|
|--------------------------------------------------------------------------
*/

const getAllWasteGenerators = async (query) => {
  const page = Number(query.page) || 1;

  const limit = Number(query.limit) || 10;

  const skip = (page - 1) * limit;

  const search = query.search || "";

  const where = search
    ? {
        OR: [
          {
            phoneNumber: {
              contains: search,

              mode: "insensitive",
            },
          },

          {
            personName: {
              contains: search,

              mode: "insensitive",
            },
          },

          {
            wetRFID: {
              contains: search,

              mode: "insensitive",
            },
          },

          {
            dryRFID: {
              contains: search,

              mode: "insensitive",
            },
          },

          {
            area: {
              contains: search,

              mode: "insensitive",
            },
          },

          {
            ward: {
              contains: search,

              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  const wasteGenerators = await prisma.master_citizen_data.findMany({
    where,

    skip,

    take: limit,

    orderBy: {
      createdAt: "desc",
    },
  });

  const citizenIds = wasteGenerators.map((c) => c.id);

  const telemetry = await sewacPrisma.telemetry_logs.groupBy({
    by: ["citizen_id"],

    where: {
      citizen_id: {
        in: citizenIds,
      },
    },

    _sum: {
      cumulative_weight_kg: true,
    },

    _max: {
      received_at: true,
    },
  });

  const collectionDays = await sewacPrisma.telemetry_logs.findMany({
    where: {
      citizen_id: {
        in: citizenIds,
      },
    },

    select: {
      citizen_id: true,

      received_at: true,
    },
  });

  const telemetryMap = new Map();

  telemetry.forEach((t) => {
    telemetryMap.set(t.citizen_id, t);
  });

  const dayMap = new Map();

  collectionDays.forEach((row) => {
    if (!row.received_at) {
      return;
    }

    const day = row.received_at.toISOString().split("T")[0];

    if (!dayMap.has(row.citizen_id)) {
      dayMap.set(row.citizen_id, new Set());
    }

    dayMap.get(row.citizen_id).add(day);
  });

  const total = await prisma.master_citizen_data.count({
    where,
  });

  const enriched = wasteGenerators.map((citizen) => {
    const tele = telemetryMap.get(citizen.id);

    const totalWaste = Number(tele?._sum?.cumulative_weight_kg || 0);

    const totalDays = dayMap.get(citizen.id)?.size || 0;

    const averageWaste = totalDays === 0 ? 0 : totalWaste / totalDays;

    const lastCollection = tele?._max?.received_at || null;

    let status = "Inactive";

    if (lastCollection) {
      const diff =
        (Date.now() - new Date(lastCollection)) / (1000 * 60 * 60 * 24);

      if (diff <= 4) {
        status = "Active";
      }
    }

    return {
      ...citizen,

      totalWasteGenerated: totalWaste,

      averageWaste,

      lastCollection,

      status,
    };
  });

  return {
    wasteGenerators: enriched,

    pagination: {
      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),
    },
  };
};

/*
|--------------------------------------------------------------------------
| GET BY PHONE
|--------------------------------------------------------------------------
*/

const getWasteGeneratorByPhone = async (phoneNumber) => {
  const wasteGenerator = await prisma.master_citizen_data.findUnique({
    where: {
      phoneNumber,
    },
  });

  if (!wasteGenerator) {
    throw new Error("Waste Generator not found");
  }

  return wasteGenerator;
};

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

const createWasteGenerator = async (body, req) => {
  const existing = await prisma.master_citizen_data.findUnique({
    where: {
      phoneNumber: body.phoneNumber,
    },
  });

  if (existing) {
    throw new Error("Waste Generator already exists");
  }

  const created = await prisma.master_citizen_data.create({
    data: {
      ...body,

      updatedAt: new Date(),
    },
  });

  await logEdit({
    user: req.user,

    req,

    module: "Waste Generators",

    action: "CREATE",

    recordId: created.phoneNumber,

    description: `Created Waste Generator ${created.personName}`,
  });

  return created;
};

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

const updateWasteGenerator = async (phoneNumber, body, req) => {
  const existing = await prisma.master_citizen_data.findUnique({
    where: {
      phoneNumber,
    },
  });

  if (!existing) {
    throw new Error("Waste Generator not found");
  }

  const updated = await prisma.master_citizen_data.update({
    where: {
      phoneNumber,
    },

    data: {
      ...body,

      updatedAt: new Date(),
    },
  });

  await logEdit({
    user: req.user,

    req,

    module: "Waste Generators",

    action: "UPDATE",

    recordId: updated.phoneNumber,

    description: `Updated Waste Generator ${updated.personName}`,
  });

  return updated;
};

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

const deleteWasteGenerator = async (phoneNumber, req) => {
  const existing = await prisma.master_citizen_data.findUnique({
    where: {
      phoneNumber,
    },
  });

  if (!existing) {
    throw new Error("Waste Generator not found");
  }

  await prisma.master_citizen_data.delete({
    where: {
      phoneNumber,
    },
  });

  await logEdit({
    user: req.user,

    req,

    module: "Waste Generators",

    action: "DELETE",

    recordId: existing.phoneNumber,

    description: `Deleted Waste Generator ${existing.personName}`,
  });

  return {
    message: "Waste Generator deleted successfully",
  };
};

/*
|--------------------------------------------------------------------------
| GVP TREND
|--------------------------------------------------------------------------
|
| PRESERVED FROM OLD IMPLEMENTATION.
|
|--------------------------------------------------------------------------
*/

const getGVPTrend = async () => {
  const logs = await sewacPrisma.telemetry_logs.findMany({
    orderBy: [
      {
        iot_timestamp: "asc",
      },

      {
        id: "asc",
      },
    ],
  });

  let previousCumulative = 0;

  let currentDay = null;

  const trend = {};

  for (const log of logs) {
    const day = new Date(log.iot_timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",

      month: "short",
    });

    /*
     * Reset cumulative at
     * start of new day.
     */

    if (currentDay !== day) {
      currentDay = day;

      previousCumulative = 0;
    }

    const current = Number(log.cumulative_weight_kg || 0);

    const actualWaste = current - previousCumulative;

    previousCumulative = current;

    const isGVP =
      log.unit_number &&
      !log.unit_number.includes("UHF") &&
      log.remarks === "O" &&
      log.citizen_contact === null;

    if (!isGVP) {
      continue;
    }

    trend[day] = (trend[day] || 0) + actualWaste;
  }

  return Object.entries(trend).map(([date, value]) => ({
    date,

    value: Number(value.toFixed(2)),

    color: value >= 6500 ? "#DC2626" : "#16A34A",
  }));
};

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  getSummary,

  getGVPTrend,

  getAllWasteGenerators,

  getWasteGeneratorByPhone,

  createWasteGenerator,

  updateWasteGenerator,

  deleteWasteGenerator,
};
