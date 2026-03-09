const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  gpId: { type: Number },
  gpName: { type: String },
  gameId: { type: Number },
  gameName: { type: String },
  gameNameChinese: { type: String },
  device: { type: [String] },
  priority: { type: Number },
  category: { type: [String], default: [] }, // Category should be an array of strings
  image_url: { type: String, default: "" },
  category_image_url:{ type: String, default: "" },
  status: {
    type: Boolean,
    default: true, // Default value for the status field
  },
  site_auth_key: { type: String , default:"BspAuthKey123"}
});

const CasinoProvider = mongoose.model('CasinoProvider', providerSchema); // Use PascalCase for model names

module.exports = CasinoProvider;
