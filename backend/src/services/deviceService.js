const crypto = require("crypto");

const generateFingerprint = (req) => {

  const userAgent = req.headers["user-agent"] || "";

  const fingerprint = crypto
    .createHash("sha256")
    .update(userAgent)
    .digest("hex");

  ("USER AGENT:", userAgent);
  ("GENERATED FP:", fingerprint);

  return fingerprint;
};
module.exports = {
  generateFingerprint,
};
