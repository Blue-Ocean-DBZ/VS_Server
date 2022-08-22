insert into users (
  username,
  session_id,
  profile_pic,
  zip,
  longitude,
  latitude
  ) VALUES

SELECT p.*
FROM plants p
INNER JOIN
  users u
ON
  p.user_id = u.id
AND
  p.deleted = false;


SELECT
  p.*
FROM
  plants p
INNER JOIN
  favorites f
ON
  p.id = f.plant_id
WHERE
  f.user_id = $1
AND
  p.deleted = false;

SELECT
  p.*
FROM
  plants pl
INNER JOIN
  favorites f
ON
  pl.id = f.plant_id
WHERE
  f.user_id = $1
AND
  pl.deleted = false
ORDER BY DESC;



select JSON_BUILD_OBJECT('user_id',1,'favorites', JSON_AGG(favoritePlants.plantObj))
from
(select JSON_BUILD_OBJECT('plant_name',p.plant_name,'id',p.id,'photo',p.photo,'created_at',p.created_at) plantObj from plants p inner join favorites f
on p.id = f.plant_id where f.user_id = 1 and p.deleted = false) favoritePlants;


select * from users where id = 1;


select p.* from plants p inner join users u on p.user_id = u.id and u.id = 1 and p.deleted = false;

select * from plants p where p.plant_name = 'Pfeffer';


SELECT inRange.username, p.*, inRange.distance
          FROM
            plants p
          INNER JOIN
            (
              SELECT
                u.id,
                u.username,
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
                  users.id = 2
              ) as wr
              WHERE
                u.id <> wr.id
              AND
                ST_Distance(u.geolocation, wr.geolocation) < 32000
            ) inRange
          ON
            p.user_id = inRange.id
          WHERE
            p.deleted = false
          order by
          	distance;

select * from favorites where favorites.user_id = 1;


select p.* from plants p inner join favorites on favorites.user_id = p.user_id;


select * from plants p where id = 1;


select * from favorites;

with favoritePlants
as (select JSON_BUILD_OBJECT('plant_name',p.plant_name,'id',p.id,'photo',p.photo,'created_at',p.created_at) plantObj
from plants p inner join favorites f on p.id = f.plant_id where f.user_id = 1 and p.deleted = false)
select JSON_BUILD_OBJECT('user_id', 1, 'favorites',JSON_AGG(plantObj)) from favoritePlants;

select * from favorites where user_id = 1;

select * from plants;

select JSON_BUILD_OBJECT('user_id',1,'favorites', JSON_AGG(favoritePlants.plantObj))
from
(select JSON_BUILD_OBJECT('plant_name',p.plant_name,'id',p.id,'photo',p.photo,'created_at',p.created_at) plantObj from plants p inner join favorites f
on p.id = f.plant_id where f.user_id = 1 and p.deleted = false) favoritePlants;


SELECT 1 user_id, p.*, inRange.distance
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
                  users.id = 1
              ) as wr
              WHERE
                u.id != wr.id
              AND
                ST_Distance(u.geolocation, wr.geolocation) < 32000
            ) inRange
          ON
            p.user_id = inRange.id
          WHERE
            p.deleted = false
          ORDER BY
            distance;


         select JSON_AGG(stuff.plantObj) plantsWithinRange from
         (SELECT 1 user_id, JSON_BUILD_OBJECT('plant_name',p.plant_name,'id',p.id,'photo',p.photo,'distance',inRange.distance) plantObj
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
                  users.id = 1
              ) as wr
              WHERE
                u.id != wr.id
              AND
                ST_Distance(u.geolocation, wr.geolocation) < 32000
            ) inRange
          ON
            p.user_id = inRange.id
          WHERE
            p.deleted = false
          ORDER BY
            distance) stuff

select * from users where id = 1;


select p.* from plants p inner join users u on p.user_id = u.id and u.id = 1 and p.deleted = false;

