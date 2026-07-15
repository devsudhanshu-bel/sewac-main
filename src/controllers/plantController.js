const plantService = require("../services/plantService");

const getAllPlants = async (req, res) => {
  try {
    const data = await plantService.getAllPlants(req.query);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPlantById = async (req, res) => {
  try {
    const data = await plantService.getPlantById(req.params.id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createPlant = async (req, res) => {
  try {
    const data = await plantService.createPlant(req.body);

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePlant = async (req, res) => {
  try {
    const data = await plantService.updatePlant(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePlant = async (req, res) => {
  try {
    const data = await plantService.deletePlant(req.params.id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPlantDashboard = async (req, res) => {

    try {

        const data = await plantService.getPlantDashboard();

        res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

const getPlantLocations = async (req, res) => {

  try {

    const data = await plantService.getPlantLocations();

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getPlantDashboard,
  getPlantLocations
};