

const CasinoModel = require("../../models/casino.model");
const UserModel = require("../../models/user.model");
const { GetCurrentTime } = require("../../utils/GetCurrentTime");
require("dotenv").config();
const authKey=process.env.AUTH_KEY_01
const gameDetails =require("../../gameDataMapping.json");
const { default: mongoose } = require("mongoose");
const { GetCurrentDateTime } = require("../../utils/GetCurrentDateTime");

const GetBalance = async (req, res) => {
  try {

    const { CompanyKey, Username, GameType, Gpid, ProductType } = req.body;

    if (!Username) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
      });
    }
console.log(CompanyKey,process.env.COMPANY_KEY, "1")
    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    // Find the user by user_id and update their exposure_limit
    const User = await UserModel.findOne({ username: Username });
    if (!User) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
      });
    }
    if (User) {
      return res.status(200).json({
        Balance: User.amount.toFixed(1),
        AccountName: User.username,
        ErrorCode: 0,
        ErrorMessage: "No Error",
      });
    }
  } catch (error) {
    return res.status(200).json({
      Balance: 0.0,
      AccountName: "",
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
      error: error.message,
    });
  }
};


const Deduct1 = async (req, res) => {
  try {
    const {
      CompanyKey = "",
      Username = "",
      GameType = "",
      Gpid = null,
      GameId = null,
      ProductType = "",
      ExtraInfo = {},
      TransferCode = null,
      Amount = 0,
      TransactionId = "",
      BetTime = "",
      GameRoundId = null,
      GamePeriodId = null,
      OrderDetail = "",
      PlayerIp = "",
      GameTypeName = null,
    } = req.body;
    const getGameNameAndProvider = gameDetails[`${Gpid}/${GameId}`];
    const User = await UserModel.findOne({ username: Username });
    const payload = {
      CompanyKey,
      Username,
      GameType,
      GpId:Gpid,
      GameId,
      ProductType,
      ExtraInfo,
      TransferCode,
      Amount,
      TransactionId,
      BetTime: GetCurrentDateTime(),
      GameRoundId,
      GamePeriodId,
      OrderDetail,
      PlayerIp,
      GameName:(getGameNameAndProvider||"Casino/Casino").split("/")[1],
      Provider:(getGameNameAndProvider||"Casino/Casino").split("/")[0],
      GameTypeName,
      UserId: User?.user_id || "",
      UserType: User?.user_type||"",
      ParentAdminId: User?.parent_admin_id||"",
      ParentAdminUsername: User?.parent_admin_username||"",
      ParentAdminRoleType: User?.parent_admin_role_type||"",
      RoleType: User?.role_type,
      site_auth_key:User?.site_auth_key||"",
      Currency:User.currency,
    }; 
    console.log(req.body, "body", payload,"payload",User ,"user", User.parent_admin_username,"username",User.parent_admin_role_type, "adminroletype", User[0]?.role_type, "role type")
    if (!Username) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
        BetAmount: Amount,
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    // Find the user by user_id and update their exposure_limit

    if (!User) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
        BetAmount: Amount,
      });
    }

    let casino = await CasinoModel.find({
      TransactionId,
      Username,
    });
    if (ProductType === 1 || ProductType == 5 || ProductType == 9) {
      if (casino.length > 0) {
        if (casino[casino.length - 1].Status == "void") {
          return res.status(200).json({
            Balance: 0.0,
            AccountName: "",
            ErrorCode: 5003,
            ErrorMessage: "Bet With Same RefNo Exists",
          });
        } else if (casino[casino.length - 1].Status == "settled") {
          return res.status(200).json({
            Balance: 0.0,
            AccountName: "",
            ErrorCode: 5003,
            ErrorMessage: "Bet With Same RefNo Exists",
          });
        } else {
          return res.status(200).json({
            Balance: 0.0,
            AccountName: "",
            ErrorCode: 5003,
            ErrorMessage: "Bet With Same RefNo Exists",
          });
        }
      }
    } else if (ProductType === 3 || ProductType === 7) {
      if (casino.length > 0 && casino[casino.length - 1].Status == "void") {
        return res.status(200).json({
          Balance: 0.0,
          AccountName: "",
          ErrorCode: 5003,
          ErrorMessage: "Bet With Same RefNo Exists",
        });
      } else if (
        casino.length > 0 &&
        casino[casino.length - 1].Status == "settled"
      ) {
        return res.status(200).json({
          Balance: 0.0,
          AccountName: "",
          ErrorCode: 5003,
          ErrorMessage: "Bet With Same RefNo Exists",
        });
      }

      if (casino.length > 0 && casino[casino.length - 1].Amount >= Amount) {
        return res.status(200).json({
          Balance: 0.0,
          AccountName: "",
          ErrorCode: 7,
          ErrorMessage: "Internal Error",
          BetAmount: Amount,
        });
      }
    }

    if (User.amount - User.exposure_limit >= Amount) {
      if (casino.length > 0) {
        let prev_amount = casino[casino.length - 1].Amount;
        let data = await CasinoModel.findOneAndUpdate(
          {
            TransactionId,
            Username,
          },
          payload,
          {new:true}
        );
        console.log(data, "data after casinobet")
        User.amount -= Math.abs(Amount - prev_amount);
        await User.save();
        console.log("dd", User.amount);
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 0,
          ErrorMessage: "No Error",
          BetAmount: Amount,
        });
      } else {
        let casino = new CasinoModel(payload);
        await casino.save();
        User.amount -= Amount;
        await User.save();
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 0,
          ErrorMessage: "No Error",
          BetAmount: Amount,
        });
      }
    } else if (User.amount - User.exposure_limit < Amount) {
      return res.status(200).json({
        Balance: User.amount.toFixed(1),
        AccountName: User.username,
        ErrorCode: 5,
        ErrorMessage: "Not enough balance",
        BetAmount: Amount,
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: "",
        ErrorCode: 5003,
        ErrorMessage: "Bet With Same RefNo Exists",
      });
    } else
      return res.status(200).json({
        Balance: 0.0,
        AccountName: "",
        ErrorCode: 7,
        ErrorMessage: "Internal Error",
        error: error.message,
      });
  }
};

const Deduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      CompanyKey = "",
      Username = "",
      GameType = "",
      Gpid = null,
      GameId = null,
      ProductType = "",
      ExtraInfo = {},
      TransferCode = null,
      Amount = 0,
      TransactionId = "",
      BetTime = "",
      GameRoundId = null,
      GamePeriodId = null,
      OrderDetail = "",
      PlayerIp = "",
      GameTypeName = null,
    } = req.body;

    const getGameNameAndProvider = gameDetails[`${Gpid}/${GameId}`];
    const User = await UserModel.findOne({ username: Username }).session(session);

    const payload = {
      CompanyKey,
      Username,
      GameType,
      GpId: Gpid,
      GameId,
      ProductType,
      ExtraInfo,
      TransferCode,
      Amount,
      TransactionId,
      BetTime: GetCurrentDateTime(),
      GameRoundId,
      GamePeriodId,
      OrderDetail,
      PlayerIp,
      GameName: (getGameNameAndProvider || "Casino/Casino").split("/")[1],
      Provider: (getGameNameAndProvider || "Casino/Casino").split("/")[0],
      GameTypeName,
      UserId: User?.user_id || "",
      UserType: User?.user_type || "",
      ParentAdminId: User?.parent_admin_id || "",
      ParentAdminUsername: User?.parent_admin_username || "",
      ParentAdminRoleType: User?.parent_admin_role_type || "",
      RoleType: User?.role_type,
      site_auth_key: User?.site_auth_key || "",
      Currency: User.currency,
    };

    if (!Username) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
        BetAmount: Amount,
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    if (!User) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
        BetAmount: Amount,
      });
    }

    let casino = await CasinoModel.find({
      TransactionId,
      Username,
    }).session(session);

    if (ProductType === 1 || ProductType == 5 || ProductType == 9) {
      if (casino.length > 0) {
        const lastCasino = casino[casino.length - 1];
        if (lastCasino.Status === "void" || lastCasino.Status === "settled") {
          await session.abortTransaction();
          session.endSession();
          return res.status(200).json({
            Balance: 0.0,
            AccountName: "",
            ErrorCode: 5003,
            ErrorMessage: "Bet With Same RefNo Exists",
          });
        } else {
          await session.abortTransaction();
          session.endSession();
          return res.status(200).json({
            Balance: 0.0,
            AccountName: "",
            ErrorCode: 5003,
            ErrorMessage: "Bet With Same RefNo Exists",
          });
        }
      }
    } else if (ProductType === 3 || ProductType === 7) {
      if (casino.length > 0) {
        const lastCasino = casino[casino.length - 1];
        if (lastCasino.Status === "void" || lastCasino.Status === "settled") {
          await session.abortTransaction();
          session.endSession();
          return res.status(200).json({
            Balance: 0.0,
            AccountName: "",
            ErrorCode: 5003,
            ErrorMessage: "Bet With Same RefNo Exists",
          });
        }
        if (lastCasino.Amount >= Amount) {
          await session.abortTransaction();
          session.endSession();
          return res.status(200).json({
            Balance: 0.0,
            AccountName: "",
            ErrorCode: 7,
            ErrorMessage: "Internal Error",
            BetAmount: Amount,
          });
        }
      }
    }

    if (User.amount >= Amount) {
      if (casino.length > 0) {
        let prev_amount = casino[casino.length - 1].Amount;
        let data = await CasinoModel.findOneAndUpdate(
          {
            TransactionId,
            Username,
          },
          payload,
          { new: true, session }
        );

        User.amount -= Math.abs(Amount - prev_amount);
        await User.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 0,
          ErrorMessage: "No Error",
          BetAmount: Amount,
        });
      } else {
        let casino = new CasinoModel(payload);
        await casino.save({ session });
        User.amount -= Amount;
        await User.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 0,
          ErrorMessage: "No Error",
          BetAmount: Amount,
        });
      }
    } else if (User.amount < Amount) {
      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        Balance: User.amount.toFixed(1),
        AccountName: User.username,
        ErrorCode: 5,
        ErrorMessage: "Not enough balance",
        BetAmount: Amount,
      });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error.code === 11000) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: "",
        ErrorCode: 5003,
        ErrorMessage: "Bet With Same RefNo Exists",
      });
    } else {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: "",
        ErrorCode: 7,
        ErrorMessage: "Internal Error",
        error: error.message,
      });
    }
  }
};


