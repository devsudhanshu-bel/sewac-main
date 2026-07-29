const express = require("express");

const router = express.Router();

const superAdminMiddleware = require("../middleware/superAdminMiddleware");

const {
  login,
  createAdmin,
  getAdmins,
  deleteAdmin,
} = require("../controllers/superAdminController");

router.post("/login", login);

router.post("/admins", superAdminMiddleware, createAdmin);

router.get("/admins", superAdminMiddleware, getAdmins);

router.delete("/admins/:id", superAdminMiddleware, deleteAdmin);

module.exports = router;