select * from plants p where p.plant_name = 'Pfeffer';


SELECT inRange.username, p.*, inRange.distance
          FROM
            plants p
          INNER JOIN
            (
              SELECT
                u.id,
                u.username,
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
                  users.id = 2
              ) as wr
              WHERE
                u.id <> wr.id
              AND
                ST_Distance(u.geolocation, wr.geolocation) < 32000
            ) inRange
          ON
            p.user_id = inRange.id
          WHERE
            p.deleted = false
          order by
          	distance;


select * from favorites where favorites.user_id = 1;


select p.* from plants p inner join favorites on favorites.user_id = p.user_id;


select * from plants p where id = 1;


select * from favorites;

with favoritePlants
as (select JSON_BUILD_OBJECT('plant_name',p.plant_name,'id',p.id,'photo',p.photo,'created_at',p.created_at) plantObj
from plants p inner join favorites f on p.id = f.plant_id where f.user_id = 1 and p.deleted = false)
select JSON_BUILD_OBJECT('user_id', 1, 'favorites',JSON_AGG(plantObj)) from favoritePlants;

select * from favorites where user_id = 1;

select * from plants;

select JSON_BUILD_OBJECT('user_id',1,'favorites', JSON_AGG(favoritePlants.plantObj))
from
(select JSON_BUILD_OBJECT('plant_name',p.plant_name,'id',p.id,'photo',p.photo,'created_at',p.created_at) plantObj from plants p inner join favorites f
on p.id = f.plant_id where f.user_id = 1 and p.deleted = false) favoritePlants;





inner join
(select JSON_BUILD_OBJECT('plant_name',p.plant_name,'id',p.id,'photo',p.photo'created_at',p.created_at,'distance',p.distance) plantobj
from (SELECT 1 user_id, p.*, inRange.distance
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
                  users.id = 1
              ) as wr
              WHERE
                u.id != wr.id
              AND
                ST_Distance(u.geolocation, wr.geolocation) < 32000
            ) inRange
          ON
            p.user_id = inRange.id
          WHERE
            p.deleted = false
          ORDER BY
            distance) rangeTwenty

SELECT 1 user_id, p.*, inRange.distance
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
                  users.id = 1
              ) as wr
              WHERE
                u.id != wr.id
              AND
                ST_Distance(u.geolocation, wr.geolocation) < 32000
            ) inRange
          ON
            p.user_id = inRange.id
          WHERE
            p.deleted = false
          ORDER BY
            distance;


         select JSON_AGG(stuff.plantObj) plantsWithinRange from
         (SELECT 1 user_id, JSON_BUILD_OBJECT('plant_name',p.plant_name,'id',p.id,'photo',p.photo,'distance',inRange.distance) plantObj
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
                  users.id = 1
              ) as wr
              WHERE
                u.id != wr.id
              AND
                ST_Distance(u.geolocation, wr.geolocation) < 32000
            ) inRange
          ON
            p.user_id = inRange.id
          WHERE
            p.deleted = false
          ORDER BY
            distance) stuff



select f.id favorites_id, p.* from plants p inner join favorites f on f.plant_id = p.id where p.deleted = false and p.user_id = 3;

select * from plants where user_id = 7;


select * from favorites


