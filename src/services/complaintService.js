const crypto = require("crypto");

console.log("🔥🔥🔥 ADMIN complaintService.js LOADED 🔥🔥🔥");

const CITIZEN_API = process.env.SEWAC_API;

const INTERNAL_SECRET = process.env.CITIZEN_INTERNAL_API_SECRET;

const OTP_EXPIRY_MINUTES = 5;

const complaintRepository = require("../repositories/complaintRepository");

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
  console.log("========== CITIZEN VERIFICATION DEBUG ==========");
  console.log("CITIZEN_API:", CITIZEN_API);
  console.log(
    "URL:",
    `${CITIZEN_API}/api/internal/complaints/${encodeURIComponent(
      ticketNumber,
    )}/request-verification`,
  );
  console.log("HAS SECRET:", Boolean(INTERNAL_SECRET));
  console.log("TICKET:", ticketNumber);
  console.log("ADMIN ID:", adminId);
  console.log("===============================================");

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

async function getComplaints({
  page = 1,
  limit = 10,
  search = "",
  status,
  category,
}) {
  page = Math.max(Number(page) || 1, 1);
  limit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const result = await complaintRepository.getComplaints({
    page,
    limit,
    search,
    status,
    category,
  });

  return {
    items: result.items,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    },
  };
}

async function getComplaintByTicket(ticketNumber) {
  if (!ticketNumber) {
    throw new Error("Ticket number is required.");
  }

  const complaint =
    await complaintRepository.getComplaintByTicket(ticketNumber);

  if (!complaint) {
    throw new Error("Complaint not found.");
  }

  return complaint;
}

async function getComplaintKPIs() {
  return complaintRepository.getComplaintKPIs();
}

module.exports = {
  requestVerification,
  verifyComplaintOTP,
  getComplaints,
  getComplaintByTicket,
  getComplaintKPIs,
};
