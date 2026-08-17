const { PrismaClient: HelperClient } = require("../generated/helper");
const { PrismaClient: SewacClient } = require("../generated/sewac");

const helperPrisma = new HelperClient();
const sewacPrisma = new SewacClient();
const wasteGeneratorService = require("../services/wasteGeneratorService");

/*
===========================================
1. SUMMARY CARDS
===========================================
*/
exports.getAllWasteGenerators = async (req, res) => {
  try {
    /*
    ===========================================
    READ HEADER GEOGRAPHIC FILTERS
    ===========================================
    */
    const { cityId, zoneId, divisionId, wardId } = req.query;

    const data = await wasteGeneratorService.getAllWasteGenerators({
      ...req.query,
      cityId,
      zoneId,
      divisionId,
      wardId,
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getWasteGeneratorByPhone = async (req, res) => {
  try {
    const data = await wasteGeneratorService.getWasteGeneratorByPhone(
      req.params.phoneNumber,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSummary = async (req, res) => {
  try {
    /*
    ===========================================
    READ OVERVIEW HEADER FILTERS
    ===========================================
    
    These values come from the global Header:

    cityId
    zoneId
    divisionId
    wardId

    The controller does NOT interpret these IDs.
    It simply passes them to the service.
    ===========================================
    */

    const { date, cityId, zoneId, divisionId, wardId } = req.query;

    const data = await wasteGeneratorService.getSummary({
      date,
      cityId,
      zoneId,
      divisionId,
      wardId,
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Waste Generator Summary Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
===========================================
2. WASTE GENERATORS DIRECTORY
===========================================
*/
exports.getDirectory = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      cityId,
      zoneId,
      divisionId,
      wardId,
      search,
    } = req.query;

    const directory = await wasteGeneratorService.getAllWasteGenerators({
      page,
      limit,
      cityId,
      zoneId,
      divisionId,
      wardId,
      search,
    });

    res.status(200).json({
      success: true,
      data: directory,
    });
  } catch (error) {
    console.error("Waste Generator Directory Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
===========================================
3. GVP GENERATION TREND
===========================================

Formula:

GVP = Total Waste Collected - Total Waste Generated

===========================================
*/

exports.createWasteGenerator = async (req, res) => {
  try {
    const data = await wasteGeneratorService.createWasteGenerator(
      req.body,
      req,
    );

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateWasteGenerator = async (req, res) => {
  try {
    const data = await wasteGeneratorService.updateWasteGenerator(
      req.params.phoneNumber,
      req.body,
      req,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteWasteGenerator = async (req, res) => {
  try {
    const data = await wasteGeneratorService.deleteWasteGenerator(
      req.params.phoneNumber,
      req,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getGVPTrend = async (req, res) => {
  try {
    const { date, cityId, zoneId, divisionId, wardId } = req.query;

    const data = await wasteGeneratorService.getGVPTrend({
      date,
      cityId,
      zoneId,
      divisionId,
      wardId,
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GVP Trend Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
