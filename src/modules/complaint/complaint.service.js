import * as repository from "./complaint.repository.js";
console.log("Repository exports:", Object.keys(repository));
console.log(repository);
import { validateComplaint } from "./complaint.validation.js";

import uploadImage from "../../utils/cloudinaryUpload.js";

import {
  TICKET_PREFIX,
  OTP_EXPIRY_MINUTES,
  OTP_LENGTH,
} from "./complaint.constants.js";

import generateOTP from "../../utils/generateOTP.js";

/**
 * Register a new complaint
 */
export const createComplaint = async ({ body, file, user }) => {
  validateComplaint(body);

  if (!user) {
    throw new Error("User authentication failed.");
  }

  const phoneNumber = user.phoneNumber;

  if (!phoneNumber) {
    throw new Error("Authenticated user's phone number is missing.");
  }

  let imageUrl = null;

  if (file) {
    const uploaded = await uploadImage(file, "complaints");
    imageUrl = uploaded.imageUrl;
  }

  const ticketNumber = `${TICKET_PREFIX}-${Date.now()}`;

  const complaintData = {
    ticket_number: ticketNumber,
    phone_number: phoneNumber,

    title: body.title,
    description: body.description,
    category: body.category,

    image_url: imageUrl,

    latitude: Number(body.latitude),
    longitude: Number(body.longitude),

    address: body.address,
  };

  return await repository.createComplaint(complaintData);
};

/**
 * Get all complaints of the logged-in citizen
 */
export const getCitizenComplaints = async (phoneNumber) => {
  if (!phoneNumber) {
    throw new Error("Phone number is required.");
  }

  const [current, previous] = await Promise.all([
    repository.getCurrentComplaints(phoneNumber),
    repository.getPreviousComplaints(phoneNumber),
  ]);

  return {
    current,
    previous,
  };
};

/**
 * Get complaint details
 */
export const getComplaintDetails = async ({ ticketNumber, phoneNumber }) => {
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

  return complaint;
};

/**
 * Generate verification OTP
 */
export const generateVerificationOTP = async ({
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

  if (complaint.status === "CLOSED") {
    throw new Error("This complaint has already been closed.");
  }

  const verificationCode = generateOTP(OTP_LENGTH);

  const verificationExpiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
  );

  await repository.updateVerificationOTP(
    complaint.id,
    verificationCode,
    verificationExpiresAt,
  );

  return {
    ticketNumber: complaint.ticket_number,
    otp: verificationCode,
    expiresIn: OTP_EXPIRY_MINUTES * 60,
    expiresAt: verificationExpiresAt,
  };
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
 * Verify OTP and close complaint
 */
export const verifyOTPAndCloseComplaint = async ({ ticketNumber, otp }) => {
  if (!ticketNumber) {
    throw new Error("Ticket number is required.");
  }

  if (!otp) {
    throw new Error("OTP is required.");
  }

  const complaint = await repository.getComplaintByTicketOnly(ticketNumber);

  if (!complaint) {
    throw new Error("Complaint not found.");
  }

  if (complaint.status === "CLOSED") {
    throw new Error("Complaint has already been closed.");
  }

  if (!complaint.verification_code) {
    throw new Error("No OTP has been generated for this complaint.");
  }

  if (complaint.verification_expires_at < new Date()) {
    throw new Error("OTP has expired.");
  }

  if (complaint.verification_code !== otp) {
    throw new Error("Invalid OTP.");
  }

  const closedComplaint = await repository.closeComplaint(complaint.id);

  return {
    ticketNumber: closedComplaint.ticket_number,
    status: closedComplaint.status,
    closedAt: closedComplaint.closed_at,
    message: "Complaint closed successfully.",
  };
};

export const internalAuth = (req, res, next) => {
  const expectedSecret = process.env.CITIZEN_INTERNAL_API_SECRET;

  const providedSecret = req.headers["x-internal-secret"];

  if (!expectedSecret) {
    console.error("CITIZEN_INTERNAL_API_SECRET is not configured.");

    return res.status(500).json({
      success: false,
      message: "Internal API is not configured.",
    });
  }

  if (!providedSecret || providedSecret !== expectedSecret) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized internal request.",
    });
  }

  next();
};

/**
 * Verify OTP received from Admin Backend
 * and close the complaint.
 */
/**
 * Verify OTP received from Admin Backend
 * and close the complaint.
 *
 * Flow:
 * OTP_SENT
 *   ↓
 * validate OTP
 *   ↓
 * validate expiry
 *   ↓
 * close complaint
 */
