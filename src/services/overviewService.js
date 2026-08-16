const helperDb = require("../config/helperDb");
const mainDb = require("../config/mainDb");
const telemetryDb = require("../config/telemetryDb");
const masterCitizenPrisma = require("../config/masterCitizenPrisma");

const IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;

const quoteIdentifier = (identifier) => {
  if (typeof identifier !== "string" || !IDENTIFIER_REGEX.test(identifier)) {
    throw new Error(`Unsafe database identifier: ${identifier}`);
  }

  return `"${identifier.replace(/"/g, '""')}"`;
};

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

const validateDate = (date) => {
  const selectedDate = date || new Date().toISOString().split("T")[0];

  if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
    throw new Error("date must be in YYYY-MM-DD format");
  }

  const parsed = new Date(`${selectedDate}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
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
| GEOGRAPHIC HIERARCHY
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

    const zones = await masterCitizenPrisma.$queryRawUnsafe(`
        SELECT
          zone_id,
          zone_name,
          zone_table_name
        FROM ${cityTable}
        ORDER BY zone_id ASC
      `);

    for (const zone of zones) {
      if (!zone.zone_table_name) {
        continue;
      }

      const zoneTable = quoteIdentifier(zone.zone_table_name);

      const divisions = await masterCitizenPrisma.$queryRawUnsafe(`
          SELECT
            division_id,
            division_name,
            division_table_name
          FROM ${zoneTable}
          ORDER BY division_id ASC
        `);

      for (const division of divisions) {
        if (!division.division_table_name) {
          continue;
        }

        const divisionTable = quoteIdentifier(division.division_table_name);

        const wardRows = await masterCitizenPrisma.$queryRawUnsafe(`
            SELECT
              ward_id,
              ward_no,
              ward_name,
              ward_table_name
            FROM ${divisionTable}
            ORDER BY ward_no ASC
          `);

        for (const ward of wardRows) {
          wards.push({
            cityId: Number(city.city_id),

            cityName: city.city_name,

            zoneId: Number(zone.zone_id),

            zoneName: zone.zone_name,

            divisionId: Number(division.division_id),

            divisionName: division.division_name,

            wardId: Number(ward.ward_id),

            wardNo: Number(ward.ward_no),

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

          wardNo: Number(ward.ward_no),

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
| DAY TABLE → VEHICLE TABLES
|--------------------------------------------------------------------------
|
| vehicle_master.vehicle_id
|          ↕
| day_table.vehicle_number
|          ↕
| telemetry_table.vehiclenumber
|
*/

const getVehicleTablesForDate = async (date, wardNos = null) => {
  const dayTable = getDayTableName(date);

  const dayIdentifier = quoteIdentifier(dayTable);

  /*
   * No wards = no telemetry.
   */

  if (Array.isArray(wardNos) && wardNos.length === 0) {
    return [];
  }

  let rows;

  /*
   * Filter by ward numbers.
   */

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
          ORDER BY vehicle_number ASC
        `,
      wardNos,
    );
  } else {
    /*
     * No ward filter.
     */

    rows = await telemetryDb.$queryRawUnsafe(`
        SELECT
          vehicle_number,
          vehicle_table_name,
          ward_no
        FROM ${dayIdentifier}
        ORDER BY vehicle_number ASC
      `);
  }

  return rows.map((row) => ({
    vehicleNumber:
      row.vehicle_number === null || row.vehicle_number === undefined
        ? null
        : String(row.vehicle_number).trim(),

    vehicleTableName: row.vehicle_table_name,

    wardNo: row.ward_no === null ? null : Number(row.ward_no),
  }));
};

/*
|--------------------------------------------------------------------------
| DYNAMIC TELEMETRY UNION
|--------------------------------------------------------------------------
*/

