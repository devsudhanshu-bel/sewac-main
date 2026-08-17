const {
  getCityMapData,
} = require("./masterCitizenMap.service");


async function getCityMapDataController(
  req,
  res
) {

  try {

    const {
      cityId,
    } = req.params;


    const data =
      await getCityMapData(
        cityId
      );


    return res
      .status(200)
      .json({

        success:
          true,

        city:
          data.city,

        zones:
          data.zones,

      });

  } catch (error) {

    console.error(
      "❌ CITY MAP ERROR:",
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          error.message ||
          "Failed to fetch city map data.",

      });

  }
}


module.exports = {
  getCityMapDataController,
};