const helperDb = require("./helperDb");

const citizenCache = new Map();
const activeScans = new Set();
const disposalQueue = [];

const loadCitizenCache = async () => {
  const result = await helperDb.query(`
    SELECT * FROM master_citizen_data
  `);

  citizenCache.clear();

  for (const citizen of result.rows) {
    if (citizen.wetSlno) {
      citizenCache.set(citizen.wetSlno, {
        citizen,
        type: "WET",
      });
    }

    if (citizen.drySlno) {
      citizenCache.set(citizen.drySlno, {
        citizen,
        type: "DRY",
      });
    }
  }

  console.log(`Cache loaded with ${citizenCache.size} RFIDs`);
};

module.exports = {
  citizenCache,
  activeScans,
  disposalQueue,
  loadCitizenCache,
};