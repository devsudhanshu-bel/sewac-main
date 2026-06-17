const express = require("express");

const overviewRoutes = require("./routes/overviewRoutes");
const citizenRoutes = require("./routes/citizenRoutes");

const app = express();

app.use(express.json());

app.use("/api/admin/overview", overviewRoutes);
app.use("/api/admin/citizens", citizenRoutes);

module.exports = app;