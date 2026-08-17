const {
  getCityMapData,
  getZoneDivisions,
} =
  require("./masterCitizenMap.service");


/**
 * ============================================================
 * GET CITY MAP
 * ============================================================
 *
 * GET
 * /api/master-citizen/map/city/:cityId
 *
 * ============================================================
 */

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


/**
 * ============================================================
 * GET ZONE DIVISIONS
 * ============================================================
 *
 * GET
 *
 * /api/master-citizen/map/zone/:zoneTableName/divisions
 *
 * ============================================================
 */

async function getZoneDivisionsController(
  req,
  res
) {

  try {

    const {
      zoneTableName,
    } = req.params;


    console.log(
      "🟢 ZONE SELECTED"
    );

    console.log(
      "Zone table:",
      zoneTableName
    );


    /**
     * --------------------------------------------------------
     * FETCH DIVISIONS
     * --------------------------------------------------------
     */

    const data =
      await getZoneDivisions(
        zoneTableName
      );


    console.log(
      "Total divisions:",
      data.divisions.length
    );


    console.log(
      "Division names:",
      data.divisions.map(
        (division) =>
          division.divisionName
      )
    );


    /**
     * --------------------------------------------------------
     * RETURN RESPONSE
     * --------------------------------------------------------
     */

    return res
      .status(200)
      .json({

        success:
          true,

        zoneTableName:
          data.zoneTableName,

        divisions:
          data.divisions,

      });

  } catch (error) {

    console.error(
      "❌ ZONE DIVISIONS ERROR:",
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          error.message ||
          "Failed to fetch zone divisions.",

      });

  }
}


/**
 * ============================================================
 * EXPORTS
 * ============================================================
 */

module.exports = {

  getCityMapDataController,

  getZoneDivisionsController,

};