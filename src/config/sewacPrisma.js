const { PrismaClient: SewacClient } = require("../generated/sewac");

const prisma = new SewacClient();

module.exports = prisma;