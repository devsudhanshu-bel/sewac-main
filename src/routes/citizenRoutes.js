const express = require("express");

const router = express.Router();

const citizenController = require("../controllers/citizenController");

router.get("/search", citizenController.searchCitizen);
router.get("/all", citizenController.getAllCitizens);
module.exports = router;