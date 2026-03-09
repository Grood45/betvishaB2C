const mongoose = require('mongoose');
const { GetCurrentDateTime } = require('../utils/GetCurrentDateTime');

// Define the schema for the bet
const betSchema = new mongoose.Schema({
    bet_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        auto: true 
    },
    partner_id: { 
        type: String, 
        required: true 
    },
    username: { 
        type: String, 
        required: true 
    },
    market_id: { 
        type: Number, 
        required: true 
    },
    market_name: { 
        type: String, 
        required: true 
    },
    bet_type: { 
        type: Number, 
        required: true // Enum or type of bet (e.g., 1 for straight bet, 2 for accumulator, etc.)
    },
    transaction_id: { 
        type: String, 
        required: true 
    },
    runner_id: { 
        type: Number, 
        required: true 
    },
    runner_name: { 
        type: String, 
        required: true 
    },
    rate: { 
        type: Number, 
        required: true 
    },
    stake: { 
        type: Number, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['placed', 'cancelled', 'settled', 'resettled'], 
        default: 'placed' 
    },
    transaction_type: { 
        type: Number, 
        required: true // Enum to indicate transaction type (e.g., 1 for debit, 2 for credit)
    },
    session_point: { 
        type: Number, 
        default: null 
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
betSchema.pre('save', function(next) {
    this.updated_at = GetCurrentDateTime();
    next();
});

module.exports = mongoose.model('Bet', betSchema);
