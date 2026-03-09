const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
  currency: {
    type: String,
    required: true,
  },
  processing_time: {
    type: String,
    required: true,
    default: "10 minute's",
  },
  bonus: {
    type: Number,
    bonus: 0,
  },
  gateway: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: false,
  },
  image: {
    type: String,
    required: false,
  },
  max_limit: {
    type: Number,
    required: true,
  },
  min_limit: {
    type: Number,
    required: true,
  },
  instruction: {
    type: String,
    required: false,
  },
  qr_code:{
    type: String,
    required: false,
    default:""
  },
  
  admin_details: [],
  user_details: [],
  type: {
    type: String,
    required: true,
    enum: ["deposit", "withdraw"],
  },
  user_type: {
    type: String,
    enum: ["user", "admin"],
  },
  parent_admin_id: { type: String, default: "", required: true },
  parent_admin_role_type: { type: String, default: "", required: true },
  parent_admin_username: { type: String, default: "", required: true },
  site_auth_key:{type:String}
});

const PaymentModel = mongoose.model("payment", PaymentSchema);

module.exports = { PaymentModel };
