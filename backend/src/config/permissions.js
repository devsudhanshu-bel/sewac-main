const ROLE_ACCESS = {
  ADMIN_LAYER_1: {
    overview: true,
    waste_generators: true,
    vehicles: true,
    plants: true,
    logs: true,
    audit_logs: true,
    edit_logs: true,
    rag: true,
    users: true,
    settings: true,

    canEdit: true,
    canDelete: true,
    sensitiveAccess: true
  },

  ADMIN_LAYER_2: {
    overview: true,
    waste_generators: true,
    vehicles: true,
    plants: true,
    logs: true,
    audit_logs: true,
    edit_logs: false,
    rag: true,
    users: true,
    settings: true,

    canEdit: false,
    canDelete: false,
    sensitiveAccess: false
  },

  WORKER: {
    overview: true,
    waste_generators: false,
    vehicles: true,
    plants: true,
    logs: true,
    audit_logs: false,
    edit_logs: false,
    rag: false,
    users: false,
    settings: true,

    canEdit: false,
    canDelete: false,
    sensitiveAccess: false
  }
};

module.exports = ROLE_ACCESS;