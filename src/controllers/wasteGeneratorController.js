const { PrismaClient: HelperClient } = require("../generated/helper");
const { PrismaClient: SewacClient } = require("../generated/sewac");

const helperPrisma = new HelperClient();
const sewacPrisma = new SewacClient();

const wasteGeneratorService = require("../services/wasteGeneratorService");

/*
===========================================
1. SUMMARY CARDS / ALL WASTE GENERATORS
===========================================
*/
exports.getAllWasteGenerators = async (req, res) => {
  try {
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
    console.error("Get All Waste Generators Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
===========================================
GET ONE WASTE GENERATOR
===========================================
*/
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
    console.error("Get Waste Generator Error:", error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/*
===========================================
2. SUMMARY
===========================================
*/
exports.getSummary = async (req, res) => {
  try {
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
3. WASTE GENERATORS DIRECTORY
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
4. CREATE
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
    console.error("Create Waste Generator Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
===========================================
5. UPDATE
===========================================
*/
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
    console.error("Update Waste Generator Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
===========================================
6. DELETE
===========================================
*/
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
    console.error("Delete Waste Generator Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
===========================================
7. GVP GENERATION TREND
===========================================
*/
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

/*
===========================================
8. TELEMETRY MAP
===========================================

Flow:

City
 ↓
Zone
 ↓
Division
 ↓
Ward
 ↓
Date
 ↓
day_DDMMYYYY
 ↓
ALL vehicles assigned to selected ward
 ↓
ALL vehicle_DDMMYYYY tables
 ↓
ALL telemetry latitude / longitude
===========================================
*/
exports.getMap = async (req, res) => {
  try {
    const { date, cityId, zoneId, divisionId, wardId } = req.query;

    /*
    |--------------------------------------------------------------------------
    | REQUIRED PARAMETERS
    |--------------------------------------------------------------------------
    */

    if (!date || !cityId || !zoneId || !divisionId || !wardId) {
      return res.status(400).json({
        success: false,
        message: "date, cityId, zoneId, divisionId and wardId are required",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | GET MAP DATA
    |--------------------------------------------------------------------------
    */

    const data = await wasteGeneratorService.getWasteGeneratorMap({
      date,
      cityId,
      zoneId,
      divisionId,
      wardId,
    });

    /*
    |--------------------------------------------------------------------------
    | SUCCESS RESPONSE
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    console.error("Waste Generator Map Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
