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
  addUser: function (req, res) {
    return db
      .query(
        `INSERT INTO users (username, session_id, profile_pic, longitude, latitude) \
       VALUES ($1, $2, $3, $4, $5)`,
        [
          req.params.username,
          req.params.session_id,
          req.params.profile_pic,
          req.params.longitude,
          req.params.latitude,
        ]
      )
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
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
