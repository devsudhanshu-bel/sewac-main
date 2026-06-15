// src/config/helperDb.js

const { Pool } = require("pg");

const helperDb = new Pool({
  connectionString: process.env.HELPER_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = helperDb;