// // mongoDBWatcher.js

// const { connection } = require("../../config/db");
// const Casino = require("../../models/casino.model");
// const DepositModel = require("../../models/deposit.model");
// const User = require("../../models/user.model");
// const { AddBonusToUser } = require("../Promotion/AddBonusToUser");
// const { CalculateBetBonus } = require("../Promotion/CalculateBetBonus");
// const {
//   CalculateRegularDepositBonus,
// } = require("../Promotion/CalculateRegularDepositBonus");
// const { GetPromotion } = require("../Promotion/GetPromotion");

// // Function to start MongoDB watcher
// async function startMongoDBWatcher() {
//   try {
//     // Wait for MongoDB connection
//     await connection;
//     // Watch for insert events in the User collection
//     User.watch().on("change", async (change) => {
//       if (change.operationType === "insert") {
//         const newUser = await User.findById(change.documentKey._id);
//         console.log("newuser", newUser);
//         if (newUser) {
//           await ProcessNewUserBonus(newUser);
//         }
//       }
//     });
//     DepositModel.watch().on("change", async (change) => {
//       try {
//         console.log("Change detected:", change);
    
//         if (change.operationType !== "update") {
//           console.log("Operation type is not update. Skipping.");
//           return;
//         }
    
//         let isBonusGet = false;
//         const depositData = await DepositModel.findById(change.documentKey._id);
//         if (!depositData) {
//           console.log("No deposit data found for ID:", change.documentKey._id);
//           return;
//         }
    
//         let user = change?.fullDocument?.username || depositData.username;
//         console.log("User:", user);
    
//         const userData = await User.findOne({ username: user });
//         if (!userData) {
//           console.log("No user data found for username:", user);
//           return;
//         }
    
//         if (userData.role_type !== "user") {
//           console.log("User role is not 'user'. Skipping bonus calculation.");
//           return;
//         }
    
//         const allDeposit = await DepositModel.find({ username: user });
//         console.log("Total deposits by user:", allDeposit.length);
    
//         if (depositData.status === "approved") {
//           console.log("Deposit status is approved. Checking for applicable bonuses.");
    
//           const bonusTypes = [
//             { sub_category: "first_deposit", promotion: null },
//             { sub_category: "occasion_deposit", promotion: null },
//             { sub_category: "every_deposit", promotion: null }
//           ];
    
//           for (let i = 0; i < bonusTypes.length && !isBonusGet; i++) {
//             let query = {
//               category: "deposit_bonus",
//               sub_category: bonusTypes[i].sub_category,
//               site_auth_key: depositData?.site_auth_key,
//             };
    
//             bonusTypes[i].promotion = await GetPromotion(query);
//             console.log(`Promotion for ${bonusTypes[i].sub_category}:`, bonusTypes[i].promotion);
    
//             if (bonusTypes[i].promotion) {
//               let bonus = CalculateRegularDepositBonus(depositData.deposit_amount, bonusTypes[i].promotion);
//               console.log(`Calculated bonus for ${bonusTypes[i].sub_category}:`, bonus);
    
//               if (bonus > 0) {
//                 await AddBonusToUser(userData._id, bonus, bonusTypes[i].promotion);
//                 isBonusGet = true;
//                 console.log(`Bonus added to user ${userData._id} for ${bonusTypes[i].sub_category}.`);
//               }
//             }
//           }
//         }
//       } catch (error) {
//         console.error("Error in deposit change handler:", error);
//       }
//     });
    
//     Casino.watch().on("change", async (change) => {
//       if (change.operationType === "insert") {
//         const user = change?.fullDocument?.Username;
//         const casinoData = await Casino.find({ Username: user });
//         const userData = await User.findOne({ Username: user });
//         if (casinoData && casinoData.length === 1) {
//           let query = {
//             category: "bet_bonus",
//             sub_category: "first_bet",
//             site_auth_key: user?.site_auth_key,
//           };
//           const promotion = await GetPromotion(query);
//           let bonus = CalculateBetBonus(casinoData.Amount, promotion);
//           if (bonus > 0) {
//             AddBonusToUser(userData?._id, bonus, promotion);
//             return;
//           }
//         }
//       }
//       if (change.operationType === "update") {
//         const casinoData = await Casino.findById(change.documentKey._id);
//         const user = change?.fullDocument?.Username;
//         const userData = await User.findOne({ Username: user });
//         if (casinoData.ResultType == 1 && casinoData.WinLoss == 0) {
//           let query = {
//             category: "bet_bonus",
//             sub_category: "lose_bet",
//             site_auth_key: casinoData?.site_auth_key,
//           };
//           const promotion = await GetPromotion(query);
//           let bonus = CalculateBetBonus(casinoData.Amount, promotion);
//           if (bonus > 0) {
//             AddBonusToUser(userData?._id, bonus, promotion);
//             return;
//           }
//         }
//       }
//       if (change.operationType === "update") {
//         // for lose bet
//         const casinoData = await Casino.findById(change.documentKey._id);
//         const user = change?.fullDocument?.Username;
//         const userData = await User.findOne({ Username: user });
//         let query = {
//           category: "bet_bonus",
//           sub_category: "every_bet",
//           site_auth_key: casinoData?.site_auth_key,
//         };
//         const promotion = await GetPromotion(query);
//         let bonus = CalculateBetBonus(casinoData.Amount, promotion);
//         if (bonus > 0) {
//           AddBonusToUser(userData?._id, bonus, promotion);
//           return;
//         }
//       }
//     });
//   } catch (error) {
//     console.error("Error starting MongoDB watcher:", error);
//   }
// }

// module.exports = { startMongoDBWatcher };

// // - insert: Indicates that a new document was inserted into the collection.
// // - update: Indicates that an existing document was updated in the collection.
// // - replace: Indicates that an existing document was replaced with a new document in the collection.
// // - delete: Indicates that a document was deleted from the collection.
// // - invalidate: Indicates that the change event is due to a change that invalidated a previously returned document.
// // - drop: Indicates that the collection was dropped.
// // - rename: Indicates that the collection was renamed.
