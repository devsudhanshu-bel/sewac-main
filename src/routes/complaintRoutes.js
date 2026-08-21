const express = require("express");

const complaintController = require("../controllers/complaintController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/*
 * =========================================================
 * GET ALL COMPLAINTS
 * =========================================================
 *
 * GET /api/complaints
 *
 * Query:
 *
 * ?page=1
 * &limit=10
 * &search=
 * &status=
 * &category=
 *
 */
router.get("/", authMiddleware, complaintController.getComplaints);

/*
 * =========================================================
 * GET COMPLAINT KPIs
 * =========================================================
 *
 * IMPORTANT:
 *
 * /kpis must come before /:ticketNumber
 *
 */
router.get("/kpis", authMiddleware, complaintController.getComplaintKPIs);

/*
 * =========================================================
 * GET SINGLE COMPLAINT
 * =========================================================
 *
 * GET /api/complaints/:ticketNumber
 *
 */
router.get(
  "/:ticketNumber",
  authMiddleware,
  complaintController.getComplaintByTicket,
);

/*
 * =========================================================
 * UPDATE COMPLAINT
 * =========================================================
 *
 * PATCH /api/complaints/:ticketNumber
 *
 * Allowed:
 *
 * status
 * assigned_to
 * remarks
 *
 */
router.patch(
  "/:ticketNumber",
  authMiddleware,
  complaintController.updateComplaint,
);

/*
 * =========================================================
 * REQUEST VERIFICATION OTP
 * =========================================================
 *
 * POST /api/complaints/:ticketNumber/request-verification
 *
 * Only allowed when current status is:
 *
 * READY_FOR_VERIFICATION
 *
 */
router.post(
  "/:ticketNumber/request-verification",
  authMiddleware,
  complaintController.requestVerification,
);

/*
 * =========================================================
 * VERIFY OTP
 * =========================================================
 *
 * POST /api/complaints/:ticketNumber/verify
 *
 */
router.post(
  "/:ticketNumber/verify",
  authMiddleware,
  complaintController.verifyOTP,
);

module.exports = router;
