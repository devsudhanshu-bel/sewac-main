import homeService
  from "./home.service.js";

import ApiResponse
  from "../../utils/apiResponse.js";


// =====================================================
// HOME CONTROLLER
// =====================================================


class HomeController {


  // ===================================================
  // MONTHLY CALENDAR
  // ===================================================
  //
  // GET
  //
  // /api/citizen/home/calendar?year=2026&month=8
  //
  // ===================================================

  async getCalendar(
    req,
    res,
    next
  ) {

    try {


      const {
        year,
        month
      } = req.query;


      // -----------------------------------------------
      // GET WARD FROM AUTH USER
      // -----------------------------------------------

      const wardNo =
        Number(

          req.user?.wardNo

          ??
          req.user?.wardId

          ??
          req.user?.ward?.wardNo

          ??
          req.user?.ward?.wardId

        );


      if (
        !Number.isInteger(wardNo) ||
        wardNo <= 0
      ) {

        throw new Error(
          "Ward information not found for citizen."
        );

      }


      // -----------------------------------------------
      // SERVICE
      // -----------------------------------------------

      const result =
        await homeService
          .getCalendar(

            req.user.id,

            wardNo,

            year,

            month

          );


      // -----------------------------------------------
      // RESPONSE
      // -----------------------------------------------

      return res
        .status(200)
        .json(

          new ApiResponse(

            200,

            result.message,

            result.data

          )

        );


    } catch (error) {

      next(error);

    }

  }


  // ===================================================
  // TODAY'S COLLECTION
  // ===================================================

  async getTodayCollection(
    req,
    res,
    next
  ) {

    try {


      const result =
        await homeService
          .getTodayCollection();


      return res
        .status(200)
        .json(

          new ApiResponse(

            200,

            result.message,

            result.data

          )

        );


    } catch (error) {

      next(error);

    }

  }

}


export default new HomeController();