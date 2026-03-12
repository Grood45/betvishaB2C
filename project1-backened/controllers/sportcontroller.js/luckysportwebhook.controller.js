const User = require("../../models/user.model");
const mongoose = require("mongoose");
const { SportSetupModel } = require("../../models/providers/sportsetup.model");

// Function to get User Balance
// When a user places a bet or the provider wants to verify funds
const GetUserBalanceWebhook = async (req, res) => {
    try {
        const { reqId, SecretKey, UserId } = req.body;

        if (!UserId || !SecretKey) {
            return res.status(400).json({ status: 400, message: "Missing required parameters" });
        }

        // Verify Secret Key from Database Config Let's assume you store Secret in agent_code field
        const providerSetup = await SportSetupModel.findOne({ provider_name: "LuckySport" });
        if (!providerSetup || providerSetup.agent_code !== SecretKey) {
            return res.status(401).json({ status: 401, message: "Unauthorized - Invalid SecretKey" });
        }

        const user = await User.findOne({ username: UserId });

        if (!user) {
            console.error(`Webhook get-balance error: User ${UserId} not found.`);
            return res.status(404).json({ status: 404, message: "User Not Found!" });
        }

        return res.status(200).json({
            status: 200,
            ReqId: reqId,
            balance: user.amount || 0,
            Currency: "INR",
        });

    } catch (error) {
        console.error("Webhook Get Balance Error: ", error);
        return res.status(500).json({ status: 500, message: "Internal server error." });
    }
};

// Function for Withdrawing funds from User (When User Places a Bet)
const WithdrawWebhook = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { reqId, SecretKey, UserId, txnId, Amount } = req.body;

        // Basic Validations
        if (!UserId || !Amount || !txnId || !SecretKey) {
            await session.abortTransaction();
            return res.status(400).json({ status: 400, message: "Missing required parameters" });
        }

        if (Amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ status: 400, message: "Invalid Withdrawal Amount" });
        }

        // Check SecretKey
        const providerSetup = await SportSetupModel.findOne({ provider_name: "LuckySport" });
        if (!providerSetup || providerSetup.agent_code !== SecretKey) {
            await session.abortTransaction();
            return res.status(401).json({ status: 401, message: "Unauthorized - Invalid SecretKey" });
        }

        // IMPORTANT: In production, check to ensure txnId does not already exist!
        // (Prevent duplicate transaction deductions)

        // Find the User and lock transaction
        const user = await User.findOne({ username: UserId }).session(session);

        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ status: 404, message: "User Not Found!" });
        }

        if (user.amount < Amount) {
            await session.abortTransaction();
            return res.status(400).json({ status: 400, message: "Insufficient Balance" });
        }

        console.log(`LuckySport Webhook: Deducting ${Amount} from ${UserId} for Bet ${txnId}`);
        user.amount -= Amount;
        await user.save({ session });

        await session.commitTransaction();

        return res.status(200).json({
            status: 200,
            ReqId: reqId,
            balance: user.amount,
            Currency: "INR",
            message: "Withdrawal Successful"
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Webhook Withdraw Error: ", error);
        return res.status(500).json({ status: 500, message: "Internal server error." });
    } finally {
        session.endSession();
    }
};

// Function for Depositing funds to User (When User Wins a Bet or Refund)
const DepositWebhook = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { reqId, SecretKey, UserId, txnId, Amount } = req.body;

        // Basic Validations
        if (!UserId || !Amount || !txnId || !SecretKey) {
            await session.abortTransaction();
            return res.status(400).json({ status: 400, message: "Missing required parameters" });
        }

        if (Amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ status: 400, message: "Invalid Deposit Amount" });
        }

        // Check SecretKey
        const providerSetup = await SportSetupModel.findOne({ provider_name: "LuckySport" });
        if (!providerSetup || providerSetup.agent_code !== SecretKey) {
            await session.abortTransaction();
            return res.status(401).json({ status: 401, message: "Unauthorized - Invalid SecretKey" });
        }

        // Find the User and lock transaction
        const user = await User.findOne({ username: UserId }).session(session);

        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ status: 404, message: "User Not Found!" });
        }

        console.log(`LuckySport Webhook: Adding Winnings ${Amount} to ${UserId} for Bet ${txnId}`);
        user.amount += Amount;
        await user.save({ session });

        await session.commitTransaction();

        return res.status(200).json({
            status: 200,
            ReqId: reqId,
            balance: user.amount,
            Currency: "INR",
            message: "Deposit Successful"
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Webhook Deposit Error: ", error);
        return res.status(500).json({ status: 500, message: "Internal server error." });
    } finally {
        session.endSession();
    }
};

module.exports = {
    GetUserBalanceWebhook,
    WithdrawWebhook,
    DepositWebhook
};
