const Admin = require("../models/admin.model");
const { VerifyJwt } = require("../utils/VerifyJwt");

const CheckPermission = (requiredPermission) => {
    return async (req, res, next) => {
      const { token, usernametoken } = req.headers;
      try {
        if (!token || !usernametoken) {
          return res.status(401).json({
            status: 401,
            success: false,
            message: "Invalid tokens. Access denied.",
          });
        }
  
        // Validate access token and verify token here
        const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
        const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
        if (!adminUsername || !type) {
          return res.status(401).json({
            status: 401,
            success: false,
            message: "Invalid tokens, Access denied.",
          });
        }
  
        // Fetch the admin by username and role_type
        const admin = await Admin.findOne({ username: adminUsername, role_type: type });
  
        if (!admin) {
          return res.status(401).json({
            status: 401,
            success: false,
            message: "Admin not found.",
          });
        }
  
        // Check if the admin has the required permission
        const hasPermission = admin.permissions.some(permission => permission.name === requiredPermission && permission.value === true);
  
        if (!hasPermission) {
          return res.status(403).json({
            status: 403,
            success: false,
            message: "You do not have permission to access this resource.",
          });
        }
  
        // Admin has the required permission, proceed to the next middleware or route handler
        next();
      } catch (error) {
        console.error("Error in authentication middleware:", error);
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Internal server error",
        });
      }
    };
  };
  
  module.exports = CheckPermission;