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
    const data = await wasteGeneratorService.getAllWasteGenerators(req.query);

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
    const data = await wasteGeneratorService.getSummary();

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

/*
===========================================
2. WASTE GENERATORS DIRECTORY
===========================================
*/
exports.getDirectory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const directory = await sewacPrisma.telemetry_log.groupBy({
      by: ["wet_rfid"],
      _sum: {
        weightCollected: true,
        weightGenerated: true,
      },
      _max: {
        collectionDate: true,
      },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    res.status(200).json({
      page: pageNumber,
      limit: pageSize,
      data: directory,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch directory",
      details: error.message,
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
exports.getGvpTrend = async (req, res) => {
  try {
    const trend = await sewacPrisma.telemetry_log.groupBy({
      by: ["ward"],
      _sum: {
        weightCollected: true,
        weightGenerated: true,
      },
    });

    const result = trend.map((item) => ({
      ward: item.ward,
      totalCollected: item._sum.weightCollected || 0,
      totalGenerated: item._sum.weightGenerated || 0,
      gvp: (item._sum.weightCollected || 0) - (item._sum.weightGenerated || 0),
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch GVP trend",
      details: error.message,
    });
  }
};

exports.createWasteGenerator = async (req, res) => {
  try {
    const data = await wasteGeneratorService.createWasteGenerator(req.body, req);

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
      req
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
      req
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
    const data = await wasteGeneratorService.getGVPTrend();

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