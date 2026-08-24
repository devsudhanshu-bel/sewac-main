import redisClient from "./redis.client.js";

class RedisService {

  // ===================================================
  // SET
  // ===================================================

  async set(
    key,
    value,
    expirySeconds = null
  ) {

    const data =
      JSON.stringify(value);

    if (expirySeconds) {

      await redisClient.set(
        key,
        data,
        {
          EX: expirySeconds,
        }
      );

    } else {

      await redisClient.set(
        key,
        data
      );

    }

  }


  // ===================================================
  // GET
  // ===================================================

  async get(key) {

    const data =
      await redisClient.get(key);

    if (!data) {
      return null;
    }

    try {

      return JSON.parse(data);

    } catch {

      return data;

    }

  }


  // ===================================================
  // DELETE
  // ===================================================

  async delete(key) {

    await redisClient.del(key);

  }


  // ===================================================
  // EXISTS
  // ===================================================

  async exists(key) {

    return await redisClient.exists(key);

  }


  // ===================================================
  // SET ADD
  // ===================================================

  async addToSet(
    key,
    value
  ) {

    return await redisClient.sAdd(
      key,
      value
    );

  }


  // ===================================================
  // SET SIZE
  // ===================================================

  async setSize(key) {

    return await redisClient.sCard(
      key
    );

  }


  // ===================================================
  // SET EXPIRY
  // ===================================================

  async setExpiry(
    key,
    expirySeconds
  ) {

    return await redisClient.expire(
      key,
      expirySeconds
    );

  }


  // ===================================================
  // GET OR SET
  // ===================================================

  async getOrSet(
    key,
    callback,
    expirySeconds = 300
  ) {

    const cached =
      await this.get(key);

    if (cached !== null) {

      return cached;

    }

    const freshData =
      await callback();

    await this.set(
      key,
      freshData,
      expirySeconds
    );

    return freshData;

  }


  // ===================================================
  // CLEAR DATABASE
  // DEVELOPMENT ONLY
  // ===================================================

  async clear() {

    await redisClient.flushDb();

  }


  // ===================================================
  // PING
  // ===================================================

  async ping() {

    return await redisClient.ping();

  }

}

export default new RedisService();