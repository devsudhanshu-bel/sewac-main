import {
  storeInternalVerificationOTP,
  verifyInternalOTPAndCloseComplaint,
} from "./complaint.service.js";

export const requestVerification = async (req, res, next) => {
  try {
    const { ticketNumber } = req.params;
    const { otp, expiresAt } = req.body;

    const result = await storeInternalVerificationOTP({
      ticketNumber,
      otp,
      expiresAt,
    });

    return res.status(200).json({
      success: true,
      message: "Verification OTP stored successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { ticketNumber } = req.params;
    const { otp } = req.body;

    const result = await verifyInternalOTPAndCloseComplaint({
      ticketNumber,
      otp,
    });

    return res.status(200).json({
      success: true,
      message: "Complaint closed successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
