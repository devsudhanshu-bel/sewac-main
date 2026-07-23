const pool = require("../config/db");

const crypto = require("crypto");

const {
  sendSecurityAlert,
  sendPermissionApprovalEmail,
  sendDeviceRegistrationEmail,
} = require("../services/emailService");

const { generateFingerprint } = require("../services/deviceService");

const { logEvent } = require("../services/auditService");

const { createAlert } = require("../services/alertService");

const requestDeviceRegistration = async (req, res) => {
  try {
    const adminId = req.admin.adminId;
    const { device_name } = req.body;

    const fingerprint = generateFingerprint(req);

    // Generate secure registration token
    const token = crypto.randomBytes(32).toString("hex");

    // Hash the token before storing
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Token valid for 60 minutes
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    const existingDevice = await pool.query(
      `
    SELECT *
    FROM devices
    WHERE admin_id = $1
    AND device_fingerprint = $2
  `,
      [adminId, fingerprint],
    );

    if (existingDevice.rows.length > 0) {
      const device = existingDevice.rows[0];

      // Device already waiting for approval
      if (
        device.status === "PENDING" &&
        device.token_expires_at &&
        new Date(device.token_expires_at) > new Date()
      ) {
        return res.status(200).json({
          success: true,
          message:
            "A registration email has already been sent. Please check your inbox.",
        });
      }
      // Token expired or device was revoked
      await pool.query(
        `
    UPDATE devices
    SET
      registration_token_hash = $1,
      token_expires_at = $2,
      status = 'PENDING',
      device_name = $3
    WHERE id = $4
    `,
        [tokenHash, tokenExpiry, device_name, device.id],
      );
    } else {
      await pool.query(
        `
    INSERT INTO devices
    (
      admin_id,
      device_fingerprint,
      device_name,
      trust_score,
      status,
      registration_token_hash,
      token_expires_at
    )
    VALUES
    (
      $1,$2,$3,$4,$5,$6,$7
    )
    `,
        [
          adminId,
          fingerprint,
          device_name,
          50,
          "PENDING",
          tokenHash,
          tokenExpiry,
        ],
      );
    }

    const adminResult = await pool.query(
      `
      SELECT
        full_name,
        email
      FROM admins
      WHERE id = $1
      `,
      [adminId],
    );

    if (adminResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Administrator not found.",
      });
    }

    const admin = adminResult.rows[0];

    // Send email
    await sendDeviceRegistrationEmail(admin.email, admin.full_name, token);
    await logEvent({
      adminId,
      eventType: "DEVICE_REGISTRATION_REQUESTED",
      description: `Registration email sent for device: ${device_name}`,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message:
        "A device approval email has been sent to your registered email address.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const approveDeviceRegistration = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Registration token is required.",
      });
    }

    // Hash the received token
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find pending device
    const deviceResult = await pool.query(
      `
      SELECT *
      FROM devices
      WHERE registration_token_hash = $1
      AND status = 'PENDING'
      `,
      [tokenHash],
    );

    if (deviceResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired registration link.",
      });
    }

    const device = deviceResult.rows[0];

    // Check expiry
    if (
      !device.token_expires_at ||
      new Date(device.token_expires_at) < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Registration link has expired.",
      });
    }

    // Activate device
    await pool.query(
      `
      UPDATE devices
      SET
        status = 'ACTIVE',
        trust_score = 80,
        registration_token_hash = NULL,
        token_expires_at = NULL,
        first_seen = NOW(),
        last_seen = NOW()
      WHERE id = $1
      `,
      [device.id],
    );
    await logEvent({
      adminId: device.admin_id,
      eventType: "DEVICE_APPROVED",
      description: `Device approved: ${device.device_name}`,
      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message:
        "Device approved successfully. You can now log in from this device.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const verifyDevice = async (req, res) => {
  try {
    const adminId = req.admin.adminId;
    const fingerprint = generateFingerprint(req);

    const revokedDevice = await pool.query(
      `
    SELECT *
    FROM devices
    WHERE admin_id = $1
    AND device_fingerprint = $2
    AND status = 'REVOKED'
  `,
      [adminId, fingerprint],
    );

    if (revokedDevice.rows.length > 0) {
      await logEvent({
        adminId: revokedDevice.rows[0].admin_id,

        eventType: "REVOKED_DEVICE_ATTEMPT",

        description: "Revoked device attempted access",

        ipAddress: req.ip,
      });

      await createAlert({
        adminId: revokedDevice.rows[0].admin_id,

        layer: "DEVICE",

        severity: "CRITICAL",

        type: "REVOKED_DEVICE",

        description: "Revoked device attempted access",

        ipAddress: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: "Revoked device detected",
      });
    }

    const device = await pool.query(
      `
    SELECT *
    FROM devices
    WHERE admin_id = $1
    AND device_fingerprint = $2
    AND status = 'ACTIVE'
  `,
      [adminId, fingerprint],
    );

    if (device.rows.length > 0) {
      const updatedTrustScore = Math.min(device.rows[0].trust_score + 2, 80);

      await pool.query(
        `
UPDATE devices
SET
    last_seen = CURRENT_TIMESTAMP,
    trust_score = $1
WHERE id = $2
`,
        [updatedTrustScore, device.rows[0].id],
      );

      await logEvent({
        adminId: device.rows[0].admin_id,

        eventType: "KNOWN_DEVICE_DETECTED",

        description: "Known device verified",

        ipAddress: req.ip,
      });

      return res.status(200).json({
        success: true,
        known: true,
        trust_score: updatedTrustScore,
        device: device.rows[0],
      });
    }

    await logEvent({
      adminId: null,

      eventType: "UNKNOWN_DEVICE_DETECTED",

      description: "Unknown device attempted access",

      ipAddress: req.ip,
    });

    await createAlert({
      adminId: null,

      layer: "DEVICE",

      severity: "HIGH",

      type: "UNKNOWN_DEVICE",

      description: "Unknown device attempted access",

      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      known: false,
      trust_score: 0,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const listDevices = async (req, res) => {
  try {
    const adminId = req.admin.adminId;

    const devices = await pool.query(
      `
        SELECT *
        FROM devices
        WHERE admin_id = $1
        ORDER BY last_seen DESC
        `,
      [adminId],
    );

    return res.status(200).json({
      success: true,
      count: devices.rows.length,
      devices: devices.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const revokeDevice = async (req, res) => {
  try {
    const adminId = req.admin.adminId;

    const { deviceId } = req.params;

    const device = await pool.query(
      `
        SELECT *
        FROM devices
        WHERE id = $1
        AND admin_id = $2
        `,
      [deviceId, adminId],
    );

    if (device.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    await pool.query(
      `
      UPDATE devices
      SET status = 'REVOKED'
      WHERE id = $1
      `,
      [deviceId],
    );

    await logEvent({
      adminId,

      eventType: "DEVICE_REVOKED",

      description: `Device revoked: ${device.rows[0].device_name}`,

      ipAddress: req.ip,
    });

    return res.status(200).json({
      success: true,
      message: "Device revoked successfully",
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
  requestDeviceRegistration,
  approveDeviceRegistration,
  verifyDevice,
  listDevices,
  revokeDevice,
};
