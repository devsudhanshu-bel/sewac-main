const { askGroq } = require("../services/groq.service");

const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const reply = await askGroq(message);

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports = {
  chat,
};