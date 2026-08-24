import { Router } from "express";

import adminComplaintsController from "./admin_complaints.controller.js";


const router = Router();




/**
 * GET /api/admin/all-complaints
 *
 * Query:
 *
 * status
 * category
 *
 */
router.get(
  "/all-complaints",
  adminComplaintsController.getAllComplaints
);



export default router;