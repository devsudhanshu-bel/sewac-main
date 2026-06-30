const express = require("express");
const router = express.Router();

const disposalController = require("../controllers/disposalController");

router.get("/record", disposalController.recordDisposal);

module.exports = router;