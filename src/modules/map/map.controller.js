import mapService from "./map.service.js";

class MapController {
  /**
   * GET /map/nearest
   *
   * Find nearest garbage truck
   * based on citizen location
   */
  async getNearestTruck(req, res, next) {
    try {
      const { latitude, longitude } = req.query;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,

          message: "Latitude and longitude are required.",

          data: null,
        });
      }

      const truck = await mapService.findNearestTruck(
        Number(latitude),

        Number(longitude),
      );

      if (!truck) {
        return res.status(404).json({
          success: false,

          message: "No nearby truck found.",

          data: null,
        });
      }

      return res.status(200).json({
        success: true,

        message: "Nearest truck found successfully.",

        data: truck,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /map/truck/:vehicleId
   *
   * Get specific truck
   */
  async getTruck(req, res, next) {
    try {
      const { vehicleId } = req.params;

      const truck = await mapService.getTruck(vehicleId);

      if (!truck) {
        return res.status(404).json({
          success: false,

          message: "Vehicle not found.",

          data: null,
        });
      }

      return res.status(200).json({
        success: true,

        message: "Vehicle fetched successfully.",

        data: truck,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/route-map/live
   *
   * Get latest live vehicle locations
   * for the selected City → Zone → Division → Ward.
   */
  async getLiveVehicleLocations(req, res, next) {
    try {
      const { latitude, longitude, cityId, zoneId, divisionId, wardId } =
        req.query;

      /*
       * --------------------------------------------------
       * REQUIRED PARAMETERS
       * --------------------------------------------------
       */

      if (
        latitude === undefined ||
        longitude === undefined ||
        cityId === undefined ||
        zoneId === undefined ||
        divisionId === undefined ||
        wardId === undefined
      ) {
        return res.status(400).json({
          success: false,

          message:
            "latitude, longitude, cityId, zoneId, divisionId and wardId are required.",

          data: null,
        });
      }

      /*
       * --------------------------------------------------
       * COORDINATE VALIDATION
       * --------------------------------------------------
       */

      const personLatitude = Number(latitude);

      const personLongitude = Number(longitude);

      if (
        !Number.isFinite(personLatitude) ||
        !Number.isFinite(personLongitude) ||
        personLatitude < -90 ||
        personLatitude > 90 ||
        personLongitude < -180 ||
        personLongitude > 180
      ) {
        return res.status(400).json({
          success: false,

          message: "Invalid latitude or longitude.",

          data: null,
        });
      }

      /*
       * --------------------------------------------------
       * ID VALIDATION
       * --------------------------------------------------
       */

      const city = Number(cityId);

      const zone = Number(zoneId);

      const division = Number(divisionId);

      const ward = Number(wardId);

      if (
        !Number.isInteger(city) ||
        city <= 0 ||
        !Number.isInteger(zone) ||
        zone <= 0 ||
        !Number.isInteger(division) ||
        division <= 0 ||
        !Number.isInteger(ward) ||
        ward <= 0
      ) {
        return res.status(400).json({
          success: false,

          message: "Invalid cityId, zoneId, divisionId or wardId.",

          data: null,
        });
      }

      /*
       * --------------------------------------------------
       * SERVICE
       * --------------------------------------------------
       */

      const result = await mapService.getLiveVehicleLocations({
        latitude: personLatitude,

        longitude: personLongitude,

        cityId: city,

        zoneId: zone,

        divisionId: division,

        wardId: ward,
      });

      return res.status(200).json({
        success: true,

        message: result.vehicles.length
          ? "Live vehicle locations fetched successfully."
          : "No vehicles found for the selected ward.",

        data: result,
      });
    } catch (error) {
      console.error("Live vehicle location error:", error);

      const statusCode = error.statusCode || 500;

      return res.status(statusCode).json({
        success: false,

        message:
          error.publicMessage ||
          error.message ||
          "Unable to fetch live vehicle locations.",

        data: null,
      });
    }
  }
}

export default new MapController();
