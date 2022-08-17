const { Pool } = require("pg");
require("dotenv").config();

let pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const db = Promise.promisifyAll(pool, { multiArgs: true });

// Transaction
// Create Message?
// Create 2x Trade Components;
// Create Trade

let messageQuery = `
INSERT INTO messages (user_id, initiated_request, trade_id, content)
 VALUES ($1, (SELECT user_offer_id=$1 FROM trades WHERE id = $2), $2, $3)`;
let tradeQuery = `INSERT INTO trades (user_offer_id, plant_offer_id, user_target_id, plant_target_id) VALUES ($1, $2, $3, $4) RETURNING id`;

let createTrade = async function (
  user_id_one,
  user_id_two,
  plant_id_one,
  plant_id_two
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let tradeId = await client.query(tradeQuery, [
      user_id_one,
      plant_id_one,
      user_id_two,
      plant_id_two,
    ]);
    tradeId = tradeId.rows[0].id;
    await client.query(messageQuery, [1, tradeId, "New trade"]);
    await client.query("COMMIT");
  } catch (e) {
    console.log(e);
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

// {
//   "user_offer_id": 10,
//   "plant_offer_id": 260,
//   "user_target_id": 6,
//   "plant_target_id": 256
// }

createTrade(1, 2, 1, 2);

let createMessage = async function (req, res) {
  const client = await pool.connect();
  try {
    await client.queryAsync("BEGIN");
    await Promise.all([
      client.queryAsync(
        `INSERT INTO messages
          (user_id, trade_id, content)
        VALUES
          ($1, $2, $3)`,
        [req.body.user_id, req.body.trade_id, req.body.content]
      ),
      client.query(`
        UPDATE trades
          set shown_to_user = false

      `),
    ]);
    res.status(201).send();
  } catch (e) {
    console.log(e);
    res.status(500);
  } finally {
    client.release();
  }
};

// addReview: async function (req, res) {
//   const client = await pool.connect();
//   let x = new Date().getTime();
//   let charObj = req.body.characteristics;
//   let reviewValues = [
//     parseInt(req.body.product_id),
//     parseInt(req.body.rating),
//     req.body.name,
//     req.body.email,
//     req.body.summary,
//     req.body.body,
//     null,
//     parseInt(x),
//     false,
//     req.body.recommend,
//     0,
//   ];
//   try {
//     await client.query("BEGIN");
//     let reviewId = await client.query(reviewQuery, reviewValues);
//     let charObjArr = [];
//     for (let k in charObj) {
//       charObjArr.push([parseInt(k), charObj[k]]);
//     }
//     await Promise.all([
//       Promise.all(
//         req.body.photos.map(function (url) {
//           let photoValues = [url, reviewId.rows[0].id];
//           return client.query(photoQuery, photoValues);
//         })
//       ),
//       Promise.all(
//         charObjArr.map(function (charTuple) {
//           return client.query(charsQuery, [
//             ...charTuple,
//             reviewId.rows[0].id,
//           ]);
//         })
//       ),
//     ]);
//     await client.query("COMMIT");
//     res.status(201);
//   } catch (e) {
//     res.status(400);
//     console.log(e);
//     await client.query("ROLLBACK");
//     throw e;
//   } finally {
//     client.release();
//     res.send();
//     return;
//   }
// },
