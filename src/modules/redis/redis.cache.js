import redisService from "./redis.service.js";
import redisKeys from "./redis.keys.js";


class RedisCache {



async cacheUserToken(
 userId,
 token
){

 await redisService.set(
  redisKeys.authToken(userId),
  token,
  86400
 );

}



async getUserToken(userId){

 return await redisService.get(
  redisKeys.authToken(userId)
 );

}




async cacheMapVehicles(data){

 await redisService.set(
  redisKeys.mapVehicles(),
  data,
  10
 );

}




async getMapVehicles(){

 return await redisService.get(
  redisKeys.mapVehicles()
 );

}




async clearMap(){

 await redisService.delete(
  redisKeys.mapVehicles()
 );

}



}


export default new RedisCache();