const overviewService = require("../services/overviewService");

const getOverview = async (req, res) => {
  try {

    const data =
      await overviewService.getOverviewStats();

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

const getOverviewFilters = async (req, res) => {
  try {

    const data =
      await overviewService.getOverviewFilters();

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
  getOverview,
  getOverviewFilters,
};