const { PrismaClient } = require("../generated/master_citizen");

const masterCitizenPrisma = new PrismaClient();

module.exports = masterCitizenPrisma;