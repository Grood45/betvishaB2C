function CalculateBetBonus(betAmount, promotionData) {
  if(!promotionData){
    return 0
  }
    // Check if the promotion is active
    if (!promotionData.status) {
      return 0; // If promotion is not active, return 0 bonus
    }
    // Check if the bet amount meets the minimum bet requirement of the promotion
    if (betAmount < promotionData.min_bet) {
      return 0; // If the bet amount is less than the minimum bet required, return 0 bonus
    }
    // Calculate the net losses based on the bet amount and the minimum reward
    const netLosses = betAmount - promotionData.min_reward;
    // Check if the net losses are less than 0 (indicating a net win)
    if (netLosses <= 0) {
      return 0; // If net losses are less than or equal to 0, return 0 bonus
    }
    // Calculate the bonus amount based on the reward type (percentage or fixed)
    let bonusAmount = 0;
    if (promotionData.reward_type === "percentage") {
      // Calculate the bonus amount as a percentage of the net losses
      bonusAmount = (promotionData.reward_amount / 100) * netLosses;
    } else if (promotionData.reward_type === "fixed") {
      // Check if the net losses exceed the maximum reward limit
      if (netLosses > promotionData.max_reward) {
        bonusAmount = promotionData.max_reward; // If so, set the bonus amount to the maximum reward
      } else {
        bonusAmount = netLosses; // Otherwise, set the bonus amount to the net losses
      }
    }
    return bonusAmount;
  }




function CalculateRegularBetBonus(betAmount, promotion) {
    if (betAmount < promotion?.min_bet) {
      return 0; // No bonus if deposit amount is less than the minimum required
    }
  
    let bonusAmount = 0;
    if (promotion?.reward_type === "fixed") {
      if (promotion.min_bet > betAmount) {
        bonusAmount = 0;
        return;
      }
      bonusAmount = Math.min(promotion?.reward_amount, betAmount);
    } else if (promotion?.reward_type === "percentage") {
      bonusAmount = Math.min(
        promotion?.max_reward,
        betAmount * (promotion?.reward_amount / 100)
      );
    }
  
    return bonusAmount;
  }
  
  module.exports={CalculateBetBonus}