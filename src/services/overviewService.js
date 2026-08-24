const helperDb = require("../config/helperDb");
const mainDb = require("../config/mainDb");
const telemetryDb = require("../config/telemetryDb");
const masterCitizenPrisma = require("../config/masterCitizenPrisma");

// ============================================================
// CONSTANTS
// ============================================================

const IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;

const VEHICLE_INACTIVITY_MINUTES = 30;

// ============================================================
// SAFE IDENTIFIER
// ============================================================

const quoteIdentifier = (identifier) => {
  if (typeof identifier !== "string" || !IDENTIFIER_REGEX.test(identifier)) {
    throw new Error(`Unsafe database identifier: ${identifier}`);
  }

  return `"${identifier.replace(/"/g, '""')}"`;
};

// ============================================================
// ID PARSER
// ============================================================

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

// ============================================================
// DATE VALIDATION
// ============================================================

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

// ============================================================
// DAY TABLE NAME
// ============================================================

const getDayTableName = (date) => {
  const dd = String(date.getDate()).padStart(2, "0");

  const mm = String(date.getMonth() + 1).padStart(2, "0");

  const yyyy = date.getFullYear();

  return `day_${dd}${mm}${yyyy}`;
};

// ============================================================
// ALL WARDS
// ============================================================

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

// ============================================================
// SELECTED WARD SCOPE
// ============================================================
console.log("CITY:", {
  cityId: selectedCityId,
  cityName: city.city_name,
  cityTableName: city.city_table_name,
});

console.log("ZONE:", {
  zoneId: selectedZoneId,
  zoneName: zone.zone_name,
  zoneTableName: zone.zone_table_name,
});

console.log("DIVISION:", {
  divisionId: selectedDivisionId,
  divisionName: division.division_name,
  divisionTableName: division.division_table_name,
});

console.log("LOOKING FOR WARD:", {
  wardId: selectedWardId,
  divisionTable: division.division_table_name,
});
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

  // ----------------------------------------------------------
  // NO FILTER
  // ----------------------------------------------------------

  if (!selectedCityId) {
    return {
      filtered: false,
      wards: await getAllWardScope(),
    };
  }

  // ----------------------------------------------------------
  // CITY
  // ----------------------------------------------------------

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

  // ----------------------------------------------------------
  // ZONES
  // ----------------------------------------------------------

  const zones = await masterCitizenPrisma.$queryRawUnsafe(
    `
        SELECT
          zone_id,
          zone_name,
          zone_table_name
        FROM ${cityTable}
        ${selectedZoneId ? "WHERE zone_id = $1" : ""}
        ORDER BY zone_id ASC
      `,
    ...(selectedZoneId ? [selectedZoneId] : []),
  );

  if (selectedZoneId && zones.length === 0) {
    throw new Error("Zone not found in selected city");
  }

  const wards = [];

  // ----------------------------------------------------------
  // ZONE → DIVISION → WARD
  // ----------------------------------------------------------

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
          ${selectedDivisionId ? "WHERE division_id = $1" : ""}
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
        `
            SELECT
              ward_id,
              ward_no,
              ward_name,
              ward_table_name
            FROM ${divisionTable}
            ${selectedWardId ? "WHERE ward_id = $1" : ""}
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

// ============================================================
// DAY TABLE → VEHICLES
// ============================================================
//
// IMPORTANT NEW FIELD:
//
// vehicle_table_name_hb
//
// This points to:
//
// KA05AB1237_HB23082026
//
// etc.
//
// ============================================================

const getVehicleTablesForDate = async (date, wardNos = null) => {
  const dayTable = getDayTableName(date);

  const dayIdentifier = quoteIdentifier(dayTable);

  if (Array.isArray(wardNos) && wardNos.length === 0) {
    return [];
  }

  let rows;

  try {
    if (Array.isArray(wardNos)) {
      rows = await telemetryDb.$queryRawUnsafe(
        `
            SELECT
              vehicle_number,
              vehicle_table_name,
              vehicle_table_name_hb,
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
              vehicle_table_name_hb,
              ward_no
            FROM ${dayIdentifier}
            ORDER BY
              vehicle_number ASC
          `,
      );
    }
  } catch (error) {
    if (error?.code === "42P01") {
      console.warn(`Overview: ${dayTable} does not exist.`);

      return [];
    }

    throw error;
  }

  return rows.map((row) => ({
    vehicleNumber: row.vehicle_number,

    vehicleTableName: row.vehicle_table_name,

    heartbeatTableName: row.vehicle_table_name_hb,

    wardNo: row.ward_no === null ? null : Number(row.ward_no),
  }));
};

// ============================================================
// VEHICLE TELEMETRY UNION
// ============================================================

const buildTelemetryUnion = (vehicleTables) => {
  if (!Array.isArray(vehicleTables) || vehicleTables.length === 0) {
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

// ============================================================
// TELEMETRY ROWS
// ============================================================

const getTelemetryRows = async (vehicleTables, selectedDate) => {
  const unionSql = buildTelemetryUnion(vehicleTables);

  if (!unionSql) {
    return [];
  }

  try {
    return await telemetryDb.$queryRawUnsafe(
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

        WHERE
          iottimestamp >=
            $1::date

          AND iottimestamp <
            (
              $1::date +
              INTERVAL '1 day'
            )
      `,
      selectedDate,
    );
  } catch (error) {
    if (error?.code === "42P01") {
      return [];
    }

    throw error;
  }
};

