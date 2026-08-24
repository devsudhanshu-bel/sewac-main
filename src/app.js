import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import routes from "./routes/routes.js";
import internalRoutes from "./routes/internal.routes.js";


const app =
  express();


// =====================================================
// MIDDLEWARES
// =====================================================

app.use(
  cors()
);

app.use(
  helmet()
);

app.use(
  compression()
);

app.use(
  morgan("dev")
);

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true
  })
);


// =====================================================
// HEALTH
// =====================================================

app.get(
  "/health",
  (req, res) => {

    return res
      .status(200)
      .json({

        success: true,

        message:
          "Citizen Backend Running 🚀",

      });

  }
);


// =====================================================
// CITIZEN API
// =====================================================

app.use(
  "/api/citizen",
  routes
);


// =====================================================
// INTERNAL API
// =====================================================

app.use(
  "/api/internal",
  internalRoutes
);


// =====================================================
// 404
// =====================================================

app.use(
  (req, res) => {

    return res
      .status(404)
      .json({

        success: false,

        message:
          "Route not found.",

        data: null,

      });

  }
);


// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (
    err,
    req,
    res,
    next
  ) => {

    console.error(err);

    return res
      .status(
        err.status || 500
      )
      .json({

        success: false,

        message:
          err.message ||
          "Internal Server Error",

        data: null,

      });

  }
);


export default app;
