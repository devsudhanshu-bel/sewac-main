const complaintService = require("../services/complaintService");

/**
 * =========================================================
 * REQUEST VERIFICATION OTP
 * =========================================================
 */
exports.requestVerification = async (req, res) => {
  try {
    console.log("AUTH USER:", req.user);

    const { ticketNumber } = req.params;

    const adminId = req.user.adminId;

    if (!ticketNumber) {
      return res.status(400).json({
        success: false,
        message: "Ticket number is required.",
      });
    }

    const result = await complaintService.requestVerification(
      ticketNumber,
      adminId,
    );

    return res.status(200).json({
      success: true,
      message: "Verification OTP sent to the citizen.",
      data: result,
    });
  } catch (error) {
    console.error("Request verification error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to start verification.",
    });
  }
};

/**
 * =========================================================
 * VERIFY OTP
 * =========================================================
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { ticketNumber } = req.params;

    const { otp } = req.body;

    if (!ticketNumber) {
      return res.status(400).json({
        success: false,
        message: "Ticket number is required.",
      });
    }

    if (!otp || !/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        success: false,
        message: "A valid 6-digit OTP is required.",
      });
    }

    const result = await complaintService.verifyComplaintOTP(
      ticketNumber,
      String(otp),
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      message: "Complaint closed successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Verify complaint OTP error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to verify OTP.",
    });
  }
};

/**
 * =========================================================
 * GET ALL COMPLAINTS
 * =========================================================
 */
exports.getComplaints = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status, category } = req.query;

    const result = await complaintService.getComplaints({
      page,
      limit,
      search,
      status,
      category,
    });

    return res.status(200).json({
      success: true,
      message: "Complaints fetched successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Get complaints error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch complaints.",
    });
  }
};

/**
 * =========================================================
 * GET SINGLE COMPLAINT
 * =========================================================
 */
exports.getComplaintByTicket = async (req, res) => {
  try {
    const { ticketNumber } = req.params;

    if (!ticketNumber) {
      return res.status(400).json({
        success: false,
        message: "Ticket number is required.",
      });
    }

    const complaint = await complaintService.getComplaintByTicket(ticketNumber);

    return res.status(200).json({
      success: true,
      message: "Complaint fetched successfully.",
      data: complaint,
    });
  } catch (error) {
    console.error("Get complaint error:", error);

    return res.status(404).json({
      success: false,
      message: error.message || "Complaint not found.",
    });
  }
};

/**
 * =========================================================
 * UPDATE COMPLAINT
 * =========================================================
 */
exports.updateComplaint = async (req, res) => {
  try {
    const { ticketNumber } = req.params;

    if (!ticketNumber) {
      return res.status(400).json({
        success: false,
        message: "Ticket number is required.",
      });
    }

    const { status, assigned_to, remarks } = req.body;

    /**
     * Explicitly whitelist fields.
     *
     * This prevents fields such as:
     *
     * otp_hash
     * verification_code
     * phone_number
     * ticket_number
     *
     * from reaching the service.
     */
    const updates = {};

    if (status !== undefined) {
      updates.status = status;
    }

    if (assigned_to !== undefined) {
      updates.assigned_to = assigned_to;
    }

    if (remarks !== undefined) {
      updates.remarks = remarks;
    }

    const result = await complaintService.updateComplaint(
      ticketNumber,
      updates,
    );

    return res.status(200).json({
      success: true,
      message: "Complaint updated successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Update complaint error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to update complaint.",
    });
  }
};

/**
 * =========================================================
 * KPI
 * =========================================================
 */
exports.getComplaintKPIs = async (req, res) => {
  try {
    const kpis = await complaintService.getComplaintKPIs();

    return res.status(200).json({
      success: true,
      message: "Complaint KPIs fetched successfully.",
      data: kpis,
    });
  } catch (error) {
    console.error("Get complaint KPIs error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch complaint KPIs.",
    });
  }
};
