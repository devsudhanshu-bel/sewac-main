// =====================================================
// SEWAC REDIS CLIENT
// TEMPORARY IN-MEMORY IMPLEMENTATION
// =====================================================
//
// Redis server is intentionally disabled for development.
//
// This file provides the same basic API expected by the
// rest of the application without requiring Redis to be
// installed or running on localhost:6379.
//
// IMPORTANT:
// All data is stored in Node.js memory.
// Restarting the backend clears the cache.
//
// =====================================================

const values = new Map();

const sets = new Map();

const expirations = new Map();


// =====================================================
// INTERNAL EXPIRY HANDLER
// =====================================================

function removeIfExpired(key) {

  const expiresAt = expirations.get(key);

  if (
    expiresAt &&
    Date.now() >= expiresAt
  ) {

    values.delete(key);

    sets.delete(key);

    expirations.delete(key);

    return true;
  }

  return false;
}


// =====================================================
// SET EXPIRATION
// =====================================================

function applyExpiry(
  key,
  seconds
) {

  if (
    !seconds ||
    seconds <= 0
  ) {
    return;
  }

  expirations.set(
    key,
    Date.now() + seconds * 1000
  );
}


// =====================================================
// IN-MEMORY REDIS CLIENT
// =====================================================

const redisClient = {

  // ---------------------------------------------------
  // CONNECTION STATE
  // ---------------------------------------------------

  isOpen: true,

  isReady: true,


  // ---------------------------------------------------
  // CONNECT
  // ---------------------------------------------------

  async connect() {

    this.isOpen = true;

    this.isReady = true;

    console.log(
      "⚠️ Redis server disabled - using in-memory cache"
    );

    return;
  },


  // ---------------------------------------------------
  // DISCONNECT
  // ---------------------------------------------------

  async disconnect() {

    this.isOpen = false;

    this.isReady = false;

    return;
  },


  // ---------------------------------------------------
  // QUIT
  // ---------------------------------------------------

  async quit() {

    return this.disconnect();

  },


  // ===================================================
  // STRING OPERATIONS
  // ===================================================

  async set(
    key,
    value,
    options = null
  ) {

    removeIfExpired(key);

    values.set(
      key,
      String(value)
    );

    if (
      options &&
      typeof options === "object" &&
      options.EX
    ) {

      applyExpiry(
        key,
        Number(options.EX)
      );

    }

    return "OK";
  },


  async get(
    key
  ) {

    if (
      removeIfExpired(key)
    ) {

      return null;

    }

    if (
      !values.has(key)
    ) {

      return null;

    }

    return values.get(key);

  },


  async del(
    key
  ) {

    const existed =
      values.delete(key) ||
      sets.delete(key);

    expirations.delete(key);

    return existed ? 1 : 0;

  },


  async exists(
    key
  ) {

    if (
      removeIfExpired(key)
    ) {

      return 0;

    }

    return (
      values.has(key) ||
      sets.has(key)
    )
      ? 1
      : 0;

  },


  // ===================================================
  // SET OPERATIONS
  // ===================================================

  async sAdd(
    key,
    value
  ) {

    removeIfExpired(key);

    if (
      !sets.has(key)
    ) {

      sets.set(
        key,
        new Set()
      );

    }

    const set =
      sets.get(key);

    const before =
      set.size;

    set.add(
      String(value)
    );

    return set.size > before
      ? 1
      : 0;

  },


  async sCard(
    key
  ) {

    if (
      removeIfExpired(key)
    ) {

      return 0;

    }

    const set =
      sets.get(key);

    if (
      !set
    ) {

      return 0;

    }

    return set.size;

  },


  async expire(
    key,
    seconds
  ) {

    const exists =
      await this.exists(key);

    if (
      !exists
    ) {

      return 0;

    }

    applyExpiry(
      key,
      Number(seconds)
    );

    return 1;

  },


  // ===================================================
  // KEY OPERATIONS
  // ===================================================

  async keys(
    pattern = "*"
  ) {

    const allKeys = [
      ...values.keys(),
      ...sets.keys(),
    ];

    const uniqueKeys =
      [...new Set(allKeys)];

    const activeKeys =
      uniqueKeys.filter(
        (key) =>
          !removeIfExpired(key)
      );

    if (
      pattern === "*"
    ) {

      return activeKeys;

    }

    // Convert Redis-style wildcard pattern
    // into a regular expression.

    const regexPattern =
      "^" +
      pattern
        .replace(
          /[.+^${}()|[\]\\]/g,
          "\\$&"
        )
        .replace(
          /\*/g,
          ".*"
        )
        .replace(
          /\?/g,
          "."
        ) +
      "$";

    const regex =
      new RegExp(
        regexPattern
      );

    return activeKeys.filter(
      (key) =>
        regex.test(key)
    );

  },


  // ===================================================
  // PING
  // ===================================================

  async ping() {

    return "PONG";

  },


  // ===================================================
  // FLUSH DATABASE
  // ===================================================

  async flushDb() {

    values.clear();

    sets.clear();

    expirations.clear();

    return "OK";

  },


  // ===================================================
  // DEBUG
  // ===================================================

  async dbSize() {

    const keys =
      await this.keys("*");

    return keys.length;

  },


  // ===================================================
  // GET CLIENT
  // ===================================================
  //
  // Some older SEWAC modules use:
  //
  // redisClient.getClient().ping()
  //
  // Keep compatibility with them.
  //
  // ===================================================

  getClient() {

    return this;

  },

};


// =====================================================
// STARTUP MESSAGE
// =====================================================

console.log(
  "⚠️ Redis server disabled - using in-memory cache"
);


export async function connectRedis() {

  // No external Redis connection required.

  redisClient.isOpen = true;

  redisClient.isReady = true;

  console.log(
    "⚠️ Redis disabled - in-memory mode enabled"
  );

}


export default redisClient;