const Settle1 = async (req, res) => {
  try {
    const {
      CompanyKey,
      Username,
      GameType,
      Gpid,
      WinLoss,
      ProductType,
      ExtraInfo,
      TransferCode,
      ResultType,
      ResultTime = "",
      Amount = 0,
      CommissionStake = "",
      IsCashOut = true,
    } = req.body;

    if (!Username) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
        BetAmount: Amount,
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    // Find the user by user_id and update their exposure_limit
    const User = await UserModel.findOne({ username: Username });
    if (!User) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
        BetAmount: Amount,
      });
    }
    if (User) {
      let casino = await CasinoModel.find({
        TransferCode,
        Username,
      });
      if (casino.length === 0) {
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 6,
          ErrorMessage: "Bet not exists",
        });
      }

      let voidCount = 0;
      let settledCount = 0;
      for (let f = 0; f < casino.length; f++) {
        const currentCasino = casino[f];
        if (currentCasino.Status === "settled") {
          settledCount++;
        } else if (currentCasino.Status === "running") {
          currentCasino.ResultType = ResultType;
          currentCasino.ResultTime = ResultTime;
          currentCasino.GameType = GameType;
          currentCasino.GpId = Gpid;
          currentCasino.WinLoss = WinLoss;
          currentCasino.ProductType = ProductType;
          currentCasino.ExtraInfo = ExtraInfo;
          currentCasino.IsCashOut = IsCashOut;
          currentCasino.CommissionStake = CommissionStake;
          currentCasino.Status = "settled";

          await currentCasino.save();
        } else {
          voidCount++;
        }
      }
      if (voidCount === casino.length) {
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 2002,
          ErrorMessage: "Bet Already Canceled",
        });
      }

      if (settledCount === casino.length) {
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 2001,
          ErrorMessage: "Bet Already Settled",
        });
      }

      User.amount += WinLoss;
      await User.save();
      return res.status(200).json({
        Balance: User.amount.toFixed(1),
        AccountName: User.username,
        ErrorCode: 0,
        ErrorMessage: "No Error",
      });
    }
  } catch (error) {
    return res.status(200).json({
      Balance: 0.0,
      AccountName: "",
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
      error: error.message,
    });
  }
};


