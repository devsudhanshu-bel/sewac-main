const overviewService = require("../services/overviewService");

const getSummary = async (req, res) => {
  try {
    const data = await overviewService.getSummary(
      req.query.date,
      req.query.cityId,
      req.query.zoneId,
      req.query.divisionId,
      req.query.wardId,
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Overview summary error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getVehicleSummary = async (req, res) => {
  try {
    const data = await overviewService.getVehicleSummary(
      req.query.cityId,
      req.query.zoneId,
      req.query.divisionId,
      req.query.wardId,
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Overview vehicle summary error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getGenerationTrend = async (req, res) => {
  try {
    const data = await overviewService.getGenerationTrend(
      req.query.date,
      req.query.cityId,
      req.query.zoneId,
      req.query.divisionId,
      req.query.wardId,
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Overview generation trend error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMapData = async (req, res) => {
  try {
    const data = await overviewService.getMapData();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Overview map error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOverviewFilters = async (req, res) => {
  try {
    const data = await overviewService.getOverviewFilters();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Overview filters error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getSummary,
  getVehicleSummary,
  getGenerationTrend,
  getMapData,
  getOverviewFilters,
};
