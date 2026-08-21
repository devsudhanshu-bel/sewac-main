const ROLE_ACCESS = require("../config/permissions");

module.exports = (action) => {
  return (req, res, next) => {
    const role = req.user?.role;

    const permissions = ROLE_ACCESS[role];

    if (!permissions) {
      return res.status(403).json({
        success: false,
        error: "Access denied",
      });
    }

    if (action === "EDIT" && !permissions.canEdit) {
      return res.status(403).json({
        success: false,
        error: "Edit permission denied",
      });
    }

    if (action === "DELETE" && !permissions.canDelete) {
      return res.status(403).json({
        success: false,
        error: "Delete permission denied",
      });
    }

    next();
  };
};
