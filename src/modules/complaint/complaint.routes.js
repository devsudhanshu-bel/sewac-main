import { Router } from "express";

import complaintController from "./complaint.controller.js";

import authMiddleware from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/upload.middleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  complaintController.createComplaint
);

router.get(
  "/",
  authMiddleware,
  complaintController.getComplaints
);

export default router;