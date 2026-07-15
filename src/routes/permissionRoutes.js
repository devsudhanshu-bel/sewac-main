const express = require("express");

const router = express.Router();

const permissionController = require("../controllers/permissionController");

router.post(
    "/request",
    permissionController.requestPermission
);

router.get(
    "/approve/:token",
    permissionController.approvePermission
);

router.get(
    "/reject/:token",
    permissionController.rejectPermission
);

module.exports = router;