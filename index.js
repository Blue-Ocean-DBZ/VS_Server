const db = require("../database");
const express = require("express");
require("dotenv").config();
const app = express();
const addUser = require("../database/controllers.js").addUser;

app.use(express.json());

app.get("/", (req, res) => {
  console.log("got a get");
  res.send("nice");
});

app.post("/user", (req, res) => {
  console.log(req.body);
  addUser(req.body).then(() => {
    console.log("added!");
    res.send("success!");
  });
});

app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);
