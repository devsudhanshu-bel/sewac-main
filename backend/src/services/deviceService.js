const crypto = require("crypto");

const crypto = require("crypto");

const generateFingerprint = (req) => {
  const fingerprint = req.body.fingerprint || {};

  const fingerprintString = JSON.stringify(fingerprint);

  return crypto
    .createHash("sha256")
    .update(fingerprintString)
    .digest("hex");
};

module.exports = {
  generateFingerprint,
};
