const mainDb = require("../config/mainDb");
const {
  citizenCache,
  activeScans,
  disposalQueue,
} = require("../config/citizenCache");

const processDisposalQueue = async () => {
  if (disposalQueue.length === 0) return;

  const payload = disposalQueue.shift();

  const {
    rfidSlno,
    wetWeightKg = 0,
    dryWeightKg = 0,
    vehicleId,
    vehicleName,
    latitude,
    longitude,
  } = payload;

  if (activeScans.has(rfidSlno)) return;

  activeScans.add(rfidSlno);

  try {
    const cachedData = citizenCache.get(rfidSlno);

    if (!cachedData) {
      throw new Error("Citizen not found");
    }

    const { citizen, type } = cachedData;

    let matchedWetSlno = null;
    let matchedDrySlno = null;
    let matchedWetRfid = null;
    let matchedDryRfid = null;

    if (type === "WET") {
      matchedWetSlno = citizen.wetSlno;
      matchedWetRfid = citizen.wetRFID;
    }

    if (type === "DRY") {
      matchedDrySlno = citizen.drySlno;
      matchedDryRfid = citizen.dryRFID;
    }

    const wetWeight = Number(wetWeightKg);
    const dryWeight = Number(dryWeightKg);

    const totalWeightKg = wetWeight + dryWeight;
    const rewardPoints = Math.floor(totalWeightKg * 10);

    await mainDb.query(
      `
      INSERT INTO waste_disposal_logs (
        citizen_id,
        person_name,
        phone_number,
        city,
        ward,
        area,
        wet_slno,
        dry_slno,
        wet_rfid,
        dry_rfid,
        disposal_type,
        wet_weight_kg,
        dry_weight_kg,
        total_weight_kg,
        reward_points,
        vehicle_id,
        vehicle_name,
        latitude,
        longitude
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19
      )
      `,
      [
        citizen.id,
        citizen.personName,
        citizen.phoneNumber,
        citizen.city,
        citizen.ward,
        citizen.area,
        matchedWetSlno,
        matchedDrySlno,
        matchedWetRfid,
        matchedDryRfid,
        type,
        wetWeight,
        dryWeight,
        totalWeightKg,
        rewardPoints,
        vehicleId,
        vehicleName,
        latitude,
        longitude,
      ]
    );
  } finally {
    activeScans.delete(rfidSlno);
  }
};

setInterval(processDisposalQueue, 5);

module.exports = {
  processDisposalQueue,
};