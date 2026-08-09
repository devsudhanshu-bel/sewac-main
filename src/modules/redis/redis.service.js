import redisClient from "./redis.client.js";

class RedisService {
  // =================================
  // SET VALUE
  // =================================

  async set(key, value, expirySeconds = null) {
    const data = JSON.stringify(value);

    if (expirySeconds) {
      await redisClient.set(key, data, {
        EX: expirySeconds,
      });
    } else {
      await redisClient.set(key, data);
    }
  }

  // =================================
  // SET OPERATIONS
  // =================================

  async addToSet(key, value) {
    return await redisClient.sAdd(key, value);
  }

  async setSize(key) {
    return await redisClient.sCard(key);
  }

  async setExpiry(key, expirySeconds) {
    return await redisClient.expire(key, expirySeconds);
  }

  // =================================
  // GET VALUE
  // =================================

  async get(key) {
    const data = await redisClient.get(key);

    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Redis JSON Parse Error:", error);

      return data;
    }
  }

  // =================================
  // DELETE KEY
  // =================================

  async delete(key) {
    await redisClient.del(key);
  }

  // =================================
  // CHECK EXISTS
  // =================================

  async exists(key) {
    return await redisClient.exists(key);
  }

  // =================================
  // GET OR CREATE CACHE
  // =================================

  async getOrSet(key, callback, expirySeconds = 300) {
    const cached = await this.get(key);

    if (cached) {
      return cached;
    }

    const freshData = await callback();

    await this.set(key, freshData, expirySeconds);

    return freshData;
  }

  // =================================
  // CLEAR ALL CACHE
  // USE ONLY DEVELOPMENT
  // =================================

  async clear() {
    await redisClient.flushDb();
  }
}

export default new RedisService();
