const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const providerSchema = new Schema({
    provider_name: {type:String},
    provider_id: {type:String},
    provider_type: {type:String},
    image_url:{type:String, default:""},
    currency: {type:String},
    status:{type:Boolean, default:false},
    site_auth_key:{ type: String },
    priority: {type:Number},
    api_provider_name:{type:String}
});

const ProviderModel = mongoose.model('secondaryprovider', providerSchema);

module.exports = {ProviderModel};