const buildTelemetryUnion = (vehicleTables) => {
  if (!vehicleTables.length) {
    return null;
  }

  return vehicleTables
    .filter(
      ({ vehicleTableName }) =>
        vehicleTableName && typeof vehicleTableName === "string",
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
| TELEMETRY QUERY
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
| TOTAL CITIZENS
|--------------------------------------------------------------------------
*/

const getTotalCitizens = async () => {
  const result = await helperDb.query(`
        SELECT COUNT(*) AS total
        FROM master_citizen_data
      `);

  return Number(result.rows[0].total);
};

/*
|--------------------------------------------------------------------------
| SUMMARY
|--------------------------------------------------------------------------
*/

const getSummary = async (date, cityId, zoneId, divisionId, wardId) => {
  const { value: selectedDate, date: dateObject } = validateDate(date);

  const wardScope = await getSelectedWardScope({
    cityId,
    zoneId,
    divisionId,
    wardId,
  });

  const wardNos = wardScope.wards.map((ward) => ward.wardNo);

  const [totalCitizens, vehicleTables] = await Promise.all([
    getTotalCitizens(),

    getVehicleTablesForDate(dateObject, wardScope.filtered ? wardNos : null),
  ]);

  const telemetryRows = await getTelemetryRows(vehicleTables, selectedDate);

  /*
   * Wet + dry + other
   */

  const totalWasteCollected = telemetryRows.reduce(
    (total, row) =>
      total +
      Number(row.wetWeight || 0) +
      Number(row.dryWeight || 0) +
      Number(row.otherWeight || 0),
    0,
  );

  /*
   * Distinct collection points
   */

  const collectionPoints = new Set(
    telemetryRows
      .filter(
        (row) =>
          row.latitude !== null &&
          row.latitude !== undefined &&
          row.longitude !== null &&
          row.longitude !== undefined,
      )
      .map((row) => `${row.latitude},${row.longitude}`),
  ).size;

  /*
   * Distinct citizens who gave trash
   */

  const trashGiven = new Set(
    telemetryRows
      .filter(
        (row) =>
          row.citizenId !== null &&
          row.citizenId !== undefined &&
          (row.remarks === null || row.remarks !== "O"),
      )
      .map((row) => String(row.citizenId)),
  ).size;

  const notGiven = Math.max(totalCitizens - trashGiven, 0);

  return {
    totalWasteCollected,

    collectionPoints,

    totalCitizens,

    trashGiven,

    notGiven,
  };
};

/*
|--------------------------------------------------------------------------
| LIVE VEHICLE SUMMARY
|--------------------------------------------------------------------------
|
| HEADER FILTERS:
|
| cityId
| zoneId
| divisionId
| wardId
|
| VEHICLE SCOPE:
|
| vehicle_master.ward_no
|
| VEHICLE ID:
|
| vehicle_master.vehicle_id
|          ↕
| telemetry.vehiclenumber
|
| LIVE STATUS:
|
| latest receivedtimestamp <= 30 minutes
|                         ↓
|                      ACTIVE
|
| latest receivedtimestamp > 30 minutes
|                         ↓
|                     INACTIVE
|
| no packet
|                         ↓
|                     INACTIVE
|
| vehicle_master.status is NOT used.
|
*/

const VEHICLE_INACTIVITY_MINUTES = 30;

const getVehicleSummary = async (cityId, zoneId, divisionId, wardId) => {
  /*
   * =========================================================
   * 1. RESOLVE HEADER FILTERS
   * =========================================================
   */

  const selectedCityId = parseId(cityId, "cityId");

  const selectedZoneId = parseId(zoneId, "zoneId");

  const selectedDivisionId = parseId(divisionId, "divisionId");

  const selectedWardId = parseId(wardId, "wardId");

  /*
   * =========================================================
   * 2. FIND THE WARDS IN THE SELECTED SCOPE
   * =========================================================
   */

  let wardNos = null;

  if (selectedCityId) {
    const scope = await getSelectedWardScope({
      cityId: selectedCityId,

      zoneId: selectedZoneId,

      divisionId: selectedDivisionId,

      wardId: selectedWardId,
    });

    wardNos = scope.wards
      .map((ward) => Number(ward.wardNo))
      .filter((wardNo) => Number.isInteger(wardNo));

    /*
     * Selected scope has no wards.
     */

    if (wardNos.length === 0) {
      return {
        totalVehicles: 0,

        runningVehicles: 0,

        inactiveVehicles: 0,

        vehicleStatus: [],

        inactivityThresholdMinutes: VEHICLE_INACTIVITY_MINUTES,
      };
    }
  }

  /*
   * =========================================================
   * 3. GET REGISTERED VEHICLES
   * =========================================================
   *
   * IMPORTANT:
   *
   * vehicle_master.vehicle_id
   * is the actual vehicle identifier.
   *
   * vehicle_master.ward_no
   * is used for geographic filtering.
   */

  let registeredVehiclesResult;

  if (Array.isArray(wardNos)) {
    registeredVehiclesResult = await mainDb.query(
      `
          SELECT
            id,
            vehicle_id,
            ward_no

          FROM vehicle_master

          WHERE ward_no =
                ANY($1::integer[])

            AND vehicle_id
                IS NOT NULL

            AND TRIM(vehicle_id)
                <> ''

          ORDER BY id ASC
        `,
      [wardNos],
    );
  } else {
    /*
     * No header filter:
     * return all registered vehicles.
     */

    registeredVehiclesResult = await mainDb.query(`
        SELECT
          id,
          vehicle_id,
          ward_no

        FROM vehicle_master

        WHERE vehicle_id
              IS NOT NULL

          AND TRIM(vehicle_id)
              <> ''

        ORDER BY id ASC
      `);
  }

  const registeredVehicles = registeredVehiclesResult.rows
    .map((vehicle) => ({
      id: vehicle.id,

      vehicleId: String(vehicle.vehicle_id).trim(),

      wardNo: vehicle.ward_no === null ? null : Number(vehicle.ward_no),
    }))
    .filter((vehicle) => vehicle.vehicleId);

  const totalVehicles = registeredVehicles.length;

  /*
   * =========================================================
   * 4. 30-MINUTE INACTIVITY LIMIT
   * =========================================================
   */

  const now = new Date();

  const inactivityLimit = new Date(
    now.getTime() - VEHICLE_INACTIVITY_MINUTES * 60 * 1000,
  );

  /*
   * =========================================================
   * 5. TODAY'S TELEMETRY
   * =========================================================
   */

  const today = new Date();

  let todayVehicleTables = [];

  try {
    todayVehicleTables = await getVehicleTablesForDate(today, null);
  } catch (error) {
    console.warn(
      "Vehicle summary: today's telemetry table unavailable:",
      error.message,
    );
  }

  /*
   * =========================================================
   * 6. YESTERDAY'S TELEMETRY
   * =========================================================
   *
   * Needed around midnight.
   */

  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);

  let yesterdayVehicleTables = [];

  try {
    yesterdayVehicleTables = await getVehicleTablesForDate(yesterday, null);
  } catch (error) {
    console.warn(
      "Vehicle summary: yesterday's telemetry table unavailable:",
      error.message,
    );
  }

  /*
   * =========================================================
   * 7. COMBINE TELEMETRY TABLES
   * =========================================================
   */

  const allVehicleTables = [...todayVehicleTables, ...yesterdayVehicleTables];

  const uniqueVehicleTables = Array.from(
    new Map(
      allVehicleTables
        .filter((vehicle) => vehicle.vehicleTableName)
        .map((vehicle) => [vehicle.vehicleTableName, vehicle]),
    ).values(),
  );

  /*
   * =========================================================
   * 8. REGISTERED VEHICLE SET
   * =========================================================
   *
   * This guarantees that telemetry from a vehicle
   * outside the selected geographic scope is ignored.
   */

  const registeredVehicleIds = new Set(
    registeredVehicles.map((vehicle) => vehicle.vehicleId),
  );

  /*
   * =========================================================
   * 9. FIND LATEST PACKET PER REGISTERED VEHICLE
   * =========================================================
   */

  const latestPacketByVehicle = new Map();

  for (const vehicle of uniqueVehicleTables) {
    if (!vehicle.vehicleTableName) {
      continue;
    }

    const table = quoteIdentifier(vehicle.vehicleTableName);

    try {
      const result = await telemetryDb.$queryRawUnsafe(
        `
            SELECT
              vehiclenumber,

              MAX(
                receivedtimestamp
              ) AS "lastReceivedTimestamp"

            FROM ${table}

            WHERE vehiclenumber
                  IS NOT NULL

            GROUP BY
              vehiclenumber
          `,
      );

      for (const row of result) {
        if (!row.vehiclenumber || !row.lastReceivedTimestamp) {
          continue;
        }

        const vehicleNumber = String(row.vehiclenumber).trim();

        /*
         * IMPORTANT:
         *
         * Ignore telemetry belonging to
         * vehicles outside the selected
         * header scope.
         */

        if (!registeredVehicleIds.has(vehicleNumber)) {
          continue;
        }

        const lastReceived = new Date(row.lastReceivedTimestamp);

        if (Number.isNaN(lastReceived.getTime())) {
          continue;
        }

        const existing = latestPacketByVehicle.get(vehicleNumber);

        if (!existing || lastReceived > existing.lastReceivedTimestamp) {
          latestPacketByVehicle.set(vehicleNumber, {
            vehicleNumber,

            lastReceivedTimestamp: lastReceived,
          });
        }
      }
    } catch (error) {
      console.warn(
        `Vehicle summary: unable to inspect ${vehicle.vehicleTableName}:`,
        error.message,
      );
    }
  }

  /*
   * =========================================================
   * 10. ACTIVE / INACTIVE
   * =========================================================
   */

  let runningVehicles = 0;

  const vehicleStatus = [];

  for (const vehicle of registeredVehicles) {
    const latest = latestPacketByVehicle.get(vehicle.vehicleId);

    /*
     * Vehicle has never sent a packet.
     */

    if (!latest) {
      vehicleStatus.push({
        vehicleId: vehicle.vehicleId,

        wardNo: vehicle.wardNo,

        status: "INACTIVE",

        lastReceivedTimestamp: null,
      });

      continue;
    }

    /*
     * Vehicle is active only if the
     * latest packet was received within
     * the previous 30 minutes.
     */

    const isActive = latest.lastReceivedTimestamp >= inactivityLimit;

    if (isActive) {
      runningVehicles += 1;
    }

    vehicleStatus.push({
      vehicleId: vehicle.vehicleId,

      wardNo: vehicle.wardNo,

      status: isActive ? "ACTIVE" : "INACTIVE",

      lastReceivedTimestamp: latest.lastReceivedTimestamp,
    });
  }

  /*
   * =========================================================
   * 11. FINAL COUNTS
   * =========================================================
   */

  const inactiveVehicles = Math.max(totalVehicles - runningVehicles, 0);

  return {
    totalVehicles,

    runningVehicles,

    inactiveVehicles,

    vehicleStatus,

    inactivityThresholdMinutes: VEHICLE_INACTIVITY_MINUTES,
  };
};

/*
|--------------------------------------------------------------------------
| GENERATION TREND
|--------------------------------------------------------------------------
|
| One point per ward.
|
| Selected division:
|
| Division
|   ↓
| all wards
|   ↓
| telemetry
|   ↓
| waste generated
|
| Backend returns KG.
| Frontend converts KG → tons.
|
*/

const getGenerationTrend = async (date, cityId, zoneId, divisionId, wardId) => {
  const { value: selectedDate, date: dateObject } = validateDate(date);

  /*
   * The graph is division-wise.
   *
   * The selected ward does not reduce
   * the graph to one point.
   */

  const wardScope = await getSelectedWardScope({
    cityId,
    zoneId,
    divisionId,

    wardId: null,
  });

  if (!wardScope.wards.length) {
    return [];
  }

  const results = [];

  for (const ward of wardScope.wards) {
    const vehicleTables = await getVehicleTablesForDate(dateObject, [
      ward.wardNo,
    ]);

    const telemetryRows = await getTelemetryRows(vehicleTables, selectedDate);

    const wasteGenerated = telemetryRows.reduce(
      (total, row) =>
        total +
        Number(row.wetWeight || 0) +
        Number(row.dryWeight || 0) +
        Number(row.otherWeight || 0),
      0,
    );

    results.push({
      wardName: ward.wardName,

      wardNo: ward.wardNo,

      wardId: ward.wardId,

      cityId: ward.cityId,

      cityName: ward.cityName,

      zoneId: ward.zoneId,

      zoneName: ward.zoneName,

      divisionId: ward.divisionId,

      divisionName: ward.divisionName,

      /*
       * Backend returns KG.
       * Frontend converts to tons.
       */

      wasteGenerated,

      threshold: 5000,
    });
  }

  return results.sort((a, b) => Number(a.wardNo) - Number(b.wardNo));
};

/*
|--------------------------------------------------------------------------
| MAP
|--------------------------------------------------------------------------
*/

const getMapData = async () => {
  return {
    defaultView: "route-map",
  };
};

/*
|--------------------------------------------------------------------------
| LEGACY OVERVIEW FILTERS
|--------------------------------------------------------------------------
*/

const getOverviewFilters = async () => {
  const citiesResult = await helperDb.query(`
        SELECT DISTINCT city
        FROM master_citizen_data
        WHERE city IS NOT NULL
        ORDER BY city
      `);

  const wardsResult = await helperDb.query(`
        SELECT DISTINCT ward
        FROM master_citizen_data
        WHERE ward IS NOT NULL
        ORDER BY ward
      `);

  return {
    cities: citiesResult.rows.map((row) => row.city),

    wards: wardsResult.rows.map((row) => row.ward),
  };
};

module.exports = {
  getSummary,
  getVehicleSummary,
  getGenerationTrend,
  getMapData,
  getOverviewFilters,
};
