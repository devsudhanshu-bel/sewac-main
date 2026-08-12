const { createClient } = require("redis");

let producerClient;
let consumerClient;

// =====================================================
// CREATE REDIS CONNECTION
// =====================================================

async function createRedisConnection(name = "Redis") {
  const client = createClient({
    url: process.env.REDIS_URL,

    socket: {
      keepAlive: 5000,

      reconnectStrategy: (retries) => Math.min(retries * 500, 5000),

      connectTimeout: 10000,
    },
  });

  // ---------------------------------------------------
  // ERROR
  // ---------------------------------------------------

  client.on("error", (err) => {
    console.error(`❌ ${name} Error:`, err);
  });

  // ---------------------------------------------------
  // READY
  // ---------------------------------------------------

  client.on("ready", () => {
    console.log(`Redis Ready [${name}]`);
  });

  // ---------------------------------------------------
  // RECONNECTING
  // ---------------------------------------------------

  client.on("reconnecting", () => {
    console.log(`Redis Reconnecting [${name}]...`);
  });

  // ---------------------------------------------------
  // CONNECT
  // ---------------------------------------------------

  await client.connect();

  return client;
}

// =====================================================
// INITIALIZE MAIN REDIS CONNECTIONS
// =====================================================
//
// Producer:
//   Used for pushing/enqueueing/status/recovery.
//
// Consumer:
//   Kept for compatibility with the existing system.
//
// Dispatchers:
//   DO NOT use the shared consumer connection anymore.
//   Each dispatcher gets its own connection through
//   createDispatcherClient() below.
//
// =====================================================

async function initRedis() {
  producerClient = await createRedisConnection("Producer");

  console.log("✅ Redis Producer Connected");

  consumerClient = await createRedisConnection("Consumer");

  console.log("✅ Redis Consumer Connected");
}

// =====================================================
// DEDICATED DISPATCHER CONNECTION
// =====================================================
//
// IMPORTANT:
//
// Each dispatcher gets its OWN Redis connection.
//
// Dispatcher 1 → Redis connection 1
// Dispatcher 2 → Redis connection 2
// Dispatcher 3 → Redis connection 3
// Dispatcher 4 → Redis connection 4
//
// This is required because the dispatcher performs
// blocking Redis operations such as BLMove().
//
// =====================================================

async function createDispatcherClient(dispatcherId) {
  return createRedisConnection(`Dispatcher-${dispatcherId}`);
}

// =====================================================
// GET PRODUCER
// =====================================================

function getProducerClient() {
  if (!producerClient) {
    throw new Error("Redis producer client is not initialized.");
  }

  return producerClient;
}

// =====================================================
// GET CONSUMER
// =====================================================
//
// Kept for compatibility with other existing code.
//
// IMPORTANT:
// telemetryQueueService should use
// createDispatcherClient() instead of this shared
// consumer for its blocking dispatcher loop.
//
// =====================================================

function getConsumerClient() {
  if (!consumerClient) {
    throw new Error("Redis consumer client is not initialized.");
  }

  return consumerClient;
}

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  initRedis,

  createRedisConnection,

  createDispatcherClient,

  getProducerClient,

  getConsumerClient,
};
