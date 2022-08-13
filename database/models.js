const mongoose = require("mongoose");

// location -> [longitude, latitude]

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const plantSchema = new mongoose.Schema({
  name: String,
  category: [{ type: String }],
  photo: String,
  owner: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  profile_picture: String,
  plants: [
    {
      type: plantSchema,
    },
  ],

  location: {
    type: pointSchema,
    required: true,
  },

  favorites: [
    {
      type: plantSchema,
    },
  ],
});

const tradeSchema = new mongoose.Schema({
  userId: String,
  targetUserId: String,
  userPlantsOffer: [{ type: plantSchema }],
  targetPlant: [{ type: plantSchema }],
  pending: Boolean,
});

const User = mongoose.model("User", userSchema);

const save = function (userObject) {
  let user = new User(userObject);
  return user.save();
};

module.exports.save = save;
module.exports.User = User;
