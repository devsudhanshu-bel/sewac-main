import express from "express";

import {
  requestVerification,
  verifyOTP,
} from "../modules/complaint/complaint.internal.controller.js";

import { internalAuth } from "../middlewares/internalAuth.middleware.js";

const router = express.Router();

router.get("/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Internal API is reachable.",
  });
});

router.post(
  "/complaints/:ticketNumber/request-verification",
  internalAuth,
  requestVerification,
);

router.post("/complaints/:ticketNumber/verify", internalAuth, verifyOTP);

export default router;
