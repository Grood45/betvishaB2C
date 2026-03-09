const WithdrawModel = require("../../models/withdraw.model");
const DepositModel = require("../../models/deposit.model");
const { v4: uuidv4 } = require("uuid");
const Admin = require("../../models/admin.model");
const User = require("../../models/user.model");
const { GetCurrentTime } = require("../../utils/GetCurrentTime");
const { VerifyJwt } = require("../../utils/VerifyJwt");
const TransactionIdGenerator = require("../../utils/TransactionIdGenerator");
const { CalculateAmount } = require("../../utils/CalculateAmount");
const BonusHistory = require("../../models/bonushistory.model");
const { default: mongoose } = require("mongoose");
const CalculateAndAdjustUserWager = require("../../utils/Promotion/CalculateAndAdjustUserWager");
const { ApprovedBonusAdded } = require("../../utils/Promotion/AddBonusToUser");
const processGraphData = require("../../utils/processGraphData");

const GetAllWithdrawTransaction = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", transaction_type } = req.query;
    const skip = (page - 1) * limit;
    const modelQuery = req.query.modelQuery
    let query = { ...modelQuery };
    let withdraw = [];
    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { withdraw_amount: { $regex: search.toString(), $options: "i" } },
        ],
      };
    }

    if (transaction_type == "all") {
      withdraw = await WithdrawModel.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ initiated_at: -1 });
    } else if (transaction_type == "pending") {
      (query.status = "pending"),
        (withdraw = await WithdrawModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    } else if (transaction_type == "reject") {
      (query.status = "reject"),
        (withdraw = await WithdrawModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    } else if (transaction_type == "approved") {
      (query.status = "approved"),
        (withdraw = await WithdrawModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    }
    const allTransaction = await WithdrawModel.countDocuments();
    const approvedTransaction = await WithdrawModel.countDocuments({
      status: "approved",
    });
    const pendingTransaction = await WithdrawModel.countDocuments({
      status: "pending",
    });
    const rejectTransaction = await WithdrawModel.countDocuments({
      status: "reject",
    });
    const totalPages = Math.ceil(withdraw.length / limit);
    const pagination = {
      totalWithdrawal: withdraw.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    const allWithdraw =
      (await WithdrawModel.find({ status: "approved" })) || [];
    let totalWithdrawAmount = 0;

    for (i = 0; i < allWithdraw.length; i++) {
      totalWithdrawAmount += allWithdraw[i].withdraw_amount;
    }

    function sortByPlacedAt(arr) {
      // Sort the array of objects by the 'placed_at' field
      let ans = arr.sort((a, b) => {
        const dateA = new Date(a.initiated_at).getTime(); // Convert dates to timestamps
        const dateB = new Date(b.initiated_at).getTime();
        return dateB - dateA; // Sort based on timestamps
      });
      return ans;
    }
    withdraw = sortByPlacedAt(withdraw);
    res.status(200).json({
      status: 200,
      success: true,
      data: withdraw,
      total_withdraw_amount: totalWithdrawAmount || 0,
      transactionsCount: {
        approvedTransaction,
        pendingTransaction,
        rejectTransaction,
        allTransaction,
      },
      pagination,
      message: "Withdraw data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllDepositTransaction = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", transaction_type } = req.query;
    const skip = (page - 1) * limit;
    const modelQuery = req.query.modelQuery
    let query = { ...modelQuery };
    let deposit = [];
    if (search) {
      query.$or = [
        { method: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }

    if (transaction_type == "all") {
      deposit = await DepositModel.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ initiated_at: -1 });
      console.log(query, 1);
    } else if (transaction_type == "pending") {
      (query.status = "pending"),
        (deposit = await DepositModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
      console.log(query, 2);
    } else if (transaction_type == "reject") {
      (query.status = "reject"),
        (deposit = await DepositModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
      console.log(query, 3);
    } else if (transaction_type == "approved") {
      (query.status = "approved"),
        (deposit = await DepositModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
      console.log(query, 4);
    }
    const allTransaction = await DepositModel.countDocuments();
    const approvedTransaction = await DepositModel.countDocuments({
      status: "approved",
    });
    const pendingTransaction = await DepositModel.countDocuments({
      status: "pending",
    });
    const rejectTransaction = await DepositModel.countDocuments({
      status: "reject",
    });
    const totalPages = Math.ceil(deposit.length / limit);
    const pagination = {
      totalDeposit: deposit.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    const allDeposit = (await DepositModel.find({ status: "approved" })) || [];
    let totalDepositAmount = 0;

    for (i = 0; i < allDeposit.length; i++) {
      totalDepositAmount += allDeposit[i].deposit_amount;
    }

    function sortByPlacedAt(arr) {
      // Sort the array of objects by the 'placed_at' field
      let ans = arr.sort((a, b) => {
        const dateA = new Date(a.initiated_at).getTime(); // Convert dates to timestamps
        const dateB = new Date(b.initiated_at).getTime();
        return dateB - dateA; // Sort based on timestamps
      });
      return ans;
    }
    deposit = sortByPlacedAt(deposit);

    res.status(200).json({
      status: 200,
      success: true,
      data: deposit,
      total_deposit_amount: totalDepositAmount || 0,
      transactionsCount: {
        approvedTransaction,
        pendingTransaction,
        rejectTransaction,
        allTransaction,
      },
      pagination,
      message: "Deposit data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
    console.log(error);
  }
};

const GetWithdrawByUserId = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", transaction_type } = req.query;
    const { user_id } = req.params;
    const skip = (page - 1) * limit;
    const modelQuery = req.query.modelQuery
    let query = { ...modelQuery };
    let withdraw = [];
    if (search) {
      query = {
        $or: [
          { withdraw_amount: { $regex: search, $options: "i" } },
          { withdraw_amount: { $regex: search.toString(), $options: "i" } },
        ],
      };
    }
    query.user_id = user_id;
    if (transaction_type == "all") {
      withdraw = await WithdrawModel.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ initiated_at: -1 });
    } else if (transaction_type == "pending") {
      (query.status = "pending"),
        (withdraw = await WithdrawModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    } else if (transaction_type == "reject") {
      (query.status = "reject"),
        (withdraw = await WithdrawModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    } else if (transaction_type == "approved") {
      (query.status = "approved"),
        (withdraw = await WithdrawModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    }
    const allTransaction = await WithdrawModel.countDocuments({ user_id });
    const approvedTransaction = await WithdrawModel.countDocuments({
      status: "approved",
      user_id,
    });
    const pendingTransaction = await WithdrawModel.countDocuments({
      status: "pending",
      user_id,
    });
    const rejectTransaction = await WithdrawModel.find({
      status: "reject",
      user_id,
    });

    const allTransactions = await WithdrawModel.find({ user_id });

    // Calculate total withdraw amounts for different statuses
    let allAmount = 0;
    let approvedAmount = 0;
    let pendingAmount = 0;
    let rejectAmount = 0;

    allTransactions.forEach((transaction) => {
      if (transaction.status === "approved") {
        approvedAmount += transaction.withdraw_amount;
      } else if (transaction.status === "pending") {
        pendingAmount += transaction.withdraw_amount;
      } else if (transaction.status === "reject") {
        rejectAmount += transaction.withdraw_amount;
      }

      // Calculate total amount regardless of status
      allAmount += transaction.withdraw_amount;
    });

    const totalPages = Math.ceil(withdraw.length / limit);
    const pagination = {
      totalWithdrawal: withdraw.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    res.status(200).json({
      status: 200,
      success: true,
      data: withdraw,
      transactionsCount: {
        approvedTransaction,
        pendingTransaction,
        rejectTransaction,
        allTransaction,
      },
      transactionAmount: {
        allAmount,
        approvedAmount,
        pendingAmount,
        rejectAmount,
      },
      pagination,
      message: "Withdraw data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetDepositByUserId = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", transaction_type } = req.query;
    const {
      user_id,
      parent_admin_id,
      parent_admin_role_type,
      parent_admin_username,
    } = req.params;
    const skip = (page - 1) * limit;
    const modelQuery = req.query.modelQuery
    let query = { ...modelQuery };
    let deposit = [];
    if (search) {
      query = {
        $or: [
          { deposit_amount: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
        ],
      };
    }
    query.user_id = user_id;
    if (parent_admin_id && parent_admin_role_type && parent_admin_username) {
      query.parent_admin_id = parent_admin_id;
      query.parent_admin_username = parent_admin_username;
      query.parent_admin_role_type = parent_admin_role_type;
    }
    if (transaction_type == "all") {
      deposit = await DepositModel.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ initiated_at: -1 });
    } else if (transaction_type == "pending") {
      (query.status = "pending"),
        (deposit = await DepositModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    } else if (transaction_type == "reject") {
      (query.status = "reject"),
        (deposit = await DepositModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    } else if (transaction_type == "approved") {
      (query.status = "approved"),
        (deposit = await DepositModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    }
    const allTransaction = await WithdrawModel.countDocuments({ user_id });

    const approvedTransaction = await DepositModel.countDocuments({
      status: "approved",
      user_id,
    });
    const pendingTransaction = await DepositModel.countDocuments({
      status: "pending",
      user_id,
    });
    const rejectTransaction = await DepositModel.countDocuments({
      status: "reject",
      user_id,
    });

    const allTransactions = await DepositModel.find({ user_id });

    // Calculate total withdraw amounts for different statuses
    let allAmount = 0;
    let approvedAmount = 0;
    let pendingAmount = 0;
    let rejectAmount = 0;

    allTransactions.forEach((transaction) => {
      if (transaction.status === "approved") {
        approvedAmount += transaction.deposit_amount;
      } else if (transaction.status === "pending") {
        pendingAmount += transaction.deposit_amount;
      } else if (transaction.status === "reject") {
        rejectAmount += transaction.deposit_amount;
      }

      // Calculate total amount regardless of status
      allAmount += transaction.deposit_amount;
    });

    const totalPages = Math.ceil(deposit.length / limit);
    const pagination = {
      totalDeposit: deposit.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    res.status(200).json({
      status: 200,
      success: true,
      data: deposit,
      transactionsCount: {
        approvedTransaction,
        pendingTransaction,
        rejectTransaction,
        allTransaction,
      },
      transactionAmount: {
        allAmount,
        approvedAmount,
        pendingAmount,
        rejectAmount,
      },
      pagination,
      message: "Deposit data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const CreateDepositTransaction = async (req, res) => {
  const modelQuery = req.query.modelQuery
  try {
    // Create a new RulesRegulation document with data from the request body
    let payload = {
      ...req.body,
      ...modelQuery,
      initiated_at: GetCurrentTime(),
      transaction_id: TransactionIdGenerator(),
    };
    const { deposit_amount } = req.body;
    const previousResult = await DepositModel.findOne({
      user_id: payload.user_id,
      status: "pending",
    });

    if (previousResult) {
      return res.status(500).json({
        status: 500,
        success: true,
        message: "Previous deposit request not completed.",
      });
    }
    const user = await User.findOne({
      user_id: payload.user_id,
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: true,
        message: "User not found.",
      });
    }
    const data = Admin.findOne({
      admin_id: user.parent_admin_id,
      role_type: user.parent_admin_role_type,
      username: user.parent_admin_username,
    });

    if (!data) {
      if (!data) {
        return res.status(404).json({
          status: 404,
          success: true,
          message: "Admin not found.",
        });
      }
    }
    if (deposit_amount > data.amount) {
      return res.status(500).json({
        status: 500,
        success: true,
        message: "insufficient balance.",
      });
    }

    payload = {
      ...payload,
      parent_admin_id: user.parent_admin_id,
      parent_admin_role_type: user.parent_admin_role_type,
      parent_admin_username: user.parent_admin_username,
    };
    const deposit = new DepositModel(payload);
    // Save the document to the database
    const depositData = await deposit.save();
    res.status(201).json({
      status: 201,
      success: true,
      data: depositData,
      message: "Deposit request placed successfully.",
    });
  } catch (error) {
    console.error("Error adding deposit:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const CreateWithdrawTransaction = async (req, res) => {
  try {
    let payload = {
      ...req.body,
      initiated_at: GetCurrentTime(),
      transaction_id: TransactionIdGenerator(),
    };
    // console.log(payload);
    // Create a new RulesRegulation document with data from the request body
    const previousResult = await WithdrawModel.findOne({
      user_id: payload.user_id,
      status: "pending",
    });

    if (previousResult) {
      return res.status(500).json({
        status: 500,
        success: true,
        message: "Previous withdraw request not completed.",
      });
    }
    const user = await User.findOne({
      user_id: payload.user_id,
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: true,
        message: "User not found.",
      });
    }
    if (user.is_withdraw_suspend) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Withdrawal suspended. Please contact admin.",
      });
    }

    if (payload.withdraw_amount > user.amount) {
      return res.status(500).json({
        status: 500,
        success: true,
        message: "insufficient balance.",
      });
    }

    const results = await WithdrawModel.find({
      user_id: payload.user_id,
      status: "approved",
    });

    // Filter the results based on the initiated_at field within your application
    const filteredResults = results.filter((item) => {
      // Assuming initiated_at is a string in the format "YYYY-MM-DD hh:mm A/PM"
      const currentDate = new Date();
      const itemDate = new Date(item.initiated_at); // Convert the string to a Date object

      // Compare the dates (you might need to handle timezone differences)
      return (
        itemDate.getFullYear() === currentDate.getFullYear() &&
        itemDate.getMonth() === currentDate.getMonth() &&
        itemDate.getDate() === currentDate.getDate()
      );
    });

    let withdrawAmount = 0;
    for (let d = 0; d < filteredResults.length; d++) {
      withdrawAmount += filteredResults[d].withdraw_amount;
    }
    let after_amount = withdrawAmount + payload.withdraw_amount;
    if (after_amount > user.max_limit) {
      return res.status(500).json({
        status: 500,
        success: true,
        message: "Today limit exceed.",
      });
    }
    payload = {
      ...payload,
      parent_admin_id: user.parent_admin_id,
      parent_admin_role_type: user.parent_admin_role_type,
      parent_admin_username: user.parent_admin_username,
    };
    const withdraw = new WithdrawModel(payload);
    // Save the document to the database
    const withdrawData = await withdraw.save();

    res.status(201).json({
      status: 201,
      success: true,
      data: withdrawData,
      message: "Withdraw request placed successfully.",
    });
  } catch (error) {
    console.error("Error adding Withdraw:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

async function GetTransactionsByUserId(req, res) {
  const user_id = req.params.user_id; // Assuming userId is a route parameter
  const page = req.query.page || 1; // Current page number from query parameter, default to 1 if not provided
  const pageSize = req.query.pageSize || 20; // Number of items per page from query parameter, default to 10 if not provided

  try {
    // Find deposits and withdrawals for the given user_id
    const deposits = await DepositModel.find({ user_id });
    const withdrawals = await WithdrawModel.find({ user_id });

    // Merge and sort the transactions by initiated_at in descending order (newest first)
    const allTransactions = [...deposits, ...withdrawals].sort((a, b) => {
      const dateA = new Date(a.initiated_at).getTime(); // Convert dates to timestamps
      const dateB = new Date(b.initiated_at).getTime();

      return dateB - dateA; // Sort based on timestamps
    });

    // Apply pagination using limit and offset
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTransactions = allTransactions.slice(startIndex, endIndex);

    // Calculate total pages
    const totalPages = Math.ceil(allTransactions.length / pageSize);

    // Prepare pagination details
    const pagination = {
      totalTransactions: allTransactions.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(pageSize),
    };

    // Send the response with transactions and pagination details
    res.status(200).json({
      status: 200,
      success: true,
      message: "Transactions retrieved successfully.",
      data: paginatedTransactions,
      pagination: pagination,
    });
  } catch (error) {
    // Handle errors, log them, or return an appropriate response
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Error fetching transactions.",
      error: error.message,
    });
  }
};

async function GetDepositById(req, res) {
  const _id = req.params._id; // Assuming userId is a route parameter
  const modelQuery = req.query.modelQuery
  let query = { ...modelQuery };
  try {
    // Find deposits and withdrawals for the given user_id
    const deposit = await DepositModel.findOne({ _id: _id, ...query });
    // Send the response with transactions and pagination details
    if (!deposit) {
      return res.status(404).json({
        status: 404,
        success: true,
        message: "Transactions not found.",
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: "Transactions retrieved successfully.",
      data: deposit,
    });
  } catch (error) {
    // Handle errors, log them, or return an appropriate response
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

async function GetWithdrawById(req, res) {
  const _id = req.params._id; // Assuming userId is a route parameter
  try {
    // Find deposits and withdrawals for the given user_id
    const deposit = await WithdrawModel.findOne({ _id: _id });
    // Send the response with transactions and pagination details
    if (!deposit) {
      return res.status(404).json({
        status: 404,
        success: true,
        message: "Transactions not found.",
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: "Transactions retrieved successfully.",
      data: deposit,
    });
  } catch (error) {
    // Handle errors, log them, or return an appropriate response
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const UpdateWithdrawById = async (req, res) => {
  const _id = req.params._id; // Assuming userId is a route parameter
  const { status, approved_by_username, approved_by_admin_id, approved_by_role_type } = req.body;
  const withdraw_status = { status, approved_by_username, approved_by_admin_id, approved_by_role_type };

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the withdrawal by ID
    const withdrawData = await WithdrawModel.findOne({ _id }).session(session);
    if (!withdrawData) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Transaction not found.",
      });
    }

    if (withdrawData.status !== "pending") {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Transaction is not pending.",
      });
    }

    if (status === "reject") {
      const withdraw = await WithdrawModel.findOneAndUpdate(
        { _id },
        withdraw_status,
        { new: true, session }
      );
      await session.commitTransaction();
      session.endSession();
      return res.status(200).json({
        status: 200,
        success: true,
        data: withdraw,
        message: "Transaction rejected successfully.",
      });
    } else if (status === "approved") {
      const user_id = withdrawData.user_id;
      const user = await User.findOne({ user_id }).session(session);
      if (!user) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          status: 404,
          success: false,
          message: "User not found.",
        });
      }

      const userAmount = user.amount;

      // Calculate and adjust user wager
      // await CalculateAndAdjustUserWager(user.username, withdrawData.withdraw_amount);

      if (userAmount < withdrawData.withdraw_amount) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Insufficient balance.",
        });
      }

      const withdraw = await WithdrawModel.findOneAndUpdate(
        { _id },
        withdraw_status,
        { new: true, session }
      );

      const final_amount = user.amount - withdrawData.withdraw_amount;

      // Update user's amount
      const updatedUser = await User.findOneAndUpdate(
        { user_id },
        { amount: final_amount },
        { new: true, session }
      );

      // Update parent admin's amount
      const updatedAdmin = await Admin.findOneAndUpdate(
        {
          admin_id: user.parent_admin_id,
          username: user.parent_admin_username,
        },
        { $inc: { amount: withdrawData.withdraw_amount } },
        { new: true, session }
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Transaction approved successfully.",
        data: withdraw,
        updatedAdmin,
      });
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid status.",
      });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error updating transaction:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Error updating transaction.",
    });
  }
};

const MarkAllBonusHistory = async (role_type, username) => {
  try {
    // Update all bonus history entries where the username and role_type match

    const updatedBonusHistory = await BonusHistory.updateMany(
      {
        role_type: role_type,
        username: username,
      },
      { $set: { is_wagered: true } }
    );
    const allBonus = await DepositModel.updateMany(
      { username: username, is_wagered: false, role_type: role_type },
      { is_wagered: true }
    );
    return updatedBonusHistory;
  } catch (error) {
    // Handle error
    console.error("Error marking bonus history:", error);
    throw error;
  }
};

async function UpdateDepositById(req, res) {
  const _id = req.params._id; // Assuming the deposit ID is a route parameter
  const { status, approved_by_username, approved_by_admin_id, approved_by_role_type } = req.body;
  const deposit_status = { status, approved_by_username, approved_by_admin_id, approved_by_role_type };
  const modelQuery = req.query.modelQuery;
  const query = { ...modelQuery, _id };

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the deposit record by ID and other query conditions within the transaction session
    const depositData = await DepositModel.findOne(query).session(session);

    if (!depositData) {
      await session.abortTransaction();
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Deposit not found.",
      });
    }

    // Check if the deposit is still pending
    if (depositData.status !== "pending") {
      await session.abortTransaction();
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Not authorized.",
      });
    }

    // Handle rejection of the deposit
    if (status === "reject") {
      const deposit = await DepositModel.findOneAndUpdate(
        query,
        deposit_status,
        { new: true, session }
      );
      await session.commitTransaction();
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Deposit rejected successfully.",
        data: deposit,
      });
    }

    // Handle approval of the deposit
    const user_id = depositData.user_id;
    const user = await User.findOne({ user_id }).session(session);

    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    // Calculate the final deposit amount including any bonuses
    const bonus = Number(depositData.bonus) || 0;
    const deposit_amount = Number(depositData.deposit_amount);
    const final_deposit_amount = bonus > 0 ? (deposit_amount * (1 + bonus / 100)) : deposit_amount;

    // Check if the admin has sufficient balance
    const updatedAdmin = await Admin.findOne({
      admin_id: user.parent_admin_id,
      username: user.parent_admin_username,
    }).session(session);

    if (!updatedAdmin) {
      await session.abortTransaction();
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Admin not found.",
      });
    }

    if (updatedAdmin.amount < final_deposit_amount) {
      await session.abortTransaction();
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Insufficient balance.",
      });
    }

    // Update the admin's balance
    updatedAdmin.amount -= final_deposit_amount;
    await updatedAdmin.save({ session });

    // Update the deposit status to approved
    const deposit = await DepositModel.findOneAndUpdate(
      query,
      deposit_status,
      { new: true, session }
    );

    // Handle any bonuses
    const { success, bonusAmount, message } = await ApprovedBonusAdded(user, deposit, session);
    if (!success) {
      throw new Error(message);
    }

    // Update the user's balance
    const updatedUser = await User.findOneAndUpdate(
      { user_id: depositData.user_id },
      {
        $inc: { amount: final_deposit_amount, bonus: bonusAmount > 0 ? bonusAmount : 0 },
      },
      { new: true, session }
    );

    // Commit the transaction and return the response
    await session.commitTransaction();
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Deposit approved successfully.",
      data: deposit,
      updatedAdmin,
      updatedUser,
    });

  } catch (error) {
    // Handle any errors, abort the transaction, and return the error response
    await session.abortTransaction();
    console.error("Error updating deposit:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

async function GetTransactionsPl(req, res) {
  const user_id = req.params.user_id; // Assuming userId is a route parameter
  const page = req.query.page || 1; // Current page number from query parameter, default to 1 if not provided
  const pageSize = req.query.pageSize || 20; // Number of items per page from query parameter, default to 10 if not provided
  const type = req.query.type || 20; // Number of items per page from query parameter, default to 10 if not provided
  const username = req.query.username; // Assuming userId is a route parameter

  try {
    // Find deposits and withdrawals for the given user_id
    const deposits = await DepositModel.aggregate([
      { $match: { user_id, username, status: "approved" } },
      {
        $group: {
          _id: null,
          totalDeposits: { $sum: "$deposit_amount" },
        },
      },
    ]);

    const withdrawals = await WithdrawModel.aggregate([
      { $match: { user_id, username } },
      {
        $group: {
          _id: null,
          totalWithdrawals: { $sum: "$withdraw_amount" },
        },
      },
    ]);
    console.log(username, user_id, type);
    let rest_amount = 0;
    if (type === "user") {
      let user = await User.findOne({ username, user_id });
      if (!user) {
        return res.status(404).json({
          status: 404,
          success: true,
          message: "User not found.",
        });
      }
      rest_amount = Math.abs(user.amount - user.exposure_limit);
    } else {
      let admin = await Admin.findOne({ username, admin_id: user_id });
      if (!admin) {
        return res.status(404).json({
          status: 404,
          success: true,
          message: "Admin not found.",
        });
      }
      rest_amount = admin.amount;
    }
    // Calculate the total amount by subtracting withdrawals from deposits
    const totalDeposits = deposits.length > 0 ? deposits[0].totalDeposits : 0;
    const totalWithdrawals =
      withdrawals.length > 0 ? withdrawals[0].totalWithdrawals : 0;
    const totalAmount = totalWithdrawals - totalDeposits + rest_amount;

    // Now, totalAmount variable holds the total amount for the user

    // Send the response with transactions and pagination details
    res.status(200).json({
      status: 200,
      success: true,
      message: "Amount retrived successfully.",
      totalDeposits,
      totalWithdrawals,
      totalAmount,
    });
  } catch (error) {
    // Handle errors, log them, or return an appropriate response
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Error fetching transactions.",
      error: error.message,
    });
  }
};

