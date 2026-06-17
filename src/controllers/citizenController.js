const citizenService = require("../services/citizenService");

const searchCitizen = async (req, res) => {
  try {
    const { query } = req.query;

    console.log("=================================");
    console.log("SEARCH QUERY:", query);
    console.log("QUERY TYPE:", typeof query);
    console.log("=================================");

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const citizens = await citizenService.searchCitizen(query);

    return res.status(200).json({
      success: true,
      count: citizens.length,
      data: citizens,
    });
  } catch (error) {
    console.error("Citizen Search Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAllCitizens = async (req, res) => {
  try {
    const citizens = await citizenService.getAllCitizens();

    return res.status(200).json({
      success: true,
      count: citizens.length,
      data: citizens,
    });
  } catch (error) {
    console.error("Get All Citizens Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  searchCitizen,
  getAllCitizens,
};