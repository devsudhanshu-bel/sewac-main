const { PrismaClient } = require("../generated/cmads");

const prisma = new PrismaClient();

const checkTemporaryPermission = (moduleName) => {
  return async (req, res, next) => {
    try {
      const adminId = req.user.id;

      const target = req.params.phoneNumber;
      console.log("===== Permission Check =====");
      console.log("Admin ID:", adminId);
      console.log("Module:", moduleName);
      console.log("Target:", target);

      const permission = await prisma.temporary_permissions.findFirst({
        where: {
          admin_id: adminId,
          module: moduleName,
          target_identifier: target,
        },
      });
      console.log("Permission Found:", permission);
      if (!permission) {
        return res.status(403).json({
          success: false,

          message: "Permission denied.",
        });
      }

      if (permission.expires_at < new Date()) {
        return res.status(403).json({
          success: false,

          message: "Permission expired.",
        });
      }

      next();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  };
};

module.exports = checkTemporaryPermission;
