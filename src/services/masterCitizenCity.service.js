const repository = require("./masterCitizenCity.repository");

const {
  generateCityTableName,
  createCityTable,
  cityTableExists,
} = require("../utils/masterCitizenTables");

async function createCity({ cityName, geoBoundary }) {
  if (!cityName || typeof cityName !== "string") {
    throw new Error("cityName is required");
  }

  const cleanedCityName = cityName.trim();

  if (!cleanedCityName) {
    throw new Error("cityName cannot be empty");
  }

  const existingCity = await repository.findCityByName(cleanedCityName);

  if (existingCity) {
    throw new Error("City already exists");
  }

  const cityTableName = generateCityTableName(cleanedCityName);

  const tableAlreadyExists = await cityTableExists(cityTableName);

  if (tableAlreadyExists) {
    throw new Error(
      `Generated city table "${cityTableName}" already exists`
    );
  }

  /**
   * Step 1:
   * Create the city record.
   */
  const city = await repository.createCity({
    cityName: cleanedCityName,
    geoBoundary,
  });

  try {
    /**
     * Step 2:
     * Create the physical city table.
     */
    await createCityTable(cityTableName);

    /**
     * Step 3:
     * Store the physical table name
     * inside the city registry.
     */
    const updatedCity = await repository.updateCityTableName(
      city.city_id,
      cityTableName
    );

    return updatedCity;
  } catch (error) {
    /**
     * If dynamic table creation fails,
     * remove the city record so we don't
     * leave an incomplete city behind.
     */
    await repository.deleteCity(city.city_id);

    throw error;
  }
}

async function getCity(cityId) {
  const city = await repository.findCityById(cityId);

  if (!city) {
    throw new Error("City not found");
  }

  return city;
}

async function getCities() {
  return repository.getAllCities();
}

module.exports = {
  createCity,
  getCity,
  getCities,
};