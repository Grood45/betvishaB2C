function CalculateDepositBonus(category, reward_type, reward_amount, max_reward, min_reward, min_deposit, deposit_amount) {
    // Check if deposit amount meets the minimum requirement
    if (deposit_amount < min_deposit) {
        return 0; // No bonus if deposit amount is less than minimum required
    }
    // Calculate bonus based on reward type
    let bonus; 
    if (reward_type === "fixed") {
        bonus = Math.min(max_reward, Math.max(min_reward, reward_amount));
    } else if (reward_type === "percentage") {
        bonus = Math.min(max_reward, Math.max(min_reward, deposit_amount * reward_amount / 100));
    } else {
        throw new Error("Invalid reward type. Please choose 'fixed' or 'percentage'.");
    }
    return bonus;
}

module.exports={CalculateDepositBonus}


// const bonusData = [
//     {
//         category: "user_bonus",
//         sub_category: ["first_user"]
//     },
//     {
//         category: "deposit_bonus",
//         sub_category: ["first_deposit", "every_deposit", "occasion_deposit"]
//     },
//     {
//         category: "bet_bonus",
//         sub_category: ["first_bet", "lose_bet", "every_bet"]
//     }
// ];
