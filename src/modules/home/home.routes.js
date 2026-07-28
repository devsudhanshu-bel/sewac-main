import { Router } from "express";
import homeController from "./home.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

/**
 * Today's Collection
 * GET /api/citizen/home/today
 */
router.get(
  "/today",
  authMiddleware,
  homeController.getTodayCollection
);

/**
 * Monthly Calendar
 * Query Params:
 * ?year=2026&month=7
 *
 * Response:
 * - Dry Collection Stats
 * - Wet Collection Stats
 * - Monthly Calendar
 * - Streak
 */
router.get(
  "/calendar",
  authMiddleware,
  homeController.getCalendar
);

export default router;