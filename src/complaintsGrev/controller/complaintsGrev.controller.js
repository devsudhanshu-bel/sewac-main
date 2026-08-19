const complaintsGrevService = require("../service/complaintsGrev.service");

/* =========================================================
   GET ALL COMPLAINT LOCATIONS
========================================================= */

const getComplaintLocations = async (req, res) => {
  try {
    console.log("");
    console.log("==============================================");
    console.log("📍 COMPLAINT GREVANCE MAP REQUEST");
    console.log("==============================================");

    const locations =
      await complaintsGrevService.getComplaintLocations();

    console.log(
      "📍 COMPLAINT LOCATIONS LOADED:",
      locations.length
    );

    if (locations.length > 0) {
      console.log(
        "📍 FIRST COMPLAINT LOCATION:",
        locations[0]
      );
    }

    console.log("==============================================");
    console.log("");

    return res.status(200).json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    console.error("");
    console.error(
      "❌ COMPLAINT GREVANCE MAP ERROR:"
    );
    console.error(error);
    console.error("");

    return res.status(500).json({
      success: false,
      count: 0,
      data: [],
      message:
        "Failed to fetch complaint locations",
      error: error.message,
    });
  }
};

module.exports = {
  getComplaintLocations,
};