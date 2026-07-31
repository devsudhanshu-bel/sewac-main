import sewacPrisma from "../../config/sewacPrisma.js";


class MapRepository {



  /**
   * Get all telemetry for today
   *
   * Used during server startup
   * to initialize map cache
   */
  async getTodayTelemetry() {


    const startOfDay = new Date();


    startOfDay.setHours(
      0,
      0,
      0,
      0
    );



    return await sewacPrisma.telemetry_logs.findMany({


      where: {


        received_at: {

          gte: startOfDay

        }


      },



      orderBy: [


        {

          vehicle_id: "asc"

        },


        {

          received_at: "asc"

        }


      ],



      select: {


        id: true,


        vehicle_id: true,


        latitude: true,


        longitude: true,


        received_at: true,


        iot_timestamp: true


      }



    });


  }









  /**
   * Get latest location of every truck today
   *
   * Used by map worker every 2 seconds
   */
  async getLatestTelemetry() {



    const startOfDay = new Date();



    startOfDay.setHours(

      0,

      0,

      0,

      0

    );





    return await sewacPrisma.$queryRaw`



      SELECT DISTINCT ON (vehicle_id)



        id,

        vehicle_id,

        latitude,

        longitude,

        received_at,

        iot_timestamp



      FROM telemetry_logs





      WHERE

        vehicle_id IS NOT NULL

        AND received_at >= ${startOfDay}





      ORDER BY



        vehicle_id ASC,


        received_at DESC;



    `;



  }








}


export default new MapRepository();