const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const agentSchema = new Schema({
    Username: {type:String},
    Password: {type:String},
    Currency: {type:String},
    Min: {type:Number},
    Max: {type:Number},
    MaxPerMatch: {type:Number},
    CasinoTableLimit: {type:Number},
    CompanyKey: {type:String},
    ServerId:  {type:String}
});

const AgentModel = mongoose.model('agent', agentSchema);

module.exports = AgentModel;
