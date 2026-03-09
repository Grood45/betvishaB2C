const mongoose = require("mongoose");
const { GetCurrentDateTime } = require("../utils/GetCurrentDateTime");
const TransactionIdGenerator = require("../utils/TransactionIdGenerator");
const { Schema } = mongoose;

const affiliateSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: []
  },
  payouts: {
    type: [
      {
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: String,
          default: GetCurrentDateTime(),
        },
        status: {
          type: String,
          enum: ["pending", "settled", "failed"],
          default: "pending",
        },
        payment_method: {
          type: String,
          enum: [
            "bank_transfer",
            "paypal",
            "crypto",
            "phonepe",
            "paytm",
            "upi",
            "gpay",
          ],
          required: true,
        },
        transaction_id: {
          type: String,
          default: TransactionIdGenerator(),
          required: true,
        },
        account_name: {
          type: String,
          default: "",
        },
        account_no: {
          type: String,
          default: "",
        },
        ifsc_code: {
          type: String,
          default: "",
        },
        upi: {
          type: String,
          default: "",
        },
        crypto_address: {
          type: String,
          default: "",
        },
      },
    ],
    default: [], // Default to an empty array
  },
  role_type:{type:String, default:"affiliate"},
  parent_admin_username: {
    type: String,
    required: true,
  },
  parent_admin_id: {
    type: String,
    required: true,
  },
  parent_admin_role_type: {
    type: String,
    enum: ["owneradmin", "admin", "subadmin"], // Use enum for allowed values
    required: true,
  },
});

const Affiliate = mongoose.model("Affiliate", affiliateSchema);
module.exports = Affiliate;