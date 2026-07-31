import redisClient from "./redis.client.js";



export async function redisHealth(){


    try{


        const response =
            await redisClient
                .getClient()
                .ping();



        return {

            status:"UP",

            response

        };


    }
    catch(error){


        return {

            status:"DOWN",

            error:error.message

        };


    }


}