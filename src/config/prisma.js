const { PrismaClient: HelperClient } = require("../generated/helper");

const prisma = new HelperClient();

module.exports = prisma;