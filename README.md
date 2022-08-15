# VS_Server

Server for Vegetation Station iOS app

---

Create a .env file:
PORT
DB_NAME
DB_HOST
DB_USER
DB_PASS
DB_PORT

---

Git Workflow:

To avoid pushes to master, in root directory:
git config core.hooksPath githooks
chmod +x githooks/pre-commit

If you've made changes on the master branch accidentally and want to move them:
git stash
git checkout [-b] <newOrExistingBranch>
git stash pop

Before starting work, start a ticket!
git checkout -b <newOrExistingBranch>
After frequent and descriptive commits (also a good habit to stash, pull, and apply before pushing)
git push origin <newOrExistingBranch>
Have two teammates validate a pull request.

Squash and Merge with description.
