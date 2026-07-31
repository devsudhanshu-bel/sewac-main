const { Pool } = require("pg");

const connectionString = process.env.SEWAC_ZONE_URL || process.env.DATABASE_URL;

const mainDb = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = mainDb;