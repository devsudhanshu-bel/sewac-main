const groq = require("../config/groq");

const askGroq = async (message) => {
  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are SEWAC AI Assistant. Answer professionally and concisely.",
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return completion.choices[0].message.content;
};

module.exports = {
  askGroq,
};