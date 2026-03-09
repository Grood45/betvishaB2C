const { AddBonusToUser } = require("./AddBonusToUser");
const { GetActiveNewUserPromotions } = require("./GetActiveNewUserPromotions");

async function ProcessNewUserBonus(newUser) {
    try {
        // Check if the new user meets the criteria for receiving the bonus
        // if (newUser.is_newuser) {
            // Fetch active promotions for new user bonus
            if(!newUser.promotion_id){return}
            const newUserPromotions = await GetActiveNewUserPromotions(newUser);
            console.log(newUserPromotions,newUser, "promiotion data")

            if (newUserPromotions) {
                // Apply bonus to the user
                const bonusAmount = newUserPromotions.reward_amount;
                await AddBonusToUser(newUser._id, bonusAmount,newUserPromotions);
                console.log(`Bonus of ${bonusAmount} credits added to new user with ID ${newUser._id}.`);
            //  else {
            //     console.log(`No active new user bonuses for user with ID ${newUser._id}.`);
            // }
        } else {
            console.log(`New user with ID ${newUser._id} is not eligible for new user bonus.`);
        }
    } catch (error) {
        console.error(`Error processing bonus for new user with ID ${newUser._id}:`, error);
    }
}

module.exports = { ProcessNewUserBonus };
