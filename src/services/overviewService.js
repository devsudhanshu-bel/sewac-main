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
|
| 2026-08-15
|      ↓
| day_15082026
|
| The ingestion architecture creates this table using the received date.
| Therefore Overview resolves the partition using the same convention.
|
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
|
| city_table
|      ↓
| city dynamic table
|      ↓
| zone dynamic table
|      ↓
| division dynamic table
|      ↓
| ward rows
|
| Only ward_no eventually reaches the telemetry side.
|
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
   * City → zones
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
     * Zone → selected division(s)
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
       * Division → selected ward(s)
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
*/

const getVehicleTablesForDate = async (date, wardNos = null) => {
  const dayTable = getDayTableName(date);

  const dayIdentifier = quoteIdentifier(dayTable);

  /*
   * If a geographic filter was supplied but no wards
   * belong to it, there is simply no telemetry.
   */
  if (Array.isArray(wardNos) && wardNos.length === 0) {
    return [];
  }

  let rows;

  if (Array.isArray(wardNos)) {
    rows = await telemetryDb.$queryRawUnsafe(
      `
          SELECT
            vehicle_id,
            vehicle_table_name,
            ward_no
          FROM ${dayIdentifier}
          WHERE ward_no = ANY($1::integer[])
          ORDER BY vehicle_number ASC
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
          ORDER BY vehicle_number ASC
        `,
    );
  }

  return rows.map((row) => ({
    vehicleNumber: row.vehicle_number,

    vehicleTableName: row.vehicle_table_name,

    wardNo: row.ward_no === null ? null : Number(row.ward_no),
  }));
};

/*
|--------------------------------------------------------------------------
| DYNAMIC TELEMETRY UNION
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| vehicle_table_name values come from the trusted day table.
| They are NOT taken directly from req.query.
|
*/

const buildTelemetryUnion = (vehicleTables) => {
  if (!vehicleTables.length) {
    return null;
  }

  return vehicleTables
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

  /*
   * The physical vehicle table is partitioned by
   * receivedTimestamp.
   *
   * We resolve the table using that partition date,
   * but preserve the existing Overview semantics by
   * applying the original iotTimestamp date filter
   * inside the selected vehicle tables.
   */
  const result = await telemetryDb.$queryRawUnsafe(
    `
        SELECT
          id,
          iottimestamp AS "iotTimestamp",
          receivedtimestamp AS "receivedTimestamp",
          citizenid AS "citizenId",
          latitude,
          longitude,
          wetweight AS "wetWeight",
          dryweight AS "dryWeight",
          otherweight AS "otherWeight",
          vehiclenumber AS "vehicleNumber",
          remarks
        FROM (
          ${unionSql}
        ) telemetry
        WHERE iottimestamp >= $1::date
          AND iottimestamp <
              ($1::date + INTERVAL '1 day')
      `,
    selectedDate,
  );

  return result;
};

/*
|--------------------------------------------------------------------------
| TOTAL CITIZENS
|--------------------------------------------------------------------------
|
| Keep the existing business definition here.
|
| The old Overview counted master_citizen_data globally.
| We therefore preserve that contract instead of inventing
| a new citizen-counting rule.
|
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
   * Existing business definition:
   *
   * wet + dry + other
   */
  const totalWasteCollected = telemetryRows.reduce((total, row) => {
    return (
      total +
      Number(row.wetWeight || 0) +
      Number(row.dryWeight || 0) +
      Number(row.otherWeight || 0)
    );
  }, 0);

  /*
   * Existing business definition:
   * distinct latitude + longitude.
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
   * Existing business definition:
   *
   * distinct citizen_id
   * where remarks != 'O'
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
| VEHICLE SUMMARY
|--------------------------------------------------------------------------
|
| This remains on vehicle_master.
|
*/

/*
|--------------------------------------------------------------------------
| LIVE VEHICLE SUMMARY
|--------------------------------------------------------------------------
|
| Vehicle status is determined from TELEMETRY, NOT from
| vehicle_master.status.
|
| ACTIVE:
|   Vehicle has received a telemetry packet within the
|   last 30 minutes.
|
| INACTIVE:
|   Vehicle has not sent a packet for more than 30 minutes,
|   or has never sent a packet.
|
| IMPORTANT:
|   We use receivedTimestamp because this represents when
|   SEWAC actually received the packet.
|
*/

const VEHICLE_INACTIVITY_MINUTES = 30;

