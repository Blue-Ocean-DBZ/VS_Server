const db = require("./database");
const express = require("express");
const addUser = require("./database/controllers.js").addUser;
const controllers = require("./database/controllers.js");
require("dotenv").config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("GET");
  res.send();
});

app.post("/user", (req, res) => {
  console.log("POST:", req.body);
  addUser(req.body).then(() => {
    res.status(201).send("success!");
  });
});

app.get("/all", controllers.findByLocation);

app.post("/plant", controllers.addPlant);

app.delete("/plant/:id", controllers.removePlant);

app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);
