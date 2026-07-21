const express = require("express");

const authenticate =
  require("../middleware/authMiddleware");

const {
  requestDeviceRegistration,
  approveDeviceRegistration,
  verifyDevice,
  listDevices,
  revokeDevice,
} = require("../controllers/deviceController");

const router = express.Router();

router.post(
  "/request-registration",
  authenticate,
  requestDeviceRegistration
);

router.post(
  "/verify",
  authenticate,
  verifyDevice
);

router.get("/approve", approveDeviceRegistration);

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