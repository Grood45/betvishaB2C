const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define an array of valid sports types

const GameSliderSchema = new Schema({
  images: {
    type: Array,
    default: [],
  },
  site_auth_key:{type:String}
});

// Create the BetHistory model
const GameSliderModel = mongoose.model("gameslider", GameSliderSchema);
module.exports = { GameSliderModel };
