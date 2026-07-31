import mapService from "./map.service.js";
import mapRedis from "./map.redis.js";


class MapWorker {


  constructor(){

    this.interval = null;

    this.isRunning = false;

  }





  start(){


    if(this.interval){


      console.log(
        "⚠️ Map Worker is already running."
      );


      return;

    }






    console.log(
      "🚛 Map Worker Started"
    );


    console.log(
      "⏱️ Syncing vehicle telemetry every 2 seconds..."
    );







    this.interval = setInterval(
      async ()=>{


        if(this.isRunning){

          return;

        }



        this.isRunning = true;




        try{



          // Sync latest telemetry
          await mapService.syncLiveLocations();




          // Remove offline trucks from Redis
          await mapRedis.removeOfflineTrucks();




        }

        catch(error){


          console.error(
            "❌ Map Worker Error:"
          );


          console.error(
            error
          );


        }

        finally{


          this.isRunning = false;


        }




      },

      2000

    );



  }








  stop(){



    if(!this.interval){


      console.log(
        "⚠️ Map Worker is not running."
      );


      return;

    }





    clearInterval(
      this.interval
    );



    this.interval = null;


    this.isRunning = false;




    console.log(
      "🛑 Map Worker Stopped"
    );



  }





}


export default new MapWorker();