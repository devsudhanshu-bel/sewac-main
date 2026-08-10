const service =
  require("../services/masterCitizenSync.service");

// =====================================================
// FULL MASTER CITIZEN SYNC
// =====================================================
//
// POST
// /api/master-citizen/sync
//
// Synchronizes all citizens from:
//
// SEWAC Helper
// master_citizen_data
//
// into the appropriate dynamic Ward tables.
// =====================================================

async function syncAllCitizens(req, res) {
  const startedAt =
    Date.now();

  try {
    console.log(
      "================================================="
    );

    console.log(
      "MASTER CITIZEN FULL SYNC STARTED"
    );

    console.log(
      "================================================="
    );

    const result =
      await service.syncAllCitizens();

    console.log(
      "================================================="
    );

    console.log(
      "MASTER CITIZEN FULL SYNC COMPLETED"
    );

    console.log(
      `Duration: ${result.durationMs} ms`
    );

    console.log(
      "================================================="
    );

    return res.status(200).json({
      success: true,

      message:
        "Master citizen synchronization completed successfully",

      data: {
        ...result,

        totalDurationMs:
          Date.now() - startedAt,
      },
    });

  } catch (error) {

    console.error(
      "Master citizen full sync error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Master citizen synchronization failed",

      error:
        error.message,
    });
  }
}


// =====================================================
// WARD-WISE MASTER CITIZEN SYNC
// =====================================================
//
// POST
// /api/master-citizen/sync/ward/:wardNo
//
// IMPORTANT:
//
// :wardNo is the actual Ward Number.
//
// Example:
//
// POST
// /api/master-citizen/sync/ward/174
//
// NOT:
//
// /sync/ward/2
//
// where 2 would be the internal ward_id.
//
// =====================================================

async function syncOneWard(req, res) {
  try {

    const wardNo =
      Number(req.params.wardNo);


    // -------------------------------------------------
    // VALIDATE WARD NUMBER
    // -------------------------------------------------

    if (
      !Number.isInteger(wardNo) ||
      wardNo <= 0
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid ward number",
      });
    }


    console.log(
      `Ward sync started for ward number: ${wardNo}`
    );


    // -------------------------------------------------
    // CALL SERVICE
    // -------------------------------------------------

    const result =
      await service.syncOneWard(
        wardNo
      );


    console.log(
      `Ward sync completed for ward number: ${wardNo}`
    );


    // -------------------------------------------------
    // SUCCESS RESPONSE
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Ward synchronization completed successfully",

      data: result,
    });

  } catch (error) {

    console.error(
      "Ward sync error:",
      error
    );


    // -------------------------------------------------
    // NOT FOUND
    // -------------------------------------------------

    const statusCode =
      error.message.includes(
        "not found"
      )
        ? 404
        : 500;


    // -------------------------------------------------
    // ERROR RESPONSE
    // -------------------------------------------------

    return res.status(statusCode).json({
      success: false,

      message:
        "Ward synchronization failed",

      error:
        error.message,
    });
  }
}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  syncAllCitizens,
  syncOneWard,
};