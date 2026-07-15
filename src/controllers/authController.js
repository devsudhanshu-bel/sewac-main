const jwt = require("jsonwebtoken");
const { verifyCMADS } = require("../services/cmadsService");
const ROLE_ACCESS = require("../config/permissions");

exports.login = async (req, res) => {
  try {
    const cmadsResult = await verifyCMADS(req.body);

    const role = cmadsResult.admin.role;
    const permissions = ROLE_ACCESS[role];

    const token = jwt.sign(
      {
        id: cmadsResult.admin.id,
        full_name: cmadsResult.admin.full_name,
        email: cmadsResult.admin.email,
        role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
      success: true,
      token,
      admin: cmadsResult.admin,
      permissions
    });

  } catch (error) {
    res.status(500).json({
      error: error.message || "Login failed"
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
      permissions
    });

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch current user"
    });
  }
};