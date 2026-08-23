const overviewService = require("../services/overviewService");

// ============================================================
// SUMMARY
// ============================================================

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

// ============================================================
// VEHICLE SUMMARY
// ============================================================

const getVehicleSummary = async (req, res) => {
  try {
    const data = await overviewService.getVehicleSummary(
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
    console.error("Overview vehicle summary error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// GENERATION TREND
// ============================================================

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

// ============================================================
// ROUTE MAP
// ============================================================

const getMapData = async (req, res) => {
  try {
    const data = await overviewService.getMapData(
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
    console.error("Overview route map error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// LEGACY FILTERS
// ============================================================

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

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getSummary,

  getVehicleSummary,

  getGenerationTrend,

  getMapData,

  getOverviewFilters,
};
