const crypto = require("crypto");

console.log("🔥🔥🔥 ADMIN complaintService.js LOADED 🔥🔥🔥");

const CITIZEN_API = process.env.CITIZEN_API;
const INTERNAL_SECRET = process.env.CITIZEN_INTERNAL_API_SECRET;

const OTP_EXPIRY_MINUTES = 5;

const complaintRepository = require("../repositories/complaintRepository");

/**
 * =========================================================
 * INTERNAL HELPERS
 * =========================================================
 */

function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * =========================================================
 * REQUEST VERIFICATION
 * =========================================================
 */
async function requestVerification(ticketNumber, adminId) {
  if (!CITIZEN_API) {
    throw new Error("CITIZEN_API is not configured.");
  }

  if (!INTERNAL_SECRET) {
    throw new Error("CITIZEN_INTERNAL_API_SECRET is not configured.");
  }

  const complaint =
    await complaintRepository.getComplaintByTicket(ticketNumber);

  if (!complaint) {
    throw new Error("Complaint not found.");
  }

  if (complaint.status === "CLOSED") {
    throw new Error(
      "Verification OTP cannot be requested for a closed complaint.",
    );
  }

  /*
   * OTP can be requested when:
   *
   * 1. Complaint is READY_FOR_VERIFICATION
   *    -> first OTP
   *
   * 2. Complaint is OTP_SENT and the previous OTP has expired
   *    -> resend/new OTP
   */

  if (complaint.status === "READY_FOR_VERIFICATION") {
    // First OTP request - allowed
  } else if (complaint.status === "OTP_SENT") {
    if (!complaint.verification_expires_at) {
      throw new Error("Existing OTP has no expiry information.");
    }

    const expiry = new Date(complaint.verification_expires_at);

    if (Number.isNaN(expiry.getTime())) {
      throw new Error("Existing OTP has an invalid expiry time.");
    }

    if (expiry > new Date()) {
      throw new Error(
        "Current OTP is still valid. Please wait until it expires before requesting a new OTP.",
      );
    }

    // Existing OTP has expired.
    // A new OTP will be generated below.
  } else {
    throw new Error(
      "Verification OTP can only be requested when the complaint is ready for verification or the previous OTP has expired.",
    );
  }

  const otp = generateOTP();

  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
  ).toISOString();

  const citizenUrl =
    `${CITIZEN_API}/api/internal/complaints/` +
    `${encodeURIComponent(ticketNumber)}/request-verification`;

  console.log("========== CITIZEN VERIFICATION ==========");
  console.log("CITIZEN_API:", CITIZEN_API);
  console.log("URL:", citizenUrl);
  console.log("HAS SECRET:", Boolean(INTERNAL_SECRET));
  console.log("TICKET:", ticketNumber);
  console.log("ADMIN ID:", adminId);
  console.log("OTP GENERATED:", Boolean(otp));
  console.log("OTP EXPIRY:", expiresAt);
  console.log("==========================================");

  let response;

  try {
    response = await fetch(citizenUrl, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": INTERNAL_SECRET,
        Accept: "application/json",
      },

      body: JSON.stringify({
        otp,
        expiresAt,
        adminId,
      }),
    });
  } catch (fetchError) {
    console.error("========== CITIZEN FETCH FAILED ==========");

    console.error("Error:", fetchError);
    console.error("Message:", fetchError?.message);

    console.error("==========================================");

    throw fetchError;
  }

  let data;

  try {
    data = await response.json();
  } catch (_) {
    throw new Error(
      `Citizen backend returned an invalid response (${response.status}).`,
    );
  }

  if (!response.ok || data.success !== true) {
    throw new Error(
      data.message || data.error || "Unable to generate verification OTP.",
    );
  }

  // NEVER return the OTP to Admin frontend.
  return {
    ticketNumber,
    expiresAt,
    status: "OTP_SENT",
    resent: complaint.status === "OTP_SENT",
  };
}

/**
 * =========================================================
 * VERIFY OTP
 * =========================================================
 */
async function verifyComplaintOTP(ticketNumber, otp, adminId) {
  if (!CITIZEN_API) {
    throw new Error("CITIZEN_API is not configured.");
  }

  if (!INTERNAL_SECRET) {
    throw new Error("CITIZEN_INTERNAL_API_SECRET is not configured.");
  }

  const response = await fetch(
    `${CITIZEN_API}/api/internal/complaints/${encodeURIComponent(
      ticketNumber,
    )}/verify`,
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

  const contentType = response.headers.get("content-type") || "";

  const responseText = await response.text();

  let data;

  if (contentType.includes("application/json")) {
    try {
      data = JSON.parse(responseText);
    } catch {
      data = {
        success: false,
        message: responseText || "Invalid response from citizen backend.",
      };
    }
  } else {
    data = {
      success: false,
      message: responseText || "Invalid response from citizen backend.",
    };
  }

  if (!response.ok || data.success !== true) {
    const error = new Error(
      data.message || data.error || "Invalid verification OTP.",
    );

    error.statusCode = response.status;

    throw error;
  }

  return data.data;
}

/**
 * =========================================================
 * GET COMPLAINTS
 * =========================================================
 */
async function getComplaints({
  page = 1,
  limit = 10,
  search = "",
  status,
  category,
  dateFrom,
  dateTo,
}) {
  page = Math.max(Number(page) || 1, 1);

  limit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const result = await complaintRepository.getComplaints({
    page,
    limit,
    search,
    status,
    category,
    dateFrom,
    dateTo,
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

/**
 * =========================================================
 * GET SINGLE COMPLAINT
 * =========================================================
 */
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

/**
 * =========================================================
 * UPDATE COMPLAINT
 * =========================================================
 */
async function updateComplaint(ticketNumber, updates) {
  const complaint =
    await complaintRepository.getComplaintByTicket(ticketNumber);

  if (!complaint) {
    throw new Error("Complaint not found.");
  }

  const { status, assigned_to, remarks } = updates;

  if (
    status === undefined &&
    assigned_to === undefined &&
    remarks === undefined
  ) {
    throw new Error("No complaint changes were provided.");
  }

  if (status !== undefined) {
    if (status !== "PENDING" && status !== "READY_FOR_VERIFICATION") {
      throw new Error("Invalid admin complaint status.");
    }

    if (status === complaint.status) {
      // Allowed.
    } else if (
      complaint.status === "PENDING" &&
      status === "READY_FOR_VERIFICATION"
    ) {
      // Allowed.
    } else {
      throw new Error(
        `Invalid complaint status transition: ${complaint.status} → ${status}.`,
      );
    }
  }

  if (
    complaint.status === "CLOSED" &&
    status !== undefined &&
    status !== complaint.status
  ) {
    throw new Error("Closed complaints cannot have their status changed.");
  }

  const result = await complaintRepository.updateComplaint(ticketNumber, {
    ...(status !== undefined && {
      status,
    }),

    ...(assigned_to !== undefined && {
      assigned_to: assigned_to === "" ? null : assigned_to,
    }),

    ...(remarks !== undefined && {
      remarks: remarks === "" ? null : remarks,
    }),
  });

  return result;
}

/**
 * =========================================================
 * KPI
 * =========================================================
 */
async function getComplaintKPIs() {
  return complaintRepository.getComplaintKPIs();
}

module.exports = {
  requestVerification,
  verifyComplaintOTP,
  getComplaints,
  getComplaintByTicket,
  updateComplaint,
  getComplaintKPIs,
};
