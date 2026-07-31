import redisClient from "./modules/redis/redis.client.js";
import redisKeys from "./modules/redis/redis.keys.js";


async function test(){

    await redisClient.connect();


    const key =
        redisKeys.authToken(1050);


    const value =
        await redisClient.get(key);


    console.log("KEY:");
    console.log(key);


    console.log("VALUE:");
    console.log(value);


    await redisClient.quit();

}


test();