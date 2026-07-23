const ROLE_ACCESS = require("../config/permissions");

const getPermissionsByRole = (role) => {
  return ROLE_ACCESS[role] || {};
};

module.exports = {
  getPermissionsByRole,
};