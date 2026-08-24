const mainDb = require("../config/mainDb");
const telemetryDb = require("../config/telemetryDb");
const { PrismaClient } = require("../generated/sewac");

const prisma = new PrismaClient();

/*
|--------------------------------------------------------------------------
| DATABASE IDENTIFIER SAFETY
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
| DAY TABLE
|--------------------------------------------------------------------------
|
| Example:
|
| 2026-08-23
|     ↓
| day_23082026
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
| VEHICLE TABLES FOR A DATE
|--------------------------------------------------------------------------
|
| day_DDMMYYYY
|       ↓
| vehicle_number
| vehicle_table_name
|       ↓
| telemetry table
|
|--------------------------------------------------------------------------
*/

const getVehicleTablesForDate = async (date) => {
  const dayTable = getDayTableName(date);
  const dayIdentifier = quoteIdentifier(dayTable);

  try {
    const rows = await telemetryDb.$queryRawUnsafe(
      `
        SELECT
          vehicle_number,
          vehicle_table_name,
          ward_no
        FROM ${dayIdentifier}
        WHERE vehicle_number IS NOT NULL
          AND vehicle_table_name IS NOT NULL
        ORDER BY vehicle_number ASC
      `,
    );

    return rows
      .filter(
        (row) =>
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
     * A missing day table simply means there is
     * no telemetry for that day.
     */

    if (error?.code === "42P01") {
      console.warn(
        `Vehicle status: telemetry day table ${dayTable} does not exist.`,
      );

      return [];
    }

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| ALL VEHICLES
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| ALL VEHICLES / TELEMETRY DIRECTORY
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| Vehicle status is NOT taken from vehicle_master.status.
|
| LIVE STATUS:
|
| ACTIVE
|   Latest telemetry packet received within 30 minutes.
|
| INACTIVE
|   Latest telemetry packet older than 30 minutes.
|
| ALSO INACTIVE
|   Vehicle has never sent telemetry.
|
| Everything else in the directory remains unchanged.
|
|--------------------------------------------------------------------------
*/

const getAllVehicles = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const search = query.search || "";
  const requestedStatus = query.status || "ALL";

  /*
   * =========================================================
   * 1. GET VEHICLES
   * =========================================================
   *
   * DO NOT filter using vehicle_master.status.
   *
   * Status will be calculated from telemetry below.
   *
   * =========================================================
   */

  const searchPattern = `%${search}%`;

  const vehiclesQuery = `
    SELECT *
    FROM vehicle_master
    WHERE
      (
        vehicle_id ILIKE $1
        OR vehicle_type ILIKE $1
        OR city ILIKE $1
        OR zone ILIKE $1
        OR division ILIKE $1
        OR ward ILIKE $1
      )
    ORDER BY created_at DESC
  `;

  const vehiclesResult = await mainDb.query(vehiclesQuery, [searchPattern]);

  let vehicles = vehiclesResult.rows;

  /*
   * =========================================================
   * 2. GET LIVE TELEMETRY STATUS
   * =========================================================
   *
   * Reuse the same logic already used by the
   * Vehicle KPI summary.
   *
   * =========================================================
   */

  const summary = await getVehicleSummary();

  /*
   * =========================================================
   * 3. CREATE STATUS LOOKUP
   * =========================================================
   */

  const statusMap = new Map();

  if (Array.isArray(summary.vehicleStatus)) {
    summary.vehicleStatus.forEach((vehicle) => {
      statusMap.set(String(vehicle.vehicleId).trim(), vehicle);
    });
  }

  /*
   * =========================================================
   * 4. REPLACE STATIC STATUS
   * =========================================================
   *
   * IMPORTANT:
   *
   * We only replace `status`.
   *
   * Vehicle ID,
   * zone,
   * city,
   * division,
   * ward,
   * created_at,
   * etc.
   *
   * remain exactly as they were.
   *
   * =========================================================
   */

  vehicles = vehicles.map((vehicle) => {
    const vehicleId = String(vehicle.vehicle_id || "").trim();

    const liveStatus = statusMap.get(vehicleId);

    return {
      ...vehicle,

      status: liveStatus?.status || "INACTIVE",
    };
  });

  /*
   * =========================================================
   * 5. APPLY DYNAMIC STATUS FILTER
   * =========================================================
   *
   * This is important.
   *
   * The dropdown:
   *
   * ALL
   * ACTIVE
   * INACTIVE
   *
   * must now filter using LIVE TELEMETRY STATUS.
   *
   * =========================================================
   */

  if (requestedStatus && requestedStatus !== "ALL") {
    vehicles = vehicles.filter((vehicle) => vehicle.status === requestedStatus);
  }

  /*
   * =========================================================
   * 6. PAGINATION AFTER STATUS FILTER
   * =========================================================
   */

  const total = vehicles.length;

  const offset = (page - 1) * limit;

  const paginatedVehicles = vehicles.slice(offset, offset + limit);

  /*
   * =========================================================
   * 7. RESPONSE
   * =========================================================
   */

  return {
    vehicles: paginatedVehicles,

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
| GET VEHICLE BY ID
|--------------------------------------------------------------------------
*/

const getVehicleById = async (vehicleId) => {
  const vehicle = await prisma.vehicle_master.findUnique({
    where: {
      vehicle_id: vehicleId,
    },
  });

  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  return vehicle;
};

/*
|--------------------------------------------------------------------------
| CREATE VEHICLE
|--------------------------------------------------------------------------
*/

const createVehicle = async (body) => {
  const { vehicle_id, vehicle_type, city, zone, division, ward, status } = body;

  const existingVehicle = await prisma.vehicle_master.findUnique({
    where: {
      vehicle_id,
    },
  });

  if (existingVehicle) {
    throw new Error("Vehicle ID already exists");
  }

  const vehicle = await prisma.vehicle_master.create({
    data: {
      vehicle_id,
      vehicle_type,
      city,
      zone,
      division,
      ward,
      status: status || "ACTIVE",
    },
  });

  return vehicle;
};

/*
|--------------------------------------------------------------------------
| UPDATE VEHICLE
|--------------------------------------------------------------------------
*/

const updateVehicle = async (vehicleId, body) => {
  const existingVehicle = await prisma.vehicle_master.findUnique({
    where: {
      vehicle_id: vehicleId,
    },
  });

  if (!existingVehicle) {
    throw new Error("Vehicle not found");
  }

  const updatedVehicle = await prisma.vehicle_master.update({
    where: {
      vehicle_id: vehicleId,
    },

    data: {
      vehicle_type: body.vehicle_type,
      city: body.city,
      zone: body.zone,
      division: body.division,
      ward: body.ward,
      status: body.status,
    },
  });

  return updatedVehicle;
};

/*
|--------------------------------------------------------------------------
| DELETE VEHICLE
|--------------------------------------------------------------------------
*/

const deleteVehicle = async (vehicleId) => {
  const existingVehicle = await prisma.vehicle_master.findUnique({
    where: {
      vehicle_id: vehicleId,
    },
  });

  if (!existingVehicle) {
    throw new Error("Vehicle not found");
  }

  await prisma.vehicle_master.delete({
    where: {
      vehicle_id: vehicleId,
    },
  });

  return {
    message: "Vehicle deleted successfully",
  };
};

/*
|--------------------------------------------------------------------------
| LIVE VEHICLE SUMMARY
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| This does NOT use vehicle_master.status.
|
| ACTIVE:
|   Latest telemetry packet received within 30 minutes.
|
| INACTIVE:
|   Latest telemetry packet older than 30 minutes.
|
| ALSO INACTIVE:
|   Vehicle has never sent telemetry.
|
|--------------------------------------------------------------------------
*/

const VEHICLE_INACTIVITY_MINUTES = 30;

const getVehicleSummary = async () => {
  /*
   * =========================================================
   * 1. GET REGISTERED VEHICLES
   * =========================================================
   */

  const registeredVehiclesResult = await mainDb.query(`
    SELECT
      id,
      vehicle_id
    FROM vehicle_master
    WHERE vehicle_id IS NOT NULL
      AND TRIM(vehicle_id) <> ''
    ORDER BY id ASC
  `);

  const registeredVehicles = registeredVehiclesResult.rows
    .map((vehicle) => ({
      id: vehicle.id,
      vehicleId: String(vehicle.vehicle_id).trim(),
    }))
    .filter((vehicle) => vehicle.vehicleId);

  const totalVehicles = registeredVehicles.length;

  /*
   * =========================================================
   * 2. CURRENT TIME
   * =========================================================
   */

  const now = new Date();

  const inactivityLimit = new Date(
    now.getTime() - VEHICLE_INACTIVITY_MINUTES * 60 * 1000,
  );

  /*
   * =========================================================
   * 3. TODAY'S TELEMETRY TABLES
   * =========================================================
   */

  const today = new Date();

  let todayVehicleTables = [];

  try {
    todayVehicleTables = await getVehicleTablesForDate(today);
  } catch (error) {
    console.warn(
      "Vehicle summary: today's telemetry table unavailable:",
      error.message,
    );
  }

  /*
   * =========================================================
   * 4. YESTERDAY'S TELEMETRY TABLES
   * =========================================================
   *
   * Needed for the midnight boundary.
   *
   * Example:
   *
   * Yesterday:
   * 23:58
   *
   * Today:
   * 00:10
   *
   * Difference:
   * 12 minutes
   *
   * Therefore the vehicle is still ACTIVE.
   *
   * =========================================================
   */

  const yesterday = new Date(today);

  yesterday.setDate(yesterday.getDate() - 1);

  let yesterdayVehicleTables = [];

  try {
    yesterdayVehicleTables = await getVehicleTablesForDate(yesterday);
  } catch (error) {
    console.warn(
      "Vehicle summary: yesterday's telemetry table unavailable:",
      error.message,
    );
  }

  /*
   * =========================================================
   * 5. COMBINE TODAY + YESTERDAY
   * =========================================================
   */

  const allVehicleTables = [...todayVehicleTables, ...yesterdayVehicleTables];

  /*
   * =========================================================
   * 6. REMOVE DUPLICATE TELEMETRY TABLES
   * =========================================================
   */

  const uniqueVehicleTables = Array.from(
    new Map(
      allVehicleTables
        .filter((vehicle) => vehicle.vehicleTableName)
        .map((vehicle) => [vehicle.vehicleTableName, vehicle]),
    ).values(),
  );

  /*
   * =========================================================
   * 7. FIND LATEST PACKET PER REGISTERED VEHICLE
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
              MAX(receivedtimestamp)
                AS "lastReceivedTimestamp"
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

        /*
         * Only consider telemetry belonging
         * to a registered vehicle.
         */

        const isRegistered = registeredVehicles.some(
          (registeredVehicle) => registeredVehicle.vehicleId === vehicleNumber,
        );

        if (!isRegistered) {
          continue;
        }

        const lastReceived = new Date(row.lastReceivedTimestamp);

        if (Number.isNaN(lastReceived.getTime())) {
          continue;
        }

        const existing = latestPacketByVehicle.get(vehicleNumber);

        /*
         * Keep the newest packet if the
         * vehicle exists in multiple tables.
         */

        if (!existing || lastReceived > existing.lastReceivedTimestamp) {
          latestPacketByVehicle.set(vehicleNumber, {
            vehicleNumber,
            lastReceivedTimestamp: lastReceived,
          });
        }
      }
    } catch (error) {
      /*
       * One bad/missing telemetry table should
       * not break the entire Vehicles KPI.
       */

      if (error?.code === "42P01") {
        console.warn(
          `Vehicle summary: telemetry table ${vehicle.vehicleTableName} does not exist.`,
        );

        continue;
      }

      console.warn(
        `Vehicle summary: unable to inspect ${vehicle.vehicleTableName}:`,
        error.message,
      );
    }
  }

  /*
   * =========================================================
   * 8. ACTIVE / INACTIVE
   * =========================================================
   */

  let activeVehicles = 0;

  const vehicleStatus = [];

  for (const vehicle of registeredVehicles) {
    const latest = latestPacketByVehicle.get(vehicle.vehicleId);

    /*
     * No telemetry ever.
     *
     * Therefore INACTIVE.
     */

    if (!latest) {
      vehicleStatus.push({
        vehicleId: vehicle.vehicleId,
        status: "INACTIVE",
        lastReceivedTimestamp: null,
      });

      continue;
    }

    /*
     * ACTIVE only when the latest packet
     * arrived within the last 30 minutes.
     */

    const isActive = latest.lastReceivedTimestamp >= inactivityLimit;

    if (isActive) {
      activeVehicles += 1;
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

  const inactiveVehicles = Math.max(totalVehicles - activeVehicles, 0);

  /*
   * =========================================================
   * 10. AVERAGE WEIGHT
   * =========================================================
   *
   * Keep existing behavior.
   * Weight logic is not being changed here.
   * =========================================================
   */

  const averageWeightPerVehicle = 0;

  return {
    totalVehicles,

    activeVehicles,

    inactiveVehicles,

    averageWeightPerVehicle,

    /*
     * Useful for future directory/status display.
     */
    vehicleStatus,

    inactivityThresholdMinutes: VEHICLE_INACTIVITY_MINUTES,
  };
};

/*
|--------------------------------------------------------------------------
| AVERAGE WEIGHT GENERATED BY ZONE
|--------------------------------------------------------------------------
|
| DATA FLOW
|
| vehicle_master
|       ↓
| vehicle_id + zone
|       ↓
| day_DDMMYYYY
|       ↓
| vehicle_table_name
|       ↓
| telemetry
|       ↓
| wetweight + dryweight + otherweight
|       ↓
| zone aggregation
|
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| This function does NOT modify:
|
| - vehicle status
| - vehicle CRUD
| - route maps
| - heartbeat logic
| - vehicle summary
| - directory logic
|
|--------------------------------------------------------------------------
*/

const getAverageWeightByZone = async (date) => {
  /*
  |--------------------------------------------------------------------------
  | DATE
  |--------------------------------------------------------------------------
  */

  let selectedDate;

  if (date) {
    const dateString = String(date).trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      throw new Error("date must be in YYYY-MM-DD format");
    }

    const parsedDate = new Date(`${dateString}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date");
    }

    selectedDate = dateString;
  } else {
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    selectedDate = `${yyyy}-${mm}-${dd}`;
  }

  const [year, month, day] = selectedDate.split("-").map(Number);

  const dateObject = new Date(year, month - 1, day);

  /*
  |--------------------------------------------------------------------------
  | 1. GET ALL ZONES
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | Do NOT derive zones from vehicle_master.
  |
  | zone_table is the master list.
  |
  */

  const zoneResult = await mainDb.query(`
      SELECT
        id,
        zone_name
      FROM zone_table
      ORDER BY id ASC
    `);

  /*
  |--------------------------------------------------------------------------
  | 2. INITIALISE EVERY ZONE
  |--------------------------------------------------------------------------
  */

  const zoneMap = new Map();

  for (const zone of zoneResult.rows) {
    const zoneName = String(zone.zone_name || "").trim();

    if (!zoneName) {
      continue;
    }

    zoneMap.set(zoneName, {
      zone: zoneName,
      waste: 0,
      vehicles: 0,
      vehiclesWithTelemetry: 0,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | 3. GET REGISTERED VEHICLES
  |--------------------------------------------------------------------------
  */

  const registeredResult = await mainDb.query(`
      SELECT
        id,
        vehicle_id,
        zone,
        city,
        division,
        ward
      FROM vehicle_master
      WHERE
        vehicle_id IS NOT NULL
        AND TRIM(vehicle_id) <> ''
      ORDER BY id ASC
    `);

  const registeredVehicles = registeredResult.rows
    .map((vehicle) => ({
      id: vehicle.id,

      vehicleId: String(vehicle.vehicle_id).trim(),

      zone: vehicle.zone ? String(vehicle.zone).trim() : "",

      city: vehicle.city ? String(vehicle.city).trim() : "",

      division: vehicle.division ? String(vehicle.division).trim() : "",

      ward: vehicle.ward ? String(vehicle.ward).trim() : "",
    }))
    .filter((vehicle) => vehicle.vehicleId);

  /*
  |--------------------------------------------------------------------------
  | 4. COUNT VEHICLES PER ZONE
  |--------------------------------------------------------------------------
  */

  for (const vehicle of registeredVehicles) {
    const zoneName = vehicle.zone;

    if (!zoneMap.has(zoneName)) {
      continue;
    }

    zoneMap.get(zoneName).vehicles += 1;
  }

  /*
  |--------------------------------------------------------------------------
  | 5. GET DYNAMIC TELEMETRY TABLES
  |--------------------------------------------------------------------------
  */

  let vehicleTables = [];

  try {
    vehicleTables = await getVehicleTablesForDate(dateObject);
  } catch (error) {
    console.error("Average weight: unable to load day tables:", error);
  }

  /*
  |--------------------------------------------------------------------------
  | 6. VEHICLE → TELEMETRY TABLE
  |--------------------------------------------------------------------------
  */

  const telemetryTableByVehicle = new Map();

  for (const vehicle of vehicleTables) {
    if (!vehicle.vehicleNumber || !vehicle.vehicleTableName) {
      continue;
    }

    telemetryTableByVehicle.set(
      String(vehicle.vehicleNumber).trim(),

      vehicle.vehicleTableName,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | 7. READ TELEMETRY
  |--------------------------------------------------------------------------
  */

  for (const vehicle of registeredVehicles) {
    const telemetryTable = telemetryTableByVehicle.get(vehicle.vehicleId);

    if (!telemetryTable) {
      continue;
    }

    /*
    |--------------------------------------------------------------------------
    | VEHICLE HAS TO BELONG TO A KNOWN ZONE
    |--------------------------------------------------------------------------
    */

    if (!zoneMap.has(vehicle.zone)) {
      continue;
    }

    const table = quoteIdentifier(telemetryTable);

    try {
      const result = await telemetryDb.$queryRawUnsafe(
        `
            SELECT

              COALESCE(
                SUM(
                  COALESCE(
                    wetweight,
                    0
                  )
                ),
                0
              ) AS "wetWeight",

              COALESCE(
                SUM(
                  COALESCE(
                    dryweight,
                    0
                  )
                ),
                0
              ) AS "dryWeight",

              COALESCE(
                SUM(
                  COALESCE(
                    otherweight,
                    0
                  )
                ),
                0
              ) AS "otherWeight"

            FROM ${table}

            WHERE
              iottimestamp >= $1::date

              AND iottimestamp <
                (
                  $1::date +
                  INTERVAL '1 day'
                )
          `,
        selectedDate,
      );

      const row = result?.[0];

      if (!row) {
        continue;
      }

      const wetWeight = Number(row.wetWeight) || 0;

      const dryWeight = Number(row.dryWeight) || 0;

      const otherWeight = Number(row.otherWeight) || 0;

      /*
      |--------------------------------------------------------------------------
      | TOTAL KG
      |--------------------------------------------------------------------------
      */

      const totalWeight = wetWeight + dryWeight + otherWeight;

      const zone = zoneMap.get(vehicle.zone);

      if (!zone) {
        continue;
      }

      zone.waste += totalWeight;

      zone.vehiclesWithTelemetry += 1;
    } catch (error) {
      /*
      |--------------------------------------------------------------------------
      | MISSING TELEMETRY TABLE
      |--------------------------------------------------------------------------
      */

      if (error?.code === "42P01") {
        console.warn(`Average weight: table ${telemetryTable} does not exist.`);

        continue;
      }

      console.error(`Average weight: unable to read ${telemetryTable}:`, error);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | 8. FORMAT ALL ZONES
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | Zones with no telemetry remain in the response.
  |
  */

  const zones = Array.from(zoneMap.values()).map((zone) => ({
    zone: zone.zone,

    waste: Number(zone.waste.toFixed(2)),

    vehicles: zone.vehicles,

    vehiclesWithTelemetry: zone.vehiclesWithTelemetry,
  }));

  /*
  |--------------------------------------------------------------------------
  | 9. TOTAL WASTE
  |--------------------------------------------------------------------------
  */

  const totalWasteGenerated = zones.reduce(
    (total, zone) => total + Number(zone.waste || 0),
    0,
  );

  /*
  |--------------------------------------------------------------------------
  | 10. AVERAGE
  |--------------------------------------------------------------------------
  */

  const averageWasteGenerated =
    zones.length > 0 ? totalWasteGenerated / zones.length : 0;

  /*
  |--------------------------------------------------------------------------
  | 11. RESPONSE
  |--------------------------------------------------------------------------
  */

  return {
    date: selectedDate,

    zones,

    totalWasteGenerated: Number(totalWasteGenerated.toFixed(2)),

    averageWasteGenerated: Number(averageWasteGenerated.toFixed(2)),
  };
};

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  getAllVehicles,
  getVehicleSummary,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAverageWeightByZone,
};
