const mongoose = require("mongoose");
const User = require("./models.js").User;
const Plant = require("./models.js").Plant;
const save = require("./models.js").save;

module.exports = {
  addUser: function (userObject) {
    return save(userObject);
  },

  editUser: function (userId) {},

  addPlant: function (req, res) {
    console.log("called");
    let userId = req.body.userId;
    let plantObject = req.body.plantObject;

    User.find({ _id: userId }).then((data) => {
      console.log(data);
      res.send();
    });
  },

  addToFavorites: function (userId, plantId) {},

  removeFromFavorites: function (userId, plantId) {},

  requestTrade: function (userId, targetUserId, plantsOffer, plantsRequest) {},

  handleTrade: function (tradeId, acceptOrReject) {},

  removePlant: function (req, res) {
    Plant.findByIdAndRemove({ _id: req.params.id }).then(() => {
      console.log("removed");
      res.send();
    });
  },

  findByLocation: function (req, res) {
    let long = req.query.long;
    let latt = req.query.latt;
    console.log(long, latt);
    User.find({
      location: {
        $near: {
          $maxDistance: 32186.9,
          $geometry: {
            type: "Point",
            coordinates: [long, latt],
          },
        },
      },
    }).then((response) => {
      res.send(response);
    });
  },
};

// 20 mi => 32186.9 meters;
// 150 mi => 241402 meters;
// addPlant
// findByLocation
// addToFavorites
// requestTrade
// handleTrade
// addUser
// editUser
// removePlant
// removeFromFavorites
