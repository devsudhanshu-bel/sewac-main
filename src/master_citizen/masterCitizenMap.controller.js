const {
  getCityMapData,
} =
  require("./masterCitizenMap.service");


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
 * HIERARCHY:
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
 * ONLY GEOGRAPHICAL DATA.
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

    /**
     * ========================================================
     * 1. GET CITY ID
     * ========================================================
     */

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
      "============================================================"
    );

    console.log(
      "City ID:",
      cityId
    );


    /**
     * ========================================================
     * 2. FETCH CITY HIERARCHY
     * ========================================================
     */

    const data =
      await getCityMapData(
        cityId
      );


    /**
     * ========================================================
     * 3. VALIDATE SERVICE RESPONSE
     * ========================================================
     */

    if (
      !data ||
      !data.city
    ) {

      throw new Error(
        "City map data was not returned by the service."
      );

    }


    /**
     * ========================================================
     * 4. NORMALIZE DATA
     * ========================================================
     */

    const zones =
      Array.isArray(
        data.zones
      )
        ? data.zones
        : [];


    const summary = {

      totalZones:
        Number(
          data?.summary?.totalZones || 0
        ),

      totalDivisions:
        Number(
          data?.summary?.totalDivisions || 0
        ),

      totalWards:
        Number(
          data?.summary?.totalWards || 0
        ),

    };


    /**
     * ========================================================
     * 5. LOG RESULT
     * ========================================================
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
      summary.totalZones
    );

    console.log(
      "Divisions:",
      summary.totalDivisions
    );

    console.log(
      "Wards:",
      summary.totalWards
    );

    console.log(
      "Citizen data:",
      "NOT LOADED"
    );

    console.log(
      "------------------------------------------------------------"
    );


    /**
     * ========================================================
     * 6. RESPONSE
     * ========================================================
     */

    return res
      .status(200)
      .json({

        success:
          true,

        city:
          data.city,

        summary,

        zones,

      });

  } catch (error) {

    /**
     * ========================================================
     * ERROR
     * ========================================================
     */

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


/**
 * ============================================================
 * EXPORTS
 * ============================================================
 */

module.exports = {

  getCityMapDataController,

};