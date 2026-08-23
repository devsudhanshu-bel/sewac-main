const queries = require("../telemetry/queries/query");

const metadataManager = require("../telemetry/managers/MetadataManager");

const telemetryDb = require("../config/telemetryDb");

// =====================================================
// VEHICLE HEARTBEAT
// =====================================================
//
// GET:
//
// /api/iot/heart-beat/:vehicleId
//
// Example:
//
// /api/iot/heart-beat/KA05AB1237
// ?latitude=12.902313
// &longitude=77.654855
//
// =====================================================

const recordHeartbeat = async (req, res) => {
  try {
    // =================================================
    // VEHICLE ID
    // =================================================

    const vehicleId = String(req.params.vehicleId || "").trim();

    // =================================================
    // LATITUDE
    // =================================================

    const latitude = Number(req.query.latitude);

    // =================================================
    // LONGITUDE
    // =================================================

    const longitude = Number(req.query.longitude);

    // =================================================
    // VALIDATE VEHICLE ID
    // =================================================

    if (!vehicleId) {
      return res.status(400).json({
        success: false,

        message: "Vehicle ID is required.",
      });
    }

    // =================================================
    // VALIDATE LATITUDE
    // =================================================

    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,

        message: "Valid latitude is required.",
      });
    }

    // =================================================
    // VALIDATE LONGITUDE
    // =================================================

    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,

        message: "Valid longitude is required.",
      });
    }

    // =================================================
    // VEHICLE MASTER VALIDATION
    // =================================================
    //
    // This prevents an unregistered vehicle from
    // creating a heartbeat table.
    //
    // =================================================

    const wardNo = await metadataManager.getVehicleWard(vehicleId);

    // =================================================
    // CURRENT DATE
    // =================================================

    const today = new Date();

    // =================================================
    // DAILY HEARTBEAT TABLE
    // =================================================

    const heartbeatTable = metadataManager.getHeartbeatTableName(
      vehicleId,
      today,
    );

    console.log(`💓 Heartbeat table: ${heartbeatTable}`);

    // =================================================
    // CREATE DAILY HEARTBEAT TABLE
    // =================================================

    await telemetryDb.$executeRawUnsafe(
      queries.createHeartbeatTable(heartbeatTable),
    );

    // =================================================
    // INSERT HEARTBEAT
    // =================================================

    const result = await telemetryDb.$queryRawUnsafe(
      queries.insertHeartbeat(heartbeatTable),

      latitude,

      longitude,
    );

    const heartbeat = result[0];

    // =================================================
    // SUCCESS RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,

      status: "RECORDED",

      message: "Vehicle heartbeat recorded successfully.",

      vehicleId,

      wardNo,

      heartbeatTable,

      data: {
        id: heartbeat.id,

        latitude: heartbeat.latitude,

        longitude: heartbeat.longitude,

        created_at: heartbeat.created_at,
      },
    });
  } catch (error) {
    // =================================================
    // UNREGISTERED VEHICLE
    // =================================================

    if (error.code === "UNREGISTERED_VEHICLE") {
      return res.status(404).json({
        success: false,

        status: "FAILED",

        message: error.message,

        vehicleId: error.vehicleNumber,
      });
    }

    // =================================================
    // GENERAL ERROR
    // =================================================

    console.error("❌ Heartbeat error:", error);

    return res.status(500).json({
      success: false,

      status: "FAILED",

      message: error.message,
    });
  }
};

module.exports = {
  recordHeartbeat,
};
