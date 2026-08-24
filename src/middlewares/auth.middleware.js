import jwt
  from "jsonwebtoken";

import {
  AUTH_MESSAGES,
} from "../modules/auth/auth.constants.js";


// =====================================================
// AUTH MIDDLEWARE
// =====================================================
//
// Expected:
//
// Authorization: Bearer <JWT>
//
// =====================================================

const authMiddleware = (
  req,
  res,
  next
) => {

  try {

    // =================================================
    // AUTHORIZATION HEADER
    // =================================================

    const authorization =
      req.headers.authorization;


    if (
      !authorization
    ) {

      return res.status(401).json({

        success: false,

        message:
          AUTH_MESSAGES.UNAUTHORIZED,

        data: null,

      });
    }


    // =================================================
    // BEARER
    // =================================================

    const parts =
      authorization.split(" ");


    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer" ||
      !parts[1]
    ) {

      return res.status(401).json({

        success: false,

        message:
          AUTH_MESSAGES.INVALID_TOKEN,

        data: null,

      });
    }


    const token =
      parts[1];


    // =================================================
    // JWT SECRET
    // =================================================

    const secret =
      process.env.JWT_SECRET;


    if (!secret) {

      console.error(
        "[Auth Middleware] JWT_SECRET is missing"
      );

      return res.status(500).json({

        success: false,

        message:
          AUTH_MESSAGES.INTERNAL_SERVER_ERROR,

        data: null,

      });
    }


    // =================================================
    // VERIFY
    // =================================================

    const decoded =
      jwt.verify(
        token,
        secret
      );


    // =================================================
    // ATTACH USER
    // =================================================

    req.user = decoded;


    next();

  } catch (error) {

    console.error(
      "[Auth Middleware] Token verification failed:",
      error.message
    );


    return res.status(401).json({

      success: false,

      message:
        AUTH_MESSAGES.INVALID_TOKEN,

      data: null,

    });
  }
};


export default authMiddleware;