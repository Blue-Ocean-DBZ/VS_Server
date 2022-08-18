module.exports = {
  findByLocationQuery: `
    SELECT DISTINCT
      f.id favorites_id,
      userTrades.pending,
      withinTwenty.username,
      p.id plant_id,
      p.plant_name,
      p.photo,
      p.user_id,
      withinTwenty.profile_pic,
      withinTwenty.zip,
      withinTwenty.city,
      withinTwenty.county,
      withinTwenty.state,
      withinTwenty.distance
    FROM
      (SELECT * FROM plants p WHERE p.deleted = false) p
    INNER JOIN
      (
        SELECT
          u.zip,
          u.username,
          u.profile_pic,
          u.city,
          u.county,
          u.state,
          u.id,
          ST_Distance(u.geolocation, distanceTable.geolocation) distance
        FROM
          users u,
        LATERAL
          (
            SELECT
              id,
              geolocation
            FROM
              users
            WHERE
              users.id = $1
          )
        AS
          distanceTable
        WHERE
          u.id != distanceTable.id
        AND
          ST_DWithin(
            u.geolocation,
            distanceTable.geolocation,
            240000
          )
        ) withinTwenty
    ON
      p.user_id = withinTwenty.id
    LEFT JOIN
      favorites f
    ON
      f.plant_id = p.id
    AND
      f.user_id = $1
    AND
      f.deleted = false
    LEFT JOIN
      (
        SELECT DISTINCT
          t.pending,
          t.plant_target_id,
          t.plant_offer_id
        FROM
          trades t
        INNER JOIN
          plants p2
        ON
          t.plant_target_id = p2.id
        OR
          t.plant_offer_id = p2.id
        WHERE
          p2.user_id = $1
        AND
          p2.deleted = false
        ) userTrades
    ON
      userTrades.plant_target_id = p.id
    OR
      userTrades.plant_offer_id = p.id
    AND
      p.deleted = false
    ORDER BY
      distance;`,

  getMyPlantsQuery: `
    SELECT
      p.plant_name,
      p.id plant_id,
      p.photo,
      p.created_at,
      u.zip,
      u.id user_id
    FROM
      plants p
    INNER JOIN
      users u
    ON
      u.id = p.user_id
    WHERE
      user_id = $1
    AND
      p.deleted = false
    ORDER BY
      p.created_at DESC;`,

  getMyPlantsQuery: `
  SELECT
    p.plant_name,
    p.id plant_id,
    p.photo,
    p.created_at,
    u.zip,
    u.id user_id
  FROM
    plants p
  INNER JOIN
    users u
  ON
    u.id = p.user_id
  WHERE
    user_id = $1
  AND
    p.deleted = false
  ORDER BY
    p.created_at DESC;`,

  getTradesQuery: `
  SELECT
    t.id trade_id,
    t.pending,
    t.accepted,
    t.shown_to_user_offer,
    t.shown_to_user_target,
    t.created_at,
    JSON_BUILD_OBJECT
    (
      'plant_id',p.id,
      'photo',p.photo,
      'owner_id',p.user_id,
      'plant_name', p.plant_name,
      'username', (SELECT username FROM users INNER JOIN plants p3 ON p3.user_id = users.id WHERE p3.id = p.id )
    ) plant_target,
    JSON_BUILD_OBJECT('plant_id',p2.id,'photo',p2.photo,'owner_id',p2.user_id,'plant_name',p.plant_name,'username',(SELECT username FROM users INNER JOIN plants p4 ON p4.user_id = users.id WHERE p4.id = p2.id )) plant_offer
  FROM
    (
      SELECT
        *
      FROM
        trades t
      WHERE
        t.user_target_id = $1
      OR
        t.user_offer_id = $1
    ) t
  INNER JOIN
    plants p
  ON
    p.id = t.plant_target_id
  INNER JOIN
    plants p2
  ON
    p2.id = t.plant_offer_id
  ORDER BY
    created_at DESC`,

  getFavoritesQuery: `
    SELECT
      f.id favorites_id,
      f.distance,
      u.username,
      u.zip,
      u.city,
      u.county,
      p.plant_name,
      p.id plant_id,
      p.photo,
      p.user_id owner_id,
      p.created_at
    FROM
      plants p
    INNER JOIN
      favorites f
    ON
      f.plant_id = p.id
    INNER JOIN
      users u
    ON
      u.id = p.user_id
    WHERE
      p.deleted = false
    AND
      f.user_id = $1
    AND
      f.deleted = false
    ORDER BY
      f.created_at DESC;`,

  addUserQuery: `
    WITH
      coords
    AS
      (
        SELECT
          *
        FROM
          zips
        WHERE
          zip = $4
      )
    INSERT INTO
      users
      (
        username,
        firebase_id,
        profile_pic,
        zip,
        city,
        county,
        state,
        longitude,
        latitude,
        geolocation
      )
    VALUES
      (
        $1,
        $2,
        $3,
        $4,
        (SELECT city FROM coords),
        (SELECT county FROM coords),
        (SELECT state FROM coords),
        (SELECT longitude FROM coords),
        (SELECT latitude FROM coords),
        ST_SetSRID(ST_MakePoint(
          (SELECT longitude FROM coords),
          (SELECT latitude FROM coords)), 4326))
    RETURNING id;`,

  requestTradeQuery: `
    INSERT INTO
      trades
        (
          user_offer_id,
          plant_offer_id,
          user_target_id,
          plant_target_id
        )
      VALUES
        (
          (SELECT p.user_id FROM plants p WHERE p.id = $1),
          $1,
          (SELECT p.user_id FROM plants p WHERE p.id = $2),
          $2
        )
    RETURNING id`,

  initialMessageQuery: `
    WITH
    currentTarget
    AS
      (
        SELECT
          *
        FROM
          users u
        INNER JOIN
          trades t
        ON
          t.user_target_id = u.id
        WHERE
          t.user_target_id = (SELECT user_target_id FROM users u2 INNER JOIN trades t2 ON t2.user_offer_id = u2.id WHERE t2.id = $2)
      )
      INSERT INTO
        messages
          (
            user_id,
            trade_id,
            content
          )
      VALUES
        ($1, $2, 'Hey, ' || (SELECT username::text FROM currentTarget) || ', wanna trade?')
  `,

  addToFavoritesQuery: `
    INSERT INTO
      favorites
        (
          user_id,
          plant_id,
          distance
        )
        VALUES
          ($1, $2,
          (
          SELECT ST_Distance(
            (SELECT geolocation FROM users u INNER JOIN plants p ON p.user_id = u.id WHERE p.id = $2),
            (SELECT geolocation FROM users u WHERE id = $1))
          ))`,

  createMessageQuery: `
    INSERT INTO
      messages
        (
          user_id,
          trade_id,
          content
        )
    VALUES
      ($1, $2, $3)`,

  removeFavoriteQuery: `
    UPDATE
      favorites
    SET
      deleted = true
    WHERE
      id = $1
    `,

  updateQueryOne: `
    UPDATE
      trades
    SET
      shown_to_user_target = false
    WHERE
      id = $2
    AND
      user_offer_id = $1;`,

  updateQueryTwo: `
    UPDATE
      trades
    SET
      shown_to_user_offer = false
    WHERE
      id = $2
    AND
      user_target_id = $1;`,

  updateQueryThree: `
    UPDATE
      trades
    SET
      shown_to_user_offer = true
    WHERE
      id = $2
    AND
      user_offer_id = $1`,

  updateQueryFour: `
    UPDATE
      trades
    SET
      shown_to_user_target = true
    WHERE
      id = $2
    AND
      user_target_id = $1`,

  editUserQuery: `
    WITH
      coords
    AS
      (SELECT * FROM zips where zip = $2)
    UPDATE
      users
    SET
      zip = $2,
      profile_pic = $3,
      user_status = $4,
      city = (select city from coords),
      county = (select county from coords),
      state = (select state from coords),
      longitude = (select longitude from coords),
      latitude = (select latitude from coords),
      geolocation = (
        SELECT
          ST_SetSRID(
            ST_MakePoint(
              (SELECT longitude FROM coords),
              (SELECT latitude FROM coords)
              ), 4326)
        )
    WHERE
      id = $1`,

  handleTradeQuery: `
    UPDATE
      trades
    SET
      pending = false,
      accepted = $3,
      created_at = CURRENT_TIMESTAMP
    WHERE
      id = $2
    AND
      user_target_id = $1`,

  getMessagesQuery: `
    SELECT
      u.username,
      u.profile_pic,
      u.id user_id,
      m.*
    FROM
      messages m
    INNER JOIN
      users u
    ON
      u.id = m.user_id
    WHERE
      trade_id = $1
    ORDER BY
      created_at;`,

  addPlantQuery: `
    INSERT INTO
      plants
      (
        plant_name,
        photo,
        user_id
      )
    VALUES
      ($1, $2, $3)`,

  findByLocationQueryFB: `
    WITH
      currentUser
    AS
     (SELECT id FROM users WHERE firebase_id = $1::text)
    SELECT DISTINCT
      f.id favorites_id,
      userTrades.pending,
      withinTwenty.username,
      p.id plant_id,
      p.plant_name,
      p.photo,
      p.user_id,
      withinTwenty.profile_pic,
      withinTwenty.zip,
      withinTwenty.city,
      withinTwenty.county,
      withinTwenty.state,
      withinTwenty.distance
    FROM
      plants p
    INNER JOIN
      (
        SELECT
          u.zip,
          u.username,
          u.profile_pic,
          u.city,
          u.county,
          u.state,
          u.id,
          ST_Distance(u.geolocation, distanceTable.geolocation) distance
        FROM
          users u,
        LATERAL
          (
            SELECT
              id,
              geolocation
            FROM
              users
            WHERE
              users.id = (SELECT id FROM currentUser)
          )
        AS
          distanceTable
        WHERE
          u.id != distanceTable.id
        AND
          ST_DWithin(
            u.geolocation,
            distanceTable.geolocation,
            240000
          )
        ) withinTwenty
    ON
      p.user_id = withinTwenty.id
    LEFT JOIN
      favorites f
    ON
      f.plant_id = p.id
    AND
      f.user_id = (SELECT id FROM currentUser)
    AND
      f.deleted = false
    LEFT JOIN
      (
        SELECT DISTINCT
          t.pending,
          t.plant_target_id,
          t.plant_offer_id
        FROM
          trades t
        INNER JOIN
          plants p2
        ON
          t.plant_target_id = p2.id
        OR
          t.plant_offer_id = p2.id
        WHERE
          p2.user_id = (SELECT id FROM currentUser)
        AND
          p2.deleted = false
        ) userTrades
    ON
      userTrades.plant_target_id = p.id
    OR
      userTrades.plant_offer_id = p.id
    AND
      p.deleted = false
    ORDER BY
      distance;`,

  getTradesQueryFB: `
    WITH
      currentUser
    AS
      (SELECT id FROM users WHERE firebase_id = $1::text)
    SELECT
      t.id trade_id,
      (SELECT COUNT(*) FROM trades t WHERE (t.user_target_id = $1 AND t.shown_to_user_target = false) OR (t.user_offer_id = $1 AND t.shown_to_user_offer = false)) notifications,
      t.pending,
      t.accepted,
      t.shown_to_user_offer,
      t.shown_to_user_target,
      t.created_at,
      JSON_BUILD_OBJECT(
        'plant_id', p.id,
        'photo', p.photo,
        'owner_id', p.user_id,
        'plant_name', p.plant_name,
        'username', (SELECT username FROM users INNER JOIN plants p3 ON p3.user_id = users.id WHERE p3.id = p.id )
      ) plant_target,
      JSON_BUILD_OBJECT(
        'plant_id', p2.id,
        'photo', p2.photo,
        'owner_id', p2.user_id,
        'plant_name', p2.plant_name,
        'username', (SELECT username FROM users INNER JOIN plants p4 ON p4.user_id = users.id WHERE p4.id = p2.id )
      ) plant_offer
    FROM
      (
        SELECT
          *
        FROM
          trades t
        WHERE
          t.user_target_id = (SELECT id FROM currentUser)
        OR
          t.user_offer_id = (SELECT id FROM currentUser)
      ) t
    INNER JOIN
      (SELECT * FROM plants p WHERE p.deleted = false) p
    ON
      p.id = t.plant_target_id
    INNER JOIN
      (SELECT * FROM plants p WHERE p.deleted = false) p2
    ON
      p2.id = t.plant_offer_id
    ORDER BY
      created_at DESC`,

  getFavoritesQueryFB: `
    WITH
      currentUser
    AS
      (SELECT id FROM users WHERE firebase_id = $1::text)
    SELECT
      f.id favorites_id,
      f.distance,
      u.username,
      u.zip,
      p.plant_name,
      p.id plant_id,
      p.photo,
      p.user_id owner_id,
      p.created_at
    FROM
      plants p
    INNER JOIN
      favorites f
    ON
      f.plant_id = p.id
    INNER JOIN
      users u
    ON
      u.id = p.user_id
    WHERE
      p.deleted = false
    AND
      f.user_id = (SELECT id FROM currentUser)
    AND
      f.deleted = false
    ORDER BY
      f.created_at DESC;`,

  getMyPlantsQueryFB: `
    WITH
      currentUser
    AS
      (SELECT id FROM users WHERE firebase_id = $1::text)
    SELECT
      p.plant_name,
      p.id plant_id,
      p.photo,
      p.created_at,
      u.zip,
      u.id user_id
    FROM
      plants p
    INNER JOIN
      users u
    ON
      u.id = p.user_id
    WHERE
      user_id = (SELECT id FROM currentUser)
    AND
      p.deleted = false
    ORDER BY
      p.created_at DESC;`,
};