const getVehicleSummary = async () => {
  /*
   * =========================================================
   * 1. TOTAL REGISTERED VEHICLES
   * =========================================================
   */

  const totalVehiclesResult = await mainDb.query(`
    SELECT COUNT(*) AS total
    FROM vehicle_master
  `);

  const totalVehicles = Number(totalVehiclesResult.rows[0].total || 0);

  /*
   * =========================================================
   * 2. CURRENT TIME
   * =========================================================
   *
   * We use the backend/server time for the liveness decision.
   */

  const now = new Date();

  /*
   * Vehicle is active only if the last packet was received
   * within the previous 30 minutes.
   */

  const inactivityLimit = new Date(
    now.getTime() - VEHICLE_INACTIVITY_MINUTES * 60 * 1000,
  );

  /*
   * =========================================================
   * 3. CHECK TODAY'S TELEMETRY TABLE
   * =========================================================
   *
   * The current day table tells us which dynamic vehicle
   * tables currently exist.
   */

  const today = new Date();

  const todayVehicleTables = await getVehicleTablesForDate(today, null);

  /*
   * =========================================================
   * 4. CHECK YESTERDAY TOO
   * =========================================================
   *
   * This handles the midnight boundary.
   *
   * Example:
   *
   * packet received:
   *   23:58 yesterday
   *
   * current time:
   *   00:10 today
   *
   * The vehicle has been inactive for only 12 minutes,
   * so it must still be ACTIVE.
   */

  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);

  let yesterdayVehicleTables = [];

  try {
    yesterdayVehicleTables = await getVehicleTablesForDate(yesterday, null);
  } catch (error) {
    /*
     * If yesterday's partition does not exist,
     * that simply means there is no older telemetry
     * available from that partition.
     *
     * Do not fail the entire Overview API.
     */

    console.warn(
      "Vehicle summary: yesterday telemetry table unavailable:",
      error.message,
    );

    yesterdayVehicleTables = [];
  }

  /*
   * =========================================================
   * 5. COMBINE VEHICLE TABLES
   * =========================================================
   */

  const allVehicleTables = [...todayVehicleTables, ...yesterdayVehicleTables];

  /*
   * Remove duplicate physical vehicle tables.
   */

  const uniqueVehicleTables = Array.from(
    new Map(
      allVehicleTables.map((vehicle) => [vehicle.vehicleTableName, vehicle]),
    ).values(),
  );

  /*
   * =========================================================
   * 6. FIND LATEST RECEIVED PACKET PER VEHICLE
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
              MAX(receivedtimestamp) AS "lastReceivedTimestamp"
            FROM ${table}
            WHERE vehiclenumber IS NOT NULL
            GROUP BY vehiclenumber
          `,
      );

      for (const row of result) {
        if (!row.vehiclenumber || !row.lastReceivedTimestamp) {
          continue;
        }

        const vehicleNumber = String(row.vehiclenumber).trim();

        const lastReceived = new Date(row.lastReceivedTimestamp);

        if (Number.isNaN(lastReceived.getTime())) {
          continue;
        }

        const existing = latestPacketByVehicle.get(vehicleNumber);

        /*
         * Keep only the newest packet.
         */

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
   * 7. GET REGISTERED VEHICLE NUMBERS
   * =========================================================
   *
   * This prevents an unregistered telemetry vehicle from
   * being counted as an active registered vehicle.
   *
   * We intentionally don't depend on vehicle_master.status.
   */

  const registeredVehiclesResult = await mainDb.query(`
  SELECT
    vehicle_id
  FROM vehicle_master
  WHERE vehicle_id IS NOT NULL
`);

  /*
   * Normalize vehicle numbers so comparisons are reliable.
   */

  const registeredVehicles = registeredVehiclesResult.rows
    .map((vehicle) => ({
      vehicleId: String(vehicle.vehicle_id).trim(),
    }))
    .filter((vehicle) => vehicle.vehicleId);

  /*
   * =========================================================
   * 8. DETERMINE ACTIVE / INACTIVE
   * =========================================================
   */

  let runningVehicles = 0;

  const vehicleStatus = [];

  for (const vehicle of registeredVehicles) {
    const latest = latestPacketByVehicle.get(vehicle.vehicleId);

    if (!latest) {
      vehicleStatus.push({
        vehicleId: vehicle.vehicleId,
        status: "INACTIVE",
        lastReceivedTimestamp: null,
      });

      continue;
    }

    const isActive = latest.lastReceivedTimestamp >= inactivityLimit;

    if (isActive) {
      runningVehicles += 1;
    }

    vehicleStatus.push({
      vehicleId: vehicle.vehicleId,

      status: isActive ? "ACTIVE" : "INACTIVE",

      lastReceivedTimestamp: latest.lastReceivedTimestamp,
    });
  }

  /*
   * =========================================================
   * 9. FINAL COUNTS
   * =========================================================
   */

  const inactiveVehicles = Math.max(totalVehicles - runningVehicles, 0);

  return {
    totalVehicles,

    runningVehicles,

    inactiveVehicles,

    /*
     * Keep this available for future vehicle page usage.
     *
     * The existing Overview UI does not need to use it yet.
     */
    vehicleStatus,

    inactivityThresholdMinutes: VEHICLE_INACTIVITY_MINUTES,
  };
};

