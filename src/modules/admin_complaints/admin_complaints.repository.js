import sewacPrisma from "../../config/sewacPrisma.js";


class AdminComplaintsRepository {


  /**
   * Fetch all complaints
   *
   * Filters:
   * status
   * category
   */
  async getAllComplaints(filters = {}) {


    const {
      status,
      category
    } = filters;



    return await sewacPrisma.citizen_complaints.findMany({


      where:{


        ...(status && {
          status
        }),



        ...(category && {
          category
        })


      },



      orderBy:{


        created_at:
          "desc"


      }


    });


  }



}


export default new AdminComplaintsRepository(); 