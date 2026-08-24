const routeMapService = require("../services/routeMapService");

/*
|--------------------------------------------------------------------------
| GET LIVE VEHICLE LOCATIONS
|--------------------------------------------------------------------------
|
| GET
|
| /api/route-map/live
|
|--------------------------------------------------------------------------
*/

const getLiveRouteMap = async (req, res) => {
  try {
    const { latitude, longitude, cityId, zoneId, divisionId, wardId } =
      req.query;

    /*
     * Service performs the actual validation
     * and business logic.
     */

    const data = await routeMapService.getLiveRouteMap({
      latitude,
      longitude,
      cityId,
      zoneId,
      divisionId,
      wardId,
    });

    /*
     * No vehicles is still a successful request.
     */

    const hasVehicles =
      Array.isArray(data?.vehicles) && data.vehicles.length > 0;

    return res.status(200).json({
      success: true,

      message: hasVehicles
        ? "Live vehicle locations fetched successfully."
        : "No vehicles found for the selected ward.",

      data,
    });
  } catch (error) {
    console.error("GET /api/route-map/live error:", error);

    /*
     * Validation / hierarchy errors
     * use 400.
     *
     * Unexpected database/server errors
     * use 500.
     */

    const statusCode = Number.isInteger(error?.statusCode)
      ? error.statusCode
      : 500;

    /*
     * Never expose raw SQL/database errors
     * to Flutter.
     */

    const isExpectedClientError = statusCode >= 400 && statusCode < 500;

    return res.status(statusCode).json({
      success: false,

      message: isExpectedClientError
        ? error.message
        : "Unable to fetch live vehicle locations.",

      data: null,
    });
  }
};

module.exports = {
  getLiveRouteMap,
};
