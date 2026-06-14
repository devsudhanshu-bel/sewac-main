const express = require("express");
const cors = require("cors");
const securityRoutes = require("./routes/securityRoutes");
const authRoutes = require("./routes/authRoutes");
const deviceRoutes = require("./routes/deviceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CMADS Security Backend Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/devices", deviceRoutes);
module.exports = app;