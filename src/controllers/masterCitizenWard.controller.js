const service =
  require("../services/masterCitizenWard.service");

/**
 * =====================================================
 * CREATE WARD
 * =====================================================
 */

async function createWard(req, res) {
  try {
    const cityId =
      Number(req.params.cityId);

    const zoneId =
      Number(req.params.zoneId);

    const divisionId =
      Number(req.params.divisionId);

    const {
      wardNo,
      wardName,
      geoBoundary,
    } = req.body;

    const ward =
      await service.createWard({
        cityId,
        zoneId,
        divisionId,
        wardNo: Number(wardNo),
        wardName,
        geoBoundary,
      });

    return res.status(201).json({
      success: true,
      message: "Ward created successfully",
      data: ward,
    });

  } catch (error) {
    console.error(
      "Create ward error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


/**
 * =====================================================
 * GET ALL WARDS
 * =====================================================
 */

async function getWards(req, res) {
  try {
    const cityId =
      Number(req.params.cityId);

    const zoneId =
      Number(req.params.zoneId);

    const divisionId =
      Number(req.params.divisionId);

    const wards =
      await service.getWards(
        cityId,
        zoneId,
        divisionId
      );

    return res.status(200).json({
      success: true,
      count: wards.length,
      data: wards,
    });

  } catch (error) {
    console.error(
      "Get wards error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


/**
 * =====================================================
 * GET ONE WARD BY WARD NUMBER
 * =====================================================
 *
 * Route:
 *
 * GET
 * /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/no/:wardNo
 *
 * Example:
 *
 * GET
 * /api/master-citizen/cities/1/zones/2/divisions/1/wards/no/12
 *
 */

async function getWard(req, res) {
  try {
    const cityId =
      Number(req.params.cityId);

    const zoneId =
      Number(req.params.zoneId);

    const divisionId =
      Number(req.params.divisionId);

    // IMPORTANT:
    // The route now uses :wardNo,
    // NOT :wardId.
    const wardNo =
      Number(req.params.wardNo);

    if (
      !Number.isInteger(cityId) ||
      !Number.isInteger(zoneId) ||
      !Number.isInteger(divisionId) ||
      !Number.isInteger(wardNo)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid city ID, zone ID, division ID or ward number",
      });
    }

    const ward =
      await service.getWard(
        cityId,
        zoneId,
        divisionId,
        wardNo
      );

    return res.status(200).json({
      success: true,
      message: "Ward fetched successfully",
      data: ward,
    });

  } catch (error) {
    console.error(
      "Get ward error:",
      error
    );

    const statusCode =
      error.message === "Ward not found"
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
}


/**
 * =====================================================
 * UPDATE WARD
 * =====================================================
 *
 * PATCH still uses the internal ward_id.
 *
 * Route:
 *
 * PATCH
 * /api/master-citizen/cities/:cityId/zones/:zoneId/divisions/:divisionId/wards/:wardId
 *
 */

async function updateWard(req, res) {
  try {
    const cityId =
      Number(req.params.cityId);

    const zoneId =
      Number(req.params.zoneId);

    const divisionId =
      Number(req.params.divisionId);

    const wardId =
      Number(req.params.wardId);

    const {
      wardNo,
      wardName,
      geoBoundary,
    } = req.body;

    const ward =
      await service.updateWard(
        cityId,
        zoneId,
        divisionId,
        wardId,
        {
          wardNo:
            wardNo !== undefined
              ? Number(wardNo)
              : undefined,

          wardName,

          geoBoundary,
        }
      );

    return res.status(200).json({
      success: true,
      message: "Ward updated successfully",
      data: ward,
    });

  } catch (error) {
    console.error(
      "Update ward error:",
      error
    );

    const statusCode =
      error.message === "Ward not found"
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
}


/**
 * =====================================================
 * DELETE WARD
 * =====================================================
 *
 * DELETE still uses the internal ward_id.
 *
 */

async function deleteWard(req, res) {
  try {
    const cityId =
      Number(req.params.cityId);

    const zoneId =
      Number(req.params.zoneId);

    const divisionId =
      Number(req.params.divisionId);

    const wardId =
      Number(req.params.wardId);

    const result =
      await service.deleteWard(
        cityId,
        zoneId,
        divisionId,
        wardId
      );

    return res.status(200).json({
      success: true,
      message: "Ward deleted successfully",
      data: result,
    });

  } catch (error) {
    console.error(
      "Delete ward error:",
      error
    );

    const statusCode =
      error.message === "Ward not found"
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
}


/**
 * =====================================================
 * EXPORTS
 * =====================================================
 */

module.exports = {
  createWard,
  getWards,
  getWard,
  updateWard,
  deleteWard,
};