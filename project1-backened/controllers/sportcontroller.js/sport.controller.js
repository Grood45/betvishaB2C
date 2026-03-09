const { default: axios } = require("axios");
const User = require("../../models/user.model");
const { VerifyJwt } = require("../../utils/VerifyJwt");
require("dotenv").config();
// Generate a unique transaction code
const generateTransactionCode = () => {
  return "TXN_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
};

const GetKeyDepositAndLogin = async (req, res) => {
  const { eventType } = req.body;
  const { token, usernametoken } = req.headers;
  const modelQuery = req.query.modelQuery;
  const activeDomain = req.activeDomain;

  let session;

  try {
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res);
    const userUsername = await VerifyJwt(usernametoken, req, res);
    if (!userUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    // Add pagination and modify query
    const query = { ...modelQuery, username: userUsername };

    // Graceful check for missing keys
    if (!activeDomain || !req.sportSetup?.cert_key) {
      return res.status(200).json({
        status: 200,
        success: false,
        message: "Provider is currently under maintenance. Please try again later.",
      });
    }

    // Step 1: Get the key for the user
    const keyResponse = await axios.post(
      `https://apiinfo.${activeDomain}/api/apiWallet/W4P/getKey`,
      {
        cert: req.sportSetup.cert_key,
        userId: userUsername,
        userName: userUsername, // Assuming userName is the same as userId
        agent: req.sportSetup.agent_code, // Replace with your agent
        currency: 2, // Assuming currency code is 2, adjust as needed
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (keyResponse.data.status !== "1") {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Failed to retrieve key.",
      });
    }

    const key = keyResponse.data.key;

    // Step 2: Use Mongoose Transaction to find user and handle deposit
    session = await User.startSession();
    session.startTransaction();

    const user = await User.findOne(query).session(session).exec();
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    const userBalance = user.amount;

    // Step 3: Check if user already has a pending deposit
    if (user.isProcessingDeposit) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Deposit already in process for this user.",
      });
    }

    // Set deposit flag to true to prevent concurrent deposits
    user.isProcessingDeposit = true;
    await user.save({ session });

    if (userBalance > 0) {
      const depositResponse = await axios.post(
        `https://apiinfo.${activeDomain}/api/apiWallet/W4P/deposit`,
        {
          cert: req.sportSetup.cert_key,
          userId: userUsername,
          sourceWallet: "CUSTOM_SYSTEM",
          destinationWallet: "SPORTS",
          balance: userBalance,
          tsCode: generateTransactionCode(),
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (depositResponse.data.status !== "1") {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Deposit failed.",
        });
      }
    }

    // Update user's balance and deposit status after successful deposit
    user.amount = 0;
    user.isProcessingDeposit = false;
    await user.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Step 4: Use the key to log the user in
    const encodedKey = encodeURIComponent(key);
    let loginUrl = `https://www.${activeDomain}/apiWallet/player/W4P/login?userId=${userUsername}&key=${encodedKey}`;
    if (eventType) loginUrl += `&eventType=${eventType}`;

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Key retrieved, deposit successful, and login URL generated.",
      loginUrl: loginUrl,
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error during key retrieval, deposit, or login process.",
      error: error.message,
    });
  }
};



