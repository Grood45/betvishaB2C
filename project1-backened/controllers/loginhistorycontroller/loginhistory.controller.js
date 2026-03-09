const LoginHistory = require("../../models/loginhistory.model");
const { VerifyJwt } = require("../../utils/VerifyJwt");
require("dotenv").config();
const GetLoginHistory = async (req, res) => {
  const {
    username,
    role,
    search,
    page = 1,
    limit = 10,
    modelQuery,
  } = req.query;

  const site_auth_key = modelQuery?.site_auth_key;
  const { token, usernametoken } = req.headers;

  try {
    // Token validation
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    // Build the filter object
    let filter = {};
    if (username) filter.username = username;
    if(role) filter.role = role;
    if (role === "alladmin") filter.role = { $ne: "user" };
    if (site_auth_key) filter.site_auth_key = site_auth_key;
    if (search) {
      filter.$or = [
        { username: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
      ];
    }

    // Additional query modifications based on admin validation
    if (type !== process.env.OWNER_ROLETYPE) {
      filter.parent_admin_role_type = type;
      filter.parent_admin_username = adminUsername;
      filter.username = { $ne: adminUsername };
    }

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    // Query the database with filter and sort by updated_time in descending order with pagination
    const totalItems = await LoginHistory.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limitInt);

    const loginHistory = await LoginHistory.find(filter)
      .select("-site_auth_key")
      .sort({ updated_time: -1 })
      .skip((pageInt - 1) * limitInt)
      .limit(limitInt);

    const pagination = {
      totalItems,
      totalPages,
      currentPage: pageInt,
      limit: limitInt,
    };

    res.status(200).json({
      status: 200,
      success: true,
      data: loginHistory,
      pagination,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Failed to fetch login history.",
    });
  }
};

module.exports = GetLoginHistory;
