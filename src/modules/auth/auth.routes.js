import { Router } from "express";

import authController from "./auth.controller.js";

const router = Router();

/**
 * Authentication Routes
 */

// Login using Phone Number
router.post("/login", authController.login);

// Verify RFID (Coming Soon)
// router.post("/verify", authController.verify);

export default router;