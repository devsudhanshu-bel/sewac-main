const crypto = require("crypto");

const CITIZEN_API = process.env.SEWAC_API;

const INTERNAL_SECRET = process.env.CITIZEN_INTERNAL_API_SECRET;

const OTP_EXPIRY_MINUTES = 5;

function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

async function requestVerification(ticketNumber, adminId) {
  if (!CITIZEN_API) {
    throw new Error("SEWAC_API is not configured.");
  }

  if (!INTERNAL_SECRET) {
    throw new Error("CITIZEN_INTERNAL_API_SECRET is not configured.");
  }

  const otp = generateOTP();

  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
  ).toISOString();

  const response = await fetch(
    `${CITIZEN_API}/api/internal/complaints/${encodeURIComponent(ticketNumber)}/request-verification`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({
        otp,
        expiresAt,
        adminId,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok || data.success !== true) {
    throw new Error(
      data.message || data.error || "Unable to start complaint verification.",
    );
  }

  // IMPORTANT:
  // Never return the OTP to the admin frontend.
  return {
    ticketNumber,
    expiresAt,
    status: data.data?.status,
  };
}

async function verifyComplaintOTP(ticketNumber, otp, adminId) {
  if (!CITIZEN_API) {
    throw new Error("SEWAC_API is not configured.");
  }

  if (!INTERNAL_SECRET) {
    throw new Error("CITIZEN_INTERNAL_API_SECRET is not configured.");
  }

  const response = await fetch(
    `${CITIZEN_API}/api/internal/complaints/${encodeURIComponent(ticketNumber)}/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({
        otp,
        adminId,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok || data.success !== true) {
    throw new Error(data.message || data.error || "Invalid verification OTP.");
  }

  return data.data;
}

module.exports = {
  requestVerification,
  verifyComplaintOTP,
};
