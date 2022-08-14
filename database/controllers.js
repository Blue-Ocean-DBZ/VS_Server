const { Pool } = require("pg");
const Promise = require("bluebird");
require("dotenv").config();

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
    console.log(req.body);
    return db
      .queryAsync(
        `INSERT INTO users (username, session_id, profile_pic, zip, longitude, latitude, geolocation) \
       VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_MakePoint($5, $6), 4326) )`,
        [
          req.body.username,
          req.body.session_id,
          req.body.profile_pic,
          req.body.zip,
          req.body.longitude,
          req.body.latitude,
        ]
      )
      .then(() => {
        res.status(201).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },

  editUser: function () {
    return;
  },

  addPlant: function (req, res) {
    return db
      .queryAsync(
        `INSERT INTO plants (plant_name, photo, owner_id) \
    VALUES ($1, $2, $3)`,
        [req.body.plant_name, req.body.photo, req.body.owner_id]
      )
      .then(() => {
        res.status(201).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },

  addToFavorites: function (req, res) {
    return db
      .queryAsync(`INSERT INTO favorites (user_id, plant_id) VALUES ($1, $2)`, [
        req.body.user_id,
        req.body.plant_id,
      ])
      .then(() => {
        res.status(201).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },
  //untested removeFromFavorites
  removeFromFavorites: function (req, res) {
    return db
      .queryAsync(`UPDATE favorites SET deleted = true WHERE id = $1`, [
        req.body.favorites_id,
      ])
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },

  requestTrade: function () {
    return;
  },

  handleTrade: function () {
    return;
  },

  removePlant: function (req, res) {
    console.log(req.query);
    return db
      .queryAsync(`UPDATE plants SET deleted = true WHERE id = $1`, [
        req.query.plant_id,
      ])
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
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
