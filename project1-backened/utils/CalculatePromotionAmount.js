// Import necessary modules
const Promotion = require("../models/promotion.model");

// Function to calculate deposit bonus
const calculateDepositBonus = async (depositAmount, promotionId) => {
    try {
        // Retrieve promotion details from the database based on promotionId
        // check the condition and get the promotion is valid or not (check with date)
        // there will be diffrent type first_deposit, every_deposit, for specific_deposit
        // reward_type will have fixed/percentage;
        // calculate the amount and credit to the user;
        const promotion = await Promotion.findById(promotionId);
        // Perform calculations based on promotion rules
        let bonusAmount = 0;
        if (promotion.reward_type === 'fixed') {
            bonusAmount = promotion.reward_amount;
        } else if (promotion.reward_type === 'percentage') {
            bonusAmount = depositAmount * (promotion.reward_amount / 100);
        }
        // Apply minimum and maximum limits if defined
        if (promotion.min_reward && bonusAmount < promotion.min_reward) {
            bonusAmount = promotion.min_reward;
        }
        if (promotion.max_reward && bonusAmount > promotion.max_reward) {
            bonusAmount = promotion.max_reward;
        }
        // Return the calculated bonus amount
        return bonusAmount;
    } catch (error) {
        console.error('Error calculating deposit bonus:', error);
        throw new Error('Error calculating deposit bonus');
    }
};

// Function to calculate bet bonus
const calculateSignupBonus = async (promotionId) => {
    try {
        // Retrieve promotion details from the database based on the promotion ID
        const promotion = await Promotion.findById({reward_type:"fixed", category: "New User"});
        // Fetch all new users from the User collection with the condition is_new:true and bonus_credited grater than 0
        const newUsers = await User.find({ is_new: true, bonus_credited:{$gt:0} });
        // Calculate bonus amount based on promotion type
        let bonusAmount = 0;
        if (promotion.reward_type === 'fixed') {
            bonusAmount = promotion.reward_amount;
        }
        // Update user accounts with the bonus amount
        const updateUserPromises = newUsers.map(async (user) => {
            // If the promotion is of fixed type, add the bonus amount to the user's account
            if (promotion.reward_type === 'fixed') {
                user.account_balance += bonusAmount;
            }
            // Save the updated user
            await user.save();
        });
        // Execute all updateUserPromises in parallel
        await Promise.all(updateUserPromises);
        // Return the number of users updated and the bonus amount added
        return {
            usersUpdated: newUsers.length,
            bonusAmountAdded: bonusAmount
        };
    } catch (error) {
        console.error('Error calculating signup bonus:', error);
        throw new Error('Error calculating signup bonus');
    }
};

// Function to calculate lose bet bonus
const calculateLoseBetBonus = async (transaction_id) => {

    // from the tranx_id i will get the data of lose amount 
    // then calculate the amount which i have to credit to the player wallet by checking the type of promotions
    // then save the data to the bonus colletion type=betlose
    // then credit the amount to the player bonus wallet
    try {
        // Retrieve promotion details from the database based on promotionId
        const promotion = await Promotion.findById(promotionId);
        // Perform calculations based on promotion rules
        let bonusAmount = 0;
        // Implement logic to calculate bonus based on net loss amount
        // Example: bonusAmount = netLossAmount * (promotion.reward_amount / 100);

        // Apply minimum and maximum limits if defined
        // Example: 
        if (promotion.min_reward && bonusAmount < promotion.min_reward) {
                    bonusAmount = promotion.min_reward;
                 }
                 if (promotion.max_reward && bonusAmount > promotion.max_reward) {
                    bonusAmount = promotion.max_reward;
                 }

        // Return the calculated bonus amount
        return bonusAmount;
    } catch (error) {
        console.error('Error calculating lose bet bonus:', error);
        throw new Error('Error calculating lose bet bonus');
    }
};



// userBonusCalculator.js

// Function to calculate bonus based on bonus category
function calculateBonus(bonusCategory) {
    // Implement your bonus calculation logic here based on bonusCategory
    // Example logic:
    if (bonusCategory === 'Gold') {
        return 100; // Some fixed bonus amount for Gold category
    } else if (bonusCategory === 'Silver') {
        return 50; // Some fixed bonus amount for Silver category
    } else {
        return 0; // No bonus for other categories
    }
}


// userEventHandler.js

// Function to handle new user insert event
async function handleNewUserInsert(change, db) {
    if (change.operationType === 'insert') {
        // Retrieve the new user document
        const newUser = change.fullDocument;
        console.log("insertdata")

        // // Retrieve the bonus category of the new user
        // const bonusCategory = newUser.bonusCategory;

        // // Calculate bonus based on bonus category
        // const bonusAmount = calculateBonus(bonusCategory);

        // // Update user record in MongoDB with the calculated bonus
        // await db.collection('users').updateOne(
        //     { _id: newUser._id },
        //     { $set: { bonusAmount: bonusAmount } }
        // );

        console.log('Bonus calculated and updated for user:', newUser);
    }
}

// Export the functions
module.exports = {
    calculateDepositBonus,
    calculateSignupBonus,
    calculateLoseBetBonus,
    calculateBonus,
    handleNewUserInsert
};