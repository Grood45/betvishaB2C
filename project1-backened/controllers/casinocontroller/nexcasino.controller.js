const { default: axios } = require("axios");
const User = require("../../models/user.model");
const { GetCurrentDateTime } = require("../../utils/GetCurrentDateTime");
const GameTransactionModel = require("../../models/providers/gametransaction.model");

// Middleware for agent authentication
const authenticateAgent = (req, res, next) => {
  const { agent_code, agent_secret } = req.body;
  const { agent, secret } = req.query;
  console.log(agent_code, agent, agent_secret, secret);
  if (agent_code === agent && agent_secret === secret) {
    next();
  } else {
    res.status(401).json({ status: 0, msg: "INVALID_AGENT" });
  }
};

// Handle user balance request
const handleUserBalance = async (req, res) => {
  const { user_code } = req.body;
  const { agent, secret, api_provide_name } = req.query;
  if (!user_code) {
    return res.json({ status: 0, msg: "INVALID_PARAMETER" });
  }

  try {
    const user = await User.findOne({ username: user_code });

    if (user) {
      res.json({ status: 1, user_balance: user.amount });
    } else {
      res.json({ status: 0, user_balance: 0, msg: "INVALID_USER" });
    }
  } catch (err) {
    console.log(err);
    res.json({ status: 0, user_balance: 0, msg: "INTERNAL_ERROR" });
  }
};

// Handle transaction request
const handleTransaction = async (req, res) => {
  const { user_code, game_type, slot, live } = req.body;
  if (!user_code || !game_type || (!slot && !live)) {
    return res.json({ status: 0, msg: "INVALID_PARAMETER" });
  }

  try {
    const user = await User.findOne({ username: user_code });

    if (!user) {
      return res.json({ status: 0, msg: "INVALID_USER" });
    }

    let transactionDetails = slot || live;
    const {
      provider_code,
      game_code,
      bet_money,
      win_money,
      txn_id,
      txn_type,
      type,
    } = transactionDetails;

    if (user.amount < bet_money) {
      return res.json({ status: 0, msg: "INSUFFICIENT_USER_FUNDS" });
    }

    let newBalance = user.amount;
    let status = "pending";
    if (txn_type === "debit" || txn_type === "debit_credit") {
      newBalance -= bet_money;
      if (txn_type === "debit_credit") {
        status = "settled";
      }
    }

    if (txn_type === "credit" || txn_type === "debit_credit") {
      newBalance += win_money;
      status = "settled";
    }

    user.amount = newBalance;
    await user.save();

    const newGameHistory = new GameTransactionModel({
      provider: provider_code, // slot.provider_code
      provider_id: provider_code, // slot.provider_code
      game_name: game_code, // slot.game_code
      game_type: game_type, // game_type
      amount: bet_money, // slot.bet_money
      created_at: GetCurrentDateTime(), // GetCurrentDateTime()
      updated_at: GetCurrentDateTime(), // GetCurrentDateTime()
      parent_admin_id: user.parent_admin_id, // user.parent_admin_id
      parent_admin_role_type: user.parent_admin_role_type, // user.parent_admin_role_type
      parent_admin_username: user.parent_admin_username, // user.parent_admin_username
      round_id: txn_id, // slot.txn_id
      transaction_id: txn_id, // slot.txn_id
      transaction_type: txn_type, // slot.txn_type
      username: user_code, // user_code
      user_id: user.user_id, // user._id
      match_id: "", // example value, replace with actual match ID
      type: type, // slot.type
      currency: user.currency, // example value, replace with actual currency
      status: "settled", // example value, replace with actual status
      result: win_money > 0 ? "win" : "lose", // inferred from slot.win_money
      api_provider_name: "NEXUSGGREU", // example value, replace with actual API provider name
      result_type: win_money > 0 ? 1 : 0, // inferred from slot.win_money
    });

    await newGameHistory.save();

    res.json({ status: 1, user_balance: newBalance });
  } catch (err) {
    console.log(err);
    res.json({ status: 0, msg: "INTERNAL_ERROR" });
  }
};

const NexusGameCallback = (req, res) => {
  const { method } = req.body;
  switch (method) {
    case "user_balance":
      handleUserBalance(req, res);
      break;
    case "transaction":
      handleTransaction(req, res);
      break;
    default:
      res.json({ status: 0, msg: "INVALID_METHOD" });
  }
};

module.exports = {
  authenticateAgent,
  NexusGameCallback,
};