async function GetTransactionsPl(req, res) {
  const user_id = req.params.user_id; // Assuming userId is a route parameter
  const type = req.query.type || 20; // Number of items per page from query parameter, default to 10 if not provided
  const username = req.query.username; // Assuming userId is a route parameter
  try {
    // Find deposits and withdrawals for the given user_id
    const deposits = await DepositModel.aggregate([
      { $match: { user_id, username, status: "approved" } },
      {
        $group: {
          _id: null,
          totalDeposits: { $sum: "$deposit_amount" },
        },
      },
    ]);

    const withdrawals = await WithdrawModel.aggregate([
      { $match: { user_id, username } },
      {
        $group: {
          _id: null,
          totalWithdrawals: { $sum: "$withdraw_amount" },
        },
      },
    ]);
    console.log(username, user_id, type);
    let rest_amount = 0;
    if (type === "user") {
      let user = await User.findOne({ username, user_id });
      if (!user) {
        return res.status(404).json({
          status: 404,
          success: true,
          message: "User not found.",
        });
      }
      rest_amount = Math.abs(user.amount);
    } else {
      let admin = await Admin.findOne({ username, admin_id: user_id });
      if (!admin) {
        return res.status(404).json({
          status: 404,
          success: true,
          message: "Admin not found.",
        });
      }
      rest_amount = admin.amount;
    }
    // Calculate the total amount by subtracting withdrawals from deposits
    const totalDeposits = deposits.length > 0 ? deposits[0].totalDeposits : 0;
    const totalWithdrawals =
      withdrawals.length > 0 ? withdrawals[0].totalWithdrawals : 0;
    const totalAmount = totalWithdrawals - totalDeposits + rest_amount;
    // Now, totalAmount variable holds the total amount for the user
    // Send the response with transactions and pagination details
    res.status(200).json({
      status: 200,
      success: true,
      message: "Amount retrived successfully.",
      totalDeposits,
      totalWithdrawals,
      totalAmount,
      casinoAmount: 0,
    });
  } catch (error) {
    // Handle errors, log them, or return an appropriate response
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Error fetching transactions.",
      error: error.message,
    });
  }
};