select JSON_BUILD_OBJECT('user_id',1,'within_20',withinTwenty.distanceArr,'within_30', withinThirty.distanceArr,'within_40', withinForty.distanceArr, 'within_50', withinFifty.distanceArr) FROM
(SELECT 1 user_id, JSON_AGG(JSON_BUILD_OBJECT('plant_id',p.id,'plant_name',p.plant_name,'photo',p.photo,'distance', withinTwenty.distance) order by withinTwenty.distance) distanceArr
          FROM
            plants p
          INNER JOIN
            (
              select
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
                  users.id = 1
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
            inner join
(SELECT 1 user_id, JSON_AGG(JSON_BUILD_OBJECT('plant_id',p.id,'plant_name',p.plant_name,'photo',p.photo,'distance', withinThirty.distance) order by withinThirty.distance) distanceArr
          FROM
            plants p
          INNER JOIN
            (
              select
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
                  users.id = 1
              ) as wr
              WHERE
                u.id != wr.id
              AND
                ST_Distance(u.geolocation, wr.geolocation) > 32000
              and
                ST_Distance(u.geolocation, wr.geolocation) < 48000
            ) withinThirty
          ON
            p.user_id = withinThirty.id
          WHERE
            p.deleted = false) withinThirty on withinThirty.user_id = withinTwenty.user_id
                        inner join
(SELECT 1 user_id, JSON_AGG(JSON_BUILD_OBJECT('plant_id',p.id,'plant_name',p.plant_name,'photo',p.photo,'distance', withinForty.distance) order by withinForty.distance) distanceArr
          FROM
            plants p
          INNER JOIN
            (
              select
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
                  users.id = 1
              ) as wr
              WHERE
                u.id != wr.id
              AND
                ST_Distance(u.geolocation, wr.geolocation) > 48000
              and
                ST_Distance(u.geolocation, wr.geolocation) < 64000
			  ) withinForty
          ON
            p.user_id = withinForty.id
          WHERE
            p.deleted = false) withinForty on withinForty.user_id = withinTwenty.user_id
                                    inner join
(SELECT 1 user_id, JSON_AGG(JSON_BUILD_OBJECT('plant_id',p.id,'plant_name',p.plant_name,'photo',p.photo,'distance', withinFifty.distance) order by withinFifty.distance) distanceArr
          FROM
            plants p
          INNER JOIN
            (
              select
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
                  users.id = 1
              ) as wr
              WHERE
                u.id != wr.id
              AND
                ST_Distance(u.geolocation, wr.geolocation) > 64000
              and
                ST_Distance(u.geolocation, wr.geolocation) < 80000
			  ) withinFifty
          ON
            p.user_id = withinFifty.id
          WHERE
            p.deleted = false) withinFifty on withinFifty.user_id = withinTwenty.user_id;


select * from trades t where t.user_target_id = 1 or t.user_offer_id = 1;






select * from users where id > 1000;




-- select t.id, t.pending, t.accepted, t.shown_to_user, t.user_offer_id, offerTable.plantObj, t.user_target_id, targetTable.plantObj target_plant, t.created_at from trades t inner join
-- ( select t.id trade_id, JSON_BUILD_OBJECT('plant_id',p.id,'plant_name',p.plant_name,'photo',p.photo,'owner_id',p.user_id) plantObj from plants p inner join
-- trades t on p.id = t.user_target_id where t.id = 4 ) targetTable on targetTable.trade_id = t.id
-- inner join
-- ( select t.id trade_id, JSON_BUILD_OBJECT('plant_id',p.id,'plant_name',p.plant_name,'photo',p.photo,'owner_id',p.user_id) plantObj from plants p inner join
-- trades t on p.id = t.user_offer_id where t.id = 4 ) offerTable on offerTable.trade_id = t.id
-- where t.id = 4;




select JSON_BUILD_OBJECT('trade_id',trades.id,'target',targetTable.plantObj,'offer',offerTable.plantObj) from trades inner join
(select t.id, JSON_BUILD_OBJECT('id',p.id,'photo',p.photo,'owner_id',p.user_id) plantObj from trades t inner join plants p
on p.user_id = user_target_id and p.id = t.plant_target_id and p.deleted = false) targetTable
on targetTable.id = trades.id
inner join
(select t.id, JSON_BUILD_OBJECT('id',p.id,'photo',p.photo,'owner_id',p.user_id) plantObj from trades t inner join plants p
on p.user_id = user_offer_id and p.id = t.plant_offer_id and p.deleted = false) offerTable
on offerTable.id = targetTable.id



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
        'owner_id', p.user_id
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
    ) targetTable
