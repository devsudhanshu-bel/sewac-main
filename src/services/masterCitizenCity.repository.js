const masterCitizenPrisma = require("../config/masterCitizenPrisma");

async function createCity(data) {
  return masterCitizenPrisma.city_table.create({
    data: {
      city_name: data.cityName,
      geo_boundary: data.geoBoundary || null,
    },
  });
}

async function findCityById(cityId) {
  return masterCitizenPrisma.city_table.findUnique({
    where: {
      city_id: cityId,
    },
  });
}

async function findCityByName(cityName) {
  return masterCitizenPrisma.city_table.findUnique({
    where: {
      city_name: cityName,
    },
  });
}

async function updateCityTableName(cityId, tableName) {
  return masterCitizenPrisma.city_table.update({
    where: {
      city_id: cityId,
    },
    data: {
      city_table_name: tableName,
    },
  });
}

async function deleteCity(cityId) {
  return masterCitizenPrisma.city_table.delete({
    where: {
      city_id: cityId,
    },
  });
}

async function getAllCities() {
  return masterCitizenPrisma.city_table.findMany({
    orderBy: {
      city_id: "asc",
    },
  });
}

module.exports = {
  createCity,
  findCityById,
  findCityByName,
  updateCityTableName,
  deleteCity,
  getAllCities,
};