const routeMapService = require("../services/routeMapService");

const getLiveRouteMap = async (req, res) => {
  try {
    const { latitude, longitude, cityId, zoneId, divisionId, wardId } =
      req.query;

    const data = await routeMapService.getLiveRouteMap({
      latitude,
      longitude,
      cityId,
      zoneId,
      divisionId,
      wardId,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET /api/route-map/live error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to load live route map",
    });
  }
};

module.exports = {
  getLiveRouteMap,
};
