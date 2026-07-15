const { PrismaClient } = require("../generated/zone");
const prisma = new PrismaClient();

exports.getCities = async (req, res) => {
  const cities = await prisma.city_table.findMany({
    select: {
      city_id: true,
      city_name: true
    }
  });

  res.json(cities);
};

exports.getZones = async (req, res) => {
  const { cityId } = req.params;

  const zones = await prisma.zone_table.findMany({
    where: {
      city_id: Number(cityId)
    },
    select: {
      zone_id: true,
      zone_name: true
    }
  });

  res.json(zones);
};

exports.getDivisions = async (req, res) => {
  const { zoneId } = req.params;

  const divisions = await prisma.division_table.findMany({
    where: {
      zone_id: Number(zoneId)
    },
    select: {
      division_id: true,
      division_name: true
    }
  });

  res.json(divisions);
};

exports.getWards = async (req, res) => {
  const { divisionId } = req.params;

  const wards = await prisma.ward_table.findMany({
    where: {
      division_id: Number(divisionId)
    },
    select: {
      ward_id: true,
      ward_no: true,
      ward_name: true
    }
  });

  res.json(wards);
};