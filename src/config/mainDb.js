const { Pool } = require("pg");

const mainDb = new Pool({
  connectionString: process.env.SEWAC_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = mainDb;