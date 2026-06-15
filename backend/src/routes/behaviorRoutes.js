const express = require("express");

const authenticate =
require("../middleware/authMiddleware");

const {
  enrollBehavior,
  verifyBehavior,
  getBehaviorProfile,
  getBehaviorHistory
} = require(
  "../controllers/behaviorController"
);

const router =
express.Router();

router.post(
  "/enroll",
  authenticate,
  enrollBehavior
);

router.post(
  "/verify",
  authenticate,
  verifyBehavior
);

router.get(
  "/profile",
  authenticate,
  getBehaviorProfile
);

router.get(
  "/history",
  authenticate,
  getBehaviorHistory
);

module.exports = router;