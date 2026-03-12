const axios = require("axios");
const User = require("../../models/user.model");
const { SportSetupModel } = require("../../models/providers/sportsetup.model");
const { VerifyJwt } = require("../../utils/VerifyJwt");
require("dotenv").config();

// 1. Generate Auth Token and Login URL for LuckySport iframe
const GetLuckySportToken = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const modelQuery = req.query.modelQuery || {};

  try {
    // Basic Authentication Check
    if (!token || !usernametoken) {
      return res.status(401).json({ status: 401, success: false, message: "Invalid tokens. Access denied." });
    }

    const type = await VerifyJwt(token, req, res);
    const userUsername = await VerifyJwt(usernametoken, req, res);

    if (!userUsername || !type) {
      return res.status(401).json({ status: 401, success: false, message: "Invalid tokens, Access denied." });
    }

    const query = { ...modelQuery, username: userUsername };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ status: 404, success: false, message: "User not found." });
    }

    // 2. Fetch LuckySport Dynamic Settings from DB
    const providerSetup = await SportSetupModel.findOne({ provider_name: "LuckySport" });

    if (!providerSetup || !providerSetup.status || providerSetup.is_maintenance) {
      return res.status(200).json({
        status: 200,
        success: false,
        message: "LuckySport is currently under maintenance or disabled by the administrator.",
      });
    }

    const { cert_key: BASE_URL, agent_code: SECRET_KEY } = providerSetup;

    if (!BASE_URL || !SECRET_KEY) {
      return res.status(500).json({ status: 500, success: false, message: "Provider API keys are missing in the database configuration." });
    }

    // 3. Request Session Token from LuckySport Master API
    const authPayload = {
      UserName: userUsername,
      SecretKey: SECRET_KEY
    };

    const config = {
      method: 'post',
      url: `${BASE_URL}/api/Auth/get-token`,
      headers: { 'Content-Type': 'application/json' },
      data: authPayload
    };

    const response = await axios(config);
    const data = response.data;

    if (data.status === 200 && data.Success) {
      // Combine token with Widget load URL
      // Based on Uni247 docs: AppUrl?token=xxxxx
      const loginUrl = `${data.AppUrl}?token=${data.Token}`;

      return res.status(200).json({
        status: 200,
        success: true,
        message: "LuckySport token generated successfully.",
        loginUrl: loginUrl,
        token: data.Token,
      });
    } else {
      return res.status(500).json({
        status: 500,
        success: false,
        message: data.Message || "Failed to retrieve LuckySport token.",
      });
    }

  } catch (error) {
    console.error("LuckySport Token Error:", error?.response?.data || error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error connecting to LuckySport Provider.",
      error: error.message,
    });
  }
};

// 4. Fetch LuckySport Bet History for Admin
const GetLuckySportBetHistory = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const { startDate, endDate, pageNumber = 1, status = -1, userId = "" } = req.body;

  try {
    // Fetch Keys from DB
    const providerSetup = await SportSetupModel.findOne({ provider_name: "LuckySport" });
    if (!providerSetup) {
      return res.status(404).json({ status: 404, success: false, message: "LuckySport setup not found." });
    }

    const { cert_key: BASE_URL, agent_code: SECRET_KEY } = providerSetup;

    const payload = {
      SecretKey: SECRET_KEY,
      StartDate: startDate,
      EndDate: endDate,
      PageNumber: pageNumber,
      Status: status,
      UserId: userId // If empty, gets all
    };

    const config = {
      method: 'post',
      url: `${BASE_URL}/api/BetHistory/get-all-history`, // Standard Uni247 History Endpoint
      headers: { 'Content-Type': 'application/json' },
      data: payload
    };

    const response = await axios(config);
    return res.status(200).json(response.data);

  } catch (error) {
    console.error("LuckySport History Error:", error?.response?.data || error.message);
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error fetching history from LuckySport.",
      error: error.message,
    });
  }
};

// 5. Fetch LuckySport Bet History for User (Frontend)
const GetLuckySportBetHistoryUser = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const { startDate, endDate, pageNumber = 1, status = -1 } = req.body;

  try {
    const userUsername = await VerifyJwt(usernametoken, req, res);
    if (!userUsername) {
      return res.status(401).json({ status: 401, message: "Invalid token" });
    }

    const providerSetup = await SportSetupModel.findOne({ provider_name: "LuckySport" });
    const { cert_key: BASE_URL, agent_code: SECRET_KEY } = providerSetup;

    const payload = {
      SecretKey: SECRET_KEY,
      UserId: userUsername,
      StartDate: startDate,
      EndDate: endDate,
      PageNumber: pageNumber,
      Status: status
    };

    const config = {
      method: 'post',
      url: `${BASE_URL}/api/BetHistory/get-all-history`,
      headers: { 'Content-Type': 'application/json' },
      data: payload
    };

    const response = await axios(config);
    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(500).json({ status: 500, success: false, message: "Error fetching user history." });
  }
};

module.exports = {
  GetLuckySportToken,
  GetLuckySportBetHistory,
  GetLuckySportBetHistoryUser
};
