const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL);

async function clearTelemetryQueues() {
  try {
    console.log("🔌 Connecting to Redis...");

    await redis.ping();

    console.log("✅ Redis connected");

    // =====================================================
    // CLEAR ONLY THE BAD VEHICLE
    // =====================================================

    const vehicleId = "KA05AB1233";

    const queueKey =
      `telemetry_vehicle_queue:${vehicleId}`;

    const processingKey =
      `telemetry_vehicle_processing:${vehicleId}`;

    // Remove queued packets
    const queueDeleted =
      await redis.del(queueKey);

    // Remove processing packets
    const processingDeleted =
      await redis.del(processingKey);

    // Remove vehicle from active processor set
    const activeRemoved =
      await redis.srem(
        "telemetry_active_vehicles",
        vehicleId
      );

    console.log("");
    console.log("====================================");
    console.log("TELEMETRY QUEUE CLEANUP COMPLETE");
    console.log("====================================");

    console.log(
      `Vehicle              : ${vehicleId}`
    );

    console.log(
      `Queue key deleted    : ${queueDeleted}`
    );

    console.log(
      `Processing key deleted: ${processingDeleted}`
    );

    console.log(
      `Active set removed   : ${activeRemoved}`
    );

    console.log("====================================");

  } catch (error) {

    console.error(
      "❌ Redis cleanup failed:",
      error
    );

    process.exitCode = 1;

  } finally {

    await redis.quit();

  }
}

clearTelemetryQueues();