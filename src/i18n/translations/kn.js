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
};

export default kn;