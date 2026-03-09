const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const withdrawalSchema = new Schema({
  method: {
    type: String,
    required: true,
  },
  method_url:{
    type:String
    
  },
  method_id: {
    type: String || Number,
    required: true,
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
  withdraw_amount: {
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
    required:true,
    default: "pending",
  },
  updated_at: {
    type: String
  },
  withdraw_slip: {
    type: String,
  },
  payable: {
    type: Number,
    required: true,
  },
  after_withdraw: {
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
  },
  type: {
    type: String,
    default: "withdraw",
  },
  user_type: {
    type: String,
    enum: ["user", "admin"],
  },
  currency: { 
    type: String,
    default: "EUR",
  },
  parent_admin_id:{type:String,default:"", required:true},
  parent_admin_role_type:{type:String,default:"", required:true},
  parent_admin_username:{type:String,default:"", required:true},
  approved_by_username:{type:String},
  approved_by_admin_id:{type:String}, 
  approved_by_role_type:{type:String, enum:["owneradmin","admin"]},
  site_auth_key:{type:String},
});
withdrawalSchema.index({ initiated_at: -1 });
withdrawalSchema.index({ updated_at: -1 });

const WithdrawModel = mongoose.model("Withdrawal", withdrawalSchema);

module.exports = WithdrawModel;
