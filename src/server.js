require("dotenv").config();

const app = require("./app");

const { loadCitizenCache } = require("./config/citizenCache");

const PORT = process.env.PORT || 5002;

(async () => {
  try {
    // Load all citizens into RAM before server starts
    await loadCitizenCache();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
})();