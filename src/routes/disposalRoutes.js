const express = require("express");
const router = express.Router();

const disposalController = require("../controllers/disposalController");

const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");

// Disposal record access
router.get(
  "/record",
  authMiddleware,
  checkPermission("logs"),
  disposalController.recordDisposal
);

module.exports = router;