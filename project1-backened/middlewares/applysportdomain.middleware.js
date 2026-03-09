const { default: axios } = require("axios");
const { SportSetupModel } = require("../models/providers/sportsetup.model");

const queryDomainMiddleware = async (req, res, next) => {
  try {
    const { providerName } = req.body;
    const { providerName: queryProvider } = req.query;

    const targetProvider = providerName || queryProvider || '9Wicket';

    const setup = await SportSetupModel.findOne({ provider_name: targetProvider });

    if (!setup || !setup.status) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: `${targetProvider} sports provider is currently unavailable or disabled.`
      });
    }

    // NEW LOGIC: If keys are missing, we still allow the setup to be attached so frontend can show banners,
    // but we skip the actual domain querying which requires external API keys.
    if (!setup.cert_key || (!setup.callback_url && targetProvider === 'PowerPlay')) {
      req.sportSetup = setup;
      req.activeDomain = ""; // No active domain since we can't query it
      return next();
    }

    const queryUrl = setup.callback_url || "https://apiinfo.prc01d1.xyz/api/apiWallet/W4P/queryDomain";
    const response = await axios.post(
      queryUrl,
      {
        cert: setup.cert_key,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data.status === "1") {
      const activeDomain = response.data.domains.find(
        (domain) => domain.priority === 1
      ).domain;

      // Attach the active domain and sport setup to the request object
      req.activeDomain = activeDomain;
      req.sportSetup = setup;
      next();
    } else {
      return res.status(500).json({
        status: 500,
        success: false,
        data: {},
        message: "Failed to query domain",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      data: {},
      message: "Error querying domain",
    });
  }
};


module.exports = { queryDomainMiddleware }