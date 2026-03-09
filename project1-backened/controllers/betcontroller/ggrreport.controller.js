const Casino = require("../../models/casino.model");
const User = require("../../models/user.model");
const Deposit = require("../../models/deposit.model");
const Withdraw = require("../../models/withdraw.model");
const Bet = require("../../models/casino.model");
const CalculateDynamicGGR = async (req, res) => {
  try {
    const {
      filter,
      username,
      provider_id,
      game_id,
      start_date,
      currency,
      end_date,
      page,
      limit
    } = req.query;
    let startDate, endDate;
    const modelQuery=req.query.modelQuery
    const query = modelQuery||{};

    // Query filters based on request parameters
    if (game_id) {
      query.$or = [
        { GameId: game_id },
        { GameTypeName: game_id },
        { GameType: game_id },
      ];
    }

    if (provider_id) {
      query.GpId = provider_id;
    }

    if (username) {
      query.Username = username;
    }
    if(currency){
      query.Currency=currency;
    }

    // Determine start and end date based on the filter type
    if (start_date && end_date) {
      startDate = new Date(start_date); // Parse start date from query
      endDate = new Date(end_date); // Parse end date from query
    } else {
      // Set default date range based on the filter type
      switch (filter) {
        case "day":
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0); // Beginning of the day
          endDate = new Date();
          endDate.setHours(23, 59, 59, 999); // End of the day
          break;
        case "week":
          startDate = new Date();
          startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of the week (Sunday)
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End of the week (Saturday)
          endDate.setHours(23, 59, 59, 999);
          break;
        case "this_month":
          startDate = new Date();
          startDate.setDate(1); // First day of the month
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1); // First day of next month
          endDate.setDate(0); // Last day of the current month
          endDate.setHours(23, 59, 59, 999);
          break;
        case "last_month":
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1); // First day of last month
          startDate.setDate(1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setDate(0); // Last day of last month
          endDate.setHours(23, 59, 59, 999);
          break;
        case "last_30_days":
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 29); // 30 days ago
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(); // Current date
          endDate.setHours(23, 59, 59, 999); // End of the day
          break;
        case "yesterday":
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 1); // Yesterday
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setDate(endDate.getDate() - 1); // Yesterday
          endDate.setHours(23, 59, 59, 999);
          break;
        default:
          // Default to calculate GGR for the entire dataset
          startDate = new Date(0); // Beginning of time
          endDate = new Date(); // Current date
          break;
      }
    }

    // Fetch records count from the database based on query filters and date range
    const count = await Casino.countDocuments({
      ...query,
      BetTime: { $gte: startDate.toISOString(), $lt: endDate.toISOString() }, // Use ISO string format
    })

    // Pagination parameters
    const currentPage = parseInt(page) || 1;
    const limitPerPage = parseInt(limit) || 10;
    const totalPages = Math.ceil(count / limitPerPage);
    const skip = (currentPage - 1) * limitPerPage;

    // Fetch records based on query filters, date range, and pagination
    const records = await Casino.find({
      ...query,
      BetTime: { $gte: startDate.toISOString(), $lt: endDate.toISOString() }, // Use ISO string format
    }).sort({BetTime:-1}).skip(skip).limit(limitPerPage);

    // Calculate GGR for each time interval based on the filter type
    let graphData = [];
    switch (filter) {
      case "day":
        for (let i = 0; i < 24; i++) {
          const hourStart = new Date(startDate);
          hourStart.setHours(i, 0, 0, 0);
          const hourEnd = new Date(hourStart);
          hourEnd.setHours(i + 1, 0, 0, 0);
          const ggrForHour = calculateGGRForTimeRange(
            records,
            hourStart,
            hourEnd
          );
          graphData.push({ time: formatDate(hourStart), ggr: ggrForHour });
        }
        break;
      case "week":
        for (let i = 0; i < 7; i++) {
          const dayStart = new Date(startDate);
          dayStart.setDate(startDate.getDate() + i);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(dayStart);
          dayEnd.setDate(dayStart.getDate() + 1);
          dayEnd.setHours(0, 0, 0, 0);
          const ggrForDay = calculateGGRForTimeRange(records, dayStart, dayEnd);
          graphData.push({ time: formatDate(dayStart), ggr: ggrForDay });
        }
        break;
      default:
        const ggrForPeriod = calculateGGRForTimeRange(
          records,
          startDate,
          endDate
        );
        graphData.push({ time: formatDate(startDate), ggr: ggrForPeriod });
        break;
    }

    res.status(200).json({
      status: 200,
      success: true,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      records: records,
      pagination: {
        currentPage: currentPage,
        totalPages: totalPages,
        totalItems: count,
        limit: limitPerPage,
      },
      graphData: graphData,
    });
  } catch (error) {
    console.error("Error calculating dynamic GGR:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};


// Format date function
const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return date.toLocaleString("en-US", options);
};

// Calculate GGR for a specific time range
const calculateGGRForTimeRange = (records, startTime, endTime) => {
  let totalGGR = 0;
  records.forEach((record) => {
      const amount = Number(record.Amount);
      const winLoss = parseFloat(record.WinLoss);
      totalGGR += amount - winLoss;
  });
  return Number(totalGGR).toFixed(2); // Round to 2 decimal places
};
// Function to parse BetTime format
const parseBetTime = (betTimeString) => {
  if (!betTimeString) {
    throw new Error("Invalid bet time string");
  }

  // Splitting the string into date and time parts
  const [datePart, timePart] = betTimeString.split(" ");
  const [year, month, day] = datePart.split("-");
  let [hours, minutes, seconds] = timePart.split(":");

  // Parsing PM time
  if (timePart.includes("PM")) {
    hours = (parseInt(hours, 10) + 12).toString(); // Convert to 24-hour format
  }

  // Creating and returning the Date object
  return new Date(year, month - 1, day, hours, minutes, seconds);
};
const GetPlayerStats = async (req, res) => {
  try {
    
    const { start_date, end_date, filter } = req.query;
    let startDate = start_date ? new Date(start_date) : new Date();
    let endDate = end_date ? new Date(end_date) : new Date();
    const modelQuery=req.query.modelQuery
    let query =modelQuery;
    // Parse start and end date from query or set default date range based on the filter type
    switch (filter) {
      case "by_date":
        if (!start_date.includes(":")) {
          startDate.setHours(12, 0, 0, 0);
        }
        if (!end_date.includes(":")) {
          endDate.setHours(12, 0, 0, 0);
        }
        break;
      case "week":
        startDate = getStartOfWeek(new Date());
        endDate = getEndOfWeek(new Date());
        break;
      case "this_month":
        startDate.setDate(1);
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1, 0);
        break;
      case "last_month":
        startDate.setDate(1);
        startDate.setMonth(startDate.getMonth() - 1);
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1, 0);
        break;
      default: {
      }
    }

    // Format start and end date strings in the required format
    const start = startDate.toISOString();
    const end = endDate.toISOString();
    // Fetch bets, deposits, and withdrawals within the specified date range
    const [allBets, allDeposits, allWithdraws] = await Promise.all([
      Bet.find({ BetTime: { $gte: start, $lte: end },...query }).exec(),
      Deposit.find({ initiated_at: { $gte: start, $lte: end },...query  }).exec(),
      Withdraw.find({
        initiated_at: { $gte: start, $lte: end  },
        ...query
      }).exec(),
    ]);
    // Calculate user amount
    const userAmount = await User.aggregate([
      { $match: { joined_at: { $gte: start, $lte: end},...query  } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]).exec();

    // Calculate GGR for the entire period
    const records = await Bet.find({
      ResultType: { $in: [0, 1] },
      BetTime: { $gte: start, $lt: end },
    });
    const ggrForPeriod = calculateGGRForTimeRange(records, startDate, endDate);

    // Calculate deposit count and amount
    const depositCount = allDeposits.length;
    const depositAmount = allDeposits.reduce(
      (total, deposit) => total + deposit.deposit_amount,
      0
    );

    // Calculate withdrawal amounts
    const pendingWithdrawAmount = allWithdraws.reduce(
      (total, w) =>
        w.status === "pending" ? total + w.withdraw_amount : total,
      0
    );
    const approvedWithdrawAmount = allWithdraws.reduce(
      (total, w) =>
        w.status === "approved" ? total + w.withdraw_amount : total,
      0
    );

    // Calculate wins amount
    const wins = allBets.filter((bet) => bet.ResultType === 0);
    const winsAmount = wins.reduce(
      (total, bet) => total + Number(bet.WinLoss),
      0
    );
    res.status(200).json({
      userAmount: userAmount && userAmount.length > 0 ? Number(userAmount[0].total.toFixed(2)) : 0,
      pendingWithdrawAmount: Number(pendingWithdrawAmount.toFixed(2)),
      approvedWithdrawAmount: Number(approvedWithdrawAmount.toFixed(2)),
      winsAmount: Number(winsAmount.toFixed(2)),
      depositCount: depositCount,
      depositAmount: Number(depositAmount.toFixed()),
      gameGGR: Number(ggrForPeriod)
    });
  } catch (error) {
    console.error("Error calculating player stats:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};


// Function to get the start of the week
const getStartOfWeek = (date) => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek;
};

// Function to get the end of the week
const getEndOfWeek = (date) => {
  const endOfWeek = new Date(date);
  endOfWeek.setDate(date.getDate() + (6 - date.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
};



const GetGGRReportForDownload = async (req, res) => {
  try {
    const {
      filter,
      username,
      provider_id,
      game_id,
      start_date,
      currency,
      end_date,
    } = req.query;
    let startDate, endDate;
    const modelQuery=req.query.modelQuery
    let query = modelQuery;
    // Query filters based on request parameters
    if (game_id) {
      query.$or = [
        { GameId: game_id },
        { GameTypeName: game_id },
        { GameType: game_id },
      ];
    }

    if (provider_id) {
      query.GpId = provider_id;
    }

    if (username) {
      query.Username = username;
    }
    if (currency) {
      query.Currency = currency;
    }

    // Determine start and end date based on the filter type
    if (start_date && end_date) {
      startDate = new Date(start_date); // Parse start date from query
      endDate = new Date(end_date); // Parse end date from query
    } else {
      // Set default date range based on the filter type
      switch (filter) {
        case "day":
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0); // Beginning of the day
          endDate = new Date();
          endDate.setHours(23, 59, 59, 999); // End of the day
          break;
        case "week":
          startDate = new Date();
          startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of the week (Sunday)
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End of the week (Saturday)
          endDate.setHours(23, 59, 59, 999);
          break;
        case "this_month":
          startDate = new Date();
          startDate.setDate(1); // First day of the month
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1); // First day of next month
          endDate.setDate(0); // Last day of the current month
          endDate.setHours(23, 59, 59, 999);
          break;
        case "last_month":
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1); // First day of last month
          startDate.setDate(1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setDate(0); // Last day of last month
          endDate.setHours(23, 59, 59, 999);
          break;
        case "last_30_days":
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 29); // 30 days ago
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(); // Current date
          endDate.setHours(23, 59, 59, 999); // End of the day
          break;
        case "yesterday":
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 1); // Yesterday
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date();
          endDate.setDate(endDate.getDate() - 1); // Yesterday
          endDate.setHours(23, 59, 59, 999);
          break;
        default:
          // Default to calculate GGR for the entire dataset
          startDate = new Date(0); // Beginning of time
          endDate = new Date(); // Current date
          break;
      }
    }

    // Fetch all records from the database based on query filters and date range
    const records = await Casino.find({
      ...query,
      BetTime: { $gte: startDate.toISOString(), $lt: endDate.toISOString() }, // Use ISO string format
    }).sort({BetTime:-1});

    // Calculate GGR for each time interval based on the filter type
    let graphData = [];
    switch (filter) {
      case "day":
        for (let i = 0; i < 24; i++) {
          const hourStart = new Date(startDate);
          hourStart.setHours(i, 0, 0, 0);
          const hourEnd = new Date(hourStart);
          hourEnd.setHours(i + 1, 0, 0, 0);
          const ggrForHour = calculateGGRForTimeRange(
            records,
            hourStart,
            hourEnd
          );
          graphData.push({ time: formatDate(hourStart), ggr: ggrForHour });
        }
        break;
      case "week":
        for (let i = 0; i < 7; i++) {
          const dayStart = new Date(startDate);
          dayStart.setDate(startDate.getDate() + i);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(dayStart);
          dayEnd.setDate(dayStart.getDate() + 1);
          dayEnd.setHours(0, 0, 0, 0);
          const ggrForDay = calculateGGRForTimeRange(records, dayStart, dayEnd);
          graphData.push({ time: formatDate(dayStart), ggr: ggrForDay });
        }
        break;
      default:
        const ggrForPeriod = calculateGGRForTimeRange(
          records,
          startDate,
          endDate
        );
        graphData.push({ time: formatDate(startDate), ggr: ggrForPeriod });
        break;
    }
    res.status(200).json({
      status: 200,
      success: true,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      data: records,
      graphData: graphData,
    });
  } catch (error) {
    console.error("Error calculating dynamic GGR:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};




module.exports = { CalculateDynamicGGR, GetPlayerStats, GetGGRReportForDownload };
