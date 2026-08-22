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

    totalWasteGenerated: "ಒಟ್ಟು ಉತ್ಪಾದಿತ ತ್ಯಾಜ್ಯ",

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
    title: "ಸಂಗ್ರಹಣಾ ಬಿಂದುಗಳ ಮೇಲ್ವಿಚಾರಣೆ",

    points: "ಬಿಂದುಗಳು",

    ward: "ವಾರ್ಡ್",

    selectedWard: "ಆಯ್ಕೆ ಮಾಡಿದ ವಾರ್ಡ್",

    /* ================= LEGEND ================= */

    legend: {
      collectionPoint: "ಸಂಗ್ರಹಣಾ ಬಿಂದು",

      gvpPoint: "GVP ಬಿಂದು",
    },

    /* ================= MAP STATES ================= */

    loading: "ದೈನಂದಿನ ವಾಹನ ಟೆಲಿಮೆಟ್ರಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",

    selectWard: "ಒಂದು ವಾರ್ಡ್ ಆಯ್ಕೆಮಾಡಿ",

    selectWardDescription:
      "ಹೆಡರ್‌ನಿಂದ ನಗರ, ವಲಯ, ವಿಭಾಗ ಮತ್ತು ವಾರ್ಡ್ ಆಯ್ಕೆಮಾಡಿ.",

    mapUnavailable: "ನಕ್ಷೆ ಲಭ್ಯವಿಲ್ಲ",

    noBoundary:
      "ಈ ಆಯ್ಕೆಗೆ ವಾರ್ಡ್ ಗಡಿ ಲಭ್ಯವಿಲ್ಲ",

    noTelemetry:
      "ಈ ದಿನಾಂಕಕ್ಕೆ ಯಾವುದೇ ಟೆಲಿಮೆಟ್ರಿ ಬಿಂದುಗಳು ಲಭ್ಯವಿಲ್ಲ",

    /* ================= MAP SUMMARY ================= */

    summary: {
      showing: "ತೋರಿಸಲಾಗುತ್ತಿದೆ",

      telemetryCoordinates:
        "ಟೆಲಿಮೆಟ್ರಿ ನಿರ್ದೇಶಾಂಕಗಳು",

      vehicleTables: "ವಾಹನ ಪಟ್ಟಿಕೆಗಳು",

      gvpPoints: "GVP ಬಿಂದುಗಳು",
    },

    /* ================= ERRORS ================= */

    errors: {
      loadWardMap:
        "ಆಯ್ಕೆ ಮಾಡಿದ ವಾರ್ಡ್‌ನ ನಕ್ಷೆಯನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    },

    /* ================= TOOLTIP ================= */

    tooltip: {
      collectionVehicle: "ಸಂಗ್ರಹಣಾ ವಾಹನ",

      gvpPoint: "GVP ಬಿಂದು",

      vehicle: "ವಾಹನ",

      table: "ಪಟ್ಟಿಕೆ",

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
    "ವಾಹನಗಳ ಸ್ಥಿತಿ, ಚಟುವಟಿಕೆ ಮತ್ತು ತ್ಯಾಜ್ಯ ಸಂಗ್ರಹಣಾ ಕಾರ್ಯಕ್ಷಮತೆಯನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.",

  kpis: {
    totalVehicles: "ಒಟ್ಟು ವಾಹನಗಳು",
    activeVehicles: "ಸಕ್ರಿಯ ವಾಹನಗಳು",
    inactiveVehicles: "ನಿಷ್ಕ್ರಿಯ ವಾಹನಗಳು",
    averageWeight: "ಪ್ರತಿ ವಾಹನದ ಸರಾಸರಿ",
    weightCollection: "ತೂಕ ಸಂಗ್ರಹಣೆ",
  },

  averageWeightChart: {
    title:
      "ಸರಾಸರಿ ಉತ್ಪಾದಿತ ತೂಕ (ಲೈನ್ ಗ್ರಾಫ್)",

    averageWasteGenerated:
      "ಸರಾಸರಿ ಉತ್ಪಾದಿತ ತ್ಯಾಜ್ಯ:",

    viewBy:
      "ಇದರ ಮೂಲಕ ವೀಕ್ಷಿಸಿ:",

    city:
      "ನಗರ",

    weightOfWaste:
      "ತ್ಯಾಜ್ಯದ ತೂಕ (ಟನ್)",

    zoneName:
      "ವಲಯದ ಹೆಸರು",

    wasteGenerated:
      "ಉತ್ಪಾದಿತ ತ್ಯಾಜ್ಯ",

    vehiclesRunning:
      "ಚಾಲನೆಯಲ್ಲಿರುವ ವಾಹನಗಳು",

    difference:
      "ವ್ಯತ್ಯಾಸ",

    overThreshold:
      "ಮಿತಿಗಿಂತ ಹೆಚ್ಚು",

    belowThreshold:
      "ಮಿತಿಗಿಂತ ಕಡಿಮೆ",

    averageWaste:
      "ಸರಾಸರಿ ತ್ಯಾಜ್ಯ",

    wasteGeneratedLegend:
      "ಉತ್ಪಾದಿತ ತ್ಯಾಜ್ಯ (ಟನ್)",

    thresholdLegend:
      "ಸರಾಸರಿ ಉತ್ಪಾದಿತ ತ್ಯಾಜ್ಯ (ಮಿತಿ)",
  },

  telemetryDirectory: {
    title:
      "ಟೆಲಿಮೆಟ್ರಿ ಡೈರೆಕ್ಟರಿ",

    searchPlaceholder:
      "ವಾಹನ ID ಮೂಲಕ ಹುಡುಕಿ",

    allStatus:
      "ಎಲ್ಲಾ ಸ್ಥಿತಿಗಳು",

    active:
      "ಸಕ್ರಿಯ",

    inactive:
      "ನಿಷ್ಕ್ರಿಯ",

    download:
      "ಡೌನ್‌ಲೋಡ್",

    createVehicle:
      "ವಾಹನ ರಚಿಸಿ",

    vehicleId:
      "ವಾಹನ ID",

    routeZone:
      "ಮಾರ್ಗ / ವಲಯ",

    lastUpdate:
      "ಕೊನೆಯ ನವೀಕರಣ",

    status:
      "ಸ್ಥಿತಿ",

    actions:
      "ಕ್ರಿಯೆಗಳು",

    action:
      "ಕ್ರಿಯೆ",

    update:
      "ನವೀಕರಿಸಿ",

    delete:
      "ಅಳಿಸಿ",

    noVehicles:
      "ಯಾವುದೇ ವಾಹನಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",

    showing:
      "ತೋರಿಸಲಾಗುತ್ತಿದೆ",

    to:
      "ರಿಂದ",

    of:
      "ರಲ್ಲಿ",

    vehicles:
      "ವಾಹನಗಳು",

    rowsPerPage:
      "ಪ್ರತಿ ಪುಟದ ಸಾಲುಗಳು:",

    csv: {
      vehicleId:
        "ವಾಹನ ID",

      vehicleNumber:
        "ವಾಹನ ಸಂಖ್ಯೆ",

      vehicleType:
        "ವಾಹನ ಪ್ರಕಾರ",

      city:
        "ನಗರ",

      zone:
        "ವಲಯ",

      division:
        "ವಿಭಾಗ",

      ward:
        "ವಾರ್ಡ್",

      status:
        "ಸ್ಥಿತಿ",
    },
  },

  /* =========================================================
     CREATE VEHICLE
  ========================================================= */

  createVehicle: {
    title:
      "ವಾಹನ ರಚಿಸಿ",

    close:
      "ಮುಚ್ಚಿ",

    vehicleId:
      "ವಾಹನ ID",

    vehicleType:
      "ವಾಹನ ಪ್ರಕಾರ",

    active:
      "ಸಕ್ರಿಯ",

    inactive:
      "ನಿಷ್ಕ್ರಿಯ",

    selectCity:
      "ನಗರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",

    selectZone:
      "ವಲಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",

    selectDivision:
      "ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",

    selectWard:
      "ವಾರ್ಡ್ ಆಯ್ಕೆಮಾಡಿ",

    types: {
      miniTruck:
        "ಮಿನಿ ಟ್ರಕ್",

      autoTipper:
        "ಆಟೋ ಟಿಪ್ಪರ್",

      compactor:
        "ಕಾಂಪ್ಯಾಕ್ಟರ್",

      dumper:
        "ಡಂಪರ್",
    },

    validation:
      "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.",

    cancel:
      "ರದ್ದುಮಾಡಿ",

    create:
      "ರಚಿಸಿ",

    errors: {
      createFailed:
        "ವಾಹನವನ್ನು ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    },
  },

  /* =========================================================
     EDIT VEHICLE
  ========================================================= */

  editVehicle: {
    title:
      "ವಾಹನವನ್ನು ನವೀಕರಿಸಿ",

    vehicleId:
      "ವಾಹನ ID",

    vehicleType:
      "ವಾಹನ ಪ್ರಕಾರ",

    active:
      "ಸಕ್ರಿಯ",

    inactive:
      "ನಿಷ್ಕ್ರಿಯ",

    selectCity:
      "ನಗರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",

    selectZone:
      "ವಲಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",

    selectDivision:
      "ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",

    selectWard:
      "ವಾರ್ಡ್ ಆಯ್ಕೆಮಾಡಿ",

    cancel:
      "ರದ್ದುಮಾಡಿ",

    update:
      "ನವೀಕರಿಸಿ",

    errors: {
      updateFailed:
        "ವಾಹನವನ್ನು ನವೀಕರಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    },
  },

  /* =========================================================
     DELETE VEHICLE
  ========================================================= */

  deleteVehicle: {
    title:
      "ವಾಹನ ಅಳಿಸಿ",

    confirmation:
      "ಈ ವಾಹನವನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?",

    cancel:
      "ರದ್ದುಮಾಡಿ",

    delete:
      "ಅಳಿಸಿ",

    errors: {
      deleteFailed:
        "ವಾಹನವನ್ನು ಅಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    },
  },
},

plants: {
  title:
    "ಸಸ್ಯಗಳ ಅವಲೋಕನ",

  description:
    "ಎಲ್ಲಾ ತ್ಯಾಜ್ಯ ಸಂಸ್ಕರಣಾ ಸಸ್ಯಗಳು ಮತ್ತು ಅವುಗಳ ಕಾರ್ಯಾಚರಣೆಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.",

  loading:
    "ಸಸ್ಯಗಳ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",

  retry:
    "ಮರುಪ್ರಯತ್ನಿಸಿ",

  errors: {
    serverConnection:
      "ಸರ್ವರ್‌ಗೆ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",

    createFailed:
      "ಸಸ್ಯವನ್ನು ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",

    updateFailed:
      "ಸಸ್ಯವನ್ನು ನವೀಕರಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",

    deleteFailed:
      "ಸಸ್ಯವನ್ನು ಅಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
  },

  kpis: {
    totalPlants:
      "ಒಟ್ಟು ಸಸ್ಯಗಳು",

    allRegisteredPlants:
      "ನೋಂದಾಯಿಸಲಾದ ಎಲ್ಲಾ ಸಸ್ಯಗಳು",

    totalVehiclesEnrolled:
      "ನೋಂದಾಯಿಸಲಾದ ಒಟ್ಟು ವಾಹನಗಳು",

    acrossAllPlants:
      "ಎಲ್ಲಾ ಸಸ್ಯಗಳಾದ್ಯಂತ",

    totalWasteCollected:
      "ಸಂಗ್ರಹಿಸಲಾದ ಒಟ್ಟು ತ್ಯಾಜ್ಯ",

    allTimeCollection:
      "ಇದುವರೆಗೆ ಸಂಗ್ರಹಣೆ",
  },

  directory: {
    title:
      "ಸಸ್ಯಗಳ ಡೈರೆಕ್ಟರಿ",

    addPlant:
      "ಸಸ್ಯವನ್ನು ಸೇರಿಸಿ",

    plantName:
      "ಸಸ್ಯದ ಹೆಸರು",

    zone:
      "ವಲಯ",

    capacity:
      "ಸಾಮರ್ಥ್ಯ (ಟನ್/ದಿನ)",

    plantManager:
      "ಸಸ್ಯ ವ್ಯವಸ್ಥಾಪಕರು",

    vehiclesEnrolled:
      "ನೋಂದಾಯಿಸಲಾದ ವಾಹನಗಳು",

    actions:
      "ಕ್ರಿಯೆಗಳು",

    updatePlant:
      "ಸಸ್ಯವನ್ನು ನವೀಕರಿಸಿ",

    deletePlant:
      "ಸಸ್ಯವನ್ನು ಅಳಿಸಿ",

    noPlants:
      "ಯಾವುದೇ ಸಸ್ಯಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",

    showing:
      "ತೋರಿಸಲಾಗುತ್ತಿದೆ",

    of:
      "ರಲ್ಲಿ",

    plants:
      "ಸಸ್ಯಗಳು",

    rowsPerPage:
      "ಪ್ರತಿ ಪುಟದ ಸಾಲುಗಳು",
  },

  createPlant: {
    title:
      "ಸಸ್ಯವನ್ನು ರಚಿಸಿ",

    plantName:
      "ಸಸ್ಯದ ಹೆಸರು",

    plantType:
      "ಸಸ್ಯದ ಪ್ರಕಾರ",

    city:
      "ನಗರ",

    zone:
      "ವಲಯ",

    division:
      "ವಿಭಾಗ",

    ward:
      "ವಾರ್ಡ್",

    plantManager:
      "ಸಸ್ಯ ವ್ಯವಸ್ಥಾಪಕರು",

    capacity:
      "ಸಾಮರ್ಥ್ಯ (ಟನ್/ದಿನ)",

    vehiclesEnrolled:
      "ನೋಂದಾಯಿಸಲಾದ ವಾಹನಗಳು",

    wasteCollected:
      "ಸಂಗ್ರಹಿಸಲಾದ ತ್ಯಾಜ್ಯ",

    latitude:
      "ಅಕ್ಷಾಂಶ",

    longitude:
      "ರೇಖಾಂಶ",

    active:
      "ಸಕ್ರಿಯ",

    inactive:
      "ನಿಷ್ಕ್ರಿಯ",

    cancel:
      "ರದ್ದುಮಾಡಿ",

    create:
      "ರಚಿಸಿ",

    errors: {
      createFailed:
        "ಸಸ್ಯವನ್ನು ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    },
  },

  editPlant: {
    title:
      "ಸಸ್ಯವನ್ನು ನವೀಕರಿಸಿ",

    plantName:
      "ಸಸ್ಯದ ಹೆಸರು",

    plantType:
      "ಸಸ್ಯದ ಪ್ರಕಾರ",

    city:
      "ನಗರ",

    zone:
      "ವಲಯ",

    division:
      "ವಿಭಾಗ",

    ward:
      "ವಾರ್ಡ್",

    plantManager:
      "ಸಸ್ಯ ವ್ಯವಸ್ಥಾಪಕರು",

    capacity:
      "ಸಾಮರ್ಥ್ಯ",

    vehiclesEnrolled:
      "ನೋಂದಾಯಿಸಲಾದ ವಾಹನಗಳು",

    wasteCollected:
      "ಸಂಗ್ರಹಿಸಲಾದ ತ್ಯಾಜ್ಯ",

    latitude:
      "ಅಕ್ಷಾಂಶ",

    longitude:
      "ರೇಖಾಂಶ",

    active:
      "ಸಕ್ರಿಯ",

    inactive:
      "ನಿಷ್ಕ್ರಿಯ",

    cancel:
      "ರದ್ದುಮಾಡಿ",

    update:
      "ನವೀಕರಿಸಿ",

    errors: {
      updateFailed:
        "ಸಸ್ಯವನ್ನು ನವೀಕರಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    },
  },

  deletePlant: {
    title:
      "ಸಸ್ಯವನ್ನು ಅಳಿಸಿ",

    confirmation:
      "ಈ ಸಸ್ಯವನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?",

    cancel:
      "ರದ್ದುಮಾಡಿ",

    delete:
      "ಅಳಿಸಿ",

    errors: {
      deleteFailed:
        "ಸಸ್ಯವನ್ನು ಅಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    },
  },

  /*
   * =========================================================
   * PLANT MAP
   * =========================================================
   */

  map: {
    title:
      "ಸಸ್ಯಗಳ ಸ್ಥಳಗಳು",

    subtitle:
      "ತ್ಯಾಜ್ಯ ಸಂಸ್ಕರಣಾ ಸಸ್ಯಗಳು",

    maximize:
      "ನಕ್ಷೆಯನ್ನು ದೊಡ್ಡದಾಗಿಸಿ",

    loading:
      "ಸಸ್ಯಗಳ ಸ್ಥಳಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",

    empty:
      "ಯಾವುದೇ ಸಸ್ಯ ಸ್ಥಳಗಳು ಲಭ್ಯವಿಲ್ಲ",

    unnamedPlant:
      "ಹೆಸರಿಲ್ಲದ ಸಸ್ಯ",

    notAssigned:
      "ನಿಯೋಜಿಸಲಾಗಿಲ್ಲ",

    unknown:
      "ಅಜ್ಞಾತ",

    vehicles:
      "ವಾಹನಗಳು",

    tonPerDay:
      "ಟನ್/ದಿನ",
  },
},

users: {
  title: "ಬಳಕೆದಾರರು",

  description:
    "ವ್ಯವಸ್ಥೆಯಲ್ಲಿನ ಬಳಕೆದಾರರನ್ನು ರಚಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ.",

  footer:
    "© 2026 SEWAC. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
},

complaints: {
  /* =========================================================
     PAGE
  ========================================================= */

  title: "ದೂರುಗಳು",

  description:
    "ನಾಗರಿಕರ ದೂರುಗಳನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ",

  /* =========================================================
     TABLE
  ========================================================= */

  table: {
    title: "ದೂರುಗಳು",

    complaint: "ದೂರು",

    found: "ಕಂಡುಬಂದಿವೆ",

    updating: "ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...",

    location: "ಸ್ಥಳ",

    createdAt: "ರಚಿಸಿದ ದಿನಾಂಕ",

    loading:
      "ದೂರುಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",

    empty:
      "ಯಾವುದೇ ದೂರುಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",

    showing:
      "ತೋರಿಸಲಾಗುತ್ತಿದೆ",

    to: "ರಿಂದ",

    of: "ರಲ್ಲಿ",

    complaints: "ದೂರುಗಳು",

    previousPage:
      "ಹಿಂದಿನ ಪುಟ",

    nextPage:
      "ಮುಂದಿನ ಪುಟ",
  },

  /* =========================================================
     FILTERS
  ========================================================= */

  filters: {
    searchPlaceholder:
      "ಟಿಕೆಟ್, ಫೋನ್, ಶೀರ್ಷಿಕೆ, ವಿಳಾಸದ ಮೂಲಕ ಹುಡುಕಿ...",

    category: "ವರ್ಗ",

    all: "ಎಲ್ಲಾ",

    to: "ಗೆ",

    reset:
      "ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಮರುಹೊಂದಿಸಿ",

    categories: {
      missedCollection:
        "ಸಂಗ್ರಹಣೆ ತಪ್ಪಿದೆ",

      overflowingBin:
        "ತುಂಬಿ ಹರಿಯುತ್ತಿರುವ ಬಿನ್",

      illegalDumping:
        "ಅಕ್ರಮ ಕಸ ಸುರಿತ",

      streetLitter:
        "ರಸ್ತೆ ಕಸ",

      damagedBin:
        "ಹಾನಿಗೊಳಗಾದ ಬಿನ್",

      other:
        "ಇತರೆ",
    },
  },

  /* =========================================================
     DETAILS
  ========================================================= */

  details: {
    empty: {
      title:
        "ದೂರು ಆಯ್ಕೆಮಾಡಿ",

      description:
        "ವಿವರಗಳನ್ನು ನೋಡಲು ಪಟ್ಟಿಯಿಂದ ಒಂದು ದೂರನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    },

    ticketNumber:
      "ಟಿಕೆಟ್ ಸಂಖ್ಯೆ",

    title:
      "ಶೀರ್ಷಿಕೆ",

    category:
      "ವರ್ಗ",

    citizenPhone:
      "ನಾಗರಿಕ (ಫೋನ್)",

    address:
      "ವಿಳಾಸ",

    coordinates:
      "ನಿರ್ದೇಶಾಂಕಗಳು",

    complaintImage:
      "ದೂರಿನ ಚಿತ್ರ",

    imageAlt:
      "ದೂರು",

    noImage:
      "ದೂರಿನ ಯಾವುದೇ ಚಿತ್ರವಿಲ್ಲ",

    description:
      "ವಿವರಣೆ",

    noDescription:
      "ಯಾವುದೇ ವಿವರಣೆ ಲಭ್ಯವಿಲ್ಲ.",

    status:
      "ಸ್ಥಿತಿ",

    remarks:
      "ಟಿಪ್ಪಣಿಗಳು",

    closedVerified:
      "ಮುಚ್ಚಲಾಗಿದೆ — ನಾಗರಿಕರಿಂದ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",

    verificationOtpSent:
      "ಪರಿಶೀಲನೆ OTP ಕಳುಹಿಸಲಾಗಿದೆ",

    enterOtp:
      "ಪರಿಶೀಲನೆ OTP ನಮೂದಿಸಿ",

    closedMessage:
      "ನಾಗರಿಕರ ಯಶಸ್ವಿ ಪರಿಶೀಲನೆಯ ನಂತರ ದೂರು ಮುಚ್ಚಲಾಗಿದೆ.",

    statusOptions: {
      pending:
        "ಬಾಕಿಯಿದೆ",

      readyForVerification:
        "ಪರಿಶೀಲನೆಗೆ ಸಿದ್ಧವಾಗಿದೆ",

      otpSent:
        "OTP ಕಳುಹಿಸಲಾಗಿದೆ",

      inProgress:
        "ಪ್ರಗತಿಯಲ್ಲಿದೆ",

      assigned:
        "ನಿಯೋಜಿಸಲಾಗಿದೆ",

      closed:
        "ಮುಚ್ಚಲಾಗಿದೆ",
    },

    placeholders: {
      addRemarks:
        "ಟಿಪ್ಪಣಿಗಳನ್ನು ಸೇರಿಸಿ...",

      selectComplaint:
        "ಮೊದಲು ದೂರನ್ನು ಆಯ್ಕೆಮಾಡಿ...",

      otp:
        "6 ಅಂಕಿಯ OTP ನಮೂದಿಸಿ",
    },

    actions: {
      callCitizen:
        "ನಾಗರಿಕರಿಗೆ ಕರೆ ಮಾಡಿ",

      viewOnMap:
        "ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ನಕ್ಷೆಯಲ್ಲಿ ನೋಡಿ",

      expandImage:
        "ದೂರಿನ ಚಿತ್ರವನ್ನು ವಿಸ್ತರಿಸಿ",

      cancel:
        "ರದ್ದುಮಾಡಿ",

      saving:
        "ಉಳಿಸಲಾಗುತ್ತಿದೆ...",

      saveChanges:
        "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",

      requestVerification:
        "ಪರಿಶೀಲನೆ OTP ವಿನಂತಿಸಿ",

      verifyOtp:
        "OTP ಪರಿಶೀಲಿಸಿ ಮತ್ತು ದೂರನ್ನು ಮುಚ್ಚಿ",
    },
  },

  /* =========================================================
     KPIs
  ========================================================= */

  kpis: {
    total:
      "ಒಟ್ಟು ದೂರುಗಳು",

    allComplaints:
      "ಎಲ್ಲಾ ದೂರುಗಳು",

    pending:
      "ಬಾಕಿ",

    readyForVerification:
      "ಪರಿಶೀಲನೆಗೆ ಸಿದ್ಧ",

    closed:
      "ಮುಚ್ಚಲಾಗಿದೆ",

    citizenVerified:
      "ನಾಗರಿಕರಿಂದ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
  },
},

cityOverviewMap: {
  title: "ಅವಲೋಕನ ನಕ್ಷೆಗಳು",

  mapFilters: "ನಕ್ಷೆ ಫಿಲ್ಟರ್‌ಗಳು",

  cityOverview: "ನಗರ ಅವಲೋಕನ ನಕ್ಷೆ",
  routeMaps: "ಮಾರ್ಗ ನಕ್ಷೆಗಳು",
  gvpPoints: "GVP ಪಾಯಿಂಟ್‌ಗಳು",
  plants: "ಘಟಕಗಳು",
  customerGrievances: "ನಾಗರಿಕ ದೂರುಗಳು",

  zone: "ವಲಯ",
  division: "ವಿಭಾಗ",
  ward: "ವಾರ್ಡ್",

  allZones: "ಎಲ್ಲಾ ವಲಯಗಳು",
  allDivisions: "ಎಲ್ಲಾ ವಿಭಾಗಗಳು",
  allWards: "ಎಲ್ಲಾ ವಾರ್ಡ್‌ಗಳು",

  selectZoneFirst: "ಮೊದಲು ವಲಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
  selectDivisionFirst: "ಮೊದಲು ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",

  loadingDivisions: "ವಿಭಾಗಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
  loadingWards: "ವಾರ್ಡ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",

  noDivisions: "ಯಾವುದೇ ವಿಭಾಗಗಳಿಲ್ಲ",
  noWards: "ಯಾವುದೇ ವಾರ್ಡ್‌ಗಳಿಲ್ಲ",

  loadingDivisionsFor: "ವಿಭಾಗಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ",
  loadingWardsFor: "ವಾರ್ಡ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ",

  resetMap: "ನಕ್ಷೆಯನ್ನು ಮರುಹೊಂದಿಸಿ",

  selectedZone: "ಆಯ್ಕೆಮಾಡಿದ ವಲಯ",
  selectedDivision: "ಆಯ್ಕೆಮಾಡಿದ ವಿಭಾಗ",
  selectedWard: "ಆಯ್ಕೆಮಾಡಿದ ವಾರ್ಡ್",

  city: "ನಗರ",
  divisions: "ವಿಭಾಗಗಳು",
  wards: "ವಾರ್ಡ್‌ಗಳು",

  wardId: "ವಾರ್ಡ್ ID",

  plantLocations: "ಘಟಕಗಳ ಸ್ಥಳಗಳು",
  loadingPlants: "ಘಟಕಗಳ ಸ್ಥಳಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
  unableLoadPlants: "ಘಟಕಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ",

  changeMapView: "ನಕ್ಷೆ ವೀಕ್ಷಣೆಯನ್ನು ಬದಲಾಯಿಸಿ",

  loading: "ನಗರ ನಕ್ಷೆಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
},

gvpMap: {
  title: "GVP ಪಾಯಿಂಟ್‌ಗಳ ಮೇಲ್ವಿಚಾರಣೆ",

  points: "ಪಾಯಿಂಟ್‌ಗಳು",

  ward: "ವಾರ್ಡ್",

  selectedWard: "ಆಯ್ಕೆ ಮಾಡಿದ ವಾರ್ಡ್",

  legend: "GVP ಪಾಯಿಂಟ್",

  loading: "GVP ಪಾಯಿಂಟ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",

  selectWard: "ವಾರ್ಡ್ ಆಯ್ಕೆಮಾಡಿ",

  selectWardDescription:
    "ಹೆಡರ್‌ನಿಂದ ನಗರ, ವಲಯ, ವಿಭಾಗ ಮತ್ತು ವಾರ್ಡ್ ಆಯ್ಕೆಮಾಡಿ.",

  unavailable: "GVP ನಕ್ಷೆ ಲಭ್ಯವಿಲ್ಲ",

  empty:
    "ಈ ದಿನಾಂಕಕ್ಕೆ ಯಾವುದೇ GVP ಪಾಯಿಂಟ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ",

  errors: {
    load: "GVP ಪಾಯಿಂಟ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
  },

  tooltip: {
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

cityOverviewMap: {
  title: "ಅವಲೋಕನ ನಕ್ಷೆಗಳು",

  mapFilters: "ನಕ್ಷೆ ಫಿಲ್ಟರ್‌ಗಳು",

  cityOverview:
    "ನಗರದ ಅವಲೋಕನ ನಕ್ಷೆ",

  routeMaps:
    "ಮಾರ್ಗ ನಕ್ಷೆಗಳು",

  gvpPoints:
    "GVP ಪಾಯಿಂಟ್‌ಗಳು",

  plants:
    "ಸಂಸ್ಕರಣಾ ಘಟಕಗಳು",

  customerGrievances: {
    title:
      "ಗ್ರಾಹಕರ ದೂರುಗಳು",

    loading:
      "ಗ್ರಾಹಕರ ದೂರುಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",

    error:
      "ಗ್ರಾಹಕರ ದೂರುಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",

    empty:
      "ಯಾವುದೇ ಗ್ರಾಹಕರ ದೂರುಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",

    complaints:
      "ದೂರುಗಳು",

    ticket:
      "ಟಿಕೆಟ್",

    status:
      "ಸ್ಥಿತಿ",

    category:
      "ವರ್ಗ",

    phone:
      "ಫೋನ್",

    description:
      "ವಿವರಣೆ",

    address:
      "ವಿಳಾಸ",

    latitude:
      "ಅಕ್ಷಾಂಶ",

    longitude:
      "ರೇಖಾಂಶ",

    date:
      "ದಿನಾಂಕ",
  },

  zone:
    "ವಲಯ",

  division:
    "ವಿಭಾಗ",

  ward:
    "ವಾರ್ಡ್",

  allZones:
    "ಎಲ್ಲಾ ವಲಯಗಳು",

  allDivisions:
    "ಎಲ್ಲಾ ವಿಭಾಗಗಳು",

  allWards:
    "ಎಲ್ಲಾ ವಾರ್ಡ್‌ಗಳು",

  selectZoneFirst:
    "ಮೊದಲು ವಲಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",

  selectDivisionFirst:
    "ಮೊದಲು ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ",

  loadingDivisions:
    "ವಿಭಾಗಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",

  loadingWards:
    "ವಾರ್ಡ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",

  noDivisions:
    "ಯಾವುದೇ ವಿಭಾಗಗಳಿಲ್ಲ",

  noWards:
    "ಯಾವುದೇ ವಾರ್ಡ್‌ಗಳಿಲ್ಲ",

  loadingDivisionsFor:
    "ವಿಭಾಗಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ",

  loadingWardsFor:
    "ವಾರ್ಡ್‌ಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ",

  resetMap:
    "ನಕ್ಷೆಯನ್ನು ಮರುಹೊಂದಿಸಿ",

  selectedZone:
    "ಆಯ್ಕೆ ಮಾಡಿದ ವಲಯ",

  selectedDivision:
    "ಆಯ್ಕೆ ಮಾಡಿದ ವಿಭಾಗ",

  selectedWard:
    "ಆಯ್ಕೆ ಮಾಡಿದ ವಾರ್ಡ್",

  city:
    "ನಗರ",

  divisions:
    "ವಿಭಾಗಗಳು",

  wards:
    "ವಾರ್ಡ್‌ಗಳು",

  wardId:
    "ವಾರ್ಡ್ ID",

  plantLocations:
    "ಸಂಸ್ಕರಣಾ ಘಟಕಗಳ ಸ್ಥಳಗಳು",

  loadingPlants:
    "ಸಂಸ್ಕರಣಾ ಘಟಕಗಳ ಸ್ಥಳಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",

  unableLoadPlants:
    "ಸಂಸ್ಕರಣಾ ಘಟಕಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ",

  changeMapView:
    "ನಕ್ಷೆ ವೀಕ್ಷಣೆಯನ್ನು ಬದಲಾಯಿಸಿ",

  loading:
    "ನಗರದ ನಕ್ಷೆಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
},

gvpOverviewMap: {
  title: "ಜಿವಿಪಿ ಅವಲೋಕನ ನಕ್ಷೆ",
  subtitle: "ಬೆಂಗಳೂರು ನಗರದ ಜಿವಿಪಿ ಪಾಯಿಂಟ್‌ಗಳ ಅವಲೋಕನ",

  filters: {
    cityOverview: "ನಗರ ಅವಲೋಕನ",
    routeMaps: "ಮಾರ್ಗ ನಕ್ಷೆಗಳು",
    gvpPoints: "ಜಿವಿಪಿ ಪಾಯಿಂಟ್‌ಗಳು",
    plants: "ಸಂಸ್ಕರಣಾ ಘಟಕಗಳು",
    wardBoundaries: "ವಾರ್ಡ್ ಗಡಿಗಳು",
  },

  map: {
    loading: "ನಕ್ಷೆ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    noData: "ಯಾವುದೇ ಜಿವಿಪಿ ಪಾಯಿಂಟ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    gvpPoint: "ಜಿವಿಪಿ ಪಾಯಿಂಟ್",
    name: "ಹೆಸರು",
    location: "ಸ್ಥಳ",
    status: "ಸ್ಥಿತಿ",
    coordinates: "ನಿರ್ದೇಶಾಂಕಗಳು",
    latitude: "ಅಕ್ಷಾಂಶ",
    longitude: "ರೇಖಾಂಶ",
  },

  status: {
    active: "ಸಕ್ರಿಯ",
    inactive: "ನಿಷ್ಕ್ರಿಯ",
    pending: "ಬಾಕಿಯಿದೆ",
  },

  legend: {
    gvpPoints: "ಜಿವಿಪಿ ಪಾಯಿಂಟ್‌ಗಳು",
    plants: "ಸಂಸ್ಕರಣಾ ಘಟಕಗಳು",
    wardBoundary: "ವಾರ್ಡ್ ಗಡಿ",
    route: "ಮಾರ್ಗ",
  },
},

users: {
  title: "ಬಳಕೆದಾರರು",

  description:
    "ವ್ಯವಸ್ಥೆಯಲ್ಲಿನ ಬಳಕೆದಾರರನ್ನು ರಚಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ.",

  // =========================================================
  // ADMIN LEVEL 1
  // =========================================================

  admin: {
    title: "ನಿರ್ವಾಹಕ ಹಂತ 1 ಬಳಕೆದಾರರು",

    description:
      "ಸಿಸ್ಟಮ್‌ಗೆ ಸಂಪೂರ್ಣ ಪ್ರವೇಶ ಹೊಂದಿರುವ ಇತರ ನಿರ್ವಾಹಕ ಹಂತ 1 ಬಳಕೆದಾರರನ್ನು ನಿರ್ವಹಿಸಿ.",

    searchPlaceholder:
      "ಹೆಸರು, ಇಮೇಲ್ ಅಥವಾ ಫೋನ್ ಮೂಲಕ ಹುಡುಕಿ...",

    addButton:
      "ನಿರ್ವಾಹಕರನ್ನು ಸೇರಿಸಿ",

    loading:
      "ನಿರ್ವಾಹಕ ಹಂತ 1 ಬಳಕೆದಾರರನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",

    empty:
      "ಯಾವುದೇ ನಿರ್ವಾಹಕ ಹಂತ 1 ಬಳಕೆದಾರರು ಕಂಡುಬಂದಿಲ್ಲ.",

    errors: {
      fetchFailed:
        "ನಿರ್ವಾಹಕ ಹಂತ 1 ಬಳಕೆದಾರರನ್ನು ಪಡೆಯಲು ವಿಫಲವಾಗಿದೆ.",
    },

    table: {
      slNo: "ಕ್ರಮ ಸಂಖ್ಯೆ",
      name: "ನಿರ್ವಾಹಕರ ಹೆಸರು",
      email: "ಇಮೇಲ್",
      phone: "ಫೋನ್ ಸಂಖ್ಯೆ",
      status: "ಸ್ಥಿತಿ",
      createdAt: "ರಚಿಸಿದ ದಿನಾಂಕ",
      actions: "ಕ್ರಿಯೆಗಳು",
    },

    actions: {
      edit: "ಬಳಕೆದಾರರನ್ನು ಸಂಪಾದಿಸಿ",
      delete: "ಬಳಕೆದಾರರನ್ನು ಅಳಿಸಿ",
    },

    pagination: {
      showing: "ತೋರಿಸಲಾಗುತ್ತಿದೆ",
      of: "ರಲ್ಲಿ",
      entries: "ದಾಖಲೆಗಳು",
      previous: "ಹಿಂದಿನ ಪುಟ",
      next: "ಮುಂದಿನ ಪುಟ",
    },

    modals: {
      addTitle: "ನಿರ್ವಾಹಕರನ್ನು ಸೇರಿಸಿ",
      editTitle: "ನಿರ್ವಾಹಕರನ್ನು ಸಂಪಾದಿಸಿ",
    },
  },

  // =========================================================
  // CONTRACTOR
  // =========================================================

  contractor: {
    title: "ಗುತ್ತಿಗೆದಾರ ಬಳಕೆದಾರರು",

    description:
      "ಗುತ್ತಿಗೆದಾರರ ಖಾತೆಗಳು ಮತ್ತು ಅನುಮತಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",

    searchPlaceholder:
      "ಗುತ್ತಿಗೆದಾರರನ್ನು ಹುಡುಕಿ...",

    addButton:
      "ಗುತ್ತಿಗೆದಾರರನ್ನು ಸೇರಿಸಿ",

    loading:
      "ಗುತ್ತಿಗೆದಾರ ಬಳಕೆದಾರರನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",

    empty:
      "ಯಾವುದೇ ಗುತ್ತಿಗೆದಾರ ಬಳಕೆದಾರರು ಕಂಡುಬಂದಿಲ್ಲ.",

    errors: {
      fetchFailed:
        "ಗುತ್ತಿಗೆದಾರ ಬಳಕೆದಾರರನ್ನು ಪಡೆಯಲು ವಿಫಲವಾಗಿದೆ.",
    },

    table: {
      slNo: "ಕ್ರಮ ಸಂಖ್ಯೆ",
      name: "ಹೆಸರು",
      email: "ಇಮೇಲ್",
      phone: "ಫೋನ್ ಸಂಖ್ಯೆ",
      status: "ಸ್ಥಿತಿ",
      createdAt: "ರಚಿಸಿದ ದಿನಾಂಕ",
      actions: "ಕ್ರಿಯೆಗಳು",
    },

    actions: {
      edit: "ಬಳಕೆದಾರರನ್ನು ಸಂಪಾದಿಸಿ",
      delete: "ಬಳಕೆದಾರರನ್ನು ಅಳಿಸಿ",
    },

    pagination: {
      showing: "ತೋರಿಸಲಾಗುತ್ತಿದೆ",
      of: "ರಲ್ಲಿ",
      entries: "ದಾಖಲೆಗಳು",
      previous: "ಹಿಂದಿನ ಪುಟ",
      next: "ಮುಂದಿನ ಪುಟ",
    },

    modals: {
      addTitle: "ಗುತ್ತಿಗೆದಾರರನ್ನು ಸೇರಿಸಿ",
      editTitle: "ಗುತ್ತಿಗೆದಾರರನ್ನು ಸಂಪಾದಿಸಿ",
    },
  },

  // =========================================================
  // COMMON USER TABLE
  // =========================================================

  table: {
    slNo: "ಕ್ರಮ ಸಂಖ್ಯೆ",
    name: "ಹೆಸರು",
    email: "ಇಮೇಲ್",
    phone: "ಫೋನ್ ಸಂಖ್ಯೆ",
    role: "ಪಾತ್ರ",
    lastLogin: "ಕೊನೆಯ ಲಾಗಿನ್",
    status: "ಸ್ಥಿತಿ",
    createdAt: "ರಚಿಸಿದ ದಿನಾಂಕ",

    active: "ಸಕ್ರಿಯ",
    inactive: "ನಿಷ್ಕ್ರಿಯ",
    pending: "ಬಾಕಿ",
    blocked: "ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ",

    actions: "ಕ್ರಿಯೆಗಳು",

    showing: "ತೋರಿಸಲಾಗುತ್ತಿದೆ",
    of: "ರಲ್ಲಿ",
    entries: "ದಾಖಲೆಗಳು",

    users: "ಬಳಕೆದಾರರು",

    rowsPerPage: "ಪ್ರತಿ ಪುಟಕ್ಕೆ ಸಾಲುಗಳು",

    previous: "ಹಿಂದಿನ",
    next: "ಮುಂದಿನ",

    noUsers: "ಯಾವುದೇ ಬಳಕೆದಾರರು ಕಂಡುಬಂದಿಲ್ಲ",
  },

  // =========================================================
  // COMMON ACTIONS
  // =========================================================

  actions: {
    edit: "ಬಳಕೆದಾರರನ್ನು ಸಂಪಾದಿಸಿ",
    delete: "ಬಳಕೆದಾರರನ್ನು ಅಳಿಸಿ",
  },

  // =========================================================
  // ADD / EDIT USER MODAL
  // =========================================================

modal: {
  fullName: "ಪೂರ್ಣ ಹೆಸರು",
  email: "ಇಮೇಲ್",
  password: "ಪಾಸ್‌ವರ್ಡ್",
  phoneNumber: "ಫೋನ್ ಸಂಖ್ಯೆ",

  fullNamePlaceholder:
    "ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",

  emailPlaceholder:
    "ಇಮೇಲ್ ನಮೂದಿಸಿ",

  passwordPlaceholder:
    "ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",

  phoneNumberPlaceholder:
    "ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",

  cancel: "ರದ್ದುಮಾಡಿ",
  save: "ಉಳಿಸಿ",
  saving: "ಉಳಿಸಲಾಗುತ್ತಿದೆ...",

  // Edit
  update: "ನವೀಕರಿಸಿ",
  updating: "ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...",
  emailCannotChange:
    "ಇಮೇಲ್ ಅನ್ನು ಬದಲಾಯಿಸಲಾಗುವುದಿಲ್ಲ.",

  // Delete
  deleteTitle: "ಬಳಕೆದಾರರನ್ನು ಅಳಿಸಿ",
  delete: "ಅಳಿಸಿ",
  deleting: "ಅಳಿಸಲಾಗುತ್ತಿದೆ...",
  close: "ಮುಚ್ಚಿ",

  deleteConfirmation:
    "ಈ ಬಳಕೆದಾರರನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ",

  deleteWarning:
    "ಈ ಕ್ರಿಯೆಯು ಬಳಕೆದಾರರನ್ನು ಸಿಸ್ಟಮ್‌ನಿಂದ ಶಾಶ್ವತವಾಗಿ ತೆಗೆದುಹಾಕುತ್ತದೆ ಮತ್ತು ಇದನ್ನು ಮರುಸ್ಥಾಪಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.",

  userFallback:
    "ಈ ಬಳಕೆದಾರರನ್ನು",

  errors: {
    fillAllFields:
      "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.",

    roleMissing:
      "ಬಳಕೆದಾರರ ಪಾತ್ರ ಲಭ್ಯವಿಲ್ಲ.",

    createFailed:
      "ಬಳಕೆದಾರರನ್ನು ರಚಿಸಲು ವಿಫಲವಾಗಿದೆ.",

    updateFailed:
      "ಬಳಕೆದಾರರನ್ನು ನವೀಕರಿಸಲು ವಿಫಲವಾಗಿದೆ.",

    userIdMissing:
      "ಬಳಕೆದಾರ ID ಲಭ್ಯವಿಲ್ಲ.",

    deleteFailed:
      "ಬಳಕೆದಾರರನ್ನು ಅಳಿಸಲು ವಿಫಲವಾಗಿದೆ.",
  },
},
},
};

export default kn;