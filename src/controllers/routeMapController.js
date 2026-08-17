const routeMapService =
  require("../services/routeMapService");

/*
|--------------------------------------------------------------------------
| GET ROUTE MAP
|--------------------------------------------------------------------------
|
| GET
|
| /api/admin/route-map?date=2026-08-16&wardNo=20
|
|--------------------------------------------------------------------------
*/

exports.getRouteMap = async (
  req,
  res
) => {
  try {
    const {
      date,
      wardNo,
    } = req.query;

    const data =
      await routeMapService.getRouteMap({
        date,
        wardNo,
      });

    /*
    |--------------------------------------------------------------------------
    | DAY TABLE DOES NOT EXIST
    |--------------------------------------------------------------------------
    */

    if (
      data.reason ===
      "DAY_TABLE_NOT_FOUND"
    ) {
      return res
        .status(404)
        .json({
          success: false,

          message:
            `No telemetry day table exists for ${date}.`,

          data,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | NO VEHICLES
    |--------------------------------------------------------------------------
    */

    if (
      data.reason ===
      "NO_VEHICLES"
    ) {
      return res
        .status(200)
        .json({
          success: true,

          message:
            `No vehicles found for Ward ${wardNo} on ${date}.`,

          data,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    return res
      .status(200)
      .json({
        success: true,

        data,
      });

  } catch (error) {
    console.error(
      "❌ Route Map Error:",
      error
    );

    return res
      .status(400)
      .json({
        success: false,

        message:
          error.message,
      });
  }
};