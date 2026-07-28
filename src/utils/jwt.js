import jwt from "jsonwebtoken";

/**
 * Generate JWT Token
 * @param {Object} payload
 * @returns {string}
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Verify JWT Token
 * @param {string} token
 * @returns {Object}
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Decode JWT Token (without verification)
 * @param {string} token
 * @returns {Object|null}
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};