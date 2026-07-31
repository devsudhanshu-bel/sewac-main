import adminMapsRepository from "./admin_maps.repository.js";
import { emitAdminTruckLocationUpdated } from "./admin_maps.socket.js";


class AdminMapsWorker {


  constructor(){

    this.interval = null;

    this.isRunning = false;

    this.previousLocations = new Map();

  }





  start(){


    if(this.interval){

      console.log(
        "⚠️ Admin Map Worker already running."
      );

      return;

    }



    console.log(
      "🗺️ Admin Map Worker Started"
    );


    console.log(
      "⏱️ Syncing live trucks every 2 seconds..."
    );




    this.interval = setInterval(async()=>{


      if(this.isRunning){

        return;

      }



      this.isRunning = true;



      try{


        await this.syncLiveTrucks();



      }

      catch(error){


        console.error(
          "❌ Admin Map Worker Error:",
          error.message
        );


      }

      finally{


        this.isRunning = false;


      }



    },2000);



  }








  async syncLiveTrucks(){


    const trucks =
      await adminMapsRepository.getLiveVehicles();



    if(!trucks.length){

      return;

    }





    for(const truck of trucks){



      const telemetry =
        truck.vehicle_telemetry[0];



      if(!telemetry){

        continue;

      }






      const liveTruck = {


        vehicleId:
          truck.vehicle_id,



        vehicleType:
          truck.vehicle_type,



        location:{


          latitude:
            Number(
              telemetry.latitude
            ),


          longitude:
            Number(
              telemetry.longitude
            )


        },



        speed:
          telemetry.speed_kmh
            ? Number(
                telemetry.speed_kmh
              )
            : 0,



        zone:
          truck.zone,



        ward:
          truck.ward,



        status:
          truck.status,



        lastUpdated:
          telemetry.recorded_at


      };






      const previous =
        this.previousLocations.get(
          truck.vehicle_id
        );





      const changed =

        !previous ||

        previous.location.latitude
          !== liveTruck.location.latitude ||

        previous.location.longitude
          !== liveTruck.location.longitude;






      if(changed){


        this.previousLocations.set(

          truck.vehicle_id,

          liveTruck

        );



        emitAdminTruckLocationUpdated(
          liveTruck
        );


      }



    }



  }







  stop(){


    if(!this.interval){

      return;

    }



    clearInterval(
      this.interval
    );



    this.interval = null;


    console.log(
      "🛑 Admin Map Worker Stopped"
    );


  }



}



export default new AdminMapsWorker();