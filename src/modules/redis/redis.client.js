import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();


const redisClient = createClient({

  url: process.env.REDIS_URL,

  socket: {

    tls: true,

    reconnectStrategy: (retries)=>{

      if(retries > 10){

        console.error(
          "❌ Redis reconnect failed"
        );

        return new Error(
          "Redis reconnect limit reached"
        );

      }


      return Math.min(
        retries * 100,
        3000
      );

    }

  }

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




redisClient.on(
  "end",
  ()=>{

    console.log(
      "🔴 Redis Connection Closed"
    );

  }
);







export async function connectRedis(){


  if(!redisClient.isOpen){

    await redisClient.connect();

  }


}






export default redisClient;