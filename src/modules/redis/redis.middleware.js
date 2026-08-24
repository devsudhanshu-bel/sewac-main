import jwt from "jsonwebtoken";

import redisService
  from "../modules/redis/redis.service.js";

import redisKeys
  from "../modules/redis/redis.keys.js";


// =====================================================
// AUTH MIDDLEWARE
// =====================================================

class AuthMiddleware {

  async verifyToken(
    req,
    res,
    next
  ) {

    try {

      // ===============================================
      // AUTHORIZATION HEADER
      // ===============================================

      const authHeader =
        req.headers.authorization;

      if (!authHeader) {

        return res.status(401).json({

          success: false,

          message:
            "Authorization token missing",

          data: null,

        });

      }


      // ===============================================
      // BEARER TOKEN
      // ===============================================

      const parts =
        authHeader.split(" ");

      if (
        parts.length !== 2 ||
        parts[0] !== "Bearer"
      ) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid authorization format",

          data: null,

        });

      }


      const token =
        parts[1];


      // ===============================================
      // VERIFY JWT
      // ===============================================

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );


      // ===============================================
      // REQUIRED PAYLOAD
      // ===============================================

      const userId =
        decoded.id ||
        decoded.userId;

      const deviceId =
        decoded.deviceId;

      const phoneNumber =
        decoded.phoneNumber;


      if (!userId) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid token payload",

          data: null,

        });

      }


      if (!deviceId) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid token: device ID missing",

          data: null,

        });

      }


      // ===============================================
      // REDIS SESSION KEY
      // ===============================================

      const redisKey =
        redisKeys.authToken(
          userId,
          deviceId
        );


      // ===============================================
      // GET STORED TOKEN
      // ===============================================

      const storedToken =
        await redisService.get(
          redisKey
        );


      if (!storedToken) {

        return res.status(401).json({

          success: false,

          message:
            "Session expired. Please login again.",

          data: null,

        });

      }


      // ===============================================
      // TOKEN MATCH
      // ===============================================

      if (
        storedToken !== token
      ) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid session",

          data: null,

        });

      }


      // ===============================================
      // ATTACH USER
      // ===============================================

      req.user = {

        id: userId,

        deviceId,

        phoneNumber,

        ...decoded,

      };


      // ===============================================
      // CONTINUE
      // ===============================================

      next();

    } catch (error) {

      console.error(
        "Auth Middleware Error:",
        error.message
      );

      return res.status(401).json({

        success: false,

        message:
          "Unauthorized",

        data: null,

      });

    }

  }

}


// =====================================================
// EXPORT
// =====================================================

const authMiddleware =
  new AuthMiddleware();

export default
  authMiddleware.verifyToken.bind(
    authMiddleware
  );