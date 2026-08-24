import statsService
  from "./stats.service.js";

import ApiResponse
  from "../../utils/apiResponse.js";


// =====================================================
// STATS CONTROLLER
// =====================================================

class StatsController {


  // ===================================================
  // ANALYTICS
  // ===================================================
  //
  // GET
  //
  // /api/citizen/stats/analytics
  //
  // Example:
  //
  // /api/citizen/stats/analytics
  // ?startDate=2026-08-01
  // &endDate=2026-08-24
  //
  // Flow:
  //
  // authenticated citizen
  //        ↓
  // phone number
  //        ↓
  // master_citizen_map
  //        ↓
  // ward_id
  //        ↓
  // historical monthly tables
  //
  // ===================================================

  async getAnalytics(
    req,
    res,
    next
  ) {

    try {

      const {
        startDate,
        endDate
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
      // CITIZEN PHONE
      // -----------------------------------------------
      //
      // Auth implementations may expose phone using
      // different property names.
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
          "[Stats Controller] Authenticated user does not contain a phone number."
        );

        throw new Error(
          "Citizen phone information not found."
        );

      }


      console.log(
        `[Stats Controller] Citizen ID: ${citizenId}`
      );

      console.log(
        `[Stats Controller] Citizen phone: ${phoneNumber}`
      );


      // -----------------------------------------------
      // SERVICE
      // -----------------------------------------------

      const result =
        await statsService.getAnalytics(

          citizenId,

          phoneNumber,

          startDate,

          endDate

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

}


// =====================================================
// EXPORT
// =====================================================

export default new StatsController();