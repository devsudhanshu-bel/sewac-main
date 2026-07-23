const crypto = require("crypto");

const generateFingerprint = (req) => {
  const fp = req.body.fingerprint || {};

  const fingerprintString = [
    fp.userAgent,
    fp.platform,
    fp.language,
    fp.timezone,
    fp.screenWidth,
    fp.screenHeight,
    fp.colorDepth,
    fp.hardwareConcurrency,
    fp.deviceMemory,
    fp.cookieEnabled,
    fp.touchPoints,
  ].join("|");

  return crypto
    .createHash("sha256")
    .update(fingerprintString)
    .digest("hex");
};

module.exports = {
  generateFingerprint,
};

module.exports = {
  generateFingerprint,
};
