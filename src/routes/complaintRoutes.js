const express = require("express");

const complaintController = require("../controllers/complaintController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

const checkPermission = require("../middlewares/checkPermission");

const checkActionPermission = require("../middlewares/checkActionPermission");

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
router.get("/kpis", authMiddleware, checkPermission("complaints"), complaintController.getComplaintKPIs);

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
  checkPermission("complaints"),
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
  checkPermission("complaints"),
  checkActionPermission("EDIT"),
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
  checkPermission("complaints"),
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
  checkPermission("complaints"),
  complaintController.verifyOTP,
);

module.exports = router;
