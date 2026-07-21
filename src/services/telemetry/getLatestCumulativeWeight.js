const mainDb = require("../../config/mainDb");

const getLatestCumulativeWeight = async () => {
  const { rows } = await mainDb.query(`
    SELECT cumulative_weight_kg
    FROM telemetry_logs
    ORDER BY id DESC
    LIMIT 1
  `);

  if (rows.length === 0) {
    return 0;
  }

  return Number(rows[0].cumulative_weight_kg) || 0;
};

module.exports = getLatestCumulativeWeight;