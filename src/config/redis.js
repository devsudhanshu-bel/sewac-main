import { createClient } from "redis";

// =====================================================
// REDIS CONFIGURATION
// =====================================================
//
// Redis is optional for local development.
//
// If REDIS_URL is available and Redis is reachable,
// the application uses Redis.
//
// If Redis is unavailable, the application falls back
// to an in-memory store so local development can
// continue without installing Redis.
//
// Production should always use real Redis.
// =====================================================

const redisUrl =
  process.env.REDIS_URL ||
  "redis://localhost:6379";

let redisClient = null;

let redisAvailable = false;

// =====================================================
// IN-MEMORY FALLBACK
// =====================================================

const memoryStore = new Map();

const memorySets = new Map();


// =====================================================
// EXPIRY CLEANUP
// =====================================================

function cleanupMemoryKey(key) {

  const item =
    memoryStore.get(key);

  if (!item) {
    return;
  }

  if (
    item.expiresAt &&
    item.expiresAt <= Date.now()
  ) {
    memoryStore.delete(key);
  }
}


// =====================================================
// REDIS CLIENT
// =====================================================

try {

  redisClient =
    createClient({
      url: redisUrl,
    });


  redisClient.on(
    "connect",
    () => {

      redisAvailable = true;

      console.log(
        "🔴 Redis Connected"
      );
    }
  );


  redisClient.on(
    "ready",
    () => {

      redisAvailable = true;

      console.log(
        "✅ Redis Ready"
      );
    }
  );


  redisClient.on(
    "end",
    () => {

      redisAvailable = false;

      console.log(
        "⚠️ Redis Connection Closed"
      );
    }
  );


  redisClient.on(
    "error",
    (error) => {

      redisAvailable = false;

      console.warn(
        "⚠️ Redis unavailable. Using in-memory fallback."
      );

      if (error?.message) {

        console.warn(
          `Redis: ${error.message}`
        );
      }
    }
  );


  // ===================================================
  // CONNECT ASYNCHRONOUSLY
  // ===================================================

  redisClient
    .connect()
    .catch(
      (error) => {

        redisAvailable = false;

        console.warn(
          "⚠️ Redis is not available."
        );

        console.warn(
          "⚠️ Using in-memory fallback for local development."
        );

        if (error?.message) {

          console.warn(
            `Redis: ${error.message}`
          );
        }
      }
    );

} catch (error) {

  redisAvailable = false;

  console.warn(
    "⚠️ Redis initialization failed."
  );

  console.warn(
    "⚠️ Using in-memory fallback."
  );
}


// =====================================================
// HELPERS
// =====================================================

export function isRedisAvailable() {

  return redisAvailable;
}


// =====================================================
// GET
// =====================================================

export async function redisGet(
  key
) {

  if (redisAvailable) {

    try {

      return await redisClient.get(
        key
      );

    } catch {

      redisAvailable = false;
    }
  }


  cleanupMemoryKey(key);

  const item =
    memoryStore.get(key);

  return item
    ? item.value
    : null;
}


// =====================================================
// SET
// =====================================================

export async function redisSet(
  key,
  value,
  ttlSeconds = null
) {

  if (redisAvailable) {

    try {

      if (
        ttlSeconds !== null
      ) {

        await redisClient.set(
          key,
          value,
          {
            EX: ttlSeconds,
          }
        );

      } else {

        await redisClient.set(
          key,
          value
        );
      }

      return true;

    } catch {

      redisAvailable = false;
    }
  }


  const expiresAt =
    ttlSeconds
      ? Date.now() +
        ttlSeconds * 1000
      : null;


  memoryStore.set(
    key,
    {
      value,
      expiresAt,
    }
  );


  return true;
}


// =====================================================
// DELETE
// =====================================================

export async function redisDelete(
  key
) {

  if (redisAvailable) {

    try {

      await redisClient.del(
        key
      );

      return true;

    } catch {

      redisAvailable = false;
    }
  }


  memoryStore.delete(
    key
  );

  memorySets.delete(
    key
  );

  return true;
}


// =====================================================
// EXISTS
// =====================================================

export async function redisExists(
  key
) {

  if (redisAvailable) {

    try {

      return (
        await redisClient.exists(
          key
        )
      ) === 1;

    } catch {

      redisAvailable = false;
    }
  }


  cleanupMemoryKey(key);

  return memoryStore.has(
    key
  );
}


// =====================================================
// SET EXPIRY
// =====================================================

export async function redisExpire(
  key,
  ttlSeconds
) {

  if (redisAvailable) {

    try {

      await redisClient.expire(
        key,
        ttlSeconds
      );

      return true;

    } catch {

      redisAvailable = false;
    }
  }


  const item =
    memoryStore.get(key);

  if (!item) {
    return false;
  }


  item.expiresAt =
    Date.now() +
    ttlSeconds * 1000;


  memoryStore.set(
    key,
    item
  );


  return true;
}


// =====================================================
// SET ADD
// =====================================================

export async function redisSAdd(
  key,
  value
) {

  if (redisAvailable) {

    try {

      return await redisClient.sAdd(
        key,
        value
      );

    } catch {

      redisAvailable = false;
    }
  }


  let set =
    memorySets.get(key);

  if (!set) {

    set = new Set();

    memorySets.set(
      key,
      set
    );
  }


  const before =
    set.size;

  set.add(
    value
  );


  return set.size > before
    ? 1
    : 0;
}


// =====================================================
// SET SIZE
// =====================================================

export async function redisSCard(
  key
) {

  if (redisAvailable) {

    try {

      return await redisClient.sCard(
        key
      );

    } catch {

      redisAvailable = false;
    }
  }


  const set =
    memorySets.get(key);

  return set
    ? set.size
    : 0;
}


// =====================================================
// EXPORT
// =====================================================

export default redisClient;