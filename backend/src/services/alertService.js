const pool =
  require("../config/db");

const {
  sendSecurityAlert,
} = require("./emailService");

const createAlert =
  async ({
    adminId,
    layer,
    severity,
    type,
    description,
    ipAddress,
  }) => {

    await pool.query(
      `
      INSERT INTO security_alerts
      (
        admin_id,
        alert_layer,
        severity,
        alert_type,
        description,
        ip_address
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6
      )
      `,
      [
        adminId,
        layer,
        severity,
        type,
        description,
        ipAddress,
      ]
    );

    await sendSecurityAlert({
      layer,
      severity,
      type,
      description,
      ipAddress,
    });
  };

module.exports = {
  createAlert,
};