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
    t.id,
    t.pending,
    t.accepted,
    t.shown_to_user,
    t.created_at,
    JSON_BUILD_OBJECT('plant_id',p.id,'photo',p.photo,'owner_id',p.user_id) plant_target,
    JSON_BUILD_OBJECT('plant_id',p2.id,'photo',p2.photo,'owner_id',p2.user_id) plant_offer
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
