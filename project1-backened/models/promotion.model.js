const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define a schema for promotions
const promotionSchema = new Schema({
  category: {
    type: String,
    required: true,
    enum: ["user_bonus", "deposit_bonus", "bet_bonus", "referral_bonus"] // Added referral_bonus category
  },
  sub_category: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        if (this.category === "user_bonus") {
          // Check if sub_category is "first_user" for user_bonus category
          return value === "first_user";
        } else if (this.category === "bet_bonus") {
          // Check if sub_category is one of the allowed values for bet_bonus
          return ["first_bet", "lose_bet", "every_bet"].includes(value);
        } else if (this.category === "deposit_bonus") {
          // Check if sub_category is one of the allowed values for deposit_bonus
          return ["first_deposit", "every_deposit", "occasion_deposit"].includes(value);
        } else if (this.category === "referral_bonus") {
          // Check if sub_category is one of the allowed values for referral_bonus
          return ["first_referral", "every_referral", "milestone_referral"].includes(value);
        }
        return false; // Allow any sub_category for other categories
      },
      message: "Invalid sub_category for the given category."
    }
  },
  reward_amount: { type: Number, required: true }, // Reward amount offered by the promotion
  reward_type: { type: String, enum: ['fixed', 'percentage'], required: true }, // Reward type: fixed or percentage
  min_reward: { type: Number, default:null}, // Optional minimum reward amount
  max_reward: { type: Number, default:null}, // Optional maximum reward amount
  description: { type: String, required: true }, // Description of the promotion
  eligibility: { type: String, required: true }, // Eligibility criteria for the promotion
  status: { type: Boolean, default: false }, // Status of the promotion: active or inactive
  parent_admin_id: { type: String, default: 'owneradmin' }, // ID of the parent admin associated with the promotion
  parent_admin_username: { type: String, default: 'owneradmin' }, // Username of the parent admin associated with the promotion
  parent_admin_role_type: { type: String, default: 'owneradmin' }, // Role type of the parent admin associated with the promotion
  start_date: { type: String }, // Start date of the promotion
  end_date: { type: String }, // End date of the promotion
  rules: { type: String }, // Rules or terms of the promotion
  image: { type: String }, // URL of the promotion image
  min_deposit: { type: Number, default: 0 }, // Optional deposit amount required for the promotion
  min_bet: { type: Number, default: 0 }, // Optional bet amount required for the promotion
  site_auth_key: { type: String },
  wager_required: { type: Number },
});

// Define a model based on the schema
const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;
