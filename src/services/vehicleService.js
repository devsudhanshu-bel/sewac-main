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

const getAllVehicles = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const search = query.search || "";
  const status = query.status || "";
  const offset = (page - 1) * limit;

  let whereClause = `
    (
      vehicle_id ILIKE $1
      OR vehicle_type ILIKE $1
      OR city ILIKE $1
      OR zone ILIKE $1
      OR division ILIKE $1
      OR ward ILIKE $1
    )
  `;

  const params = [`%${search}%`];

  if (status && status !== "ALL") {
    whereClause += ` AND status = $2`;
    params.push(status);
  }

  const vehiclesQuery = `
    SELECT *
    FROM vehicle_master
    WHERE ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${params.length + 1}
    OFFSET $${params.length + 2}
  `;

  const vehicles = await mainDb.query(vehiclesQuery, [
    ...params,
    limit,
    offset,
  ]);

  const totalQuery = `
    SELECT COUNT(*) AS total
    FROM vehicle_master
    WHERE ${whereClause}
  `;

  const total = await mainDb.query(totalQuery, params);

  return {
    vehicles: vehicles.rows,

    pagination: {
      page,
      limit,
      total: Number(total.rows[0].total),
      totalPages: Math.ceil(Number(total.rows[0].total) / limit),
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
};
