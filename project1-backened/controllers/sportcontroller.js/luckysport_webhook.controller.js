const walletService = require('../../services/luckysport/wallet.service');

/**
 * LuckySport Webhook Controller
 * Handles all incoming callbacks from LuckySport with standard error responses.
 */
const handleBalance = async (req, res) => {
    try {
        const { user_id } = req.luckysport_payload; // From verifyLuckySportJWT middleware
        const balanceCents = await walletService.getBalance(user_id);

        return res.status(200).json({
            status: 0,
            message: "Success",
            balance: balanceCents
        });
    } catch (error) {
        return res.status(200).json({
            status: error.message === "USER_NOT_FOUND" ? 1002 : 1000,
            message: error.message
        });
    }
};

const handleBet = async (req, res) => {
    try {
        const result = await walletService.placeBet(req.luckysport_payload);
        return res.status(200).json({
            status: 0,
            message: "Success",
            balance: result.new_balance
        });
    } catch (error) {
        const errorCodeMap = {
            "INSUFFICIENT_BALANCE": 1003,
            "USER_NOT_FOUND": 1002
        };
        return res.status(200).json({
            status: errorCodeMap[error.message] || 1000,
            message: error.message
        });
    }
};

const handleWin = async (req, res) => {
    try {
        const result = await walletService.settleWin(req.luckysport_payload);
        return res.status(200).json({
            status: 0,
            message: "Success",
            balance: result.new_balance
        });
    } catch (error) {
        return res.status(200).json({
            status: 1000,
            message: error.message
        });
    }
};

const handleRollback = async (req, res) => {
    try {
        const result = await walletService.settleRollback(req.luckysport_payload);
        return res.status(200).json({
            status: 0,
            message: "Success",
            balance: result.new_balance
        });
    } catch (error) {
        return res.status(200).json({
            status: 1000,
            message: error.message
        });
    }
};

module.exports = {
    handleBalance,
    handleBet,
    handleWin,
    handleRollback
};
