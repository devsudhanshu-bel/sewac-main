import mapService from "./map.service.js";

class MapController {
  /*
  |--------------------------------------------------------------------------
  | GET NEAREST VEHICLE
  |--------------------------------------------------------------------------
  */

  async getNearestVehicle(req, res, next) {
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
  }

  /*
  |--------------------------------------------------------------------------
  | GET ALL LIVE VEHICLES
  |--------------------------------------------------------------------------
  */

  async getLiveVehicles(req, res, next) {
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
  }

  /*
  |--------------------------------------------------------------------------
  | GET SINGLE VEHICLE
  |--------------------------------------------------------------------------
  */

  async getVehicle(req, res, next) {
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
  }

  /*
  |--------------------------------------------------------------------------
  | GET LIVE VEHICLE LOCATIONS
  |--------------------------------------------------------------------------
  */

  async getLiveVehicleLocations(req, res, next) {
    try {
      const { latitude, longitude, cityId, zoneId, divisionId, wardId } =
        req.query;

      /*
       * Get JWT from Flutter request.
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
       * Send request to Citizen map service.
       */

      const data = await mapService.getLiveVehicleLocations({
        latitude,
        longitude,
        cityId,
        zoneId,
        divisionId,
        wardId,

        // IMPORTANT:
        // Forward JWT to service.
        authorization,
      });

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
  }
}

/*
|--------------------------------------------------------------------------
| DEFAULT EXPORT
|--------------------------------------------------------------------------
|
| VERY IMPORTANT
|
| map.routes.js contains:
|
| import mapController from "./map.controller.js";
|
| Therefore we MUST export default.
|--------------------------------------------------------------------------
*/

export default new MapController();
