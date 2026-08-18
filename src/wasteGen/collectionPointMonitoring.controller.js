/**
 * ==========================================================
 * SEWAC COLLECTION POINT MONITORING CONTROLLER
 * ==========================================================
 */

const {
  getCollectionPointMonitoring,
} = require(
  "./collectionPointMonitoring.service"
);


/* ==========================================================
   GET COLLECTION POINT MONITORING
========================================================== */

async function getCollectionPointMonitoringController(
  req,
  res
) {

  try {

    /* ======================================================
       READ QUERY PARAMETERS
    ====================================================== */

    const {
      wardNo,
      date,
    } = req.query;


    /* ======================================================
       VALIDATE WARD
    ====================================================== */

    if (
      wardNo === undefined ||
      wardNo === null ||
      wardNo === ""
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            "wardNo is required",

        });

    }


    /* ======================================================
       VALIDATE DATE
    ====================================================== */

    if (
      date === undefined ||
      date === null ||
      date === ""
    ) {

      return res
        .status(400)
        .json({

          success: false,

          message:
            "date is required",

        });

    }


    /* ======================================================
       SERVICE
    ====================================================== */

    const data =
      await getCollectionPointMonitoring({

        wardNo,

        date,

      });


    /* ======================================================
       SUCCESS RESPONSE
    ====================================================== */

    return res
      .status(200)
      .json({

        success: true,

        message:
          "Collection point monitoring data retrieved successfully",

        data,

      });

  } catch (error) {

    /* ======================================================
       ERROR LOG
    ====================================================== */

    console.error("");

    console.error(
      "================================================"
    );

    console.error(
      "❌ COLLECTION POINT MONITORING CONTROLLER ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================================"
    );


    /* ======================================================
       ERROR RESPONSE
    ====================================================== */

    return res
      .status(500)
      .json({

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


/* ==========================================================
   EXPORT
========================================================== */

module.exports = {

  getCollectionPointMonitoringController,

};