const GetAllGenerateChipOfOwneradmin = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const { from, to } = req.query; // Extract "from" and "to" dates from query params
  const page = parseInt(req.query.page) || 1; // Get page number from query params, default to 1
  const limit = parseInt(req.query.limit) || 20; // Get limit from query params, default to 10
  const modelQuery = req.query.modelQuery
  if (!token || !usernametoken) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid tokens. Access denied.",
    });
  }
  try {
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);
    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    // Calculate skip value based on pagination
    const skip = (page - 1) * limit;
    let query = {
      username: adminUsername,
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
      ...modelQuery
    };

    // Add date filtering to the query if both "from" and "to" dates are provided
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      // Modify the query to use the parsed Date objects
      query.initiated_at = {
        $gte: fromDate.toISOString(),
        $lte: toDate.toISOString(),
      };
    }
    console.log(query);
    // Fetch withdrawal records with pagination and date filtering
    let depositRecords = await DepositModel.find(query)
      .sort({ initiated_at: -1 })
      .skip(skip)
      .limit(limit);
    let depositCount = await DepositModel.countDocuments(query);
    const totalPages = Math.ceil(depositCount / limit);

    const pagination = {
      totalItems: depositCount,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    function sortByPlacedAt(arr) {
      // Sort the array of objects by the 'initiated_at' field
      let ans = arr.sort((a, b) => {
        const dateA = new Date(a.initiated_at).getTime(); // Convert dates to timestamps
        const dateB = new Date(b.initiated_at).getTime();
        return dateB - dateA; // Sort based on timestamps
      });
      return ans;
    }
    depositRecords = sortByPlacedAt(depositRecords);
    res.status(200).json({
      status: 200,
      success: true,
      data: depositRecords,
      pagination: pagination,
      message: "Deposit records retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllDepositOfSingle = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const page = parseInt(req.query.page) || 1; // Get page number from query params, default to 1
  const limit = parseInt(req.query.limit) || 20; // Get limit from query params, default to 10
  const status = req.query.status;

  if (!token || !usernametoken) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid tokens. Access denied.",
    });
  }
  try {
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);
    // user/admin username need to be passed
    const { username } = req.params;
    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    // Calculate skip value based on pagination
    const skip = (page - 1) * limit;
    let query = {};

    query = {
      username: username,
    };
    if (status) {
      query.status = status;
    }

    // Fetch withdrawal records with pagination
    let depositRecords = await DepositModel.find(query)
      .sort({
        initiated_at: -1,
      })
      .skip(skip)
      .limit(limit);
    let totalDepositCount = await DepositModel.countDocuments(query);
    const pendingTransaction = await DepositModel.countDocuments({
      ...query,
      status: "pending",
    });
    const approvedTransaction = await DepositModel.countDocuments({
      ...query,
      status: "approved",
    });
    const rejectTransaction = await DepositModel.countDocuments({
      ...query,
      status: "reject",
    });
    const totalPages = Math.ceil(totalDepositCount / limit);

    const pagination = {
      totalItems: totalDepositCount,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    function sortByPlacedAt(arr) {
      // Sort the array of objects by the 'placed_at' field
      let ans = arr.sort((a, b) => {
        const dateA = new Date(a.initiated_at).getTime(); // Convert dates to timestamps
        const dateB = new Date(b.initiated_at).getTime();
        return dateB - dateA; // Sort based on timestamps
      });
      return ans;
    }
    depositRecords = sortByPlacedAt(depositRecords);
    res.status(200).json({
      status: 200,
      success: true,
      data: depositRecords,
      transactionsCount: {
        approvedTransaction,
        pendingTransaction,
        rejectTransaction,
        allTransaction: totalDepositCount,
      },
      pagination: pagination,
      message: "Withdraw records retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllWithdrawOfSingle = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const page = parseInt(req.query.page) || 1; // Get page number from query params, default to 1
  const limit = parseInt(req.query.limit) || 20; // Get limit from query params, default to 10
  const status = req.query.status;
  const modelQuery = req.query.modelQuery
  let query = { ...modelQuery };
  if (!token || !usernametoken) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid tokens. Access denied.",
    });
  }
  try {
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);
    // user/admin username need to be passed
    const { username } = req.params;
    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    // Calculate skip value based on pagination
    const skip = (page - 1) * limit;
    let query = {};

    query = {
      username: username,
    };
    if (status) {
      query.status = status;
    }

    // Fetch withdrawal records with pagination
    let withdrawRecords = await WithdrawModel.find(query)
      .sort({
        initiated_at: -1,
      })
      .skip(skip)
      .limit(limit);
    let totalWithdrawCount = await WithdrawModel.countDocuments(query);

    const pendingTransaction = await WithdrawModel.countDocuments({
      ...query,
      status: "pending",
    });
    const approvedTransaction = await WithdrawModel.countDocuments({
      ...query,
      status: "approved",
    });
    const rejectTransaction = await WithdrawModel.countDocuments({
      ...query,
      status: "reject",
    });

    const totalPages = Math.ceil(totalWithdrawCount / limit);

    const pagination = {
      totalItems: totalWithdrawCount,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    function sortByPlacedAt(arr) {
      // Sort the array of objects by the 'placed_at' field
      let ans = arr.sort((a, b) => {
        const dateA = new Date(a.initiated_at).getTime(); // Convert dates to timestamps
        const dateB = new Date(b.initiated_at).getTime();
        return dateB - dateA; // Sort based on timestamps
      });
      return ans;
    }
    withdrawRecords = sortByPlacedAt(withdrawRecords);
    res.status(200).json({
      status: 200,
      success: true,
      data: withdrawRecords,
      transactionsCount: {
        approvedTransaction,
        pendingTransaction,
        rejectTransaction,
        allTransaction: totalWithdrawCount,
      },
      pagination: pagination,
      message: "Withdraw records retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllTransactionOfSingle = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const page = parseInt(req.query.page) || 1; // Get page number from query params, default to 1
  const limit = parseInt(req.query.limit) || 20; // Get limit from query params, default to 10
  const status = req.query.status;
  const modelQuery = req.query.modelQuery
  let query = { ...modelQuery };
  if (!token || !usernametoken) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid tokens. Access denied.",
    });
  }
  try {
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);
    // user/admin username need to be passed
    const { username } = req.params;
    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    if (status) {
      query.status = status;
    }
    query = {
      username: username,
    };
    // Fetch withdrawal records with pagination
    let withdrawTransactions = await WithdrawModel.find(query);
    let depositTransactions = await DepositModel.find(query);
    let withdrawTransactionsRecords = await WithdrawModel.find({
      username: username,
    });
    let depositTransactionsRecords = await DepositModel.find({
      username: username,
    });

    let transactions = [...withdrawTransactions, ...depositTransactions];
    console.log(transactions.length, "length");
    const totalPages = Math.ceil(transactions.length / limit);
    // Filter transactions based on pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const pagination = {
      totalItems: transactions.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };
    function countTransactions(transactions, status) {
      return transactions.filter((transaction) => transaction.status === status)
        .length;
    }
    const records = [
      ...withdrawTransactionsRecords,
      ...depositTransactionsRecords,
    ];
    const transactionsCount = {
      approvedTransaction: countTransactions(records, "approved"),
      pendingTransaction: countTransactions(records, "pending"),
      rejectTransaction: countTransactions(records, "reject"),
      allTransaction: transactions.length,
    };
    function sortByPlacedAt(arr) {
      // Sort the array of objects by the 'placed_at' field
      let ans = arr.sort((a, b) => {
        const dateA = new Date(a.initiated_at).getTime(); // Convert dates to timestamps
        const dateB = new Date(b.initiated_at).getTime();
        return dateB - dateA; // Sort based on timestamps
      });
      return ans;
    }
    let totalTransactions = transactions.slice(startIndex, endIndex);

    res.status(200).json({
      status: 200,
      success: true,
      data: totalTransactions,
      transactionsCount: transactionsCount || {},
      pagination: pagination,
      message: "Transaction records retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

async function GetTransactionsByUserId(req, res) {
  const user_id = req.params.user_id; // Assuming userId is a route parameter
  const page = req.query.page || 1; // Current page number from query parameter, default to 1 if not provided
  const pageSize = req.query.pageSize || 20; // Number of items per page from query parameter, default to 10 if not provided
  const modelQuery = req.query.modelQuery
  try {
    // Find deposits and withdrawals for the given user_id
    const deposits = await DepositModel.find({ user_id }).sort({
      initiated_at: -1,
    });
    const withdrawals = await WithdrawModel.find({ user_id }).sort({
      initiated_at: -1,
    });

    // Merge and sort the transactions by initiated_at in descending order (newest first)
    const allTransactions = [...deposits, ...withdrawals].sort((a, b) => {
      const dateA = new Date(a.initiated_at).getTime(); // Convert dates to timestamps
      const dateB = new Date(b.initiated_at).getTime();

      return dateB - dateA; // Sort based on timestamps
    });

    // Apply pagination using limit and offset
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTransactions = allTransactions.slice(startIndex, endIndex);

    // Calculate total pages
    const totalPages = Math.ceil(allTransactions.length / pageSize);

    // Prepare pagination details
    const pagination = {
      totalTransactions: allTransactions.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(pageSize),
    };

    // Send the response with transactions and pagination details
    res.status(200).json({
      status: 200,
      success: true,
      message: "Transactions retrieved successfully.",
      data: paginatedTransactions,
      pagination: pagination,
    });
  } catch (error) {
    // Handle errors, log them, or return an appropriate response
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Error fetching transactions.",
      error: error.message,
    });
  }
};

