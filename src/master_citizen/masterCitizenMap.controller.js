const {
  getCityMapData,
} = require("./masterCitizenMap.service");


/**
 * ============================================================
 * GET COMPLETE CITY MAP
 * ============================================================
 *
 * GET
 *
 * /api/master-citizen/map/city/:cityId
 *
 *
 * RESPONSE:
 *
 * CITY
 *   ↓
 * ZONES
 *   ↓
 * DIVISIONS
 *   ↓
 * WARDS
 *
 *
 * NO CITIZEN DATA.
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


    console.log("");

    console.log(
      "============================================================"
    );

    console.log(
      "🗺️ CITY MAP REQUEST"
    );

    console.log(
      "============================================================"
    );

    console.log(
      "City ID:",
      cityId
    );


    /**
     * --------------------------------------------------------
     * FETCH COMPLETE HIERARCHY
     * --------------------------------------------------------
     */

    const data =
      await getCityMapData(
        cityId
      );


    /**
     * --------------------------------------------------------
     * VALIDATION
     * --------------------------------------------------------
     */

    if (
      !data ||
      !data.city
    ) {

      throw new Error(
        "City map data was not returned by the service."
      );

    }


    const zones =
      Array.isArray(
        data.zones
      )
        ? data.zones
        : [];


    const totalZones =
      zones.length;


    const totalDivisions =
      zones.reduce(
        (
          total,
          zone
        ) =>
          total +
          (
            Array.isArray(
              zone?.divisions
            )
              ? zone.divisions.length
              : 0
          ),
        0
      );


    const totalWards =
      zones.reduce(
        (
          zoneTotal,
          zone
        ) => {

          const divisions =
            Array.isArray(
              zone?.divisions
            )
              ? zone.divisions
              : [];


          return (
            zoneTotal +
            divisions.reduce(
              (
                divisionTotal,
                division
              ) => {

                const wards =
                  Array.isArray(
                    division?.wards
                  )
                    ? division.wards
                    : [];


                return (
                  divisionTotal +
                  wards.length
                );

              },
              0
            )
          );

        },
        0
      );


    /**
     * --------------------------------------------------------
     * LOG
     * --------------------------------------------------------
     */

    console.log(
      "------------------------------------------------------------"
    );

    console.log(
      "✅ CITY MAP LOADED"
    );

    console.log(
      "City:",
      data.city.cityName
    );

    console.log(
      "Zones:",
      totalZones
    );

    console.log(
      "Divisions:",
      totalDivisions
    );

    console.log(
      "Wards:",
      totalWards
    );

    console.log(
      "Citizen data:",
      "NOT LOADED"
    );

    console.log(
      "------------------------------------------------------------"
    );


    /**
     * --------------------------------------------------------
     * RESPONSE
     * --------------------------------------------------------
     */

    return res
      .status(200)
      .json({

        success:
          true,

        city:
          data.city,

        summary: {

          totalZones,

          totalDivisions,

          totalWards,

        },

        zones,

      });

  } catch (
    error
  ) {

    console.error("");

    console.error(
      "============================================================"
    );

    console.error(
      "❌ CITY MAP ERROR"
    );

    console.error(
      "============================================================"
    );

    console.error(
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          error?.message ||
          "Failed to fetch city map data.",

      });

  }

}


module.exports = {

  getCityMapDataController,

};