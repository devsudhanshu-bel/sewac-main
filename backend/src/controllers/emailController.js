const { sendPermissionApprovalEmail } = require("../services/emailService");

exports.sendPermissionRequestEmail = async (req, res) => {
  try {
    await sendPermissionApprovalEmail(req.body);

    res.status(200).json({
      success: true,
      message: "Permission email sent successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};