const { PrismaClient: HelperClient } = require("../generated/helper");
const { PrismaClient: SewacClient } = require("../generated/sewac");

const prisma = new HelperClient();
const sewacPrisma = new SewacClient();

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
    if (!row.received_at) return;

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
    recordId: existing.phoneNumber,
    description: `Deleted Waste Generator ${existing.personName}`,
  });

  return {
    message: "Waste Generator deleted successfully",
  };
};

const getSummary = async () => {
  const totalWasteGenerators = await prisma.master_citizen_data.count();

  const telemetry = await sewacPrisma.telemetry_logs.groupBy({
    by: ["citizen_id"],

    where: {
      citizen_id: {
        not: null,
      },
    },

    _sum: {
      cumulative_weight_kg: true,
    },

    _max: {
      received_at: true,
    },
  });

  let active = 0;

  // Active / Inactive calculation
  telemetry.forEach((t) => {
    if (t._max.received_at) {
      const diff =
        (Date.now() - new Date(t._max.received_at)) / (1000 * 60 * 60 * 24);

      if (diff <= 4) {
        active++;
      }
    }
  });

  // Actual waste calculation from running cumulative
  const logs = await sewacPrisma.telemetry_logs.findMany({
    where: {
      citizen_id: {
        not: null,
      },
    },
    orderBy: [{ iot_timestamp: "asc" }, { id: "asc" }],
  });

  let previousCumulative = 0;

  const citizenWaste = {};

  logs.forEach((log) => {
    const current = Number(log.cumulative_weight_kg || 0);

    const actualWaste = current - previousCumulative;

    previousCumulative = current;

    citizenWaste[log.citizen_id] =
      (citizenWaste[log.citizen_id] || 0) + actualWaste;
  });

  const wasteValues = Object.values(citizenWaste);

  const totalWasteGenerated = wasteValues.reduce((a, b) => a + b, 0);

  const averageWaste = wasteValues.length
    ? totalWasteGenerated / wasteValues.length
    : 0;

  let aboveAverage = 0;
  let belowAverage = 0;

  wasteValues.forEach((value) => {
    if (value >= averageWaste) {
      aboveAverage++;
    } else {
      belowAverage++;
    }
  });

  const inactive = totalWasteGenerators - active;
  return {
    totalWasteGenerators,

    activeWasteGenerators: active,

    inactiveWasteGenerators: inactive,

    totalWasteGenerated,

    averageWaste,

    aboveAverage,

    belowAverage,
  };
};

const getGVPTrend = async () => {
  const result = await sewacPrisma.telemetry_logs.groupBy({
    by: ["unit_number"],

    where: {
      unit_number: {
        not: null,
        notIn: [],
      },

      remarks: "O",

      citizen_contact: null,
    },

    _max: {
      cumulative_weight_kg: true,
    },
  });

  const data = result
    .filter(
      (row) =>
        row.unit_number &&
        !row.unit_number.toUpperCase().includes("UHF")
    )
    .map((row) => ({
      zone: row.unit_number,
      value: Number(row._max.cumulative_weight_kg || 0),
      color:
        Number(row._max.cumulative_weight_kg || 0) >= 6500
          ? "#DC2626"
          : "#16A34A",
    }));

  return data;
};

module.exports = {
  getSummary,
  getGVPTrend,
  getAllWasteGenerators,
  getWasteGeneratorByPhone,
  createWasteGenerator,
  updateWasteGenerator,
  deleteWasteGenerator,
};