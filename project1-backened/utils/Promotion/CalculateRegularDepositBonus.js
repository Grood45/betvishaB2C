// Function to calculate bonus for a regular deposit
function CalculateRegularDepositBonus(depositAmount, promotion) {
  if (depositAmount < promotion?.min_deposit) {
    return 0; // No bonus if deposit amount is less than the minimum required
  }

  let bonusAmount = 0;
  if (promotion?.reward_type === "fixed") {
    if (promotion.min_deposit > depositAmount) {
      bonusAmount = 0;
      return;
    }
    bonusAmount = Math.min(promotion?.reward_amount, depositAmount);
  } else if (promotion?.reward_type === "percentage") {
    bonusAmount = Math.min(
      promotion?.max_reward,
      depositAmount * (promotion?.reward_amount / 100)
    );
  }

  return bonusAmount;
}

module.exports = { CalculateRegularDepositBonus };
