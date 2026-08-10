const express = require("express");

const controller = require("../controllers/masterCitizenCity.controller");

const router = express.Router();

/**
 * Create a new city
 *
 * POST /api/master-citizen/cities
 */
router.post("/cities", controller.createCity);

/**
 * Get all cities
 *
 * GET /api/master-citizen/cities
 */
router.get("/cities", controller.getCities);

/**
 * Get one city
 *
 * GET /api/master-citizen/cities/:cityId
 */
router.get("/cities/:cityId", controller.getCity);

module.exports = router;