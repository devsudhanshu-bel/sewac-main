import { verifyToken } from "../utils/jwt.js";

import { AUTH_MESSAGES } from "../modules/auth/auth.constants.js";

import redisService from "../modules/redis/redis.service.js";

import redisKeys from "../modules/redis/redis.keys.js";

const authenticateCitizen = async (req, res, next) => {
  try {
    // =====================================
    // READ AUTHORIZATION HEADER
    // =====================================

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,

        message: AUTH_MESSAGES.UNAUTHORIZED,

        data: null,
      });
    }

    // =====================================
    // CHECK BEARER FORMAT
    // =====================================

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,

        message: AUTH_MESSAGES.INVALID_TOKEN,

        data: null,
      });
    }

    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,

        message: AUTH_MESSAGES.INVALID_TOKEN,

        data: null,
      });
    }

    // =====================================
    // VERIFY JWT TOKEN
    // =====================================

    const decoded = verifyToken(token);

    const userId = decoded.id;
    const deviceId = decoded.deviceId;

    if (!userId || !deviceId) {
      return res.status(401).json({
        success: false,
        message: AUTH_MESSAGES.INVALID_TOKEN,
        data: null,
      });
    }

    // =====================================
    // CHECK REDIS SESSION
    // =====================================

    const key = redisKeys.authToken(userId, deviceId);

    const redisToken = await redisService.get(key);

    if (!redisToken) {
      return res.status(401).json({
        success: false,

        message: "Session expired. Please login again.",

        data: null,
      });
    }

    // =====================================
    // VERIFY TOKEN MATCH
    // =====================================

    if (redisToken !== token) {
      return res.status(401).json({
        success: false,

        message: "Invalid session.",

        data: null,
      });
    }

    // =====================================
    // ATTACH USER DATA
    // =====================================

    req.user = {
      id: decoded.id,

      phoneNumber: decoded.phoneNumber,

      deviceId: decoded.deviceId,

      token,
    };

    next();
  } catch (error) {
    console.error("❌ Authentication Error:", error.message);

    return res.status(401).json({
      success: false,

      message: AUTH_MESSAGES.INVALID_TOKEN,

      data: null,
    });
  }
};

export default authenticateCitizen;
