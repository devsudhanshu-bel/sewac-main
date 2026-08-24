import redisClient from "./redis.client.js";

export async function redisHealth() {

  try {

    if (!redisClient.isOpen) {

      return {
        status: "DOWN",
        error: "Redis client is not connected",
      };

    }

    const response =
      await redisClient.ping();

    return {

      status: "UP",

      response,

    };

  } catch (error) {

    return {

      status: "DOWN",

      error: error.message,

    };

  }

}