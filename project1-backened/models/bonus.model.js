const mongoose = require('mongoose');

// Define schema for Deposit Commission
const commissionSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    required: true
  },
  commission_rate: {
    type: String,
    required: true
  },
  bonus_type: {
    type: String,
    required: true,
    enum:["deposit", "withdraw", "betlose", "betwin", "refer"]
  },
  promotion_code: {
    type: String,
    required: true
  },
  is_wagered:{type:Boolean},
  wager_required:{type:Number},
  site_auth_key:{type:String}
});

// Create model for Deposit Commission
const Commission = mongoose.model('Commission', commissionSchema);

module.exports = Commission;
