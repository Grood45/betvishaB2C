const { default: axios } = require("axios");
const {
  ThirdPartyTransactionModel,
} = require("../../models/thirdpartycasino.model");
const User = require("../../models/user.model");
const { GetCurrentDateTime } = require("../../utils/GetCurrentDateTime");
const GameTransactionModel = require("../../models/providers/gametransaction.model");

// Helper function to validate agent token
const validateToken = (token, callback_token) => {
  return token === callback_token;
};

// Controller to handle all wallet operations (EVERGAME);
const EverGameCallback = async (req, res) => {
  const { method, token } = req.body;
  const { callback } = req.query;

  if (!validateToken(token, callback)) {
    return res.status(400).json({ status: 3, msg: "INVALID_AGENT" });
  }

  switch (method) {
    case "GetBalance":
      return await getBalance(req, res);
    case "ChangeBalance":
      return await changeBalance(req, res);
    case "UpdateDetail":
      return await updateDetail(req, res);
    default:
      return res.status(400).json({ status: 2, msg: "INVALID_ACTION" });
  }
};

const getBalance = async (req, res) => {
  const { userCode } = req.body;
  try {
    console.log(userCode)
    const user = await User.findOne({ username: userCode });
    if (!user) {
      return res.status(400).json({ status: 5, msg: "INVALID_USER" });
    }
    res.json({ status: 0, msg: "SUCCESS", balance: user.amount });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 1, msg: "INTERNAL_ERROR" });
  }
};

const changeBalance = async (req, res) => {
  const { userCode, txnType, wagerId, amount, createdOn, vendorCode, gameCode, gameRoundId, txnCode } = req.body;
  console.log(userCode)
  try {
    const user = await User.findOne({ username:userCode });
    if (!user) {
      return res.status(400).json({ status: 5, msg: "INVALID_USER" });
    }

    let newBalance = user.amount;
    let status="pending"
    if (txnType === 0) {
      // Debit
      newBalance += amount;
      status="pending"
    } else if (txnType === 1) {
      // Credit
      status="settled"
      newBalance += amount;
    } else if (txnType === 2) {
      status="void"
      // Cancel
      newBalance += amount;
      // Add logic to handle cancellation if needed
    }

    if (newBalance < 0) {
      return res.status(400).json({ status: 8, msg: "INSUFFICIENT_MONEY" });
    }

    user.amount = newBalance;
    await user.save();

    const newGameHistory = new GameTransactionModel({
      provider: vendorCode,
      provider_id: vendorCode,
      game_name: gameCode,
      game_type: "live",
      amount: amount,
      created_at: GetCurrentDateTime(),
      updated_at: GetCurrentDateTime(),
      parent_admin_id: user.parent_admin_id,
      parent_admin_role_type: user.parent_admin_role_type,
      parent_admin_username: user.parent_admin_username,
      round_id: gameRoundId,
      transaction_id: txnCode,
      transaction_type: txnType,
      username: user.username,
      user_id: user.user_id,
      user_code:userCode,
      match_id: "",
      type: "BASE",
      currency: user.currency,
      status: status,
      result: amount > 0 ? "win" : "lose",
      api_provider_name: "EVERGAME",
      wager_id:wagerId,
      result_type: amount > 0 ? 1 : 0,
    });

    await newGameHistory.save();
    res.json({ status: 0, msg: "SUCCESS", balance: user.amount });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(500).json({ status: 21, msg: "DUPLICATE_REQUESTKEY" });
    }
    res.status(500).json({ status: 1, msg: "INTERNAL_ERROR" });
  }
};

const updateDetail = async (req, res) => {
  const { wagerId, detail } = req.body;

  try {
    const transaction = await GameTransactionModel.findOne({ wager_id:wagerId });
    if (!transaction) {
      return res.status(400).json({ status: 18, msg: "INVALID_WAGER" });
    }
    transaction.detail = detail;
    await transaction.save();
    
    console.log("klmlmkmkmkmkm", transaction)
    res.json({ status: 0, msg: "SUCCESS" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 1, msg: "INTERNAL_ERROR" });
  }
};

module.exports = { EverGameCallback };
