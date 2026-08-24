import authService
  from "./auth.service.js";

import {
  validateLogin,
} from "./auth.validation.js";


class AuthController {


  // ===================================================
  // LOGIN
  // ===================================================

  async login(
    req,
    res,
    next
  ) {

    try {

      const {
        phoneNumber,
        deviceId,
      } = req.body;


      const validation =
        validateLogin(
          phoneNumber,
          deviceId
        );


      if (
        !validation.valid
      ) {

        return res
          .status(400)
          .json({

            success: false,

            message:
              validation.message,

          });

      }


      const response =
        await authService.login(

          phoneNumber,

          deviceId

        );


      return res
        .status(
          response.statusCode
        )
        .json(
          response
        );

    } catch (
      error
    ) {

      next(error);

    }

  }


  // ===================================================
  // LOGOUT
  // ===================================================

  async logout(
    req,
    res,
    next
  ) {

    try {

      const response =
        await authService.logout(
          req.user
        );


      return res
        .status(
          response.statusCode
        )
        .json(
          response
        );

    } catch (
      error
    ) {

      next(error);

    }

  }


  // ===================================================
  // CURRENT USER
  // ===================================================

  async me(
    req,
    res,
    next
  ) {

    try {

      const response =
        await authService.me(
          req.user
        );


      return res
        .status(
          response.statusCode
        )
        .json(
          response
        );

    } catch (
      error
    ) {

      next(error);

    }

  }

}


export default new AuthController();