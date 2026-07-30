const express = require("express");
const cors = require("cors");

const overviewRoutes = require("./routes/overviewRoutes");
const citizenRoutes = require("./routes/citizenRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");
const ragRoutes = require("./routes/ragRoutes");
const iotRoutes = require("./routes/iotRoutes");
const filterRoutes = require("./routes/filterRoutes");
const wasteGeneratorRoutes = require("./routes/wasteGeneratorRoutes");
const authRoutes = require("./routes/authRoutes");
const logsRoutes = require("./routes/logsRoutes");
const usersRoutes = require("./routes/usersRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const plantRoutes = require("./routes/plantRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const redisRoutes = require("./routes/redisRoutes");

const app = express();

const allowedOrigins = [
  "https://app-authentication-frontend.onrender.com",
  "https://sewac-main-frontend.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/filters", filterRoutes);
app.use("/api/admin/overview", overviewRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/admin/citizens", citizenRoutes);
app.use("/api/admin/telemetry", telemetryRoutes);
app.use("/api/waste-generators", wasteGeneratorRoutes);
app.use("/api/iot", iotRoutes);
app.use("/api/rag", ragRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/redis", redisRoutes);




module.exports = app;