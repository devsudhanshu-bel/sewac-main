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

gvpOverviewMap: {
  title: "GVP Overview Map",
  subtitle: "Overview of GVP points across Bengaluru",

  filters: {
    cityOverview: "City Overview",
    routeMaps: "Route Maps",
    gvpPoints: "GVP Points",
    plants: "Plants",
    wardBoundaries: "Ward Boundaries",
  },

  map: {
    loading: "Loading map...",
    noData: "No GVP points found.",
    gvpPoint: "GVP Point",
    name: "Name",
    location: "Location",
    status: "Status",
    coordinates: "Coordinates",
    latitude: "Latitude",
    longitude: "Longitude",
  },

  status: {
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
  },

  legend: {
    gvpPoints: "GVP Points",
    plants: "Plants",
    wardBoundary: "Ward Boundary",
    route: "Route",
  },
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
    "Loading plants dashboard...",

  retry:
    "Retry",

  errors: {
    serverConnection:
      "Unable to connect to the server.",

    createFailed:
      "Unable to create plant.",

    updateFailed:
      "Unable to update plant.",

    deleteFailed:
      "Unable to delete plant.",
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
      "All-time collection",
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
      "Active",

    inactive:
      "Inactive",

    cancel:
      "Cancel",

    create:
      "Create",

    errors: {
      createFailed:
        "Unable to create plant.",
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
      "Active",

    inactive:
      "Inactive",

    cancel:
      "Cancel",

    update:
      "Update",

    errors: {
      updateFailed:
        "Unable to update plant.",
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
        "Unable to delete plant.",
    },
  },

  /*
   * =========================================================
   * PLANT MAP
   * =========================================================
   */

  map: {
    title:
      "Plant Locations",

    subtitle:
      "Waste processing plants",

    maximize:
      "Maximize map",

    loading:
      "Loading plant locations...",

    empty:
      "No plant locations available",

    unnamedPlant:
      "Unnamed Plant",

    notAssigned:
      "Not Assigned",

    unknown:
      "Unknown",

    vehicles:
      "Vehicles",

    tonPerDay:
      "Ton/Day",
  },
},

users: {
  title: "Users",

  description:
    "Create and manage users in the system.",

  footer:
    "© 2026 SEWAC. All rights reserved.",
},

complaints: {
  /* =========================================================
     PAGE
  ========================================================= */

  title: "Complaints",

  description:
    "Manage and track citizen complaints",

  /* =========================================================
     TABLE
  ========================================================= */

  table: {
    title: "Complaints",

    complaint: "complaint",

    found: "found",

    updating: "Updating...",

    location: "Location",

    createdAt: "Created At",

    loading: "Loading complaints...",

    empty: "No complaints found.",

    showing: "Showing",

    to: "to",

    of: "of",

    complaints: "complaints",

    previousPage: "Previous page",

    nextPage: "Next page",
  },

  /* =========================================================
     FILTERS
  ========================================================= */

  filters: {
    searchPlaceholder:
      "Search by ticket, phone, title, address...",

    category: "Category",

    all: "All",

    to: "to",

    reset: "Reset Filters",

    categories: {
      missedCollection: "Missed Collection",

      overflowingBin: "Overflowing Bin",

      illegalDumping: "Illegal Dumping",

      streetLitter: "Street Litter",

      damagedBin: "Damaged Bin",

      other: "Other",
    },
  },

  /* =========================================================
     DETAILS
  ========================================================= */

  details: {
    empty: {
      title: "Select a complaint",

      description:
        "Select a complaint from the table to view its details.",
    },

    ticketNumber: "Ticket Number",

    title: "Title",

    category: "Category",

    citizenPhone: "Citizen (Phone)",

    address: "Address",

    coordinates: "Coordinates",

    complaintImage: "Complaint Image",

    imageAlt: "Complaint",

    noImage: "No complaint image",

    description: "Description",

    noDescription: "No description provided.",

    status: "Status",

    remarks: "Remarks",

    closedVerified:
      "Closed — Citizen Verified",

    verificationOtpSent:
      "Verification OTP Sent",

    enterOtp:
      "Enter Verification OTP",

    closedMessage:
      "Complaint closed after successful citizen verification.",

    statusOptions: {
      pending: "Pending",

      readyForVerification:
        "Ready for Verification",

      otpSent:
        "OTP Sent",

      inProgress:
        "In Progress",

      assigned:
        "Assigned",

      closed:
        "Closed",
    },

    placeholders: {
      addRemarks:
        "Add remarks...",

      selectComplaint:
        "Select a complaint first...",

      otp:
        "Enter 6-digit OTP",
    },

    actions: {
      callCitizen:
        "Call citizen",

      viewOnMap:
        "View coordinates on map",

      expandImage:
        "Expand complaint image",

      cancel:
        "Cancel",

      saving:
        "Saving...",

      saveChanges:
        "Save Changes",

      requestVerification:
        "Request Verification OTP",

      verifyOtp:
        "Verify OTP & Close Complaint",
    },
  },

  /* =========================================================
     KPIs
  ========================================================= */

  kpis: {
    total:
      "Total Complaints",

    allComplaints:
      "All complaints",

    pending:
      "Pending",

    readyForVerification:
      "Ready for Verification",

    closed:
      "Closed",

    citizenVerified:
      "Citizen verified",
  },
},

cityOverviewMap: {
  title: "OVERVIEW MAPS",

  mapFilters: "MAP FILTERS",

  cityOverview: "City Overview Map",
  routeMaps: "Route Maps",
  gvpPoints: "GVP Points",
  plants: "Plants",
  customerGrievances: "Customer Grievances",

  zone: "ZONE",
  division: "DIVISION",
  ward: "WARD",

  allZones: "All Zones",
  allDivisions: "All Divisions",
  allWards: "All Wards",

  selectZoneFirst: "Select a Zone First",
  selectDivisionFirst: "Select a Division First",

  loadingDivisions: "Loading Divisions...",
  loadingWards: "Loading Wards...",

  noDivisions: "No Divisions",
  noWards: "No Wards",

  loadingDivisionsFor: "Loading divisions for",
  loadingWardsFor: "Loading wards for",

  resetMap: "Reset Map",

  selectedZone: "Selected Zone",
  selectedDivision: "Selected Division",
  selectedWard: "Selected Ward",

  city: "City",
  divisions: "Divisions",
  wards: "Wards",

  wardId: "Ward ID",

  plantLocations: "Plant Locations",
  loadingPlants: "Loading plant locations...",
  unableLoadPlants: "Unable to Load Plants",

  changeMapView: "Change map view",

  loading: "Loading city map...",
},

gvpMap: {
  title: "GVP Point Monitoring",

  points: "points",

  ward: "Ward",

  selectedWard: "Selected Ward",

  legend: "GVP Point",

  loading: "Loading GVP points...",

  selectWard: "Select a ward",

  selectWardDescription:
    "Choose City, Zone, Division and Ward from the header.",

  unavailable: "GVP map unavailable",

  empty: "No GVP points for this date",

  errors: {
    load: "Unable to load GVP points.",
  },

  tooltip: {
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

cityOverviewMap: {
  title: "OVERVIEW MAPS",

  mapFilters: "MAP FILTERS",

  cityOverview: "City Overview Map",
  routeMaps: "Route Maps",
  gvpPoints: "GVP Points",
  plants: "Plants",

  customerGrievances: {
    title: "Customer Grievances",

    loading:
      "Loading customer grievances...",

    error:
      "Unable to load customer grievances.",

    empty:
      "No customer grievances found.",

    complaints:
      "Complaints",

    ticket:
      "Ticket",

    status:
      "Status",

    category:
      "Category",

    phone:
      "Phone",

    description:
      "Description",

    address:
      "Address",

    latitude:
      "Latitude",

    longitude:
      "Longitude",

    date:
      "Date",
  },

  zone: "ZONE",
  division: "DIVISION",
  ward: "WARD",

  allZones: "All Zones",
  allDivisions: "All Divisions",
  allWards: "All Wards",

  selectZoneFirst: "Select a Zone First",
  selectDivisionFirst:
    "Select a Division First",

  loadingDivisions:
    "Loading Divisions...",

  loadingWards:
    "Loading Wards...",

  noDivisions:
    "No Divisions",

  noWards:
    "No Wards",

  loadingDivisionsFor:
    "Loading divisions for",

  loadingWardsFor:
    "Loading wards for",

  resetMap:
    "Reset Map",

  selectedZone:
    "Selected Zone",

  selectedDivision:
    "Selected Division",

  selectedWard:
    "Selected Ward",

  city: "City",

  divisions:
    "Divisions",

  wards:
    "Wards",

  wardId:
    "Ward ID",

  plantLocations:
    "Plant Locations",

  loadingPlants:
    "Loading plant locations...",

  unableLoadPlants:
    "Unable to Load Plants",

  changeMapView:
    "Change map view",

  loading:
    "Loading city map...",
},

users: {
  title: "Users",

  description:
    "Create and manage users in the system.",

  // =========================================================
  // ADMIN LEVEL 1
  // =========================================================

  admin: {
    title: "Admin Level 1 Users",

    description:
      "Manage other Admin Level 1 users who have full access to the system.",

    searchPlaceholder:
      "Search by name, email or phone...",

    addButton:
      "Add Admin",

    loading:
      "Loading Admin Level 1 users...",

    empty:
      "No Admin Level 1 users found.",

    errors: {
      fetchFailed:
        "Failed to fetch Admin Level 1 users.",
    },

    table: {
      slNo: "SL.No",
      name: "Admin Name",
      email: "Email",
      phone: "Phone Number",
      status: "Status",
      createdAt: "Created At",
      actions: "Actions",
    },

    actions: {
      edit: "Edit user",
      delete: "Delete user",
    },

    pagination: {
      showing: "Showing",
      of: "of",
      entries: "entries",
      previous: "Previous page",
      next: "Next page",
    },

    modals: {
      addTitle: "Add Admin",
      editTitle: "Edit Admin",
    },
  },

  // =========================================================
  // CONTRACTOR
  // =========================================================

  contractor: {
    title: "Contractor Users",

    description:
      "Manage contractor accounts and permissions.",

    searchPlaceholder:
      "Search contractors...",

    addButton:
      "Add Contractor",

    loading:
      "Loading Contractor users...",

    empty:
      "No contractor users found.",

    errors: {
      fetchFailed:
        "Failed to fetch Contractor users.",
    },

    table: {
      slNo: "SL.No",
      name: "Name",
      email: "Email",
      phone: "Phone Number",
      status: "Status",
      createdAt: "Created At",
      actions: "Actions",
    },

    actions: {
      edit: "Edit user",
      delete: "Delete user",
    },

    pagination: {
      showing: "Showing",
      of: "of",
      entries: "entries",
      previous: "Previous page",
      next: "Next page",
    },

    modals: {
      addTitle: "Add Contractor",
      editTitle: "Edit Contractor",
    },
  },

  // =========================================================
  // COMMON USER TABLE
  // =========================================================

  table: {
    slNo: "SL.No",
    name: "Name",
    email: "Email",
    phone: "Phone Number",
    role: "Role",
    lastLogin: "Last Login",
    status: "Status",
    createdAt: "Created At",

    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    blocked: "Blocked",

    actions: "Actions",

    showing: "Showing",
    of: "of",
    entries: "entries",

    users: "users",

    rowsPerPage: "Rows per page",

    previous: "Previous",
    next: "Next",

    noUsers: "No users found",
  },

  // =========================================================
  // COMMON ACTIONS
  // =========================================================

  actions: {
    edit: "Edit user",
    delete: "Delete user",
  },

  // =========================================================
  // ADD / EDIT USER MODAL
  // =========================================================

modal: {
  fullName: "Full Name",
  email: "Email",
  password: "Password",
  phoneNumber: "Phone Number",

  fullNamePlaceholder: "Enter full name",
  emailPlaceholder: "Enter email",
  passwordPlaceholder: "Enter password",
  phoneNumberPlaceholder: "Enter phone number",

  cancel: "Cancel",
  save: "Save",
  saving: "Saving...",

  // Edit
  update: "Update",
  updating: "Updating...",
  emailCannotChange: "Email cannot be changed.",

  // Delete
  deleteTitle: "Delete User",
  delete: "Delete",
  deleting: "Deleting...",
  close: "Close",

  deleteConfirmation:
    "Are you sure you want to permanently delete",

  deleteWarning:
    "This action will permanently remove this user from the system and cannot be undone.",

  userFallback: "this user",

  errors: {
    fillAllFields:
      "Please fill in all fields.",

    roleMissing:
      "User role is missing.",

    createFailed:
      "Failed to create user.",

    updateFailed:
      "Failed to update user.",

    userIdMissing:
      "User ID is missing.",

    deleteFailed:
      "Failed to delete user.",
  },
},
},
};

export default en;