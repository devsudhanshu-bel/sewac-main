import {
  Router
} from "express";


import authRoutes
  from "../modules/auth/auth.routes.js";

import homeRoutes
  from "../modules/home/home.routes.js";

import statsRoutes
  from "../modules/stats/stats.routes.js";

import complaintRoutes
  from "../modules/complaint/complaint.routes.js";

import mapRoutes
  from "../modules/map/map.routes.js";

import adminComplaintsRoutes
  from "../modules/admin_complaints/admin_complaints.routes.js";


const router =
  Router();


// =====================================================
// AUTH
// =====================================================

router.use(
  "/auth",
  authRoutes
);


// =====================================================
// HOME
// =====================================================

router.use(
  "/home",
  homeRoutes
);


// =====================================================
// STATS
// =====================================================
//
// Final:
//
// /api/citizen/stats/analytics
//
// =====================================================

router.use(
  "/stats",
  statsRoutes
);


// =====================================================
// COMPLAINT
// =====================================================

router.use(
  "/complaint",
  complaintRoutes
);


// =====================================================
// MAP
// =====================================================

router.use(
  "/map",
  mapRoutes
);


// =====================================================
// ADMIN COMPLAINTS
// =====================================================
//
// Because this router is mounted at:
//
// /api/citizen
//
// this becomes:
//
// /api/citizen/admin/*
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