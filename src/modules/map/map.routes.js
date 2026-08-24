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
router.get("/nearest", authMiddleware, mapController.getNearestTruck);

/**
 * Get specific truck details
 *
 * GET /api/citizen/map/truck/:vehicleId
 */
router.get("/truck/:vehicleId", authMiddleware, mapController.getTruck);

/**
 * Get live vehicle locations
 *
 * IMPORTANT:
 * This route is mounted separately in app.js
 * under /api/route-map
 *
 * Final URL:
 *
 * GET /api/route-map/live
 */
router.get("/live", authMiddleware, mapController.getLiveVehicleLocations);

export default router;
