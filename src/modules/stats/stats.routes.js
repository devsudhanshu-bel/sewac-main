import express from "express";

import statsController from "./stats.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/analytics",
  authMiddleware,
  statsController.getAnalytics
);

export default router;