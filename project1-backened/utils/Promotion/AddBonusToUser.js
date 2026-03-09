const { default: mongoose } = require("mongoose");
const Admin = require("../../models/admin.model");
const BonusHistory = require("../../models/bonushistory.model");
const User = require("../../models/user.model");
const { GetCurrentDateTime } = require("../GetCurrentDateTime");
const DepositModel = require("../../models/deposit.model");
const { GetPromotion } = require("./GetPromotion");
const { CalculateRegularDepositBonus } = require("./CalculateRegularDepositBonus");

const AddBonusToUser = async (id, bonusAmount, promotionData) => {
  if (bonusAmount <= 0) {
    return { success: false, message: "Invalid bonus amount" };
  }
  const maxRetries = 3;
  let attempt = 0;
  let success = false;

  while (attempt < maxRetries && !success) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Apply bonus to the user
      const user = await User.findOneAndUpdate(
        { _id: id, is_blocked: false },
        { $inc: { bonus: bonusAmount } },
        { new: true, session }
      );

      if (!user) {
        throw new Error(`User with ID ${id} not found or is blocked`);
      }

      // Deduct bonus amount from owner admin
      const ownerAdmin = await Admin.findOneAndUpdate(
        { username: "owneradmin", amount: { $gte: bonusAmount }, is_blocked: false },
        { $inc: { amount: -bonusAmount } },
        { new: true, session }
      );

      if (!ownerAdmin) {
        throw new Error("Owner admin not found or insufficient balance");
      }

      // Save bonus details to BonusHistory model
      const bonusHistory = new BonusHistory({
        username: user.username,
        category: promotionData.category,
        sub_category: promotionData.sub_category,
        bonus_amount: bonusAmount,
        reward_amount: promotionData.reward_amount,
        reward_type: promotionData.reward_type,
        description: promotionData.description,
        eligibility: promotionData.eligibility,
        status: "success",
        parent_admin_id: promotionData.parent_admin_id,
        parent_admin_username: promotionData.parent_admin_username,
        parent_admin_role_type: promotionData.parent_admin_role_type,
        start_date: promotionData.start_date,
        end_date: promotionData.end_date,
        rules: promotionData.rules,
        image: promotionData.image,
        min_deposit: promotionData.min_deposit,
        min_bet: promotionData.min_bet,
        is_wagered: false,
        wager_amount: promotionData.wager_required,
        site_auth_key: user.site_auth_key || "",
        last_bonus_calculation_time: GetCurrentDateTime(),
        role_type: user.role_type,
      });

      await bonusHistory.save({ session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      success = true;
      return { success: true, message: "Bonus successfully added" };

    } catch (error) {
      console.error(`Attempt ${attempt + 1} - Error adding bonus to user ${id}: ${error.message}`);

      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error(`Error aborting transaction: ${abortError.message}`);
      } finally {
        session.endSession();
      }

      // Check for transient errors to retry
      if (error.message.includes("write conflict") || error.code === 112) {
        attempt++;
        console.log(`Retrying... (${attempt}/${maxRetries})`);
      } else {
        const user = await User.findById(id);

        const bonusHistoryFailed = new BonusHistory({
          username: user?.username || "unknown",
          category: promotionData.category,
          sub_category: promotionData.sub_category,
          bonus_amount: bonusAmount,
          reward_amount: promotionData.reward_amount,
          reward_type: promotionData.reward_type,
          description: promotionData.description,
          eligibility: promotionData.eligibility,
          reason: error.message,
          status: "failed",
          parent_admin_id: promotionData.parent_admin_id,
          parent_admin_username: promotionData.parent_admin_username,
          parent_admin_role_type: promotionData.parent_admin_role_type,
          start_date: promotionData.start_date,
          end_date: promotionData.end_date,
          rules: promotionData.rules,
          image: promotionData.image,
          min_deposit: promotionData.min_deposit,
          min_bet: promotionData.min_bet,
          is_wagered: true,
          wager_amount: promotionData.wager_required || 0,
          site_auth_key: promotionData.site_auth_key || "",
          last_bonus_calculation_time: GetCurrentDateTime(),
          role_type: "user",
        });

        await bonusHistoryFailed.save();

        return { success: false, message: "Failed to add bonus due to a write conflict" };
      }
    }
  }

  return { success: false, message: "Failed to add bonus after multiple attempts" };
};

