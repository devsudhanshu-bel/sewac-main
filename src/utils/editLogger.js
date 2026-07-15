const prisma = require("../config/sewacPrisma");

const logEdit = async ({
  user,
  req,
  module,
  action,
  recordId = null,
  description
}) => {
  try {
    await prisma.edit_logs.create({
      data: {
        performed_by: user.full_name,
        performed_by_id: user.id,
        role: user.role,
        module,
        action,
        record_id: recordId,
        description,
        ip_address: req.ip
      }
    });

  } catch (error) {
    console.error("Edit Logger Error:", error);
  }
};

module.exports = logEdit;