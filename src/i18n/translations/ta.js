const ta = {
  common: {
    search: "தேடுக...",
    save: "சேமி",
    cancel: "ரத்து செய்",
    delete: "நீக்கு",
    edit: "திருத்து",
    add: "சேர்",
    close: "மூடு",
    apply: "பயன்படுத்து",
    reset: "மீட்டமை",
    yes: "ஆம்",
    no: "இல்லை",
    active: "செயலில்",
    inactive: "செயலில் இல்லை",
    loading: "ஏற்றுகிறது...",
    actions: "செயல்கள்",
    all: "அனைத்தும்",
    total: "மொத்தம்",
    included: "சேர்க்கப்பட்டுள்ளது",
  },

  language: {
    english: "English",
    kannada: "ಕನ್ನಡ",
    hindi: "हिंदी",
    Telugu: "తెలుగు",
    tamil: "தமிழ்",
  },

  header: {
    search: "தேடுக...",
    date: "19 ஆகஸ்ட் 2026",
    dryDay: "உலர் நாள்",
    wetDay: "ஈர நாள்",
    admin: "நிர்வாகி",
    adminLevel: "நிர்வாக அடுக்கு 1",
  },

  sidebar: {
    overview: "மேலோட்டம்",
    wasteGenerators: "கழிவு உருவாக்குபவர்கள்",
    vehicles: "வாகனங்கள்",
    plant: "ஆலை",
    complaints: "புகார்கள்",
    users: "பயனர்கள்",
    logs: "பதிவுகள்",
    aiAgent: "AI முகவர்",
    settings: "அமைப்புகள்",
    logout: "வெளியேறு",
  },

  filters: {
    city: "பெங்களூரு",
    corporation: "பெங்களூரு தெற்கு மாநகராட்சி",
    zone: "பொம்மனஹள்ளி",
    ward: "இப்பலூர்",
  },

  overview: {
    title: "மேலோட்டம்",

    kpis: {
      totalWasteCollected: "மொத்தமாக சேகரிக்கப்பட்ட கழிவு",
      collectionPoints: "சேகரிப்பு புள்ளிகள்",
      totalCitizens: "மொத்த குடிமக்கள்",

      citizensTrend: "குடிமக்கள் போக்கு",
      trashGiven: "கழிவு வழங்கியவர்கள்",
      notGiven: "வழங்காதவர்கள்",

      kg: "கிலோ",
      ton: "டன்",
      tons: "டன்கள்",
    },

    citizenTrend: {
      title: "குடிமக்கள் போக்கு",
      trashGiven: "கழிவு வழங்கியவர்கள்",
      notGiven: "வழங்காதவர்கள்",
    },

    vehicleFleet: {
      title: "வாகனப் படையின் நிலை",
      allVehicles: "அனைத்து வாகனங்கள்",
      included: "சேர்க்கப்பட்டுள்ளது",

      totalRegistered: "மொத்த பதிவு செய்யப்பட்ட வாகனங்கள்",
      running: "இயங்கும் வாகனங்கள்",
      notRunning: "இயங்காத வாகனங்கள்",
    },

    generationTrend: {
      title: "கழிவு உருவாக்கப் போக்கு",
      wasteGenerated: "உருவாக்கப்பட்ட கழிவு (டன்கள்)",
      wards: "வார்டுகள்",
    },

    cityOverviewMap: {
      title: "நகர மேலோட்ட வரைபடம்",
      mapFilters: "வரைபட வடிகட்டிகள்",
      cityOverview: "நகர மேலோட்ட வரைபடம்",
      routeMaps: "வழித்தட வரைபடங்கள்",
      gvpPoints: "GVP புள்ளிகள்",
      collectionPoints: "சேகரிப்பு புள்ளிகள்",
      vehicles: "வாகனங்கள்",
      plants: "ஆலைகள்",
      wardBoundaries: "வார்டு எல்லைகள்",
    },
  },

  users: {
    title: "பயனர்கள்",

    description:
      "கணினியில் பயனர்களை உருவாக்கி நிர்வகிக்கவும்.",

    admin: {
      title: "நிர்வாக அடுக்கு 1 பயனர்கள்",

      description:
        "கணினிக்கான முழு அணுகல் கொண்ட பிற நிர்வாக அடுக்கு 1 பயனர்களை நிர்வகிக்கவும்.",

      search: "பெயர், மின்னஞ்சல் அல்லது தொலைபேசி மூலம் தேடுக...",

      add: "நிர்வாகியைச் சேர்",

      name: "நிர்வாகி பெயர்",

      email: "மின்னஞ்சல்",

      phone: "தொலைபேசி எண்",

      status: "நிலை",

      createdAt: "உருவாக்கப்பட்ட தேதி",

      searchPlaceholder:
        "பெயர், மின்னஞ்சல் அல்லது தொலைபேசி மூலம் தேடுக...",

      addButton: "நிர்வாகியைச் சேர்",

      loading:
        "நிர்வாக அடுக்கு 1 பயனர்கள் ஏற்றப்படுகின்றனர்...",

      empty:
        "நிர்வாக அடுக்கு 1 பயனர்கள் எவரும் கிடைக்கவில்லை.",

      errors: {
        fetchFailed:
          "நிர்வாக அடுக்கு 1 பயனர்களைப் பெற முடியவில்லை.",
      },

      table: {
        slNo: "வரிசை எண்",
        name: "நிர்வாகி பெயர்",
        email: "மின்னஞ்சல்",
        phone: "தொலைபேசி எண்",
        status: "நிலை",
        createdAt: "உருவாக்கப்பட்ட தேதி",
        actions: "செயல்கள்",
      },

      actions: {
        edit: "பயனரைத் திருத்து",
        delete: "பயனரை நீக்கு",
      },

      pagination: {
        showing: "காண்பிக்கப்படுகிறது",
        of: "இல்",
        entries: "உள்ளீடுகள்",
        previous: "முந்தைய பக்கம்",
        next: "அடுத்த பக்கம்",
      },

      modals: {
        addTitle: "நிர்வாகியைச் சேர்",
        editTitle: "நிர்வாகியைத் திருத்து",
      },
    },

    contractor: {
      title: "ஒப்பந்ததாரர் பயனர்கள்",

      description:
        "ஒப்பந்ததாரர் கணக்குகள் மற்றும் அனுமதிகளை நிர்வகிக்கவும்.",

      search: "ஒப்பந்ததாரர்களைத் தேடுக...",

      add: "ஒப்பந்ததாரரைச் சேர்",

      name: "பெயர்",

      email: "மின்னஞ்சல்",

      role: "பங்கு",

      lastLogin: "கடைசி உள்நுழைவு",

      status: "நிலை",

      searchPlaceholder:
        "ஒப்பந்ததாரர்களைத் தேடுக...",

      addButton: "ஒப்பந்ததாரரைச் சேர்",

      loading:
        "ஒப்பந்ததாரர் பயனர்கள் ஏற்றப்படுகின்றனர்...",

      empty:
        "ஒப்பந்ததாரர் பயனர்கள் எவரும் கிடைக்கவில்லை.",

      errors: {
        fetchFailed:
          "ஒப்பந்ததாரர் பயனர்களைப் பெற முடியவில்லை.",
      },

      table: {
        slNo: "வரிசை எண்",
        name: "பெயர்",
        email: "மின்னஞ்சல்",
        phone: "தொலைபேசி எண்",
        status: "நிலை",
        createdAt: "உருவாக்கப்பட்ட தேதி",
        actions: "செயல்கள்",
      },

      actions: {
        edit: "பயனரைத் திருத்து",
        delete: "பயனரை நீக்கு",
      },

      pagination: {
        showing: "காண்பிக்கப்படுகிறது",
        of: "இல்",
        entries: "உள்ளீடுகள்",
        previous: "முந்தைய பக்கம்",
        next: "அடுத்த பக்கம்",
      },

      modals: {
        addTitle: "ஒப்பந்ததாரரைச் சேர்",
        editTitle: "ஒப்பந்ததாரரைத் திருத்து",
      },
    },

    table: {
      slNo: "வரிசை எண்",
      name: "பெயர்",
      email: "மின்னஞ்சல்",
      phone: "தொலைபேசி எண்",
      role: "பங்கு",
      lastLogin: "கடைசி உள்நுழைவு",
      status: "நிலை",
      createdAt: "உருவாக்கப்பட்ட தேதி",

      active: "செயலில்",
      inactive: "செயலில் இல்லை",
      pending: "நிலுவையில்",
      blocked: "தடுக்கப்பட்டது",

      actions: "செயல்கள்",

      showing: "காண்பிக்கப்படுகிறது",
      of: "இல்",
      entries: "உள்ளீடுகள்",

      users: "பயனர்கள்",

      rowsPerPage: "ஒரு பக்கத்திற்கான வரிசைகள்",

      previous: "முந்தையது",
      next: "அடுத்தது",

      noUsers: "பயனர்கள் எவரும் கிடைக்கவில்லை",
    },

    actions: {
      edit: "பயனரைத் திருத்து",
      delete: "பயனரை நீக்கு",
    },

    modal: {
      fullName: "முழு பெயர்",
      email: "மின்னஞ்சல்",
      password: "கடவுச்சொல்",
      phoneNumber: "தொலைபேசி எண்",

      fullNamePlaceholder: "முழு பெயரை உள்ளிடவும்",
      emailPlaceholder: "மின்னஞ்சலை உள்ளிடவும்",
      passwordPlaceholder: "கடவுச்சொல்லை உள்ளிடவும்",
      phoneNumberPlaceholder: "தொலைபேசி எண்ணை உள்ளிடவும்",

      cancel: "ரத்து செய்",
      save: "சேமி",
      saving: "சேமிக்கப்படுகிறது...",

      update: "புதுப்பி",
      updating: "புதுப்பிக்கப்படுகிறது...",
      emailCannotChange:
        "மின்னஞ்சலை மாற்ற முடியாது.",

      deleteTitle: "பயனரை நீக்கு",
      delete: "நீக்கு",
      deleting: "நீக்கப்படுகிறது...",
      close: "மூடு",

      deleteConfirmation:
        "இவரை நிரந்தரமாக நீக்க விரும்புகிறீர்களா:",

      deleteWarning:
        "இந்தச் செயல் இந்தப் பயனரை கணினியிலிருந்து நிரந்தரமாக நீக்கும். இதை மீண்டும் மாற்ற முடியாது.",

      userFallback: "இந்தப் பயனர்",

      errors: {
        fillAllFields:
          "அனைத்து புலங்களையும் நிரப்பவும்.",

        roleMissing:
          "பயனர் பங்கு குறிப்பிடப்படவில்லை.",

        createFailed:
          "பயனரை உருவாக்க முடியவில்லை.",

        updateFailed:
          "பயனரைப் புதுப்பிக்க முடியவில்லை.",

        userIdMissing:
          "பயனர் ID குறிப்பிடப்படவில்லை.",

        deleteFailed:
          "பயனரை நீக்க முடியவில்லை.",
      },
    },
  },

  generationTrend: {
    title: "கழிவு உருவாக்கப் போக்கு",

    wasteGenerated:
      "உருவாக்கப்பட்ட கழிவு (டன்கள்)",

    wasteGeneratedLabel:
      "உருவாக்கப்பட்ட கழிவு",

    wards: "வார்டுகள்",

    ward: "வார்டு",
  },

  gvpOverviewMap: {
    title: "GVP மேலோட்ட வரைபடம்",

    subtitle:
      "பெங்களூரு முழுவதும் உள்ள GVP புள்ளிகளின் மேலோட்டம்",

    filters: {
      cityOverview: "நகர மேலோட்டம்",

      routeMaps: "வழித்தட வரைபடங்கள்",

      gvpPoints: "GVP புள்ளிகள்",

      plants: "ஆலைகள்",

      wardBoundaries: "வார்டு எல்லைகள்",
    },

    map: {
      loading: "வரைபடம் ஏற்றப்படுகிறது...",

      noData:
        "GVP புள்ளிகள் எதுவும் கிடைக்கவில்லை.",

      gvpPoint: "GVP புள்ளி",

      name: "பெயர்",

      location: "இருப்பிடம்",

      status: "நிலை",

      coordinates: "ஒருங்கிணைப்புகள்",

      latitude: "அட்சரேகை",

      longitude: "தீர்க்கரேகை",
    },

    status: {
      active: "செயலில்",

      inactive: "செயலில் இல்லை",

      pending: "நிலுவையில்",
    },

    legend: {
      gvpPoints: "GVP புள்ளிகள்",

      plants: "ஆலைகள்",

      wardBoundary: "வார்டு எல்லை",

      route: "வழித்தடம்",
    },
  },

  wasteGenerators: {
    title: "கழிவு உருவாக்குபவர்கள்",

    description:
      "கழிவு உருவாக்குபவர்களின் பங்கேற்பு, கழிவு பங்களிப்பு, செயல்பாடு, கண்காணிப்பு மற்றும் சேகரிப்பு செயல்திறனைப் பார்வையிடவும்.",

    kpis: {
      generatorStatus:
        "கழிவு உருவாக்குபவர்களின் நிலை",

      activeGenerators:
        "செயலில் உள்ள கழிவு உருவாக்குபவர்கள்",

      inactiveGenerators:
        "செயலில் இல்லாத கழிவு உருவாக்குபவர்கள்",

      totalWasteGenerated:
        "மொத்தமாக உருவாக்கப்பட்ட கழிவு",

      averageWaste:
        "சராசரி கழிவு",

      perHouseDay:
        "ஒரு வீடு / நாள்",

      classification:
        "கழிவு உருவாக்குபவர் வகைப்பாடு",

      aboveAverage:
        "சராசரிக்கு மேல்",

      belowAverage:
        "சராசரிக்கு கீழ்",
    },

    gvp: {
      title:
        "GVP உருவாக்கப் போக்கு",

      loading:
        "GVP தரவு ஏற்றப்படுகிறது...",

      empty:
        "தேர்ந்தெடுக்கப்பட்ட தேதி மற்றும் பிரிவிற்கு GVP தரவு இல்லை.",

      error:
        "GVP போக்கை ஏற்ற முடியவில்லை",

      wardNo:
        "வார்டு எண்",

      gvp:
        "GVP",
    },

    map: {
      title:
        "சேகரிப்பு புள்ளி கண்காணிப்பு",

      points:
        "புள்ளிகள்",

      ward:
        "வார்டு",

      selectedWard:
        "தேர்ந்தெடுக்கப்பட்ட வார்டு",

      legend: {
        collectionPoint:
          "சேகரிப்பு புள்ளி",

        gvpPoint:
          "GVP புள்ளி",
      },

      loading:
        "தினசரி வாகன தொலைஅளவியல் தரவு ஏற்றப்படுகிறது...",

      selectWard:
        "ஒரு வார்டைத் தேர்ந்தெடுக்கவும்",

      selectWardDescription:
        "தலைப்பிலிருந்து நகரம், மண்டலம், பிரிவு மற்றும் வார்டைத் தேர்ந்தெடுக்கவும்.",

      mapUnavailable:
        "வரைபடம் கிடைக்கவில்லை",

      noBoundary:
        "இந்தத் தேர்விற்கான வார்டு எல்லை கிடைக்கவில்லை",

      noTelemetry:
        "இந்தத் தேதிக்கான தொலைஅளவியல் புள்ளிகள் இல்லை",

      summary: {
        showing:
          "காண்பிக்கப்படுகிறது",

        telemetryCoordinates:
          "தொலைஅளவியல் ஒருங்கிணைப்புகள்",

        vehicleTables:
          "வாகன அட்டவணைகள்",

        gvpPoints:
          "GVP புள்ளிகள்",
      },

      errors: {
        loadWardMap:
          "தேர்ந்தெடுக்கப்பட்ட வார்டு வரைபடத்தை ஏற்ற முடியவில்லை.",
      },

      tooltip: {
        collectionVehicle:
          "சேகரிப்பு வாகனம்",

        gvpPoint:
          "GVP புள்ளி",

        vehicle:
          "வாகனம்",

        table:
          "அட்டவணை",

        iot:
          "IoT",

        unit:
          "அலகு",

        remarks:
          "குறிப்புகள்",

        gvpWaste:
          "GVP கழிவு",

        coordinates:
          "ஒருங்கிணைப்புகள்",
      },
    },

    directory: {
      title:
        "கழிவு உருவாக்குபவர் அடைவு",

      description:
        "பதிவு செய்யப்பட்ட குடிமக்கள் தகவலின் அடிப்படையில் கழிவு உருவாக்குபவர்களைப் பார்க்கவும் நிர்வகிக்கவும்.",

      searchPlaceholder:
        "பெயர், தொலைபேசி எண் அல்லது ஈர RFID மூலம் தேடுக",

      sync:
        "ஒத்திசை",

      syncing:
        "ஒத்திசைக்கப்படுகிறது...",

      number:
        "#",

      name:
        "பெயர்",

      phone:
        "தொலைபேசி எண்",

      wetRFID:
        "ஈர RFID",

      dryRFID:
        "உலர் RFID",

      wardArea:
        "வார்டு / பகுதி",

      ward:
        "வார்டு",

      zone:
        "மண்டலம்",

      status:
        "நிலை",

      totalWaste:
        "மொத்த கழிவு",

      averageWaste:
        "சராசரி கழிவு",

      active:
        "செயலில்",

      inactive:
        "செயலில் இல்லை",

      loading:
        "கழிவு உருவாக்குபவர்கள் ஏற்றப்படுகின்றனர்...",

      emptySearch:
        "இந்தத் தேடலுக்கு கழிவு உருவாக்குபவர்கள் எவரும் கிடைக்கவில்லை.",

      empty:
        "கழிவு உருவாக்குபவர்கள் எவரும் கிடைக்கவில்லை.",

      notAvailable:
        "கிடைக்கவில்லை",

      notAssigned:
        "ஒதுக்கப்படவில்லை",

      kg:
        "கிலோ",

      showing:
        "காண்பிக்கப்படுகிறது",

      of:
        "இல்",

      wasteGenerators:
        "கழிவு உருவாக்குபவர்கள்",

      rows:
        "வரிசைகள்:",

      previous:
        "முந்தைய பக்கம்",

      next:
        "அடுத்த பக்கம்",
    },
  },

  vehicles: {
    title:
      "வாகனங்கள்",

    description:
      "வாகனப் படையின் நிலை, செயல்பாடு மற்றும் கழிவு சேகரிப்பு செயல்திறனைக் கண்காணிக்கவும்.",

    kpis: {
      totalVehicles:
        "மொத்த வாகனங்கள்",

      activeVehicles:
        "செயலில் உள்ள வாகனங்கள்",

      inactiveVehicles:
        "செயலில் இல்லாத வாகனங்கள்",

      averageWeight:
        "வாகனங்களின் சராசரி",

      weightCollection:
        "கழிவு எடை சேகரிப்பு",
    },

    averageWeightChart: {
      title:
        "உருவாக்கப்பட்ட சராசரி கழிவு எடை (பார் வரைபடம்)",

      averageWasteGenerated:
        "உருவாக்கப்பட்ட சராசரி கழிவு:",

      viewBy:
        "இதன் அடிப்படையில் பார்க்க:",

      city:
        "நகரம்",

      weightOfWaste:
        "கழிவின் எடை (டன்)",

      zoneName:
        "மண்டலத்தின் பெயர்",

      wasteGenerated:
        "உருவாக்கப்பட்ட கழிவு",

      vehiclesRunning:
        "இயங்கும் வாகனங்கள்",

      difference:
        "வேறுபாடு",

      overThreshold:
        "வரம்பை மீறியது",

      belowThreshold:
        "வரம்பிற்கு கீழ்",

      averageWaste:
        "சராசரி கழிவு",

      wasteGeneratedLegend:
        "உருவாக்கப்பட்ட கழிவு (டன்)",

      thresholdLegend:
        "சராசரி உருவாக்கப்பட்ட கழிவு (வரம்பு)",
    },

    telemetryDirectory: {
      title:
        "வாகன அடைவு",

      searchPlaceholder:
        "வாகன ID மூலம் தேடுக",

      allStatus:
        "அனைத்து நிலைகள்",

      active:
        "செயலில்",

      inactive:
        "செயலில் இல்லை",

      download:
        "பதிவிறக்கு",

      createVehicle:
        "வாகனத்தை உருவாக்கு",

      vehicleId:
        "வாகன ID",

      routeZone:
        "வழித்தடம் / மண்டலம்",

      lastUpdate:
        "கடைசி புதுப்பிப்பு",

      status:
        "நிலை",

      actions:
        "செயல்கள்",

      action:
        "செயல்",

      update:
        "புதுப்பி",

      delete:
        "நீக்கு",

      noVehicles:
        "வாகனங்கள் எதுவும் கிடைக்கவில்லை.",

      showing:
        "காண்பிக்கப்படுகிறது",

      to:
        "முதல்",

      of:
        "இல்",

      vehicles:
        "வாகனங்கள்",

      rowsPerPage:
        "ஒரு பக்கத்திற்கான வரிசைகள்:",

      csv: {
        vehicleId:
          "வாகன ID",

        vehicleNumber:
          "வாகன எண்",

        vehicleType:
          "வாகன வகை",

        city:
          "நகரம்",

        zone:
          "மண்டலம்",

        division:
          "பிரிவு",

        ward:
          "வார்டு",

        status:
          "நிலை",
      },
    },

    editVehicle: {
      title:
        "வாகனத்தைப் புதுப்பி",

      vehicleId:
        "வாகன ID",

      vehicleType:
        "வாகன வகை",

      active:
        "செயலில்",

      inactive:
        "செயலில் இல்லை",

      selectCity:
        "நகரத்தைத் தேர்ந்தெடுக்கவும்",

      selectZone:
        "மண்டலத்தைத் தேர்ந்தெடுக்கவும்",

      selectDivision:
        "பிரிவைத் தேர்ந்தெடுக்கவும்",

      selectWard:
        "வார்டைத் தேர்ந்தெடுக்கவும்",

      cancel:
        "ரத்து செய்",

      update:
        "புதுப்பி",

      errors: {
        updateFailed:
          "வாகனத்தைப் புதுப்பிக்க முடியவில்லை",
      },
    },

    deleteVehicle: {
      title:
        "வாகனத்தை நீக்கு",

      confirmation:
        "இந்த வாகனத்தை நிச்சயமாக நீக்க விரும்புகிறீர்களா",

      cancel:
        "ரத்து செய்",

      delete:
        "நீக்கு",

      errors: {
        deleteFailed:
          "வாகனத்தை நீக்க முடியவில்லை.",
      },
    },
  },

  plants: {
    title:
      "ஆலை மேலோட்டம்",

    description:
      "அனைத்து கழிவு செயலாக்க ஆலைகளையும் அவற்றின் செயல்பாடுகளையும் கண்காணிக்கவும்.",

    loading:
      "ஆலைகள் டாஷ்போர்டு ஏற்றப்படுகிறது...",

    retry:
      "மீண்டும் முயற்சி",

    errors: {
      serverConnection:
        "சேவையகத்துடன் இணைக்க முடியவில்லை.",

      createFailed:
        "ஆலையை உருவாக்க முடியவில்லை.",

      updateFailed:
        "ஆலையைப் புதுப்பிக்க முடியவில்லை.",

      deleteFailed:
        "ஆலையை நீக்க முடியவில்லை.",
    },

    kpis: {
      totalPlants:
        "மொத்த ஆலைகள்",

      allRegisteredPlants:
        "அனைத்து பதிவு செய்யப்பட்ட ஆலைகள்",

      totalVehiclesEnrolled:
        "பதிவு செய்யப்பட்ட மொத்த வாகனங்கள்",

      acrossAllPlants:
        "அனைத்து ஆலைகளிலும்",

      totalWasteCollected:
        "மொத்தமாக சேகரிக்கப்பட்ட கழிவு",

      allTimeCollection:
        "இதுவரை சேகரிக்கப்பட்ட சேகரிப்பு",
    },

    directory: {
      title:
        "ஆலை அடைவு",

      addPlant:
        "ஆலையைச் சேர்",

      plantName:
        "ஆலை பெயர்",

      zone:
        "மண்டலம்",

      capacity:
        "திறன் (டன்/நாள்)",

      plantManager:
        "ஆலை மேலாளர்",

      vehiclesEnrolled:
        "பதிவு செய்யப்பட்ட வாகனங்கள்",

      actions:
        "செயல்கள்",

      updatePlant:
        "ஆலையைப் புதுப்பி",

      deletePlant:
        "ஆலையை நீக்கு",

      noPlants:
        "ஆலைகள் எதுவும் கிடைக்கவில்லை.",

      showing:
        "காண்பிக்கப்படுகிறது",

      of:
        "இல்",

      plants:
        "ஆலைகள்",

      rowsPerPage:
        "ஒரு பக்கத்திற்கான வரிசைகள்",
    },

    createPlant: {
      title:
        "ஆலையை உருவாக்கு",

      plantName:
        "ஆலை பெயர்",

      plantType:
        "ஆலை வகை",

      city:
        "நகரம்",

      zone:
        "மண்டலம்",

      division:
        "பிரிவு",

      ward:
        "வார்டு",

      plantManager:
        "ஆலை மேலாளர்",

      capacity:
        "திறன் (டன்/நாள்)",

      vehiclesEnrolled:
        "பதிவு செய்யப்பட்ட வாகனங்கள்",

      wasteCollected:
        "சேகரிக்கப்பட்ட கழிவு",

      latitude:
        "அட்சரேகை",

      longitude:
        "தீர்க்கரேகை",

      active:
        "செயலில்",

      inactive:
        "செயலில் இல்லை",

      cancel:
        "ரத்து செய்",

      create:
        "உருவாக்கு",

      errors: {
        createFailed:
          "ஆலையை உருவாக்க முடியவில்லை.",
      },
    },

    editPlant: {
      title:
        "ஆலையைப் புதுப்பி",

      plantName:
        "ஆலை பெயர்",

      plantType:
        "ஆலை வகை",

      city:
        "நகரம்",

      zone:
        "மண்டலம்",

      division:
        "பிரிவு",

      ward:
        "வார்டு",

      plantManager:
        "ஆலை மேலாளர்",

      capacity:
        "திறன்",

      vehiclesEnrolled:
        "பதிவு செய்யப்பட்ட வாகனங்கள்",

      wasteCollected:
        "சேகரிக்கப்பட்ட கழிவு",

      latitude:
        "அட்சரேகை",

      longitude:
        "தீர்க்கரேகை",

      active:
        "செயலில்",

      inactive:
        "செயலில் இல்லை",

      cancel:
        "ரத்து செய்",

      update:
        "புதுப்பி",

      errors: {
        updateFailed:
          "ஆலையைப் புதுப்பிக்க முடியவில்லை.",
      },
    },

    deletePlant: {
      title:
        "ஆலையை நீக்கு",

      confirmation:
        "இந்த ஆலையை நிச்சயமாக நீக்க விரும்புகிறீர்களா?",

      cancel:
        "ரத்து செய்",

      delete:
        "நீக்கு",

      errors: {
        deleteFailed:
          "ஆலையை நீக்க முடியவில்லை.",
      },
    },

    map: {
      title:
        "ஆலை இருப்பிடங்கள்",

      subtitle:
        "கழிவு செயலாக்க ஆலைகள்",

      maximize:
        "வரைபடத்தை பெரிதாக்கு",

      loading:
        "ஆலை இருப்பிடங்கள் ஏற்றப்படுகின்றன...",

      empty:
        "ஆலை இருப்பிடங்கள் எதுவும் கிடைக்கவில்லை",

      unnamedPlant:
        "பெயரிடப்படாத ஆலை",

      notAssigned:
        "ஒதுக்கப்படவில்லை",

      unknown:
        "தெரியவில்லை",

      vehicles:
        "வாகனங்கள்",

      tonPerDay:
        "டன்/நாள்",
    },
  },

  complaints: {
    title:
      "புகார்கள்",

    description:
      "குடிமக்கள் புகார்களை நிர்வகித்து கண்காணிக்கவும்",

    table: {
      title:
        "புகார்கள்",

      complaint:
        "புகார்",

      found:
        "கிடைத்தது",

      updating:
        "புதுப்பிக்கப்படுகிறது...",

      location:
        "இருப்பிடம்",

      createdAt:
        "உருவாக்கப்பட்ட தேதி",

      loading:
        "புகார்கள் ஏற்றப்படுகின்றன...",

      empty:
        "புகார்கள் எதுவும் கிடைக்கவில்லை.",

      showing:
        "காண்பிக்கப்படுகிறது",

      to:
        "முதல்",

      of:
        "இல்",

      complaints:
        "புகார்கள்",

      previousPage:
        "முந்தைய பக்கம்",

      nextPage:
        "அடுத்த பக்கம்",
    },

    filters: {
      searchPlaceholder:
        "டிக்கெட், தொலைபேசி, தலைப்பு, முகவரி மூலம் தேடுக...",

      category:
        "வகை",

      all:
        "அனைத்தும்",

      to:
        "முதல்",

      reset:
        "வடிகட்டிகளை மீட்டமை",

      categories: {
        missedCollection:
          "தவறிய சேகரிப்பு",

        overflowingBin:
          "நிரம்பிய குப்பைத்தொட்டி",

        illegalDumping:
          "சட்டவிரோத கழிவு கொட்டுதல்",

        streetLitter:
          "தெரு குப்பைகள்",

        damagedBin:
          "சேதமடைந்த குப்பைத்தொட்டி",

        other:
          "மற்றவை",
      },
    },

    details: {
      empty: {
        title:
          "ஒரு புகாரைத் தேர்ந்தெடுக்கவும்",

        description:
          "விவரங்களைக் காண அட்டவணையிலிருந்து ஒரு புகாரைத் தேர்ந்தெடுக்கவும்.",
      },

      ticketNumber:
        "டிக்கெட் எண்",

      title:
        "தலைப்பு",

      category:
        "வகை",

      citizenPhone:
        "குடிமகன் (தொலைபேசி)",

      address:
        "முகவரி",

      coordinates:
        "ஒருங்கிணைப்புகள்",

      complaintImage:
        "புகார் படம்",

      imageAlt:
        "புகார்",

      noImage:
        "புகார் படம் இல்லை",

      description:
        "விளக்கம்",

      noDescription:
        "விளக்கம் வழங்கப்படவில்லை.",

      status:
        "நிலை",

      remarks:
        "குறிப்புகள்",

      closedVerified:
        "மூடப்பட்டது — குடிமகனால் சரிபார்க்கப்பட்டது",

      verificationOtpSent:
        "சரிபார்ப்பு OTP அனுப்பப்பட்டது",

      enterOtp:
        "சரிபார்ப்பு OTP-ஐ உள்ளிடவும்",

      closedMessage:
        "குடிமகன் சரிபார்ப்பு வெற்றிகரமாக முடிந்த பிறகு புகார் மூடப்பட்டது.",

      statusOptions: {
        pending:
          "நிலுவையில்",

        readyForVerification:
          "சரிபார்ப்புக்கு தயார்",

        otpSent:
          "OTP அனுப்பப்பட்டது",

        inProgress:
          "செயல்பாட்டில்",

        assigned:
          "ஒதுக்கப்பட்டது",

        closed:
          "மூடப்பட்டது",
      },

      placeholders: {
        addRemarks:
          "குறிப்புகளைச் சேர்க்கவும்...",

        selectComplaint:
          "முதலில் ஒரு புகாரைத் தேர்ந்தெடுக்கவும்...",

        otp:
          "6 இலக்க OTP-ஐ உள்ளிடவும்",
      },

      actions: {
        callCitizen:
          "குடிமகனை அழைக்கவும்",

        viewOnMap:
          "ஒருங்கிணைப்புகளை வரைபடத்தில் காண்க",

        expandImage:
          "புகார் படத்தை விரிவாக்கு",

        cancel:
          "ரத்து செய்",

        saving:
          "சேமிக்கப்படுகிறது...",

        saveChanges:
          "மாற்றங்களைச் சேமி",

        requestVerification:
          "சரிபார்ப்பு OTP-ஐ கோரவும்",

        verifyOtp:
          "OTP-ஐ சரிபார்த்து புகாரை மூடு",
      },
    },

    kpis: {
      total:
        "மொத்த புகார்கள்",

      allComplaints:
        "அனைத்து புகார்கள்",

      pending:
        "நிலுவையில்",

      readyForVerification:
        "சரிபார்ப்புக்கு தயார்",

      closed:
        "மூடப்பட்டது",

      citizenVerified:
        "குடிமகனால் சரிபார்க்கப்பட்டது",
    },
  },

  gvpMap: {
    title:
      "GVP புள்ளி கண்காணிப்பு",

    points:
      "புள்ளிகள்",

    ward:
      "வார்டு",

    selectedWard:
      "தேர்ந்தெடுக்கப்பட்ட வார்டு",

    legend:
      "GVP புள்ளி",

    loading:
      "GVP புள்ளிகள் ஏற்றப்படுகின்றன...",

    selectWard:
      "ஒரு வார்டைத் தேர்ந்தெடுக்கவும்",

    selectWardDescription:
      "தலைப்பிலிருந்து நகரம், மண்டலம், பிரிவு மற்றும் வார்டைத் தேர்ந்தெடுக்கவும்.",

    unavailable:
      "GVP வரைபடம் கிடைக்கவில்லை",

    empty:
      "இந்தத் தேதிக்கான GVP புள்ளிகள் இல்லை",

    errors: {
      load:
        "GVP புள்ளிகளை ஏற்ற முடியவில்லை.",
    },

    tooltip: {
      gvpPoint:
        "GVP புள்ளி",

      vehicle:
        "வாகனம்",

      table:
        "அட்டவணை",

      iot:
        "IoT",

      unit:
        "அலகு",

      remarks:
        "குறிப்புகள்",

      gvpWaste:
        "GVP கழிவு",

      coordinates:
        "ஒருங்கிணைப்புகள்",
    },
  },

  cityOverviewMap: {
    title:
      "மேலோட்ட வரைபடங்கள்",

    mapFilters:
      "வரைபட வடிகட்டிகள்",

    cityOverview:
      "நகர மேலோட்ட வரைபடம்",

    routeMaps:
      "வழித்தட வரைபடங்கள்",

    liveMaps:
      "நேரடி வரைபடங்கள்",

    gvpPoints:
      "GVP புள்ளிகள்",

    plants:
      "ஆலைகள்",

    customerGrievances: {
      title:
        "வாடிக்கையாளர் குறைகள்",

      loading:
        "வாடிக்கையாளர் குறைகள் ஏற்றப்படுகின்றன...",

      error:
        "வாடிக்கையாளர் குறைகளை ஏற்ற முடியவில்லை.",

      empty:
        "வாடிக்கையாளர் குறைகள் எதுவும் கிடைக்கவில்லை.",

      complaints:
        "புகார்கள்",

      ticket:
        "டிக்கெட்",

      status:
        "நிலை",

      category:
        "வகை",

      phone:
        "தொலைபேசி",

      description:
        "விளக்கம்",

      address:
        "முகவரி",

      latitude:
        "அட்சரேகை",

      longitude:
        "தீர்க்கரேகை",

      date:
        "தேதி",
    },

    zone:
      "மண்டலம்",

    division:
      "பிரிவு",

    ward:
      "வார்டு",

    allZones:
      "அனைத்து மண்டலங்கள்",

    allDivisions:
      "அனைத்து பிரிவுகள்",

    allWards:
      "அனைத்து வார்டுகள்",

    selectZoneFirst:
      "முதலில் ஒரு மண்டலத்தைத் தேர்ந்தெடுக்கவும்",

    selectDivisionFirst:
      "முதலில் ஒரு பிரிவைத் தேர்ந்தெடுக்கவும்",

    loadingDivisions:
      "பிரிவுகள் ஏற்றப்படுகின்றன...",

    loadingWards:
      "வார்டுகள் ஏற்றப்படுகின்றன...",

    noDivisions:
      "பிரிவுகள் இல்லை",

    noWards:
      "வார்டுகள் இல்லை",

    loadingDivisionsFor:
      "இதற்கான பிரிவுகள் ஏற்றப்படுகின்றன",

    loadingWardsFor:
      "இதற்கான வார்டுகள் ஏற்றப்படுகின்றன",

    resetMap:
      "வரைபடத்தை மீட்டமை",

    selectedZone:
      "தேர்ந்தெடுக்கப்பட்ட மண்டலம்",

    selectedDivision:
      "தேர்ந்தெடுக்கப்பட்ட பிரிவு",

    selectedWard:
      "தேர்ந்தெடுக்கப்பட்ட வார்டு",

    city:
      "நகரம்",

    divisions:
      "பிரிவுகள்",

    wards:
      "வார்டுகள்",

    wardId:
      "வார்டு ID",

    plantLocations:
      "ஆலை இருப்பிடங்கள்",

    loadingPlants:
      "ஆலை இருப்பிடங்கள் ஏற்றப்படுகின்றன...",

    unableLoadPlants:
      "ஆலைகளை ஏற்ற முடியவில்லை",

    changeMapView:
      "வரைபடக் காட்சியை மாற்று",

    loading:
      "நகர வரைபடம் ஏற்றப்படுகிறது...",
  },
};

export default ta;