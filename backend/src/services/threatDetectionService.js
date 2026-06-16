const pool = require("../config/db");

const { createAlert } = require("./alertService");

const checkFailedLoginThreshold = async (email, adminId, ipAddress) => {
  const result = await pool.query(
    `
        SELECT COUNT(*) AS failures
        FROM audit_logs
        WHERE event_type = 'LOGIN_FAILED'
        AND created_at >=
          NOW() - INTERVAL '10 minutes'
        `,
  );

  const failures = Number(result.rows[0].failures);

  let severity = null;

  if (failures === 3) {
    severity = "MEDIUM";
  } else if (failures === 6) {
    severity = "HIGH";
  } else if (failures === 10) {
    severity = "CRITICAL";
  }

  if (severity) {
    await createAlert({
      adminId,
      layer: "IDENTITY",
      severity,
      type: "FAILED_LOGIN_THRESHOLD",
      description: `${failures} failed login attempts detected within 10 minutes`,
      ipAddress,
    });
  }
};

module.exports = {
  checkFailedLoginThreshold,
};
