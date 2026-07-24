// ==============================
// STATS CARDS
// ==============================

export const workerStats = [
  {
    title: "Total Workers",
    value: "1,248",
    change: "+12%",
    positive: true,
  },
  {
    title: "Active Workers Today",
    value: "1,187",
    change: "+4%",
    positive: true,
  },
  {
    title: "Collection Points",
    value: "8,942",
    change: "+8%",
    positive: true,
  },
  {
    title: "Waste Collected",
    value: "12.4 Tons",
    change: "+6%",
    positive: true,
  },
  {
    title: "Avg Efficiency",
    value: "92%",
    change: "+2%",
    positive: true,
  },
  {
    title: "Avg Distance",
    value: "14.2 km",
    change: "-1%",
    positive: false,
  },
];

// ==============================
// PERFORMANCE CHART
// ==============================

export const performanceData = [
  {
    day: "Mon",
    collectionPoints: 820,
    wasteCollected: 9.8,
  },
  {
    day: "Tue",
    collectionPoints: 890,
    wasteCollected: 10.5,
  },
  {
    day: "Wed",
    collectionPoints: 950,
    wasteCollected: 11.3,
  },
  {
    day: "Thu",
    collectionPoints: 1000,
    wasteCollected: 11.8,
  },
  {
    day: "Fri",
    collectionPoints: 1070,
    wasteCollected: 12.2,
  },
  {
    day: "Sat",
    collectionPoints: 1130,
    wasteCollected: 12.9,
  },
  {
    day: "Sun",
    collectionPoints: 1180,
    wasteCollected: 13.5,
  },
];

// ==============================
// DONUT CHART
// ==============================

export const wasteTypeData = [
  {
    name: "Wet Waste",
    value: 40,
  },
  {
    name: "Dry Waste",
    value: 30,
  },
  {
    name: "Recyclable",
    value: 20,
  },
  {
    name: "Others",
    value: 10,
  },
];

// ==============================
// MAP LOCATIONS
// ==============================

export const routeLocations = [
  {
    id: 1,
    worker: "Rajesh Kumar",
    position: [12.9716, 77.5946],
  },
  {
    id: 2,
    worker: "Priya Sharma",
    position: [12.9784, 77.5998],
  },
  {
    id: 3,
    worker: "Amit Verma",
    position: [12.9652, 77.6021],
  },
  {
    id: 4,
    worker: "Sunita Rao",
    position: [12.9822, 77.5889],
  },
];

// ==============================
// TABLE DATA
// ==============================

export const workersTableData = [
  {
    id: "WK001",
    name: "Rajesh Kumar",
    vehicle: "KA-01-2345",
    collectionPoints: 82,
    waste: "1.8 Tons",
    distance: "16 km",
    efficiency: "98%",
    status: "Active",
  },
  {
    id: "WK002",
    name: "Priya Sharma",
    vehicle: "KA-01-2390",
    collectionPoints: 79,
    waste: "1.7 Tons",
    distance: "15 km",
    efficiency: "95%",
    status: "Active",
  },
  {
    id: "WK003",
    name: "Amit Verma",
    vehicle: "KA-01-2210",
    collectionPoints: 75,
    waste: "1.6 Tons",
    distance: "14 km",
    efficiency: "92%",
    status: "Active",
  },
  {
    id: "WK004",
    name: "Sunita Rao",
    vehicle: "KA-01-2451",
    collectionPoints: 72,
    waste: "1.5 Tons",
    distance: "13 km",
    efficiency: "90%",
    status: "Inactive",
  },
  {
    id: "WK005",
    name: "Vikram Singh",
    vehicle: "KA-01-2784",
    collectionPoints: 68,
    waste: "1.4 Tons",
    distance: "12 km",
    efficiency: "88%",
    status: "Active",
  },
];

// ==============================
// RANKING
// ==============================

export const rankingData = [
  {
    rank: 1,
    name: "Rajesh Kumar",
    score: 98,
  },
  {
    rank: 2,
    name: "Priya Sharma",
    score: 95,
  },
  {
    rank: 3,
    name: "Amit Verma",
    score: 92,
  },
  {
    rank: 4,
    name: "Sunita Rao",
    score: 90,
  },
  {
    rank: 5,
    name: "Vikram Singh",
    score: 88,
  },
];

// ==============================
// ALERTS
// ==============================

export const alertsData = [
  {
    id: 1,
    type: "warning",
    message: "Worker WK004 has missed 2 collection points.",
    time: "10 mins ago",
  },
  {
    id: 2,
    type: "success",
    message: "Rajesh Kumar completed route successfully.",
    time: "20 mins ago",
  },
  {
    id: 3,
    type: "info",
    message: "Vehicle KA-01-2390 entered Zone 3.",
    time: "35 mins ago",
  },
  {
    id: 4,
    type: "warning",
    message: "Waste collection delayed in Sector B.",
    time: "1 hour ago",
  },
];