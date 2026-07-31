import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();


const redisUrl =
  process.env.REDIS_URL;


if (!redisUrl) {

  console.warn(
    "⚠️ REDIS_URL not found. Using local Redis."
  );

}



const redisClient = createClient({

  url:
    redisUrl ||
    "redis://localhost:6379"

});





redisClient.on(
  "connect",
  () => {

    console.log(
      "🔴 Redis Connecting..."
    );

  }
);





redisClient.on(
  "ready",
  () => {

    console.log(
      "✅ Redis Ready"
    );

  }
);





redisClient.on(
  "reconnecting",
  () => {

    console.log(
      "🔄 Redis Reconnecting..."
    );

  }
);





redisClient.on(
  "error",
  (error)=>{


    console.error(
      "❌ Redis Error:",
      error.message
    );


  }
);





redisClient.on(
  "end",
  ()=>{

    console.log(
      "🔴 Redis Connection Closed"
    );

  }
);







export async function connectRedis(){


  try{


    if(
      !redisClient.isOpen
    ){

      await redisClient.connect();

    }



  }

  catch(error){


    console.error(
      "❌ Redis Connection Failed:",
      error.message
    );


    throw error;


  }


}






export default redisClient;