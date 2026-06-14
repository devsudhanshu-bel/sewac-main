const express = require("express");

const authenticate =
  require("../middleware/authMiddleware");

const {
  registerDevice,
  verifyDevice,
  listDevices,
  revokeDevice,
} = require("../controllers/deviceController");

const router = express.Router();

router.post(
  "/register",
  authenticate,
  registerDevice
);

router.post(
  "/verify",
  authenticate,
  verifyDevice
);

router.get(
  "/list",
  authenticate,
  listDevices
);

router.put(
  "/revoke/:deviceId",
  authenticate,
  revokeDevice
);

module.exports = router;