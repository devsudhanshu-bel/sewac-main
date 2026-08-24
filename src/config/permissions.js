const ROLE_ACCESS = {
  ADMIN_LAYER_1: {
    overview: true,
    waste_generators: true,
    vehicles: true,
    plants: true,
    complaints: true,
    users: true,

    canEdit: true,
    canDelete: true,
    sensitiveAccess: true
  },

  ADMIN_LAYER_2: {
    overview: true,
    waste_generators: true,
    vehicles: true,
    plants: true,
    complaints: true,
    users: true,

    canEdit: true,
    canDelete: true,
    sensitiveAccess: false
  },

  WORKER: {
    overview: true,
    waste_generators: false,
    vehicles: true,
    plants: true,
    complaints: false,
    users: false,

    canEdit: false,
    canDelete: false,
    sensitiveAccess: false
  }
};

module.exports = ROLE_ACCESS;