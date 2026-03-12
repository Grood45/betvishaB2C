const { SportSetupModel } = require('../../models/providers/sportsetup.model');
const User = require('../../models/user.model');
const GameTransactionModel = require('../../models/providers/gametransaction.model');
const mongoose = require('mongoose');

/**
 * LuckySport Wallet Service (Senior Developer Standards)
 * Handles business logic for balance, bets, and wins with high precision (Cents).
 * Uses Mongoose Sessions for Atomic Operations.
 */
class LuckySportWalletService {

    /**
     * Get User Balance in Cents
     */
    async getBalance(userId) {
        const user = await User.findOne({ user_id: userId }); // Assuming your schema uses user_id
        if (!user) throw new Error("USER_NOT_FOUND");

        // Convert to Cents: $100.50 -> 10050
        return Math.round(user.balance * 100);
    }

    /**
     * Process a Bet (Deduct Balance)
     * Atomic Operation: Balance change + Transaction Log
     */
    async placeBet(payload) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { user_id, amount, transaction_id, game_details } = payload;
            const amountInRupees = amount / 100; // API sends Cents

            // 1. Check for Idempotency (Prevent double spending)
            const existingTx = await GameTransactionModel.findOne({ transaction_id });
            if (existingTx) {
                await session.endSession();
                return { success: true, already_processed: true };
            }

            // 2. Fetch User & Validate Balance
            const user = await User.findOne({ user_id }).session(session);
            if (!user) throw new Error("USER_NOT_FOUND");
            if (user.balance < amountInRupees) throw new Error("INSUFFICIENT_BALANCE");

            // 3. Deduct Balance
            user.balance -= amountInRupees;
            await user.save({ session });

            // 4. Create Transaction Record
            const newTx = new GameTransactionModel({
                user_id: user.user_id,
                username: user.username,
                user_code: user.user_code,
                amount: amountInRupees,
                type: 'BET',
                provider: 'LuckySport',
                api_provider_name: 'LuckySport',
                transaction_id: transaction_id,
                round_id: payload.round_id || transaction_id,
                detail: JSON.stringify(game_details),
                currency: user.currency || 'INR',
                status: 'COMPLETED',
                parent_admin_id: user.parent_admin_id,
                parent_admin_username: user.parent_admin_username,
                parent_admin_role_type: user.parent_admin_role_type,
                site_auth_key: user.site_auth_key,
                created_at: new Date(),
                updated_at: new Date()
            });
            await newTx.save({ session });

            await session.commitTransaction();
            return { success: true, new_balance: Math.round(user.balance * 100) };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Process a Win (Add Balance)
     */
    async settleWin(payload) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { user_id, amount, transaction_id } = payload;
            const amountInRupees = amount / 100;

            const user = await User.findOne({ user_id }).session(session);
            if (!user) throw new Error("USER_NOT_FOUND");

            user.balance += amountInRupees;
            await user.save({ session });

            const newTx = new GameTransactionModel({
                user_id: user.user_id,
                username: user.username,
                user_code: user.user_code,
                amount: amountInRupees,
                type: 'WIN',
                provider: 'LuckySport',
                api_provider_name: 'LuckySport',
                transaction_id: transaction_id,
                currency: user.currency || 'INR',
                status: 'COMPLETED',
                parent_admin_id: user.parent_admin_id,
                parent_admin_username: user.parent_admin_username,
                parent_admin_role_type: user.parent_admin_role_type,
                site_auth_key: user.site_auth_key,
                created_at: new Date(),
                updated_at: new Date()
            });
            await newTx.save({ session });

            await session.commitTransaction();
            return { success: true, new_balance: Math.round(user.balance * 100) };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Process a Rollback (Revert a Bet)
     */
    async settleRollback(payload) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { user_id, amount, transaction_id, original_transaction_id } = payload;
            const amountInRupees = amount / 100;

            // 1. Check if already rolled back
            const existingRollback = await GameTransactionModel.findOne({ transaction_id, type: 'ROLLBACK' });
            if (existingRollback) {
                const user = await User.findOne({ user_id });
                await session.endSession();
                return { success: true, new_balance: Math.round(user.balance * 100) };
            }

            // 2. Fetch User
            const user = await User.findOne({ user_id }).session(session);
            if (!user) throw new Error("USER_NOT_FOUND");

            // 3. Revert Balance
            user.balance += amountInRupees;
            await user.save({ session });

            // 4. Log Rollback
            const rollbackTx = new GameTransactionModel({
                user_id: user.user_id,
                username: user.username,
                user_code: user.user_code,
                amount: amountInRupees,
                type: 'ROLLBACK',
                provider: 'LuckySport',
                api_provider_name: 'LuckySport',
                transaction_id: transaction_id,
                match_id: original_transaction_id, // Using match_id or reference for original tx
                currency: user.currency || 'INR',
                status: 'COMPLETED',
                parent_admin_id: user.parent_admin_id,
                parent_admin_username: user.parent_admin_username,
                parent_admin_role_type: user.parent_admin_role_type,
                site_auth_key: user.site_auth_key,
                created_at: new Date(),
                updated_at: new Date()
            });
            await rollbackTx.save({ session });

            await session.commitTransaction();
            return { success: true, new_balance: Math.round(user.balance * 100) };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}

module.exports = new LuckySportWalletService();
