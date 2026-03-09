const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shortcutSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'FiLink'
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const ShortcutModel = mongoose.model('shortcut', shortcutSchema);

module.exports = ShortcutModel;