ON targetTable.id = trades.id
INNER JOIN
  (
    SELECT t.id,
    JSON_BUILD_OBJECT
    (
      'plant_id', p.id,
      'photo', p.photo,
      'owner_id', p.user_id
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
  ) offerTable
ON
  offerTable.id = targetTable.id
ORDER BY
trades.created_at DESC;








SELECT
  t.pending,
  withinTwenty.username owner_name,
  p.id,
  p.plant_name,
  p.photo,
  p.user_id,
  withinTwenty.distance
FROM
  plants p
INNER JOIN
  (
    SELECT
      u.username,
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
          users.id = 1
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
LEFT JOIN trades t on t.plant_target_id = p.id
WHERE
  p.deleted = false
ORDER BY
  distance
LIMIT 100



WITH coords as (SELECT * FROM zips where zip = $1)



with coords as (select 1 there, p.id, geolocation from plants p inner join users u on p.user_id = u.id where p.id = 1),
currentUser as (select 1 here, geolocation from users u where u.id = 2)
insert into favorites (user_id, plant_id, distance) values (2, 1,
(select ST_Distance(coords.geolocation, currentUser.geolocation) from coords inner join currentUser on currentUser.here = coords.there)
)



WITH coords AS (SELECT longitude, latitude FROM zips where zip = 95442)




BEGIN

INSERT INTO messages (user_id, trade_id, content) VALUES ($1, $2, $3)

UPDATE
  trades
SET
  shown_to_user_target = false
WHERE
  id = $2
AND
  user_offer_id = $1

UPDATE
  trades
SET
  shown_to_user_offer = false
WHERE
  id = $2
AND
  user_target_id = $1

COMMIT

with currentUser as (select id from users where firebase_id = $1)
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
              users.id = (select id from currentUser)
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
      favorites f on f.user_id = (select id from currentUser)
    AND
      f.plant_id = p.id
    AND
      f.deleted = false
    WHERE
      p.deleted = false
    ORDER BY
      distance
    LIMIT 100;






SELECT
      f.id favorite,
      t.pending,
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
    LIMIT 100;





SELECT
      f.id favorite,
      t.pending,
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










         select
 	  f.id,
      t.pending,
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
      left join favorites f on f.plant_id = p.id and f.user_id = $1 and f.deleted = false
    LEFT JOIN
      (select distinct pending, user_target_id, user_offer_id from (
      select * from trades t inner join plants p on p.user_id = t.plant_target_id where
      t.plant_target_id = p.id AND t.user_offer_id = $1) minitrades) t on t.user_target_id = $1 or t.user_offer_id = $1



      or (t.plant_offer_id = p.id AND t.user_target_id = $1) t
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
    LIMIT 100;`















    SELECT
      f.id favorite,
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
              plants2
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
          distance;`





ST_SetSRID(ST_MakePoint(
        (SELECT longitude FROM coords),
        (SELECT latitude FROM coords)), 4326)




WITH currentZip as (SELECT *, ST_SetSRID(ST_MakePoint(longitude, latitude)) FROM zips WHERE ip = $1)
SELECT
  *
FROM
  zips
LATERAL(
  SELECT
    (
      SELECT
        *
      FROM
        zips
    )
)

ST_SetSRID(ST_MakePoint(
        (SELECT longitude FROM coords),
        (SELECT latitude FROM coords)), 4326)
    )



`
ALTER TABLE
  zips
ADD
  geolocation geography(point);
`


`
SET
  geolocation = ST_MakePoint(currentZip.longitude, currentZip.latitude)
FROM
  zips currentZip
WHERE
  zips.id = currentZip.id;`

WITH otherUser as (SELECT u.username, u.id FROM users u inner join trades t on t.id = $2)
`INSERT INTO messages (user_id, trade_id, content) VALUES ($1, $2, ('Hey, ' + otherUser.username + ', wanna trade?')`,


