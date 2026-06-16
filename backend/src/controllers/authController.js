const pool = require("../config/db");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { logEvent } = require("../services/auditService");
const { createAlert } = require("../services/alertService");
const {
  checkFailedLoginThreshold,
} = require("../services/threatDetectionService");

const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    const existingAdmin = await pool.query(
      "SELECT * FROM admins WHERE email = $1",
      [email],
    );

    if (existingAdmin.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO admins
      (
        full_name,
        email,
        password_hash
      )
      VALUES
      (
        $1,$2,$3
      )
      RETURNING
      id,
      full_name,
      email,
      created_at
      `,
      [full_name, email, password_hash],
    );

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const adminResult = await pool.query(
      "SELECT * FROM admins WHERE email = $1",
      [email],
    );

    if (adminResult.rows.length === 0) {
      await logEvent({
        adminId: null,
        eventType: "LOGIN_FAILED",
        description: `Unknown admin login attempt: ${email}`,
        ipAddress: req.ip,
      });
      await checkFailedLoginThreshold(email, null, req.ip);

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const admin = adminResult.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      await logEvent({
        adminId: admin.id,
        eventType: "LOGIN_FAILED",
        description: `Incorrect password for ${email}`,
        ipAddress: req.ip,
      });

      await checkFailedLoginThreshold(email, admin.id, req.ip);

      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        adminId: admin.id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );
    await logEvent({
      adminId: admin.id,
      eventType: "LOGIN_SUCCESS",
      description: `Administrator ${admin.email} logged in successfully`,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  register,
  login,
};
