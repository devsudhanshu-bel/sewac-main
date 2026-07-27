// src/services/overviewService.js

const helperDb = require("../config/helperDb");
const mainDb = require("../config/mainDb");

const getSummary = async () => {
  const [
    totalCitizensResult,
    totalWasteResult,
    collectionPointsResult,
    trashGivenResult,
  ] = await Promise.all([
    helperDb.query(`
      SELECT COUNT(*) AS total
      FROM master_citizen_data
    `),

    mainDb.query(`
      SELECT COALESCE(SUM(cumulative_weight_kg),0) AS total
      FROM telemetry_logs
    `),

    mainDb.query(`
      SELECT COUNT(*) AS total
      FROM (
        SELECT DISTINCT latitude, longitude
        FROM telemetry_logs
        WHERE latitude IS NOT NULL
          AND longitude IS NOT NULL
      ) t
    `),

    mainDb.query(`
      SELECT COUNT(DISTINCT citizen_id) AS total
      FROM telemetry_logs
      WHERE citizen_id IS NOT NULL
        AND (remarks IS NULL OR remarks <> 'O')
    `),
  ]);

  const totalCitizens = Number(totalCitizensResult.rows[0].total);

  const totalWasteCollected = Number(totalWasteResult.rows[0].total);

  const collectionPoints = Number(collectionPointsResult.rows[0].total);

  const trashGiven = Number(trashGivenResult.rows[0].total);

  const notGiven = Math.max(totalCitizens - trashGiven, 0);

  return {
    totalWasteCollected,

    collectionPoints,

    totalCitizens,

    trashGiven,

    notGiven,
  };
};

const getVehicleSummary = async () => {
  const [totalVehiclesResult, runningVehiclesResult] = await Promise.all([
    mainDb.query(`
      SELECT COUNT(*) AS total
      FROM vehicle_master
    `),

    mainDb.query(`
      SELECT COUNT(*) AS total
      FROM vehicle_master
      WHERE status='ACTIVE'
    `),
  ]);

  const totalVehicles = Number(totalVehiclesResult.rows[0].total);

  const runningVehicles = Number(runningVehiclesResult.rows[0].total);

  const inactiveVehicles = totalVehicles - runningVehicles;

  return {
    totalVehicles,

    runningVehicles,

    inactiveVehicles,
  };
};

const getGenerationTrend = async () => {
  const result = await mainDb.query(`
    SELECT
        vm.zone,
        COALESCE(SUM(t.cumulative_weight_kg),0) AS wasteGenerated
    FROM telemetry_logs t
    INNER JOIN vehicle_master vm
        ON vm.vehicle_number = t.vehicle_number
    GROUP BY vm.zone
    ORDER BY vm.zone;
  `);

  return result.rows.map((row) => ({
    label: row.zone,

    wasteGenerated: Number(row.wastegenerated),

    threshold: 6500,
  }));
};

const getMapData = async () => {
  return {
    defaultView: "route-map",
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
  getSummary,
  getVehicleSummary,
  getGenerationTrend,
  getMapData,
  getOverviewFilters,
};
