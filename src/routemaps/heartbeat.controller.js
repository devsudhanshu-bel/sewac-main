/**
 * ==========================================================
 * SEWAC ROUTE MAP - HEARTBEAT CONTROLLER
 * ==========================================================
 *
 * Handles HTTP requests for vehicle heartbeat tracking.
 *
 * WRITE:
 *
 * POST /api/iot/heart-beat/lat+long
 * GET  /api/iot/heart-beat/lat+long
 *
 * READ:
 *
 * GET /api/iot/heart-beat/lat+long/data
 *
 * ==========================================================
 */

const heartbeatService =
  require("./heartbeat.service");


// ==========================================================
// COMMON HEARTBEAT WRITE HANDLER
// ==========================================================
//
// POST and GET both use this same function.
//
// ==========================================================

const saveHeartbeat =
  async (
    req,
    res,
  ) => {
    try {
      // ------------------------------------------------------
      // POST
      // ------------------------------------------------------

      const body =
        req.body || {};


      // ------------------------------------------------------
      // GET
      // ------------------------------------------------------

      const query =
        req.query || {};


      // ------------------------------------------------------
      // Merge both
      //
      // POST body gets priority.
      // ------------------------------------------------------

      const data = {
        ...query,
        ...body,
      };


      // ------------------------------------------------------
      // Create heartbeat
      // ------------------------------------------------------

      const result =
        await heartbeatService.createHeartbeat(
          data,
        );


      return res.status(201).json({
        success: true,

        message:
          "Heartbeat recorded successfully.",

        data: result.heartbeat,

        meta: {
          vehicleNumber:
            data.vehicleNumber ||
            data.vehicleId,

          heartbeatTable:
            result.heartbeatTable,

          dayTable:
            result.dayTable,

          vehicleTable:
            result.vehicleTable,

          wardNo:
            result.wardNo,
        },
      });
    } catch (error) {
      console.error(
        "❌ Heartbeat save error:",
        error,
      );


      const message =
        error.message ||
        "Failed to record heartbeat.";


      // ------------------------------------------------------
      // Vehicle not registered today
      // ------------------------------------------------------

      if (
        message.includes(
          "not registered for today",
        )
      ) {
        return res.status(404).json({
          success: false,

          message,
        });
      }


      // ------------------------------------------------------
      // Validation
      // ------------------------------------------------------

      if (
        message.includes(
          "required",
        ) ||
        message.includes(
          "must be",
        ) ||
        message.includes(
          "between",
        )
      ) {
        return res.status(400).json({
          success: false,

          message,
        });
      }


      // ------------------------------------------------------
      // Server error
      // ------------------------------------------------------

      return res.status(500).json({
        success: false,

        message:
          "Failed to record heartbeat.",

        error:
          message,
      });
    }
  };


// ==========================================================
// GET COMPLETE HEARTBEAT TABLE
// ==========================================================

const getHeartbeatData =
  async (
    req,
    res,
  ) => {
    try {
      const {
        vehicleNumber,
        vehicleId,

        start,
        end,

        limit,
      } =
        req.query;


      const finalVehicleNumber =
        vehicleNumber ||
        vehicleId;


      if (
        !finalVehicleNumber
      ) {
        return res.status(400).json({
          success: false,

          message:
            "vehicleNumber is required.",
        });
      }


      // ------------------------------------------------------
      // TIME RANGE REQUEST
      // ------------------------------------------------------

      if (
        start &&
        end
      ) {
        const result =
          await heartbeatService.getHeartbeatsByTimeRange(
            finalVehicleNumber,
            start,
            end,
          );


        return res.status(200).json({
          success: true,

          vehicleNumber:
            finalVehicleNumber,

          count:
            result.count,

          data:
            result.data,

          meta: {
            heartbeatTable:
              result.heartbeatTable,

            dayTable:
              result.dayTable,

            vehicleTable:
              result.vehicleTable,

            wardNo:
              result.wardNo,
          },
        });
      }


      // ------------------------------------------------------
      // LIMITED RECENT DATA
      // ------------------------------------------------------

      if (limit) {
        const result =
          await heartbeatService.getLatestHeartbeats(
            finalVehicleNumber,
            limit,
          );


        return res.status(200).json({
          success: true,

          vehicleNumber:
            finalVehicleNumber,

          count:
            result.count,

          data:
            result.data,

          meta: {
            heartbeatTable:
              result.heartbeatTable,

            dayTable:
              result.dayTable,

            vehicleTable:
              result.vehicleTable,

            wardNo:
              result.wardNo,
          },
        });
      }


      // ------------------------------------------------------
      // COMPLETE TABLE
      // ------------------------------------------------------

      const result =
        await heartbeatService.getAllHeartbeats(
          finalVehicleNumber,
        );


      return res.status(200).json({
        success: true,

        vehicleNumber:
          finalVehicleNumber,

        count:
          result.count,

        data:
          result.data,

        meta: {
          heartbeatTable:
            result.heartbeatTable,

          dayTable:
            result.dayTable,

          vehicleTable:
            result.vehicleTable,

          wardNo:
            result.wardNo,
        },
      });
    } catch (error) {
      console.error(
        "❌ Heartbeat GET error:",
        error,
      );


      const message =
        error.message ||
        "Failed to fetch heartbeat data.";


      if (
        message.includes(
          "not registered for today",
        )
      ) {
        return res.status(404).json({
          success: false,

          message,
        });
      }


      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch heartbeat data.",

        error:
          message,
      });
    }
  };


// ==========================================================
// GET LATEST HEARTBEAT
// ==========================================================

const getLatestHeartbeat =
  async (
    req,
    res,
  ) => {
    try {
      const {
        vehicleNumber,
        vehicleId,
      } =
        req.query;


      const finalVehicleNumber =
        vehicleNumber ||
        vehicleId;


      if (
        !finalVehicleNumber
      ) {
        return res.status(400).json({
          success: false,

          message:
            "vehicleNumber is required.",
        });
      }


      const result =
        await heartbeatService.getLatestHeartbeat(
          finalVehicleNumber,
        );


      return res.status(200).json({
        success: true,

        vehicleNumber:
          finalVehicleNumber,

        data:
          result.data,

        meta: {
          heartbeatTable:
            result.heartbeatTable,

          dayTable:
            result.dayTable,

          vehicleTable:
            result.vehicleTable,

          wardNo:
            result.wardNo,
        },
      });
    } catch (error) {
      console.error(
        "❌ Latest heartbeat error:",
        error,
      );


      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch latest heartbeat.",

        error:
          error.message,
      });
    }
  };


// ==========================================================
// EXPORTS
// ==========================================================

module.exports = {
  saveHeartbeat,

  getHeartbeatData,

  getLatestHeartbeat,
};