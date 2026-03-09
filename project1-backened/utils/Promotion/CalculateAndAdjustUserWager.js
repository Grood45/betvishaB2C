const { default: mongoose } = require("mongoose");
const BonusHistory = require("../../models/bonushistory.model");
const Casino = require("../../models/casino.model");
const User = require("../../models/user.model");
const { GetCurrentDateTime } = require("../GetCurrentDateTime");


const CalculateAndAdjustUserWager = async (username, withdrawAmount) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Start the transaction

  try {
    // Step 1: Fetch the user to get last_bonus_calculation_time
    const user = await User.findOne({ username }).session(session); // Attach session
    if (!user) {
      throw new Error("User not found");
    }

    // Parse last_bonus_calculation_time using the given format
    const lastWagerCalculatedTime = last_bonus_calculation_time

    // Step 2: Fetch bonus history after last_wager_calculated_time
    const allBonus = await BonusHistory.find({
      username,
      timestamp: { $gt: lastWagerCalculatedTime }, // Fetch only bonuses after this time
    }).session(session); // Attach session

    if (!allBonus || allBonus.length === 0) {
      return {
        totalWager: 0,
        wagerLeft: 0,
      };
    }

    // Step 3: Calculate total wager from bonus history
    let totalWager = 0;
    for (const bonus of allBonus) {
      const wagerRequired = parseInt(bonus.wager_required);
      const rewardAmount = parseInt(bonus.reward_amount);
      if (!isNaN(wagerRequired) && !isNaN(rewardAmount)) {
        const wager = wagerRequired * rewardAmount;
        totalWager += wager;
      }
    }

    // Step 4: Calculate wager left
    const wagerData = await Casino.aggregate([
      { $match: { Username: username, BetTime:{ $gt: lastWagerCalculatedTime } } }, // You may need to adjust filtering logic here
      { $group: { _id: null, totalAmount: { $sum: "$Amount" } } },
    ]).session(session); // Attach session

    const wagerLeft = wagerData.length > 0 ? wagerData[0].totalAmount - totalWager : 0;
    let userBalance = (user.amount - withdrawAmount) < 0 ? 0 : user.amount - withdrawAmount;

    // Step 5: Apply conditions to adjust user bonus and balance
    if (wagerLeft <= 0 && userBalance === 0 && user.bonus>0) {
      // Case 1: Wager left is zero, user balance is zero -> Make bonus zero
      user.amount += user.bonus;
      user.last_bonus_calculation_time=GetCurrentDateTime();
      user.bonus = 0;
    } else if (wagerLeft <= 0 && userBalance > 0 && user.bonus>0) {
      // Case 2: Wager left is zero, user balance is greater than zero -> Add bonus to balance
      user.amount += user.bonus;
      user.last_bonus_calculation_time=GetCurrentDateTime()
      user.bonus = 0;
    } else if (userBalance > 0 && userBalance < wagerLeft) {
      // Case 3: User balance is greater than zero but less than wager left -> Make bonus zero
      user.bonus = 0;
      user.last_bonus_calculation_time=GetCurrentDateTime()
    }
    
    // Step 6: Save the updated user data
    await user.save({ session }); // Ensure this is part of the transaction

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Return the calculated total wager and wager left
    return {
      totalWager,
      wagerLeft: wagerLeft <= 0 ? 0 : wagerLeft,
      userBalance: user.amount,
    };
  } catch (error) {
    // Rollback transaction on error
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message || "Error calculating and adjusting wager.");
  }
};
module .exports = CalculateAndAdjustUserWager