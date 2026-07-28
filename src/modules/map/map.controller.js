import mapService from "./map.service.js";

class MapController {
  async getLiveMap(req, res, next) {
    try {
      const trucks = await mapService.getLiveTruckLocations();

      return res.status(200).json({
        success: true,
        message: "Live truck locations fetched successfully.",
        count: trucks.length,
        data: trucks,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTruck(req, res, next) {
    try {
      const { vehicleId } = req.params;

      const truck = await mapService.getTruck(vehicleId);

      if (!truck) {
        return res.status(404).json({
          success: false,
          message: "Vehicle not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: truck,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MapController();