import {
  Router
} from "express";

import homeController
  from "./home.controller.js";

import authMiddleware
  from "../../middlewares/auth.middleware.js";


const router =
  Router();


router.get(
  "/today",
  authMiddleware,
  homeController.getTodayCollection
);


router.get(
  "/calendar",
  authMiddleware,
  homeController.getCalendar
);


export default router;