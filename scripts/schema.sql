
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL,
  firebase_id VARCHAR UNIQUE NOT NULL,
  profile_pic VARCHAR DEFAULT NULL,
  zip VARCHAR NOT NULL,
  longitude DECIMAL NOT NULL,
  latitude DECIMAL NOT NULL,
  geolocation GEOGRAPHY(point) NOT NULL
);

CREATE INDEX users_geolocation_idx ON "users"(geolocation);
CREATE INDEX firebase_id ON "users"(firebase_id);



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
  distance DOUBLE PRECISION,
  CONSTRAINT fk_plant_id
  FOREIGN KEY(plant_id)
  REFERENCES "plants"(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX favorites_user_id_idx ON "favorites"(user_id)


CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  user_id INT,
  CONSTRAINT fk_user_id
  FOREIGN KEY(user_id)
  REFERENCES "users"(id),
  trade_id INT,
  CONSTRAINT fk_trade_id
  FOREIGN KEY(trade_id)
  REFERENCES "trades"(id),
  content VARCHAR NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX messages_user_id_one_idx ON "messages"(user_id_one)
CREATE INDEX messages_user_id_two_idx ON "messages"(user_id_two)



CREATE TABLE trades (
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
  plant_target_id INT,
  CONSTRAINT fk_plant_target
  FOREIGN KEY(plant_target_id)
  REFERENCES "plants"(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_target_id INT,
  shown_to_user_offer BOOLEAN DEFAULT false,
  shown_to_user_target BOOLEAN DEFAULT false,
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

