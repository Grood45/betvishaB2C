const ProviderInformationModel = require("../models/providers/providerdata/providerinformation.model");
const User = require("../models/user.model");

const AuthenticateNexusggreu = async (req, res, next) => {
  try {
    const { user_code } = req.body;
    if (!user_code) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "UserCode are required",
      });
    }
    const user = await User.findOne({ username: user_code });
    if (!user) {
      return res.json({ status: 0, msg: "INVALID_USER" });
    }
    const providerInfo = await ProviderInformationModel.findOne({
      currency: user.currency,
      provider_name: "NEXUSGGREU",
    });
    if (!providerInfo) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Provider information not found",
      });
    }
    req.query.api = providerInfo.api_token;
    req.query.callback = providerInfo.callback_token;
    req.query.agent = providerInfo.agent_code;
    req.query.api_provider_name = providerInfo.provider_name;
    req.query.secret = providerInfo.secret_key;
    req.headers["Authorization"] = `Bearer ${providerInfo.callback_token}`;
    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const AuthenticateEvergame = async (req, res, next) => {
  try {
    const { userCode, vendorCode } = req.body;

    if (!userCode) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Usercode is required",
      });
    }
    const user = await User.findOne({ username: userCode });

    if (!user) {
      return res.status(400).json({ status: 5, msg: "INVALID_USER" });
    }
    const providerInfo = await ProviderInformationModel.findOne({
      currency: user.currency,
      provider_name: "EVERGAME",
    });

    if (!providerInfo) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Provider information not found",
      });
    }

    req.query.api = providerInfo.api_token;
    req.query.callback = providerInfo.callback_token;
    req.query.agent = providerInfo.agent_code;
    req.query.api_provider_name = providerInfo.provider_name;

    // Add headers to the request
    req.headers["Authorization"] = `Bearer ${providerInfo.callback_token}`;
    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const AuthenticateDreamgates = async (req, res, next) => {
  try {
    const { data = {}, user_code = "0" } = req.body;
    const { account = "" } = data;
    console.log(account, user_code);
    if (!account && !user_code) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Usercode is required",
      });
    }

    const user = await User.findOne({
      $or: [{ username: account }, { user_code: user_code }],
    });

    if (!user) {
      const result = {
        result: 21,
        status: "ERROR",
        data: {},
      };
      return res.json(result);
    }
    console.log(user, "user", account, user_code);
    const providerInfo = await ProviderInformationModel.findOne({
      currency: user.currency,
      provider_name: "DREAMGATES",
    });
    if (!providerInfo) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Provider information not found",
      });
    }

    req.query.api = providerInfo.api_token;
    req.query.callback = providerInfo.callback_token;
    req.query.agent = providerInfo.agent_code;
    req.query.api_provider_name = providerInfo.provider_name;
    req.headers["Authorization"] = `Bearer ${providerInfo.callback_token}`;
    req.headers["callback-token"] = providerInfo.callback_token;

    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  AuthenticateDreamgates,
  AuthenticateEvergame,
  AuthenticateNexusggreu,
};
