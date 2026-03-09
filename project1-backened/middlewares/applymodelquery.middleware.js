const { VerifyJwt } = require("../utils/VerifyJwt");
const SiteSwitch = require("../models/siteswitch.model");
const Admin = require("../models/admin.model");
const User = require("../models/user.model");
require("dotenv").config();
const AddModelQueryMiddleware = async (req, res, next) => {
  const { token, usernametoken } = req.headers;
  let site_auth_key = req.query?.site_auth_key;
  if (!site_auth_key && req.body?.site_auth_key) {
    site_auth_key = req.body?.site_auth_key;
  }
  if(req.path==="/admin-login"){
    return next()
  }

  try {
    if (!token && !usernametoken && !site_auth_key) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Validate access token and verify token here
    let type = "";
    let adminUsername = "";
    if (token && usernametoken) {
      type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
      adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    }
    if (!adminUsername && !type && !site_auth_key) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    let modelQuery = {};

    if (
      type === process.env.OWNER_ROLETYPE
    ) {
      const siteData = await SiteSwitch.findOne({ selected: true });

      modelQuery = { site_auth_key: siteData?.site_auth_key }
    } else {
      if ((!type && !adminUsername) || type == "user" || site_auth_key) {
        if (type == "user") {
          data = await User.findOne({
            role_type: type,
            username: adminUsername,
          });
          modelQuery = { site_auth_key: data?.site_auth_key };
        } else {
          modelQuery = { site_auth_key: site_auth_key };
        }
      } else {
        data = await Admin.findOne({
          role_type: type,
          username: adminUsername,
        });
        modelQuery = { site_auth_key: data.site_auth_key };
      }
      // console.log(modelQuery, "model query")
    }
    req.query = { ...req.query, modelQuery: modelQuery };
    console.log(req.query, "fffff data query",req.query, "query")
    next();
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = { AddModelQueryMiddleware };
