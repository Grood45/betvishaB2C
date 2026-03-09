const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const depositSchema = new Schema({
  method: {
    type: String,
    required: true,
  },
  method_id: {
    type: String || Number,
    required: true,
  },
  method_url: {
    type: String,
  },
  transaction_id: {
    type: String,
    required: true,
    unique: true,
  },
  initiated_at: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  deposit_amount: {
    type: Number,
    required: true,
  },
  bonus: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["approved", "reject", "pending"],
    required: true,
    default: "pending",
  },
  updated_at: {
    type: String,
  },
  deposit_slip: {
    type: String,
  },
  payable: {
    type: Number,
    required: true,
  },
  after_deposit: {
    type: Number,
    required: true,
  },
  wallet_amount: {
    type: Number,
    required: true,
  },
  admin_response: {
    type: String,
  },
  user_details: {
    type: Array,
  },
  admin_details: {
    type: Array,
  },
  utr_no: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "deposit",
  },
  user_type: {
    type: String,
    enum: ["user", "admin"],
  },
  currency: {
    type: String,
    default: "INR",
  },
  parent_admin_id: { type: String, default: "", required: true },
  parent_admin_role_type: { type: String, default: "", required: true },
  parent_admin_username: { type: String, default: "", required: true },
  transaction_type: {
    type: String,
    enum: [
      "bonus",
      "chip_creation",
      "referral_bonus",
      "promotional_bonus",
      "free_bet",
      "loyalty_reward",
      "deposit_bonus",
    ],
  },
  bonus_id: { type: String},
  site_auth_key:{type:String, default:"BspAuthKey123"},
  approved_by_username:{type:String}, 
  approved_by_admin_id:{type:String}, 
  approved_by_role_type:{type:String, enum:["owneradmin","admin"]}
});

depositSchema.index({ initiated_at: -1 });
depositSchema.index({ updated_at: -1 });

const DepositModel = mongoose.model("Deposit", depositSchema);

module.exports = DepositModel;
