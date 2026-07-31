import authService from "./auth.service.js";

import { validateLogin } from "./auth.validation.js";



class AuthController {


  /**
   * POST /api/citizen/auth/login
   */
  async login(req, res, next) {

    try {


      const {
        phoneNumber
      } = req.body;




      const validation =
        validateLogin(
          phoneNumber
        );




      if(!validation.valid){


        return res.status(400).json({

          success:false,

          message:validation.message,

        });


      }





      const response =
        await authService.login(
          phoneNumber
        );




      return res
        .status(response.statusCode)
        .json(response);



    }

    catch(error){

      next(error);

    }

  }







  /**
   * POST /api/citizen/auth/logout
   */
  async logout(req,res,next){

    try {


      const response =
        await authService.logout(
          req.user
        );



      return res
        .status(response.statusCode)
        .json(response);



    }

    catch(error){

      next(error);

    }


  }








  /**
   * GET /api/citizen/auth/me
   */
  async me(req,res,next){

    try {


      const response =
        await authService.me(
          req.user
        );



      return res
        .status(response.statusCode)
        .json(response);



    }

    catch(error){

      next(error);

    }


  }



}


export default new AuthController();