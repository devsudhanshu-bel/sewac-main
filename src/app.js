import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import routes from "./routes/routes.js";
import internalRoutes from "./routes/internal.routes.js";
import mapRoutes from "./modules/map/map.routes.js";

const app = express();

// ==========================================================
// MIDDLEWARE
// ==========================================================

app.use(cors());

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// ==========================================================
// HEALTH CHECK
// ==========================================================

app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Citizen Backend Running 🚀",
  });
});

// ==========================================================
// EXISTING CITIZEN ROUTES
// ==========================================================

app.use("/api/citizen", routes);

// ==========================================================
// EXISTING INTERNAL ROUTES
// ==========================================================

app.use("/api/internal", internalRoutes);

// ==========================================================
// LIVE VEHICLE ROUTE MAP
// ==========================================================
//
// New endpoint:
//
// GET /api/route-map/live
//
// This does NOT replace the existing:
//
// /api/citizen/map/nearest
// /api/citizen/map/truck/:vehicleId
//
// Those existing routes remain untouched.
//

app.use("/api/route-map", mapRoutes);

// ==========================================================
// 404 HANDLER
// ==========================================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found.",
    data: null,
  });
});

// ==========================================================
// GLOBAL ERROR HANDLER
// ==========================================================

app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
  });
});

export default app;
