/**
 * ==========================================================
 * SEWAC COLLECTION POINT MONITORING CONTROLLER
 * ==========================================================
 */

const {
  getCollectionPointMonitoring,
} = require("../services/collectionPointMonitoring.service");

/* ==========================================================
   GET COLLECTION POINT MONITORING
========================================================== */

async function getCollectionPointMonitoringController(
  req,
  res,
) {
  try {
    const { wardNo, date } = req.query;

    /* ======================================================
       VALIDATION
    ====================================================== */

    if (!wardNo) {
      return res.status(400).json({
        success: false,
        message: "wardNo is required",
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "date is required",
      });
    }

    /* ======================================================
       SERVICE
    ====================================================== */

    const data = await getCollectionPointMonitoring({
      wardNo,
      date,
    });

    /* ======================================================
       RESPONSE
    ====================================================== */

    return res.status(200).json({
      success: true,

      message:
        "Collection point monitoring data retrieved successfully",

      data,
    });
  } catch (error) {
    console.error(
      "Collection Point Monitoring Controller Error:",
      error,
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to retrieve collection point monitoring data",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
}

module.exports = {
  getCollectionPointMonitoringController,
};