const mongoose = require("mongoose");

// location -> [longitude, latitude]

const plantSchema = new mongoose.Schema({
  name: String,
  category: [{ type: String }],
  photo: String,
});

const userSchema = new mongoose.Schema({
  name: String,
  profile_picture: String,
  username: String,
  password: String,
  plants: [
    {
      type: plantSchema,
    },
  ],
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

const User = mongoose.model("User", userSchema);

const save = function (userObject) {
  let user = new User(userObject);
  return user.save();
};

module.exports.save = save;
module.exports.User = User;
