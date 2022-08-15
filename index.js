const express = require("express");
const controllers = require("./database/controllers.js");
require("dotenv").config();
const addCoordinates = require("./middleware/zipConvert.js").addCoordinates;
const convert = require("convert-zip-to-gps");
const app = express();

app.use(express.json());
app.use(addCoordinates);

app.get("/all", controllers.findByLocation);

app.post("/plant", controllers.addPlant);

app.post("/user", controllers.addUser);

app.get("/favorites", controllers.getFavorites);
app.post("/favorites", controllers.addToFavorites);
app.delete("/favorites", controllers.removeFromFavorites);

app.delete("/plant", controllers.removePlant);

app.get("/findByLocation", controllers.findByLocation);

console.log(convert.zipConvert(95476));

app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);
