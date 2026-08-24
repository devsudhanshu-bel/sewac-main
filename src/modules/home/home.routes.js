import {
  Router
} from "express";

import homeController
  from "./home.controller.js";

import authMiddleware
  from "../../middlewares/auth.middleware.js";


const router =
  Router();


// =====================================================
// TODAY'S COLLECTION
// =====================================================

router.get(

  "/today",

  authMiddleware,

  homeController
    .getTodayCollection

);


// =====================================================
// MONTHLY CALENDAR
// =====================================================
//
// Example:
//
// GET
// /api/citizen/home/calendar?year=2026&month=8
//
// =====================================================

router.get(

  "/calendar",

  authMiddleware,

  homeController
    .getCalendar

);


export default router;