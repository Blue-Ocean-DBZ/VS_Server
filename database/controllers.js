const { Pool } = require("pg");
const Promise = require("bluebird");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const db = Promise.promisifyAll(pool, { multiArgs: true });

module.exports = {
  addUser: function () {
    return db;
  },

  editUser: function () {
    return;
  },

  addPlant: function () {
    return;
  },

  addToFavorites: function () {
    return;
  },

  removeFromFavorites: function () {
    return;
  },

  requestTrade: function () {
    return;
  },

  handleTrade: function () {
    return;
  },

  removePlant: function () {
    return;
  },

  findByLocation: function () {
    return;
  },
};

// 20 mi => 32186.9 meters;
// 150 mi => 241402 meters;
// addPlant
// findByLocation
// addToFavorites
// requestTrade
// handleTrade
// addUser
// editUser
// removePlant
// removeFromFavorites
