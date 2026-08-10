import sewacPrisma from "../../config/sewacPrisma.js";

/**
 * Create complaint
 */
export const createComplaint = async (data) => {
  return await sewacPrisma.citizen_complaints.create({
    data,
  });
};

/**
 * Current complaints (not closed)
 */
export const getCurrentComplaints = async (phoneNumber) => {
  console.log("getCurrentComplaints called");
  return await sewacPrisma.citizen_complaints.findMany({
    where: {
      phone_number: phoneNumber,
      status: {
        not: "CLOSED",
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

/**
 * Previous complaints (closed)
 */
export const getPreviousComplaints = async (phoneNumber) => {
  return await sewacPrisma.citizen_complaints.findMany({
    where: {
      phone_number: phoneNumber,
      status: "CLOSED",
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

/**
 * Get complaint by ticket + owner
 */
export const getComplaintByTicket = async (ticketNumber, phoneNumber) => {
  return await sewacPrisma.citizen_complaints.findFirst({
    where: {
      ticket_number: ticketNumber,
      phone_number: phoneNumber,
    },
  });
};

/**
 * Get complaint by ticket only
 */
export const getComplaintByTicketOnly = async (ticketNumber) => {
  return await sewacPrisma.citizen_complaints.findUnique({
    where: {
      ticket_number: ticketNumber,
    },
  });
};

/**
 * Save verification OTP
 */
export const updateVerificationOTP = async (id, code, expiresAt) => {
  return await sewacPrisma.citizen_complaints.update({
    where: { id },
    data: {
      verification_code: code,
      verification_expires_at: expiresAt,
      otp_verified: false,
    },
  });
};

/**
 * Close complaint
 */
export const closeComplaint = async (id) => {
  return await sewacPrisma.citizen_complaints.update({
    where: { id },
    data: {
      status: "CLOSED",
      closed_at: new Date(),
      otp_verified: true,
      verification_code: null,
      verification_expires_at: null,
    },
  });
};
