const citizenHistoricalScheduler =
  require("../schedulers/citizenHistorical.scheduler");


// =====================================================
// BIGINT + DATE SAFE SERIALIZER
// =====================================================
//
// PostgreSQL / Prisma may return:
//
// BigInt
// Date
//
// JSON.stringify() cannot directly serialize BigInt.
//
// Dates also need to remain readable ISO strings.
//
// This serializer recursively handles:
//
// BigInt → Number
// Date   → ISO String
//
// =====================================================

function serializeBigInt(value) {

  // ---------------------------------------------------
  // BIGINT
  // ---------------------------------------------------

  if (
    typeof value ===
    "bigint"
  ) {

    return Number(value);

  }


  // ---------------------------------------------------
  // DATE
  // ---------------------------------------------------

  if (
    value instanceof Date
  ) {

    return value.toISOString();

  }


  // ---------------------------------------------------
  // ARRAY
  // ---------------------------------------------------

  if (
    Array.isArray(value)
  ) {

    return value.map(
      serializeBigInt
    );

  }


  // ---------------------------------------------------
  // OBJECT
  // ---------------------------------------------------

  if (
    value !== null &&
    typeof value === "object"
  ) {

    const result = {};


    for (
      const key of Object.keys(value)
    ) {

      result[key] =
        serializeBigInt(
          value[key]
        );

    }


    return result;

  }


  // ---------------------------------------------------
  // PRIMITIVE
  // ---------------------------------------------------

  return value;

}


// =====================================================
// MANUAL HISTORICAL PROCESSING
// =====================================================
//
// POST
// /api/historical-processing/run
//
// Body:
//
// {
//   "date": "2026-08-09"
// }
//
// =====================================================

async function runHistoricalProcessing(
  req,
  res
) {

  try {

    const {
      date
    } =
      req.body || {};


    // =================================================
    // PROCESSING DATE
    // =================================================

    let processingDate =
      null;


    // =================================================
    // DATE PROVIDED
    // =================================================

    if (
      date
    ) {

      processingDate =
        new Date(
          date
        );


      // -----------------------------------------------
      // INVALID DATE
      // -----------------------------------------------

      if (
        Number.isNaN(
          processingDate.getTime()
        )
      ) {

        return res
          .status(400)
          .json({

            success:
              false,

            message:
              "Invalid processing date.",

          });

      }

    }


    // =================================================
    // LOG REQUEST
    // =================================================

    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "MANUAL HISTORICAL PROCESSING REQUEST"
    );

    console.log(
      "================================================="
    );

    console.log("");

    console.log(
      "Requested Date:",
      processingDate ||
      "Previous Day"
    );


    // =================================================
    // START PROCESSING
    // =================================================

    const result =
      await citizenHistoricalScheduler
        .run(
          processingDate
        );


    // =================================================
    // ALREADY RUNNING
    // =================================================

    if (
      result.started ===
      false
    ) {

      return res
        .status(409)
        .json({

          success:
            false,

          message:
            "Historical processing is already running.",

          reason:
            result.reason,

        });

    }


    // =================================================
    // PROCESSING FAILED
    // =================================================

    if (
      result.error
    ) {

      return res
        .status(500)
        .json({

          success:
            false,

          message:
            "Historical processing failed.",

          processingDate:
            result.processingDate,

          error:
            result.error,

        });

    }


    // =================================================
    // SERIALIZE RESULT
    // =================================================

    const safeResult =
      serializeBigInt(
        result
      );


    // =================================================
    // SUCCESS
    // =================================================

    return res
      .status(200)
      .json({

        success:
          true,

        message:
          "Historical processing completed.",

        ...safeResult,

      });

  } catch (
    error
  ) {

    console.error(
      "Manual historical processing error:",
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          "Unable to start historical processing.",

        error:
          error.message,

      });

  }

}


// =====================================================
// RUN TODAY
// =====================================================
//
// POST
// /api/historical-processing/run/today
//
// This is mainly useful for:
//
// - Development
// - Testing
// - Manual admin trigger
//
// It uses the EXACT SAME scheduler/worker pipeline
// used by the automatic scheduler.
//
// =====================================================

async function runToday(
  req,
  res
) {

  try {

    const today =
      new Date();


    // =================================================
    // LOG
    // =================================================

    console.log("");

    console.log(
      "================================================="
    );

    console.log(
      "MANUAL HISTORICAL PROCESSING - TODAY"
    );

    console.log(
      "================================================="
    );

    console.log("");

    console.log(
      "Processing Date:",
      today
    );


    // =================================================
    // RUN PROCESSING
    // =================================================

    const result =
      await citizenHistoricalScheduler
        .run(
          today
        );


    // =================================================
    // ALREADY RUNNING
    // =================================================

    if (
      result.started ===
      false
    ) {

      return res
        .status(409)
        .json({

          success:
            false,

          message:
            "Historical processing is already running.",

          reason:
            result.reason,

        });

    }


    // =================================================
    // PROCESSING FAILED
    // =================================================

    if (
      result.error
    ) {

      return res
        .status(500)
        .json({

          success:
            false,

          message:
            "Today's historical processing failed.",

          processingDate:
            result.processingDate,

          error:
            result.error,

        });

    }


    // =================================================
    // SERIALIZE RESULT
    // =================================================

    const safeResult =
      serializeBigInt(
        result
      );


    // =================================================
    // SUCCESS
    // =================================================

    return res
      .status(200)
      .json({

        success:
          true,

        message:
          "Today's historical processing completed.",

        ...safeResult,

      });

  } catch (
    error
  ) {

    console.error(
      "Run today error:",
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          "Unable to process today's historical data.",

        error:
          error.message,

      });

  }

}


// =====================================================
// GET PROCESSING STATUS
// =====================================================
//
// GET
// /api/historical-processing/status
//
// =====================================================

async function getHistoricalProcessingStatus(
  req,
  res
) {

  try {

    // =================================================
    // GET STATUS
    // =================================================

    const status =
      citizenHistoricalScheduler
        .getStatus();


    // =================================================
    // SERIALIZE
    // =================================================

    const safeStatus =
      serializeBigInt(
        status
      );


    // =================================================
    // RESPONSE
    // =================================================

    return res
      .status(200)
      .json({

        success:
          true,

        ...safeStatus,

      });

  } catch (
    error
  ) {

    console.error(
      "Historical processing status error:",
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          "Unable to get historical processing status.",

        error:
          error.message,

      });

  }

}


// =====================================================
// EXPORT
// =====================================================

module.exports = {

  runHistoricalProcessing,

  runToday,

  getHistoricalProcessingStatus,

};