/*
|--------------------------------------------------------------------------
| GENERATION TREND
|--------------------------------------------------------------------------
|
| The old implementation grouped telemetry_logs by
| vehicle_master.zone.
|
| The new implementation groups the resolved ward scope
| by zone and then reads the relevant vehicle telemetry
| tables.
|
*/

const getGenerationTrend = async (date, cityId, zoneId, divisionId, wardId) => {
  const { value: selectedDate, date: dateObject } = validateDate(date);

  /*
   * =========================================================
   * IMPORTANT
   * =========================================================
   *
   * The KPI cards use wardId directly.
   *
   * The generation graph is different:
   *
   * selected Division
   *       ↓
   * all wards inside that Division
   *       ↓
   * each ward_no
   *       ↓
   * day_DDMMYYYY
   *       ↓
   * vehicle tables
   *       ↓
   * telemetry
   *
   * Therefore wardId is intentionally NOT used to restrict
   * the graph to a single ward.
   *
   * It is only the currently selected ward in the Header.
   */

  const wardScope = await getSelectedWardScope({
    cityId,
    zoneId,
    divisionId,
    /*
     * IMPORTANT:
     * Do not pass wardId here.
     *
     * We want ALL wards in the selected division.
     */
    wardId: null,
  });

  /*
   * No wards = empty graph.
   */

  if (!wardScope.wards.length) {
    return [];
  }

  /*
   * =========================================================
   * BUILD ONE GRAPH POINT PER WARD
   * =========================================================
   */

  const results = [];

  for (const ward of wardScope.wards) {
    /*
     * Resolve the vehicle tables registered for this
     * particular ward number.
     */

    const vehicleTables = await getVehicleTablesForDate(dateObject, [
      ward.wardNo,
    ]);

    /*
     * Read telemetry from those vehicle tables.
     */

    const telemetryRows = await getTelemetryRows(vehicleTables, selectedDate);

    /*
     * Sum:
     *
     * wet + dry + other
     */

    const wasteGenerated = telemetryRows.reduce((total, row) => {
      return (
        total +
        Number(row.wetWeight || 0) +
        Number(row.dryWeight || 0) +
        Number(row.otherWeight || 0)
      );
    }, 0);

    results.push({
      /*
       * Frontend uses this as X-axis label.
       */
      wardName: ward.wardName,

      /*
       * Keep ward number available for display/debugging.
       */
      wardNo: ward.wardNo,

      /*
       * Internal hierarchy ID.
       */
      wardId: ward.wardId,

      /*
       * Parent hierarchy information.
       */
      cityId: ward.cityId,
      cityName: ward.cityName,

      zoneId: ward.zoneId,
      zoneName: ward.zoneName,

      divisionId: ward.divisionId,
      divisionName: ward.divisionName,

      /*
       * Backend remains KG.
       *
       * Frontend converts this to tons for the graph.
       */
      wasteGenerated,

      /*
       * Existing threshold preserved.
       */
      threshold: 5000,
    });
  }

  /*
   * Sort by ward number so the graph follows the actual
   * administrative ward order.
   */

  return results.sort((a, b) => Number(a.wardNo) - Number(b.wardNo));
};

/*
|--------------------------------------------------------------------------
| MAP
|--------------------------------------------------------------------------
|
| Existing API contract preserved.
|
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
|
| Kept untouched so the existing endpoint does not
| unexpectedly break.
|
| The actual Header cascade uses the dedicated
| master-citizen endpoints.
|
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
