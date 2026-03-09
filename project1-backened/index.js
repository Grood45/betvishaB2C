const express = require("express");
const server = express();
require("dotenv").config();
const cron =require("node-cron")
const cors = require("cors");
const { connection } = require("./config/db");
const { AdminRouter } = require("./routes/admin.route");
const { UserRouter } = require("./routes/user.route");
const { TransactionRouter } = require("./routes/transaction.route");
const { PaymentRouter } = require("./routes/payment.route");
const { SettingRouter } = require("./routes/setting.route");
const { CasinoGameRouter } = require("./routes/casinogame.route");
const PromotionRouter = require("./routes/promotion.route");
const { CasinoProviderRouter } = require("./routes/casinoprovider.route");
const { CasinoRouter } = require("./routes/casino.route");
const { BetRouter } = require("./routes/bet.route");
const { GameRouter } = require("./routes/game.route");
const { NavigationRouter } = require("./routes/navigation.route");
const { GameNavigationRouter } = require("./routes/gamenavigation.route");
const { FooterInfoRouter } = require("./routes/footerinfo.route");
const { SeoRouter } = require("./routes/seo.route");
const SiteRouter = require("./routes/site.router");
const { BonusHistoryRouter } = require("./routes/bonushistory.route");
const {
  AddModelQueryMiddleware,
} = require("./middlewares/applymodelquery.middleware");
const { PermissionRouter } = require("./routes/permission.route");
const { LoginHistoryRouter } = require("./routes/loginhistory.route");
const { AuthRouter } = require("./routes/authenticater.route");
const { OtpServiceRouter } = require("./routes/otpservice.route");
const { IpServiceRouter } = require("./routes/ipservice.routes");
const SportRouter = require("./routes/sport.route");
const ReferralRouter = require("./routes/referral.route");
const {ProcessReferralBonus, CalculateOtherBonuses} = require("./utils/Promotion/ProcessReferralBonus");
const GameStructure = require("./models/gamestructure.model");
const { GetPromotion } = require("./utils/Promotion/GetPromotion");
const { AffiliateRouter } = require("./routes/affiliate.route");
const { SportCallbackRouter } = require("./routes/psport.route");
server.set("trust proxy", true);
server.use(express.json());
// Middleware for cors
server.use(cors());
server.use("/api/site-switch", SiteRouter);
server.use("/api/permission", PermissionRouter);
server.use("/api/admin", AddModelQueryMiddleware, AdminRouter);
server.use("/api/user", AddModelQueryMiddleware, UserRouter);
server.use("/api/transaction", AddModelQueryMiddleware, TransactionRouter);
server.use("/api/game", AddModelQueryMiddleware, GameRouter);
server.use("/api/payment", AddModelQueryMiddleware, PaymentRouter);
server.use("/api/setting", AddModelQueryMiddleware, SettingRouter);
server.use("/api/bet", AddModelQueryMiddleware, BetRouter);
server.use("/api/promotion", AddModelQueryMiddleware, PromotionRouter);
server.use(
  "/api/casinoprovider",
  AddModelQueryMiddleware,
  CasinoProviderRouter
);
server.use(
  "/api/game-navigation",
  AddModelQueryMiddleware,
  GameNavigationRouter
);
server.use("/api/navigation", AddModelQueryMiddleware, NavigationRouter);
server.use("/api/bonus-history", AddModelQueryMiddleware, BonusHistoryRouter);
server.use("/api/footer-info", AddModelQueryMiddleware, FooterInfoRouter);
server.use("/api/seo", AddModelQueryMiddleware, SeoRouter);
server.use("/api/casinogame", AddModelQueryMiddleware, CasinoGameRouter);
server.use("/api/login-history", AddModelQueryMiddleware, LoginHistoryRouter);
server.use("/api/otp-service", OtpServiceRouter);
server.use("/api/ip-service", IpServiceRouter);
server.use("/api/auth", AuthRouter);
server.use("/api/affiliate", AddModelQueryMiddleware, AffiliateRouter);
server.use("/", CasinoRouter);
server.use("/api/sport", SportRouter);
server.use("/api/powerplay-sport", SportCallbackRouter)
server.use("/api/referral", ReferralRouter);
// server.use("/register-agent",handleAgentCurrency)
server.get("/api/home", async (req, res) => {
  res.status(200).json({
    status: 200,
    success: true,
    data: null,
    message: "Welcome to the home API! updated and CI tested-hello",
  });
});

server.all("*", (req, res) => {
  res.status(404).json({
    status: 404,
    success: false,
    data: null,
    message: "Route not found.",
  });
});

const PORT = process.env.PORT;
server.listen(PORT, async (error) => {
  if (error) {
    console.log(error);
  } else {
    try {
      await connection;
      console.log(PORT || 8099, "Connected successfully.");
    } catch (error) {
      console.log("Error while connecting to the database:", error);
    }
  }
});
// Schedule all referral bonus to user amount if complete all refer conditions
cron.schedule('*/20 * * * *', async () => {
  console.log('Running ProcessReferralBonus every 5 minutes');
  await ProcessReferralBonus();
}, {
  timezone: 'Asia/Kolkata'
});

// Schedule all bonus added to user if complete wager every 5 minutes
cron.schedule('*/10 * * * *', async () => {
  console.log('Running ProcessDepositStatusForBonus every 3 minutes');
  await CalculateOtherBonuses();
}, {
  timezone: 'Asia/Kolkata'
});


// 1- permission checking ()
// 2- sports bet history checking
// 3- all payment checking
// 4- user online history checking (fixed)
// 5- prod env check for sport and casino
// 6- rafer earn check and calculation

// refer and earn

// amount 100 (each refer)
// get the data by condition and date filter
// and add bonus to the user with all details
// and mark bonus awarded=>true (it will be a corn job after deposit)

// 1- on register mark is_registerd=>true and refer_by_code=>referralCode

// const GetBonus=async()=>{
// try{
//   const data=await BonusHistory.find({timestamp:{$gt:"2024-08-28T22:09"}})

//   console.log("Bonus Data", data);
 
// }catch(e){
//   console.log("Error", e);
// }
// }

// ProcessNewCasinoGames().then(()=>console.log("Bonus"))

// console.log(GetCurrentDateTime())


// const DeleteData=async()=>{

//   try {
//     const data = await GameStructure.deleteMany({gameProviderId:1025});
//     console.log("Deleted Data", data);
//   } catch (e) {
//     console.log("Error", e);
//   }
// }

// DeleteData().then(()=>conssole.log("hjnj"))

const removeDuplicates = async () => {
  try {
    const duplicates = await GameStructure.aggregate([
      {
        $group: {
          _id: {
            gameProviderId: "$gameProviderId",
            gameID: "$gameID"
          },
          ids: { $push: "$_id" },
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    for (const doc of duplicates) {
      // Keep the first document and remove the rest
      const idsToRemove = doc.ids.slice(1);
      await GameStructure.deleteMany({ _id: { $in: idsToRemove } });
    }

    console.log("Duplicate documents removed successfully.");
  } catch (error) {
    console.error("Error removing duplicates:", error);
  }
};

// removeDuplicates().then((res)=>console.log(res))

const getdata=async()=>{
  const promotionData = await GetPromotion({
    category: "referral_bonus",
    sub_category: "every_referral"},
  );
  console.log(promotionData, "promotionData")
}