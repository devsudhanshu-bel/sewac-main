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
};

export default hi;