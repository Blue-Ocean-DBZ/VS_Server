const { Pool } = require("pg");
const Promise = require("bluebird");
require("dotenv").config();
const findByLocationQuery = require("./models.js").findByLocationQuery;
const getTradesQuery = require("./models.js").getTradesQuery;
const getFavoritesQuery = require("./models.js").getFavoritesQuery;
const addUserQuery = require("./models.js").addUserQuery;

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
    if (req.body.user_id) {
      return db.queryAsync(
        `
        UPDATE users
          SET profile_pic = $1, zip = $2
        WHERE id = 1;
        `,
        [req.body.profile_pic, req.body.zip]
      );
    } else if (req.body.firebase_id) {
      return db
        .queryAsync(addUserQuery, [
          req.body.username,
          req.body.firebase_id,
          req.body.profile_pic,
          req.body.zip,
        ])
        .then((response) => {
          console.log(response[0].rows[0].id);
          res.status(201).send(response[0].rows[0].id.toString());
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send();
        });
    }
  },

  editUser: function () {
    return;
  },

  addPlant: function (req, res) {
    return db
      .queryAsync(
        `INSERT INTO plants (plant_name, photo, user_id) \
    VALUES ($1, $2, $3) RETURNING id`,
        [req.body.plant_name, req.body.photo, req.body.user_id]
      )
      .then((response) => {
        res.status(201).send(response[0].rows[0].id.toString());
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },

  addToFavorites: function (req, res) {
    return db
      .queryAsync(
        `INSERT INTO favorites (user_id, plant_id) VALUES ($1, $2) RETURNING id`,
        [req.body.user_id, req.body.plant_id]
      )
      .then((response) => {
        res.status(201).send(response[0].rows[0].id.toString());
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },
  removeFromFavorites: function (req, res) {
    return db
      .queryAsync(`UPDATE favorites SET deleted = true WHERE id = $1`, [
        req.query.favorites_id,
      ])
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },

  getTrades: function (req, res) {
    return db
      .query(getTradesQuery, [req.query.user_id])
      .then((response) => {
        res.send(response.rows);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },

  requestTrade: function (req, res) {
    return db
      .queryAsync(
        `INSERT INTO trades (user_offer_id, plant_offer_id, user_target_id, plant_target_id) VALUES ($1, $2, $3, $4) RETURNING id`,
        [
          req.body.user_offer_id,
          req.body.plant_offer_id,
          req.body.user_target_id,
          req.body.plant_target_id,
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

  getMessages: function (req, res) {
    return db
      .queryAsync(
        `SELECT * FROM messages WHERE trade_id = $1 ORDER BY created_at;`,
        [req.query.trade_id]
      )
      .then((response) => {
        res.status(200).send(response[0].rows);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },

  postMessage: function (req, res) {
    return db
      .queryAsync(
        `INSERT INTO messages (user_id, trade_id, content) VALUES ($1, $2, $3)`,
        [req.body.user_id, req.body.trade_id, req.body.content]
      )
      .then(() => {
        res.status(201).send();
      })
      .catch(() => {
        res.status(500).send();
      });
  },

  handleTrade: function (req, res) {
    return db
      .queryAsync(
        `UPDATE trades SET pending = false, accepted = $1 WHERE id = $2`,
        [req.query.accepted, req.query.trade_id]
      )
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        console.log(err);
        res.send();
      });
  },

  showToUser: function (req, res) {
    return db
      .queryAsync(`UPDATE trades SET shown_to_user = true WHERE id = $1`, [
        req.query.trade_id,
      ])
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
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

  getFavorites: function (req, res) {
    return db
      .queryAsync(getFavoritesQuery, [req.query.user_id])
      .then((response) => {
        res.status(200).send(response[0].rows);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },

  getUserId: function (req, res) {
    return db
      .queryAsync(`SELECT id FROM users WHERE session_id = $1`, [
        req.query.firebase_id,
      ])
      .then((response) => {
        console.log(response[0].rows[0]);
        res.status(200).send(response[0].rows[0].id.toString());
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },

  findByLocation: function (req, res) {
    return db
      .queryAsync(findByLocationQuery, [req.query.user_id])
      .then((response) => {
        res.status(200).send(response[0].rows);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },
};

// `INSERT INTO users (username, session_id, profile_pic, zip, longitude, latitude, geolocation) \
//        VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_MakePoint($5, $6), 4326) )`
