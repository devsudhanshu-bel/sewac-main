const mapService = require("../services/mapService");

/*
|--------------------------------------------------------------------------
| GET NEAREST VEHICLE
|--------------------------------------------------------------------------
*/

const getNearestVehicle = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
    } = req.query;

    const data =
      await mapService.getNearestVehicle({
        latitude,
        longitude,
      });

    return res.status(200).json({
      success: true,
      message:
        "Nearest vehicle fetched successfully.",
      data,
    });
  } catch (error) {
    console.error(
      "GET /api/citizen/map/nearest error:",
      error,
    );

    const statusCode =
      Number.isInteger(
        error?.statusCode,
      )
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

const getLiveVehicles = async (
  req,
  res,
) => {
  try {
    const data =
      await mapService.getLiveVehicles();

    return res.status(200).json({
      success: true,
      message:
        "Live vehicles fetched successfully.",
      data,
    });
  } catch (error) {
    console.error(
      "GET /api/citizen/map/live error:",
      error,
    );

    const statusCode =
      Number.isInteger(
        error?.statusCode,
      )
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

const getVehicle = async (
  req,
  res,
) => {
  try {
    const {
      vehicleId,
    } = req.params;

    const data =
      await mapService.getVehicle(
        vehicleId,
      );

    return res.status(200).json({
      success: true,
      message:
        "Vehicle fetched successfully.",
      data,
    });
  } catch (error) {
    console.error(
      "GET /api/citizen/map/live/:vehicleId error:",
      error,
    );

    const statusCode =
      Number.isInteger(
        error?.statusCode,
      )
        ? error.statusCode
        : 500;

    return res.status(statusCode).json({
      success: false,
      message:
        error?.publicMessage ||
        error?.message ||
        "Unable to fetch vehicle.",
      data: null,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET LIVE VEHICLE LOCATIONS
|--------------------------------------------------------------------------
|
| Citizen Flutter calls:
|
| GET /api/route-map/live
|
| Citizen backend forwards the existing
| Authorization header to Admin backend.
|
|--------------------------------------------------------------------------
*/

const getLiveVehicleLocations =
  async (req, res) => {
    try {
      const {
        latitude,
        longitude,
        cityId,
        zoneId,
        divisionId,
        wardId,
      } = req.query;

      /*
       * Forward the existing Citizen JWT.
       *
       * Example:
       *
       * Authorization: Bearer eyJ...
       */

      const authorization =
        req.headers.authorization ||
        null;

      const data =
        await mapService.getLiveVehicleLocations({
          latitude,
          longitude,
          cityId,
          zoneId,
          divisionId,
          wardId,
          authorization,
        });

      const hasVehicles =
        Array.isArray(
          data?.vehicles,
        ) &&
        data.vehicles.length > 0;

      return res.status(200).json({
        success: true,

        message: hasVehicles
          ? "Live vehicle locations fetched successfully."
          : "No vehicles found for the selected ward.",

        data,
      });
    } catch (error) {
      console.error(
        "GET /api/route-map/live error:",
        error,
      );

      const statusCode =
        Number.isInteger(
          error?.statusCode,
        )
          ? error.statusCode
          : 500;

      return res.status(statusCode).json({
        success: false,

        message:
          error?.publicMessage ||
          "Unable to fetch live vehicle locations.",

        data: null,
      });
    }
  };

module.exports = {
  getNearestVehicle,
  getLiveVehicles,
  getVehicle,
  getLiveVehicleLocations,
};