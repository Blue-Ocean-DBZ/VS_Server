
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL,
  session_id VARCHAR NOT NULL,
  profile_pic VARCHAR DEFAULT NULL,
  zip VARCHAR NOT NULL,
  longitude DECIMAL NOT NULL,
  latitude DECIMAL NOT NULL,
);

CREATE TABLE plants (
  id SERIAL PRIMARY KEY,
  plant_name VARCHAR NOT NULL,
  photo VARCHAR NOT NULL,
  deleted BOOLEAN DEFAULT false,
  owner_id INT,
  CONSTRAINT fk_owner
  FOREIGN KEY(owner_id)
  REFERENCES "users"(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INT,
  CONSTRAINT fk_user
  FOREIGN KEY(user_id)
  REFERENCES "users"(id),
  plant_id INT,
  CONSTRAINT fk_plant_id
  FOREIGN KEY(plant_id)
  REFERENCES "plants"(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE trades (
  id SERIAL PRIMARY KEY,
  pending BOOLEAN DEFAULT true,
  accepted BOOLEAN DEFAULT NULL,
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

