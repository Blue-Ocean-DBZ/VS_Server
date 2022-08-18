module.exports = {
  findByLocationQuery: `
    SELECT
      f.id favorite,
      t.pending,
      withinTwenty.username,
      p.id plant_id,
      p.plant_name,
      p.photo,
      p.user_id,
      withinTwenty.profile_pic,
      withinTwenty.distance
    FROM
      plants p
    INNER JOIN
      (
        SELECT
          u.username,
          u.profile_pic,
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
      trades t on t.plant_target_id = p.id
    LEFT JOIN
      favorites f on f.user_id = $1
    AND
      f.plant_id = p.id
    AND
      f.deleted = false

    WHERE
      p.deleted = false
    ORDER BY
      distance
    LIMIT 100;`,

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
      (SELECT longitude FROM coords),
      (SELECT latitude FROM coords),
      ST_SetSRID(ST_MakePoint(
        (SELECT longitude FROM coords),
        (SELECT latitude FROM coords)), 4326)
    )
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
        )`,

  addToFavoritesQuery: `
  WITH
    coords
  AS
    (select 1 there, p.id, geolocation from plants p inner join users u on p.user_id = u.id where p.id = $2),
    currentUser
  AS
    (select 1 here, geolocation from users u where u.id = $1)
  INSERT INTO
    favorites
  (user_id, plant_id, distance)
    VALUES
    ($1, $2,
    (
      SELECT ST_Distance(
        coords.geolocation,
        currentUser.geolocation)
      FROM
        coords
      INNER JOIN
        currentUser
      ON
        currentUser.here = coords.there)
  )`,

  createMessageQuery: `
  INSERT INTO
    messages
      (
        user_id,
        trade_id,
        content
      )
  VALUES ($1, $2, $3)
  `,

  updateQueryOne: `
  UPDATE
    trades
  SET
    shown_to_user_target = false
  WHERE
    id = $2
  AND
    user_offer_id = $1;
  `,

  updateQueryTwo: `
  UPDATE
    trades
  SET
    shown_to_user_offer = false
  WHERE
    id = $2
  AND
    user_target_id = $1;
  `,

  updateQueryThree: `
  UPDATE
    trades
  SET
    shown_to_user_offer = true
  WHERE
    id = $2
  AND
    user_offer_id = $1
  `,

  updateQueryFour: `
  UPDATE
    trades
  SET
    shown_to_user_target = true
  WHERE
    id = $2
  AND
    user_target_id = $1
  `,

  editUserQuery: `
  WITH
    coords
  AS
    (SELECT longitude, latitude FROM zips where zip = $2)
  UPDATE
    users
  SET
    zip = $2,
    profile_pic = $3,
    longitude = (select longitude from coords),
    latitude = (select latitude from coords)
  WHERE
    id = $1`,
};
