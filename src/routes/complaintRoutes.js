const express = require("express");

const complaintController = require("../controllers/complaintController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/*
 * GET all complaints
 */
router.get("/", authMiddleware, complaintController.getComplaints);

/*
 * GET complaint KPIs
 *
 * IMPORTANT:
 * This must come BEFORE /:ticketNumber
 */
router.get("/kpis", authMiddleware, complaintController.getComplaintKPIs);

/*
 * GET complaint details
 */
router.get(
  "/:ticketNumber",
  authMiddleware,
  complaintController.getComplaintByTicket,
);

/*
 * Request verification OTP
 */
router.post(
  "/:ticketNumber/request-verification",
  authMiddleware,
  complaintController.requestVerification,
);

/*
 * Verify OTP
 */
router.post(
  "/:ticketNumber/verify",
  authMiddleware,
  complaintController.verifyOTP,
);

module.exports = router;
