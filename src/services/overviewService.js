// src/services/overviewService.js

const helperDb = require("../config/helperDb");

const getOverviewStats = async () => {

  const totalCitizensResult = await helperDb.query(`
    SELECT COUNT(*) as total
    FROM master_citizen_data
  `);

  const totalCitizens = Number(
    totalCitizensResult.rows[0].total
  );

  return {
    stats: {
      totalWasteCollected: 0,
      activeVehicles: 0,
      collectionPoints: totalCitizens,
      activeWorkers: 0,
      citizenParticipation: totalCitizens,
      efficiencyScore: 0
    }
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
    cities: citiesResult.rows.map(
      row => row.city
    ),

    wards: wardsResult.rows.map(
      row => row.ward
    )
  };
};

module.exports = {
  getOverviewStats,
  getOverviewFilters,
};