const mainDb = require("../config/mainDb");
const { PrismaClient } = require("../generated/sewac");
const prisma = new PrismaClient();

const getAllVehicles = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const search = query.search || "";

  const offset = (page - 1) * limit;

  const vehicles = await mainDb.query(
    `
    SELECT *
    FROM vehicle_master
    WHERE
      vehicle_id ILIKE $1
      OR vehicle_number ILIKE $1
      OR vehicle_type ILIKE $1
      OR city ILIKE $1
      OR zone ILIKE $1
      OR division ILIKE $1
      OR ward ILIKE $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [`%${search}%`, limit, offset],
  );

  const total = await mainDb.query(
    `
    SELECT COUNT(*) AS total
    FROM vehicle_master
    WHERE
      vehicle_id ILIKE $1
      OR vehicle_number ILIKE $1
      OR vehicle_type ILIKE $1
      OR city ILIKE $1
      OR zone ILIKE $1
      OR division ILIKE $1
      OR ward ILIKE $1
    `,
    [`%${search}%`],
  );

  return {
    vehicles: vehicles.rows,
    pagination: {
      page,
      limit,
      total: Number(total.rows[0].total),
    },
  };
};

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

const createVehicle = async (body) => {
  const {
    vehicle_id,
    vehicle_number,
    vehicle_type,
    city,
    zone,
    division,
    ward,
    status,
  } = body;

  // Check duplicate Vehicle ID
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
      vehicle_number,
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
      vehicle_number: body.vehicle_number,
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

const deleteVehicle = async (vehicleId) => {
  const existingVehicle = await prisma.vehicle_master.findUnique({
    where: {
      vehicle_id: vehicleId,
    },
  });

  if (!existingVehicle) {
    throw new Error("Vehicle not found");
  }

  const deletedVehicle = await prisma.vehicle_master.update({
    where: {
      vehicle_id: vehicleId,
    },
    data: {
      status: "INACTIVE",
    },
  });

  return deletedVehicle;
};

const getVehicleSummary = async () => {
  const totalVehicles = await prisma.vehicle_master.count();

  const activeVehicles = await prisma.vehicle_master.count({
    where: {
      status: "ACTIVE",
    },
  });

  const inactiveVehicles = await prisma.vehicle_master.count({
    where: {
      status: "INACTIVE",
    },
  });

  // Temporary until telemetry weight logic is implemented
  const averageWeightPerVehicle = 0;

  return {
    totalVehicles,
    activeVehicles,
    inactiveVehicles,
    averageWeightPerVehicle,
  };
};

module.exports = {
  getAllVehicles,
  getVehicleSummary,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
