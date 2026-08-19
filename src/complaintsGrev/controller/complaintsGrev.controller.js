const complaintsGrevService =
  require("../service/complaintsGrev.service");


/* =========================================================
   GET ALL COMPLAINT LOCATIONS
========================================================= */

const getComplaintLocations =
  async (
    req,
    res
  ) => {

    try {

      console.log("");

      console.log(
        "=============================================="
      );

      console.log(
        "📍 COMPLAINT GREVANCE MAP REQUEST"
      );

      console.log(
        "=============================================="
      );


      const result =
        await complaintsGrevService.getComplaintLocations();


      const locations =
        Array.isArray(
          result?.locations
        )
          ? result.locations
          : [];


      const boundary =
        result?.boundary ||
        null;


      console.log(
        "📍 COMPLAINT LOCATIONS LOADED:",
        locations.length
      );


      console.log(
        "🏙️ BENGALURU BOUNDARY:",
        boundary
          ? "LOADED"
          : "NOT LOADED"
      );


      if (
        locations.length > 0
      ) {

        console.log(
          "📍 FIRST COMPLAINT LOCATION:",
          locations[0]
        );

      }


      console.log(
        "=============================================="
      );

      console.log("");


      return res
        .status(200)
        .json({

          success:
            true,

          count:
            locations.length,

          /*
           * Bengaluru city boundary.
           *
           * This is the exact GeoJSON/raw
           * boundary retrieved from the
           * Master Citizen database.
           */

          boundary:
            boundary,

          /*
           * Only complaints located inside
           * Bengaluru are returned here.
           */

          data:
            locations,

        });

    } catch (
      error
    ) {

      console.error("");

      console.error(
        "❌ COMPLAINT GREVANCE MAP ERROR:"
      );

      console.error(
        error
      );

      console.error("");


      return res
        .status(500)
        .json({

          success:
            false,

          count:
            0,

          boundary:
            null,

          data:
            [],

          message:
            "Failed to fetch complaint locations",

          error:
            error.message,

        });

    }

  };


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

  getComplaintLocations,

};