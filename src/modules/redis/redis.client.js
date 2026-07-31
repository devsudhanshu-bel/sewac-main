import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();


const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});


redisClient.on(
  "connect",
  () => {
    console.log("🔴 Redis Connecting...");
  }
);


redisClient.on(
  "ready",
  () => {
    console.log("✅ Redis Ready");
  }
);


redisClient.on(
  "error",
  (error)=>{
    console.error(
      "❌ Redis Error",
      error
    );
  }
);



export async function connectRedis(){

  if(!redisClient.isOpen){

    await redisClient.connect();

  }

}



export default redisClient;