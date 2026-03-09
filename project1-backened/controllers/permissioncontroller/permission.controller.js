const Admin = require("../../models/admin.model");
const User = require("../../models/user.model");
const { VerifyJwt } = require("../../utils/VerifyJwt");

const GetSinglePermission = async (req, res) => {
    const { token, usernametoken } = req.headers;
    const { role_type } = req.query;
  
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
  
    try {
      // Validate access token and verify token here
      const type = await VerifyJwt(token, req, res); // Implement this function
      const adminUsername = await VerifyJwt(usernametoken, req, res); // Implement this function
  
      if (!adminUsername || !type) {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Invalid tokens. Access denied.",
        });
      }
  
      const model = role_type === "user" ? User : Admin;
      const data = await model.findOne({
        username: adminUsername,
        role_type: type,
      }).select(["permissions", "username"]);
  
      if (!data) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: role_type === "user" ? "User not found." : "Admin not found.",
        });
      }
  
      return res.status(200).json({
        status: 200,
        success: true,
        message: role_type === "user" ? "User data retrieved successfully." : "Admin data retrieved successfully.",
        data: data.permissions = data.permissions.map(ele => {
            ele.value = false;
            return ele}),
        username:data.username,
      });
    } catch (error) {
      console.error("Error in GetSinglePermission handler:", error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error.",
      });
    }
  };
  

module.exports = {GetSinglePermission};
