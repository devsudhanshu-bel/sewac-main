const express = require("express");

const controller =
  require("../controllers/masterCitizenDivision.controller");

const router = express.Router();


/**
 * =====================================================
 * DIVISION ROUTES
 * =====================================================
 */


/**
 * Create Division
 *
 * POST
 * /api/master-citizen/cities/:cityId/zones/:zoneId/divisions
 */
router.post(
  "/cities/:cityId/zones/:zoneId/divisions",
  controller.createDivision
);


/**
 * Get all Divisions
 *
 * GET
 * /api/master-citizen/cities/:cityId/zones/:zoneId/divisions
 */
router.get(
  "/cities/:cityId/zones/:zoneId/divisions",
  controller.getDivisions
);


/**
 * Get one Division
 *
 * GET
 * /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId
 */
router.get(
  "/cities/:cityId/zones/:zoneId/divisions/:divisionId",
  controller.getDivision
);


/**
 * Update Division
 *
 * PATCH
 * /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId
 */
router.patch(
  "/cities/:cityId/zones/:zoneId/divisions/:divisionId",
  controller.updateDivision
);


/**
 * Delete Division
 *
 * DELETE
 * /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId
 */
router.delete(
  "/cities/:cityId/zones/:zoneId/divisions/:divisionId",
  controller.deleteDivision
);


module.exports = router;