import adminComplaintsRepository from "./admin_complaints.repository.js";

import {
  ADMIN_COMPLAINT_MESSAGES
} from "./admin_complaints.constants.js";



class AdminComplaintsService {



  /**
   * Get all complaints
   */
  async getAllComplaints(filters = {}) {



    const complaints =
      await adminComplaintsRepository.getAllComplaints(
        filters
      );




    if(!complaints.length){


      return {


        success:false,


        message:
          ADMIN_COMPLAINT_MESSAGES.NO_COMPLAINTS_FOUND,


        data:{
          complaints:[]
        }


      };


    }





    return {


      success:true,


      message:
        ADMIN_COMPLAINT_MESSAGES.ALL_COMPLAINTS_FETCHED,


      data:{


        complaints


      }


    };


  }



}


export default new AdminComplaintsService();