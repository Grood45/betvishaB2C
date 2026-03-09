const BonusHistory = require("../../models/bonushistory.model");
const { VerifyJwt } = require("../../utils/VerifyJwt");

const GetAllBonusHistory = async (req, res) => {
  try {
    console.log("isnisnf");
    const { token, usernametoken } = req.headers;
    const {
      page = 1,
      limit = 20,
      search = "",
      status,
      category,
      sub_category,
    } = req.query;
    const modelQuery = req.query.modelQuery;

    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    if (
      !type ||
      (!adminUsername &&
        
        type !== "owneradmin")
    ) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    console.log(type, adminUsername);
    const skip = (page - 1) * limit;

    let query = { ...modelQuery }
    let query2 = { ...modelQuery }
    query = {
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
    };
    query2 = {
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
    };
    let allBonus = [];

    if (search) {
      query = {
        $or: [{ username: { $regex: search, $options: "i" } }],
      };
    }

    if (category) {
      query.category = category;
    }

    if (sub_category) {
      query.sub_category = sub_category;
    }

    console.log(query);
    if (status == "all") {
      allBonus = await BonusHistory.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);
    } else if (status == "failed") {
      query.status = status;

      allBonus = await BonusHistory.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);
    } else if (status == "success") {
      query.status = status;
      allBonus = await BonusHistory.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);
    }
    let allBonusDataCount = await BonusHistory.find(query);

    let allBonusData = await BonusHistory.find(query2);
    // allBonusData=JSON.parse(allBonusData)
    let FailedBonusAmount = 0;
    let SuccessBonusAmount = 0;
    let BetBonusAmount = 0;
    let DepositBonusAmount = 0;
    let NewUserBonusAmount = 0;
    let ReferralBonusUser = 0;

    let BetBonusCount = 0;
    let DepositBonusCount = 0;
    let NewUserBonusCount = 0;
    let SuccessBonusCount = 0;
    let FailedBonusCount = 0;
    let ReferralBonusAmount = 0;

    // Iterate through all bets using a for loop
    for (let i = 0; i < allBonusData.length; i++) {
      const singleBonus = allBonusData[i];

      if (singleBonus.status == "failed") {
        FailedBonusCount += 1;
        FailedBonusAmount = FailedBonusAmount + singleBonus.bonus_amount;
      }
      if (singleBonus.status == "success") {
        SuccessBonusAmount = SuccessBonusAmount + singleBonus.bonus_amount;
        SuccessBonusCount += 1;
      }
      if (singleBonus.category == "bet_bonus") {
        BetBonusAmount = BetBonusAmount + singleBonus.bonus_amount;
        BetBonusCount += 1;
      }

      if (singleBonus.category == "user_bonus") {
        NewUserBonusAmount += singleBonus.bonus_amount;
        NewUserBonusCount += 1;
      }

      if (singleBonus.category == "deposit_bonus") {
        DepositBonusAmount += singleBonus.bonus_amount;
        DepositBonusCount += 1;
      }

      if (singleBonus.category == "referral_bonus") {
        ReferralBonusAmount += singleBonus.bonus_amount;
        ReferralBonusUser += 1;
      }

    }

    const totalPages = Math.ceil(allBonusDataCount.length / limit);
    const pagination = {
      totalBonus: allBonusDataCount.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    res.status(200).json({
      status: 200,
      success: true,
      data: allBonus,
      bonusCount: {
        BetBonusCount,
        DepositBonusCount,
        NewUserBonusCount,
        SuccessBonusCount,
        FailedBonusCount,
        ReferralBonusUser,
      },
      bonusAmount: {
        BetBonusAmount,
        DepositBonusAmount,
        ReferralBonusAmount,
        NewUserBonusAmount,
        SuccessBonusAmount,
        FailedBonusAmount,
      },
      pagination,
      message: "Bonus data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllBonusHistoryOfSingleUserByAdmin = async (req, res) => {
  try {
    const { token, usernametoken } = req.headers;
    const {
      page = 1,
      limit = 20,
      username = "",
      category,
      sub_category,
      status,
    } = req.query;
    const modelQuery = req.query.modelQuery || {};

    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    const adminId = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type

    if (!adminId || !adminUsername) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    const skip = (page - 1) * limit;
    let query = { ...modelQuery };

    if (category) query.category = category;
    if (sub_category) query.sub_category = sub_category;
    if (username) query.username = username;

    if (status && status !== "all") {
      query.status = status;
    }

    const allBonus = await BonusHistory.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const totalBonus = await BonusHistory.countDocuments(query);
    const totalPages = Math.ceil(totalBonus / limit);

    const pagination = {
      totalBonus,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    res.status(200).json({
      status: 200,
      success: true,
      data: allBonus,
      pagination,
      message: "Bonus data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllBonusHistoryForUser = async (req, res) => {
  try {
    const { token, usernametoken } = req.headers;
    const { page = 1, limit = 20, search = "", status, category,
    sub_category, } = req.query;
    const modelQuery = req.query.modelQuery;
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const userUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    if (!type || !userUsername) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    console.log(type, userUsername);

    const skip = (page - 1) * limit;
    let query = modelQuery||{};
    let query2 = modelQuery||{};
    query = {
      username: userUsername,
      role_type: type,
    };
    query2 = {
      username: userUsername,
      role_type: type,
    };
    let allBonus = [];
    if (search) {
      query = {
        $or: [{ username: { $regex: search, $options: "i" } }],
      };
    }

    if (category) {
      query.category = category;
    }

    if (sub_category) {
      query.sub_category = sub_category;
    }

    console.log(query, "ifnin")
    if (status == "all") {
      allBonus = await BonusHistory.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);
    } else if (status == "failed") {
      query.status = status;

      allBonus = await BonusHistory.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);
    } else if (status == "success") {
      query.status = status;
      allBonus = await BonusHistory.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);
    }

    let allBonusDataCount = await BonusHistory.find(query);

    let allBonusData = await BonusHistory.find(query2);
    let FailedBonusAmount = 0;
    let SuccessBonusAmount = 0;
    let BetBonusAmount = 0;
    let DepositBonusAmount = 0;
    let NewUserBonusAmount = 0;

    let BetBonusCount = 0;
    let DepositBonusCount = 0;
    let NewUserBonusCount = 0;
    let SuccessBonusCount = 0;
    let FailedBonusCount = 0;

    // Iterate through all bets using a for loop
    for (let i = 0; i < allBonusData.length; i++) {
      const singleBonus = allBonusData[i];

      if (singleBonus.status == "failed") {
        FailedBonusAmount += singleBonus.bonus_amount;
        FailedBonusCount += 1;
      }
      if (singleBonus.status == "success") {
        SuccessBonusAmount += +singleBonus.bonus_amount;
        SuccessBonusCount += 1;
      }
      if (singleBonus.category == "bet_bonus") {
        BetBonusAmount += +singleBonus.bonus_amount;
        BetBonusCount += 1;
      }

      if (singleBonus.category == "user_bonus") {
        NewUserBonusAmount += +singleBonus.bonus_amount;
        NewUserBonusCount += 1;
      }

      if (singleBonus.category == "deposit_bonus") {
        DepositBonusAmount += singleBonus.bonus_amount;
        DepositBonusCount += 1;
      }
    }
    const totalPages = Math.ceil(allBonusDataCount.length / limit);
    const pagination = {
      totalBonus: allBonusDataCount.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    res.status(200).json({
      status: 200,
      success: true,
      data: allBonus,
      bonusCount: {
        BetBonusCount,
        DepositBonusCount,
        NewUserBonusCount,
        SuccessBonusCount,
        FailedBonusCount,
      },
      bonusAmount: {
        BetBonusAmount,
        DepositBonusAmount,
        NewUserBonusAmount,
        SuccessBonusAmount,
        FailedBonusAmount,
      },
      pagination,
      message: "Bonus data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

module.exports = { GetAllBonusHistory, GetAllBonusHistoryForUser, GetAllBonusHistoryOfSingleUserByAdmin };
