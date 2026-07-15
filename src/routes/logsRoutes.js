const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");

const logsController = require("../controllers/logsController");

/*
==========================
Summary
==========================
*/

router.get(
  "/summary",
  authMiddleware,
  checkPermission("logs"),
  logsController.getLogsSummary
);

/*
==========================
Audit Logs
==========================
*/

router.get(
  "/audit",
  authMiddleware,
  checkPermission("audit_logs"),
  logsController.getAuditLogs
);

/*
==========================
Edit Logs
==========================
*/

router.get(
  "/edit",
  authMiddleware,
  checkPermission("edit_logs"),
  logsController.getEditLogs
);

module.exports = router;