import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import routes from "./routes/routes.js";

const app = express();

/**
 * Middlewares
 */
app.use(cors());

app.use(helmet());

app.use(compression());

app.use(morgan("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/**
 * Health Check
 */
app.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Citizen Backend Running 🚀",
  });
});

/**
 * API Routes
 */
app.use("/api/citizen", routes);

/**
 * 404 Handler
 */
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found.",
    data: null,
  });
});

/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

export default app;