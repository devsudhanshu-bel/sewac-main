const { PrismaClient } = require("../generated/sewac");

const prisma = new PrismaClient();

async function getComplaints({
  page = 1,
  limit = 10,
  search = "",
  status,
  category,
}) {
  const skip = (page - 1) * limit;

  const where = {};

  if (status) {
    where.status = status;
  }

  if (category) {
    where.category = category;
  }

  if (search) {
    where.OR = [
      {
        ticket_number: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        phone_number: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        address: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.citizen_complaints.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
    }),

    prisma.citizen_complaints.count({
      where,
    }),
  ]);

  return {
    items,
    total,
  };
}

async function getComplaintByTicket(ticketNumber) {
  return prisma.citizen_complaints.findUnique({
    where: {
      ticket_number: ticketNumber,
    },
  });
}

async function getComplaintKPIs() {
  const [
    total,
    pending,
    assigned,
    inProgress,
    readyForVerification,
    otpSent,
    closed,
  ] = await Promise.all([
    prisma.citizen_complaints.count(),

    prisma.citizen_complaints.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.citizen_complaints.count({
      where: {
        status: "ASSIGNED",
      },
    }),

    prisma.citizen_complaints.count({
      where: {
        status: "IN_PROGRESS",
      },
    }),

    prisma.citizen_complaints.count({
      where: {
        status: "READY_FOR_VERIFICATION",
      },
    }),

    prisma.citizen_complaints.count({
      where: {
        status: "OTP_SENT",
      },
    }),

    prisma.citizen_complaints.count({
      where: {
        status: "CLOSED",
      },
    }),
  ]);

  return {
    total,
    pending,
    assigned,
    inProgress,
    readyForVerification,
    otpSent,
    closed,
  };
}

module.exports = {
  getComplaints,
  getComplaintByTicket,
  getComplaintKPIs,
};
