const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sportSetupSchema = new Schema({
    provider_name: { type: String, required: true },
    cert_key: { type: String, default: "" },
    agent_code: { type: String, default: "" },
    provider_image: { type: String, default: "" },
    provider_logo: { type: String, default: "" },
    sport_images: [{
        sport_name: { type: String, required: true },
        image_url: { type: String, required: true },
        event_type: { type: Number, required: true },
        status: { type: Boolean, default: true }
    }],
    callback_url: { type: String, default: "" },
    is_maintenance: { type: Boolean, default: false },
    maintenance_display_type: { type: String, default: "alert" }, // "alert" or "overlay"
    is_coming_soon: { type: Boolean, default: false },
    coming_soon_display_type: { type: String, default: "alert" }, // "alert" or "overlay"
    status: { type: Boolean, default: false },
}, { timestamps: true });

const SportSetupModel = mongoose.model('sportsetup', sportSetupSchema);

module.exports = { SportSetupModel };
