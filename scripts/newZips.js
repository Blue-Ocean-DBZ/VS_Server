const pg = require("pg");
require("dotenv").config();
const path = require("path");
const zips_path = path.resolve("/tmp/zip_code_database_truncated.csv");

let client = new pg.Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const zip_coords = `CREATE TABLE zips (
  id SERIAL PRIMARY KEY,
  zip VARCHAR,
  decomissioned INT DEFAULT NULL,
  city VARCHAR DEFAULT NULL,
  state VARCHAR DEFAULT NULL,
  county VARCHAR DEFAULT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
)`;

const copy_zip = `COPY zips(zip, decomissioned, city, state, county, latitude, longitude)
FROM '${zips_path}'
DELIMITER ','
CSV HEADER;`;

const zip_idx = `CREATE INDEX zip_idx ON "zips"(zip);`;

client
  .connect()
  .then(() => {
    return client.query(zip_coords);
  })
  .then(() => {
    return client.query(zip_idx);
  })
  .then(() => {
    return client.query(copy_zip);
  })
  .then(() => {
    client.end();
  });
