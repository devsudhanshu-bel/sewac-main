import adminMapsService from "./admin_maps.service.js";


class AdminMapsController {


  /**
   * GET /api/admin/maps/live
   *
   * Returns all active trucks
   * based on selected filters
   */
  async getLiveTrucks(req, res, next) {


    try {


      const {
        city,
        division,
        zone,
        ward

      } = req.query;




      const result =
        await adminMapsService.getLiveTrucks({

          city,

          division,

          zone,

          ward

        });





      return res.status(200).json(result);



    }

    catch(error){


      next(error);


    }


  }



}



export default new AdminMapsController();