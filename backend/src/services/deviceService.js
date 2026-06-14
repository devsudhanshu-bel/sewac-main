const crypto = require("crypto");

const generateFingerprint = (req) => {

  const userAgent =
    req.headers["user-agent"] || "";

  const language =
    req.headers["accept-language"] || "";

  const timezone =
    req.headers["x-timezone"] || "";

  const platform =
    req.headers["sec-ch-ua-platform"] || "";

  const fingerprintSource =
    `${userAgent}|${language}|${timezone}|${platform}`;

  return crypto
    .createHash("sha256")
    .update(fingerprintSource)
    .digest("hex");
};

module.exports = {
  generateFingerprint,
};