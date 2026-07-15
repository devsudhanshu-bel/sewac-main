// src/services/overviewService.js

const helperDb = require("../config/helperDb");
const mainDb = require("../config/mainDb");

const getOverviewStats = async () => {
  const totalCitizensResult = await helperDb.query(`
    SELECT COUNT(*) as total
    FROM master_citizen_data
  `);

  const totalCitizens = Number(totalCitizensResult.rows[0].total);
  const totalVehiclesResult = await mainDb.query(`
    SELECT COUNT(*) AS total
    FROM vehicle_master
`);

  const runningVehiclesResult = await mainDb.query(`
    SELECT COUNT(*) AS total
    FROM vehicle_master
    WHERE status = 'ACTIVE'
`);

  const totalVehicles = Number(totalVehiclesResult.rows[0].total);

  const runningVehicles = Number(runningVehiclesResult.rows[0].total);

  const inactiveVehicles = totalVehicles - runningVehicles;

  return {
    summary: {
      totalWasteCollected: 0,

      collectionPoints: 0,

      totalCitizens,

      trashGiven: totalCitizens,

      notGiven: 0,
    },

    vehicleSummary: {
      totalVehicles,

      runningVehicles,

      inactiveVehicles
    },

    generationTrend: [
      {
        label: "West Corporation",
        wasteGenerated: 2200,
        threshold: 6500,
      },

      {
        label: "North Corporation",
        wasteGenerated: 4500,
        threshold: 6500,
      },

      {
        label: "East Corporation",
        wasteGenerated: 7800,
        threshold: 6500,
      },

      {
        label: "Central Corporation",
        wasteGenerated: 5200,
        threshold: 6500,
      },

      {
        label: "South Corporation",
        wasteGenerated: 6100,
        threshold: 6500,
      },
    ],

    map: {
      defaultView: "route-map",
    },
  };
};
const getOverviewFilters = async () => {
  const citiesResult = await helperDb.query(`
    SELECT DISTINCT city
    FROM master_citizen_data
    WHERE city IS NOT NULL
    ORDER BY city
  `);

  const wardsResult = await helperDb.query(`
    SELECT DISTINCT ward
    FROM master_citizen_data
    WHERE ward IS NOT NULL
    ORDER BY ward
  `);

  return {
    cities: citiesResult.rows.map((row) => row.city),

    wards: wardsResult.rows.map((row) => row.ward),
  };
};

module.exports = {
  getOverviewStats,
  getOverviewFilters,
};
