const pg = require("pg");
require("dotenv").config();

let client = new pg.Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Transaction
// Create Message?
// Create 2x Trade Components;
// Create Trade
