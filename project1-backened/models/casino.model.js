const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define a Mongoose schema
const casinoSchema = new Schema({
  Username: { type: String, required: true },
  ProductType: { type: String, required: true },
  GameType: { type: String, required: true },
  Amount: { type: Number, required: true },
  TransferCode: { type: String, required: true },
  TransactionId: { type: String, required: true },
  Currency:{ type: String, required: true },
  Status: {
    type: String,
    enum: ["settled", "void", "running"],
    required: true,
    default: "running",
  },
  BetTime: { type: String },
  GameId: { type: String, default: "" }, // Optional field
  GamePeriodId: { type: String, default: null },
  OrderDetails: { type: String, default: null },
  GameTypeName: { type: String, default: null },
  GpId: { type: Number }, // Optional field
  GameRoundId: { type: String }, // Optional field
  Provider:{ type: String }, // Optional field
  WinLoss: { type: String, default: 0 },
  ResultTime: { type: String, default: "" },
  GameResult: { type: String, default: "" },
  CommissionStake: { type: Number, default: 0.0 },
  ResultType: { type: Number, enum: [0, 1, 2] },
  ReturnStake: { type: Number, default: 0 },
  EventType: { type: String, default: "casino" },
  UserId: { type: String },
  GameName:{type:String},
  ExtraInfo: {
    SportType: { type: String, default: "" },
    MarketType: { type: String, default: "" },
    League: { type: String, default: "" },
    Match: { type: String, default: "" },
    BetOption: { type: String, default: "" },
    KickOffTime: { type: String, default: "" },
  }, // Optional nested object
  BonusId: { type: String},
  ParentAdminId: { type: String },
  ParentAdminUsername:{ type: String },
  ParentAdminRoleType:{ type: String },
  RoleType: { type: String, default:"user" },
  site_auth_key: { type: String },
  is_wagered:{type:Boolean, default:false}
});

// Create a Mongoose model using the schema
const Casino = mongoose.model("Casino", casinoSchema);

module.exports = Casino;
// category: {
//   type: String,
//   required: true,
//   enum: ["user_bonus", "deposit_bonus", "bet_bonus"] // Only allow specific categories
// },
// sub_category: {
//   type: String,
//   required: true,
//   validate: {
//       validator: function(value) {
//           if (this.category === "user_bonus") {
//               // Check if sub_category is "first_user" for user_bonus category
//               return value === "first_user";
//           } else if (this.category === "bet_bonus") {
//               // Check if sub_category is one of the allowed values for bet_bonus
//               return ["first_bet", "lose_bet", "every_bet"].includes(value);
//           } else if (this.category === "deposit_bonus") {
//               // Check if sub_category is one of the allowed values for deposit_bonus
//               return ["first_deposit", "every_deposit", "occasion_deposit"].includes(value);
//           }
//           return true; // Allow any sub_category for other categories
//       },
//       message: "Invalid sub_category for the given category."
//   }
// },




// {
//   "_id": {
//     "$oid": "661ad382bd746e3f2f541c20"
//   },
//   "gameProviderId": 13,
//   "gameID": 214,
//   "gameType": 2,
//   "newGameType": 201,
//   "rank": 61,
//   "device": "d/m",
//   "platform": "HTML5",
//   "provider": "WorldMatch",
//   "rtp": 0.9784,
//   "rows": 0,
//   "reels": 0,
//   "lines": 0,
//   "gameInfos": [
//     {
//       "language": "en",
//       "gameName": "Burlesque",
//       "gameIconUrl": "https://img-3-1.cdn568.net/images/games/worldMatch/214.png",
//       "_id": {
//         "$oid": "661ad382bd746e3f2f541c21"
//       }
//     },
//     {
//       "language": "zh_cn",
//       "gameName": "滑稽秀",
//       "gameIconUrl": "https://img-3-1.cdn568.net/images/games/worldMatch/214.png",
//       "_id": {
//         "$oid": "661ad382bd746e3f2f541c22"
//       }
//     }
//   ],
//   "supportedCurrencies": [
//     "AUD",
//     "BDT",
//     "CAD",
//     "CHF",
//     "CNY",
//     "EUR",
//     "FOM",
//     "GBP",
//     "HKD",
//     "IDR",
//     "INR",
//     "JPY",
//     "KRW",
//     "MMK",
//     "MYR",
//     "NOK",
//     "NPR",
//     "NZD",
//     "PHP",
//     "SEK",
//     "THB",
//     "USD",
//     "VND",
//     "ZAR"
//   ],
//   "blockCountries": [],
//   "isMaintain": false,
//   "isEnabled": true,
//   "isProvideCommission": false,
//   "hasHedgeBet": false,
//   "status": true,
//   "__v": 0
// }





// function calculateMultipleBets(bets, oL, c) {
//   let totalBackReturn = 0;
//   let totalLayLiability = 0;
//   let totalNetProfitLoss = 0;
//   let totalNetProfitLossAfterCommission = 0;

//   bets.forEach(bet => {
//       const { AB, oB, AL } = bet;
      
//       // Calculate the total return from the back bet
//       const backReturn = AB * (oB - 1);
      
//       // Calculate the total liability from the lay bet
//       const layLiability = AL * (oL - 1);
      
//       // Calculate net profit or loss before commission
//       const netProfitLoss = backReturn - layLiability;
      
//       // Apply commission to the net profit or loss
//       const netProfitLossAfterCommission = netProfitLoss * (1 - c);

//       // Accumulate totals
//       totalBackReturn += backReturn;
//       totalLayLiability += layLiability;
//       totalNetProfitLoss += netProfitLoss;
//       totalNetProfitLossAfterCommission += netProfitLossAfterCommission;
//   });

//   return {
//       totalBackReturn: totalBackReturn.toFixed(2),
//       totalLayLiability: totalLayLiability.toFixed(2),
//       totalNetProfitLoss: totalNetProfitLoss.toFixed(2),
//       totalNetProfitLossAfterCommission: totalNetProfitLossAfterCommission.toFixed(2)
//   };
// }

// // Example usage
// const bets = [
//   { AB: 100, oB: 3.0, AL: 150 },  // Bet 1
//   { AB: 200, oB: 2.5, AL: 100 },  // Bet 2
//   { AB: 150, oB: 4.0, AL: 200 },  // Bet 3
//   { AB: 250, oB: 5.0, AL: 50 }    // Bet 4
// ];

// const oL = 2.8;  // Lay Odds
// const c = 0.05;  // Commission Rate (5%)

// // Call the function with the example values and store the result
// const result = calculateMultipleBets(bets, oL, c);

// // Log the results to the console
// console.log(`Total Back Return: ${result.totalBackReturn}`);                 // Total return from all back bets
// console.log(`Total Lay Liability: ${result.totalLayLiability}`);             // Total liability from all lay bets
// console.log(`Total Net Profit/Loss: ${result.totalNetProfitLoss}`);          // Total net profit or loss before commission
// console.log(`Total Net Profit/Loss After Commission: ${result.totalNetProfitLossAfterCommission}`); // Total net profit or loss after commission

