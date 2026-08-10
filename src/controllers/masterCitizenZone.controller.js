const service = require("../services/masterCitizenZone.service");


/**
 * =====================================================
 * CREATE
 * =====================================================
 */

async function createZone(req, res) {
  try {

    const cityId =
      Number(req.params.cityId);

    const {
      zoneName,
      geoBoundary,
    } = req.body;


    const zone =
      await service.createZone({
        cityId,
        zoneName,
        geoBoundary,
      });


    return res.status(201).json({
      success: true,
      message: "Zone created successfully",
      data: zone,
    });

  } catch (error) {

    console.error(
      "Create zone error:",
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

async function getZones(req, res) {
  try {

    const cityId =
      Number(req.params.cityId);


    const zones =
      await service.getZones(cityId);


    return res.status(200).json({
      success: true,
      count: zones.length,
      data: zones,
    });

  } catch (error) {

    console.error(
      "Get zones error:",
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

async function getZone(req, res) {
  try {

    const cityId =
      Number(req.params.cityId);

    const zoneId =
      Number(req.params.zoneId);


    const zone =
      await service.getZone(
        cityId,
        zoneId
      );


    return res.status(200).json({
      success: true,
      data: zone,
    });

  } catch (error) {

    console.error(
      "Get zone error:",
      error
    );


    const statusCode =
      error.message === "Zone not found"
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

async function updateZone(req, res) {
  try {

    const cityId =
      Number(req.params.cityId);

    const zoneId =
      Number(req.params.zoneId);


    const {
      zoneName,
      geoBoundary,
    } = req.body;


    const zone =
      await service.updateZone(
        cityId,
        zoneId,
        {
          zoneName,
          geoBoundary,
        }
      );


    return res.status(200).json({
      success: true,
      message: "Zone updated successfully",
      data: zone,
    });

  } catch (error) {

    console.error(
      "Update zone error:",
      error
    );


    const statusCode =
      error.message === "Zone not found"
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

async function deleteZone(req, res) {
  try {

    const cityId =
      Number(req.params.cityId);

    const zoneId =
      Number(req.params.zoneId);


    const result =
      await service.deleteZone(
        cityId,
        zoneId
      );


    return res.status(200).json({
      success: true,
      message: "Zone deleted successfully",
      data: result,
    });

  } catch (error) {

    console.error(
      "Delete zone error:",
      error
    );


    const statusCode =
      error.message === "Zone not found"
        ? 404
        : 400;


    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
}


module.exports = {
  createZone,
  getZones,
  getZone,
  updateZone,
  deleteZone,
};