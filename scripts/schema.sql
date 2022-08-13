CREATE DATABASE vegetationstation;

USE vegetationstation;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL,
  profile_pic VARCHAR DEFAULT NULL,
  longitude DECIMAL NOT NULL,
  latitude DECIMAL NOT NULL,
);

CREATE TABLE plants (
  id SERIAL PRIMARY KEY,
  plant_name VARCHAR NOT NULL,
  photo VARCHAR NOT NULL,
  deleted BOOLEAN DEFAULT false,
  user_id INT,
  CONSTRAINT fk_owner
  FOREIGN KEY(user_id)
  REFERENCES "users"(id)
);

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INT,
  CONSTRAINT fk_user
  FOREIGN KEY(user_id)
  REFERENCES "users"(id)
  plant_id INT,
  CONSTRAINT fk_plant_id
  FOREIGN KEY(plant_id)
  REFERENCES "plants"(id)
);

CREATE TABLE trades (
  id SERIAL PRIMARY KEY,
  pending BOOLEAN DEFAULT true,
  user_offer_id INT,
  CONSTRAINT fk_offer
  FOREIGN KEY(user_offer_id)
  REFERENCES "users"(id),
  user_target_id INT,
  CONSTRAINT fk_offer
  FOREIGN KEY(user_target_id)
  REFERENCES "users"(id)
);

CREATE TABLE trade_components (
  id SERIAL PRIMARY KEY,
  trade_id INT,
  CONSTRAINT fk_trade_id
  FOREIGN KEY(trade_id)
  REFERENCES "trades"(id)
  plant_id INT,
  CONSTRAINT fk_plant_id
  FOREIGN KEY(plant_id)
  REFERENCES "plants"(id)
  user_id INT,
  CONSTRAINT fk_user_id
  FOREIGN KEY(user_id)
  REFERENCES "plants"(id)
);

