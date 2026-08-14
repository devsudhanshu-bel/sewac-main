require("dotenv").config();
const { createClient } = require("redis");

const redis = createClient({
  url: process.env.REDIS_URL,

  socket: {
    keepAlive: 5000,
    reconnectStrategy: (retries) => Math.min(retries * 500, 5000),
    connectTimeout: 10000,
  },
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

async function clearBadVehicle() {
  const vehicleId = "KA05AB1233";

  const queueKey = `telemetry_vehicle_queue:${vehicleId}`;

  const processingKey = `telemetry_vehicle_processing:${vehicleId}`;

  try {
    console.log("🔌 Connecting to Redis...");

    await redis.connect();

    console.log("✅ Redis connected");

    // -------------------------------------------------
    // CHECK CURRENT STATE
    // -------------------------------------------------

    const queueCount = await redis.lLen(queueKey);

    const processingCount = await redis.lLen(processingKey);

    const isActive = await redis.sIsMember(
      "telemetry_active_vehicles",
      vehicleId,
    );

    console.log("");
    console.log("====================================");
    console.log("BEFORE CLEANUP");
    console.log("====================================");

    console.log(`Vehicle       : ${vehicleId}`);

    console.log(`Queued packets: ${queueCount}`);

    console.log(`Processing    : ${processingCount}`);

    console.log(`Active        : ${isActive}`);

    // -------------------------------------------------
    // DELETE QUEUED PACKETS
    // -------------------------------------------------

    const queueDeleted = await redis.del(queueKey);

    // -------------------------------------------------
    // DELETE PROCESSING PACKETS
    // -------------------------------------------------

    const processingDeleted = await redis.del(processingKey);

    // -------------------------------------------------
    // REMOVE VEHICLE FROM ACTIVE SET
    // -------------------------------------------------

    const activeRemoved = await redis.sRem(
      "telemetry_active_vehicles",
      vehicleId,
    );

    // -------------------------------------------------
    // VERIFY
    // -------------------------------------------------

    const remainingQueue = await redis.lLen(queueKey);

    const remainingProcessing = await redis.lLen(processingKey);

    const remainingActive = await redis.sIsMember(
      "telemetry_active_vehicles",
      vehicleId,
    );

    console.log("");
    console.log("====================================");
    console.log("AFTER CLEANUP");
    console.log("====================================");

    console.log(`Queue deleted      : ${queueDeleted}`);

    console.log(`Processing deleted : ${processingDeleted}`);

    console.log(`Active removed     : ${activeRemoved}`);

    console.log(`Remaining queue    : ${remainingQueue}`);

    console.log(`Remaining processing: ${remainingProcessing}`);

    console.log(`Still active       : ${remainingActive}`);

    console.log("====================================");
  } catch (error) {
    console.error("❌ Cleanup failed:", error);

    process.exitCode = 1;
  } finally {
    if (redis.isOpen) {
      await redis.quit();
    }
  }
}

clearBadVehicle();
