import adminComplaintsService from "./admin_complaints.service.js";


class AdminComplaintsController {


  /**
   * GET /api/admin/all-complaints
   *
   * Fetch all complaints for admin dashboard
   *
   * Query Params:
   *
   * status
   * category
   *
   */
  async getAllComplaints(req, res, next) {


    try {


      const {
        status,
        category

      } = req.query;




      const result =
        await adminComplaintsService.getAllComplaints({

          status,

          category

        });





      return res.status(

        result.success
          ? 200
          : 404

      ).json(result);




    }


    catch(error){


      next(error);


    }


  }



}



export default new AdminComplaintsController();