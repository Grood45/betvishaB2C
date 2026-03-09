const { default: axios } = require("axios");
const AgentModel = require("../../models/agent.model");

require("dotenv").config();
const currencyValues = [
  "ALL",
  "ADP",
  "AOA",
  "ARS",
  "XCD",
  "AMD",
  "AED",
  "AFN",
  "AUD",
  "AZN",
  "BSD",
  "BHD",
  "BBD",
  "BYN",
  "BDT",
  "BND",
  "BZD",
  "BMD",
  "INR",
  "BOB",
  "BAM",
  "BWP",
  "BRL",
  "BGN",
  "XOF",
  "BIF",
  "XAF",
  "CVE",
  "KYD",
  "CLP",
  "CNY",
  "COP",
  "KMF",
  "CDF",
  "CRC",
  "HRK",
  "CUP",
  "CYP",
  "CAD",
  "CZK",
  "DKK",
  "DOP",
  "DJF",
  "DZD",
  "EUR",
  "LBP",
  "LSL",
  "LRD",
  "LYD",
  "CHF",
  "MKD",
  "MGA",
  "MWK",
  "MYR",
  "MRO",
  "MUR",
  "MZN",
  "MMK",
  "NAD",
  "NIO",
  "OMR",
  "ERN",
  "ETB",
  "FJD",
  "GMD",
  "GEL",
  "GHS",
  "GTQ",
  "GNF",
  "GYD",
  "HTG",
  "HNL",
  "HUF",
  "ISK",
  "IRR",
  "IQD",
  "GBP",
  "HKD",
  "IDR",
  "IDO",
  "INR",
  "JPY",
  "KRW",
  "KHR",
  "LAK",
  "LKR",
  "ILS",
  "JMD",
  "JOD",
  "KZT",
  "KES",
  "KPW",
  "KWD",
  "KGS",
  "MAD",
  "MNT",
  "MYK",
  "MXN",
  "NGN",
  "NOK",
  "NPR",
  "NZD",
  "PEN",
  "PKR",
  "RUB",
  "SEK",
  "THB",
  "TRY",
  "UCC",
  "USD",
  "VES",
  "PGK",
  "PYG",
  "PHP",
  "PLN",
  "QAR",
  "RON",
  "RWF",
  "WST",
  "STN",
  "SAR",
  "RSD",
  "SCR",
  "SLL",
  "VND",
  "VNO",
  "SGD",
  "SBD",
  "SOS",
  "SSP",
  "SDG",
  "SRD",
  "SZL",
  "SYP",
  "TWD",
  "TJS",
  "TZS",
  "TOP",
  "TTD",
  "TND",
  "TMT",
  "UGX",
  "UYU",
  "UZS",
  "YER",
  "ZMW",
  "ZWL",
  "ZAR",
];

const handleAgentCurrency = async (req, res) => {
  try {
    const baseURL = `${process.env.CASINO_BASE_URL}/web-root/restricted/agent/register-agent.aspx`;
    const commonPayload = {
      Password: "Sher1241",
      Min: 1,
      Max: 5000,
      MaxPerMatch: 20000,
      CasinoTableLimit: 1,
      CompanyKey: process.env.COMPANY_KEY,
      ServerId: process.env.SERVER_ID,
    };
    
    const results = await Promise.all(currencyValues.map(async (currency) => {
      const payload = {
        ...commonPayload,
        Username: `AgentProd${currency}7787`,
        Currency: currency,
      };

      try {
        const registerAgent = await axios.post(baseURL, payload);
        console.log(registerAgent.data, currency, "message");

        if (registerAgent.data.error && registerAgent?.data?.error?.msg !== "No Error") {
          const agent = new AgentModel(payload);
          await agent.save();
        }

        return { currency, status: 'success', data: payload, error: registerAgent.data.error };
      } catch (error) {
        console.error("Error registering agent:", error);
        return { currency, status: 'error', error };
      }
    }));

    res.json({ status: 200, success: true, results });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ status: 500, success: false, error });
  }
};


module.exports = { handleAgentCurrency };
