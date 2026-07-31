import jwt from "jsonwebtoken";

import redisService from "./redis.service.js";

import redisKeys from "./redis.keys.js";



class RedisAuthMiddleware {


  async verifyToken(req, res, next) {


    try {


      // ===============================
      // GET TOKEN
      // ===============================

      const authHeader =
        req.headers.authorization;



      if(!authHeader) {


        return res.status(401).json({

          success:false,

          message:"Authorization token missing"

        });


      }




      const token =
        authHeader.split(" ")[1];



      if(!token){


        return res.status(401).json({

          success:false,

          message:"Invalid token format"

        });


      }





      // ===============================
      // VERIFY JWT
      // ===============================


      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );





      const userId =
        decoded.id ||
        decoded.userId;





      if(!userId){


        return res.status(401).json({

          success:false,

          message:"Invalid token payload"

        });


      }





      // ===============================
      // CHECK REDIS
      // ===============================


      const redisKey =
        redisKeys.authToken(
          userId
        );



      const storedToken =
        await redisService.get(
          redisKey
        );





      if(!storedToken){


        return res.status(401).json({

          success:false,

          message:"Session expired. Please login again."

        });


      }





      // ===============================
      // TOKEN MATCH CHECK
      // ===============================


      if(storedToken !== token){


        return res.status(401).json({

          success:false,

          message:"Invalid session"

        });


      }





      // ===============================
      // ATTACH USER
      // ===============================


      req.user =
        decoded;



      next();



    }

    catch(error){


      return res.status(401).json({

        success:false,

        message:"Unauthorized",
        
        error:error.message

      });


    }


  }


}


export default new RedisAuthMiddleware();