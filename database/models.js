module.exports = {
  findByLocationQuery: `
  SELECT
    JSON_BUILD_OBJECT(
      'user_id', $1,
      'within_20', withinTwenty.distanceArr,
      'within_30', withinThirty.distanceArr,
      'within_40', withinForty.distanceArr,
      'within_50', withinFifty.distanceArr
      )
  FROM
    (
      SELECT
        $1 user_id,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'plant_id', p.id,
            'plant_name', p.plant_name,
            'photo', p.photo,
            'owner_id', p.user_id,
            'distance', withinTwenty.distance
            )
          ORDER BY
            withinTwenty.distance
          ) distanceArr
      FROM
        plants p
      INNER JOIN
        (
          SELECT
            u.id,
            ST_Distance(u.geolocation, wr.geolocation) distance
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
              ) as wr
          WHERE
            u.id != wr.id
          AND
            ST_Distance(u.geolocation, wr.geolocation) < 32000
          ) withinTwenty
      ON
        p.user_id = withinTwenty.id
      WHERE
        p.deleted = false) withinTwenty
  INNER JOIN
    (
      SELECT
        $1 user_id,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'plant_id', p.id,
            'plant_name', p.plant_name,
            'photo', p.photo,
            'owner_id', p.user_id,
            'distance', withinThirty.distance
            )
          ORDER BY
            withinThirty.distance
          ) distanceArr
      FROM
        plants p
      INNER JOIN
        (
          SELECT
            u.id,
            ST_Distance(u.geolocation, wr.geolocation) distance
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
              ) as wr
          WHERE
            u.id != wr.id
          AND
            ST_Distance(u.geolocation, wr.geolocation) > 32000
          AND
            ST_Distance(u.geolocation, wr.geolocation) < 48000
          ) withinThirty
      ON
        p.user_id = withinThirty.id
      WHERE
        p.deleted = false) withinThirty on withinThirty.user_id = withinTwenty.user_id
  INNER JOIN
    (
      SELECT
        $1 user_id,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'plant_id', p.id,
            'plant_name', p.plant_name,
            'photo', p.photo,
            'owner_id', p.user_id,
            'distance', withinForty.distance
            )
          ORDER BY
          withinForty.distance
          ) distanceArr
      FROM
        plants p
      INNER JOIN
        (
          SELECT
            u.id,
            ST_Distance(u.geolocation, wr.geolocation) distance
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
              ) as wr
          WHERE
            u.id != wr.id
          AND
            ST_Distance(u.geolocation, wr.geolocation) > 48000
          AND
            ST_Distance(u.geolocation, wr.geolocation) < 64000
          ) withinForty
      ON
        p.user_id = withinForty.id
      WHERE
        p.deleted = false) withinForty on withinForty.user_id = withinTwenty.user_id
  INNER JOIN
    (
      SELECT
        $1 user_id,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'plant_id', p.id,
            'plant_name', p.plant_name,
            'photo', p.photo,
            'owner_id', p.user_id,
            'distance', withinFifty.distance
            )
          ORDER BY
          withinFifty.distance
          ) distanceArr
      FROM
        plants p
      INNER JOIN
        (
          SELECT
            u.id,
            ST_Distance(u.geolocation, wr.geolocation) distance
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
              ) as wr
          WHERE
            u.id != wr.id
          AND
            ST_Distance(u.geolocation, wr.geolocation) > 64000
          AND
            ST_Distance(u.geolocation, wr.geolocation) < 80000
          ) withinFifty
      ON
        p.user_id = withinFifty.id
      WHERE
        p.deleted = false) withinFifty on withinFifty.user_id = withinTwenty.user_id`,

  getTradesQuery: `
  SELECT JSON_AGG(tradeObj)
    FROM
      (
        SELECT JSON_BUILD_OBJECT(
        'trade_id', trades.id,
        'target', targetTable.plantObj,
        'offer', offerTable.plantObj,
        'created_at', trades.created_at,
        'pending', trades.pending,
        'accepted', trades.accepted,
        'shown_to_user', trades.shown_to_user
        ) tradesObj
      FROM
        trades
      INNER JOIN
        (
          SELECT
            t.id,
            JSON_BUILD_OBJECT
            (
              'plant_id', p.id,
              'photo', p.photo,
              'owner_id', p.user_id,
              'username', u.username
            ) plantObj
          FROM
            trades t
          INNER JOIN
            plants p
          ON
            p.user_id = user_target_id
          AND
            p.id = t.plant_target_id
          AND
            p.deleted = false
          INNER JOIN
            users u
          ON
            u.id = p.id
          ) targetTable
      ON targetTable.id = trades.id
      INNER JOIN
        (
          SELECT t.id,
          JSON_BUILD_OBJECT
          (
            'plant_id', p.id,
            'photo', p.photo,
            'owner_id', p.user_id,
            'username', u.username
          ) plantObj
          FROM
            trades t
          INNER JOIN
            plants p
          ON
            p.user_id = user_offer_id
          AND
            p.id = t.plant_offer_id
          AND
            p.deleted = false
          INNER JOIN
            users u
          ON
            u.id = p.id
        ) offerTable
      ON
        offerTable.id = targetTable.id
      WHERE
        trades.user_target_id = $1
      ORDER BY
        trades.created_at DESC) tradeObj;`,

  getFavoritesQuery: `
    SELECT
      f.id favorites_id,
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
    WHERE
      p.deleted = false
    AND
      f.user_id = $1
    AND
      f.deleted = false;`,

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
      session_id,
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
};
