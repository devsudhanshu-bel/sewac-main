module.exports = (req, res, next) => {
    const apiKey = req.header("x-api-key");

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: "API Key missing"
        });
    }

    if (apiKey !== process.env.SEWAC_IOT_SECRET_KEY) {
        return res.status(403).json({
            success: false,
            message: "Invalid API Key"
        });
    }

    next();
};