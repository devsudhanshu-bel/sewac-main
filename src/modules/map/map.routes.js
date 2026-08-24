import { Router } from "express";

import mapController from "./map.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

// ==========================================================
// EXISTING NEAREST VEHICLE
// ==========================================================

router.get("/nearest", authMiddleware, mapController.getNearestTruck);

// ==========================================================
// EXISTING SPECIFIC VEHICLE
// ==========================================================

router.get("/truck/:vehicleId", authMiddleware, mapController.getTruck);

// ==========================================================
// NEW LIVE VEHICLE LOCATIONS
// ==========================================================

router.get("/live", authMiddleware, mapController.getLiveVehicleLocations);

export default router;
