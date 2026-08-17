const {
  getCityMapData,
  getZoneDivisions,
  getDivisionWards,
} =
  require("./masterCitizenMap.service");


// ============================================================
// GET CITY MAP
// ============================================================

async function getCityMapDataController(
  req,
  res
) {

  try {

    const {
      cityId,
    } =
      req.params;


    console.log("");

    console.log(
      "============================================================"
    );

    console.log(
      "🗺️ CITY MAP REQUEST"
    );

    console.log(
      "City ID:",
      cityId
    );

    console.log(
      "============================================================"
    );


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

        summary:
          data.summary,

        zones:
          data.zones,

      });

  } catch (
    error
  ) {

    console.error(
      "❌ CITY MAP ERROR:",
      error
    );


    return res
      .status(
        error?.status || 500
      )
      .json({

        success:
          false,

        message:
          error?.message ||
          "Failed to fetch city map data.",

      });

  }

}


// ============================================================
// GET ZONE DIVISIONS
// ============================================================

async function getZoneDivisionsController(
  req,
  res
) {

  try {

    const {
      zoneTableName,
    } =
      req.params;


    console.log("");

    console.log(
      "============================================================"
    );

    console.log(
      "🏢 ZONE DIVISIONS REQUEST"
    );

    console.log(
      "Zone Table:",
      zoneTableName
    );

    console.log(
      "============================================================"
    );


    const data =
      await getZoneDivisions(
        zoneTableName
      );


    return res
      .status(200)
      .json({

        success:
          true,

        zoneTableName:
          data.zoneTableName,

        totalDivisions:
          data.totalDivisions,

        totalWards:
          data.totalWards,

        divisions:
          data.divisions,

      });

  } catch (
    error
  ) {

    console.error(
      "❌ ZONE DIVISIONS ERROR:",
      error
    );


    return res
      .status(
        error?.status || 500
      )
      .json({

        success:
          false,

        message:
          error?.message ||
          "Failed to fetch zone divisions.",

      });

  }

}


// ============================================================
// GET DIVISION WARDS
// ============================================================

async function getDivisionWardsController(
  req,
  res
) {

  try {

    const {
      divisionTableName,
    } =
      req.params;


    console.log("");

    console.log(
      "============================================================"
    );

    console.log(
      "📍 DIVISION WARDS REQUEST"
    );

    console.log(
      "Division Table:",
      divisionTableName
    );

    console.log(
      "============================================================"
    );


    const data =
      await getDivisionWards(
        divisionTableName
      );


    return res
      .status(200)
      .json({

        success:
          true,

        divisionTableName:
          data.divisionTableName,

        totalWards:
          data.totalWards,

        wards:
          data.wards,

      });

  } catch (
    error
  ) {

    console.error(
      "❌ DIVISION WARDS ERROR:",
      error
    );


    return res
      .status(
        error?.status || 500
      )
      .json({

        success:
          false,

        message:
          error?.message ||
          "Failed to fetch division wards.",

      });

  }

}


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

  getCityMapDataController,

  getZoneDivisionsController,

  getDivisionWardsController,

};