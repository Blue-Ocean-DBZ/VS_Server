const { Pool } = require("pg");
const Promise = require("bluebird");
require("dotenv").config();
const queryModels = require("./models.js");
// const findByLocationQuery = require("./models.js").findByLocationQuery;
// const getTradesQuery = require("./models.js").getTradesQuery;
// const getFavoritesQuery = require("./models.js").getFavoritesQuery;
// const addUserQuery = require("./models.js").addUserQuery;
// const requestTradeQuery = require("./models.js").requestTradeQuery;
// const addToFavoritesQuery = require("./models.js").addToFavoritesQuery;
// const editUserQuery = require("./models.js").editUserQuery;
// const updateQueryOne = require("./models.js").updateQueryOne;
// const updateQueryTwo = require("./models.js").updateQueryTwo;
// const createMessageQuery = require("./models.js").createMessageQuery;
// const updateQueryThree = require("./models.js").updateQueryThree;
// const updateQueryFour = require("./models.js").updateQueryFour;
// const getMyPlantsQuery = require("./models.js").getMyPlants;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const db = Promise.promisifyAll(pool, { multiArgs: true });

//valid zip on update
module.exports = {
  addUser: function (req, res) {
    return db
      .queryAsync(queryModels.addUserQuery, [
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
  },

  editUser: function (req, res) {
    console.log(req.body);
    console.log(queryModels.editUserQuery);
    return db
      .queryAsync(queryModels.editUserQuery, [
        req.body.user_id,
        req.body.zip,
        req.body.profile_pic,
      ])
      .then(() => {
        res.status(204).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },

  getMyPlants: function (req, res) {
    if (req.query.firebase_id) {
      return db
        .queryAsync(queryModels.getMyPlantsQueryFB, [req.query.user_id])
        .then((response) => {
          res.status(200).send(response[0].rows);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send();
        });
    } else {
      return db
        .queryAsync(queryModels.getMyPlantsQuery, [req.query.user_id])
        .then((response) => {
          res.status(200).send(response[0].rows);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send();
        });
    }
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
      .queryAsync(queryModels.addToFavoritesQuery, [
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
    if (req.query.firebase_id) {
      return db
        .query(queryModels.getTradesQueryFB, [req.query.user_id])
        .then((response) => {
          res.send(response.rows);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send();
        });
    } else {
      return db
        .query(queryModels.getTradesQuery, [req.query.user_id])
        .then((response) => {
          res.send(response.rows);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send();
        });
    }
  },

  requestTrade: function (req, res) {
    console.log(req.body);
    return db
      .queryAsync(queryModels.requestTradeQuery, [
        req.body.plant_offer_id,
        req.body.plant_target_id,
      ])
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
        `SELECT * FROM messages m INNER JOIN users u ON u.id = m.user_id WHERE trade_id = $1 ORDER BY created_at;`,
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

  postMessage: async function (req, res) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await Promise.all([
        client.query(queryModels.createMessageQuery, [
          req.body.user_id,
          req.body.trade_id,
          req.body.content,
        ]),
        client.query(queryModels.updateQueryOne, [
          req.body.user_id,
          req.body.trade_id,
        ]),
        client.query(queryModels.updateQueryTwo, [
          req.body.user_id,
          req.body.trade_id,
        ]),
      ]);
      res.status(201);
      client.query("COMMIT");
    } catch (e) {
      console.log(e);
      client.query("ROLLBACK");
      res.status(500);
    } finally {
      client.release();
      res.send();
    }
  },

  handleTrade: async function (req, res) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await Promise.all([
        client.query(
          `UPDATE trades SET pending = false, accepted = $3 WHERE id = $2 AND user_target_id = $1 `,
          [req.body.user_id, req.body.trade_id, req.body.accepted]
        ),
        client.query(queryModels.updateQueryTwo, [
          req.body.user_id,
          req.body.trade_id,
        ]),
      ]);
      client.query("COMMIT");
      res.status(204);
    } catch (e) {
      console.log(e);
      client.query("ROLLBACK");
      res.status(500);
    } finally {
      client.release();
      res.send();
    }
  },

  showToUser: async function (req, res) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await Promise.all([
        client.query(queryModels.updateQueryThree, [
          req.body.user_id,
          req.body.trade_id,
        ]),
        client.query(queryModels.updateQueryFour, [
          req.body.user_id,
          req.body.trade_id,
        ]),
      ]);
      res.status(204);
      client.query("COMMIT");
    } catch (e) {
      console.log(e);
      client.query("ROLLBACK");
      res.status(500);
    } finally {
      client.release();
      res.send();
    }
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
    if (req.query.firebase_id) {
      return db
        .queryAsync(queryModels.getFavoritesQueryFB, [req.query.user_id])
        .then((response) => {
          res.status(200).send(response[0].rows);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send();
        });
    } else {
      return db
        .queryAsync(queryModels.getFavoritesQuery, [req.query.user_id])
        .then((response) => {
          res.status(200).send(response[0].rows);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send();
        });
    }
  },

  getUserInfo: function (req, res) {
    return db
      .queryAsync(`SELECT * FROM users WHERE firebase_id = $1`, [
        req.query.firebase_id,
      ])
      .then((response) => {
        console.log(response[0].rows[0]);
        res.status(200).send(response[0].rows[0]);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },

  findByLocation: function (req, res) {
    if (req.firebase_id) {
      return db
        .queryAsync(queryModels.findByLocationQueryFB, [req.query.user_id])
        .then((response) => {
          res.status(200).send(response[0].rows);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send();
        });
    } else {
      return db
        .queryAsync(queryModels.findByLocationQuery, [req.query.user_id])
        .then((response) => {
          res.status(200).send(response[0].rows);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send();
        });
    }
  },
};
