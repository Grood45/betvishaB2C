const UserModel = require('../../models/user.model');
const GameTransactionModel = require('../../models/providers/gametransaction.model');
const { GetCurrentDateTime } = require('../../utils/GetCurrentDateTime');

// Make sure CALLBACK_TOKEN is unique and secure
const CALLBACK_TOKEN = 'eadd5a04-4720-4a10-ae60-b11cd01cc3aa';

function handleError(res, check, errorData = {}) {
    const result = {
        result: check,
        status: 'ERROR',
        data: errorData
    };
    res.json(result);
}

function handleSuccess(res, resultData) {
    res.json(resultData);
}

const DreamGatesCallback = async (req, res) => {
    const headers = req.headers;
    const tokenData = headers['callback-token'];
    const { api, callback, seckey, api_provider_name } = req.query;
    const oData = req.body;
    const command = oData.command;
    const aCheckItem = oData.check.split(',');

    let userInfo = {};
    let betInfo = {};

    // Check callback token
    if (callback !== tokenData) {
        return handleError(res, 100);
    }

    // Process each check item
    for (const check of aCheckItem) {
        switch (check) {
            case '21': // user confirmation
                const userId = oData.data.account;
                try {
                    userInfo = await UserModel.findOne({ user_id: userId });
                    if (!userInfo) {
                        return handleError(res, 21);
                    }
                } catch (err) {
                    console.error('Error finding user:', err);
                    return handleError(res, 21);
                }
                break;

            case '22': // Check if it is an active user
                if (userInfo.status !== true) {
                    return handleError(res, 22);
                }
                break;

            case '31': // Check user balance
                const amount = parseInt(oData.data.amount);
                if (userInfo.amount < amount) {
                    return handleError(res, 31, { balance: userInfo.amount });
                }
                break;

            case '41': // Check if the trans has already been processed
                const transId41 = oData.data.trans_id;
                try {
                    const existingTransaction = await GameTransactionModel.findOne({ transaction_id: transId41 });
                    if (existingTransaction) {
                        return handleError(res, 41, { balance: userInfo.amount });
                    }
                } catch (err) {
                    console.error('Error finding transaction:', err);
                    return handleError(res, 41, { balance: userInfo.amount });
                }
                break;

            case '42': // Check if trans id exists
                const transId42 = oData.data.trans_id;
                try {
                    betInfo = await GameTransactionModel.findOne({ transaction_id: transId42 });
                    if (!betInfo) {
                        return handleError(res, 42, { balance: userInfo.amount });
                    }
                } catch (err) {
                    console.error('Error finding transaction:', err);
                    return handleError(res, 42, { balance: userInfo.amount });
                }
                break;

            default:
                break;
        }
    }

    // Handle command execution
    switch (command) {
        case 'authenticate':
            handleSuccess(res, {
                result: 0,
                status: 'OK',
                data: {
                    account: userInfo.user_id,
                    balance: userInfo.amount
                }
            });
            break;

        case 'balance':
            handleSuccess(res, {
                result: 0,
                status: 'OK',
                data: {
                    balance: userInfo.amount
                }
            });
            break;

        case 'bet':
            const transIdBet = oData.data.trans_id;
            const amountBet = parseInt(oData.data.amount);
            const gameIdBet = oData.data.game_code;
            const roundIdBet = oData.data.round_id;

            try {
                const newBet = new GameTransactionModel({
                    transaction_id: transIdBet,
                    username: userInfo.username,
                    user_id: userInfo.user_id,
                    game_id: gameIdBet,
                    round_id: roundIdBet,
                    currency: userInfo.currency,
                    provider: oData.data.provider_id,
                    provider_id: oData.data.provider_id,
                    game_code: gameIdBet,
                    game_name: gameIdBet,
                    game_type: oData.data.game_type,
                    amount: amountBet,
                    type: oData.data.type.toString(),
                    match_id: oData.data.match_id,
                    sort: 'BET',
                    status: 'pending',
                    result: 'pending',
                    created_at: GetCurrentDateTime(),
                    updated_at: GetCurrentDateTime(),
                    parent_admin_id: userInfo.parent_admin_id,
                    parent_admin_role_type: userInfo.parent_admin_role_type,
                    parent_admin_username: userInfo.parent_admin_username,
                    site_auth_key: userInfo.site_auth_key,
                    api_provider_name: api_provider_name
                });

                const savedBet = await newBet.save();

                if (savedBet) {
                    const updatedUser = await UserModel.findOneAndUpdate(
                        { user_id: userInfo.user_id },
                        { $inc: { amount: -amountBet } },
                        { new: true }
                    );

                    if (updatedUser) {
                        handleSuccess(res, {
                            result: 0,
                            status: 'OK',
                            data: {
                                balance: updatedUser.amount
                            }
                        });
                    } else {
                        handleError(res, 99, { balance: userInfo.amount });
                    }
                } else {
                    handleError(res, 99, { balance: userInfo.amount });
                }
            } catch (err) {
                console.error('Error processing bet:', err);
                handleError(res, 99, { balance: userInfo.amount });
            }
            break;

        case 'win':
            const transIdWin = oData.data.trans_id;
            const amountWin = parseInt(oData.data.amount);
            const gameIdWin = oData.data.game_code;
            const roundIdWin = oData.data.round_id;

            try {
                const newWin = new GameTransactionModel({
                    transaction_id: transIdWin,
                    username: userInfo.user_id,
                    user_id: userInfo.user_id,
                    game_id: gameIdWin,  // Changed from gameIdBet to gameIdWin
                    round_id: roundIdWin,  // Changed from roundIdBet to roundIdWin
                    currency: userInfo.currency,
                    provider: oData.data.provider_id,
                    provider_id: oData.data.provider_id,
                    game_code: gameIdWin,  // Changed from gameIdBet to gameIdWin
                    game_name: gameIdWin,  // Changed from gameIdBet to gameIdWin
                    game_type: oData.data.game_type,
                    amount: amountWin,
                    type: oData.data.type,
                    match_id: oData.data.match_id,
                    sort: 'WIN',
                    status: 'pending',
                    result: 'win',
                    created_at: GetCurrentDateTime(),
                    updated_at: GetCurrentDateTime(),
                    parent_admin_id: userInfo.parent_admin_id,
                    parent_admin_role_type: userInfo.parent_admin_role_type,
                    parent_admin_username: userInfo.parent_admin_username,
                    site_auth_key: userInfo.site_auth_key,
                    api_provider_name: oData.api_provider_name
                });

                const savedWin = await newWin.save();

                if (savedWin) {
                    const updatedUser = await UserModel.findOneAndUpdate(
                        { user_id: userInfo.user_id },
                        { $inc: { amount: amountWin } },
                        { new: true }
                    );

                    if (updatedUser) {
                        handleSuccess(res, {
                            result: 0,
                            status: 'OK',
                            data: {
                                balance: updatedUser.amount
                            }
                        });
                    } else {
                        handleError(res, 99, { balance: userInfo.amount });
                    }
                } else {
                    handleError(res, 99, { balance: userInfo.amount });
                }
            } catch (err) {
                console.error('Error processing win:', err);
                handleError(res, 99, { balance: userInfo.amount });
            }
            break;

        case 'cancel':
            let money = 0;
            const userMoneyCancel = userInfo.amount;

            try {
                if (!betInfo || !betInfo.sort) {
                    return handleError(res, 42, { message: 'Invalid transaction information' });
                }

                if (betInfo.sort !== 'CANCEL') {
                    if (betInfo.sort === 'BET') {
                        money = betInfo.amount;

                        const updatedBet = await GameTransactionModel.findOneAndUpdate(
                            { transaction_id: oData.data.trans_id },
                            { sort: 'CANCEL', status: 'void' },
                            { new: true }
                        );

                        if (updatedBet) {
                            const updateUserResult = await UserModel.findOneAndUpdate(
                                { user_id: userInfo.user_id },
                                { $inc: { amount: money } },
                                { new: true }
                            );

                            if (updateUserResult) {
                                handleSuccess(res, {
                                    result: 0,
                                    status: 'OK',
                                    data: {
                                        balance: updateUserResult.amount
                                    }
                                });
                            } else {
                                handleError(res, 99, { balance: userInfo.amount });
                            }
                        } else {
                            handleError(res, 99, { balance: userInfo.amount });
                        }
                    } else if (betInfo.sort === 'WIN') {
                        money = -betInfo.amount;

                        const updatedBet = await GameTransactionModel.findOneAndUpdate(
                            { transaction_id: oData.data.trans_id },
                            { sort: 'CANCEL' },
                            { new: true }
                        );

                        if (updatedBet) {
                            const updateUserResult = await UserModel.findOneAndUpdate(
                                { user_id: userInfo.user_id },
                                { $inc: { amount: money }, result:"void" },
                                { new: true }
                            );

                            if (updateUserResult) {
                                handleSuccess(res, {
                                    result: 0,
                                    status: 'OK',
                                    data: {
                                        balance: updateUserResult.amount
                                    }
                                });
                            } else {
                                handleError(res, 99, { balance: userInfo.amount });
                            }
                        } else {
                            handleError(res, 99, { balance: userInfo.amount });
                        }
                    }
                } else {
                    handleSuccess(res, {
                        result: 0,
                        status: 'OK',
                        data: {
                            balance: userMoneyCancel
                        }
                    });
                }
            } catch (err) {
                console.error('Error processing cancel:', err);
                handleError(res, 99, { balance: userInfo.amount });
            }
            break;

        case 'status':
            const transIdStatus = oData.data.trans_id;

            handleSuccess(res, {
                result: 0,
                status: 'OK',
                data: {
                    account: userInfo.user_id,
                    trans_id: transIdStatus,
                    trans_status: betInfo.sort === 'CANCEL' ? 'CANCELED' : 'OK'
                }
            });
            break;

        default:
            handleError(res, 400, { message: 'Invalid command' });
            break;
    }
}

module.exports = {
    DreamGatesCallback,
};
