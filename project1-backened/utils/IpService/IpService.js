const { default: axios } = require("axios");

const GetIpDetails=async(req, res) => {
    const { ip } = req.body;
    // Basic validation for IP address
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ip || !ipRegex.test(ip)) {
      return res.status(400).json({
        status: 400,
        data: null,
        success: false,
        message: "Invalid IP address."
      });
    }
    try {
      const response = await axios.get(`https://freegeoip.app/json/${ip}`);
      
      res.status(200).json({
        status: 200,
        data: response.data,
        success: true,
        message: "Success."
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        data: null,
        success: false,
        message:error?.message||"Failed to fetch IP details."
      });
    }
  }


  module.exports = {
    GetIpDetails
  };
  