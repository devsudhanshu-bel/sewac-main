const jwt = require("jsonwebtoken");

const superAdminMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    req.admin = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = superAdminMiddleware;