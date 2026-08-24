import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import homeRoutes from "../modules/home/home.routes.js";
import statsRoutes from "../modules/stats/stats.routes.js";
import complaintRoutes from "../modules/complaint/complaint.routes.js";
import mapRoutes from "../modules/map/map.routes.js";

import adminComplaintsRoutes
  from "../modules/admin_complaints/admin_complaints.routes.js";


const router = Router();


// =====================================================
// CITIZEN ROUTES
// =====================================================


// =====================================================
// CITIZEN AUTHENTICATION
// =====================================================
//
// /api/citizen/auth/*
//
// Examples:
//
// POST /api/citizen/auth/login
// GET  /api/citizen/auth/me
// POST /api/citizen/auth/logout
//
// =====================================================

router.use(
  "/auth",
  authRoutes
);


// =====================================================
// CITIZEN HOME
// =====================================================
//
// /api/citizen/home/*
//
// =====================================================

router.use(
  "/home",
  homeRoutes
);


// =====================================================
// CITIZEN STATISTICS
// =====================================================
//
// /api/citizen/stats/*
//
// =====================================================

router.use(
  "/citizen/stats",
  statsRoutes
);


// =====================================================
// CITIZEN COMPLAINTS
// =====================================================
//
// /api/citizen/complaint/*
//
// =====================================================

router.use(
  "/citizen/complaint",
  complaintRoutes
);


// =====================================================
// CITIZEN LIVE MAP
// =====================================================
//
// /api/citizen/map/*
//
// =====================================================

router.use(
  "/citizen/map",
  mapRoutes
);


// =====================================================
// ADMIN ROUTES
// =====================================================
//
// Only Admin Complaints remain.
//
// Admin Maps has been completely removed.
//
// =====================================================


// =====================================================
// ADMIN COMPLAINTS
// =====================================================
//
// /api/admin/*
//
// =====================================================
//
// Existing routes provided by:
// admin_complaints.routes.js
//
// =====================================================

router.use(
  "/admin",
  adminComplaintsRoutes
);


// =====================================================
// EXPORT
// =====================================================

export default router;