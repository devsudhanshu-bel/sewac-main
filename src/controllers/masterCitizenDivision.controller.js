const service =
  require("../services/masterCitizenDivision.service");


/**
 * =====================================================
 * CREATE
 * =====================================================
 */

async function createDivision(req, res) {
  try {

    const cityId =
      Number(req.params.cityId);

    const zoneId =
      Number(req.params.zoneId);


    const {
      divisionName,
      geoBoundary,
    } = req.body;


    const division =
      await service.createDivision({
        cityId,
        zoneId,
        divisionName,
        geoBoundary,
      });


    return res.status(201).json({
      success: true,
      message:
        "Division created successfully",
      data: division,
    });

  } catch (error) {

    console.error(
      "Create division error:",
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
 * GET ALL
 * =====================================================
 */

async function getDivisions(req, res) {
  try {

    const cityId =
      Number(req.params.cityId);

    const zoneId =
      Number(req.params.zoneId);


    const divisions =
      await service.getDivisions(
        cityId,
        zoneId
      );


    return res.status(200).json({
      success: true,
      count: divisions.length,
      data: divisions,
    });

  } catch (error) {

    console.error(
      "Get divisions error:",
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
 * GET ONE
 * =====================================================
 */

async function getDivision(req, res) {
  try {

    const cityId =
      Number(req.params.cityId);

    const zoneId =
      Number(req.params.zoneId);

    const divisionId =
      Number(req.params.divisionId);


    const division =
      await service.getDivision(
        cityId,
        zoneId,
        divisionId
      );


    return res.status(200).json({
      success: true,
      data: division,
    });

  } catch (error) {

    console.error(
      "Get division error:",
      error
    );


    const statusCode =
      error.message ===
      "Division not found"
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
 * UPDATE
 * =====================================================
 */

async function updateDivision(req, res) {
  try {

    const cityId =
      Number(req.params.cityId);

    const zoneId =
      Number(req.params.zoneId);

    const divisionId =
      Number(req.params.divisionId);


    const {
      divisionName,
      geoBoundary,
    } = req.body;


    const division =
      await service.updateDivision(
        cityId,
        zoneId,
        divisionId,
        {
          divisionName,
          geoBoundary,
        }
      );


    return res.status(200).json({
      success: true,
      message:
        "Division updated successfully",
      data: division,
    });

  } catch (error) {

    console.error(
      "Update division error:",
      error
    );


    const statusCode =
      error.message ===
      "Division not found"
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
 * DELETE
 * =====================================================
 */

async function deleteDivision(req, res) {
  try {

    const cityId =
      Number(req.params.cityId);

    const zoneId =
      Number(req.params.zoneId);

    const divisionId =
      Number(req.params.divisionId);


    const result =
      await service.deleteDivision(
        cityId,
        zoneId,
        divisionId
      );


    return res.status(200).json({
      success: true,
      message:
        "Division deleted successfully",
      data: result,
    });

  } catch (error) {

    console.error(
      "Delete division error:",
      error
    );


    const statusCode =
      error.message ===
      "Division not found"
        ? 404
        : 400;


    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
}


module.exports = {
  createDivision,
  getDivisions,
  getDivision,
  updateDivision,
  deleteDivision,
};