const Promotion = require("../../models/promotion.model");
const User = require("../../models/user.model");
const Referral = require("../../models/referral.model");
const { GetCurrentDateTime } = require("../GetCurrentDateTime");
const { default: mongoose } = require("mongoose");
const BonusHistory = require("../../models/bonushistory.model");
const Casino = require("../../models/casino.model");
const { GetPromotion } = require("./GetPromotion");
const Admin = require("../../models/admin.model");

const ProcessReferralBonus = async () => {
  const session = await mongoose.startSession(); // Start a new session
  session.startTransaction(); // Start a transaction

  try {
    // Fetch the promotion details for the first or every referral in a single query
    const promotionData = await GetPromotion({
      category: "referral_bonus",
      sub_category: "every_referral",
    });

    if (!promotionData) {
      console.log("No referral bonus promotion data found.");
      return;
    }

    // Find eligible referrals that haven't been awarded the bonus yet
    const referrals = await Referral.find({
      "steps_completed.is_registered": true,
      "steps_completed.is_deposited": false,
      "steps_completed.is_wager_completed": false,
      bonus_awarded: false,
    }).session(session);

    if (referrals.length === 0) {
      console.log("No eligible referrals found.");
      await session.commitTransaction();
      return;
    }

    // Use `Promise.all` for concurrent bonus addition
    await Promise.all(
      referrals.map(async (referral) => {
        const referredUser = referral.refer_by;
        const bonusAmount = referral.bonus_amount;
        const userUsername = referral.referred_user_username;

        try {
          const allBonus = await BonusHistory.find({
            username: userUsername,
            $or: [
              { min_deposit: { $lte: referral.min_amount } },
              { min_bet: { $lte: referral.min_amount } },
            ],
            bonus_added_to_user: true,
          }).session(session);

          if (allBonus.length > 0) {
            console.log(
              `Not eligible or bonus already awarded for user: ${userUsername}`
            );
            return;
          }

          // Apply bonus to the user
          const user = await User.findOneAndUpdate(
            { username: referredUser, is_blocked: false },
            { $inc: { amount: bonusAmount } },
            { new: true, session }
          );
          if (!user) {
            throw new Error(`User with username ${referredUser} not found or is blocked`);
          }

          // Deduct bonus amount from owner admin
          const ownerAdmin = await Admin.findOneAndUpdate(
            { username: "owneradmin", amount: { $gte: bonusAmount }, is_blocked: false },
            { $inc: { amount: -bonusAmount } },
            { new: true, session }
          );

          if (!ownerAdmin) {
            throw new Error("Insufficient funds or owner admin is blocked");
          }

          referral.bonus_awarded = true;
          referral.steps_completed.is_wager_completed = true;
          referral.steps_completed.is_deposited = true;
          referral.bonus_added_to_user=true
          await referral.save({ session });

          console.log(
            `Bonus of ${bonusAmount} awarded to user ${referral.referred_user_username}.`
          );
        } catch (bonusError) {
          console.error(
            `Failed to award bonus to user ${referral.referred_user_username}:`,
            bonusError
          );
          throw bonusError;
        }
      })
    );

    await session.commitTransaction(); // Commit the transaction if all is successful
  } catch (error) {
    await session.abortTransaction(); // Abort the transaction on error
    console.error("An error occurred while processing referral bonuses:", error);
  } finally {
    session.endSession(); // Ensure the session ends regardless of the outcome
  }
};

const ProcessDepositStatusForBonus = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const currentDate = GetCurrentDateTime();

    const promotionData = await Promotion.findOne({
      category: "referral_bonus",
      sub_category: { $in: ["first_referral", "every_referral"] },
      status: true,
      start_date: { $lte: currentDate },
      end_date: { $gt: currentDate },
    }).session(session);

    if (!promotionData) {
      console.log("No referral bonus promotion data found.");
      await session.abortTransaction();
      return;
    }

    const referrals = await Referral.find({
      "steps_completed.is_registered": true,
      "steps_completed.is_deposited": false,
      bonus_awarded: false,
    }).session(session);

    if (referrals.length === 0) {
      await session.abortTransaction();
      return;
    }

    await Promise.all(
      referrals.map(async (referral) => {
        const firstDeposit = await Deposit.findOne({
          user_id: referral.referred_user.username,
          status: "approved",
        })
          .sort({ created_at: 1 })
          .session(session);

        if (!firstDeposit || promotionData.min_deposit > firstDeposit.amount) {
          console.log(
            `Deposit conditions not met for user ${referral.referred_user.username}.`
          );
          return;
        }

        referral.steps_completed.is_deposited = true;
        referral.bonus_awarded = true;
        await referral.save({ session });

        console.log(
          `Bonus awarded for user ${referral.referred_user.username}.`
        );
      })
    );

    await session.commitTransaction();
  } catch (error) {
    console.error("Error processing referral bonuses:", error);
    await session.abortTransaction();
  } finally {
    session.endSession();
  }
};

const CalculateOtherBonuses = async () => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const users = await User.find().session(session); // Fetch all users once

      await Promise.all(
        users.map(async (user) => {
          const userUsername = user.username;
          const lastBonusCalculationTime = user?.last_bonus_calculation_time;

          // Fetch all unadded bonuses since the last calculation
          const allBonus = await BonusHistory.find({
            username: userUsername,
            timestamp: { $gt: lastBonusCalculationTime },
            bonus_added_to_user: false,
          }).session(session);

          if (allBonus.length === 0) {
            console.log(`No bonus history found for user: ${userUsername}`);
            return;
          }

          // Calculate total wager required using `reduce`
          const totalWagerRequired = allBonus.reduce(
            (total, bonus) =>
              total +
              (parseInt(bonus.wager_required) || 1) *
                parseInt(bonus.reward_amount),
            0
          );

          // Fetch actual wager using aggregation
          const wagerData = await Casino.aggregate([
            {
              $match: {
                Username: userUsername,
                BetTime: { $gt: lastBonusCalculationTime },
              },
            },
            { $group: { _id: null, totalAmount: { $sum: "$Amount" } } },
          ]).session(session);

          const actualWager = wagerData[0]?.totalAmount || 0;

          // If the actual wager is enough, credit the bonus
          if (actualWager >= totalWagerRequired) {
            const totalBonusAmount = allBonus.reduce(
              (acc, bonus) => acc + parseInt(bonus.reward_amount),
              0
            );
            user.amount = (user.amount || 0) + totalBonusAmount;
            user.last_bonus_calculation_time = GetCurrentDateTime();
            user.bonus -= totalBonusAmount
            // Mark all bonuses as added to user
            await Promise.all(
              allBonus.map((bonus) => {
                bonus.bonus_added_to_user = true;
                return bonus.save({ session });
              })
            );

            console.log(actualWager, totalWagerRequired, user.username, user.amount, user.last_bonus_calculation_time, "response")

            await user.save({ session });
            console.log(
              `Total bonus of ${totalBonusAmount} added for user ${userUsername}`
            );
          } else {
            console.log(
              `Wager not completed for user ${userUsername}, bonus will not be added yet.`
            );
          }
        })
      );
    });
    console.log("Bonus calculations and crediting completed.");
  } catch (error) {
    console.error("Error during bonus calculation:", error);
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
  } finally {
    session.endSession();
  }
};


module.exports = {ProcessReferralBonus, CalculateOtherBonuses, ProcessDepositStatusForBonus};