const Settle = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const {
      CompanyKey,
      Username,
      GameType,
      Gpid,
      WinLoss,
      ProductType,
      ExtraInfo,
      TransferCode,
      ResultType,
      ResultTime = "",
      Amount = 0,
      CommissionStake = "",
      IsCashOut = true,
    } = req.body;

    if (!Username) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
        BetAmount: Amount,
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    const User = await UserModel.findOne({ username: Username }).session(session);
    if (!User) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
        BetAmount: Amount,
      });
    }

    let casino = await CasinoModel.find({ TransferCode, Username }).session(session);
    if (casino.length === 0) {
      return res.status(200).json({
        Balance: User.amount.toFixed(1),
        AccountName: User.username,
        ErrorCode: 6,
        ErrorMessage: "Bet not exists",
      });
    }

    let voidCount = 0;
    let settledCount = 0;

    for (let f = 0; f < casino.length; f++) {
      const currentCasino = casino[f];
      if (currentCasino.Status === "settled") {
        settledCount++;
      } else if (currentCasino.Status === "running") {
        currentCasino.ResultType = ResultType;
        currentCasino.ResultTime = ResultTime;
        currentCasino.GameType = GameType;
        currentCasino.GpId = Gpid;
        currentCasino.WinLoss = WinLoss;
        currentCasino.ProductType = ProductType;
        currentCasino.ExtraInfo = ExtraInfo;
        currentCasino.IsCashOut = IsCashOut;
        currentCasino.CommissionStake = CommissionStake;
        currentCasino.Status = "settled";

        await currentCasino.save({ session });
      } else {
        voidCount++;
      }
    }

    if (voidCount === casino.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        Balance: User.amount.toFixed(1),
        AccountName: User.username,
        ErrorCode: 2002,
        ErrorMessage: "Bet Already Canceled",
      });
    }

    if (settledCount === casino.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        Balance: User.amount.toFixed(1),
        AccountName: User.username,
        ErrorCode: 2001,
        ErrorMessage: "Bet Already Settled",
      });
    }

    User.amount += WinLoss;
    await User.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      Balance: User.amount.toFixed(1),
      AccountName: User.username,
      ErrorCode: 0,
      ErrorMessage: "No Error",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    return res.status(200).json({
      Balance: 0.0,
      AccountName: "",
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
      error: error.message,
    });
  }
};



const Rollback1 = async (req, res) => {
  try {
    const {
      CompanyKey,
      Username,
      GameType,
      TransferCode,
      Gpid,
      ProductType,
      ExtraInfo,
    } = req.body;
    if (!Username) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    // Find the user by user_id and update their exposure_limit
    const User = await UserModel.findOne({ username: Username });
    if (!User) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
      });
    }
    if (User) {
      let casino = await CasinoModel.find({
        TransferCode,
        Username,
      });

      if (casino.length === 0) {
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 6,
          ErrorMessage: "Bet not exists",
        });
      }
      for (let i = 0; i < casino.length; i++) {
        const casinoData = casino[i];
        if (casinoData.Status === "settled") {
          User.amount = User.amount - casinoData.WinLoss;
          await User.save();
          casinoData.Status = "running";
          await casinoData.save();
        } else if (casinoData.Status === "void") {
          User.amount = User.amount - Math.abs(casinoData.Amount);
          await User.save();
          casinoData.Status = "running";
          await casinoData.save();
        } else if (casinoData.Status === "running") {
          return res.status(200).json({
            Balance: User.amount.toFixed(1),
            AccountName: User.username,
            ErrorCode: 2003,
            ErrorMessage: "Bet Already Rollback",
          });
        }
      }
      return res.status(200).json({
        Balance: User.amount.toFixed(1),
        AccountName: User.username,
        ErrorCode: 0,
        ErrorMessage: "No Error",
      });
    }
  } catch (error) {
    return res.status(200).json({
      Balance: 0,
      AccountName: "",
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
    });
  }
};

