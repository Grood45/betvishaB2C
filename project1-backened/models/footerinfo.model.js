const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    label: String,
    src: String,
    link: String
});

const partnerSchema = new mongoose.Schema({
    alt: String,
    src: String,
    link: String,
    height: Number,
    width: Number,
    target: String
});

const footerInfoSchema = new mongoose.Schema({
    payments: [paymentSchema],
    partners: [partnerSchema],
    footer_text:{type:Array},
    site_auth_key:{type:String}
});

const FooterInfo = mongoose.model('footerinfo', footerInfoSchema);

module.exports = FooterInfo;
