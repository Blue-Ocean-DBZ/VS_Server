const { Pool } = require("pg");
const Promise = require("bluebird");
const { faker } = require("@faker-js/faker");
require("dotenv").config();
const plantPhotos = require("../data/plantPhotos.js");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const db = Promise.promisifyAll(pool, { multiArgs: true });

// SF [122.4, 37.8]

let populateData = async function () {
  let arr = Array(1000).fill(0);
  await Promise.all(
    arr.map(function (e, i) {
      return db.queryAsync(
        `INSERT INTO users (id, username, firebase_id, profile_pic, zip, longitude, latitude, geolocation) \
         VALUES ($7, $1, $2, $3, $4, $5, $6, ST_SetSRID(ST_MakePoint($5, $6), 4326) )`,
        [
          "user" + (i + 1),
          Math.random(),
          faker.image.image(),
          faker.address.zipCode(),
          parseFloat(faker.address.longitude(124, 120, 4)),
          parseFloat(faker.address.latitude(40, 35, 4)),
          i + 1,
        ]
      );
    })
  );
  let arr2 = Array(1000).fill(0);
  await Promise.all(
    arr2.map(function (e, i) {
      return db.queryAsync(
        `INSERT INTO plants (id, plant_name, photo, user_id) \
      VALUES ($1, $2, $3, $4)`,
        [
          i + 1,
          faker.name.lastName(),
          plantPhotos[Math.floor(Math.random() * 20)],
          (i % 250) + 1,
        ]
      );
    })
  );
  await db.query(`SELECT
      SETVAL(
        (SELECT PG_GET_SERIAL_SEQUENCE('"users"', 'id')),
      (SELECT (MAX("id") + 1) FROM "users"),
      FALSE);`);
  await db.query(`SELECT
  SETVAL(
    (SELECT PG_GET_SERIAL_SEQUENCE('"plants"', 'id')),
  (SELECT (MAX("id") + 1) FROM "plants"),
  FALSE);`);
};

populateData();
