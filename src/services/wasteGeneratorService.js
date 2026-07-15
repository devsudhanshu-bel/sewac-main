const { PrismaClient } = require("../generated/helper");

const prisma = new PrismaClient();
const logEdit = require("../utils/editLogger");

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

  const total = await prisma.master_citizen_data.count({
    where,
  });

  return {
    wasteGenerators,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

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
    recordId: citizen.phoneNumber,
    description: `Deleted Waste Generator ${citizen.personName}`,
  });

  return {
    message: "Waste Generator deleted successfully",
  };
};

module.exports = {
  getAllWasteGenerators,
  getWasteGeneratorByPhone,
  createWasteGenerator,
  updateWasteGenerator,
  deleteWasteGenerator,
};
