import redisClient from "./modules/redis/redis.client.js";


async function test(){

    await redisClient.connect();


    const keys =
        await redisClient.keys("*");


    console.log(keys);


    await redisClient.quit();

}


test();