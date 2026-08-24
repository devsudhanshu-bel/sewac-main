import {
  Router,
} from "express";

import authController
  from "./auth.controller.js";

import authMiddleware
  from "../../middlewares/auth.middleware.js";


const router =
  Router();


// =====================================================
// LOGIN
// =====================================================

router.post(

  "/login",

  authController
    .login
    .bind(
      authController
    )

);


// =====================================================
// CURRENT USER
// =====================================================

router.get(

  "/me",

  authMiddleware,

  authController
    .me
    .bind(
      authController
    )

);


// =====================================================
// LOGOUT
// =====================================================

router.post(

  "/logout",

  authMiddleware,

  authController
    .logout
    .bind(
      authController
    )

);


export default router;