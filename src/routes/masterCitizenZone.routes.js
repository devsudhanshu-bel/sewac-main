const express = require("express");

const controller =
  require("../controllers/masterCitizenZone.controller");

const router = express.Router();


/**
 * =====================================================
 * ZONE ROUTES
 * =====================================================
 */


/**
 * Create Zone
 *
 * POST
 * /api/master-citizen/cities/:cityId/zones
 */
router.post(
  "/cities/:cityId/zones",
  controller.createZone
);


/**
 * Get all Zones
 *
 * GET
 * /api/master-citizen/cities/:cityId/zones
 */
router.get(
  "/cities/:cityId/zones",
  controller.getZones
);


/**
 * Get one Zone
 *
 * GET
 * /api/master-citizen/cities/:cityId/zones/:zoneId
 */
router.get(
  "/cities/:cityId/zones/:zoneId",
  controller.getZone
);


/**
 * Update Zone
 *
 * PATCH
 * /api/master-citizen/cities/:cityId/zones/:zoneId
 */
router.patch(
  "/cities/:cityId/zones/:zoneId",
  controller.updateZone
);


/**
 * Delete Zone
 *
 * DELETE
 * /api/master-citizen/cities/:cityId/zones/:zoneId
 */
router.delete(
  "/cities/:cityId/zones/:zoneId",
  controller.deleteZone
);


module.exports = router;