const ApprovedBonusAdded = async (user, depositData, session) => {
  try {
    const bonusTypes = ["first_deposit", "occasion_deposit", "every_deposit"];
    let totalBonus = 0;

    if (depositData.status !== "approved") {
      return {
        success: false,
        bonusAmount: 0,
        message: "Bonus calculation skipped as deposit is not approved.",
      };
    }

    for (const subCategory of bonusTypes) {
      const promotionData = await GetPromotion(
        {
          category: "deposit_bonus",
          sub_category: subCategory,
          site_auth_key: depositData.site_auth_key,
        },
        { session }
      );

      let bonus = 0;
      const allDeposits = await DepositModel.countDocuments({
        username: user.username,
        site_auth_key: user.site_auth_key,
        user_type: user.role_type,
      });

      if (subCategory === "first_deposit" && allDeposits === 0) {
        bonus = CalculateRegularDepositBonus(
          depositData.deposit_amount,
          promotionData
        );
      } else if (subCategory === "occasion_deposit" && allDeposits > 0) {
        bonus = CalculateRegularDepositBonus(
          depositData.deposit_amount,
          promotionData
        );
      } else if (subCategory === "every_deposit" && allDeposits > 0) {
        bonus = CalculateRegularDepositBonus(
          depositData.deposit_amount,
          promotionData
        );
      }

      if (bonus > 0) {
        totalBonus += bonus;

        // Deduct bonus amount from owner admin
        const ownerAdmin = await Admin.findOneAndUpdate(
          {
            username: "owneradmin",
            amount: { $gte: bonus },
            is_blocked: false,
          },
          { $inc: { amount: -bonus } },
          { new: true, session }
        );

        if (!ownerAdmin) {
          throw new Error("Owner admin not found or insufficient balance");
        }

        // Save bonus details to BonusHistory model
        const bonusHistory = new BonusHistory({
          username: user.username,
          category: promotionData.category,
          timestamp: GetCurrentDateTime(),
          sub_category: promotionData.sub_category,
          bonus_amount: bonus, // Corrected to save the calculated bonus amount
          reward_amount: promotionData.reward_amount,
          reward_type: promotionData.reward_type,
          description: promotionData.description,
          eligibility: promotionData.eligibility,
          status: "success",
          parent_admin_id: promotionData.parent_admin_id,
          parent_admin_username: promotionData.parent_admin_username,
          parent_admin_role_type: promotionData.parent_admin_role_type,
          start_date: promotionData.start_date,
          end_date: promotionData.end_date,
          rules: promotionData.rules,
          image: promotionData.image,
          min_deposit: promotionData.min_deposit,
          min_bet: promotionData.min_bet,
          is_wagered: false,
          wager_required: promotionData.wager_required,
          site_auth_key: user.site_auth_key || "",
          last_bonus_calculation_time: GetCurrentDateTime(),
          role_type: user.role_type,
        });

        await bonusHistory.save({ session });
      }
    }

    return {
      success: true,
      bonusAmount: totalBonus,
      message: "Bonus calculation successful.",
    };
  } catch (error) {
    console.error("Bonus calculation failed:", error);
    return {
      success: false,
      bonusAmount: 0,
      message: "Bonus calculation failed.",
    };
  }
};

const BetBonusAdded = async (user, betData, session) => {
  try {
    const bonusTypes = ["first_bet", "lose_bet", "every_bet"];
    let totalBonus = 0;

    if (betData.status !== "settled") {
      return {
        success: false,
        bonusAmount: 0,
        message: "Bonus calculation skipped as deposit is not approved.",
      };
    }

    for (const subCategory of bonusTypes) {
      const promotionData = await GetPromotion(
        {
          category: "bet_bonus",
          sub_category: subCategory,
          site_auth_key: betData.site_auth_key,
        },
        { session }
      );

      let bonus = 0;

      if (subCategory === "first_bet" && allBet.length === 0) {
        bonus = CalculateRegularDepositBonus(
          betData.deposit_amount,
          promotionData
        );
      } else if (subCategory === "lose_bet" && allBet > 0) {
        bonus = CalculateRegularDepositBonus(
          betData.deposit_amount,
          promotionData
        );
      } else if (subCategory === "every_bet" && allBet > 0) {
        bonus = CalculateRegularDepositBonus(
          betData.deposit_amount,
          promotionData
        );
      }

      if (bonus > 0) {
        totalBonus += bonus;

        // Deduct bonus amount from owner admin
        const ownerAdmin = await Admin.findOneAndUpdate(
          {
            username: "owneradmin",
            amount: { $gte: bonus },
            is_blocked: false,
          },
          { $inc: { amount: -bonus } },
          { new: true, session }
        );

        if (!ownerAdmin) {
          throw new Error("Owner admin not found or insufficient balance");
        }

        // Save bonus details to BonusHistory model
        const bonusHistory = new BonusHistory({
          username: user.username,
          category: promotionData.category,
          timestamp: GetCurrentDateTime(),
          sub_category: promotionData.sub_category,
          bonus_amount: bonus, // Corrected to save the calculated bonus amount
          reward_amount: promotionData.reward_amount,
          reward_type: promotionData.reward_type,
          description: promotionData.description,
          eligibility: promotionData.eligibility,
          status: "success",
          parent_admin_id: promotionData.parent_admin_id,
          parent_admin_username: promotionData.parent_admin_username,
          parent_admin_role_type: promotionData.parent_admin_role_type,
          start_date: promotionData.start_date,
          end_date: promotionData.end_date,
          rules: promotionData.rules,
          image: promotionData.image,
          min_deposit: promotionData?.min_deposit,
          min_bet: promotionData?.min_bet,
          is_wagered: false,
          wager_required: promotionData.wager_required,
          site_auth_key: user.site_auth_key || "",
          last_bonus_calculation_time: GetCurrentDateTime(),
          role_type: user.role_type,
        });

        await bonusHistory.save({ session });
      }
    }

    return {
      success: true,
      bonusAmount: totalBonus,
      message: "Bonus calculation successful.",
    };
  } catch (error) {
    console.error("Bonus calculation failed:", error);
    return {
      success: false,
      bonusAmount: 0,
      message: "Bonus calculation failed.",
    };
  }
};

module.exports = { AddBonusToUser, ApprovedBonusAdded, BetBonusAdded };