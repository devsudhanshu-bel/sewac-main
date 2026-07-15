const express = require("express");

const router = express.Router();

const emailController = require("../controllers/emailController");

router.post(
  "/permission-request",
  emailController.sendPermissionRequestEmail
);

module.exports = router;