// ============================================================
// TOTAL CITIZENS
// ============================================================

const getTotalCitizens = async () => {
  const result = await helperDb.query(`
        SELECT COUNT(*) AS total
        FROM master_citizen_data
      `);

  return Number(result.rows[0]?.total || 0);
};

// ============================================================
// SUMMARY
// ============================================================

const getSummary = async (date, cityId, zoneId, divisionId, wardId) => {
  const { value: selectedDate, date: dateObject } = validateDate(date);

  const wardScope = await getSelectedWardScope({
    cityId,
    zoneId,
    divisionId,
    wardId,
  });

  const wardNos = wardScope.wards
    .map((ward) => Number(ward.wardNo))
    .filter((wardNo) => Number.isInteger(wardNo));

  const [totalCitizens, vehicleTables] = await Promise.all([
    getTotalCitizens(),

    getVehicleTablesForDate(dateObject, wardScope.filtered ? wardNos : null),
  ]);

  const telemetryRows = await getTelemetryRows(vehicleTables, selectedDate);

  const totalWasteCollected = telemetryRows.reduce(
    (total, row) =>
      total +
      Number(row.wetWeight || 0) +
      Number(row.dryWeight || 0) +
      Number(row.otherWeight || 0),
    0,
  );

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

// ============================================================
// VEHICLE SUMMARY
// ============================================================

const getVehicleSummary = async (date, cityId, zoneId, divisionId, wardId) => {
  const { date: selectedDateObject } = validateDate(date);

  const selectedCityId = parseId(cityId, "cityId");

  const selectedZoneId = parseId(zoneId, "zoneId");

  const selectedDivisionId = parseId(divisionId, "divisionId");

  const selectedWardId = parseId(wardId, "wardId");

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

  // --------------------------------------------------------
  // REGISTERED VEHICLES
  // --------------------------------------------------------

  let registeredResult;

  if (Array.isArray(wardNos)) {
    registeredResult = await mainDb.query(
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
    registeredResult = await mainDb.query(
      `
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
          `,
    );
  }

  const registeredVehicles = registeredResult.rows
    .map((vehicle) => ({
      id: vehicle.id,

      vehicleId: String(vehicle.vehicle_id).trim(),

      wardNo:
        vehicle.ward_no === null || vehicle.ward_no === undefined
          ? null
          : Number(vehicle.ward_no),
    }))
    .filter((vehicle) => vehicle.vehicleId);

  const totalVehicles = registeredVehicles.length;

  if (totalVehicles === 0) {
    return {
      totalVehicles: 0,

      runningVehicles: 0,

      inactiveVehicles: 0,

      vehicleStatus: [],

      inactivityThresholdMinutes: VEHICLE_INACTIVITY_MINUTES,
    };
  }

  // --------------------------------------------------------
  // SELECTED DATE TELEMETRY
  // --------------------------------------------------------

  let selectedDateVehicleTables = [];

  try {
    selectedDateVehicleTables = await getVehicleTablesForDate(
      selectedDateObject,
      wardNos,
    );
  } catch (error) {
    console.warn("Vehicle summary telemetry lookup failed:", error.message);

    return {
      totalVehicles,

      runningVehicles: 0,

      inactiveVehicles: totalVehicles,

      vehicleStatus: registeredVehicles.map((vehicle) => ({
        vehicleId: vehicle.vehicleId,

        wardNo: vehicle.wardNo,

        status: "INACTIVE",

        lastReceivedTimestamp: null,
      })),

      inactivityThresholdMinutes: VEHICLE_INACTIVITY_MINUTES,
    };
  }

  // --------------------------------------------------------
  // NO DYNAMIC TABLE
  // --------------------------------------------------------

  if (!selectedDateVehicleTables.length) {
    return {
      totalVehicles,

      runningVehicles: 0,

      inactiveVehicles: totalVehicles,

      vehicleStatus: registeredVehicles.map((vehicle) => ({
        vehicleId: vehicle.vehicleId,

        wardNo: vehicle.wardNo,

        status: "INACTIVE",

        lastReceivedTimestamp: null,
      })),

      inactivityThresholdMinutes: VEHICLE_INACTIVITY_MINUTES,
    };
  }

  // --------------------------------------------------------
  // LATEST TELEMETRY
  // --------------------------------------------------------

  const registeredVehicleIds = new Set(
    registeredVehicles.map((vehicle) => vehicle.vehicleId),
  );

  const latestPacketByVehicle = new Map();

  const telemetryRows = await getTelemetryRows(
    selectedDateVehicleTables,
    validateDate(date).value,
  );

  for (const row of telemetryRows) {
    if (!row.vehicleNumber) {
      continue;
    }

    const vehicleNumber = String(row.vehicleNumber).trim();

    if (!registeredVehicleIds.has(vehicleNumber)) {
      continue;
    }

    if (!row.receivedTimestamp) {
      continue;
    }

    const received = new Date(row.receivedTimestamp);

    if (Number.isNaN(received.getTime())) {
      continue;
    }

    const existing = latestPacketByVehicle.get(vehicleNumber);

    if (!existing || received > existing.lastReceivedTimestamp) {
      latestPacketByVehicle.set(vehicleNumber, {
        vehicleNumber,

        lastReceivedTimestamp: received,
      });
    }
  }

  const now = new Date();

  const inactivityLimit = new Date(
    now.getTime() - VEHICLE_INACTIVITY_MINUTES * 60 * 1000,
  );

  let runningVehicles = 0;

  const vehicleStatus = [];

  for (const vehicle of registeredVehicles) {
    const latest = latestPacketByVehicle.get(vehicle.vehicleId);

    if (!latest) {
      vehicleStatus.push({
        vehicleId: vehicle.vehicleId,

        wardNo: vehicle.wardNo,

        status: "INACTIVE",

        lastReceivedTimestamp: null,
      });

      continue;
    }

    const isRunning = latest.lastReceivedTimestamp >= inactivityLimit;

    if (isRunning) {
      runningVehicles += 1;
    }

    vehicleStatus.push({
      vehicleId: vehicle.vehicleId,

      wardNo: vehicle.wardNo,

      status: isRunning ? "ACTIVE" : "INACTIVE",

      lastReceivedTimestamp: latest.lastReceivedTimestamp,
    });
  }

  const inactiveVehicles = Math.max(totalVehicles - runningVehicles, 0);

  return {
    totalVehicles,

    runningVehicles,

    inactiveVehicles,

    vehicleStatus,

    inactivityThresholdMinutes: VEHICLE_INACTIVITY_MINUTES,
  };
};

// ============================================================
// GENERATION TREND
// ============================================================

const getGenerationTrend = async (date, cityId, zoneId, divisionId, wardId) => {
  const { value: selectedDate, date: dateObject } = validateDate(date);

  const wardScope = await getSelectedWardScope({
    cityId,
    zoneId,
    divisionId,

    // Division-wise graph.
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

      wasteGenerated,

      threshold: 5000,
    });
  }

  return results.sort((a, b) => Number(a.wardNo) - Number(b.wardNo));
};

// ============================================================
// ROUTE MAP
// ============================================================
//
// NEW ARCHITECTURE:
//
// selected date
//      ↓
// day_DDMMYYYY
//      ↓
// vehicle_table_name_hb
//      ↓
// vehicle heartbeat table
//      ↓
// latitude + longitude + created_at
//      ↓
// route
//
// ============================================================

const getMapData = async (date, cityId, zoneId, divisionId, wardId) => {
  const { value: selectedDate, date: dateObject } = validateDate(date);

  const wardScope = await getSelectedWardScope({
    cityId,
    zoneId,
    divisionId,
    wardId,
  });

  const wardNos = wardScope.wards
    .map((ward) => Number(ward.wardNo))
    .filter((wardNo) => Number.isInteger(wardNo));

  if (wardNos.length === 0) {
    return {
      defaultView: "route-map",

      date: selectedDate,

      routes: [],

      totalVehicles: 0,

      totalRoutePoints: 0,
    };
  }

  const vehicleTables = await getVehicleTablesForDate(dateObject, wardNos);

  if (vehicleTables.length === 0) {
    return {
      defaultView: "route-map",

      date: selectedDate,

      routes: [],

      totalVehicles: 0,

      totalRoutePoints: 0,
    };
  }

  const routes = [];

  for (const vehicle of vehicleTables) {
    const heartbeatTable = vehicle.heartbeatTableName;

    if (!heartbeatTable) {
      continue;
    }

    const table = quoteIdentifier(heartbeatTable);

    let heartbeatRows;

    try {
      heartbeatRows = await telemetryDb.$queryRawUnsafe(
        `
            SELECT
              id,
              latitude,
              longitude,
              created_at
            FROM ${table}
            WHERE
              latitude IS NOT NULL
              AND longitude IS NOT NULL
            ORDER BY
              created_at ASC,
              id ASC
          `,
      );
    } catch (error) {
      console.error("❌ ROUTE MAP HEARTBEAT QUERY FAILED", {
        vehicleNumber: vehicle.vehicleNumber,

        heartbeatTable,

        errorCode: error?.code,

        errorMessage: error?.message,

        errorMeta: error?.meta,
      });

      if (error?.code === "42P01") {
        console.warn(
          `Route map: heartbeat table ${heartbeatTable} does not exist.`,
        );

        continue;
      }

      throw error;
    }

    const points = heartbeatRows
      .map((row) => {
        const latitude = Number(row.latitude);

        const longitude = Number(row.longitude);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return null;
        }

        return {
          latitude,

          longitude,

          timestamp: row.created_at
            ? new Date(row.created_at).toISOString()
            : null,
        };
      })
      .filter(Boolean);

    if (points.length === 0) {
      continue;
    }

    routes.push({
      vehicleNumber: vehicle.vehicleNumber,

      wardNo: vehicle.wardNo,

      heartbeatTableName: heartbeatTable,

      pointCount: points.length,

      points,

      startPoint: points[0],

      endPoint: points[points.length - 1],
    });
  }

  return {
    defaultView: "route-map",

    date: selectedDate,

    routes,

    totalVehicles: routes.length,

    totalRoutePoints: routes.reduce(
      (total, route) => total + Number(route.pointCount || 0),
      0,
    ),
  };
};

// ============================================================
// LEGACY OVERVIEW FILTERS
// ============================================================

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

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getSummary,

  getVehicleSummary,

  getGenerationTrend,

  getMapData,

  getOverviewFilters,
};
