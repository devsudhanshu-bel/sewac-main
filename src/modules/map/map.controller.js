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

      if (latitude === undefined || longitude === undefined) {
        return res.status(400).json({
          success: false,
          message: "Latitude and longitude are required.",
          data: null,
        });
      }

      const parsedLatitude = Number(latitude);

      const parsedLongitude = Number(longitude);

      if (
        !Number.isFinite(parsedLatitude) ||
        !Number.isFinite(parsedLongitude)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid latitude or longitude.",
          data: null,
        });
      }

      const truck = await mapService.findNearestTruck(
        parsedLatitude,
        parsedLongitude,
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
   * Get live vehicle locations for the
   * selected City → Zone → Division → Ward.
   */
  async getLiveVehicleLocations(req, res, next) {
    try {
      const { latitude, longitude, cityId, zoneId, divisionId, wardId } =
        req.query;

      // --------------------------------------------------
      // REQUIRED PARAMETERS
      // --------------------------------------------------

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

      // --------------------------------------------------
      // COORDINATES
      // --------------------------------------------------

      const parsedLatitude = Number(latitude);

      const parsedLongitude = Number(longitude);

      if (
        !Number.isFinite(parsedLatitude) ||
        !Number.isFinite(parsedLongitude) ||
        parsedLatitude < -90 ||
        parsedLatitude > 90 ||
        parsedLongitude < -180 ||
        parsedLongitude > 180
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid latitude or longitude.",
          data: null,
        });
      }

      // --------------------------------------------------
      // IDS
      // --------------------------------------------------

      const parsedCityId = Number(cityId);

      const parsedZoneId = Number(zoneId);

      const parsedDivisionId = Number(divisionId);

      const parsedWardId = Number(wardId);

      if (
        !Number.isInteger(parsedCityId) ||
        parsedCityId <= 0 ||
        !Number.isInteger(parsedZoneId) ||
        parsedZoneId <= 0 ||
        !Number.isInteger(parsedDivisionId) ||
        parsedDivisionId <= 0 ||
        !Number.isInteger(parsedWardId) ||
        parsedWardId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid cityId, zoneId, divisionId or wardId.",
          data: null,
        });
      }

      // --------------------------------------------------
      // SERVICE
      // --------------------------------------------------

      const result = await mapService.getLiveVehicleLocations({
        latitude: parsedLatitude,
        longitude: parsedLongitude,
        cityId: parsedCityId,
        zoneId: parsedZoneId,
        divisionId: parsedDivisionId,
        wardId: parsedWardId,
      });

      return res.status(200).json({
        success: true,
        message:
          result.vehicles.length > 0
            ? "Live vehicle locations fetched successfully."
            : "No vehicles found for the selected ward.",
        data: result,
      });
    } catch (error) {
      console.error("Live vehicle location error:", error);

      return res.status(error.statusCode || 500).json({
        success: false,
        message:
          error.publicMessage || "Unable to fetch live vehicle locations.",
        data: null,
      });
    }
  }
}

export default new MapController();
