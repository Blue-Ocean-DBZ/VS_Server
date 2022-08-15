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
};