const Rollback = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      CompanyKey,
      Username,
      GameType,
      TransferCode,
      Gpid,
      ProductType,
      ExtraInfo,
    } = req.body;

    if (!Username) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    const User = await UserModel.findOne({ username: Username }).session(session);
    if (!User) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
      });
    }

    let casino = await CasinoModel.find({
      TransferCode,
      Username,
    }).session(session);

    if (casino.length === 0) {
      return res.status(200).json({
        Balance: User.amount.toFixed(1),
        AccountName: User.username,
        ErrorCode: 6,
        ErrorMessage: "Bet not exists",
      });
    }

    for (let i = 0; i < casino.length; i++) {
      const casinoData = casino[i];
      if (casinoData.Status === "settled") {
        User.amount = User.amount - casinoData.WinLoss;
        await User.save({ session });
        casinoData.Status = "running";
        await casinoData.save({ session });
      } else if (casinoData.Status === "void") {
        User.amount = User.amount - Math.abs(casinoData.Amount);
        await User.save({ session });
        casinoData.Status = "running";
        await casinoData.save({ session });
      } else if (casinoData.Status === "running") {
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 2003,
          ErrorMessage: "Bet Already Rollback",
        });
      }
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      Balance: User.amount.toFixed(1),
      AccountName: User.username,
      ErrorCode: 0,
      ErrorMessage: "No Error",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(200).json({
      Balance: 0,
      AccountName: "",
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
    });
  }
};

const Cancel1 = async (req, res) => {
  try {
    const {
      CompanyKey,
      Username,
      GameType,
      TransferCode,
      Gpid,
      IsCancelAll,
      TransactionId,
      ProductType,
      ExtraInfo,
    } = req.body;
    if (!Username) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
      });
    }
    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    const User = await UserModel.findOne({ username: Username });
    if (!User) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
      });
    }
    if (User) {
      // here a condition will add for IsCancelAll
      if (IsCancelAll) {
        let casino = await CasinoModel.find({
          TransferCode,
          Username,
        });

        if (casino.length === 0) {
          return res.status(200).json({
            Balance: User.amount.toFixed(1),
            AccountName: User.username,
            ErrorCode: 6,
            ErrorMessage: "Bet not exists",
          });
        }
        let total = 0;
        for (let i = 0; i < casino.length; i++) {
          const casinoData = casino[i];
          if (casinoData.Status === "settled") {
            casinoData.Status = "void";
            await casinoData.save();
            total += casinoData.Amount;
          } else if (casinoData.Status === "running") {
            User.amount = User.amount + casinoData.Amount;
            await User.save();
            casinoData.Status = "void";
            await casinoData.save();
          } else {
            return res.status(200).json({
              Balance: User.amount.toFixed(1),
              AccountName: User.username,
              ErrorCode: 2002,
              ErrorMessage: "Bet Already Canceled",
            });
          }
        }
        User.amount = User.amount - Math.abs(total - casino[0].WinLoss);
        await User.save();
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 0,
          ErrorMessage: "No Error",
        });
      } else if (!IsCancelAll) {
        // here a condition will add for !IsCancelAll
        let casino = await CasinoModel.findOne({
          TransferCode,
          TransactionId,
          Username,
        });

        if (!casino) {
          return res.status(200).json({
            Balance: User.amount.toFixed(1),
            AccountName: User.username,
            ErrorCode: 6,
            ErrorMessage: "Bet not exists",
          });
        }
        if (casino.Status === "settled") {
          User.amount =
            User.amount - Math.abs(casinoData.WinLoss - casinoData.Amount);
          await User.save();
          casino.Status = "void";
          await casino.save();
          return res.status(200).json({
            Balance: User.amount.toFixed(1),
            AccountName: User.username,
            ErrorCode: 0,
            ErrorMessage: "No Error",
          });
        } else if (casino.Status === "running") {
          User.amount = User.amount + casino.Amount;
          await User.save();
          casino.Status = "void";
          await casino.save();
          return res.status(200).json({
            Balance: User.amount.toFixed(1),
            AccountName: User.username,
            ErrorCode: 0,
            ErrorMessage: "No Error",
          });
        } else {
          return res.status(200).json({
            Balance: User.amount.toFixed(1),
            AccountName: User.username,
            ErrorCode: 2002,
            ErrorMessage: "Bet Already Canceled",
          });
        }
      }
    }
  } catch (error) {
    return res.status(200).json({
      Balance: 0.0,
      AccountName: "",
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
      error: error.message,
    });
  }
};



