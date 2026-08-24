import jwt
  from "jsonwebtoken";

import authRepository
  from "./auth.repository.js";

import {
  AUTH_MESSAGES,
} from "./auth.constants.js";


// =====================================================
// AUTH SERVICE
// =====================================================

class AuthService {

  // ===================================================
  // JWT SECRET
  // ===================================================

  getJwtSecret() {

    const secret =
      process.env.JWT_SECRET;

    if (!secret) {
      throw new Error(
        "JWT_SECRET is not configured"
      );
    }

    return secret;
  }


  // ===================================================
  // CREATE TOKEN
  // ===================================================

  createToken(
    citizen,
    deviceId
  ) {

    const payload = {

      sub:
        String(
          citizen.id
        ),

      phoneNumber:
        citizen.phoneNumber,

      wardId:
        citizen.wardId,

      wardNo:
        citizen.wardNo,

      wardName:
        citizen.wardName,

      deviceId:
        deviceId,

      role:
        "CITIZEN",
    };


    return jwt.sign(
      payload,
      this.getJwtSecret(),
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN ||
          "7d",
      }
    );
  }


  // ===================================================
  // LOGIN
  // ===================================================

  async login(
    phoneNumber,
    deviceId
  ) {

    // =================================================
    // FIND CITIZEN
    // =================================================

    const citizen =
      await authRepository
        .findCitizenByPhone(
          phoneNumber
        );


    // =================================================
    // PHONE NOT FOUND
    // =================================================

    if (!citizen) {

      return {

        statusCode: 404,

        success: false,

        message:
          AUTH_MESSAGES.CITIZEN_NOT_FOUND,

        data: {

          phoneNumber,

        },
      };
    }


    // =================================================
    // WARD NOT FOUND
    // =================================================

    if (
      !citizen.wardNo ||
      !citizen.wardTableName
    ) {

      return {

        statusCode: 404,

        success: false,

        message:
          AUTH_MESSAGES.WARD_NOT_FOUND,

        data: {

          phoneNumber,

          wardId:
            citizen.wardId,

          wardNo:
            citizen.wardNo,

          wardName:
            citizen.wardName,

          wardTableName:
            citizen.wardTableName,
        },
      };
    }


    // =================================================
    // PROFILE NOT FOUND
    // =================================================

    if (
      !citizen.profile
    ) {

      return {

        statusCode: 404,

        success: false,

        message:
          AUTH_MESSAGES.CITIZEN_PROFILE_NOT_FOUND,

        data: {

          phoneNumber,

          wardId:
            citizen.wardId,

          wardNo:
            citizen.wardNo,

          wardName:
            citizen.wardName,

          wardTableName:
            citizen.wardTableName,
        },
      };
    }


    // =================================================
    // CREATE JWT
    // =================================================

    const token =
      this.createToken(
        citizen,
        deviceId
      );


    // =================================================
    // SUCCESS
    // =================================================

    return {

      statusCode: 200,

      success: true,

      message:
        AUTH_MESSAGES.LOGIN_SUCCESS,

      data: {

        token,

        tokenType:
          "Bearer",

        expiresIn:
          process.env.JWT_EXPIRES_IN ||
          "7d",

        user: {

          id:
            citizen.id,

          personName:
            citizen.personName,

          phoneNumber:
            citizen.phoneNumber,

          role:
            "CITIZEN",

          ward: {

            wardId:
              citizen.wardId,

            wardNo:
              citizen.wardNo,

            wardName:
              citizen.wardName,

            wardTableName:
              citizen.wardTableName,
          },

          hierarchy:
            citizen.hierarchy,

          profile:
            citizen.profile,
        },

      },
    };
  }


  // ===================================================
  // CURRENT USER
  // ===================================================

  async me(
    user
  ) {

    if (!user) {

      return {

        statusCode: 401,

        success: false,

        message:
          AUTH_MESSAGES.UNAUTHORIZED,

        data: null,
      };
    }


    // =================================================
    // Re-read profile from DB.
    //
    // This means /me always gets the latest profile.
    // =================================================

    const citizen =
      await authRepository
        .findCitizenByPhone(
          user.phoneNumber
        );


    if (!citizen) {

      return {

        statusCode: 404,

        success: false,

        message:
          AUTH_MESSAGES.CITIZEN_NOT_FOUND,

        data: null,
      };
    }


    if (
      !citizen.profile
    ) {

      return {

        statusCode: 404,

        success: false,

        message:
          AUTH_MESSAGES.CITIZEN_PROFILE_NOT_FOUND,

        data: {

          phoneNumber:
            citizen.phoneNumber,

          wardId:
            citizen.wardId,

          wardNo:
            citizen.wardNo,

          wardName:
            citizen.wardName,

          wardTableName:
            citizen.wardTableName,
        },
      };
    }


    return {

      statusCode: 200,

      success: true,

      message:
        AUTH_MESSAGES.LOGIN_SUCCESS,

      data: {

        user: {

          id:
            citizen.id,

          personName:
            citizen.personName,

          phoneNumber:
            citizen.phoneNumber,

          role:
            "CITIZEN",

          ward: {

            wardId:
              citizen.wardId,

            wardNo:
              citizen.wardNo,

            wardName:
              citizen.wardName,

            wardTableName:
              citizen.wardTableName,
          },

          hierarchy:
            citizen.hierarchy,

          profile:
            citizen.profile,
        },
      },
    };
  }


  // ===================================================
  // LOGOUT
  // ===================================================

  async logout(
    user
  ) {

    return {

      statusCode: 200,

      success: true,

      message:
        AUTH_MESSAGES.LOGOUT_SUCCESS,

      data: null,
    };
  }
}


export default new AuthService();