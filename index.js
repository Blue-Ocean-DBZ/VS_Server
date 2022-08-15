const express = require("express");
const controllers = require("./database/controllers.js");
require("dotenv").config();
const app = express();

app.use(express.json());

app.get("/all", controllers.findByLocation);

app.post("/plant", controllers.addPlant);
app.delete("/plant", controllers.removePlant);

app.post("/user", controllers.addUser);

app.get("/favorites", controllers.getFavorites);
app.post("/favorites", controllers.addToFavorites);
app.delete("/favorites", controllers.removeFromFavorites);

app.delete("/plant", controllers.removePlant);

app.get("/trades", controllers.getTrades);
app.post("/trades", controllers.requestTrade);
app.put("/trades", controllers.handleTrade);

app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);
