const express = require("express");

const complaintController = require("../controllers/complaintController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * POST /:ticketNumber/request-verification
 *
 * Admin requests OTP verification for a complaint.
 *
 * The controller:
 * - gets ticketNumber from params
 * - gets admin ID from req.user.id
 * - generates the OTP in the service
 * - sends/stores it through Citizen Backend
 */
router.post(
  "/:ticketNumber/request-verification",
  authMiddleware,
  complaintController.requestVerification,
);

/**
 * POST /:ticketNumber/verify
 *
 * Admin submits the OTP received from the citizen.
 *
 * The controller:
 * - gets ticketNumber from params
 * - gets OTP from req.body
 * - gets admin ID from req.user.id
 * - verifies OTP
 * - closes complaint
 */
router.post(
  "/:ticketNumber/verify",
  authMiddleware,
  complaintController.verifyOTP,
);

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Complaint routes are mounted.",
  });
});

module.exports = router;
