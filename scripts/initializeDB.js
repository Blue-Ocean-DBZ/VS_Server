const pg = require("pg");
require("dotenv").config();
const path = require("path");
const zips_path = path.resolve(process.env.ZIPS_PATH);

let client = new pg.Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const users_table = `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL,
  firebase_id VARCHAR UNIQUE NOT NULL,
  user_status VARCHAR DEFAULT NULL,
  profile_pic VARCHAR DEFAULT NULL,
  city VARCHAR DEFAULT NULL,
  zip VARCHAR NOT NULL,
  county VARCHAR DEFAULT NULL,
  state VARCHAR DEFAULT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  geolocation geography(point) NOT NULL
);`;

const plants_table = `CREATE TABLE plants (
  id SERIAL PRIMARY KEY,
  plant_name VARCHAR NOT NULL,
  photo VARCHAR NOT NULL,
  deleted BOOLEAN DEFAULT false,
  user_id INT,
  CONSTRAINT fk_owner
  FOREIGN KEY(user_id)
  REFERENCES "users"(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

const favorites_table = `CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INT,
  CONSTRAINT fk_user
  FOREIGN KEY(user_id)
  REFERENCES "users"(id),
  distance DOUBLE PRECISION,
  plant_id INT,
  CONSTRAINT fk_plant_id
  FOREIGN KEY(plant_id)
  REFERENCES "plants"(id),
  deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

const messages_table = `CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  trade_id INT,
  CONSTRAINT fk_trade_id
  FOREIGN KEY(trade_id)
  REFERENCES "trades"(id),
  user_id INT,
  CONSTRAINT fk_user_id
  FOREIGN KEY(user_id)
  REFERENCES "users"(id),
  content VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

const trades_table = `CREATE TABLE trades (
  id SERIAL PRIMARY KEY,
  pending BOOLEAN DEFAULT true,
  accepted BOOLEAN DEFAULT NULL,
  user_offer_id INT,
  CONSTRAINT fk_user_offer
  FOREIGN KEY(user_offer_id)
  REFERENCES "users"(id),
  plant_offer_id INT,
  CONSTRAINT fk_plant_offer
  FOREIGN KEY(plant_offer_id)
  REFERENCES "plants"(id),
  user_target_id INT,
  CONSTRAINT fk_user_target
  FOREIGN KEY(user_target_id)
  REFERENCES "users"(id),
  plant_target_id INT,
  CONSTRAINT fk_plant_target
  FOREIGN KEY(plant_target_id)
  REFERENCES "plants"(id),
  shown_to_user_offer BOOLEAN DEFAULT true,
  shown_to_user_target BOOLEAN DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

const trade_components_table = `CREATE TABLE trade_components (
  id SERIAL PRIMARY KEY,
  trade_id INT,
  CONSTRAINT fk_trade_id
  FOREIGN KEY(trade_id)
  REFERENCES "trades"(id),
  plant_id INT,
  CONSTRAINT fk_plant_id
  FOREIGN KEY(plant_id)
  REFERENCES "plants"(id),
  user_id INT,
  CONSTRAINT fk_user_id
  FOREIGN KEY(user_id)
  REFERENCES "plants"(id)
);`;

const zip_coords = `CREATE TABLE zips (
  id SERIAL PRIMARY KEY,
  zip VARCHAR,
  decomissioned DOUBLE PRECISION DEFAULT NULL,
  city VARCHAR DEFAULT NULL,
  state VARCHAR DEFAULT NULL,
  county VARCHAR DEFAULT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  geolocation GEOGRAPHY(point) DEFAULT NULL
)`;

const copy_zip = `COPY zips(zip, decomissioned, city, state, county, latitude, longitude)
FROM '${zips_path}'
DELIMITER ','
CSV HEADER;`;

const geolocationZip = `
UPDATE
  zips
SET
  geolocation = ST_MakePoint(currentZip.longitude, currentZip.latitude)
FROM
  zips currentZip
WHERE
  zips.id = currentZip.id;`;

const firebase_idx = `CREATE INDEX firebase_id ON "users"(firebase_id);`;
const zip_idx = `CREATE INDEX zip_idx ON "zips"(zip);`;
const plant_idx = `CREATE INDEX plants_user_id_idx ON "plants"(user_id);`;
const favorites_idx = `CREATE INDEX favorites_user_id_idx ON "favorites"(user_id);`;
const msg_idx = `CREATE INDEX messages_user_id_idx ON "messages"(user_id);`;
const trade_idx_one = `CREATE INDEX trades_user_offer_id_idx ON "trades"(user_offer_id);`;
const trade_idx_two = `CREATE INDEX trades_user_target_id_idx ON "trades"(user_target_id);`;
const trade_components_idx = `CREATE INDEX trade_components_user_id_idx ON "trade_components"(user_id);`;
const geo_idx = `CREATE INDEX users_geolocation_idx ON "users"(geolocation);`;
const geo_idx2 = `CREATE INDEX zips_geolocation_idx ON "zips"(geolocation);`;

client
  .connect()
  .then(() => {
    return client.query(`CREATE EXTENSION postgis`);
  })
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
    return client.query(geolocationZip);
  })
  .then(() => {
    return client.query(geo_idx2);
  })
  .then(() => {
    return client.query(users_table);
  })
  .then(() => {
    return client.query(geo_idx);
  })
  .then(() => {
    return client.query(firebase_idx);
  })
  .then(() => {
    return client.query(plants_table);
  })
  .then(() => {
    return client.query(plant_idx);
  })
  .then(() => {
    return client.query(favorites_table);
  })
  .then(() => {
    return client.query(favorites_idx);
  })
  .then(() => {
    return client.query(trades_table);
  })
  .then(() => {
    return client.query(trade_idx_one);
  })
  .then(() => {
    return client.query(trade_idx_two);
  })
  .then(() => {
    return client.query(messages_table);
  })
  .then(() => {
    return client.query(msg_idx);
  })
  .then(() => {
    return client.query(trade_components_table);
  })
  .then(() => {
    return client.query(trade_components_idx);
  })
  .then(() => {
    console.log("Tables and indices created, PostGIS extension enabled");
    client.end();
  })
  .catch((err) => {
    console.log(err);
    client.end();
  });
