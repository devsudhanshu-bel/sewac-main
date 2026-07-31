import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();


const redisClient = createClient({

  url: process.env.REDIS_URL

});



redisClient.on(
  "connect",
  ()=>{
    console.log(
      "🔴 Redis Connecting..."
    );
  }
);



redisClient.on(
  "ready",
  ()=>{
    console.log(
      "✅ Redis Ready"
    );
  }
);



redisClient.on(
  "reconnecting",
  ()=>{
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



export async function connectRedis(){


  if(!redisClient.isOpen){

    await redisClient.connect();

  }


}



export default redisClient;