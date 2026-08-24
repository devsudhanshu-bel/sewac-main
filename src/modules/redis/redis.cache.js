import redisService from "./redis.service.js";
import redisKeys from "./redis.keys.js";

class RedisCache {

  // ===================================================
  // AUTH TOKEN
  // ===================================================

  async cacheUserToken(
    userId,
    deviceId,
    token
  ) {

    await redisService.set(
      redisKeys.authToken(
        userId,
        deviceId
      ),
      token,
      86400
    );

  }


  async getUserToken(
    userId,
    deviceId
  ) {

    return await redisService.get(
      redisKeys.authToken(
        userId,
        deviceId
      )
    );

  }


  // ===================================================
  // MAP
  // ===================================================

  async cacheMapVehicles(data) {

    await redisService.set(
      redisKeys.mapVehicles(),
      data,
      10
    );

  }


  async getMapVehicles() {

    return await redisService.get(
      redisKeys.mapVehicles()
    );

  }


  async clearMap() {

    await redisService.delete(
      redisKeys.mapVehicles()
    );

  }

}

export default new RedisCache();