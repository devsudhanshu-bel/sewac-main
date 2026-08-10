const complaintService = require("../services/complaintService");

exports.requestVerification = async (req, res) => {
  try {
    const { ticketNumber } = req.params;

    if (!ticketNumber) {
      return res.status(400).json({
        success: false,
        message: "Ticket number is required.",
      });
    }

    const result = await complaintService.requestVerification(
      ticketNumber,
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      message: "Verification OTP sent to the citizen.",
      data: result,
    });
  } catch (error) {
    console.error("Request verification error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to start verification.",
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { ticketNumber } = req.params;
    const { otp } = req.body;

    if (!ticketNumber) {
      return res.status(400).json({
        success: false,
        message: "Ticket number is required.",
      });
    }

    if (!otp || !/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        success: false,
        message: "A valid 6-digit OTP is required.",
      });
    }

    const result = await complaintService.verifyComplaintOTP(
      ticketNumber,
      String(otp),
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      message: "Complaint closed successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Verify complaint OTP error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to verify OTP.",
    });
  }
};
