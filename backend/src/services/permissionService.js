const { PrismaClient } = require("../generated/cmads");

const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");
const {sendPermissionApprovalEmail} = require("./emailService");

const requestPermission = async (req) => {

  const {
    requested_by_admin_id,
    module,
    action,
    target_identifier,
    reason,
  } = req.body;

  // Save request
  const request = await prisma.edit_requests.create({
    data: {
      requested_by_admin_id,
      module,
      action,
      target_identifier,
      reason,
    },
  });

  // Generate approval token
  const approvalToken = jwt.sign(
    {
      requestId: request.id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );

  // Save token
  await prisma.edit_requests.update({
    where: {
      id: request.id,
    },
    data: {
      approval_token: approvalToken,
    },
  });

  return {
    request,
    approvalToken,
  };
};