const mongoose = require("mongoose");
const { GetCurrentDateTime } = require("../utils/GetCurrentDateTime");
const Schema = mongoose.Schema;
// Sub-schema for bank details
const bankDetailsSchema = new Schema({
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
  branch_code: {
    type: String,
    default: "",
  },
});
const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  admin_id: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
    required: false,
    default: "",
  },
  phone: {
    type: String,
    default:""
  },
  state: {
    type: String,
    default:""
  },
  country: {
    type: String,
    default:""
  },
  is_2fa_enabled:{
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    required: false,
    default:""
  },
  share_percentage: {
    type: Number,
    default: 0,
    required: true,
    min: 0, // Minimum value is 0%
    max: 100, // Maximum value is 100%
  },
  min_payout: {
    type: Number,
    default: 100.0, // Minimum amount required for a payout
  },
  max_payout: {
    type: Number,
    default: 1000000.0, // Maximum amount required for a payout
  },
  password: {
    type: String,
    required: true,
    default:""
  },
  facebook: {
    type: String,
    default:""
  },
  twitter: {
    type: String,
    default:""
  },
  instagram: {
    type: String,
    default:""
  },
  city: {
    type: String,
    default:""
  },
  amount: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    default: true,
  },
  bet_active: {
    type: Boolean,
    default: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  is_blocked: {
    type: Boolean,
    default: false,
  },
  user_count: {
    type: Number,
    default: 0,
  },
  admin_count: {
    type: Number,
    default: 0,
  },
  parent_admin_id: {
    type: String,
  },
  
  permissions: [
    {
      name: { type: String, required: true },
      value: { type: Boolean, default: false },
    },
  ],
  parent_admin_username: {
    type: String,
    required: true,
  },
   affiliate_code: { type: String, default:""},
  parent_admin_role_type: {
    type: String,
    enum: [
      "owneradmin",
      "admin",
      "affiliate"
    ], // Use enum for allowed values
    required: true,
  },
  role_type: {
    type: String,
    enum: [
      "owneradmin",
      "admin",
      "affiliate"
    ],
  },
  whatsapp_no:{type:String, default:null},
  telegram_no:{type: String, default:null},
  joined_at: {
    type: String,
    default: "",
  },
  updated_at: {
    type: String,
    default: "",
  },// Adding the bank_details field with the bankDetailsSchema
  bank_details: bankDetailsSchema,
  min_payout: {
    type: Number,
    default: 100.0, // Minimum amount required for a payout
  },
  max_payout: {
    type: Number,
    default: 1000000.0, // Maximum amount required for a payout
  },
  platform_fee: {
    type: Number,
    default: 0,
    required: true,
    min: 0, // Minimum value is 0%
    max: 100, // Maximum value is 100%
  },
  last_calculation_time:{
    type: String,
    default: GetCurrentDateTime(),
  },
  last_calculation_amount:{
    type: Number,
    default: 0,
  },
  min_payout: {
    type: Number,
    default: 100.0, // Minimum amount required for a payout
  },
  max_payout: {
    type: Number,
    default: 1000000.0, // Maximum amount required for a payout
  },
  exposure_limit: { type: Number, default: 100000 },
  currency: {
    type: String,
    default: "INR",
  },
  profile_picture: {
    type: String,
    default: "",
  },
  site_auth_key: { type: String, default: "BspAuthKey123" },
  secret:{type:String},
});
// Define default permissions based on the role
adminSchema.pre("save", function (next) {
  if (this.isNew) {
    // Set default permissions based on the role
    switch (this.role_type) {
      case "owneradmin":
        this.permissions = [
          { name: "userView", value: true },
          { name: "userManage", value: true },
          { name: "allUserView", value: true },
          { name: "allUserManage", value: true },
          { name: "adminView", value: true },
          { name: "adminManage", value: true },
          { name: "allAdminView", value: true },
          { name: "allAdminManage", value: true },
          { name: "sportView", value: true },
          { name: "sportManage", value: true },
          { name: "userDepositView", value: true },
          { name: "userDepositManage", value: true },
          { name: "userWithdrawView", value: true },
          { name: "userWithdrawManage", value: true },
          { name: "userTransactionView", value: true },
          { name: "userTransactionManage", value: true },
          { name: "downlineDepositView", value: true },
          { name: "downlineDepositManage", value: true },
          { name: "uplineDepositView", value: true },
          { name: "uplineDepositManage", value: true },
          { name: "downlineWithdrawView", value: true },
          { name: "downlineWithdrawManage", value: true },
          { name: "uplineWithdrawView", value: true },
          { name: "uplineWithdrawManage", value: true },
          { name: "adminTransactionView", value: true },
          { name: "adminTransactionManage", value: true },
          { name: "manualDepositView", value: true },
          { name: "manualDepositManage", value: true },
          { name: "autoDepositView", value: true },
          { name: "autoDepositManage", value: true },
          { name: "manualWithdrawView", value: true },
          { name: "manualWithdrawManage", value: true },
          { name: "autoWithdrawView", value: true },
          { name: "autoWithdrawManage", value: true },
          { name: "betDetailsView", value: true },
          { name: "betHistoryView", value: true },
          { name: "liveBetView", value: true },
          { name: "playerWiseReportView", value: true },
          { name: "gameReportView", value: true },
          { name: "ggrReportView", value: true },
          { name: "generateAmountView", value: true },
          { name: "generateAmountManage", value: true },
          { name: "bonusView", value: true },
          { name: "bonusManage", value: true },
          { name: "bonusHistoryView", value: true },
          { name: "socialMediaView", value: true },
          { name: "socialMediaManage", value: true },
          { name: "logoBannerView", value: true },
          { name: "logoBannerManage", value: true },
          { name: "footerContentView", value: true },
          { name: "footerContentManage", value: true },
          { name: "seoView", value: true },
          { name: "seoManage", value: true },
          { name: "providerView", value: true },
          { name: "providerManage", value: true },
          { name: "gameManage", value: true },
          { name: "gameView", value: true },
          { name: "gameNavigationManage", value: true },
          { name: "gameNavigationView", value: true },
          { name: "permissionView", value: true },
          { name: "permissionManage", value: true },
          { name: "supportTicketView", value: true }, // Can view support tickets
          { name: "supportTicketManage", value: true }, // Can manage support tickets
          // Add other permissions for Agent role if needed
        ];
        break;
      case "admin":
        this.permissions = [];
        break;
      default:
        // Handle unexpected role types
        this.permissions = [];
        break;
    }
  }
  next();
});
adminSchema.index({ parent_admin_id: -1, parent_admin_username: -1, site_auth_key: -1 });

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;

