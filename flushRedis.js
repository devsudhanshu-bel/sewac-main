require("./src/config/loadEnv");

const { createClient } = require("redis");

(async () => {
  const client = createClient({
    url: process.env.REDIS_URL,
  });

  await client.connect();

  console.log(
    "Before:",
    await client.lLen("telemetry_processing_queue")
  );

  await client.del("telemetry_processing_queue");

  console.log(
    "After:",
    await client.lLen("telemetry_processing_queue")
  );

  await client.quit();
})();