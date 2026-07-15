const mainDb = require("../config/mainDb");
const { PrismaClient } = require("../generated/sewac");

const prisma = new PrismaClient();

/* ============================================================
   GET ALL PLANTS
============================================================ */

const getAllPlants = async (query) => {
  const conditions = ["status = 'ACTIVE'"];
  const values = [];
  let index = 1;

  if (query.search) {
    conditions.push(`(
    plant_name ILIKE $${index}
    OR plant_manager ILIKE $${index}
  )`);
    values.push(`%${query.search}%`);
    index++;
  }

  if (query.city) {
    conditions.push(`city = $${index}`);
    values.push(query.city);
    index++;
  }

  if (query.zone) {
    conditions.push(`zone = $${index}`);
    values.push(query.zone);
    index++;
  }

  if (query.division) {
    conditions.push(`division = $${index}`);
    values.push(query.division);
    index++;
  }

  if (query.ward) {
    conditions.push(`ward = $${index}`);
    values.push(query.ward);
    index++;
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  const plants = await mainDb.query(
    `
SELECT *
FROM plant_master
${whereClause}
ORDER BY id
LIMIT $${index} OFFSET $${index + 1}
`,
    [...values, limit, offset],
  );

  const total = await mainDb.query(
    `
SELECT COUNT(*)
FROM plant_master
${whereClause}
`,
    values,
  );

  return {
    plants: plants.rows,
    pagination: {
      page,
      limit,
      total: Number(total.rows[0].count),
      totalPages: Math.ceil(Number(total.rows[0].count) / limit),
    },
  };
};

/* ============================================================
   GET PLANT BY ID
============================================================ */

const getPlantById = async (id) => {
  const plant = await prisma.plant_master.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!plant) {
    throw new Error("Plant not found");
  }

  return plant;
};

/* ============================================================
   CREATE PLANT
============================================================ */

const createPlant = async (body) => {
  const {
    plant_name,
    plant_type,
    city,
    zone,
    division,
    ward,
    plant_manager,
    capacity_ton_per_day,
    vehicles_enrolled,
    total_waste_collected,
    latitude,
    longitude,
    status,
  } = body;

  const plant = await prisma.plant_master.create({
    data: {
      plant_name,
      plant_type,
      city,
      zone,
      division,
      ward,
      plant_manager,
      capacity_ton_per_day,
      vehicles_enrolled,
      total_waste_collected,
      latitude,
      longitude,
      status,
    },
  });

  return plant;
};

/* ============================================================
   UPDATE PLANT
============================================================ */

const updatePlant = async (id, body) => {
  const existingPlant = await prisma.plant_master.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!existingPlant) {
    throw new Error("Plant not found");
  }

  return prisma.plant_master.update({
    where: {
      id: Number(id),
    },
    data: body,
  });
};

/* ============================================================
   SOFT DELETE
============================================================ */

const deletePlant = async (id) => {
  const existingPlant = await prisma.plant_master.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!existingPlant) {
    throw new Error("Plant not found");
  }

  return prisma.plant_master.update({
    where: {
      id: Number(id),
    },
    data: {
      status: "INACTIVE",
    },
  });
};

const getPlantDashboard = async () => {
  const stats = await mainDb.query(`
    SELECT
      COUNT(*) AS total_plants,
      COALESCE(SUM(vehicles_enrolled),0) AS total_vehicles,
      COALESCE(SUM(total_waste_collected),0) AS total_waste
    FROM plant_master
    WHERE status='ACTIVE'
  `);

  return {
    totalPlants: Number(stats.rows[0].total_plants),
    totalVehiclesEnrolled: Number(stats.rows[0].total_vehicles),
    totalWasteCollected: Number(stats.rows[0].total_waste),
  };
};

const getPlantLocations = async () => {
  const result = await mainDb.query(`
    SELECT
      id,
      plant_name,
      zone,
      latitude,
      longitude,
      status
    FROM plant_master
    WHERE status = 'ACTIVE'
      AND latitude IS NOT NULL
      AND longitude IS NOT NULL
    ORDER BY plant_name
  `);

  return result.rows;
};

module.exports = {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getPlantDashboard,
  getPlantLocations,
  updatePlant,
  deletePlant,
};
