import authRepository from "./auth.repository.js";

import { AUTH_MESSAGES } from "./auth.constants.js";

import { maskName } from "../../utils/string.utils.js";

import { generateToken } from "../../utils/jwt.js";

import redisService from "../redis/redis.service.js";

import redisKeys from "../redis/redis.keys.js";



class AuthService {


  /**
   * Login using phone number
   */
  async login(phoneNumber) {


    const citizen =
      await authRepository.findCitizenByPhone(
        phoneNumber
      );



    if(!citizen){


      return {

        success:false,

        statusCode:404,

        message:
          AUTH_MESSAGES.CITIZEN_NOT_FOUND,

        data:null,

      };


    }





    // ===============================
    // GENERATE JWT
    // ===============================


    const token =
      generateToken({

        id: citizen.id,

        phoneNumber:
          citizen.phoneNumber,

      });







    // ===============================
    // STORE TOKEN IN REDIS
    // ===============================


    await redisService.set(

      redisKeys.authToken(
        citizen.id
      ),

      token,

      86400 // 24 hours

    );






    return {

      success:true,

      statusCode:200,

      message:
        AUTH_MESSAGES.LOGIN_SUCCESS,


      data:{


        token,


        citizen:{


          id:
            citizen.id,


          personName:
            maskName(
              citizen.personName
            ),


          phoneNumber:
            citizen.phoneNumber,


          drySlno:
            citizen.drySlno,


          wetSlno:
            citizen.wetSlno,


        },


      },


    };


  }








  /**
   * Logout
   * Removes JWT session from Redis
   */
  async logout(user) {


    if(user?.id){


      await redisService.delete(

        redisKeys.authToken(
          user.id
        )

      );


    }





    return {


      success:true,


      statusCode:200,


      message:
        AUTH_MESSAGES.LOGOUT_SUCCESS,


      data:null,


    };


  }









  /**
   * Get logged-in citizen
   */
  async me(user) {


    const citizen =
      await authRepository.findCitizenByPhone(

        user.phoneNumber

      );





    if(!citizen){


      return {


        success:false,


        statusCode:404,


        message:
          AUTH_MESSAGES.CITIZEN_NOT_FOUND,


        data:null,


      };


    }






    return {


      success:true,


      statusCode:200,


      message:
        AUTH_MESSAGES.LOGIN_SUCCESS,


      data:{


        citizen:{


          id:
            citizen.id,


          personName:
            maskName(
              citizen.personName
            ),


          phoneNumber:
            citizen.phoneNumber,


          drySlno:
            citizen.drySlno,


          wetSlno:
            citizen.wetSlno,


        },


      },


    };


  }



}



export default new AuthService();