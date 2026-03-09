const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const otherGameSchema = new Schema({
  game_name: { type: String },
  game_id: { type: String },
  provider: { type: String },
  provider_id: { type: String },
  game_type: { type: String },
  provider_type: { type: String },
  game_category: { type: Array, default: [] },
  image_url: { type: String },
  priority: { type: Number, index: true }, // Add index here
  currency: { type: String },
  status: { type: Boolean, default: false },
  language: { type: String },
  site_auth_key: { type: String },
  api_provider_name:{type:String}
});


// Set the default sort order by priority
otherGameSchema.pre('find', function() {
    this.sort({ priority: 1 });
  });

const OtherGameModel = mongoose.model(
  "othergame",
  otherGameSchema
);

module.exports = OtherGameModel;