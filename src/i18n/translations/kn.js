const kn = {
  common: {
    search: "ಹುಡುಕಿ...",
    save: "ಉಳಿಸಿ",
    cancel: "ರದ್ದುಮಾಡಿ",
    delete: "ಅಳಿಸಿ",
    edit: "ತಿದ್ದು",
    add: "ಸೇರಿಸಿ",
    close: "ಮುಚ್ಚಿ",
    apply: "ಅನ್ವಯಿಸಿ",
    reset: "ಮರುಹೊಂದಿಸಿ",
    yes: "ಹೌದು",
    no: "ಇಲ್ಲ",
    active: "ಸಕ್ರಿಯ",
    inactive: "ನಿಷ್ಕ್ರಿಯ",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    actions: "ಕ್ರಿಯೆಗಳು",
    all: "ಎಲ್ಲಾ",
    total: "ಒಟ್ಟು",
    included: "ಒಳಗೊಂಡಿದೆ",
  },

  language: {
    english: "ಇಂಗ್ಲಿಷ್",
    kannada: "ಕನ್ನಡ",
    hindi: "ಹಿಂದಿ",
  },

  header: {
    search: "ಹುಡುಕಿ...",
    date: "19 ಆಗಸ್ಟ್ 2026",
    dryDay: "ಒಣ ದಿನ",
    wetDay: "ಒದ್ದೆ ದಿನ",
    admin: "ನಿರ್ವಾಹಕ",
    adminLevel: "ನಿರ್ವಾಹಕ ಹಂತ 1",
  },

  sidebar: {
    overview: "ಅವಲೋಕನ",
    wasteGenerators: "ತ್ಯಾಜ್ಯ ಉತ್ಪಾದಕರು",
    vehicles: "ವಾಹನಗಳು",
    plant: "ಸಂಸ್ಕರಣಾ ಘಟಕ",
    complaints: "ದೂರುಗಳು",
    users: "ಬಳಕೆದಾರರು",
    logs: "ಲಾಗ್‌ಗಳು",
    aiAgent: "AI ಏಜೆಂಟ್",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    logout: "ಲಾಗ್‌ಔಟ್",
  },

  filters: {
    city: "ಬೆಂಗಳೂರು",
    corporation: "ಬೆಂಗಳೂರು ದಕ್ಷಿಣ ನಗರ ಪಾಲಿಕೆ",
    zone: "ಬೊಮ್ಮನಹಳ್ಳಿ",
    ward: "ಇಬ್ಬಲೂರು",
  },

  overview: {
    title: "ಅವಲೋಕನ",

    kpis: {
      totalWasteCollected: "ಒಟ್ಟು ಸಂಗ್ರಹಿಸಿದ ತ್ಯಾಜ್ಯ",
      collectionPoints: "ಸಂಗ್ರಹಣಾ ಕೇಂದ್ರಗಳು",
      totalCitizens: "ಒಟ್ಟು ನಾಗರಿಕರು",

      citizensTrend: "ನಾಗರಿಕರ ಪ್ರವೃತ್ತಿ",
      trashGiven: "ತ್ಯಾಜ್ಯ ನೀಡಿದವರು",
      notGiven: "ತ್ಯಾಜ್ಯ ನೀಡದವರು",

      kg: "ಕೆಜಿ",
      ton: "ಟನ್",
      tons: "ಟನ್‌ಗಳು",
    },

    citizenTrend: {
      title: "ನಾಗರಿಕರ ಪ್ರವೃತ್ತಿ",
      trashGiven: "ತ್ಯಾಜ್ಯ ನೀಡಿದವರು",
      notGiven: "ತ್ಯಾಜ್ಯ ನೀಡದವರು",
    },

    vehicleFleet: {
      title: "ವಾಹನಗಳ ಸ್ಥಿತಿ",
      allVehicles: "ಎಲ್ಲಾ ವಾಹನಗಳು",
      included: "ಒಳಗೊಂಡಿದೆ",

      totalRegistered: "ನೋಂದಾಯಿತ ಒಟ್ಟು ವಾಹನಗಳು",
      running: "ಚಾಲನೆಯಲ್ಲಿರುವ ವಾಹನಗಳು",
      notRunning: "ಚಾಲನೆಯಲ್ಲಿಲ್ಲದ ವಾಹನಗಳು",
    },

    generationTrend: {
      title: "ತ್ಯಾಜ್ಯ ಉತ್ಪಾದನಾ ಪ್ರವೃತ್ತಿ",
      wasteGenerated: "ಉತ್ಪಾದಿಸಿದ ತ್ಯಾಜ್ಯ (ಟನ್)",
      wards: "ವಾರ್ಡ್‌ಗಳು",
    },

    cityOverviewMap: {
      title: "ನಗರ ಅವಲೋಕನ ನಕ್ಷೆ",
      mapFilters: "ನಕ್ಷೆ ಫಿಲ್ಟರ್‌ಗಳು",
      cityOverview: "ನಗರ ಅವಲೋಕನ ನಕ್ಷೆ",
      routeMaps: "ಮಾರ್ಗ ನಕ್ಷೆಗಳು",
      gvpPoints: "GVP ಪಾಯಿಂಟ್‌ಗಳು",
      collectionPoints: "ಸಂಗ್ರಹಣಾ ಕೇಂದ್ರಗಳು",
      vehicles: "ವಾಹನಗಳು",
      plants: "ಸಂಸ್ಕರಣಾ ಘಟಕಗಳು",
      wardBoundaries: "ವಾರ್ಡ್ ಗಡಿಗಳು",
    },
  },

  users: {
    title: "ಬಳಕೆದಾರರು",
    description: "ಸಿಸ್ಟಂನಲ್ಲಿ ಬಳಕೆದಾರರನ್ನು ರಚಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ.",

    admin: {
      title: "ನಿರ್ವಾಹಕ ಹಂತ 1 ಬಳಕೆದಾರರು",
      description:
        "ಸಿಸ್ಟಂಗೆ ಸಂಪೂರ್ಣ ಪ್ರವೇಶ ಹೊಂದಿರುವ ಇತರ ನಿರ್ವಾಹಕ ಹಂತ 1 ಬಳಕೆದಾರರನ್ನು ನಿರ್ವಹಿಸಿ.",
      search: "ಹೆಸರು, ಇಮೇಲ್ ಅಥವಾ ಫೋನ್ ಮೂಲಕ ಹುಡುಕಿ...",
      add: "ನಿರ್ವಾಹಕರನ್ನು ಸೇರಿಸಿ",
      name: "ನಿರ್ವಾಹಕರ ಹೆಸರು",
      email: "ಇಮೇಲ್",
      phone: "ಫೋನ್ ಸಂಖ್ಯೆ",
      status: "ಸ್ಥಿತಿ",
      createdAt: "ರಚಿಸಿದ ಸಮಯ",
    },

    contractor: {
      title: "ಗುತ್ತಿಗೆದಾರ ಬಳಕೆದಾರರು",
      description: "ಗುತ್ತಿಗೆದಾರ ಖಾತೆಗಳು ಮತ್ತು ಅನುಮತಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
      search: "ಗುತ್ತಿಗೆದಾರರನ್ನು ಹುಡುಕಿ...",
      add: "ಗುತ್ತಿಗೆದಾರರನ್ನು ಸೇರಿಸಿ",
      name: "ಹೆಸರು",
      email: "ಇಮೇಲ್",
      role: "ಪಾತ್ರ",
      lastLogin: "ಕೊನೆಯ ಲಾಗಿನ್",
      status: "ಸ್ಥಿತಿ",
    },
  },

  generationTrend: {
  title: "ತ್ಯಾಜ್ಯ ಉತ್ಪಾದನಾ ಪ್ರವೃತ್ತಿ",
  wasteGenerated: "ಉತ್ಪಾದಿಸಿದ ತ್ಯಾಜ್ಯ (ಟನ್)",
  wasteGeneratedLabel: "ಉತ್ಪಾದಿಸಿದ ತ್ಯಾಜ್ಯ",
  wards: "ವಾರ್ಡ್‌ಗಳು",
  ward: "ವಾರ್ಡ್",
},

units: {
  kg: "ಕೆಜಿ",
  ton: "ಟನ್",
  tons: "ಟನ್‌ಗಳು",
},

units: {
  kg: "ಕೆಜಿ",
  ton: "ಟನ್",
  tons: "ಟನ್‌ಗಳು",
},

wasteGenerators: {
  /* =========================================================
     PAGE
  ========================================================= */

  title: "ತ್ಯಾಜ್ಯ ಉತ್ಪಾದಕರು",

  description:
    "ತ್ಯಾಜ್ಯ ಉತ್ಪಾದಕರ ಭಾಗವಹಿಸುವಿಕೆ, ತ್ಯಾಜ್ಯ ಕೊಡುಗೆ, ಚಟುವಟಿಕೆ, ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು ಸಂಗ್ರಹಣಾ ಕಾರ್ಯಕ್ಷಮತೆಯ ಅವಲೋಕನ.",

  /* =========================================================
     KPIs
  ========================================================= */

  kpis: {
    generatorStatus: "ತ್ಯಾಜ್ಯ ಉತ್ಪಾದಕರ ಸ್ಥಿತಿ",

    activeGenerators: "ಸಕ್ರಿಯ ತ್ಯಾಜ್ಯ ಉತ್ಪಾದಕರು",

    inactiveGenerators: "ನಿಷ್ಕ್ರಿಯ ತ್ಯಾಜ್ಯ ಉತ್ಪಾದಕರು",

    totalWasteGenerated: "ಒಟ್ಟು ಉತ್ಪಾದಿಸಿದ ತ್ಯಾಜ್ಯ",

    averageWaste: "ಸರಾಸರಿ ತ್ಯಾಜ್ಯ",

    perHouseDay: "ಪ್ರತಿ ಮನೆ / ದಿನ",

    classification: "ತ್ಯಾಜ್ಯ ಉತ್ಪಾದಕರ ವರ್ಗೀಕರಣ",

    aboveAverage: "ಸರಾಸರಿಗಿಂತ ಹೆಚ್ಚು",

    belowAverage: "ಸರಾಸರಿಗಿಂತ ಕಡಿಮೆ",
  },

  /* =========================================================
     GVP
  ========================================================= */

  gvp: {
    title: "GVP ಉತ್ಪಾದನಾ ಪ್ರವೃತ್ತಿ",

    loading: "GVP ಡೇಟಾ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",

    empty:
      "ಆಯ್ಕೆ ಮಾಡಿದ ದಿನಾಂಕ ಮತ್ತು ವಿಭಾಗಕ್ಕೆ ಯಾವುದೇ GVP ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ.",

    error: "GVP ಪ್ರವೃತ್ತಿಯನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ",

    wardNo: "ವಾರ್ಡ್ ಸಂಖ್ಯೆ",

    gvp: "GVP",
  },

  /* =========================================================
     MAP
  ========================================================= */

  map: {
    title: "ಸಂಗ್ರಹಣಾ ಕೇಂದ್ರಗಳ ಮೇಲ್ವಿಚಾರಣೆ",

    points: "ಪಾಯಿಂಟ್‌ಗಳು",

    ward: "ವಾರ್ಡ್",

    selectedWard: "ಆಯ್ಕೆ ಮಾಡಿದ ವಾರ್ಡ್",

    /* ================= LEGEND ================= */

    legend: {
      collectionPoint: "ಸಂಗ್ರಹಣಾ ಕೇಂದ್ರ",

      gvpPoint: "GVP ಪಾಯಿಂಟ್",
    },

    /* ================= MAP STATES ================= */

    loading: "ದೈನಂದಿನ ವಾಹನ ಟೆಲಿಮೆಟ್ರಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",

    selectWard: "ವಾರ್ಡ್ ಆಯ್ಕೆಮಾಡಿ",

    selectWardDescription:
      "ಹೆಡರ್‌ನಿಂದ ನಗರ, ವಲಯ, ವಿಭಾಗ ಮತ್ತು ವಾರ್ಡ್ ಆಯ್ಕೆಮಾಡಿ.",

    mapUnavailable: "ನಕ್ಷೆ ಲಭ್ಯವಿಲ್ಲ",

    noBoundary:
      "ಈ ಆಯ್ಕೆಗೆ ವಾರ್ಡ್ ಗಡಿ ಲಭ್ಯವಿಲ್ಲ",

    noTelemetry:
      "ಈ ದಿನಾಂಕಕ್ಕೆ ಯಾವುದೇ ಟೆಲಿಮೆಟ್ರಿ ಪಾಯಿಂಟ್‌ಗಳಿಲ್ಲ",

    /* ================= MAP SUMMARY ================= */

    summary: {
      showing: "ತೋರಿಸಲಾಗುತ್ತಿದೆ",

      telemetryCoordinates:
        "ವಾಹನ ಟೇಬಲ್‌ಗಳಿಂದ ಟೆಲಿಮೆಟ್ರಿ ನಿರ್ದೇಶಾಂಕಗಳು",

      vehicleTables: "ವಾಹನ ಟೇಬಲ್‌ಗಳು",

      gvpPoints: "GVP ಪಾಯಿಂಟ್‌ಗಳು",
    },

    /* ================= ERRORS ================= */

    errors: {
      loadWardMap:
        "ಆಯ್ಕೆ ಮಾಡಿದ ವಾರ್ಡ್ ನಕ್ಷೆಯನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    },

    /* ================= TOOLTIP ================= */

    tooltip: {
      collectionVehicle: "ಸಂಗ್ರಹಣಾ ವಾಹನ",

      gvpPoint: "GVP ಪಾಯಿಂಟ್",

      vehicle: "ವಾಹನ",

      table: "ಟೇಬಲ್",

      iot: "IoT",

      unit: "ಘಟಕ",

      remarks: "ಟಿಪ್ಪಣಿಗಳು",

      gvpWaste: "GVP ತ್ಯಾಜ್ಯ",

      coordinates: "ನಿರ್ದೇಶಾಂಕಗಳು",
    },
  },
},

vehicles: {
  title: "ವಾಹನಗಳು",

  description:
    "ವಾಹನ ಪಡೆಯ ಸ್ಥಿತಿ, ಚಟುವಟಿಕೆ ಮತ್ತು ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹಣಾ ಕಾರ್ಯಕ್ಷಮತೆಯನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.",

  kpis: {
    totalVehicles: "ಒಟ್ಟು ವಾಹನಗಳು",
    activeVehicles: "ಸಕ್ರಿಯ ವಾಹನಗಳು",
    inactiveVehicles: "ನಿಷ್ಕ್ರಿಯ ವಾಹನಗಳು",
    averageWeight: "ಪ್ರತಿ ವಾಹನದ ಸರಾಸರಿ",
    weightCollection: "ತೂಕ ಸಂಗ್ರಹಣೆ",
  },

  averageWeightChart: {
    title: "ಸರಾಸರಿ ಉತ್ಪಾದಿಸಿದ ತ್ಯಾಜ್ಯ ತೂಕ (ಲೈನ್ ಗ್ರಾಫ್)",
    averageWasteGenerated: "ಸರಾಸರಿ ಉತ್ಪಾದಿಸಿದ ತ್ಯಾಜ್ಯ:",
    viewBy: "ಇದರ ಪ್ರಕಾರ ವೀಕ್ಷಿಸಿ:",
    city: "ನಗರ",
    weightOfWaste: "ತ್ಯಾಜ್ಯದ ತೂಕ (ಟನ್)",

    zoneName: "ವಲಯದ ಹೆಸರು",
    wasteGenerated: "ಉತ್ಪಾದಿಸಿದ ತ್ಯಾಜ್ಯ",
    vehiclesRunning: "ಚಾಲನೆಯಲ್ಲಿರುವ ವಾಹನಗಳು",
    difference: "ವ್ಯತ್ಯಾಸ",
    overThreshold: "ಮಿತಿಗಿಂತ ಹೆಚ್ಚು",
    belowThreshold: "ಮಿತಿಗಿಂತ ಕಡಿಮೆ",
    averageWaste: "ಸರಾಸರಿ ತ್ಯಾಜ್ಯ",

    wasteGeneratedLegend: "ಉತ್ಪಾದಿಸಿದ ತ್ಯಾಜ್ಯ (ಟನ್)",
    thresholdLegend:
      "ಸರಾಸರಿ ಉತ್ಪಾದಿಸಿದ ತ್ಯಾಜ್ಯ (ಮಿತಿ)",
  },

  telemetryDirectory: {
    title: "ಟೆಲಿಮೆಟ್ರಿ ಡೈರೆಕ್ಟರಿ",

    searchPlaceholder: "ವಾಹನ ID ಮೂಲಕ ಹುಡುಕಿ",

    allStatus: "ಎಲ್ಲಾ ಸ್ಥಿತಿಗಳು",
    active: "ಸಕ್ರಿಯ",
    inactive: "ನಿಷ್ಕ್ರಿಯ",

    download: "ಡೌನ್‌ಲೋಡ್",

    createVehicle: "ವಾಹನವನ್ನು ರಚಿಸಿ",

    vehicleId: "ವಾಹನ ID",
    routeZone: "ಮಾರ್ಗ / ವಲಯ",
    lastUpdate: "ಕೊನೆಯ ನವೀಕರಣ",
    status: "ಸ್ಥಿತಿ",
    actions: "ಕ್ರಿಯೆಗಳು",

    action: "ಕ್ರಿಯೆ",
    update: "ನವೀಕರಿಸಿ",
    delete: "ಅಳಿಸಿ",

    showing: "ತೋರಿಸಲಾಗುತ್ತಿದೆ",
    to: "ರಿಂದ",
    of: "ಒಟ್ಟು",
    vehicles: "ವಾಹನಗಳು",

    rowsPerPage: "ಪ್ರತಿ ಪುಟದ ಸಾಲುಗಳು:",

    csv: {
      vehicleId: "ವಾಹನ ID",
      vehicleNumber: "ವಾಹನ ಸಂಖ್ಯೆ",
      vehicleType: "ವಾಹನ ಪ್ರಕಾರ",
      city: "ನಗರ",
      zone: "ವಲಯ",
      division: "ವಿಭಾಗ",
      ward: "ವಾರ್ಡ್",
      status: "ಸ್ಥಿತಿ",
    },
  },



createVehicle: {
  title: "ವಾಹನವನ್ನು ರಚಿಸಿ",

  close: "ಮುಚ್ಚಿ",

  vehicleId: "ವಾಹನ ID",
  vehicleType: "ವಾಹನ ಪ್ರಕಾರ",

  types: {
    miniTruck: "ಮಿನಿ ಟ್ರಕ್",
    autoTipper: "ಆಟೋ ಟಿಪ್ಪರ್",
    compactor: "ಕಾಂಪ್ಯಾಕ್ಟರ್",
    dumper: "ಡಂಪರ್",
  },

  active: "ಸಕ್ರಿಯ",
  inactive: "ನಿಷ್ಕ್ರಿಯ",

  selectCity: "ನಗರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
  selectZone: "ವಲಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
  selectDivision: "ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
  selectWard: "ವಾರ್ಡ್ ಆಯ್ಕೆಮಾಡಿ",

  cancel: "ರದ್ದುಮಾಡಿ",
  create: "ರಚಿಸಿ",

  validation: "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.",
  createFailed: "ವಾಹನವನ್ನು ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ",
},
},

plants: {
  title: "ಪ್ಲಾಂಟ್ ಅವಲೋಕನ",

  description:
    "ಎಲ್ಲಾ ತ್ಯಾಜ್ಯ ಸಂಸ್ಕರಣಾ ಪ್ಲಾಂಟ್‌ಗಳು ಮತ್ತು ಅವುಗಳ ಕಾರ್ಯಾಚರಣೆಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.",

  loading: "ಪ್ಲಾಂಟ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",

  retry: "ಮರುಪ್ರಯತ್ನಿಸಿ",

  errors: {
    serverConnection:
      "ಸರ್ವರ್‌ಗೆ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
  },
},
};

export default kn;