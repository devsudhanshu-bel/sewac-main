const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");

const usersController = require("../controllers/usersController");

// Get Users
router.get(
  "/",
  authMiddleware,
  checkPermission("users"),
  usersController.getUsers
);

// Create User
router.post(
  "/",
  authMiddleware,
  checkPermission("users"),
  usersController.createUser
);

// Delete User
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("users"),
  usersController.deleteUser
);

router.put(
  "/:id",
  authMiddleware,
  checkPermission("users"),
  usersController.updateUser
);

module.exports = router;