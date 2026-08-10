const complaintService = require("../services/complaintService");

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
