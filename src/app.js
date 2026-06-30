const express = require("express");

const overviewRoutes = require("./routes/overviewRoutes");
const citizenRoutes = require("./routes/citizenRoutes");
const disposalRoutes = require("./routes/disposalRoutes");
const app = express();

app.use(express.json());

app.use("/api/admin/overview", overviewRoutes);
app.use("/api/admin/citizens", citizenRoutes);
app.use("/api/admin/disposal", disposalRoutes);
module.exports = app;   