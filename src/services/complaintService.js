const crypto = require("crypto");

console.log("🔥🔥🔥 ADMIN complaintService.js LOADED 🔥🔥🔥");

const CITIZEN_API = process.env.SEWAC_API;

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
 *
 * OTP can ONLY be requested when the complaint is:
 *
 * READY_FOR_VERIFICATION
 *
 * This prevents:
 *
 * PENDING → OTP
 * ASSIGNED → OTP
 * IN_PROGRESS → OTP
 * CLOSED → OTP
 */
async function requestVerification(ticketNumber, adminId) {
  if (!CITIZEN_API) {
    throw new Error("SEWAC_API is not configured.");
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
    `${CITIZEN_API}/api/internal/complaints/${encodeURIComponent(
      ticketNumber,
    )}/request-verification`,
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
  // Never return OTP to admin frontend.
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
    throw new Error("SEWAC_API is not configured.");
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

  const data = await response.json();

  if (!response.ok || data.success !== true) {
    throw new Error(data.message || data.error || "Invalid verification OTP.");
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
 *
 * ADMIN WORKFLOW
 *
 * PENDING
 *    ↓
 * READY_FOR_VERIFICATION
 *    ↓
 * OTP_SENT
 *    ↓
 * CLOSED
 *
 * The service prevents the frontend from bypassing
 * this workflow.
 */
async function updateComplaint(ticketNumber, updates) {
  const complaint =
    await complaintRepository.getComplaintByTicket(ticketNumber);

  if (!complaint) {
    throw new Error("Complaint not found.");
  }

  const { status, assigned_to, remarks } = updates;

  /**
   * -------------------------------------------------------
   * Validate fields
   * -------------------------------------------------------
   */

  if (
    status === undefined &&
    assigned_to === undefined &&
    remarks === undefined
  ) {
    throw new Error("No complaint changes were provided.");
  }

  /**
   * -------------------------------------------------------
   * Status transition rules
   * -------------------------------------------------------
   *
   * Admin may ONLY perform:
   *
   * PENDING → READY_FOR_VERIFICATION
   *
   * Admin cannot manually:
   *
   * READY → OTP_SENT
   * OTP_SENT → CLOSED
   * CLOSED → anything
   *
   * Those are system/citizen verification transitions.
   */

  if (status !== undefined) {
    if (status !== "PENDING" && status !== "READY_FOR_VERIFICATION") {
      throw new Error("Invalid admin complaint status.");
    }

    /**
     * No-op status update
     */
    if (status === complaint.status) {
      // Allowed.
    } else if (

    /**
     * PENDING → READY
     */
      complaint.status === "PENDING" &&
      status === "READY_FOR_VERIFICATION"
    ) {
      // Allowed.
    } else {

    /**
     * Everything else is blocked.
     */
      throw new Error(
        `Invalid complaint status transition: ${complaint.status} → ${status}.`,
      );
    }
  }

  /**
   * -------------------------------------------------------
   * CLOSED complaints
   * -------------------------------------------------------
   *
   * Once citizen verification closes the complaint,
   * admin cannot change its status.
   *
   * We still allow remarks/assignment edits if needed.
   */
  if (
    complaint.status === "CLOSED" &&
    status !== undefined &&
    status !== complaint.status
  ) {
    throw new Error("Closed complaints cannot have their status changed.");
  }

  /**
   * -------------------------------------------------------
   * closed_at
   * -------------------------------------------------------
   *
   * Admin does NOT directly close complaints.
   *
   * closed_at remains controlled by the OTP verification
   * flow.
   */
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
