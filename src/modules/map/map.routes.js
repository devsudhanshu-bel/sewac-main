import { Router } from "express";

import mapController from "./map.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/live",
  authMiddleware,
  mapController.getLiveMap
);

router.get(
  "/live/:vehicleId",
  authMiddleware,
  mapController.getTruck
);

export default router;