const { VerifyJwt } = require("../utils/VerifyJwt");
const SiteSwitch = require("../models/siteswitch.model");
const Admin = require("../models/admin.model");
const User = require("../models/user.model");
require("dotenv").config();
let originalFind;

const AddCommonQueryMiddleware = (modelName) => async (req, res, next) => {
  const { token, usernametoken } = req.headers;
  // console.log(modelName, "modelName")
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

    let data = {};

    if (
      type === process.env.OWNER_ROLETYPE
    ) {
      const siteData = await SiteSwitch.findOne({ selected: true });

      if (!originalFind) {
        originalFind = modelName.Query.prototype.find;
      }

      modelName.Query.prototype.find = function (conditions) {
        const mergedConditions = {
          ...conditions,
          site_auth_key: siteData.site_auth_key,
        };
        return originalFind.call(this, mergedConditions);
      };
    } else {
      const [site_auth_key] = rew.query;
      if ((!type && !adminUsername) || type == "user"||site_auth_key) {
        if (type == "user") {
          data = await User.findOne({
            role_type: type,
            username: adminUsername,
          });
        } else {
          data.site_auth_key = site_auth_key;
        }
      } else {
        data = await Admin.findOne({
          role_type: type,
          username: adminUsername,
        });
      }
      if (!originalFind) {
        originalFind = modelName.Query.prototype.find;
      }

      modelName.Query.prototype.find = function (conditions) {
        const mergedConditions = {
          ...conditions,
          site_auth_key: data.site_auth_key,
        };
        return originalFind.call(this, mergedConditions);
      };
      // console.log(modelName, data.site_auth_key, "auth")
    }
    // console.log(modelName.Query.prototype, "jnini")
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

module.exports = { AddCommonQueryMiddleware };