const WithdrawAndLogout = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const modelQuery = req.query.modelQuery || {};
  const activeDomain = req.activeDomain;
  try {
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token
    const type = await VerifyJwt(token, req, res);
    const userUsername = await VerifyJwt(usernametoken, req, res);
    if (!userUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    // Add pagination and modify query
    const query = { ...modelQuery, username: userUsername };
    // Step 1: Get the user's balance from the external API
    const balanceResponse = await axios.post(
      `https://apiinfo.${activeDomain}/api/apiWallet/W4P/getBalance`,
      {
        cert: req.sportSetup.cert_key,
        userIds: userUsername,
        alluser: 0,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(balanceResponse.data, "balance response");
    if (balanceResponse.data.status !== "1") {
      return res.status(500).json({
        status: 500,
        success: false,
        message: `Failed to retrieve balance for user ${userUsername}.`,
      });
    }

    const netBalance = balanceResponse.data.results[0].balance;

    // Step 2: Update the user's balance in the local database
    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    user.amount += netBalance;
    await user.save();
    // Step 3: Withdraw the updated balance
    if (netBalance > 0) {
      const withdrawalResponse = await axios.post(
        `https://apiinfo.${activeDomain}/api/apiWallet/W4P/withdraw`,
        {
          cert: req.sportSetup.cert_key,
          userId: userUsername,
          balance: user.amount,
          tsCode: generateTransactionCode(),
          withdrawtype: 0,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log(withdrawalResponse.data, "withdrawal response");
      if (withdrawalResponse.data.status !== "1") {
        return res.status(500).json({
          status: 500,
          success: false,
          message: `Withdrawal failed for user ${userUsername}`,
        });
      }
    }

    // Step 4: Log the user out
    const logoutResponse = await axios.post(
      `https://www.${activeDomain}/apiWallet/player/W4P/logout`,
      {
        cert: req.sportSetup.cert_key,
        userIds: userUsername,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log(logoutResponse.data, "logout response");
    if (logoutResponse.data.status !== "1") {
      return res.status(500).json({
        status: 500,
        success: false,
        message: `Logout failed for user ${userUsername} after successful withdrawal`,
      });
    }

    // Step 5: Return success response
    return res.status(200).json({
      status: 200,
      success: true,
      message: `Withdrawal of ${user.amount} and logout successful for user ${userUsername}.`,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error during withdrawal and logout process.",
    });
  }
};

const GetSportBalance = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const activeDomain = req.activeDomain;
  try {
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res);
    const userUsername = await VerifyJwt(usernametoken, req, res);
    if (!userUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Step 1: Get the user's balance from the external API
    const balanceResponse = await axios.post(
      `https://apiinfo.${activeDomain}/api/apiWallet/W4P/getBalance`,
      {
        cert: req.sportSetup.cert_key,
        userIds: userUsername,
        alluser: 0,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log(balanceResponse.data, "balance response");
    if (balanceResponse.data.status !== "1") {
      return res.status(500).json({
        status: 500,
        success: false,
        message: `Failed to retrieve balance for user ${userUsername}.`,
      });
    }

    const netBalance = balanceResponse.data.results[0];

    // Return the balance as a success response
    return res.status(200).json({
      status: 200,
      success: true,
      balance: netBalance,
      message: `Balance retrieved successfully for user ${userUsername}.`,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error during balance retrieval process.",
    });
  }
};

const GetSportBalanceAdmin = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const { username } = req.query;
  const activeDomain = req.activeDomain;
  try {
    if (!token || !usernametoken || !username) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res);
    const userUsername = await VerifyJwt(usernametoken, req, res);
    if (!userUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Step 1: Get the user's balance from the external API
    const balanceResponse = await axios.post(
      `https://apiinfo.${activeDomain}/api/apiWallet/W4P/getBalance`,
      {
        cert: req.sportSetup.cert_key,
        userIds: username,
        alluser: 0,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (balanceResponse.data.status !== "1") {
      return res.status(500).json({
        status: 500,
        success: false,
        message: `Failed to retrieve balance for user ${username}.`,
      });
    }

    const netBalance = balanceResponse.data.results[0];

    // Return the balance as a success response
    return res.status(200).json({
      status: 200,
      success: true,
      balance: netBalance,
      message: `Balance retrieved successfully for user ${username}.`,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error during balance retrieval process.",
    });
  }
};

function validateDates(startDate, endDate, allUser = false) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const maxDays = 35 * 24 * 60 * 60 * 1000; // 35 days in milliseconds
  const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const now = new Date();

  if (end - start > maxDays) {
    throw new Error("The date range cannot exceed 35 days.");
  }

  if (now - start > maxDays) {
    throw new Error("The start date must be within the last 35 days.");
  }

  if (end < start) {
    throw new Error("End date must be greater than start date.");
  }

  if (allUser && end - start > oneDay) {
    throw new Error(
      "When querying all users, the date range cannot exceed 24 hours."
    );
  }
}

async function GetLastOneDayBetHistory(req, res) {
  try {
    const {
      betStatus = -1,
      isTxnDetail = 0,
      timeZone = 0,
      pageNumber = 1,
      reportType = 0,
    } = req.body;

    // Set date range to the last one day
    const now = new Date();
    const startDate = now.toISOString().slice(0, 10) + " 00:00"; // Today's start
    const endDate = now.toISOString().slice(0, 16).replace("T", " "); // Current time
    const activeDomain = req.activeDomain;
    const payload = {
      cert: req.sportSetup.cert_key,
      startDate,
      endDate,
      betStatus,
      isTxnDetail,
      timeZone,
      pageNumber,
      reportType,
    }

    // Make the API call to query bet history
    const url = `https://apiinfo.${activeDomain}/api/apiWallet/W4P/queryBetHistoryForAllStatus`;
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { settled, cancelled, voided } = response.data;

    // Combine all bet data
    const allBet = [
      ...(settled?.resultList || []),
      ...(cancelled?.resultList || []),
      ...(voided?.resultList || []),
    ];

    // Prepare pagination info
    const pagination = {
      currentPage: settled?.currentPage || 1,
      totalPage: settled?.totalPage || 1,
      totalCount: settled?.totalCount || allBet.length,
    };

    return res.status(200).json({
      status: 200,
      success: true,
      data: allBet,
      pagination,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      data: [],
      error: error.message,
    });
  }
}



async function GetAllSportBetHistoryUser(req, res) {
  const { token, usernametoken } = req.headers;
  const activeDomain = req.activeDomain;
  try {
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res);
    const userUsername = await VerifyJwt(usernametoken, req, res);
    if (!userUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    const {
      betStatus = -1,
      isTxnDetail = 0,
      timeZone = 0,
      pageNumber = 1,
      reportType = 0,
    } = req.body;

    // Default to the last 24 hours if no dates are provided for all user queries
    const now = new Date();
    const defaultEndDate = now.toISOString().slice(0, 16).replace("T", " "); // current date and time
    const defaultStartDate = new Date(now - 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16)
      .replace("T", " "); // 24 hours ago
    const startDate = req.body.startDate || defaultStartDate;
    const endDate = req.body.endDate || defaultEndDate;
    // Validate dates
    validateDates(startDate, endDate, !userUsername);
    const payload = {
      cert: req.sportSetup.cert_key,
      userId: userUsername,
      startDate,
      endDate,
      betStatus,
      isTxnDetail,
      timeZone,
      pageNumber,
      reportType,
    }

    // Make the API call to query bet history
    const url = `https://apiinfo.${activeDomain}/api/apiWallet/W4P/queryBetHistoryForAllStatus`;
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { settled, cancelled, voided } = response.data;

    // Combine all bet data
    const allBet = [
      ...(settled?.resultList || []),
      ...(cancelled?.resultList || []),
      ...(voided?.resultList || []),
    ];

    // Prepare pagination info
    const pagination = {
      currentPage: settled?.currentPage || 1,
      totalPage: settled?.totalPage || 1,
      totalCount: settled?.totalCount || allBet.length,
    };

    return res.status(200).json({
      status: 200,
      success: true,
      data: allBet,
      pagination,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      data: [],
      error: error.message,
    });
  }
}


async function GetAllSportBetHistoryUserByAdmin(req, res) {
  const { token, usernametoken } = req.headers;
  const activeDomain = req.activeDomain;
  try {
    const {
      betStatus = -1,
      isTxnDetail = 0,
      timeZone = 0,
      pageNumber = 1,
      reportType = 0,
      username = ""
    } = req.body;
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res);
    const userUsername = await VerifyJwt(usernametoken, req, res);
    if (!userUsername || !type || !username) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    // Default to the last 24 hours if no dates are provided for all user queries
    const now = new Date();
    const defaultEndDate = now.toISOString().slice(0, 16).replace("T", " "); // current date and time
    const defaultStartDate = new Date(now - 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16)
      .replace("T", " "); // 24 hours ago
    const startDate = req.body.startDate || defaultStartDate;
    const endDate = req.body.endDate || defaultEndDate;
    // Validate dates
    validateDates(startDate, endDate, !username);
    const payload = {
      cert: req.sportSetup.cert_key,
      userId: username,
      startDate,
      endDate,
      betStatus,
      isTxnDetail,
      timeZone,
      pageNumber,
      reportType,
    }

    // Make the API call to query bet history
    const url = `https://apiinfo.${activeDomain}/api/apiWallet/W4P/queryBetHistoryForAllStatus`;
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { settled, cancelled, voided } = response.data;

    // Combine all bet data
    const allBet = [
      ...(settled?.resultList || []),
      ...(cancelled?.resultList || []),
      ...(voided?.resultList || []),
    ];

    // Prepare pagination info
    const pagination = {
      currentPage: settled?.currentPage || 1,
      totalPage: settled?.totalPage || 1,
      totalCount: settled?.totalCount || allBet.length,
    };

    return res.status(200).json({
      status: 200,
      success: true,
      data: allBet,
      pagination,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      data: [],
      error: error.message,
    });
  }
}

module.exports = {
  GetKeyDepositAndLogin,
  WithdrawAndLogout,
  GetSportBalance,
  GetSportBalanceAdmin,
  GetAllSportBetHistoryUser,
  GetAllSportBetHistoryUserByAdmin,
  GetLastOneDayBetHistory
};