const GetAllTransaction = async (req, res) => {
  try {
    const { token, usernametoken } = req.headers;
    const {
      page = 1,
      limit = 10,
      search = "",
      user_type = "all",
      transaction_type,
      status,
    } = req.query;
    const modelQuery = req.query.modelQuery
    let query = { ...modelQuery };

    // Check if tokens are provided
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Verify tokens
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);

    // If tokens are invalid, return unauthorized
    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    // If there's a search query, construct the $or query
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { amount: { $regex: search.toString(), $options: "i" } },
      ];
    }

    // Filter transactions based on user type and admin role
    if (type !== "owneradmin") {
      query = {
        ...query,
        parent_admin_role_type: type,
        parent_admin_username: adminUsername,
      };
    }
    if (user_type !== "all") {
      query.user_type = user_type;
    }
    if (status) {
      query.status = status;
    }
    // If transaction_type is provided, add status to the query
    if (transaction_type && transaction_type !== "all") {
      if (transaction_type === "withdraw") {
        query.type = transaction_type;
      } else if (transaction_type === "deposit") {
        query.type = transaction_type;
      }
    }
    console.log(query, "rurhuh");
    // Fetch all transactions count from WithdrawModel and DepositModel
    const totalWithdrawCount = await WithdrawModel.countDocuments(query);
    const totalDepositCount = await DepositModel.countDocuments(query);
    const pendingWithdrawCount = await WithdrawModel.countDocuments({
      ...query,
      status: "pending",
    });
    const pendingDepositCount = await DepositModel.countDocuments({
      ...query,
      status: "pending",
    });
    const allTransactionCount = totalWithdrawCount + totalDepositCount;
    // Fetch all transactions from WithdrawModel and DepositModel
    const withdrawTransactions = await WithdrawModel.find(query).sort({
      initiated_at: -1,
    });
    const depositTransactions = await DepositModel.find(query).sort({
      initiated_at: -1,
    });

    // Combine both sets of transactions
    let transactions = [...withdrawTransactions, ...depositTransactions];

    // Filter transactions based on pagination
    // Filter transactions based on pagination
    transactions.sort((a, b) => {
      const parseDate = (dateStr) => {
        // Expected format: "YYYY-MM-DD HH:MM:SS AM/PM"
        const [datePart, timePart, ampm] = dateStr.split(' ');
        if (!datePart || !timePart) return 0;

        let [year, month, day] = datePart.split('-').map(Number);
        let [hours, minutes, seconds] = timePart.split(':').map(Number);

        if (ampm === 'PM' && hours !== 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;

        return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
      };

      return parseDate(b.initiated_at) - parseDate(a.initiated_at);
    });
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = parseInt(page) * parseInt(limit);

    transactions = transactions.slice(startIndex, endIndex);

    // Calculate total pages for pagination
    const totalPages = Math.ceil(allTransactionCount / parseInt(limit));

    // Prepare pagination object
    const pagination = {
      totalTransactions: allTransactionCount,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    res.status(200).json({
      status: 200,
      success: true,
      data: transactions,
      pagination,
      transactionCount: {
        pendingDepositCount,
        pendingWithdrawCount,
      },
      message: "Transactions retrieved successfully",
    });
  } catch (error) {
    // Send error response
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllWithdrawAmountForGraph = async (req, res) => {
  try {
    // Fetch transactions from WithdrawModel

    let key = "withdraw_amount";

    const { token, usernametoken } = req.headers;
    const modelQuery = req.query.modelQuery
    let query = { ...modelQuery };
    // Check if tokens are provided
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Verify tokens
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);
    // If tokens are invalid, return unauthorized
    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    let withdrawTransactions = [];
    if (type !== "owneradmin") {
      query = {
        ...query,
        parent_admin_role_type: type,
        parent_admin_username: adminUsername,
      };
      // Fetch transactions from WithdrawModel and DepositModel
      withdrawTransactions = await WithdrawModel.find(query);
    } else {
      // Fetch transactions from WithdrawModel and DepositModel
      key = "deposit_amount";
      withdrawTransactions = await DepositModel.find({
        ...query,
        username: { $ne: adminUsername },
        parent_admin_role_type: type,
        parent_admin_username: adminUsername,
      });
    }
    // Calculate the withdraw amount for the last 12 months
    const currentDate = new Date();
    const lastTwelveMonthsWithdrawAmount = [];

    // Loop through the last 12 months
    for (let i = 0; i < 12; i++) {
      const month = currentDate.getMonth() - i;
      const year = currentDate.getFullYear();
      const monthWithdrawTransactions = withdrawTransactions.filter(
        (transaction) => {
          const transactionDate = new Date(transaction.initiated_at);
          return (
            transactionDate.getMonth() === month &&
            transactionDate.getFullYear() === year
          );
        }
      );
      const monthWithdrawAmount = monthWithdrawTransactions.reduce(
        (total, transaction) => total + transaction[key],
        0
      );
      lastTwelveMonthsWithdrawAmount.push(monthWithdrawAmount);
    }

    // Send response with last 12 months withdraw amount
    res.status(200).json({
      status: 200,
      success: true,
      lastTwelveMonthsWithdrawAmount,
      message: "Withdraw amount for the last 12 months calculated successfully",
    });
  } catch (error) {
    // Send error response
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllDepositAmountForGraph = async (req, res) => {
  try {
    const { token, usernametoken } = req.headers;
    const modelQuery = req.query.modelQuery
    let query = { ...modelQuery };
    // Check if tokens are provided
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Verify tokens
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);
    // If tokens are invalid, return unauthorized
    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    let depositTransactions = [];
    if (type !== "owneradmin") {
      query = {
        ...query,
        parent_admin_role_type: type,
        parent_admin_username: adminUsername,
      };
      // Fetch transactions from WithdrawModel and DepositModel
      depositTransactions = await DepositModel.find(query);
    } else {
      // Fetch transactions from WithdrawModel and DepositModel

      depositTransactions = await DepositModel.find({
        ...query,
        username: adminUsername,
        parent_admin_role_type: type,
        parent_admin_username: adminUsername,
      });
    }

    // Fetch transactions from WithdrawModel
    // Calculate the withdraw amount for the last 12 months
    const currentDate = new Date();
    const lastTwelveMonthsWithdrawAmount = [];

    // Loop through the last 12 months
    for (let i = 0; i < 12; i++) {
      const month = currentDate.getMonth() - i;
      const year = currentDate.getFullYear();
      const monthWithdrawTransactions = depositTransactions.filter(
        (transaction) => {
          const transactionDate = new Date(transaction.initiated_at);
          return (
            transactionDate.getMonth() === month &&
            transactionDate.getFullYear() === year
          );
        }
      );
      const monthWithdrawAmount = monthWithdrawTransactions.reduce(
        (total, transaction) => total + transaction.deposit_amount,
        0
      );
      lastTwelveMonthsWithdrawAmount.push(monthWithdrawAmount);
    }

    // Send response with last 12 months withdraw amount
    res.status(200).json({
      status: 200,
      success: true,
      lastTwelveMonthsWithdrawAmount,
      message: "Withdraw amount for the last 12 months calculated successfully",
    });
  } catch (error) {
    // Send error response
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllTransactionAmountForGraph = async (req, res) => {
  try {

    const modelQuery = req.query.modelQuery
    let query = { ...modelQuery };

    let key1 = "withdraw_amount";
    let key2 = "withdraw_amount";
    let key3 = "withdraw_amount";
    let key4 = "withdraw_amount";
    const { token, usernametoken } = req.headers;
    const { user_type, status, time_frame, start_date, end_date } = req.query;
    if (user_type) {
      query.user_type = user_type;
    }
    if (status) {
      query.status = status;
    }

    // Add date range to query if provided
    if (start_date && end_date) {
      query.initiated_at = {
        $gte: start_date,
        $lte: end_date
      };
    }

    // Check if tokens are provided
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Verify tokens
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);
    // If tokens are invalid, return unauthorized
    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    let withdrawTransactions1 = [];
    let depositTransactions2 = [];

    if (type !== "owneradmin") {
      // Fetch transactions for Lower Admins
      depositTransactions2 = await DepositModel.find({
        ...query,
        parent_admin_role_type: type,
        parent_admin_username: adminUsername,
      });
      withdrawTransactions1 = await WithdrawModel.find({
        ...query,
        parent_admin_role_type: type,
        parent_admin_username: adminUsername,
      });
    } else {
      // Fetch transactions for OwnerAdmin (from lower takeaway)
      depositTransactions2 = await DepositModel.find({
        ...query,
        username: { $ne: adminUsername },
        parent_admin_role_type: type,
        parent_admin_username: adminUsername,
      });

      withdrawTransactions1 = await WithdrawModel.find({
        ...query,
        username: { $ne: adminUsername },
        parent_admin_role_type: type,
        parent_admin_username: adminUsername,
      });
    }

    // Process data using the new utility
    const processedData = processGraphData(
      depositTransactions2,
      withdrawTransactions1,
      time_frame,
      start_date,
      end_date
    );

    // Send response with processed data
    res.status(200).json({
      status: 200,
      success: true,
      labels: processedData.labels,
      deposits: processedData.deposits,
      withdrawals: processedData.withdrawals,
      totalDeposit: processedData.totalDeposit,
      totalWithdrawal: processedData.totalWithdrawal,
      message: "Transaction graph data processed successfully",
    });
  } catch (error) {
    // Send error response
    console.log(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllTransactionAmountAndPl = async (req, res) => {
  try {
    const modelQuery = req.query.modelQuery
    let query = { ...modelQuery };
    console.log(modelQuery, "amamamam Query model")
    const { token, usernametoken } = req.headers;

    // Check if tokens are provided
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Verify tokens
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);

    // If tokens are invalid, return unauthorized
    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    let transactions = [];
    // If the user is owner admin, fetch both withdraw and deposit transactions
    const withdrawTransactions = await WithdrawModel.find({
      ...query,
      username: { $ne: adminUsername },
      parent_admin_role_type: type,
      parent_admin_username: adminUsername,
      status: "approved",
    });

    const depositTransactions = await DepositModel.find({
      ...query,
      username: { $ne: adminUsername },
      parent_admin_role_type: type,
      parent_admin_username: adminUsername,
      status: "approved",
    });
    transactions = [...withdrawTransactions, ...depositTransactions];

    const pendingDepositTransactions = await DepositModel.find({
      ...query,
      username: { $ne: adminUsername },
      parent_admin_role_type: type,
      parent_admin_username: adminUsername,
      status: "pending",
    });

    const pendingWithdrawTransactions = await WithdrawModel.find({
      ...query,
      username: { $ne: adminUsername },
      parent_admin_role_type: type,
      parent_admin_username: adminUsername,
      status: "pending",
    });

    let pendingDepositAmount = 0;
    pendingDepositTransactions.forEach((transaction) => {
      pendingDepositAmount += transaction.deposit_amount;
    });

    console.log("final query")
    // Calculate total pending withdraw amount
    let pendingWithdrawAmount = 0;
    pendingWithdrawTransactions.forEach((transaction) => {
      pendingWithdrawAmount += transaction.withdraw_amount;
    });

    // console.log(withdrawTransactions)

    // Calculate total withdraw amount and total deposit amount
    let totalWithdrawAmount = 0;
    let totalDepositAmount = 0;

    transactions.forEach((transaction) => {
      // if (transaction.hasOwnProperty('withdraw_amount')) {
      if (transaction.type == "withdraw") {
        totalWithdrawAmount += transaction.withdraw_amount;
      }
      // }
      // if (transaction.hasOwnProperty('deposit_amount')) {
      else if (transaction.type == "deposit") {
        totalDepositAmount += transaction.deposit_amount;
      }
      // }
    });

    transactions.forEach((transaction) => {
      if (transaction.hasOwnProperty("withdraw_amount")) {
        totalWithdrawAmount += transaction.withdraw_amount;
      } else if (transaction.hasOwnProperty("deposit_amount")) {
        totalDepositAmount += transaction.deposit_amount;
      }
    });

    // Calculate the profit or loss (PL)
    const totalPL = totalDepositAmount - totalWithdrawAmount;

    // Send response with total amounts and PL
    res.status(200).json({
      status: 200,
      success: true,
      totalWithdrawAmount,
      totalDepositAmount,
      pendingDepositAmount,
      pendingWithdrawAmount,
      totalPL,
      message: "Total withdraw, deposit, and PL calculated successfully",
    });
  } catch (error) {
    // Send error response
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllTransactionAmountAndPlOfAdmin = async (req, res) => {
  try {
    const { token, usernametoken } = req.headers;
    let query = {};
    let key = "withdraw_amount";
    // Check if tokens are provided
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Verify tokens
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);

    // If tokens are invalid, return unauthorized
    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    let transactions = [];
    // If the user is owner admin, fetch both withdraw and deposit transactions
    let withdrawTransactions = [];
    let depositTransactions = [];
    if (type == "owneradmin") {
      key = "deposit_amount";
      let query = {
        username: { $ne: adminUsername },
        parent_admin_username: adminUsername,
        parent_admin_role_type: type,
        status: "approved",
      };
      // Fetch transactions from WithdrawModel and DepositModel
      withdrawTransactions = await DepositModel.find(query);
      let query1 = {
        username: adminUsername,
        parent_admin_username: adminUsername,
        parent_admin_role_type: type,
        status: "approved",
      };
      // Fetch transactions from WithdrawModel and DepositModel
      depositTransactions = await DepositModel.find(query1);
    } else {
      // Fetch transactions from WithdrawModel and DepositModel

      withdrawTransactions = await WithdrawModel.find({
        username: adminUsername,
        // role_type: "admin",
        status: "approved",
      });
      depositTransactions = await DepositModel.find({
        username: adminUsername,
        // role_type: "admin",
        status: "approved",
      });
    }
    // transactions = [...withdrawTransactions, ...depositTransactions];

    let totalWithdrawAmount = 0;
    withdrawTransactions.forEach((transaction) => {
      totalWithdrawAmount += transaction[key];
    });

    // Calculate total pending withdraw amount
    let totalDepositAmount = 0;
    depositTransactions.forEach((transaction) => {
      totalDepositAmount += transaction.deposit_amount;
    });

    // Calculate the profit or loss (PL)
    const totalPL = totalDepositAmount - totalWithdrawAmount;

    // Send response with total amounts and PL
    res.status(200).json({
      status: 200,
      success: true,
      totalWithdrawAmount,
      totalDepositAmount,
      // transactions,
      totalPL,
      message: "Total withdraw, deposit, and PL calculated successfully",
    });
  } catch (error) {
    // Send error response
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

async function GetTransactionsByUserId(req, res) {
  const page = req.query.page || 1; // Current page number from query parameter, default to 1 if not provided
  const pageSize = req.query.pageSize || 20; // Number of items per page from query parameter, default to 20 if not provided
  const type = req.query.type || "all"; // Transaction type filter
  const status = req.query.status; // Transaction status filter
  const { token, usernametoken } = req.headers;
  try {
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const userType = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const userUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    console.log(type, userUsername);
    if (!userUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    // Prepare filter conditions based on type and status
    const filter = { username: userUsername, user_type: userType };
    if (type && type !== "all") {
      filter.type = type;
    }
    if (status) {
      filter.status = status;
    }

    let deposits = [];
    let withdrawals = [];

    if (!type || type === "deposit" || type === "all") {
      // Find deposits for the given user_id based on the filter conditions
      deposits = await DepositModel.find(filter).sort({ initiated_at: -1 });
    }

    if (!type || type === "withdraw" || type === "all") {
      // Find withdrawals for the given user_id based on the filter conditions
      withdrawals = await WithdrawModel.find(filter).sort({ initiated_at: -1 });
    }

    // Merge deposits and withdrawals
    const transactions = [...deposits, ...withdrawals];
    const allTransactions = transactions.sort((a, b) => {
      const dateA = new Date(a.initiated_at).getTime(); // Convert dates to timestamps
      const dateB = new Date(b.initiated_at).getTime();
      return dateB - dateA; // Sort based on timestamps
    });

    // Apply pagination using limit and offset
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTransactions = allTransactions.slice(startIndex, endIndex);

    // Calculate total pages
    const totalPages = Math.ceil(allTransactions.length / pageSize);

    // Prepare pagination details
    const pagination = {
      totalTransactions: allTransactions.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(pageSize),
    };

    // Send the response with transactions and pagination details
    res.status(200).json({
      status: 200,
      success: true,
      message: "Transactions retrieved successfully.",
      data: paginatedTransactions,
      pagination: pagination,
    });
  } catch (error) {
    // Handle errors, log them, or return an appropriate response
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Error fetching transactions.",
      error: error.message,
    });
  }
};

module.exports = {
  GetAllWithdrawTransaction,
  GetAllDepositTransaction,
  GetWithdrawByUserId,
  GetDepositByUserId,
  GetTransactionsByUserId,
  CreateDepositTransaction,
  CreateWithdrawTransaction,
  GetDepositById,
  GetWithdrawById,
  UpdateWithdrawById,
  UpdateDepositById,
  GetTransactionsPl,
  GetAllGenerateChipOfOwneradmin,
  GetAllDepositOfSingle,
  GetAllWithdrawOfSingle,
  GetAllTransactionOfSingle,
  GetAllTransaction,
  GetAllWithdrawAmountForGraph,
  GetAllDepositAmountForGraph,
  GetAllTransactionAmountForGraph,
  GetAllTransactionAmountAndPl,
  GetAllTransactionAmountAndPlOfAdmin,
  GetTransactionsByUserId,
};
