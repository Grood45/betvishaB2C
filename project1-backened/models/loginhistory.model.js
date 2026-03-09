const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true
  },
  login_history: [
    {
      login_ip: {
        type: String,
        required: true
      },
      login_time: {
        type: String,
        required: true
      },
      _id: false // Exclude the _id field
    },
  ],
  created_time: {
    type: String,
    required: true
  },
  updated_time: {
    type: String,
    required: true,
  },
  site_auth_key:{
    type:String,
    required:true,
  },
  parent_admin_id:{
   type:String,
   required:true, 
  },
  parent_admin_role_type:{
    type:String,
    required:true, 
   },
   parent_admin_username:{
    type:String,
    required:true, 
   }
});

loginHistorySchema.index({ updated_time: -1 });

const LoginHistory = mongoose.model('LoginHistory', loginHistorySchema);

module.exports = LoginHistory;
