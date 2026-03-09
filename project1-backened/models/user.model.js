const mongoose = require("mongoose");
const { GetCurrentTime } = require("../utils/GetCurrentTime");
const { GetCurrentDateTime } = require("../utils/GetCurrentDateTime");
const Schema = mongoose.Schema;
require("dotenv").config();


const userSchema = new Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  user_code: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    default: "",
  },
  user_id: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  bank_name: {
    type: String,
    default: "",
  },
  bank_holder: {
    type: String,
    default: "",
  },
  account_number: {
    type: String,
    default: "",
  },
  ifsc_code: {
    type: String,
    default: "",
  },
  branch_code: { typr: String },
  document: {
    document_type: {
      type: String,
      default: ""
    },
    document_url: {
      type: String,
      default: ""
    }
  },
  joined_at: {
    type: String,
    default: "",
  },
  updated_at: {
    type: String,
    default: "",
  },
  status: {
    type: Boolean,
    default: true,
  },
  state: {
    type: String,
    default: "",
  },
  bet_supported: {
    type: Boolean,
    default: true,
  },
  is_blocked: {
    type: Boolean,
    default: false,
  },
  kyc_verified: {
    type: Boolean,
    default: false,
  },
  is_withdraw_suspend: {
    type: Boolean,
    default: false
  },
  sms_verified: {
    type: Boolean,
    default: false,
  },
  bank_verified: { type: Boolean, default: false },
  email_verified: { type: Boolean, default: false },
  is_online: {
    type: Boolean,
    default: true,
  },
  last_seen: {
    type: String,
    default: "",
  },
  last_bonus_calculation_time: {
    type: String,
    default: GetCurrentDateTime(),
  },
  profile_picture: {
    type: String,
    default: "",
  },
  referral_code: {
    type: String,
    default: "",
  },
  refer_by: {
    type: String,
    default: "",
  },

  refer_by_code: {
    type: String,
    default: "",
  },

  referred_users: {
    type: Array,
    default: [],
  },

  amount: {
    type: Number,
    default: 0.0,
  },
  exposure_limit: {
    type: Number,
    required: true,
    default: 10000,
  },
  daily_max_deposit_limit: {
    type: Number,
    default: 100000,
  },
  daily_max_withdrawal_limit: {
    type: Number,
    default: 50000,
  },
  welcome_bonus: {
    type: Number,
    default: 0,
  },
  deposit_method: {
    type: String,
    default: "Bank Transfer",
  },
  user_type: {
    type: String,
    default: 'Self Registered',
  },
  kyc_required: {
    type: Boolean,
    default: true
  },
  official_user: {
    type: Boolean,
    default: false
  },
  admin_notes: {
    type: String,
  },
  max_limit: {
    type: Number,
    default: 100000, // Default maximum limit value, adjust as needed
  },
  min_limit: {
    type: Number,
    default: 100, // Default minimum limit value, adjust as needed
  },
  turnover: {
    type: Number,
    default: 0, // Default 0
  },
  bonus: {
    type: Number,
    default: 0, // Default 0
  },
  totalBetAmount: {
    type: Number,
    default: 0,
  },
  totalWinAmount: {
    type: Number,
    default: 0,
  },
  totalLoseAmount: {
    type: Number,
    default: 0,
  },
  totalVoidAmount: {
    type: Number,
    default: 0,
  },
  address: {
    type: String,
    default: "",
  },
  otp: {
    type: String,
    default: "",
  },
  birthday: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  postcode: {
    type: String,
    default: "",
  },
  isProcessingDeposit: {
    type: Boolean,
    default: false,  // Indicates if a deposit is currently being processed
  },
  site_auth_key: { type: String, default: "BspAuthKey123" },
  parent_admin_id: { type: String, default: "" },
  parent_admin_username: {
    type: String,
    default: "",
  },
  parent_admin_role_type: { type: String, default: "" },
  role_type: { type: String, default: "user" },
  currency: {
    type: String,
    default: "INR",
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  deleted_at: {
    type: Date,
  },
  promotion_id: { type: String },
  creation_mode: {
    type: String,
    default: "register", // 'register' or 'manual'
  },
});
// Adding compound indexes
userSchema.index({ username: -1, user_id: -1 });
userSchema.index({ parent_admin_id: -1, parent_admin_username: -1, site_auth_key: -1 });
const User = mongoose.model("User", userSchema);

module.exports = User;
