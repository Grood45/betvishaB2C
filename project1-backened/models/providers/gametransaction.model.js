const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define your schema
const gameTransactionSchema = new Schema({
  provider: { type: String },  // Specify type for provider as String
  provider_id: { type: String },  // Specify type for provider_id as String
  game_name: { type: String },  // Specify type for game_name as String
  game_type: { type: String },  // Specify type for game_type as String
  amount: { type: Number },  // Specify type for amount as Number
  created_at: { type: Date },  // Specify type for created_at as Date
  updated_at: { type: Date },  // Specify type for updated_at as Date
  parent_admin_id: { type: String },  // Specify type for parent_admin_id as String
  parent_admin_role_type: { type: String },  // Specify type for parent_admin_role_type as String
  parent_admin_username: { type: String },  // Specify type for parent_admin_username as String
  round_id: { type: String },  // Specify type for round_id as String
  wager_id:{type:Number},
  sort: { type: String },  // Specify type for result as String
  transaction_id: { type: String },  // Specify type for transaction_id as String
  username: { type: String },  // Specify type for username as String
  detail:{type:String},
  user_code:{type:String},
  user_id: { type: String },  // Specify type for user_id as String
  match_id: { type: String },  // Specify type for match_id as String
  type: { type: String},  // Example with enum for type, specify type as String and enum for valid values
  currency: { type: String },  // Specify type for currency as String
  status: { type: String },  // Specify type for status as String
  result: { type: String },  // Specify type for result as String
  api_provider_name:{ type: String },  // Specify type for api_provider_name as String
  result_type: { type: Number, enum: [0, 1] },  // Example with enum for result_type, specify type as Number and enum for valid values
  site_auth_key:{ type: String, default:"" },  // Specify for each site.
});

// Create a Mongoose model
const GameTransactionModel = mongoose.model('GameTransaction', gameTransactionSchema);

module.exports = GameTransactionModel;
