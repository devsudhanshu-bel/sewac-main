// src/modules/complaint/complaint.controller.js

import * as complaintService from "./complaint.service.js";
import ApiResponse from "../../utils/apiResponse.js";

/**
 * Register a new complaint
 */
export const createComplaint = async (req, res, next) => {
  try {
    const complaint = await complaintService.createComplaint({
      body: req.body,
      file: req.file,
      user: req.user,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, "Complaint registered successfully.", complaint),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all complaints of the logged-in citizen
 */
export const getCitizenComplaints = async (req, res, next) => {
  try {
    const complaints = await complaintService.getCitizenComplaints(
      req.user.phoneNumber,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Complaints fetched successfully.", complaints),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Get complaint details
 */
export const getComplaintDetails = async (req, res, next) => {
  try {
    const complaint = await complaintService.getComplaintDetails({
      ticketNumber: req.params.ticketNumber,
      phoneNumber: req.user.phoneNumber,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Complaint details fetched successfully.",
          complaint,
        ),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Get verification OTP for the logged-in citizen
 */
export const getComplaintVerification = async ({
  ticketNumber,
  phoneNumber,
}) => {
  if (!ticketNumber) {
    throw new Error("Ticket number is required.");
  }

  if (!phoneNumber) {
    throw new Error("Phone number is required.");
  }

  const complaint = await repository.getComplaintByTicket(
    ticketNumber,
    phoneNumber,
  );

  if (!complaint) {
    throw new Error("Complaint not found.");
  }

  if (complaint.status !== "OTP_SENT") {
    throw new Error("Verification OTP is not available for this complaint.");
  }

  if (!complaint.verification_code) {
    throw new Error("No OTP has been generated for this complaint.");
  }

  if (
    !complaint.verification_expires_at ||
    complaint.verification_expires_at < new Date()
  ) {
    throw new Error("OTP has expired.");
  }

  return {
    ticketNumber: complaint.ticket_number,
    verificationCode: complaint.verification_code,
    expiresAt: complaint.verification_expires_at,
  };
};

/**
 * Generate verification OTP
 */
export const generateVerificationOTP = async (req, res, next) => {
  try {
    const response = await complaintService.generateVerificationOTP({
      ticketNumber: req.params.ticketNumber,
      phoneNumber: req.user.phoneNumber,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Verification OTP generated successfully.",
          response,
        ),
      );
  } catch (error) {
    next(error);
  }
};

/**
 * Verify OTP and close complaint
 * (Admin)
 */
export const verifyOTPAndCloseComplaint = async (req, res, next) => {
  try {
    const response = await complaintService.verifyOTPAndCloseComplaint({
      ticketNumber: req.params.ticketNumber,
      otp: req.body.otp,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Complaint closed successfully.", response));
  } catch (error) {
    next(error);
  }
};