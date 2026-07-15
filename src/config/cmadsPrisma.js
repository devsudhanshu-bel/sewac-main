const { PrismaClient } = require("../generated/cmads");

const prisma = new PrismaClient();

module.exports = prisma;