const express = require("express");
const cors = require("cors");
const dns = require("dns");
const net = require("net");

const securityRoutes = require("./routes/securityRoutes");
const authRoutes = require("./routes/authRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const behaviorRoutes = require("./routes/behaviorRoutes");
const riskRoutes = require("./routes/riskRoutes");
const emailRoutes = require("./routes/emailRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CMADS Security Backend Running",
  });
});

// ===============================
// SMTP DNS TEST
// ===============================
app.get("/smtp-test", (req, res) => {
  dns.lookup("smtp-relay.brevo.com", (err, address, family) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    return res.status(200).json({
      success: true,
      host: "smtp-relay.brevo.com",
      address,
      family,
    });
  });
});

app.get("/smtp-port-test", (req, res) => {
  const socket = new net.Socket();

  socket.setTimeout(10000);

  socket.connect(587, "smtp-relay.brevo.com", () => {
    socket.destroy();
    res.json({
      success: true,
      message: "Port 587 is reachable",
    });
  });

  socket.on("timeout", () => {
    socket.destroy();
    res.status(500).json({
      success: false,
      message: "Timeout connecting to port 587",
    });
  });

  socket.on("error", (err) => {
    socket.destroy();
    res.status(500).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  });
});

// ===============================
// Routes
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/behavior", behaviorRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/super-admin", superAdminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 CMADS Backend running on port ${PORT}`);
});

module.exports = app;
