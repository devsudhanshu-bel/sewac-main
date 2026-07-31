import mapRepository from "./map.repository.js";
import mapRedis from "./map.redis.js";
import { emitTruckLocationUpdated } from "./map.socket.js";


class MapService {


  async initializeCache() {

    const telemetry =
      await mapRepository.getTodayTelemetry();


    if (!telemetry.length) {

      console.log(
        "⚠️ No telemetry data found."
      );

      return;

    }


    const grouped = new Map();


    for (const row of telemetry) {


      if (!row.vehicle_id) continue;


      if (!grouped.has(row.vehicle_id)) {

        grouped.set(
          row.vehicle_id,
          []
        );

      }


      grouped
        .get(row.vehicle_id)
        .push(row);

    }



    for (
      const [vehicleId, records]
      of grouped.entries()
    ) {


      const first =
        records[0];


      const latest =
        records[records.length - 1];


      const previous =
        records.length > 1
          ? records[records.length - 2]
          : latest;



      const truck = {


        vehicleId,


        initialPoint: {

          latitude:
            Number(first.latitude),

          longitude:
            Number(first.longitude)

        },


        previousPoint: {

          latitude:
            Number(previous.latitude),

          longitude:
            Number(previous.longitude)

        },


        currentPoint: {

          latitude:
            Number(latest.latitude),

          longitude:
            Number(latest.longitude)

        },


        speed:
          latest.speed_kmh
            ? Number(latest.speed_kmh)
            : 0,


        status:"ONLINE",


        updatedAt:
          this.getTelemetryTime(latest)

      };



      await mapRedis.setTruck(
        truck
      );



      console.log(
        `🚛 Loaded ${vehicleId}`
      );


    }



    console.log(
      `✅ Redis Map Ready (${grouped.size} trucks)`
    );


  }







  async syncLiveLocations() {


    const latestTelemetry =
      await mapRepository.getLatestTelemetry();



    if(!latestTelemetry.length){

      return;

    }




    for(const telemetry of latestTelemetry){



      const vehicleId =
        telemetry.vehicle_id;



      if(!vehicleId){

        continue;

      }



      const latitude =
        Number(
          telemetry.latitude
        );


      const longitude =
        Number(
          telemetry.longitude
        );


      const recordedAt =
        this.getTelemetryTime(
          telemetry
        );



      const truck =
        await mapRedis.getTruck(
          vehicleId
        );






      if(!truck){



        const newTruck = {


          vehicleId,


          initialPoint:{
            latitude,
            longitude
          },


          previousPoint:{
            latitude,
            longitude
          },


          currentPoint:{
            latitude,
            longitude
          },


          speed:0,


          status:"ONLINE",


          updatedAt:recordedAt


        };



        await mapRedis.setTruck(
          newTruck
        );



        console.log(
          `🚛 New Truck Added ${vehicleId}`
        );



        emitTruckLocationUpdated(
          newTruck
        );


        continue;


      }







      const sameLocation =

        truck.currentPoint.latitude === latitude &&

        truck.currentPoint.longitude === longitude;



      const sameTimestamp =

        new Date(truck.updatedAt)
        .getTime()
        ===
        new Date(recordedAt)
        .getTime();





      if(
        sameLocation &&
        sameTimestamp
      ){

        continue;

      }






      const updatedTruck = {


        ...truck,


        previousPoint:
          truck.currentPoint,


        currentPoint:{

          latitude,

          longitude

        },


        speed:

          telemetry.speed_kmh
            ? Number(
                telemetry.speed_kmh
              )
            : truck.speed,



        status:"ONLINE",


        updatedAt:recordedAt


      };




      await mapRedis.setTruck(
        updatedTruck
      );



      await mapRedis.addTrail(

        vehicleId,

        {
          latitude,
          longitude,
          timestamp:recordedAt
        }

      );




      console.log(
        `📍 ${vehicleId} moved -> ${latitude}, ${longitude}`
      );



      emitTruckLocationUpdated(
        updatedTruck
      );


    }


  }







  getTelemetryTime(record){


    return (

      record.received_at ||

      record.recorded_at ||

      record.iot_timestamp ||

      new Date()

    );


  }







  async getLiveTruckLocations(){


    return await mapRedis.getAllTrucks();


  }







  async getTruck(vehicleId){


    return await mapRedis.getTruck(
      vehicleId
    );


  }







  async findNearestTruck(
    latitude,
    longitude
  ){


    const truck =

      await mapRedis.findNearestTruck(

        latitude,

        longitude

      );



    if(!truck){

      return null;

    }



    const distance =

      this.haversineDistance(

        latitude,

        longitude,

        truck.currentPoint.latitude,

        truck.currentPoint.longitude

      );



    return {


      ...truck,


      distance:
        Number(
          distance.toFixed(2)
        )


    };


  }







  haversineDistance(
    lat1,
    lon1,
    lat2,
    lon2
  ){


    const toRad =
      value =>
        value *
        Math.PI /
        180;



    const R = 6371;



    const dLat =
      toRad(
        lat2-lat1
      );


    const dLon =
      toRad(
        lon2-lon1
      );



    const a =

      Math.sin(dLat/2)**2

      +

      Math.cos(
        toRad(lat1)
      )

      *

      Math.cos(
        toRad(lat2)
      )

      *

      Math.sin(dLon/2)**2;



    const c =

      2 *

      Math.atan2(

        Math.sqrt(a),

        Math.sqrt(1-a)

      );



    return R*c;


  }


}


export default new MapService();