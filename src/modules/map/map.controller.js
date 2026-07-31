import mapService from "./map.service.js";


class MapController {


  /**
   * GET /map/nearest
   *
   * Find nearest garbage truck
   * based on citizen location
   */
  async getNearestTruck(req, res, next) {

    try {


      const {
        latitude,
        longitude
      } = req.query;




      if (
        !latitude ||
        !longitude
      ) {


        return res.status(400).json({

          success:false,

          message:
            "Latitude and longitude are required.",

          data:null,

        });


      }






      const truck =

        await mapService.findNearestTruck(

          Number(latitude),

          Number(longitude)

        );







      if(!truck){


        return res.status(404).json({

          success:false,

          message:
            "No nearby truck found.",

          data:null,

        });


      }







      return res.status(200).json({

        success:true,

        message:
          "Nearest truck found successfully.",

        data:truck,

      });




    }

    catch(error){

      next(error);

    }


  }









  /**
   * GET /map/truck/:vehicleId
   *
   * Get specific truck
   */
  async getTruck(req,res,next){


    try{


      const {
        vehicleId
      } = req.params;





      const truck =

        await mapService.getTruck(

          vehicleId

        );







      if(!truck){


        return res.status(404).json({

          success:false,

          message:
            "Vehicle not found.",

          data:null,

        });


      }








      return res.status(200).json({

        success:true,

        message:
          "Vehicle fetched successfully.",

        data:truck,

      });




    }

    catch(error){

      next(error);

    }


  }



}


export default new MapController();