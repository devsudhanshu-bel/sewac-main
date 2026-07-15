const vehicleService = require("../services/vehicleService");

const getAllVehicles = async (req, res) => {
  try {
    const data = await vehicleService.getAllVehicles(req.query);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const data = await vehicleService.getVehicleById(req.params.vehicleId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createVehicle = async (req, res) => {
  try {
    const data = await vehicleService.createVehicle(req.body);

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const data = await vehicleService.updateVehicle(
      req.params.vehicleId,
      req.body
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const data = await vehicleService.deleteVehicle(req.params.vehicleId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};