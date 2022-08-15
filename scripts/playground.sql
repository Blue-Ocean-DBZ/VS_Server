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






