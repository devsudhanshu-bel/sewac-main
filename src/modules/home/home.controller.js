import homeService from "./home.service.js";
import ApiResponse from "../../utils/apiResponse.js";


class HomeController {


  /**
   * Monthly Calendar
   * GET /api/citizen/home/calendar?year=2026&month=7
   */
  async getCalendar(req, res, next) {

    try {


      const {
        year,
        month
      } = req.query;



      const result =
        await homeService.getCalendar(

          req.user.id,

          year,

          month

        );




      return res.status(200).json(

        new ApiResponse(

          200,

          result.message,

          result.data

        )

      );


    } catch(error) {

      next(error);

    }

  }







  /**
   * Today's Collection
   * GET /api/citizen/home/today
   */
  async getTodayCollection(req, res, next) {


    try {


      const result =
        await homeService.getTodayCollection(

          req.user.id

        );




      return res.status(200).json(

        new ApiResponse(

          200,

          result.message,

          result.data

        )

      );


    } catch(error) {

      next(error);

    }


  }


}



export default new HomeController();