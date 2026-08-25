const mapService = require("./map.service");

/*
|--------------------------------------------------------------------------
| GET NEAREST VEHICLE
|--------------------------------------------------------------------------
*/

const getNearestVehicle = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    const data = await mapService.getNearestVehicle({
      latitude,
      longitude,
    });

    return res.status(200).json({
      success: true,
      message: "Nearest vehicle fetched successfully.",
      data,
    });
  } catch (error) {
    console.error("GET /api/citizen/map/nearest error:", error);

    const statusCode = Number.isInteger(error?.statusCode)
      ? error.statusCode
      : 500;

    return res.status(statusCode).json({
      success: false,
      message:
        error?.publicMessage ||
        error?.message ||
        "Unable to fetch nearest vehicle.",
      data: null,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL LIVE VEHICLES
|--------------------------------------------------------------------------
*/

const getLiveVehicles = async (req, res) => {
  try {
    const data = await mapService.getLiveVehicles();

    return res.status(200).json({
      success: true,
      message: "Live vehicles fetched successfully.",
      data,
    });
  } catch (error) {
    console.error("GET /api/citizen/map/live error:", error);

    const statusCode = Number.isInteger(error?.statusCode)
      ? error.statusCode
      : 500;

    return res.status(statusCode).json({
      success: false,
      message:
        error?.publicMessage ||
        error?.message ||
        "Unable to fetch live vehicles.",
      data: null,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET SINGLE VEHICLE
|--------------------------------------------------------------------------
*/

const getVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const data = await mapService.getVehicle(vehicleId);

    return res.status(200).json({
      success: true,
      message: "Vehicle fetched successfully.",
      data,
    });
  } catch (error) {
    console.error("GET /api/citizen/map/live/:vehicleId error:", error);

    const statusCode = Number.isInteger(error?.statusCode)
      ? error.statusCode
      : 500;

    return res.status(statusCode).json({
      success: false,
      message:
        error?.publicMessage || error?.message || "Unable to fetch vehicle.",
      data: null,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET LIVE VEHICLE LOCATIONS
|--------------------------------------------------------------------------
|
| Flutter
|   ↓
| Citizen Backend
|   ↓
| Admin Backend
|
| IMPORTANT:
| The Authorization header received from Flutter
| is forwarded to mapService.
|--------------------------------------------------------------------------
*/

const getLiveVehicleLocations = async (req, res) => {
  try {
    const { latitude, longitude, cityId, zoneId, divisionId, wardId } =
      req.query;

    /*
     * Get the JWT sent by Flutter.
     *
     * Example:
     *
     * Authorization: Bearer eyJhbGciOi...
     */

    const authorization = req.headers.authorization || null;

    console.log("==================================");

    console.log("GET LIVE VEHICLE LOCATIONS");

    console.log("PARAMS:", {
      latitude,
      longitude,
      cityId,
      zoneId,
      divisionId,
      wardId,
    });

    console.log(
      "AUTHORIZATION:",
      authorization ? "TOKEN PRESENT" : "TOKEN MISSING",
    );

    console.log("==================================");

    /*
     * Call the Citizen map service.
     *
     * IMPORTANT:
     * authorization is passed here.
     */

    const data = await mapService.getLiveVehicleLocations({
      latitude,
      longitude,
      cityId,
      zoneId,
      divisionId,
      wardId,
      authorization,
    });

    /*
     * Determine whether Admin returned
     * any vehicles.
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
    console.error("==================================");

    console.error("Live vehicle route error:", error);

    console.error("==================================");

    const statusCode = Number.isInteger(error?.statusCode)
      ? error.statusCode
      : 500;

    return res.status(statusCode).json({
      success: false,

      message:
        error?.publicMessage ||
        error?.message ||
        "Unable to fetch live vehicle locations.",

      data: null,
    });
  }
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
|
| Citizen backend is using CommonJS.
|
|--------------------------------------------------------------------------
*/

module.exports = {
  getNearestVehicle,
  getLiveVehicles,
  getVehicle,
  getLiveVehicleLocations,
};
