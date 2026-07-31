import { Router } from "express";
import multer from "multer";

import authMiddleware from "../../middlewares/auth.middleware.js";
import * as complaintController from "./complaint.controller.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Maximum 5 MB
  },
});

/**
 * POST /api/citizen/complaint
 * Register a new complaint
 */
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  complaintController.createComplaint
);

/**
 * GET /api/citizen/complaint
 * Fetch all complaints of the logged-in citizen
 */
router.get(
  "/",
  authMiddleware,
  complaintController.getCitizenComplaints
);

/**
 * GET /api/citizen/complaint/:ticketNumber
 * Fetch details of a specific complaint
 */
router.get(
  "/:ticketNumber",
  authMiddleware,
  complaintController.getComplaintDetails
);

/**
 * POST /api/citizen/complaint/:ticketNumber/generate-otp
 * Generate verification OTP
 */
router.post(
  "/:ticketNumber/generate-otp",
  authMiddleware,
  complaintController.generateVerificationOTP
);

/**
 * POST /api/citizen/complaint/:ticketNumber/verify-otp
 * Verify OTP and close complaint
 */
router.post(
  "/:ticketNumber/verify-otp",
  authMiddleware,
  complaintController.verifyOTPAndCloseComplaint
);

export default router;