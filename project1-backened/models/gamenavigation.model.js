const mongoose = require('mongoose');

const gameNavigationSchema = new mongoose.Schema({
  original_name: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true,
    default:false
  },
  icon: {
    type: String // You can adjust the type based on the format of your icon data
  },
  site_auth_key:{type:String}
});

const GameNavigation = mongoose.model('gamenavigation', gameNavigationSchema);

module.exports = GameNavigation;
