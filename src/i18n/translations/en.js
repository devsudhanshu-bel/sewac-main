const en = {
  common: {
    search: "Search...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    close: "Close",
    apply: "Apply",
    reset: "Reset",
    yes: "Yes",
    no: "No",
    active: "Active",
    inactive: "Inactive",
    loading: "Loading...",
    actions: "Actions",
    all: "All",
    total: "Total",
    included: "Included",
  },

  language: {
    english: "English",
    kannada: "Kannada",
    hindi: "Hindi",
  },

  header: {
    search: "Search...",
    date: "19 Aug 2026",
    dryDay: "Dry Day",
    wetDay: "Wet Day",
    admin: "Admin",
    adminLevel: "Admin Layer 1",
  },

  sidebar: {
    overview: "Overview",
    wasteGenerators: "Waste Generators",
    vehicles: "Vehicles",
    plant: "Plant",
    complaints: "Complaints",
    users: "Users",
    logs: "Logs",
    aiAgent: "AI Agent",
    settings: "Settings",
    logout: "Logout",
  },

  filters: {
    city: "Bangalore",
    corporation: "Bengaluru South City Corporation",
    zone: "Bommanahalli",
    ward: "Ibbalur",
  },

  overview: {
    title: "Overview",

    kpis: {
      totalWasteCollected: "Total Waste Collected",
      collectionPoints: "Collection Points",
      totalCitizens: "Total Citizens",

      citizensTrend: "Citizens Trend",
      trashGiven: "Trash Given",
      notGiven: "Not Given",

      kg: "KG",
      ton: "TON",
      tons: "TONS",
    },

    citizenTrend: {
      title: "Citizens Trend",
      trashGiven: "Trash Given",
      notGiven: "Not Given",
    },

    vehicleFleet: {
      title: "Vehicle Fleet Status",
      allVehicles: "All Vehicles",
      included: "Included",

      totalRegistered: "Total Registered Vehicles",
      running: "Running Vehicles",
      notRunning: "Not Running Vehicles",
    },

    generationTrend: {
      title: "Generation Trend",
      wasteGenerated: "Waste Generated (tons)",
      wards: "Wards",
    },

    cityOverviewMap: {
      title: "City Overview Map",
      mapFilters: "Map Filters",
      cityOverview: "City Overview Map",
      routeMaps: "Route Maps",
      gvpPoints: "GVP Points",
      collectionPoints: "Collection Points",
      vehicles: "Vehicles",
      plants: "Plants",
      wardBoundaries: "Ward Boundaries",
    },
  },

  users: {
    title: "Users",
    description: "Create and manage users in the system.",

    admin: {
      title: "Admin Level 1 Users",
      description:
        "Manage other Admin Level 1 users who have full access to the system.",
      search: "Search by name, email or phone...",
      add: "Add Admin",
      name: "Admin Name",
      email: "Email",
      phone: "Phone Number",
      status: "Status",
      createdAt: "Created At",
    },

    contractor: {
      title: "Contractor Users",
      description: "Manage contractor accounts and permissions.",
      search: "Search contractors...",
      add: "Add Contractor",
      name: "Name",
      email: "Email",
      role: "Role",
      lastLogin: "Last Login",
      status: "Status",
    },
  },

  generationTrend: {
  title: "Generation Trend",
  wasteGenerated: "Waste Generated (tons)",
  wasteGeneratedLabel: "Waste Generated",
  wards: "Wards",
  ward: "Ward",
},

wasteGenerators: {
  /* =========================================================
     PAGE
  ========================================================= */

  title: "Waste Generators",

  description:
    "Overview of waste generators participation, waste contribution, activity, monitoring and collection performance.",

  /* =========================================================
     KPIs
  ========================================================= */

  kpis: {
    generatorStatus: "Waste Generator Status",

    activeGenerators: "Active Waste Generators",

    inactiveGenerators: "Inactive Waste Generators",

    totalWasteGenerated: "Total Waste Generated",

    averageWaste: "Average Waste",

    perHouseDay: "Per House / Day",

    classification: "Waste Generator Classification",

    aboveAverage: "Above Average",

    belowAverage: "Below Average",
  },

  /* =========================================================
     GVP
  ========================================================= */

  gvp: {
    title: "GVP Generation Trend",

    loading: "Loading GVP data...",

    empty:
      "No GVP data available for the selected date and division.",

    error: "Unable to load GVP trend",

    wardNo: "Ward No",

    gvp: "GVP",
  },

  /* =========================================================
     MAP
  ========================================================= */

  map: {
    title: "Collection Point Monitoring",

    points: "points",

    ward: "Ward",

    selectedWard: "Selected Ward",

    /* ================= LEGEND ================= */

    legend: {
      collectionPoint: "Collection Point",

      gvpPoint: "GVP Point",
    },

    /* ================= MAP STATES ================= */

    loading: "Loading daily vehicle telemetry...",

    selectWard: "Select a ward",

    selectWardDescription:
      "Choose City, Zone, Division and Ward from the header.",

    mapUnavailable: "Map unavailable",

    noBoundary:
      "Ward boundary unavailable for this selection",

    noTelemetry:
      "No telemetry points for this date",

    /* ================= MAP SUMMARY ================= */

    summary: {
      showing: "Showing",

      telemetryCoordinates:
        "telemetry coordinates from",

      vehicleTables: "vehicle tables",

      gvpPoints: "GVP points",
    },

    /* ================= ERRORS ================= */

    errors: {
      loadWardMap:
        "Unable to load the selected ward map.",
    },

    /* ================= TOOLTIP ================= */

    tooltip: {
      collectionVehicle: "Collection Vehicle",

      gvpPoint: "GVP Point",

      vehicle: "Vehicle",

      table: "Table",

      iot: "IoT",

      unit: "Unit",

      remarks: "Remarks",

      gvpWaste: "GVP waste",

      coordinates: "Coordinates",
    },
  },
},

vehicles: {
  title: "Vehicles",

  description:
    "Monitor vehicle fleet status, activity and waste collection performance.",

  kpis: {
    totalVehicles: "Total Vehicles",
    activeVehicles: "Active Vehicles",
    inactiveVehicles: "Inactive Vehicles",
    averageWeight: "Per Vehicles Avg",
    weightCollection: "Weight Collection",
  },

  averageWeightChart: {
    title: "Average Weight Generated (Line Graph)",

    averageWasteGenerated:
      "Average waste generated:",

    viewBy: "View By:",

    city: "City",

    weightOfWaste:
      "Weight of Waste (Ton)",

    zoneName: "Zone Name",

    wasteGenerated:
      "Waste Generated",

    vehiclesRunning:
      "Vehicles Running",

    difference:
      "Difference",

    overThreshold:
      "Over Threshold",

    belowThreshold:
      "Below Threshold",

    averageWaste:
      "Average Waste",

    wasteGeneratedLegend:
      "Waste Generated (Ton)",

    thresholdLegend:
      "Average Waste Generated (Threshold)",
  },

  telemetryDirectory: {
    title: "Telemetry Directory",

    searchPlaceholder:
      "Search by Vehicle ID",

    allStatus:
      "All Status",

    active:
      "Active",

    inactive:
      "Inactive",

    download:
      "Download",

    createVehicle:
      "Create Vehicle",

    vehicleId:
      "Vehicle ID",

    routeZone:
      "Route / Zone",

    lastUpdate:
      "Last Update",

    status:
      "Status",

    actions:
      "Actions",

    action:
      "Action",

    update:
      "Update",

    delete:
      "Delete",

    noVehicles:
      "No vehicles found.",

    showing:
      "Showing",

    to:
      "to",

    of:
      "of",

    vehicles:
      "vehicles",

    rowsPerPage:
      "Rows per page:",

    csv: {
      vehicleId:
        "Vehicle ID",

      vehicleNumber:
        "Vehicle Number",

      vehicleType:
        "Vehicle Type",

      city:
        "City",

      zone:
        "Zone",

      division:
        "Division",

      ward:
        "Ward",

      status:
        "Status",
    },
  },

  editVehicle: {
    title:
      "Update Vehicle",

    vehicleId:
      "Vehicle ID",

    vehicleType:
      "Vehicle Type",

    active:
      "Active",

    inactive:
      "Inactive",

    selectCity:
      "Select City",

    selectZone:
      "Select Zone",

    selectDivision:
      "Select Division",

    selectWard:
      "Select Ward",

    cancel:
      "Cancel",

    update:
      "Update",

    errors: {
      updateFailed:
        "Failed to update vehicle",
    },
  },

  deleteVehicle: {
    title:
      "Delete Vehicle",

    confirmation:
      "Are you sure you want to delete this vehicle",

    cancel:
      "Cancel",

    delete:
      "Delete",

    errors: {
      deleteFailed:
        "Failed to delete vehicle.",
    },
  },
},

plants: {
  title: "Plant Overview",

  description:
    "Monitor all waste processing plants and their operations.",

  loading:
    "Loading Plant Dashboard...",

  retry:
    "Retry",

  errors: {
    serverConnection:
      "Unable to connect to the server.",
  },

  kpis: {
    totalPlants:
      "Total Plants",

    allRegisteredPlants:
      "All registered plants",

    totalVehiclesEnrolled:
      "Total Vehicles Enrolled",

    acrossAllPlants:
      "Across all plants",

    totalWasteCollected:
      "Total Waste Collected",

    allTimeCollection:
      "All time collection",
  },

  directory: {
    title:
      "Plant Directory",

    addPlant:
      "Add Plant",

    plantName:
      "Plant Name",

    zone:
      "Zone",

    capacity:
      "Capacity (Ton/Day)",

    plantManager:
      "Plant Manager",

    vehiclesEnrolled:
      "Vehicles Enrolled",

    actions:
      "Actions",

    updatePlant:
      "Update Plant",

    deletePlant:
      "Delete Plant",

    noPlants:
      "No plants found.",

    showing:
      "Showing",

    of:
      "of",

    plants:
      "plants",

    rowsPerPage:
      "Rows per page",
  },

  createPlant: {
    title:
      "Create Plant",

    plantName:
      "Plant Name",

    plantType:
      "Plant Type",

    city:
      "City",

    zone:
      "Zone",

    division:
      "Division",

    ward:
      "Ward",

    plantManager:
      "Plant Manager",

    capacity:
      "Capacity (Ton/Day)",

    vehiclesEnrolled:
      "Vehicles Enrolled",

    wasteCollected:
      "Waste Collected",

    latitude:
      "Latitude",

    longitude:
      "Longitude",

    active:
      "ACTIVE",

    inactive:
      "INACTIVE",

    cancel:
      "Cancel",

    create:
      "Create",

    errors: {
      createFailed:
        "Failed to create plant.",
    },
  },

  editPlant: {
    title:
      "Update Plant",

    plantName:
      "Plant Name",

    plantType:
      "Plant Type",

    city:
      "City",

    zone:
      "Zone",

    division:
      "Division",

    ward:
      "Ward",

    plantManager:
      "Plant Manager",

    capacity:
      "Capacity",

    vehiclesEnrolled:
      "Vehicles Enrolled",

    wasteCollected:
      "Waste Collected",

    latitude:
      "Latitude",

    longitude:
      "Longitude",

    active:
      "ACTIVE",

    inactive:
      "INACTIVE",

    cancel:
      "Cancel",

    update:
      "Update",

    errors: {
      updateFailed:
        "Failed to update plant.",
    },
  },

  deletePlant: {
    title:
      "Delete Plant",

    confirmation:
      "Are you sure you want to delete this plant?",

    cancel:
      "Cancel",

    delete:
      "Delete",

    errors: {
      deleteFailed:
        "Failed to delete plant.",
    },
  },
},
};

export default en;