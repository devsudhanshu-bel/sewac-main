import { connectRedis } from "./modules/redis/redis.client.js";
import mapRedis from "./modules/map/map.redis.js";


async function test(){


  await connectRedis();



  console.log(
    "========== ALL TRUCKS =========="
  );


  const trucks =
    await mapRedis.getAllTrucks();


  console.log(
    JSON.stringify(
      trucks,
      null,
      2
    )
  );





  console.log(
    "========== TRAIL =========="
  );


  const trail =
    await mapRedis.getTrail(
      "KA01AB1234"
    );


  console.log(
    JSON.stringify(
      trail,
      null,
      2
    )
  );



  process.exit(0);


}



test();