const Cancel = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      CompanyKey,
      Username,
      GameType,
      TransferCode,
      Gpid,
      IsCancelAll,
      TransactionId,
      ProductType,
      ExtraInfo,
    } = req.body;

    if (!Username) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    const User = await UserModel.findOne({ username: Username }).session(session);
    if (!User) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
      });
    }

    if (IsCancelAll) {
      let casino = await CasinoModel.find({
        TransferCode,
        Username,
      }).session(session);

      if (casino.length === 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 6,
          ErrorMessage: "Bet not exists",
        });
      }

      let total = 0;
      for (let i = 0; i < casino.length; i++) {
        const casinoData = casino[i];
        if (casinoData.Status === "settled") {
          casinoData.Status = "void";
          await casinoData.save({ session });
          total += casinoData.Amount;
        } else if (casinoData.Status === "running") {
          User.amount = User.amount + casinoData.Amount;
          await User.save({ session });
          casinoData.Status = "void";
          await casinoData.save({ session });
        } else {
          await session.abortTransaction();
          session.endSession();
          return res.status(200).json({
            Balance: User.amount.toFixed(1),
            AccountName: User.username,
            ErrorCode: 2002,
            ErrorMessage: "Bet Already Canceled",
          });
        }
      }

      User.amount = User.amount - Math.abs(total - casino[0].WinLoss);
      await User.save({ session });
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({
        Balance: User.amount.toFixed(1),
        AccountName: User.username,
        ErrorCode: 0,
        ErrorMessage: "No Error",
      });
    } else if (!IsCancelAll) {
      let casino = await CasinoModel.findOne({
        TransferCode,
        TransactionId,
        Username,
      }).session(session);

      if (!casino) {
        await session.abortTransaction();
        session.endSession();
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 6,
          ErrorMessage: "Bet not exists",
        });
      }

      if (casino.Status === "settled") {
        User.amount = User.amount - Math.abs(casino.WinLoss - casino.Amount);
        await User.save({ session });
        casino.Status = "void";
        await casino.save({ session });
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 0,
          ErrorMessage: "No Error",
        });
      } else if (casino.Status === "running") {
        User.amount = User.amount + casino.Amount;
        await User.save({ session });
        casino.Status = "void";
        await casino.save({ session });
        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 0,
          ErrorMessage: "No Error",
        });
      } else {
        await session.abortTransaction();
        session.endSession();
        return res.status(200).json({
          Balance: User.amount.toFixed(1),
          AccountName: User.username,
          ErrorCode: 2002,
          ErrorMessage: "Bet Already Canceled",
        });
      }
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(200).json({
      Balance: 0.0,
      AccountName: "",
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
      error: error.message,
    });
  }
};


const Bonus = async (req, res) => {
  const {
    CompanyKey = "",
    Username = "",
    Amount = 0,
    BonusTime = "",
    BetTime = "",
    ProductType = 0,
    IsGameProviderPromotion = null,
    GameType = "",
    TransactionId = "",
    TransferCode = "",
    GameId = null,
    Gpid,
  } = req.body;

  let payload = {
    CompanyKey,
    Username,
    Amount,
    BonusTime,
    BetTime,
    ProductType,
    IsGameProviderPromotion,
    GameType,
    TransactionId,
    TransferCode,
    GameId,
    Gpid,
  };
  try {
    if (!Username) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    // Find the user by user_id and update their exposure_limit
    const User = await UserModel.findOne({ username: Username });
    if (!User) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
      });
    }
    if (User) {
      payload={...payload, Currency:User.currency};
      let casino = await CasinoModel.findOne({
        TransferCode,
        TransactionId,
        Username,
      });

      if (casino) {
        return res.status(200).json({
          Balance: 0.0,
          AccountName: "",
          ErrorCode: 5003,
          ErrorMessage: "Bet With Same RefNo Exists",
        });
      }
      if (!casino) {
        payload={...payload, Currency:User.currency}
        let casino1 = new CasinoModel(payload);
        await casino1.save();
        User.amount = User.amount + Amount;
        await User.save();
        return res.status(200).json({
          AccountName: User.username,
          Balance: User.amount,
          ErrorCode: 0,
          ErrorMessage: "No Error",
        });
      }
    }
  } catch (error) {
    console.log(error, "bonus error")
    return res.status(200).json({
      AccountName: Username,
      Balance: 0,
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
    });
  }
};


