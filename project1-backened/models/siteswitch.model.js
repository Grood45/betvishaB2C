const mongoose = require('mongoose');
const { Schema } = mongoose;

const SiteSwitchSchema = new Schema({
 
    company_key: {type:String},
    site_name: {type:String, required:true},
    is_active: {type:Boolean},
    name: {type:String},
    age: {type:Number},
    selected: {type:Boolean},
    site_auth_key:{type:String},
    currency:{type:String},
});
 
// Create the model using the schema
const SiteSwitch = mongoose.model("SiteSwitch",SiteSwitchSchema );

module.exports = SiteSwitch;



// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const SiteSwitchSchema = new Schema({
//   site_auth_key: { type: String, required: true },
//   company_key: String,
//   site_name: String,
//   is_active: Boolean,
//   name: String,
//   age: Number,
//   selected: Boolean
// });

// // Middleware to enforce immutability of site_auth_key
// function preventUpdate(next) {
//   if (this._update && this._update.$set && 'site_auth_key' in this._update.$set) {
//     const error = new Error('site_auth_key is immutable and cannot be modified.');
//     return next(error);
//   }
//   next();
// }

// // Apply the preventUpdate middleware to findOneAndUpdate and updateOne operations
// SiteSwitchSchema.pre('findOneAndUpdate', preventUpdate);
// SiteSwitchSchema.pre('updateOne', preventUpdate);

// SiteSwitchSchema.pre('save', function(next) {
//   if (this.isModified('site_auth_key') && !this.isNew) {
//     const error = new Error('site_auth_key is immutable and cannot be modified.');
//     return next(error);
//   }
//   next();
// });

// // Create the model using the schema
// const SiteSwitch = mongoose.model("SiteSwitch", SiteSwitchSchema);

// module.exports = SiteSwitch;
