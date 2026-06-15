const pool = require("../config/db");

const getProfile = async (
  req,
  res
) => {
  try {

    const adminId =
      req.admin.adminId;

    const result =
      await pool.query(
        `
        SELECT
          id,
          full_name,
          email,
          created_at
        FROM admins
        WHERE id = $1
        `,
        [adminId]
      );

    if (
      result.rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
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

module.exports = {
  getProfile,
};