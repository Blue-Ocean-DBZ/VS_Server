
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL,
  session_id VARCHAR NOT NULL,
  profile_pic VARCHAR DEFAULT NULL,
  zip VARCHAR NOT NULL,
  longitude DECIMAL NOT NULL,
  latitude DECIMAL NOT NULL,
  geolocation GEOGRAPHY(point) NOT NULL
);

CREATE TABLE plants (
  id SERIAL PRIMARY KEY,
  plant_name VARCHAR NOT NULL,
  photo VARCHAR NOT NULL,
  deleted BOOLEAN DEFAULT false,
  user_id INT,
  CONSTRAINT fk_owner
  FOREIGN KEY(user_id)
  REFERENCES "users"(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX plants_user_id_idx ON "plants"(user_id)

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INT,
  CONSTRAINT fk_user
  FOREIGN KEY(user_id)
  REFERENCES "users"(id),
  deleted BOOLEAN DEFAULT false,
  plant_id INT,
  CONSTRAINT fk_plant_id
  FOREIGN KEY(plant_id)
  REFERENCES "plants"(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX favorites_user_id_idx ON "favorites"(user_id)


CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  user_id_one INT,
  CONSTRAINT fk_user_one
  FOREIGN KEY(user_id_one)
  REFERENCES "users"(id),
  user_id_two INT,
  CONSTRAINT fk_user_two
  FOREIGN KEY(user_id_two)
  REFERENCES "users"(id),
  content VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX messages_user_id_one_idx ON "messages"(user_id_one)
CREATE INDEX messages_user_id_two_idx ON "messages"(user_id_two)



CREATE TABLE trades (
  id SERIAL PRIMARY KEY,
  pending BOOLEAN DEFAULT true,
  accepted BOOLEAN DEFAULT NULL,
  shown_to_user BOOLEAN DEFAULT false,
  user_offer_id INT,
  CONSTRAINT fk_user_offer
  FOREIGN KEY(user_offer_id)
  REFERENCES "users"(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  message_id INT,
  CONSTRAINT fk_message
  FOREIGN KEY(message_id)
  REFERENCES "messages"(id),
  user_target_id INT,
  CONSTRAINT fk_user_target
  FOREIGN KEY(user_target_id)
  REFERENCES "users"(id)
);

CREATE INDEX trades_user_offer_id_idx ON "trades"(user_offer_id);
CREATE INDEX trades_user_target_id_idx ON "trades"(user_target_id);

CREATE TABLE trade_components (
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
);

CREATE TABLE zipCoords (
  id SERIAL PRIMARY KEY,
  zip VARCHAR,
  longitude DOUBLE PRECISION,
  latitude DOUBLE PRECISION,
)

CREATE INDEX trade_components_user_id_idx ON "trade_components"(user_id)

