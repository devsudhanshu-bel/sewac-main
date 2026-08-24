const jwt = require("jsonwebtoken");
const { verifyCMADS } = require("../services/cmadsService");
const ROLE_ACCESS = require("../config/permissions");

exports.login = async (req, res) => {
  try {
    const cmadsResult = await verifyCMADS(req.body);

    const admin = cmadsResult.admin;

    const role = admin.role;

    const permissions = ROLE_ACCESS[role];

    // ==========================================
    // CREATE JWT WITH ACTUAL ADMIN NAME
    // ==========================================

    const token = jwt.sign(
      {
        id: admin.id,

        full_name: admin.full_name,

        email: admin.email,

        role: role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    // ==========================================
    // LOGIN RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,

      token,

      admin,

      permissions,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Login failed",
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const role = req.user.role;

    const permissions = ROLE_ACCESS[role];

    res.status(200).json({
      success: true,

      admin: req.user,

      permissions,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch current user",
    });
  }
};
