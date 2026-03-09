const mongoose = require("mongoose");
const { GetCurrentDateTime } = require("../utils/GetCurrentDateTime");
const { Schema } = mongoose;

// Define a schema for promotions
const bonusHistorySchema = new Schema({
  username: { type: String, required: true }, // Username associated with the promotion
  timestamp: { type: String}, // Timestamp of when the promotion was recorded
  category: {
    type: String,
    required: true,
    enum: ["user_bonus", "deposit_bonus", "bet_bonus", "referral_bonus"], // Only allow specific categories
  },
  sub_category: {
    type: String,
    required: true,
  },
  bonus_amount: { type: Number, required: true }, // Reward amount offered by the promotion
  reward_amount: { type: Number, required: true }, // Reward amount offered by the promotion
  reward_type: { type: String, enum: ["fixed", "percentage"], required: true }, // Reward type: fixed or percentage
  min_reward: { type: Number }, // Optional minimum reward amount
  max_reward: { type: Number }, // Optional maximum reward amount
  description: { type: String, required: true }, // Description of the promotion
  eligibility: { type: String, required: true }, // Eligibility criteria for the promotion
  bonus_added_to_user:{ type: Boolean, default:false}, // Bonus added to user
  status: { type: String, enum: ["success", "failed"], required: true }, // Status of the promotion: success or failed
  parent_admin_id: { type: String, required: true }, // ID of the parent admin associated with the promotion
  parent_admin_username: { type: String, required: true }, // Username of the parent admin associated with the promotion
  parent_admin_role_type: { type: String, required: true }, // Role type of the parent admin associated with the promotion
  start_date: { type: String }, // Start date of the promotion
  end_date: { type: String }, // End date of the promotion
  rules: { type: String }, // Rules or terms of the promotion
  image: { type: String }, // URL of the promotion image
  min_deposit: { type: Number, default: 0 }, // Optional deposit amount required for the promotion
  min_bet: { type: Number, default: 0 }, // Optional deposit amount required for the promotion
  role_type:{type:String, default:"user"},
  site_auth_key:{type:String},
  is_wagered:{type:Boolean, default:false},
  reason:{type:String},
  wager_required:{type:Number, default:1},
  last_bonus_calculation_time:{type:String}
});

// Define a model based on the schema
const BonusHistory = mongoose.model("bonushistory", bonusHistorySchema);

module.exports = BonusHistory;


// const const {category:"referral_bonus"}