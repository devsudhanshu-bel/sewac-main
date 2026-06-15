const express = require("express");

const authenticate =
  require("../middleware/authMiddleware");

const {
  evaluateRisk,
  getRiskHistory
} = require(
  "../controllers/riskController"
);

const router =
  express.Router();

router.post(
  "/evaluate",
  authenticate,
  evaluateRisk
);

router.get(
  "/history",
  authenticate,
  getRiskHistory
);

module.exports = router;