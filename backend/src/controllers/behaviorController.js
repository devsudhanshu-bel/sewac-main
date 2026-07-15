const pool = require("../config/db");

const { createAlert } = require("../services/alertService");

const { logEvent } = require("../services/auditService");

const enrollBehavior = async (req, res) => {
  try {
    const { adminId, samples } = req.body;

    if (!samples || !Array.isArray(samples)) {
      return res.status(400).json({
        success: false,
        message: "Samples array required",
      });
    }

    if (samples.length !== 5) {
      return res.status(400).json({
        success: false,
        message: "Exactly 5 enrollment samples required",
      });
    }

    const existingProfile = await pool.query(
      `
        SELECT *
        FROM behavior_profiles
        WHERE admin_id = $1
        `,
      [adminId],
    );

    if (existingProfile.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Behavior profile already exists",
      });
    }

    let totalDwell = 0;
    let totalFlight = 0;
    let totalTyping = 0;
    let totalBackspace = 0;
    let totalError = 0;

    for (const sample of samples) {
      if (
        sample.dwell_time == null ||
        sample.flight_time == null ||
        sample.typing_speed == null ||
        sample.backspace_usage == null ||
        sample.error_rate == null
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid enrollment sample",
        });
      }
      totalDwell += Number(sample.dwell_time);

      totalFlight += Number(sample.flight_time);

      totalTyping += Number(sample.typing_speed);

      totalBackspace += Number(sample.backspace_usage);

      totalError += Number(sample.error_rate);

      await pool.query(
        `
        INSERT INTO
        behavior_samples
        (
          admin_id,
          dwell_time,
          flight_time,
          typing_speed,
          backspace_usage,
          error_rate,
          sample_type
        )
        VALUES
        (
          $1,$2,$3,$4,$5,$6,$7
        )
        `,
        [
          adminId,
          sample.dwell_time,
          sample.flight_time,
          sample.typing_speed,
          sample.backspace_usage,
          sample.error_rate,
          "ENROLLMENT",
        ],
      );
    }

    const avgDwell = totalDwell / 5;

    const avgFlight = totalFlight / 5;

    const avgTyping = totalTyping / 5;

    const avgBackspace = totalBackspace / 5;

    const avgError = totalError / 5;

    const profile = await pool.query(
      `
        INSERT INTO
        behavior_profiles
        (
          admin_id,
          enrollment_phrase,
          avg_dwell_time,
          avg_flight_time,
          avg_typing_speed,
          avg_backspace_usage,
          avg_error_rate
        )
        VALUES
        (
          $1,$2,$3,$4,$5,$6,$7
        )
        RETURNING *
        `,
      [
        adminId,
        "LOGIN_CREDENTIALS",
        avgDwell,
        avgFlight,
        avgTyping,
        avgBackspace,
        avgError,
      ],
    );

    return res.status(201).json({
      success: true,
      message: "Behavior profile enrolled successfully",
      profile: profile.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const {
  calculateEuclideanDistance,
  calculateManhattanDistance,
  calculateCosineSimilarity,
} = require("../services/behaviorService");

const verifyBehavior = async (req, res) => {
  try {
    const adminId = req.admin.adminId;

    const {
      dwell_time,
      flight_time,
      typing_speed,
      backspace_usage,
      error_rate,
    } = req.body;

    const profileResult = await pool.query(
      `
      SELECT *
      FROM behavior_profiles
      WHERE admin_id = $1
      `,
      [adminId],
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Behavior profile not found",
      });
    }

    const profile = profileResult.rows[0];

    const sample = {
      dwell_time: Number(dwell_time),
      flight_time: Number(flight_time),
      typing_speed: Number(typing_speed),
      backspace_usage: Number(backspace_usage),
      error_rate: Number(error_rate),
    };
    if (
      Object.values(sample).some(
        (value) => value === null || Number.isNaN(value),
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid behavioral metrics",
      });
    }
    const euclidean = calculateEuclideanDistance(profile, sample);

    const manhattan = calculateManhattanDistance(profile, sample);

    const cosine = calculateCosineSimilarity(profile, sample);

    // Normalize metrics into score

    const normalizedEuclidean = Math.max(0, 100 - euclidean);

    const normalizedManhattan = Math.max(0, 100 - manhattan);

    const normalizedCosine = cosine * 100;

    const behaviorScore =
      (normalizedEuclidean + normalizedManhattan + normalizedCosine) / 3;

    let result = "ALLOW";

    if (behaviorScore < 60) {
      result = "DENY";

      await createAlert({
        adminId,

        layer: "BEHAVIOR",

        severity: "HIGH",

        type: "BEHAVIOR_DENY",

        description: `Behavior verification denied. Score: ${behaviorScore.toFixed(2)}`,

        ipAddress: req.ip,
      });
    } else if (behaviorScore < 80) {
      result = "RESTRICT";

      await createAlert({
        adminId,

        layer: "BEHAVIOR",

        severity: "MEDIUM",

        type: "BEHAVIOR_RESTRICT",

        description: `Behavior verification restricted. Score: ${behaviorScore.toFixed(2)}`,

        ipAddress: req.ip,
      });
    }

    await logEvent({
      adminId,
      eventType: `BEHAVIOR_${result}`,
      description: `Behavior authentication result: ${result}`,
      ipAddress: req.ip,
    });

    await pool.query(
      `
      INSERT INTO behavior_samples
      (
        admin_id,
        dwell_time,
        flight_time,
        typing_speed,
        backspace_usage,
        error_rate,
        similarity_score,
        verification_result,
        sample_type
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9
      )
      `,
      [
        adminId,
        dwell_time,
        flight_time,
        typing_speed,
        backspace_usage,
        error_rate,
        behaviorScore,
        result,
        "VERIFICATION",
      ],
    );

    return res.status(200).json({
      success: true,
      trustScore: Number(behaviorScore.toFixed(2)),
      verification: result,
    });
  
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getBehaviorProfile = async (req, res) => {
  try {
    const adminId = req.admin.adminId;

    const result = await pool.query(
      `
        SELECT *
        FROM behavior_profiles
        WHERE admin_id = $1
        `,
      [adminId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Behavior profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getBehaviorHistory = async (req, res) => {
  try {
    const adminId = req.admin.adminId;

    const result = await pool.query(
      `
        SELECT
          id,
          sample_type,
          similarity_score,
          verification_result,
          created_at
        FROM behavior_samples
        WHERE admin_id = $1
        ORDER BY created_at DESC
        LIMIT 20
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
  enrollBehavior,
  verifyBehavior,
  getBehaviorProfile,
  getBehaviorHistory,
};
