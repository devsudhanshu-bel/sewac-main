const pool = require("../config/db");

const {
  calculateRiskScore,
  determineDecision,
} = require("../services/riskService");

const { createAlert } = require("../services/alertService");

const evaluateRisk = async (req, res) => {
  try {
    const adminId = req.admin.adminId;

    const identityScore = 100;

    const deviceResult = await pool.query(
      `
    SELECT trust_score
    FROM devices
    WHERE admin_id = $1
    AND status = 'ACTIVE'
    ORDER BY last_seen DESC
    LIMIT 1
    `,
      [adminId],
    );

    const behaviorResult = await pool.query(
      `
    SELECT similarity_score
    FROM behavior_samples
    WHERE admin_id = $1
    AND sample_type = 'VERIFICATION'
    ORDER BY created_at DESC
    LIMIT 1
    `,
      [adminId],
    );

    if (behaviorResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No behavior verification found",
      });
    }

    const behaviorScore = Number(behaviorResult.rows[0].similarity_score);

    if (deviceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active device found",
      });
    }

    const deviceScore = Number(deviceResult.rows[0].trust_score);

    const overallRiskScore = calculateRiskScore(
      identityScore,
      deviceScore,
      behaviorScore,
    );

    const decision = determineDecision(overallRiskScore);
    if (decision === "RESTRICT") {
      await createAlert({
        adminId,

        layer: "RISK",

        severity: "HIGH",

        type: "RISK_RESTRICT",

        description: `Risk engine restricted access. Overall score: ${overallRiskScore.toFixed(2)}`,

        ipAddress: req.ip,
      });
    } else if (decision === "DENY") {
      await createAlert({
        adminId,

        layer: "RISK",

        severity: "CRITICAL",

        type: "RISK_DENY",

        description: `Risk engine denied access. Overall score: ${overallRiskScore.toFixed(2)}`,

        ipAddress: req.ip,
      });
    }

    await pool.query(
      `
      INSERT INTO risk_events
      (
        admin_id,
        identity_score,
        device_score,
        behavior_score,
        overall_risk_score,
        decision
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6
      )
      `,
      [
        adminId,
        identityScore,
        deviceScore,
        behaviorScore,
        overallRiskScore,
        decision,
      ],
    );

    return res.status(200).json({
      success: true,
      decision,
    });
    
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getRiskHistory = async (req, res) => {
  try {
    const adminId = req.admin.adminId;

    const result = await pool.query(
      `
        SELECT *
        FROM risk_events
        WHERE admin_id = $1
        ORDER BY created_at DESC
        `,
      [adminId],
    );

    return res.status(200).json({
      success: true,
      history: result.rows,
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
  evaluateRisk,
  getRiskHistory,
};
