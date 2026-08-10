export const internalAuth = (req, res, next) => {
  const expectedSecret = process.env.CITIZEN_INTERNAL_API_SECRET;

  const providedSecret = req.headers["x-internal-secret"];

  if (!expectedSecret) {
    console.error("CITIZEN_INTERNAL_API_SECRET is not configured.");

    return res.status(500).json({
      success: false,
      message: "Internal API is not configured.",
    });
  }

  if (!providedSecret || providedSecret !== expectedSecret) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized internal request.",
    });
  }

  next();
};
