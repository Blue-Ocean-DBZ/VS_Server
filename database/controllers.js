const mongoose = require("mongoose");
const User = require("./models.js").User;
const save = require("./models.js").save;

module.exports = {
  addUser: function (userObject) {
    return save(userObject);
  },

  editUser: function (userId) {},

  addPlant: function (userId, plantObject) {},

  addToFavorites: function (userId, plantId) {},

  removeFromFavorites: function (userId, plantId) {},

  requestTrade: function (userId, targetUserId, plantsOffer, plantsRequest) {},

  handleTrade: function (tradeId, acceptOrReject) {},

  removePlant: function (plantId) {},
};
// addPlant
// findByLocation
// addToFavorites
// requestTrade
// handleTrade
// addUser
// editUser
// removePlant
// removeFromFavorites
