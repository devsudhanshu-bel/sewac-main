const { PrismaClient } = require("../generated/cmads");
const axios = require("axios");
const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");

const requestPermission = async (req) => {
  const {
    requested_by_admin_id,

    module,

    action,

    target_identifier,

    reason,
  } = req.body;

  const request = await prisma.edit_requests.create({
    data: {
      requested_by_admin_id,

      module,

      action,

      target_identifier,

      reason,
    },
  });

  const approvalToken = jwt.sign(
    {
      requestId: request.id,

      adminId: requested_by_admin_id,

      module,

      action,

      target: target_identifier,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "3d",
    },
  );

  await axios.post(process.env.CMADS_EMAIL_API, {
    requesterName: "Admin Level 2",

    requesterEmail: "admin2@sewac.in",

    module,

    action,

    target: target_identifier,

    reason,

    approveLink: `${process.env.SEWAC_API}/api/permissions/approve/${approvalToken}`,

    rejectLink: `${process.env.SEWAC_API}/api/permissions/reject/${approvalToken}`,
  });

  return {
    ...request,

    approvalToken,
  };
};

const approvePermission = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const request = await prisma.edit_requests.findUnique({
    where: {
      id: decoded.requestId,
    },
  });

  if (!request) {
    throw new Error("Permission request not found");
  }
  if (request.status === "APPROVED") {
    throw new Error("This request has already been approved.");
  }

  if (request.status === "REJECTED") {
    throw new Error("This request has already been rejected.");
  }

  const approvedRequest = await prisma.edit_requests.update({
    where: {
      id: request.id,
    },

    data: {
      status: "APPROVED",

      approved_at: new Date(),
    },
  });

  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + 3);

  await prisma.temporary_permissions.upsert({
    where: {
      admin_id_module_target_identifier: {
        admin_id: request.requested_by_admin_id,

        module: request.module,

        target_identifier: request.target_identifier,
      },
    },

    update: {
      expires_at: expiresAt,
    },

    create: {
      admin_id: request.requested_by_admin_id,

      module: request.module,

      target_identifier: request.target_identifier,

      expires_at: expiresAt,
    },
  });

  return approvedRequest;
};

module.exports = {
  requestPermission,
  approvePermission,
};
