const express = require("express");

const controller =
  require("../controllers/masterCitizenWard.controller");

const router = express.Router();

/**
 * =====================================================
 * WARD ROUTES
 * =====================================================
 */

/**
 * =====================================================
 * CREATE WARD
 * =====================================================
 *
 * POST
 * /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards
 */

router.post(
  "/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards",
  controller.createWard
);


/**
 * =====================================================
 * GET ALL WARDS
 * =====================================================
 *
 * GET
 * /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards
 */

router.get(
  "/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards",
  controller.getWards
);


/**
 * =====================================================
 * GET ONE WARD BY WARD NUMBER
 * =====================================================
 *
 * ward_no is the business identifier used by SEWAC.
 *
 * GET
 * /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/no/:wardNo
 *
 * Example:
 *
 * GET
 * /api/master-citizen/cities/1/zones/1/divisions/1/wards/no/25
 */

router.get(
  "/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/no/:wardNo",
  controller.getWard
);


/**
 * =====================================================
 * UPDATE WARD
 * =====================================================
 *
 * PATCH still uses the internal ward_id.
 *
 * PATCH
 * /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/:wardId
 */

router.patch(
  "/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/:wardId",
  controller.updateWard
);


/**
 * =====================================================
 * DELETE WARD
 * =====================================================
 *
 * DELETE still uses the internal ward_id.
 *
 * DELETE
 * /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/:wardId
 */

router.delete(
  "/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/:wardId",
  controller.deleteWard
);


module.exports = router;