const pg = require("pg");
require("dotenv").config();

let client = new pg.Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

const users_table = `CREATE TABLE users (\
  id SERIAL PRIMARY KEY, \
  username VARCHAR NOT NULL, \
  session_id VARCHAR NOT NULL, \
  profile_pic VARCHAR DEFAULT NULL, \
  zip VARCHAR NOT NULL, \
  longitude DOUBLE PRECISION NOT NULL, \
  latitude DOUBLE PRECISION NOT NULL, \
  geolocation geography(point) NOT NULL \
);`;

const plants_table = `CREATE TABLE plants (\
  id SERIAL PRIMARY KEY, \
  plant_name VARCHAR NOT NULL, \
  photo VARCHAR NOT NULL, \
  deleted BOOLEAN DEFAULT false, \
  owner_id INT, \
  CONSTRAINT fk_owner \
  FOREIGN KEY(owner_id) \
  REFERENCES "users"(id), \
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP \
);`;

const favorites_table = `CREATE TABLE favorites (\
  id SERIAL PRIMARY KEY, \
  user_id INT, \
  CONSTRAINT fk_user \
  FOREIGN KEY(user_id) \
  REFERENCES "users"(id), \
  deleted BOOLEAN DEFAULT false, \
  plant_id INT, \
  CONSTRAINT fk_plant_id \
  FOREIGN KEY(plant_id) \
  REFERENCES "plants"(id), \
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP \
);`;

const messages_table = `CREATE TABLE messages ( \
  id SERIAL PRIMARY KEY, \
  user_id_one INT, \
  CONSTRAINT fk_user_one \
  FOREIGN KEY(user_id_one) \
  REFERENCES "users"(id), \
  user_id_two INT, \
  CONSTRAINT fk_user_two \
  FOREIGN KEY(user_id_two) \
  REFERENCES "users"(id), \
  content VARCHAR NOT NULL, \
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP \
);`;

const trades_table = `CREATE TABLE trades ( \
  id SERIAL PRIMARY KEY, \
  pending BOOLEAN DEFAULT true, \
  accepted BOOLEAN DEFAULT NULL, \
  user_offer_id INT, \
  CONSTRAINT fk_user_offer \
  FOREIGN KEY(user_offer_id) \
  REFERENCES "users"(id), \
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, \
  message_id INT, \
  CONSTRAINT fk_message \
  FOREIGN KEY(message_id) \
  REFERENCES "messages"(id), \
  user_target_id INT, \
  CONSTRAINT fk_user_target \
  FOREIGN KEY(user_target_id) \
  REFERENCES "users"(id) \
);`;

const trade_components_table = `CREATE TABLE trade_components ( \
  id SERIAL PRIMARY KEY, \
  trade_id INT, \
  CONSTRAINT fk_trade_id \
  FOREIGN KEY(trade_id) \
  REFERENCES "trades"(id), \
  plant_id INT, \
  CONSTRAINT fk_plant_id \
  FOREIGN KEY(plant_id) \
  REFERENCES "plants"(id), \
  user_id INT, \
  CONSTRAINT fk_user_id \
  FOREIGN KEY(user_id) \
  REFERENCES "plants"(id) \
);`;

client
  .connect()
  .then(() => {
    return client.query(`CREATE EXTENSION postgis`);
  })
  .then(() => {
    return client.query(users_table);
  })
  .then(() => {
    return client.query(plants_table);
  })
  .then(() => {
    return client.query(favorites_table);
  })
  .then(() => {
    return client.query(messages_table);
  })
  .then(() => {
    return client.query(trades_table);
  })
  .then(() => {
    return client.query(trade_components_table);
  })
  .catch((err) => {
    console.log(err);
  });
