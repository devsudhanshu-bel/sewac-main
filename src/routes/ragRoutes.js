const express = require("express");
const router = express.Router();

const ragController = require("../controllers/ragController");

const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/checkPermission");

// RAG query endpoint
router.post(
  "/query",
  authMiddleware,
  checkPermission("rag"),
  ragController.queryRAG
);

module.exports = router;