const { Pool } = require("pg");
const Promise = require("bluebird");
require("dotenv").config();
const findByLocationQuery = require("./models.js").findByLocationQuery;

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
        `
      WITH coords AS (SELECT * FROM zips WHERE zip = $4)
      INSERT INTO users
      (username, session_id, profile_pic, zip, longitude, latitude, geolocation)
      VALUES ($1, $2, $3, $4,
        (SELECT longitude FROM coords),
        (SELECT latitude FROM coords),
        ST_SetSRID(ST_MakePoint(
          (SELECT longitude FROM coords), (SELECT latitude FROM coords)
          ), 4326
        ))
      RETURNING id;
      `,
        [
          req.body.username,
          req.body.session_id,
          req.body.profile_pic,
          req.body.zip,
        ]
      )
      .then((response) => {
        console.log(response[0].rows[0].id);
        res.status(201).send(response[0].rows[0].id.toString());
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
      .query(
        `SELECT JSON_AGG(tradeObj)
        FROM
          (
            SELECT JSON_BUILD_OBJECT(
            'trade_id', trades.id,
            'target', targetTable.plantObj,
            'offer', offerTable.plantObj,
            'created_at', trades.created_at,
            'pending', trades.pending,
            'accepted', trades.accepted,
            'shown_to_user', trades.shown_to_user
            ) tradesObj
          FROM
            trades
          INNER JOIN
            (
              SELECT
                t.id,
                JSON_BUILD_OBJECT
                (
                  'plant_id', p.id,
                  'photo', p.photo,
                  'owner_id', p.user_id,
                  'username', u.username
                ) plantObj
              FROM
                trades t
              INNER JOIN
                plants p
              ON
                p.user_id = user_target_id
              AND
                p.id = t.plant_target_id
              AND
                p.deleted = false
              INNER JOIN
                users u
              ON
                u.id = p.id
              ) targetTable
          ON targetTable.id = trades.id
          INNER JOIN
            (
              SELECT t.id,
              JSON_BUILD_OBJECT
              (
                'plant_id', p.id,
                'photo', p.photo,
                'owner_id', p.user_id,
                'username', u.username
              ) plantObj
              FROM
                trades t
              INNER JOIN
                plants p
              ON
                p.user_id = user_offer_id
              AND
                p.id = t.plant_offer_id
              AND
                p.deleted = false
              INNER JOIN
                users u
              ON
                u.id = p.id
            ) offerTable
          ON
            offerTable.id = targetTable.id
          WHERE
            trades.user_target_id = $1
          ORDER BY
            trades.created_at DESC) tradeObj;`,
        [req.query.user_id]
      )
      .then((response) => {
        console.log(response);
        res.send(response.rows[0].json_agg);
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
      .queryAsync(
        `
      SELECT
        f.id favorites_id,
        p.id plant_id,
        p.photo,
        p.user_id owner_id,
        p.created_at
      FROM
        plants p
      INNER JOIN
        favorites f
      ON
        f.plant_id = p.id
      WHERE
        p.deleted = false
      AND
        f.user_id = $1
      AND
        f.deleted = false;
    `,
        [req.query.user_id]
      )
      .then((response) => {
        res.status(200).send(response[0].rows);
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
        res.status(200).send(response[0].rows[0].json_build_object);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },
};

// `INSERT INTO users (username, session_id, profile_pic, zip, longitude, latitude, geolocation) \
//        VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_MakePoint($5, $6), 4326) )`
