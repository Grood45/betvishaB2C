const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const providerInformationSchema = new Schema({
    agent_code: {type:String, required:true,unique:true},
    api_token: {type:String, required:true,unique:true},
    callback_token: {type:String, required:true,unique:true},
    secret_key: {type:String, required:true,unique:true},
    image_url:{type:String},
    status:{type:Boolean, default:false},
    currency: {type:String},
    provider_name: {type:String, required:true,unique:true},
    provider_api_url: {type:String,required:true,unique:true},
    provider_callback_url: {type:String, required:true,unique:true},
    percent: {type:Number, default:5},
    max_limit: {type:Number, default:20000},
    min_limit: {type:Number, default:10},
    max_per_match: {type:Number, default:50000},
    casino_table_limit: {type:Number},
    modified_api_provider_name:{type:String},
});

const ProviderInformationModel = mongoose.model('providerinformation', providerInformationSchema);

module.exports = ProviderInformationModel;
