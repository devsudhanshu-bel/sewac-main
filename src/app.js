// src/app.js

const express = require("express");

const overviewRoutes = require("./routes/overviewRoutes");

const app = express();

app.use(express.json());

app.use("/api/admin/overview", overviewRoutes);

module.exports = app;