const mongoose = require('mongoose');
const { GetCurrentDateTime } = require('../utils/GetCurrentDateTime');

// Define the schema for the market
const marketSchema = new mongoose.Schema({
    market_id: { 
        type: Number, 
        required: true, 
        unique: true 
    },
    market_name: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['active', 'cancelled', 'settled', 'resettled'], 
        default: 'active' 
    },
    start_time: { 
        type: Date, 
        required: true 
    },
    end_time: { 
        type: Date, 
        required: true 
    },
    created_at: { 
        type: String, 
        default:  GetCurrentDateTime()
    },
    updated_at: { 
        type: String,
        default: GetCurrentDateTime()
    }
});

// Pre-save hook to update `updated_at` field
marketSchema.pre('save', function(next) {
    this.updated_at = GetCurrentDateTime();
    next();
});

const Market = mongoose.model('Market', marketSchema);
module.exports = Market;
