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

    return res.status(201).json(
      new ApiResponse(
        201,
        "Complaint registered successfully.",
        complaint
      )
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
      req.user.phoneNumber
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Complaints fetched successfully.",
        complaints
      )
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

    return res.status(200).json(
      new ApiResponse(
        200,
        "Complaint details fetched successfully.",
        complaint
      )
    );
  } catch (error) {
    next(error);
  }
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

    return res.status(200).json(
      new ApiResponse(
        200,
        "Verification OTP generated successfully.",
        response
      )
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

    return res.status(200).json(
      new ApiResponse(
        200,
        "Complaint closed successfully.",
        response
      )
    );
  } catch (error) {
    next(error);
  }
};