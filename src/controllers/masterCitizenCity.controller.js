const service = require("../services/masterCitizenCity.service");

async function createCity(req, res) {
  try {
    const { cityName, geoBoundary } = req.body;

    const city = await service.createCity({
      cityName,
      geoBoundary,
    });

    return res.status(201).json({
      success: true,
      message: "City created successfully",
      data: city,
    });
  } catch (error) {
    console.error("Create city error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getCity(req, res) {
  try {
    const cityId = Number(req.params.cityId);

    if (!Number.isInteger(cityId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid city ID",
      });
    }

    const city = await service.getCity(cityId);

    return res.status(200).json({
      success: true,
      data: city,
    });
  } catch (error) {
    console.error("Get city error:", error);

    const statusCode =
      error.message === "City not found" ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
}

async function getCities(req, res) {
  try {
    const cities = await service.getCities();

    return res.status(200).json({
      success: true,
      count: cities.length,
      data: cities,
    });
  } catch (error) {
    console.error("Get cities error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch cities",
    });
  }
}

module.exports = {
  createCity,
  getCity,
  getCities,
};