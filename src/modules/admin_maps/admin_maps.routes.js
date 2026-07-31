import { Router } from "express";

import adminMapsController from "./admin_maps.controller.js";


const router = Router();





/**
 * GET /api/admin/maps/live
 *
 * Query Params:
 *
 * city
 * division
 * zone
 * ward
 *
 * Example:
 *
 * /api/admin/maps/live?
 * city=Bangalore&
 * division=Bengaluru South City Corporation&
 * zone=Bommanahalli&
 * ward=Ibbalur
 *
 */
router.get(
  "/live",
  adminMapsController.getLiveTrucks
);





export default router;