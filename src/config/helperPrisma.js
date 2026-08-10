const {
  PrismaClient,
} = require("../generated/helper");

const helperPrisma =
  new PrismaClient();

module.exports = helperPrisma;