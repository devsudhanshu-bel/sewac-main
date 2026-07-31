import sewacPrisma from "../../config/sewacPrisma.js";


class AdminMapsRepository {


  /**
   * Get live vehicles based on filters
   *
   * Filters:
   * city
   * division
   * zone
   * ward
   */
  async getLiveVehicles(filters = {}) {


    const {
      city,
      division,
      zone,
      ward
    } = filters;



    const vehicles =
      await sewacPrisma.vehicle_master.findMany({

        where: {

          status: "ACTIVE",


          ...(city && {
            city
          }),


          ...(division && {
            division
          }),


          ...(zone && {
            zone
          }),


          ...(ward && {
            ward
          })

        },


        select: {

          vehicle_id: true,

          vehicle_type: true,

          city: true,

          zone: true,

          division: true,

          ward: true,

          status: true,

          vehicle_telemetry: {

            orderBy: {

              recorded_at: "desc"

            },


            take: 1,


            select: {

              latitude: true,

              longitude: true,

              speed_kmh: true,

              engine_status: true,

              recorded_at: true

            }

          }

        }

      });



    return vehicles;

  }



}


export default new AdminMapsRepository();