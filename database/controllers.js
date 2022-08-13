const mongoose = require("mongoose");
const User = require("./models.js").User;
const save = require("./models.js").save;

module.exports = {
  addUser: function (userObject) {
    return save(userObject);
  },
};
// findByLocation
