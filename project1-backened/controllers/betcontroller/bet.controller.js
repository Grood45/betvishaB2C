const CasinoModel = require("../../models/casino.model");
const { ConvertStructureToBet } = require("../../utils/ConvertStructureToBet");
const { VerifyJwt } = require("../../utils/VerifyJwt");

const GetAllBetUser = async (req, res) => {
  try {
    const { token, usernametoken } = req.headers;
    const { page = 1, limit = 20, search = "", status = "all" } = req.query;
    const modelQuery = req.query.modelQuery;
    
    // Verify JWT tokens
    const type = await VerifyJwt(token, req, res);
    const userUsername = await VerifyJwt(usernametoken, req, res);
    
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    const skip = (page - 1) * limit;
    let query2 = { RoleType: type, Username: userUsername, ...modelQuery };

    // Handle search
    if (search) {
      query2.$or = [{ Username: { $regex: search, $options: "i" } }];
    }

    // Handle status
// Handle status
const statusConditions = {
  pending: { Status: "running" },
  win: { $expr: { $gt: [{ $toDouble: "$WinLoss" }, 0] } },    // Win: Positive values
  lose: { $expr: { $lte: [{ $toDouble: "$WinLoss" }, 0] } },  // Lose: Zero or negative values
  refund: { Status: "void" },
};
    if (status !== "all" && statusConditions[status]) {
      query2 = { ...query2, ...statusConditions[status] };
    }

    // Fetch bets
    const bets = await CasinoModel.find(query2)
      .sort({ BetTime: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate casino bet amount
    const casinoBetAmount = bets
      .filter(bet => bet.EventType === "casino")
      .reduce((sum, bet) => sum + bet.Amount, 0);

    // Fetch count of bets based on various criteria
    const [allCasinoBets, winCasinoBet, loseCasinoBet, pendingCasinoBet, refundCasinoBet] = await Promise.all([
      CasinoModel.countDocuments(query2),
      CasinoModel.countDocuments({ ...query2, ResultType: 0 }),
      CasinoModel.countDocuments({ ...query2, ResultType: 1 }),
      CasinoModel.countDocuments({ ...query2, Status: "running" }),
      CasinoModel.countDocuments({ ...query2, Status: "void" })
    ]);

    // Implementing pagination
    const totalItems = allCasinoBets;
    const totalPages = Math.ceil(totalItems / limit);
    const pagination = {
      totalbet: totalItems,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    res.status(200).json({
      status: 200,
      success: true,
      data: bets,
      betsCount: {
        loseBet: loseCasinoBet,
        winBet: winCasinoBet,
        pendingBet: pendingCasinoBet,
        refundBet: refundCasinoBet,
        allBet: allCasinoBets,
      },
      betAmount: {
        casinoBetAmount,
      },
      pagination,
      message: "Bet data retrieved successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllBet = async (req, res) => {
  try {
    const { token, usernametoken } = req.headers;
    const modelQuery=req.query.modelQuery
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    const { page = 1, limit = 20, search = "", status } = req.query;
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    if (!type || !adminUsername) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    const skip = (page - 1) * limit;
    let query = modelQuery||{};
    let query2 = modelQuery||{};
    if ( type !== "owneradmin") {
      query = {
        ParentAdminUsername: adminUsername,
        ParentAdminRoleType: type,
      };
      query2.ParentAdminUsername = adminUsername;
      query2.ParentAdminRoleType = type;
    }

    let bet = [];

    if (search) {
      query2 = {
        $or: [{ Username: { $regex: search, $options: "i" } }],
      };
    }

    if (status == "all") {
      bet = await CasinoModel.find(query2)
        .sort({ BetTime: -1 })
        .skip(skip)
        .limit(limit);
    } else if (status == "pending") {
      query2.Status = "running";

      bet = await CasinoModel.find(query2)
        .sort({ BetTime: -1 })
        .skip(skip)
        .limit(limit);
    } else if (status == "win") {
      query2.ResultType = 0;

      bet = await CasinoModel.find(query2)
        .sort({ BetTime: -1 })
        .skip(skip)
        .limit(limit);
    } else if (status == "lose") {
      query2.ResultType = 1;
      bet = await CasinoModel.find(query2)
        .sort({ BetTime: -1 })
        .skip(skip)
        .limit(limit);
    } else if (status == "refund") {
      (query2.Status = "void"),
        (bet = await CasinoModel.find(query2).skip(skip).limit(limit));
    }

    let allBet = await CasinoModel.find(query);
    let casinoBetAmount = 0;

    // Iterate through all bets using a for loop
    for (let i = 0; i < allBet.length; i++) {
      const singleBet = allBet[i];
      if (singleBet.EventType == "casino") {
        casinoBetAmount += singleBet.Amount;
      }
    }
    let statusQuery = {};
    if (status === "failed" || status === "success") {
      statusQuery.status == status;
    }
    // console.log(status, "stratsu")
    const allCasinoBets = await CasinoModel.countDocuments({ ...query2 });
    const winCasinoBet = await CasinoModel.countDocuments({
      ...query,
      ResultType: 0,
    });
    const loseCasinoBet = await CasinoModel.countDocuments({
      ...query,
      ResultType: 1,
    });
    const pendingCasinoBet = await CasinoModel.countDocuments({
      ...query,
      Status: "running",
    });
    const refundCasinoBet = await CasinoModel.countDocuments({
      ...query,
      Status: "void",
    });

    const totalPages = Math.ceil(allCasinoBets / limit) || 1;
    const pagination = {
      totalbet: allCasinoBets,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };
    // console.log(allCasinoBets, "allebrr")
    res.status(200).json({
      status: 200,
      success: true,
      data: bet,
      betsCount: {
        loseBet: loseCasinoBet,
        winBet: winCasinoBet,
        pendingBet: pendingCasinoBet,
        refundBet: refundCasinoBet,
        allBet: allBet.length,
      },
      betAmount: {
        casinoBetAmount,
      },
      pagination,
      message: "Bet data retrieved successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllBetByParentOfUser = async (req, res) => {
  try {
    const { token, usernametoken } = req.headers;
    const { page = 1, limit = 20, search = "", status } = req.query;
    const modelQuery=req.query.modelQuery
    const { parent_admin_id, parent_admin_username, parent_admin_role_type } =
      req.body;
    if (!parent_admin_role_type || !parent_admin_username) {
      return res.status(400).json({
        status: 400,
        success: false,
        message:
          "Missing or invalid parameters in the request body. Access denied.",
      });
    }
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    if (!type || !adminUsername) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    const skip = (page - 1) * limit;
    let query = modelQuery||{};
    let query2 = modelQuery||{};
    query2.ParentAdminUsername = parent_admin_username;
    query2.ParentAdminRoleType = parent_admin_role_type;
    query.ParentAdminRoleType = parent_admin_role_type;
    query.ParentAdminUsername = parent_admin_username;
    let bet = [];
    if (search) {
      query2 = {
        $or: [{ Username: { $regex: search, $options: "i" } }],
      };
    }

    if (status == "all") {
      bet = await CasinoModel.find(query2)
        .sort({ BetTime: -1 })
        .skip(skip)
        .limit(limit);
    } else if (status == "pending") {
      query2.Status = "running";

      bet = await CasinoModel.find(query2)
        .sort({ BetTime: -1 })
        .skip(skip)
        .limit(limit);
    } else if (status == "win") {
      query2.ResultType = 0;

      bet = await CasinoModel.find(query2)
        .sort({ BetTime: -1 })
        .skip(skip)
        .limit(limit);
    } else if (status == "lose") {
      query2.ResultType = 1;
      bet = await CasinoModel.find(query2)
        .sort({ BetTime: -1 })
        .skip(skip)
        .limit(limit);
    } else if (status == "refund") {
      (query2.Status = "void"),
        (bet = await CasinoModel.find(query2).skip(skip).limit(limit));
    }

    let allBet = await CasinoModel.find(query);
    let casinoBetAmount = 0;

    // Iterate through all bets using a for loop
    for (let i = 0; i < allBet.length; i++) {
      const singleBet = allBet[i];
      if (singleBet.EventType == "casino") {
        casinoBetAmount += singleBet.Amount;
      }
    }

    let statusQuery = {};
    if (status === "failed" || status === "success") {
      query.status == status;
    }

    const allCasinoBets = await CasinoModel.countDocuments(
      query,
      ...statusQuery
    );
    const winCasinoBet = await CasinoModel.countDocuments({
      ...query,
      ResultType: 0,
    });
    const loseCasinoBet = await CasinoModel.countDocuments({
      ...query,
      ResultType: 1,
    });
    const pendingCasinoBet = await CasinoModel.countDocuments({
      ...query,
      Status: "running",
    });
    const refundCasinoBet = await CasinoModel.countDocuments({
      ...query,
      Status: "void",
    });

    const totalPages = Math.ceil(allCasinoBets / limit);
    const pagination = {
      totalbet: allCasinoBets,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    res.status(200).json({
      status: 200,
      success: true,
      data: bet,
      betsCount: {
        loseBet: loseCasinoBet,
        winBet: winCasinoBet,
        pendingBet: pendingCasinoBet,
        refundBet: refundCasinoBet,
        allBet: allCasinoBets,
      },
      betAmount: {
        casinoBetAmount,
      },
      pagination,
      message: "Bet data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllBetOfUserForParent = async (req, res) => {
  try {
    const { token, usernametoken } = req.headers;
    const { page = 1, limit = 20, search = "", status } = req.query;
    const { parent_admin_id, username, role_type } = req.body;
    
    if (!role_type || !username) {
      return res.status(400).json({
        status: 400,
        success: false,
        message:
          "Missing or invalid parameters in the request body. Access denied.",
      });
    }
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    if (!type || !adminUsername) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    const skip = (page - 1) * limit;
    let query = {};
    let query2 = {};
    query2.Username = username;
    query2.RoleType = role_type;
    query.Username = username;
    query.RoleType = role_type;
    let bet = [];
    if (search) {
      query2 = {
        $or: [{ Username: { $regex: search, $options: "i" } }],
      };
    }

    if (status == "all") {
      bet = await CasinoModel.find(query2)
        .sort({ BetTime: -1 })
        .skip(skip)
        .limit(limit);
      console.log("ninin");
    } else if (status == "pending") {
      query2.Status = "running";

      bet = await CasinoModel.find(query2)
        .sort({ BetTime: -1 })
        .skip(skip)
        .limit(limit);
    } else if (status == "win") {
      query2.ResultType = 0;

      bet = await CasinoModel.find(query2)
        .sort({ BetTime: -1 })
        .skip(skip)
        .limit(limit);
    } else if (status == "lose") {
      query2.ResultType = 1;
      bet = await CasinoModel.find(query2)
        .sort({ BetTime: -1 })
        .skip(skip)
        .limit(limit);
    } else if (status == "refund") {
      (query2.Status = "void"),
        (bet = await CasinoModel.find(query2).skip(skip).limit(limit));
    }

    let allBet = await CasinoModel.find(query);
    let casinoBetAmount = 0;

    // Iterate through all bets using a for loop
    for (let i = 0; i < allBet.length; i++) {
      const singleBet = allBet[i];
      if (singleBet.EventType == "casino") {
        casinoBetAmount += singleBet.Amount;
      }
    }
    const allCasinoBets = await CasinoModel.countDocuments(query);
    const winCasinoBet = await CasinoModel.countDocuments({
      ...query,
      ResultType: 0,
    });
    const loseCasinoBet = await CasinoModel.countDocuments({
      ...query,
      ResultType: 1,
    });
    const pendingCasinoBet = await CasinoModel.countDocuments({
      ...query,
      Status: "running",
    });
    const refundCasinoBet = await CasinoModel.countDocuments({
      ...query,
      Status: "void",
    });

    const totalPages = Math.ceil(allCasinoBets / limit);
    const pagination = {
      totalbet: allCasinoBets,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    res.status(200).json({
      status: 200,
      success: true,
      data: bet,
      betsCount: {
        loseBet: loseCasinoBet,
        winBet: winCasinoBet,
        pendingBet: pendingCasinoBet,
        refundBet: refundCasinoBet,
        allBet: allCasinoBets,
      },
      betAmount: {
        casinoBetAmount,
      },
      pagination,
      message: "Bet data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllBetPlForGraph = async (req, res) => {
  try {
    const { token, usernametoken } = req.headers;
    const type = await VerifyJwt(token, req, res);
    const modelQuery=req.query.modelQuery
    const adminUsername = await VerifyJwt(usernametoken, req, res);

    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Get current date and time
    const currentDate = new Date();
    // Calculate the start date for 12 months ago
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 11,
      1
    );
    // Set the end date to the current date
    const { GpId } = req.query;
    let monthlyPL = [];
    for (let i = 0; i < 12; i++) {
      // Calculate the start and end date for the current month
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i + 1,
        0
      );

      // Format start and end dates to match the bet time format
      const formattedStartOfMonth = formatDate(startOfMonth);
      const formattedEndOfMonth = formatDate(endOfMonth);

      // Query to filter bets for the current month and GpId

      let query2 = {
        BetTime: { $gte: formattedStartOfMonth, $lte: formattedEndOfMonth },...modelQuery
      };
      if ( type !== "owneradmin") {
        query2.ParentAdminUsername = adminUsername;
        query2.ParentAdminRoleType = type;
      }

      if (GpId) {
        query2.GpId = GpId;
      }

      let bet2 = await CasinoModel.find(query2);

      let casinoBetAmount = 0;
      let loseBetAmount = 0;
      let winBetAmount = 0;

      for (let j = 0; j < bet2.length; j++) {
        const bet = bet2[j];
        if (bet.EventType == "casino") {
          casinoBetAmount += Number(bet.Amount);
          if (bet.ResultType === 1) {
            loseBetAmount += Number(bet.Amount);
          } else if (bet.ResultType === 0) {
            winBetAmount += Number(bet.WinLoss);
          }
        }
      }

      // Calculate total P/L for the current month
      const profitLoss = winBetAmount - loseBetAmount;

      // Push data to monthlyPL array
      monthlyPL.push({
        month: startOfMonth.toLocaleString("default", { month: "long" }),
        loseBet: loseBetAmount,
        winBet: winBetAmount,
        totalPL: profitLoss,
      });
    }

    // Reverse the array to get the data in chronological order
    monthlyPL.reverse();

    // Extracting data for losing bets, winning bets, and total P/L
    const loseBetData = monthlyPL.map((item) => item.loseBet.toFixed(2));
    const winBetData = monthlyPL.map((item) => item.winBet.toFixed(2));
    const totalPLData = monthlyPL.map((item) => item.totalPL.toFixed(2));

    res.status(200).json({
      status: 200,
      success: true,
      monthlyPL: monthlyPL,
      graphData: {
        loseBet: loseBetData,
        winBet: winBetData,
        totalPL: totalPLData,
      },
      message: "Profit/Loss data retrieved successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

// Function to format date to match the bet time format
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const meridian = date.getHours() < 12 ? "AM" : "PM";
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${meridian}`;
};

module.exports = {
  GetAllBetUser,
  GetAllBet,
  GetAllBetByParentOfUser,
  GetAllBetOfUserForParent,
  GetAllBetPlForGraph,
};