const Bonus1 = async (req, res) => {
  const {
    CompanyKey = "",
    Username = "",
    Amount = 0,
    BonusTime = "",
    BetTime = "",
    ProductType = 0,
    IsGameProviderPromotion = null,
    GameType = "",
    TransactionId = "",
    TransferCode = "",
    GameId = null,
    Gpid,
  } = req.body;

  let payload = {
    CompanyKey,
    Username,
    Amount,
    BonusTime,
    BetTime,
    ProductType,
    IsGameProviderPromotion,
    GameType,
    TransactionId,
    TransferCode,
    GameId,
    Gpid,
  };

  try {
    if (!Username) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    // Start a MongoDB transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find the user by user_id and update their exposure_limit
      const User = await UserModel.findOne({ username: Username }).session(session);

      if (!User) {
        await session.abortTransaction();
        return res.status(200).json({
          Balance: 0,
          AccountName: Username,
          ErrorCode: 1,
          ErrorMessage: "Member not exist",
        });
      }

      if (User) {
        payload = { ...payload, Currency: User.currency };
        let casino = await CasinoModel.findOne({
          TransferCode,
          TransactionId,
          Username,
        }).session(session);

        if (casino) {
          await session.abortTransaction();
          return res.status(200).json({
            Balance: 0.0,
            AccountName: "",
            ErrorCode: 5003,
            ErrorMessage: "Bet With Same RefNo Exists",
          });
        }

        if (!casino) {
          payload = { ...payload, Currency: User.currency };
          let casino1 = new CasinoModel(payload);
          await casino1.save({ session })
          User.amount = User.amount + Amount;
          await User.save().session(session);
          await session.commitTransaction();
          return res.status(200).json({
            AccountName: User.username,
            Balance: User.amount,
            ErrorCode: 0,
            ErrorMessage: "No Error",
          });
        }
      }
    } catch (error) {
      await session.abortTransaction();
      console.log(error, "bonus error")
      return res.status(200).json({
        AccountName: Username,
        Balance: 0,
        ErrorCode: 7,
        ErrorMessage: "Internal Error",
      });
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.log(error, "bonus error")
    return res.status(200).json({
      AccountName: Username,
      Balance: 0,
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
    });
  }
};


const ReturnStake1 = async (req, res) => {
  const {
    CompanyKey,
    Username,
    GameType,
    ProductType,
    CurrentStake,
    ReturnStakeTime,
    TransactionId,
    TransferCode,
  } = req.body;
  try {
    if (!Username) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    // Find the user by user_id and update their exposure_limit
    const User = await UserModel.findOne({ username: Username });
    if (!User) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
      });
    }

    if (User) {
      let casino = await CasinoModel.findOne({
        TransferCode,
        TransactionId,
        Username,
      });

      if (!casino) {
        return res.status(200).json({
          AccountName: User.username,
          Balance: User.amount,
          ErrorCode: 6,
          ErrorMessage: "Bet not exists",
        });
      }

        if (casino.Status == "void") {
        return res.status(200).json({
          AccountName: User.username,
          Balance: User.amount,
          ErrorCode: 2002,
          ErrorMessage: "Bet Already Canceled",
        });
        }
      if (casino.ReturnStake !== 0) {
        return res.status(200).json({
          AccountName: User.username,
          Balance: User.amount,
          ErrorCode: 5008,
          ErrorMessage: "Bet Already Returned Stake",
        });
      }

      User.amount = User.amount + CurrentStake;
      await User.save();
      casino.Amount = casino.Amount - CurrentStake;
      casino.ReturnStake = CurrentStake;
      await casino.save();
      return res.status(200).json({
        AccountName: User.username,
        Balance: User.amount,
        ErrorCode: 0,
        ErrorMessage: "No Error",
      });
    }
  } catch (error) {
    return res.status(200).json({
      AccountName: Username,
      Balance: 0,
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
    });
  }
};

