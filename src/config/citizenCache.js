const helperDb = require("./helperDb");

const citizenCache = new Map();
const activeScans = new Set();
const telemetryQueue = [];

const loadCitizenCache = async () => {
  const result = await helperDb.query(`
    SELECT * FROM master_citizen_data
  `);
 
  citizenCache.clear();

  for (const citizen of result.rows) {
    if (citizen.wetRFID) {

    citizenCache.set(citizen.wetRFID,{

    citizen,

    wasteType:"WET",

    matchedRFID: citizen.wetRFID

});

}

    if(citizen.dryRFID){

    citizenCache.set(citizen.dryRFID,{

    citizen,

    wasteType:"DRY",

    matchedRFID: citizen.dryRFID

});
}

}


  console.log(`Cache loaded with ${citizenCache.size} RFIDs`);
};

module.exports = {
  citizenCache,
  activeScans,
  telemetryQueue,
  loadCitizenCache,
};

