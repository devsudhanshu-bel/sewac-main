import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import homeRoutes from "../modules/home/home.routes.js";
import statsRoutes from "../modules/stats/stats.routes.js";
import complaintRoutes from "../modules/complaint/complaint.routes.js";
import mapRoutes from "../modules/map/map.routes.js";

const router = Router();

/**
 * Citizen Authentication Routes
 */
router.use("/auth", authRoutes);

/**
 * Citizen Home Routes
 */
router.use("/home", homeRoutes);

/**
 * Citizen Statistics Routes
 */
router.use("/stats", statsRoutes);

/**
 * Citizen Complaint Routes
 */
router.use("/complaint", complaintRoutes);

/**
 * Citizen Live Map Routes
 */
router.use("/map", mapRoutes);

export default router;