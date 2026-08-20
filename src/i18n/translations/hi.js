const hi = {
  common: {
    search: "खोजें...",
    save: "सहेजें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    add: "जोड़ें",
    close: "बंद करें",
    apply: "लागू करें",
    reset: "रीसेट करें",
    yes: "हाँ",
    no: "नहीं",
    active: "सक्रिय",
    inactive: "निष्क्रिय",
    loading: "लोड हो रहा है...",
    actions: "कार्रवाई",
    all: "सभी",
    total: "कुल",
    included: "शामिल",
  },

  language: {
    english: "अंग्रेज़ी",
    kannada: "कन्नड़",
    hindi: "हिंदी",
  },

  header: {
    search: "खोजें...",
    date: "19 अगस्त 2026",
    dryDay: "सूखा दिन",
    wetDay: "गीला दिन",
    admin: "व्यवस्थापक",
    adminLevel: "व्यवस्थापक स्तर 1",
  },

  sidebar: {
    overview: "अवलोकन",
    wasteGenerators: "कचरा उत्पादक",
    vehicles: "वाहन",
    plant: "संयंत्र",
    complaints: "शिकायतें",
    users: "उपयोगकर्ता",
    logs: "लॉग",
    aiAgent: "AI एजेंट",
    settings: "सेटिंग्स",
    logout: "लॉग आउट",
  },

  filters: {
    city: "बेंगलुरु",
    corporation: "बेंगलुरु दक्षिण शहर निगम",
    zone: "बोम्मनहल्ली",
    ward: "इब्बलूर",
  },

  overview: {
    title: "अवलोकन",

    kpis: {
      totalWasteCollected: "कुल एकत्रित कचरा",
      collectionPoints: "संग्रहण केंद्र",
      totalCitizens: "कुल नागरिक",

      citizensTrend: "नागरिकों की प्रवृत्ति",
      trashGiven: "कचरा दिया",
      notGiven: "कचरा नहीं दिया",

      kg: "किग्रा",
      ton: "टन",
      tons: "टन",
    },

    citizenTrend: {
      title: "नागरिकों की प्रवृत्ति",
      trashGiven: "कचरा दिया",
      notGiven: "कचरा नहीं दिया",
    },

    vehicleFleet: {
      title: "वाहन बेड़े की स्थिति",
      allVehicles: "सभी वाहन",
      included: "शामिल",

      totalRegistered: "कुल पंजीकृत वाहन",
      running: "चल रहे वाहन",
      notRunning: "नहीं चल रहे वाहन",
    },

    generationTrend: {
      title: "कचरा उत्पादन प्रवृत्ति",
      wasteGenerated: "उत्पन्न कचरा (टन)",
      wards: "वार्ड",
    },

    cityOverviewMap: {
      title: "शहर अवलोकन मानचित्र",
      mapFilters: "मानचित्र फ़िल्टर",
      cityOverview: "शहर अवलोकन मानचित्र",
      routeMaps: "मार्ग मानचित्र",
      gvpPoints: "GVP पॉइंट्स",
      collectionPoints: "संग्रहण केंद्र",
      vehicles: "वाहन",
      plants: "संयंत्र",
      wardBoundaries: "वार्ड सीमाएं",
    },
  },

  users: {
    title: "उपयोगकर्ता",
    description: "सिस्टम में उपयोगकर्ताओं को बनाएं और प्रबंधित करें।",

    admin: {
      title: "व्यवस्थापक स्तर 1 उपयोगकर्ता",
      description:
        "सिस्टम तक पूर्ण पहुंच रखने वाले अन्य व्यवस्थापक स्तर 1 उपयोगकर्ताओं को प्रबंधित करें।",
      search: "नाम, ईमेल या फोन से खोजें...",
      add: "व्यवस्थापक जोड़ें",
      name: "व्यवस्थापक का नाम",
      email: "ईमेल",
      phone: "फोन नंबर",
      status: "स्थिति",
      createdAt: "बनाया गया",
    },

    contractor: {
      title: "ठेकेदार उपयोगकर्ता",
      description: "ठेकेदार खातों और अनुमतियों को प्रबंधित करें.",
      search: "ठेकेदारों को खोजें...",
      add: "ठेकेदार जोड़ें",
      name: "नाम",
      email: "ईमेल",
      role: "भूमिका",
      lastLogin: "अंतिम लॉगिन",
      status: "स्थिति",
    },
  },

  generationTrend: {
  title: "कचरा उत्पादन प्रवृत्ति",
  wasteGenerated: "उत्पन्न कचरा (टन)",
  wasteGeneratedLabel: "उत्पन्न कचरा",
  wards: "वार्ड",
  ward: "वार्ड",
},

units: {
  kg: "किग्रा",
  ton: "टन",
  tons: "टन",
},

units: {
  kg: "किग्रा",
  ton: "टन",
  tons: "टन",
},

wasteGenerators: {
  /* =========================================================
     PAGE
  ========================================================= */

  title: "कचरा उत्पादक",

  description:
    "कचरा उत्पादकों की भागीदारी, कचरा योगदान, गतिविधि, निगरानी और संग्रहण प्रदर्शन का अवलोकन।",

  /* =========================================================
     KPIs
  ========================================================= */

  kpis: {
    generatorStatus: "कचरा उत्पादक स्थिति",

    activeGenerators: "सक्रिय कचरा उत्पादक",

    inactiveGenerators: "निष्क्रिय कचरा उत्पादक",

    totalWasteGenerated: "कुल उत्पन्न कचरा",

    averageWaste: "औसत कचरा",

    perHouseDay: "प्रति घर / दिन",

    classification: "कचरा उत्पादक वर्गीकरण",

    aboveAverage: "औसत से अधिक",

    belowAverage: "औसत से कम",
  },

  /* =========================================================
     GVP
  ========================================================= */

  gvp: {
    title: "GVP उत्पादन प्रवृत्ति",

    loading: "GVP डेटा लोड हो रहा है...",

    empty:
      "चयनित दिनांक और डिवीजन के लिए कोई GVP डेटा उपलब्ध नहीं है।",

    error: "GVP प्रवृत्ति लोड नहीं की जा सकी",

    wardNo: "वार्ड संख्या",

    gvp: "GVP",
  },

  /* =========================================================
     MAP
  ========================================================= */

  map: {
    title: "संग्रहण केंद्र निगरानी",

    points: "पॉइंट्स",

    ward: "वार्ड",

    selectedWard: "चयनित वार्ड",

    /* ================= LEGEND ================= */

    legend: {
      collectionPoint: "संग्रहण केंद्र",

      gvpPoint: "GVP पॉइंट",
    },

    /* ================= MAP STATES ================= */

    loading: "दैनिक वाहन टेलीमेट्री लोड हो रही है...",

    selectWard: "वार्ड चुनें",

    selectWardDescription:
      "हेडर से शहर, ज़ोन, डिवीजन और वार्ड चुनें।",

    mapUnavailable: "मानचित्र उपलब्ध नहीं है",

    noBoundary:
      "इस चयन के लिए वार्ड सीमा उपलब्ध नहीं है",

    noTelemetry:
      "इस तारीख के लिए कोई टेलीमेट्री पॉइंट नहीं है",

    /* ================= MAP SUMMARY ================= */

    summary: {
      showing: "दिखाया जा रहा है",

      telemetryCoordinates:
        "वाहन टेबल से टेलीमेट्री निर्देशांक",

      vehicleTables: "वाहन टेबल",

      gvpPoints: "GVP पॉइंट्स",
    },

    /* ================= ERRORS ================= */

    errors: {
      loadWardMap:
        "चयनित वार्ड मानचित्र लोड नहीं किया जा सका।",
    },

    /* ================= TOOLTIP ================= */

    tooltip: {
      collectionVehicle: "संग्रहण वाहन",

      gvpPoint: "GVP पॉइंट",

      vehicle: "वाहन",

      table: "टेबल",

      iot: "IoT",

      unit: "यूनिट",

      remarks: "टिप्पणियां",

      gvpWaste: "GVP कचरा",

      coordinates: "निर्देशांक",
    },
  },
},

vehicles: {
  title: "वाहन",

  description:
    "वाहन बेड़े की स्थिति, गतिविधि और अपशिष्ट संग्रहण प्रदर्शन की निगरानी करें।",

  kpis: {
    totalVehicles: "कुल वाहन",
    activeVehicles: "सक्रिय वाहन",
    inactiveVehicles: "निष्क्रिय वाहन",
    averageWeight: "प्रति वाहन औसत",
    weightCollection: "वजन संग्रहण",
  },

  averageWeightChart: {
    title: "औसत उत्पादित वजन (लाइन ग्राफ)",
    averageWasteGenerated: "औसत उत्पादित अपशिष्ट:",
    viewBy: "इसके अनुसार देखें:",
    city: "शहर",
    weightOfWaste: "अपशिष्ट का वजन (टन)",

    zoneName: "क्षेत्र का नाम",
    wasteGenerated: "उत्पादित अपशिष्ट",
    vehiclesRunning: "चल रहे वाहन",
    difference: "अंतर",
    overThreshold: "सीमा से अधिक",
    belowThreshold: "सीमा से कम",
    averageWaste: "औसत अपशिष्ट",

    wasteGeneratedLegend:
      "उत्पादित अपशिष्ट (टन)",

    thresholdLegend:
      "औसत उत्पादित अपशिष्ट (सीमा)",
  },

  telemetryDirectory: {
    title: "टेलीमेट्री निर्देशिका",

    searchPlaceholder:
      "वाहन ID से खोजें",

    allStatus: "सभी स्थितियां",

    active: "सक्रिय",

    inactive: "निष्क्रिय",

    download: "डाउनलोड",

    createVehicle: "वाहन बनाएं",

    vehicleId: "वाहन ID",

    routeZone: "मार्ग / क्षेत्र",

    lastUpdate: "अंतिम अपडेट",

    status: "स्थिति",

    actions: "क्रियाएं",

    action: "क्रिया",

    update: "अपडेट करें",

    delete: "हटाएं",

    showing: "दिखाया जा रहा है",

    to: "से",

    of: "में से",

    vehicles: "वाहन",

    rowsPerPage: "प्रति पृष्ठ पंक्तियां:",

    csv: {
      vehicleId: "वाहन ID",
      vehicleNumber: "वाहन संख्या",
      vehicleType: "वाहन प्रकार",
      city: "शहर",
      zone: "क्षेत्र",
      division: "प्रभाग",
      ward: "वार्ड",
      status: "स्थिति",
    },
  },

  createVehicle: {
    title: "वाहन बनाएं",

    close: "बंद करें",

    vehicleId: "वाहन ID",

    vehicleType: "वाहन प्रकार",

    active: "सक्रिय",

    inactive: "निष्क्रिय",

    selectCity: "शहर चुनें",

    selectZone: "क्षेत्र चुनें",

    selectDivision: "प्रभाग चुनें",

    selectWard: "वार्ड चुनें",

    types: {
      miniTruck: "मिनी ट्रक",
      autoTipper: "ऑटो टिप्पर",
      compactor: "कॉम्पैक्टर",
      dumper: "डम्पर",
    },

    validation:
      "कृपया सभी फ़ील्ड भरें।",

    cancel: "रद्द करें",

    create: "बनाएं",

    errors: {
      createFailed:
        "वाहन बनाने में विफल।",
    },
  },

  editVehicle: {
    title: "वाहन अपडेट करें",

    vehicleId: "वाहन ID",

    vehicleType: "वाहन प्रकार",

    active: "सक्रिय",

    inactive: "निष्क्रिय",

    selectCity: "शहर चुनें",

    selectZone: "क्षेत्र चुनें",

    selectDivision: "प्रभाग चुनें",

    selectWard: "वार्ड चुनें",

    cancel: "रद्द करें",

    update: "अपडेट करें",

    errors: {
      updateFailed:
        "वाहन अपडेट करने में विफल।",
    },
  },

  deleteVehicle: {
    title: "वाहन हटाएं",

    confirmation:
      "क्या आप वाकई इस वाहन को हटाना चाहते हैं?",

    cancel: "रद्द करें",

    delete: "हटाएं",

    errors: {
      deleteFailed:
        "वाहन हटाने में विफल।",
    },
  },
},

plants: {
  title:
    "प्लांट अवलोकन",

  description:
    "सभी अपशिष्ट प्रसंस्करण प्लांट और उनके संचालन की निगरानी करें।",

  loading:
    "प्लांट डैशबोर्ड लोड हो रहा है...",

  retry:
    "पुनः प्रयास करें",

  errors: {
    serverConnection:
      "सर्वर से कनेक्ट नहीं हो सका।",
  },

  kpis: {
    totalPlants:
      "कुल प्लांट",

    allRegisteredPlants:
      "सभी पंजीकृत प्लांट",

    totalVehiclesEnrolled:
      "कुल पंजीकृत वाहन",

    acrossAllPlants:
      "सभी प्लांट में",

    totalWasteCollected:
      "कुल एकत्रित कचरा",

    allTimeCollection:
      "अब तक का संग्रह",
  },

  directory: {
    title:
      "प्लांट डायरेक्टरी",

    addPlant:
      "प्लांट जोड़ें",

    plantName:
      "प्लांट का नाम",

    zone:
      "ज़ोन",

    capacity:
      "क्षमता (टन/दिन)",

    plantManager:
      "प्लांट प्रबंधक",

    vehiclesEnrolled:
      "पंजीकृत वाहन",

    actions:
      "क्रियाएँ",

    updatePlant:
      "प्लांट अपडेट करें",

    deletePlant:
      "प्लांट हटाएँ",

    noPlants:
      "कोई प्लांट नहीं मिला।",

    showing:
      "दिखा रहे हैं",

    of:
      "में से",

    plants:
      "प्लांट",

    rowsPerPage:
      "प्रति पृष्ठ पंक्तियाँ",
  },

  createPlant: {
    title:
      "प्लांट बनाएँ",

    plantName:
      "प्लांट का नाम",

    plantType:
      "प्लांट का प्रकार",

    city:
      "शहर",

    zone:
      "ज़ोन",

    division:
      "डिवीजन",

    ward:
      "वार्ड",

    plantManager:
      "प्लांट प्रबंधक",

    capacity:
      "क्षमता (टन/दिन)",

    vehiclesEnrolled:
      "पंजीकृत वाहन",

    wasteCollected:
      "एकत्रित कचरा",

    latitude:
      "अक्षांश",

    longitude:
      "देशांतर",

    active:
      "सक्रिय",

    inactive:
      "निष्क्रिय",

    cancel:
      "रद्द करें",

    create:
      "बनाएँ",

    errors: {
      createFailed:
        "प्लांट बनाने में विफल।",
    },
  },

  editPlant: {
    title:
      "प्लांट अपडेट करें",

    plantName:
      "प्लांट का नाम",

    plantType:
      "प्लांट का प्रकार",

    city:
      "शहर",

    zone:
      "ज़ोन",

    division:
      "डिवीजन",

    ward:
      "वार्ड",

    plantManager:
      "प्लांट प्रबंधक",

    capacity:
      "क्षमता",

    vehiclesEnrolled:
      "पंजीकृत वाहन",

    wasteCollected:
      "एकत्रित कचरा",

    latitude:
      "अक्षांश",

    longitude:
      "देशांतर",

    active:
      "सक्रिय",

    inactive:
      "निष्क्रिय",

    cancel:
      "रद्द करें",

    update:
      "अपडेट करें",

    errors: {
      updateFailed:
        "प्लांट अपडेट करने में विफल।",
    },
  },

  deletePlant: {
    title:
      "प्लांट हटाएँ",

    confirmation:
      "क्या आप वाकई इस प्लांट को हटाना चाहते हैं?",

    cancel:
      "रद्द करें",

    delete:
      "हटाएँ",

    errors: {
      deleteFailed:
        "प्लांट हटाने में विफल।",
    },
  },
},

users: {
  title: "उपयोगकर्ता",

  description:
    "सिस्टम में उपयोगकर्ताओं को बनाएं और प्रबंधित करें।",

  footer:
    "© 2025 SEWAC. सर्वाधिकार सुरक्षित।",
},
};

export default hi;