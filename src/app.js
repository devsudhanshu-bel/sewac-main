import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import routes from "./routes/routes.js";
import internalRoutes from "./routes/internal.routes.js";
import mapRoutes from "./modules/map/map.routes.js";

const app = express();

/**
 * =====================================================
 * Middlewares
 * =====================================================
 */

app.use(cors());

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/**
 * =====================================================
 * Health Check
 * =====================================================
 */

app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Citizen Backend Running 🚀",
  });
});

/**
 * =====================================================
 * API Routes
 * =====================================================
 */

app.use("/api/citizen", routes);

app.use("/api/internal", internalRoutes);

/**
 * =====================================================
 * LIVE VEHICLE ROUTE MAP
 * =====================================================
 *
 * GET:
 *
 * /api/route-map/live
 *
 * This uses the existing map module.
 *
 * Existing citizen map routes remain untouched:
 *
 * /api/citizen/map/nearest
 * /api/citizen/map/truck/:vehicleId
 *
 */

app.use("/api/route-map", mapRoutes);

/**
 * =====================================================
 * 404 Handler
 * =====================================================
 */

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found.",
    data: null,
  });
});

/**
 * =====================================================
 * Global Error Handler
 * =====================================================
 */

app.use((err, req, res, next) => {
  console.error(err);

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    data: null,
  });
});

export default app;
