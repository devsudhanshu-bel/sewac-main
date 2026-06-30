const {
  disposalQueue,
  citizenCache,
} = require("../config/citizenCache");

const recordDisposal = async (req, res) => {
  try {
    const { rfidSlno } = req.query;

    if (!rfidSlno) {
      return res.status(400).json({
        success: false,
        message: "rfidSlno required",
      });
    }

    // O(1) Hash lookup
    if (!citizenCache.has(rfidSlno)) {
      return res.status(404).json({
        success: false,
        message: "RFID not registered",
      });
    }

    disposalQueue.push(req.query);

    return res.status(200).json({
      success: true,
      message: "Disposal queued successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  recordDisposal,
};