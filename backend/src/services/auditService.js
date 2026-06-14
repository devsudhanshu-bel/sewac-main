const pool = require("../config/db");

const logEvent = async ({
  adminId,
  eventType,
  description,
  ipAddress,
}) => {
  try {
    await pool.query(
      `
      INSERT INTO audit_logs
      (
        admin_id,
        event_type,
        event_description,
        ip_address
      )
      VALUES
      (
        $1,$2,$3,$4
      )
      `,
      [
        adminId,
        eventType,
        description,
        ipAddress,
      ]
    );
  } catch (error) {
    console.error("Audit Error:", error);
  }
};

module.exports = {
  logEvent,
};