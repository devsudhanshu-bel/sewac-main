const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM admins WHERE email=$1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const admin = result.rows[0];

    if (admin.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Not Super Admin",
      });
    }

    const match = await bcrypt.compare(password, admin.password_hash);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        adminId: admin.id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "4h",
      },
    );

    return res.json({
      success: true,
      token,
      admin,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (role !== "ADMIN_LAYER_1" && role !== "ADMIN_LAYER_2") {
      return res.status(400).json({
        success: false,
        message: "Invalid Role",
      });
    }

    const existing = await pool.query("SELECT id FROM admins WHERE email=$1", [
      email,
    ]);

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO admins
      (
        full_name,
        email,
        password_hash,
        role
      )
      VALUES
      ($1,$2,$3,$4)
      RETURNING *
      `,
      [full_name, email, hashedPassword, role],
    );

    return res.status(201).json({
      success: true,
      message: "Administrator created successfully",
      admin: result.rows[0],
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getAdmins = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        full_name,
        email,
        role,
        created_at
      FROM admins
      WHERE role IN ('ADMIN_LAYER_1','ADMIN_LAYER_2')
      ORDER BY created_at DESC
      `,
    );

    return res.json({
      success: true,
      admins: result.rows,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await pool.query("SELECT * FROM admins WHERE id=$1", [id]);

    if (admin.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Administrator not found",
      });
    }

    await pool.query("DELETE FROM admins WHERE id=$1", [id]);

    return res.json({
      success: true,
      message: "Administrator deleted successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  login,
  createAdmin,
  getAdmins,
  deleteAdmin,
};
