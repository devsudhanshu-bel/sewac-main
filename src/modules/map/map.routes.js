import { Router } from "express";

import mapController from "./map.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

/**
 * Get nearest truck for citizen
 *
 * GET /api/citizen/map/nearest
 *
 * Query:
 * latitude
 * longitude
 */
router.get(
  "/nearest",
  authMiddleware,
  mapController.getNearestTruck
);


/**
 * Get specific truck details
 * Mainly for debugging/admin use
 */
router.get(
  "/truck/:vehicleId",
  authMiddleware,
  mapController.getTruck
);


export default router;