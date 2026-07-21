const { createClient } = require("redis");

let producerClient;
let consumerClient;

async function createRedisConnection() {
  const client = createClient({
  url: process.env.REDIS_URL,

  socket: {
    keepAlive: 5000,

    reconnectStrategy: (retries) => {
      console.log(
        `Redis reconnect attempt ${retries}`
      );
      return Math.min(retries * 500, 5000);

      if (retries > 20) {
        return false;
      }

      return Math.min(retries * 500, 5000);
    },

    connectTimeout: 10000,
  },
});
  client.on("error", (err) => {
    console.error("❌ Redis Error:", err);
  });
  client.on("connect", () => {
  console.log("Redis Connecting...");
});

client.on("ready", () => {
  console.log("Redis Ready");
});

client.on("reconnecting", () => {
  console.log("Redis Reconnecting...");
});

client.on("end", () => {
  console.log("Redis Connection Closed");
});

  await client.connect();

  return client;
}

async function initRedis() {
  producerClient = await createRedisConnection();
  console.log("✅ Redis Producer Connected");

  consumerClient = await createRedisConnection();
  console.log("✅ Redis Consumer Connected");
}

function getProducerClient() {
  return producerClient;
}

function getConsumerClient() {
  return consumerClient;
}

module.exports = {
  initRedis,
  getProducerClient,
  getConsumerClient,
};