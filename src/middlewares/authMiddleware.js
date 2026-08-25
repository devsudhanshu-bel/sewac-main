const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  /*
  |--------------------------------------------------------------------------
  | INTERNAL CITIZEN API REQUEST
  |--------------------------------------------------------------------------
  |
  | Citizen backend can call selected Admin APIs using:
  |
  | X-Citizen-Internal-Secret
  |
  | This avoids trying to verify a Citizen JWT using the
  | Admin JWT_SECRET.
  |
  |--------------------------------------------------------------------------
  */

  const internalSecret = req.headers["x-citizen-internal-secret"];

  if (
    internalSecret &&
    process.env.CITIZEN_INTERNAL_API_SECRET &&
    internalSecret === process.env.CITIZEN_INTERNAL_API_SECRET
  ) {
    /*
     * Mark this request as an internal request.
     */

    req.user = {
      id: "citizen-internal",
      internal: true,
      source: "citizen-backend",
    };

    return next();
  }

  /*
  |--------------------------------------------------------------------------
  | NORMAL ADMIN JWT AUTHENTICATION
  |--------------------------------------------------------------------------
  */

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      ...decoded,
      id: decoded.id ?? decoded.adminId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token",
    });
  }
};
