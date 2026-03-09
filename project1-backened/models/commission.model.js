    const mongoose = require("mongoose");

    // Define Commission schema
    const commissionSchema = new mongoose.Schema({
    commission_id: { type: String, unique: true },
    banner: {
        type: [String] // Indicates an array of strings
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        default: null,
    },
    fixed_amount: {
        type: Number,
        default: null,
    },
    status: {
        type: Boolean,
        required: true,
    },
    percentage: {
        type: Number,
        required: function () {
        return this.rate !== null; // Percentage is required if rate is not null
        },
    },
    commission_type: {
        type: String,
        enum: ["Fixed", "Percentage"], // Commission type must be one of these values
        required: true,
    },
    commission_for: {
        type: String,
        enum: ["deposit", "betting"], // Commission type must be one of these values
        required: true,
    },
    parent_admin_id: {
        type: String,
    },
    parent_admin_username: {
        type: String,
        required: true,
    },
    parent_admin_role_type: {
        type: String,
        enum: [
            "owneradmin",
            "admin",
            "subadmin",
            "manager",
            "affiliate",
            "agent",
            "subagent",
            "support",
            "billing",
            "player",
        ], // Use enum for allowed values
        required: true,
    },
    });

    // Create Commission model
    const Commission = mongoose.model("Commission", commissionSchema);

    module.exports = Commission;
