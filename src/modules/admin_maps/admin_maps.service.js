import adminMapsRepository from "./admin_maps.repository.js";
import { ADMIN_MAP_MESSAGES } from "./admin_maps.constants.js";


class AdminMapsService {


  /**
   * Get live trucks for admin map
   *
   * Filters:
   * city
   * division
   * zone
   * ward
   */
  async getLiveTrucks(filters = {}) {


    const vehicles =
      await adminMapsRepository.getLiveVehicles(
        filters
      );



    if (!vehicles.length) {


      return {

        success: false,

        message:
          ADMIN_MAP_MESSAGES.NO_TRUCKS_FOUND,

        data: {
          trucks: []
        }

      };

    }





    const trucks =
      vehicles.map((vehicle)=>{


        const telemetry =
          vehicle.vehicle_telemetry[0];



        let status =
          "OFFLINE";



        if(telemetry?.recorded_at){


          const lastUpdated =
            new Date(
              telemetry.recorded_at
            );


          const difference =
            Date.now() -
            lastUpdated.getTime();



          // Active if telemetry received
          // within last 5 minutes

          if(
            difference <
            5 * 60 * 1000
          ){

            status = "ONLINE";

          }

        }





        return {


          vehicleId:
            vehicle.vehicle_id,


          vehicleType:
            vehicle.vehicle_type,



          location: {


            latitude:
              telemetry?.latitude
                ? Number(
                    telemetry.latitude
                  )
                : null,


            longitude:
              telemetry?.longitude
                ? Number(
                    telemetry.longitude
                  )
                : null


          },



          speed:
            telemetry?.speed_kmh
              ? Number(
                  telemetry.speed_kmh
                )
              : 0,



          engineStatus:
            telemetry?.engine_status
              || null,



          city:
            vehicle.city,


          division:
            vehicle.division,


          zone:
            vehicle.zone,


          ward:
            vehicle.ward,


          status,



          lastUpdated:
            telemetry?.recorded_at
              || null


        };


      });





    return {


      success: true,


      message:
        ADMIN_MAP_MESSAGES.LIVE_TRUCKS_FETCHED,


      data: {

        trucks

      }


    };


  }


}


export default new AdminMapsService();