Vegetation Station Server && Database
https://github.com/Blue-Ocean-DBZ/VS_Server

iOS application:
https://github.com/Blue-Ocean-DBZ/vegetationstation

Directions:

1. Install Postgres Client and PostGIS on hosting server:
   https://www.postgresql.org/download/
   https://postgis.net/install/

   Ubuntu or AWS server (use your version of postgres in terminal commands):
   https://joets.medium.com/install-postgresql-12-postgis-on-ubuntu-20-4-in-5-mins-1b8948545185

2. Download zips file:
   https://drive.google.com/file/d/1goWqtapby-GUMo2CpyX8Tyd99dE5qPB_/view?usp=sharing

3. Move zip_code_database_truncated.csv to appropriate folder.
   3a. If you are hosting the server locally, move zip_code_database_truncated.csv to your data directory inside the repository.
   3b. If you are hosting the server through AWS, move zip_code_database_truncated.csv to your /tmp directory.

4. Go into Postgres CLI using psql and create the database with the name you intend to use:
   root=# CREATE DATABASE vegetationstation
   CREATE DATABASE

5. Create a .env in the root directory of this repository that includes:
   PORT
   DB_NAME
   DB_HOST
   DB_USER
   DB_PASS
   DB_PORT
   ZIPS_PATH

   where DB_HOST, DB_USER and DB_PASS are the valid credentials of a postgres user and role.
   example .env:

   PORT=3000
   DB_NAME=vegetationstation
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=rootPassword
   ZIPS_PATH=data/zip_code_database_truncated.csv

(If you're using AWS server, use ZIPS_PATH=/tmp/zip_code_database_truncated.csv)

6. Navigate into the root directory of this repository in terminal and run
   $ npm install
   $ npm run initialize

If the database is created properly:
Tables and indices created, PostGIS extension enabled

Congratulations! You now are hosting a server and database for the Vegestation Station iOS application.

If you receive an error, double check your postgres permissions and follow up on any error messages.

If any part of the initialization script ran (your credentials were valid) be sure to go into postgres CLI, drop and recreate the database.
root=# DROP DATABASE vegetationstation;
DROP DATABASE
root=# CREATE DATABASE vegetationstation;
CREATE DATABASE

Then run the initialization script again:
$ npm run initialize

==========================================================================================================================================================

Vegestation Station Organization Git Workflow:

To avoid commits and pushes to main, in root directory:
$ git config core.hooksPath githooks
$ chmod +x githooks/pre-commit

If you've made changes on the main branch accidentally and want to move them:
$ git stash
$ git checkout [-b] <newOrExistingBranch>
$ git stash pop

Before starting work, start a ticket on the trello board!

$ git checkout -b <newOrExistingBranch>

After frequent and descriptive commits:
-- checkout main
-- pull recent changes
-- merge main into your feature branch (handle any conflicts locally)
-- push changes
-- create pull request with target of main
-- have two members review your code and accept your PR
-- Squash And Merge (with summary of all changes)
-- pull changes into your main branch
-- checkout a new or existing branch

To Dos:
-- Add constraints to schema to prevent duplicate entries and inconsistent data.
-- Coordinate front end authorization with database; do not allow unauthorized users to manipulate database
-- Test queries with greater scrutiny, clean up and filter out redundancies and inefficiencies
-- Add script to populate area with reasonable and complete data
-- Retool schema && queries to use trade components (multi-plant trades)
-- Set up router with cleaner endpoints to increase scalability
