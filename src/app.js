const express = require("express");
const cors = require("cors");
const overviewRoutes = require("./routes/overviewRoutes");
const citizenRoutes = require("./routes/citizenRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");
const ragRoutes = require("./routes/ragRoutes");

const filterRoutes = require("./routes/filterRoutes");
const wasteGeneratorRoutes = require("./routes/wasteGeneratorRoutes");
const authRoutes = require("./routes/authRoutes");
const logsRoutes = require("./routes/logsRoutes");
const usersRoutes = require("./routes/usersRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const plantRoutes = require("./routes/plantRoutes");
const permissionRoutes = require("./routes/permissionRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
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
app.use("/api/rag", ragRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/plants", plantRoutes);
app.use("/api/permissions",permissionRoutes);
module.exports = app;   