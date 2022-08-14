const express = require("express");
const controllers = require("./database/controllers.js");
require("dotenv").config();
const app = express();

app.use(express.json());

app.get("/all", controllers.findByLocation);

app.post("/plant", controllers.addPlant);

app.post("/user", controllers.addUser);

app.post("/favorites", controllers.addToFavorites);
app.delete("/favorites", controllers.removeFromFavorites);

app.delete("/plant", controllers.removePlant);

app.get("/findByLocation", controllers.findByLocation);

app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);
