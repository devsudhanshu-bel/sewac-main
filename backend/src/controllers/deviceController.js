const pool = require("../config/db");

const { generateFingerprint } = require("../services/deviceService");

const { logEvent } = require("../services/auditService");

const { createAlert } = require("../services/alertService");

const registerDevice = async (req, res) => {
  try {
    const adminId = req.admin.adminId;

    const { device_name } = req.body;

    const fingerprint = generateFingerprint(req);

    const existingDevice = await pool.query(
      `
      SELECT *
      FROM devices
      WHERE device_fingerprint = $1
      `,
      [fingerprint]
    );

    if (existingDevice.rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Device already registered",
        device: existingDevice.rows[0],
      });
    }

    const result = await pool.query(
      `
      INSERT INTO devices
      (
        admin_id,
        device_fingerprint,
        device_name,
        trust_score
      )
      VALUES
      (
        $1,$2,$3,$4
      )
      RETURNING *
      `,
      [adminId, fingerprint, device_name, 50]
    );

    await logEvent({
      adminId,
      eventType: "DEVICE_REGISTERED",
      description: `Device registered: ${device_name}`,
      ipAddress: req.ip,
    });

    return res.status(201).json({
      success: true,
      message: "Device registered successfully",
      device: result.rows[0],
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

    const fingerprint =
      generateFingerprint(req);

    const revokedDevice =
      await pool.query(
        `
        SELECT *
        FROM devices
        WHERE device_fingerprint = $1
        AND status = 'REVOKED'
        `,
        [fingerprint]
      );

    if (revokedDevice.rows.length > 0) {

      await logEvent({
        adminId:
          revokedDevice.rows[0].admin_id,

        eventType:
          "REVOKED_DEVICE_ATTEMPT",

        description:
          "Revoked device attempted access",

        ipAddress:
          req.ip,
      });

      await createAlert({
        adminId:
          revokedDevice.rows[0].admin_id,

        layer:
          "DEVICE",

        severity:
          "CRITICAL",

        type:
          "REVOKED_DEVICE",

        description:
          "Revoked device attempted access",

        ipAddress:
          req.ip,
      });

      return res.status(403).json({
        success: false,
        message:
          "Revoked device detected",
      });

    }

    const device =
      await pool.query(
        `
        SELECT *
        FROM devices
        WHERE device_fingerprint = $1
        AND status = 'ACTIVE'
        `,
        [fingerprint]
      );

    if (device.rows.length > 0) {

      await pool.query(
        `
        UPDATE devices
        SET last_seen =
          CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [device.rows[0].id]
      );

      const updatedTrustScore =
        Math.min(
          device.rows[0].trust_score + 2,
          100
        );

      await pool.query(
        `
        UPDATE devices
        SET trust_score = $1
        WHERE id = $2
        `,
        [
          updatedTrustScore,
          device.rows[0].id,
        ]
      );

      await logEvent({
        adminId:
          device.rows[0].admin_id,

        eventType:
          "KNOWN_DEVICE_DETECTED",

        description:
          "Known device verified",

        ipAddress:
          req.ip,
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

      eventType:
        "UNKNOWN_DEVICE_DETECTED",

      description:
        "Unknown device attempted access",

      ipAddress:
        req.ip,
    });

    await createAlert({
      adminId: null,

      layer: "DEVICE",

      severity: "HIGH",

      type: "UNKNOWN_DEVICE",

      description:
        "Unknown device attempted access",

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

    const adminId =
      req.admin.adminId;

    const devices =
      await pool.query(
        `
        SELECT *
        FROM devices
        WHERE admin_id = $1
        ORDER BY last_seen DESC
        `,
        [adminId]
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

    const adminId =
      req.admin.adminId;

    const { deviceId } =
      req.params;

    const device =
      await pool.query(
        `
        SELECT *
        FROM devices
        WHERE id = $1
        AND admin_id = $2
        `,
        [deviceId, adminId]
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
      [deviceId]
    );

    await logEvent({
      adminId,

      eventType:
        "DEVICE_REVOKED",

      description:
        `Device revoked: ${device.rows[0].device_name}`,

      ipAddress:
        req.ip,
    });

    return res.status(200).json({
      success: true,
      message:
        "Device revoked successfully",
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
  registerDevice,
  verifyDevice,
  listDevices,
  revokeDevice,
};