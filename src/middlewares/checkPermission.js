const ROLE_ACCESS = require("../config/permissions");

module.exports = (pageKey) => {
  return (req, res, next) => {
    const role = req.user.role;

    const permissions = ROLE_ACCESS[role];

    if (!permissions?.[pageKey]) {
      return res.status(403).json({
        error: "Access denied"
      });
    }

    next();
  };
};