const ReturnStake = async (req, res) => {
  // Start the transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  const {
    CompanyKey,
    Username,
    GameType,
    ProductType,
    CurrentStake,
    ReturnStakeTime,
    TransactionId,
    TransferCode,
  } = req.body;

  try {

    if (!Username) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }

    // Find the user by user_id and update their exposure_limit
    const User = await UserModel.findOne({ username: Username }).session(session);
    if (!User) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
      });
    }

    let casino = await CasinoModel.findOne({
      TransferCode,
      TransactionId,
      Username,
    }).session(session);

    if (!casino) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        AccountName: User.username,
        Balance: User.amount,
        ErrorCode: 6,
        ErrorMessage: "Bet not exists",
      });
    }

    if (casino.Status === "void") {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        AccountName: User.username,
        Balance: User.amount,
        ErrorCode: 2002,
        ErrorMessage: "Bet Already Canceled",
      });
    }

    if (casino.ReturnStake !== 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        AccountName: User.username,
        Balance: User.amount,
        ErrorCode: 5008,
        ErrorMessage: "Bet Already Returned Stake",
      });
    }

    // Update the user's amount
    User.amount = User.amount + CurrentStake;
    await User.save({ session });

    // Update the casino document
    casino.Amount = casino.Amount - CurrentStake;
    casino.ReturnStake = CurrentStake;
    await casino.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      AccountName: User.username,
      Balance: User.amount,
      ErrorCode: 0,
      ErrorMessage: "No Error",
    });
  } catch (error) {
    // Rollback the transaction if any error occurs
    await session.abortTransaction();
    session.endSession();
    return res.status(200).json({
      AccountName: Username,
      Balance: 0,
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
    });
  }
};


const GetBetStatus = async (req, res) => {
  const {
    CompanyKey,
    Username,
    GameType,
    Gpid,
    ProductType,
    TransactionId,
    TransferCode,
  } = req.body;
  try {
    if (!Username) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 3,
        ErrorMessage: "Username empty",
      });
    }

    if (!CompanyKey || CompanyKey !== process.env.COMPANY_KEY) {
      return res.status(200).json({
        Balance: 0.0,
        AccountName: Username,
        ErrorCode: 4,
        ErrorMessage: "CompanyKey Error",
      });
    }
    // Find the user by user_id and update their exposure_limit
    const User = await UserModel.findOne({ username: Username });
    if (!User) {
      return res.status(200).json({
        Balance: 0,
        AccountName: Username,
        ErrorCode: 1,
        ErrorMessage: "Member not exist",
      });
    }
    if (User) {
      let casino = await CasinoModel.findOne({
        TransferCode,
        TransactionId,
      });

      if (!casino) {
        return res.status(200).json({
          TransactionId: TransactionId,
          TransferCode: TransferCode,
          WinLoss: 0,
          ErrorCode: 6,
          ErrorMessage: "Bet not exists",
        });
      }
      return res.status(200).json({
        Stake: casino.Amount,
        Status: casino.Status,
        TransactionId: casino.TransactionId,
        TransferCode: casino.TransferCode,
        WinLoss: casino.WinLoss,
        ErrorCode: 0,
        ErrorMessage: "No Error",
      });
    }
  } catch (error) {
    return res.status(200).json({
      Balance: 0,
      ErrorCode: 7,
      ErrorMessage: "Internal Error",
      TransactionId: TransactionId,
      TransferCode: TransferCode,
    });
  }
};

module.exports = {
  GetBalance,
  Deduct,
  Settle,
  Rollback,
  Cancel,
  Bonus,
  ReturnStake,
  GetBetStatus,
};
