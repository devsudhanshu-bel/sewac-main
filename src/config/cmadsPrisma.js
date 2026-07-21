const { PrismaClient } = require("../generated/cmads");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.CMADS_DATABASE_URL || process.env.DATABASE_URL,
    },
  },
});

module.exports = prisma;