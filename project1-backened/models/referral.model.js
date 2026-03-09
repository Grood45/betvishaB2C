const mongoose = require('mongoose');
const { GetCurrentDateTime } = require('../utils/GetCurrentDateTime');
const { Schema } = mongoose;
const referralSchema = Schema({
  refer_by: { type: String, required: true },
  refer_by_id:{ type: String, required:true},
  referred_user: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referred user ID
    username: { type: String }, // Referred user username
    name: { type: String }, // Referred user name
  },
  referral_code: { type: String, required: true }, // Referral code used
  steps_completed: {
    is_registered: { type: Boolean, default: true },
    is_deposited: { type: Boolean, default: false },
    is_wager_completed: { type: Boolean, default: false },
  },
  bonus_awarded: { type: Boolean, default: false }, // Whether bonus has been awarded
  bonus_added_to_user:{ type: Boolean, default: false }, // Whether bonus has been awarded
   // for minimum deposit and minimum bet amount;
   min_amount:{
    type:Number,
    default:0
  },
  bonus_amount: { type: Number, default: 0 }, // Bonus amount awarded to referred user
  created_at: { type: String, default: GetCurrentDateTime() }, // Date and time of referral creation
  updated_at: { type: String, default: GetCurrentDateTime() }, // Date and time of referral updation
  site_auth_key:{type:String},
  role_type: { type: String, required: true, default:"user" } // Referral code used
});

const Referral = mongoose.model('referral', referralSchema);
module.exports = Referral;



