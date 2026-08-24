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
  // Flow:
  //
  // authenticated citizen
  //       ↓
  // phone number
  //       ↓
  // master_citizen_map
  //       ↓
  // ward_id
  //       ↓
  // historical DB
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
      // CITIZEN ID
      // -----------------------------------------------

      const citizenId =
        req.user?.id;


      if (!citizenId) {

        throw new Error(
          "Citizen information not found."
        );

      }


      // -----------------------------------------------
      // CITIZEN PHONE NUMBER
      // -----------------------------------------------
      //
      // Auth implementations can expose this using
      // different property names.
      //
      // We do not change the response format.
      //
      // -----------------------------------------------

      const phoneNumber =
        req.user?.phoneNumber
        ??
        req.user?.phone
        ??
        req.user?.mobileNumber
        ??
        req.user?.mobile
        ??
        req.user?.phone_number
        ??
        req.user?.mobile_number;


      if (!phoneNumber) {

        console.log(
          "[Home Controller] Authenticated user does not contain a phone number."
        );

        throw new Error(
          "Citizen phone information not found."
        );

      }


      console.log(
        `[Home Controller] Citizen ID: ${citizenId}`
      );

      console.log(
        `[Home Controller] Citizen phone: ${phoneNumber}`
      );


      // -----------------------------------------------
      // SERVICE
      // -----------------------------------------------

      const result =
        await homeService.getCalendar(

          citizenId,

          phoneNumber,

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