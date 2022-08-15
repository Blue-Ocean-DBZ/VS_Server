let convert = require("convert-zip-to-gps");
require("dotenv").config();

module.exports = {
  addCoordinates: async function (req, res, next) {
    let coords = convert.zipConvert(req.body.zip);
    coords = coords.split(",");
    req.body.longitude = coords[1];
    req.body.latitude = coords[0];
    next();
  },
};
