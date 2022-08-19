const { Pool } = require("pg");
const Promise = require("bluebird");
require("dotenv").config();
const queryModels = require("./models.js");

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
        console.log("addUser error", err);
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
        console.log("editUser error", err);
        res.status(500).send();
      });
  },

  getMyPlants: function (req, res) {
    if (req.query.firebase_id) {
      return db
        .queryAsync(queryModels.getMyPlantsQueryFB, [req.query.firebase_id])
        .then((response) => {
          res.status(200).send(response[0].rows);
        })
        .catch((err) => {
          console.log("getMyPlantsFB error", err);
          res.status(500).send();
        });
    } else {
      return db
        .queryAsync(queryModels.getMyPlantsQuery, [req.query.user_id])
        .then((response) => {
          res.status(200).send(response[0].rows);
        })
        .catch((err) => {
          console.log("getMyPlants error", err);
          res.status(500).send();
        });
    }
  },

  addPlant: function (req, res) {
    return db
      .queryAsync(queryModels.addPlantQuery, [
        req.body.plant_name,
        req.body.photo,
        req.body.user_id,
      ])
      .then(() => {
        res.status(201).send();
      })
      .catch((err) => {
        console.log("addPlant error", err);
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
        console.log("addToFavorites error", err);
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
        console.log("removeFromFavorites error", err);
        res.status(500).send();
      });
  },

  getTrades: function (req, res) {
    if (req.query.firebase_id) {
      return db
        .query(queryModels.getTradesQueryFB, [req.query.firebase_id])
        .then((response) => {
          res.send(response.rows);
        })
        .catch((err) => {
          console.log("getTradesFB error", err);
          res.status(500).send();
        });
    } else {
      return db
        .query(queryModels.getTradesQuery, [req.query.user_id])
        .then((response) => {
          res.send(response.rows);
        })
        .catch((err) => {
          console.log("getTrades error", err);
          res.status(500).send();
        });
    }
  },

  requestTrade: async function (req, res) {
    console.log(req.body);
    const client = await pool.connect();
    try {
      client.query("BEGIN");
      await Promise.all([
        client.query(queryModels.requestTradeQuery, [
          req.body.plant_offer_id,
          req.body.plant_target_id,
        ]),
        client.query(queryModels.updateQueryOne, [
          req.body.user_id,
          req.body.trade_id,
        ]),
      ]);
      res.status(201);
      client.query("COMMIT");
    } catch (e) {
      console.log("requestTrade error", e);
      res.status(500);
      client.query("ROLLBACK");
    } finally {
      client.release();
      res.send();
    }
    // return db
    //   .queryAsync(queryModels.requestTradeQuery, [
    //     req.body.plant_offer_id,
    //     req.body.plant_target_id,
    //   ])
    //   .then(() => {
    //     res.status(201).send();
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     res.status(500).send();
    //   });
  },

  getMessages: function (req, res) {
    return db
      .queryAsync(queryModels.getMessagesQuery, [req.query.trade_id])
      .then((response) => {
        res.status(200).send(response[0].rows);
      })
      .catch((err) => {
        console.log("getMessages error", err);
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
      console.log("postMessages error", e);
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
        client.query(queryModels.handleTradeQuery, [
          req.body.user_id,
          req.body.trade_id,
          req.body.accepted,
        ]),
        client.query(queryModels.updateQueryTwo, [
          req.body.user_id,
          req.body.trade_id,
        ]),
      ]);
      client.query("COMMIT");
      res.status(204);
    } catch (e) {
      console.log("handleTrade error", e);
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
      console.log("showToUser error", e);
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
        console.log("removePlant error", err);
        res.status(500).send();
      });
  },

  getFavorites: function (req, res) {
    if (req.query.firebase_id) {
      return db
        .queryAsync(queryModels.getFavoritesQueryFB, [req.query.firebase_id])
        .then((response) => {
          res.status(200).send(response[0].rows);
        })
        .catch((err) => {
          console.log("getFavoritesFB error", err);
          res.status(500).send();
        });
    } else {
      return db
        .queryAsync(queryModels.getFavoritesQuery, [req.query.user_id])
        .then((response) => {
          res.status(200).send(response[0].rows);
        })
        .catch((err) => {
          console.log("getFavorites error", err);
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
        console.log("getUserInfo error", err);
        res.status(500).send();
      });
  },

  findByLocation: function (req, res) {
    if (req.query.firebase_id) {
      console.log("we here");
      return db
        .queryAsync(queryModels.findByLocationQueryFB, [req.query.firebase_id])
        .then((response) => {
          res.status(200).send(response[0].rows);
        })
        .catch((err) => {
          console.log("findByLocationFB error", err);
          res.status(500).send();
        });
    } else {
      return db
        .queryAsync(queryModels.findByLocationQuery, [req.query.user_id])
        .then((response) => {
          res.status(200).send(response[0].rows);
        })
        .catch((err) => {
          console.log("findByLocation error", err);
          res.status(500).send();
        });
    }
  },
};
