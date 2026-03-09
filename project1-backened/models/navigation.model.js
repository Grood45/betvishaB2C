const mongoose = require('mongoose');

const navigationSchema = new mongoose.Schema({
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
    required: true
  },
  icon: {
    type: String // You can adjust the type based on the format of your icon data
  },

  data:{type:Array, default:[], required:true},
  site_auth_key:{type:String}
});

const Navigation = mongoose.model('Navigation', navigationSchema);

module.exports = Navigation;