export const verifyInternalOTPAndCloseComplaint = async ({
  ticketNumber,
  otp,
}) => {
  if (!ticketNumber) {
    throw new Error("Ticket number is required.");
  }

  if (!otp) {
    throw new Error("OTP is required.");
  }

  const normalizedOtp = String(otp).trim();

  if (!/^\d{6}$/.test(normalizedOtp)) {
    throw new Error("OTP must be a 6-digit number.");
  }

  const complaint = await repository.getComplaintByTicketOnly(ticketNumber);

  if (!complaint) {
    throw new Error("Complaint not found.");
  }

  // Already closed
  if (complaint.status === "CLOSED") {
    throw new Error("Complaint has already been closed.");
  }

  // OTP must have been generated.
  // After generation the complaint is OTP_SENT.
  if (complaint.status !== "OTP_SENT") {
    throw new Error("Complaint does not have an active verification OTP.");
  }

  // Make sure an OTP exists.
  if (!complaint.verification_code) {
    throw new Error("No OTP has been generated for this complaint.");
  }

  // Make sure an expiry exists.
  if (!complaint.verification_expires_at) {
    throw new Error("OTP expiry information is missing.");
  }

  const expiry = new Date(complaint.verification_expires_at);

  if (Number.isNaN(expiry.getTime())) {
    throw new Error("OTP expiry information is invalid.");
  }

  // OTP expired
  if (expiry <= new Date()) {
    throw new Error("OTP has expired. Please request a new OTP.");
  }

  // OTP does not match
  if (String(complaint.verification_code) !== normalizedOtp) {
    throw new Error("Invalid OTP.");
  }

  // OTP is correct → close complaint
  const closedComplaint = await repository.closeComplaint(complaint.id);

  return {
    ticketNumber: closedComplaint.ticket_number,

    status: closedComplaint.status,

    closedAt: closedComplaint.closed_at,

    message: "Complaint closed successfully.",
  };
};

/**
 * Store / replace a verification OTP.
 *
 * Allowed states:
 *
 * READY_FOR_VERIFICATION
 *   → first OTP
 *
 * OTP_SENT + expired
 *   → resend OTP
 */
export const storeInternalVerificationOTP = async ({
  ticketNumber,
  otp,
  expiresAt,
}) => {
  if (!ticketNumber) {
    throw new Error("Ticket number is required.");
  }

  if (!otp) {
    throw new Error("OTP is required.");
  }

  if (!expiresAt) {
    throw new Error("OTP expiry is required.");
  }

  const normalizedOtp = String(otp).trim();

  if (!/^\d{6}$/.test(normalizedOtp)) {
    throw new Error("OTP must be a 6-digit number.");
  }

  const complaint = await repository.getComplaintByTicketOnly(ticketNumber);

  if (!complaint) {
    throw new Error("Complaint not found.");
  }

  if (complaint.status === "CLOSED") {
    throw new Error("This complaint has already been closed.");
  }

  /*
   * FIRST OTP
   *
   * READY_FOR_VERIFICATION
   * → allow OTP generation
   */
  if (complaint.status === "READY_FOR_VERIFICATION") {
    // Allowed.
  } else if (complaint.status === "OTP_SENT") {

  /*
   * RESEND OTP
   *
   * OTP_SENT
   * → only allow replacement if old OTP expired
   */
    if (!complaint.verification_expires_at) {
      throw new Error("Existing OTP has no expiry information.");
    }

    const existingExpiry = new Date(complaint.verification_expires_at);

    if (Number.isNaN(existingExpiry.getTime())) {
      throw new Error("Existing OTP expiry information is invalid.");
    }

    // Old OTP is still valid.
    if (existingExpiry > new Date()) {
      throw new Error(
        "Current OTP is still valid. Please wait until it expires before requesting a new OTP.",
      );
    }

    // Old OTP has expired → resend allowed.
  } else {

  /*
   * Any other status is invalid.
   */
    throw new Error(
      "Verification OTP can only be requested when the complaint is ready for verification or the previous OTP has expired.",
    );
  }

  const verificationExpiresAt = new Date(expiresAt);

  if (Number.isNaN(verificationExpiresAt.getTime())) {
    throw new Error("Invalid OTP expiry time.");
  }

  if (verificationExpiresAt <= new Date()) {
    throw new Error("OTP expiry time must be in the future.");
  }

  /*
   * Save the new OTP.
   *
   * IMPORTANT:
   * updateVerificationOTP() should set
   * status = OTP_SENT.
   */
  await repository.updateVerificationOTP(
    complaint.id,
    normalizedOtp,
    verificationExpiresAt,
  );

  return {
    ticketNumber: complaint.ticket_number,

    status: "OTP_SENT",

    expiresAt: verificationExpiresAt,
  };
};
