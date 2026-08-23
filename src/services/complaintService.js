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

  if (complaint.status !== "READY_FOR_VERIFICATION") {
    throw new Error(
      "Verification OTP can only be requested when the complaint is ready for verification.",
    );
  }

  const otp = generateOTP();

  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
  ).toISOString();

  const citizenUrl =
    `${CITIZEN_API}/api/internal/complaints/` +
    `${encodeURIComponent(ticketNumber)}/request-verification`;

  console.log("========== CITIZEN VERIFICATION DEBUG ==========");

  console.log("CITIZEN_API:", CITIZEN_API);

  console.log("URL:", citizenUrl);

  console.log("HAS SECRET:", Boolean(INTERNAL_SECRET));

  console.log("TICKET:", ticketNumber);

  console.log("ADMIN ID:", adminId);

  /*
   * DO NOT LOG THE ACTUAL OTP.
   *
   * We deliberately do not print:
   *
   * console.log(otp)
   *
   * because the OTP must never be exposed
   * through Admin logs.
   */

  console.log("OTP GENERATED:", Boolean(otp));

  console.log("OTP EXPIRY:", expiresAt);

  console.log("===============================================");

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

  /**
   * =======================================================
   * CAPTURE CITIZEN RESPONSE
   * =======================================================
   *
   * THIS IS THE IMPORTANT DEBUG SECTION.
   *
   * We need to know exactly what Citizen sends
   * back to the Admin backend.
   */

  const responseContentType = response.headers.get("content-type") || "";

  const responseHeaders = Object.fromEntries(response.headers.entries());

  let responseText = "";

  try {
    responseText = await response.text();
  } catch (readError) {
    console.error("Unable to read Citizen response body:", readError);
  }

  console.log("========== CITIZEN RESPONSE DEBUG ==========");

  console.log("STATUS:", response.status);

  console.log("STATUS TEXT:", response.statusText);

  console.log("CONTENT TYPE:", responseContentType);

  console.log("BODY:", responseText);

  /*
   * Safe response headers only.
   *
   * We are NOT logging X-Internal-Secret.
   */

  console.log("HEADERS:", responseHeaders);

  console.log("============================================");

  /**
   * =======================================================
   * PARSE RESPONSE
   * =======================================================
   */

  let data;

  if (responseContentType.includes("application/json")) {
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error("Citizen returned invalid JSON:", parseError);

      data = {
        success: false,
        message: responseText || "Citizen returned invalid JSON.",
      };
    }
  } else {
    data = {
      success: false,
      message: responseText || "Unable to start complaint verification.",
    };
  }

  /**
   * =======================================================
   * HANDLE CITIZEN ERROR
   * =======================================================
   */

  if (!response.ok || data.success !== true) {
    const error = new Error(
      data.message ||
        data.error ||
        `Citizen verification request failed with status ${response.status}.`,
    );

    error.statusCode = response.status;

    /*
     * Extra information for debugging.
     *
     * This does NOT expose the OTP.
     */

    console.error("========== CITIZEN VERIFICATION ERROR ==========");

    console.error("STATUS:", response.status);

    console.error("MESSAGE:", error.message);

    console.error("===============================================");

    throw error;
  }

  /**
   * =======================================================
   * SUCCESS
   * =======================================================
   *
   * IMPORTANT:
   *
   * OTP is NEVER returned to Admin frontend.
   */

  console.log("========== CITIZEN VERIFICATION SUCCESS ==========");

  console.log("TICKET:", ticketNumber);

  console.log("STATUS:", data.data?.status);

  console.log("OTP EXPOSED TO ADMIN:", false);

  console.log("==================================================");

  return {
    ticketNumber,
    expiresAt,
    status: data.data?.status,
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
