import redisService from "../redis/redis.service.js";
import redisKeys from "../redis/redis.keys.js";
import redisClient from "../redis/redis.client.js";


class MapRedis {


  // ==========================================
  // SAVE / CREATE TRUCK
  // ==========================================


  async setTruck(truck) {


    const key =
      redisKeys.mapVehicle(
        truck.vehicleId
      );



    await redisService.set(

      key,

      truck,

      3600

    );



    await this.updateGeoLocation(

      truck.vehicleId,

      truck.currentPoint.latitude,

      truck.currentPoint.longitude

    );



    return truck;


  }









  // ==========================================
  // GET SINGLE TRUCK
  // ==========================================


  async getTruck(vehicleId) {


    return await redisService.get(

      redisKeys.mapVehicle(
        vehicleId
      )

    );


  }









  // ==========================================
  // UPDATE TRUCK
  // ==========================================


  async updateTruck(
    vehicleId,
    data
  ) {


    const existing =
      await this.getTruck(
        vehicleId
      );



    if(!existing){

      return null;

    }



    const updatedTruck = {


      ...existing,


      ...data,


      updatedAt:
        data.updatedAt ||
        new Date()


    };



    await this.setTruck(
      updatedTruck
    );



    return updatedTruck;


  }









  // ==========================================
  // GET ALL TRUCKS
  // ==========================================


  async getAllTrucks(){


    const keys =
      await redisClient.keys(
        "map:vehicle:*"
      );



    if(!keys.length){

      return [];

    }



    const trucks = [];



    for(const key of keys){


      const truck =
        await redisService.get(
          key
        );



      if(truck){

        trucks.push(
          truck
        );

      }


    }



    return trucks;


  }









  // ==========================================
  // DELETE TRUCK
  // ==========================================


  async deleteTruck(vehicleId){


    await redisService.delete(

      redisKeys.mapVehicle(
        vehicleId
      )

    );



    await redisClient.zRem(

      redisKeys.mapGeo(),

      vehicleId

    );


    await redisService.delete(

      redisKeys.mapTrail(
        vehicleId
      )

    );


  }









  // ==========================================
  // REMOVE OFFLINE TRUCKS
  // ==========================================


  async removeOfflineTrucks(){


    const trucks =
      await this.getAllTrucks();



    const now =
      Date.now();




    for(const truck of trucks){


      const updatedTime =

        new Date(
          truck.updatedAt
        ).getTime();




      const diffMinutes =

        (
          now -
          updatedTime
        )
        /
        (1000 * 60);





      if(diffMinutes > 30){


        await this.deleteTruck(

          truck.vehicleId

        );



        console.log(

          `🗑️ Removed offline truck: ${truck.vehicleId}`

        );


      }


    }


  }









  // ==========================================
  // TRAIL STORAGE
  // ==========================================


  async addTrail(
    vehicleId,
    point
  ){


    const key =
      redisKeys.mapTrail(
        vehicleId
      );



    let trail =
      await redisService.get(
        key
      );



    if(!trail){

      trail = [];

    }



    trail.push(point);



    if(trail.length > 100){


      trail =
        trail.slice(
          trail.length - 100
        );


    }




    await redisService.set(

      key,

      trail,

      3600

    );



    return trail;


  }









  // ==========================================
  // GET TRAIL
  // ==========================================


  async getTrail(vehicleId){


    return await redisService.get(

      redisKeys.mapTrail(
        vehicleId
      )

    );


  }









  // ==========================================
  // REDIS GEO UPDATE
  // ==========================================


  async updateGeoLocation(

    vehicleId,

    latitude,

    longitude

  ){



    await redisClient.geoAdd(

      redisKeys.mapGeo(),

      {

        longitude,

        latitude,

        member: vehicleId

      }

    );


  }









  // ==========================================
  // FIND NEAREST TRUCK
  // ==========================================


  async findNearestTruck(

    latitude,

    longitude

  ){



    const result =

      await redisClient.geoSearch(

        redisKeys.mapGeo(),

        {

          longitude,

          latitude

        },

        {

          radius:10,

          unit:"km",

          COUNT:1,

          SORT:"ASC"

        }

      );





    if(
      !result ||
      !result.length
    ){

      return null;

    }





    return await this.getTruck(

      result[0]

    );


  }





}


export default new MapRedis();