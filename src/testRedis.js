import redisClient from "./config/redis.js";


async function test(){

    try {

        await redisClient.connect();


        console.log(
            "✅ Redis connected"
        );


        await redisClient.set(
            "sewac:test",
            "Redis is working"
        );


        const value =
            await redisClient.get(
                "sewac:test"
            );


        console.log(
            "VALUE:",
            value
        );


        await redisClient.disconnect();


    } catch(error){

        console.error(
            error
        );

    }

}


test();