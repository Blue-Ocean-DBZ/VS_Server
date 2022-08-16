const express = require("express");
const controllers = require("./database/controllers.js");
require("dotenv").config();
const app = express();

app.use(express.json());

app.get("/all", controllers.findByLocation);

app.get("/favorites", controllers.getFavorites);
app.post("/favorites", controllers.addToFavorites);
app.delete("/favorites", controllers.removeFromFavorites);

app.post("/plant", controllers.addPlant);
app.delete("/plant", controllers.removePlant);

app.get("/messages", controllers.getMessages);
app.post("/messages", controllers.postMessage);

app.get("/trades", controllers.getTrades);
app.post("/trades", controllers.requestTrade);
app.put("/trades", controllers.handleTrade);

app.post("/user", controllers.addUser);
app.put("/user", controllers.editUser);

app.listen(process.env.PORT);
console.log(`listening on port ${process.env.PORT}`);
