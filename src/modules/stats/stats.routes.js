import {
  Router
} from "express";

import statsController
  from "./stats.controller.js";

import authMiddleware
  from "../../middlewares/auth.middleware.js";


const router =
  Router();


// =====================================================
// CITIZEN ANALYTICS
// =====================================================
//
// Final endpoint:
//
// GET
// /api/citizen/stats/analytics
//
// =====================================================

router.get(

  "/analytics",

  authMiddleware,

  statsController.getAnalytics

);


// =====================================================
// EXPORT
// =====================================================

export default router;