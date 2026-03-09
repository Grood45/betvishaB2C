const { default: mongoose } = require("mongoose");
const Admin = require("../../models/admin.model");
const { v4: uuidv4 } = require("uuid");
const DepositModel = require("../../models/deposit.model");
const User = require("../../models/user.model");
const WithdrawModel = require("../../models/withdraw.model");
const { DecryptPassword } = require("../../utils/DecryptPassword");
const { EncryptPassword } = require("../../utils/EncryptPassword");
const { GenrateJwtToken } = require("../../utils/GenerateJwt");
const { GetCurrentTime } = require("../../utils/GetCurrentTime");
const { VerifyJwt } = require("../../utils/VerifyJwt");
const { sendEmail } = require("../../utils/nodemailer");
const TransactionIdGenerator = require("../../utils/TransactionIdGenerator");
require("dotenv").config();
const { default: axios } = require("axios");
const SaveUserLoginHistory = require("../../middlewares/saveuserloginhistory.middleware");
const { GetAdminLayerPermission } = require("../../utils/GetAdminLayerPermission");
const { GetAgentData } = require("../../utils/GetAgentData/GetAgentData");
const { GetCurrentAndBeforeTime } = require("../../utils/GetCurrentAndBeforeTime");
const GameStructure = require("../../models/gamestructure.model");
const Casino = require("../../models/casino.model");
const { GenerateReferralCode } = require("../../utils/GenerateReferalCode");
const { GetDaysAgoDateTime } = require("../../utils/GetDaysAgoDateTime");

async function AdminLogin(req, res) {
  const { username, password } = req.body; // Assuming you send username and password in the request body

  try {
    // Find the admin by username
    const admin = await Admin.findOne({ username: username });
    if (!admin) {
      // Password is incorrect
      return res.status(200).json({
        status: 200,
        success: false,
        data: {},
        message: "Admin not found",
      });
    }

    if (!admin.is_active) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "You have been blocked, contact admin.",
      });
    }
    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await DecryptPassword(password, admin.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      // Password is incorrect
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid password",
      });
    }

    const typeToken = GenrateJwtToken(admin.role_type); // You need to implement this function
    const usernameToken = GenrateJwtToken(admin.username); // You need to implement this function
    // Send a success response with the token and user data

    if (admin.is_2fa_enabled) {
      res.status(200).json({
        status: 22,
        success: true,
        redirect: "/login",
        message: "Login Process.",
        email: admin.email,
        step: true,
        data: admin,
      });
    }
    else {
      const data = await SaveUserLoginHistory(admin.role_type, admin.username, req, res)
      if (!data.success) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Login failed",
        });
      }
      res.status(200).json({
        status: 23,
        success: true,
        token: typeToken,
        adminLayer: GetAdminLayerPermission(admin.role_type),
        usernameToken: usernameToken,
        redirect: "/admin/dashboard",
        message: "Login successfully",
        data: admin,
      });
    }
    // res.status(200).json({
    //   status: 200,
    //   success: true,
    //   token: typeToken,
    //   adminLayer: GetAdminLayerPermission(admin.role_type),
    //   usernameToken: usernameToken,
    //   redirect: "/admin/dashboard",
    //   message: "Login successfully",
    //   data: admin,
    // });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      status: 500,
      success: false,
      data: null,
      message: error.message,
    });
  }
}

const CreateAdminOrUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { token, usernametoken } = req.headers;
  const modelQuery = req.query.modelQuery
  const site_auth_key = modelQuery?.site_auth_key;

  const {
    password,
    role_type,
    full_name = "",
    username,
    amount = 0,
    parent_admin_id,
    share_percentage,
    email,
    country = "India",
    exposure_limit = 10000,
    daily_max_deposit_limit = 100000,
    daily_max_withdrawal_limit = 50000,
    welcome_bonus = 0,
    deposit_method = "Bank Transfer",
    user_type = "Self Registered",
    kyc_required = true,
    official_user = false,
    admin_notes = "",
    phone,
    currency
  } = req.body;

  if (!token || !usernametoken) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid tokens. Access denied.",
    });
  }
  if (!password || !role_type || !username) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid request body.",
    });
  }

  // Check if agent data is available for the given currency
  const agentData = GetAgentData(currency);
  if (!agentData) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "The specified currency is not supported for registration.",
    });
  }
  try {
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);

    if (!type || !adminUsername) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    const hashedPassword = await EncryptPassword(password);
    const timestamp = GetCurrentTime();
    let newData = {
      username: username,
      full_name: full_name,
      email: email && email.trim() !== "" ? email : undefined,
      password: hashedPassword,
      joined_at: timestamp,
      updated_at: timestamp,
      parent_admin_id: parent_admin_id,
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
      role_type: role_type,
      share_percentage: share_percentage,
      last_seen: timestamp,
      amount: amount,
      exposure_limit: exposure_limit,
      daily_max_deposit_limit,
      daily_max_withdrawal_limit,
      welcome_bonus,
      deposit_method,
      user_type,
      kyc_required,
      official_user,
      admin_notes,
      country,
      currency,
      phone: phone && phone.trim() !== "" ? phone : undefined,
      site_auth_key: site_auth_key,
      referral_code: GenerateReferralCode(username),
      affiliate_code: GenerateReferralCode(username),
      creation_mode: "manual"
    };

    // Clean up undefined fields to allow sparse indexes to work
    Object.keys(newData).forEach(key => {
      if (newData[key] === undefined) {
        delete newData[key];
      }
    });

    if (newData.role_type === "user") {
      let casinoPlayer = {
        Username: username,
        UserGroup: "f",
        Agent: GetAgentData(currency),
        CompanyKey: process.env.COMPANY_KEY,
        ServerId: process.env.SERVER_ID,
      };

      // TODO: DEVELOPER - Casino Registration API is temporarily disabled.
      // API call failed causing user creation to block. Uncomment this block when it's functioning again.
      /*
      let casinoUserData = await axios.post(
        `${process.env.CASINO_BASE_URL}/web-root/restricted/player/register-player.aspx`,
        casinoPlayer
      );
      // await resisterSport(username);

      if (casinoUserData?.data?.error?.msg !== "No Error") {
        await session.abortTransaction();
        await session.endSession();

        return res.status(500).json({
          status: 500,
          success: false,
          data: {},
          message: casinoUserData?.data?.error?.msg,
        });
      }
      */

      newData = { ...newData, user_id: username };
      let data = await Admin.findOne({
        username: adminUsername,
        role_type: type,
      });

      if (data.amount < amount) {
        await session.abortTransaction();
        await session.endSession();

        return res.status(500).json({
          status: 500,
          success: true,
          message: "Insufficient balance.",
        });
      }

      data.user_count += 1;
      data.amount -= amount;
      await data.save();

      const newUser = new User(newData);
      const savedUser = await newUser.save();

      if (amount > 0) {
        const payloadDeposit = {
          method: "manual",
          method_id: "1",
          transaction_id: TransactionIdGenerator(),
          initiated_at: GetCurrentTime(),
          username: savedUser.username,
          user_id: savedUser.user_id,
          deposit_amount: amount,
          status: "approved",
          updated_at: GetCurrentTime(),
          payable: 0,
          after_deposit: amount,
          wallet_amount: 0,
          admin_response: "",
          user_type: "user",
          role_type: savedUser.role_type,
          parent_admin_id: savedUser.parent_admin_id,
          parent_admin_role_type: type,
          parent_admin_username: adminUsername,
          site_auth_key: site_auth_key,
        };

        let depositData = new DepositModel(payloadDeposit);
        await depositData.save();
      }

      await session.commitTransaction();
      await session.endSession();

      const response = {
        status: 201,
        success: true,
        data: savedUser,
        message: "User created successfully.",
      };

      return res.status(201).json(response);
    } else {
      newData = { ...newData, admin_id: username };
      let data = await Admin.findOne({
        username: adminUsername,
        role_type: type,
      });

      if (data.amount < amount) {
        await session.abortTransaction();
        await session.endSession();

        return res.status(500).json({
          status: 500,
          success: true,
          message: "Insufficient balance.",
        });
      }

      data.admin_count += 1;
      data.amount -= amount;
      await data.save();

      const newAdmin = new Admin(newData);
      const savedAdmin = await newAdmin.save();

      if (amount > 0) {
        const payloadDeposit = {
          method: "manual",
          method_id: "1",
          transaction_id: TransactionIdGenerator(),
          initiated_at: GetCurrentTime(),
          username: savedAdmin.username,
          user_id: savedAdmin.admin_id,
          deposit_amount: amount,
          status: "approved",
          updated_at: GetCurrentTime(),
          payable: 0,
          after_deposit: amount,
          wallet_amount: 0,
          admin_response: "",
          user_type: "admin",
          role_type: savedAdmin.role_type,
          parent_admin_id: savedAdmin.parent_admin_id,
          parent_admin_role_type: type,
          parent_admin_username: adminUsername,
          site_auth_key: site_auth_key,
        };

        let depositData = new DepositModel(payloadDeposit);
        await depositData.save();
      }

      await session.commitTransaction();
      await session.endSession();

      const response = {
        status: 201,
        success: true,
        data: savedAdmin,
        message: "Admin created successfully.",
      };

      return res.status(201).json(response);
    }
  } catch (error) {
    console.error("Error creating admin:", error);
    await session.abortTransaction();
    await session.endSession();

    if (error.code === 11000) {
      console.log("Duplicate key error details:", error.keyPattern);
      const status = 400;
      const message = `A ${role_type} with this ${Object.keys(error.keyPattern).join("/")} already exists.`;
      return res.status(status).json({
        status,
        success: false,
        message,
      });
    }
    else {
      return res.status(500).json({
        status: 500,
        success: false,
        message: error.message,
      });
    }
  }
};

const AdminChipCreate = async (req, res) => {
  try {
    const { token, usernametoken } = req.headers;
    console.log(token, usernametoken);
    // console.log(req.headers);
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    const { admin_id } = req.params;
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const username = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    const { new_amount, admin_response } = req.body;
    // Check if tokens are valid
    if (type !== "owneradmin" || !username) {
      return res.status(401).json({
        status: 401,
        success: false,
        error: "Invalid tokens. Access denied.",
      });
    }
    console.log(type, username, admin_id);
    const updatedResult = await Admin.findOneAndUpdate(
      {
        admin_id: admin_id,
        role_type: type,
        username: username,
      },
      { $inc: { amount: new_amount } },
      { new: true }
    );

    if (!updatedResult) {
      return res.status(200).json({
        status: 200,
        success: false,
        data: {},
        message: "Admin not found.",
        // Include any additional data you want to return
      });
    }
    const payload = {
      method: "manual",
      method_id: "1",
      transaction_id: TransactionIdGenerator(),
      initiated_at: GetCurrentTime(),
      username: username,
      user_id: updatedResult.admin_id,
      deposit_amount: new_amount,
      status: "approved",
      updated_at: GetCurrentTime(),
      payable: 0,
      after_deposit: updatedResult.amount,
      wallet_amount: Math.abs(updatedResult.amount - new_amount),
      admin_response: admin_response || "",
      user_type: "admin",
      role_type: updatedResult.role_type,
      parent_admin_id: updatedResult.admin_id,
      parent_admin_role_type: type,
      parent_admin_username: username,
      transaction_type: "chip_creation",
    };
    const deposit = new DepositModel(payload);
    const depositData = await deposit.save();
    return res.status(200).json({
      status: 200,
      success: true,
      data: updatedResult,
      depositData: depositData,
      message: "Chip create successful.",
      // Include any additional data you want to return
    });
  } catch (error) {
    console.error("Error during deposit:", error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const UserChangePassword = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const { password, user_id } = req.body;
  if (!token || !usernametoken) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid tokens. Access denied.",
    });
  }
  try {
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    let query = {};
    if (type !== process.env.OWNER_ROLETYPE) {
      query = {
        ...query,
        parent_admin_role_type: type,
        parent_admin_username: adminUsername,
      };
    }

    // Find the admin in AdminModel
    const user = await User.findOne({
      ...query,
      user_id: user_id,
    });
    if (!user) {
      return res.status(200).json({
        status: 200,
        success: false,
        data: {},
        message: "User not found.",
      });
    }
    // Check if the old password matches the stored password for the admin
    // Update the admin's password with the new one
    const newPasswordHash = await EncryptPassword(password); // Replace with your password hashing logic
    user.password = newPasswordHash;
    // Save the updated admin document
    await user.save();
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};
const AdminChangePassword = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const { password, admin_id } = req.body;
  if (!token || !usernametoken) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid tokens. Access denied.",
    });
  }
  try {
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    console.log(type, adminUsername, "gfhfh");
    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    // Find the admin in AdminModel

    let query = {};
    if (type !== "owneradmin") {
      query = {
        ...query,
        parent_admin_role_type: type,
        parent_admin_username: adminUsername,
      };
    }

    const admin = await Admin.findOne({
      ...query,
      admin_id: admin_id,
    });

    if (!admin) {
      return res.status(200).json({
        status: 200,
        success: false,
        data: {},
        message: "Admin not found.",
      });
    }

    // Check if the old password matches the stored password for the admin
    // Update the admin's password with the new one
    const newPasswordHash = await EncryptPassword(password); // Replace with your password hashing logic
    admin.password = newPasswordHash;
    // Save the updated admin document
    await admin.save();
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllUser = async (req, res) => {
  // from admin
  const { token, usernametoken } = req.headers;
  const { category, search, page = 1, limit = 50, status = "", creation_mode } = req.query;
  const modelQuery = req.query.modelQuery
  const skip = (page - 1) * limit;
  try {
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    // Find the admin in AdminModel
    let allUser = [];
    let query = { ...modelQuery, is_deleted: { $ne: true } };
    if (category == "bet_active") {
      query.bet_supported = false; //false / true
    }

    if (category == "is_active") {
      query.is_blocked = false; //false / true
    }
    if (category == "is_blocked") {
      query.is_blocked = true; //false / true
    }

    if (creation_mode) {
      query.creation_mode = creation_mode;
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { first_name: { $regex: search, $options: "i" } },
          { last_name: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }
    let query1 = {};

    if (category === "no_deposit") {
      // Aggregation to find users with 0 approved deposits
      const pipeline = [
        { $match: query }, // Apply initial filters (search, is_deleted, etc.)
        {
          $lookup: {
            from: "deposits", // Collection name for DepositModel
            localField: "username",
            foreignField: "username",
            as: "user_deposits",
          },
        },
        {
          $addFields: {
            approved_deposit_count: {
              $size: {
                $filter: {
                  input: "$user_deposits",
                  as: "deposit",
                  cond: { $eq: ["$$deposit.status", "approved"] },
                },
              },
            },
          },
        },
        {
          $match: {
            approved_deposit_count: 0,
          },
        },
        { $sort: { joined_at: -1 } },
        {
          $facet: {
            metadata: [{ $count: "total" }],
            data: [{ $skip: skip }, { $limit: parseInt(limit) }],
          },
        },
      ];

      const result = await User.aggregate(pipeline);

      allUser = result[0].data;
      const totalFiltered = result[0].metadata[0] ? result[0].metadata[0].total : 0;

      // Override total/pagination for this specific category
      const totalPages = Math.ceil(totalFiltered / limit);
      const pagination = {
        totalUsers: totalFiltered,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      };

      return res.status(200).json({
        status: 200,
        success: true,
        data: allUser || [],
        userCount: {
          totalUserCount,
          blockUserCount,
          betDeactiveUser,
          activeUserCount,
        },
        pagination,
        message: "User data retrived successfully.",
      });
    }

    allUser = await User.find(query)
      .sort({
        joined_at: -1,
      })
      .skip(skip)
      .limit(limit);
    let totalUserCount = await User.countDocuments(query1);
    let activeUserCount = await User.countDocuments({
      ...query1,
      is_blocked: false,
    });
    let blockUserCount = await User.countDocuments({
      ...query1,
      is_blocked: true,
    });
    let betDeactiveUser = await User.countDocuments({
      ...query1,
      bet_supported: false,
    });

    function sortByPlacedAt(arr) {
      // Sort the array of objects by the 'placed_at' field
      let ans = arr.sort((a, b) => {
        const dateA = new Date(a.joined_at).getTime(); // Convert dates to timestamps
        const dateB = new Date(b.joined_at).getTime();
        return dateB - dateA; // Sort based on timestamps
      });
      return ans;
    }
    allUser = sortByPlacedAt(allUser);
    const user = await User.countDocuments(query);

    const totalPages = Math.ceil(user / limit);

    const pagination = {
      totalUsers: allUser.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };
    return res.status(200).json({
      status: 200,
      success: false,
      data: allUser || [],
      userCount: {
        totalUserCount,
        blockUserCount,
        betDeactiveUser,
        activeUserCount,
        // totalUsers: allUser,
      },
      pagination,
      message: "User data retrived successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

async function GetRecentOnlineUserCount(req, res) {
  const { currentTime, fiveMinutesAgo } = GetCurrentAndBeforeTime()
  const formattedCurrentTime = currentTime
  const formattedFiveMinutesAgo = fiveMinutesAgo
  const { token, usernametoken } = req.headers;
  if (!token || !usernametoken) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid tokens. Access denied.",
    });
  }
  try {
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    const query = {};
    if (type !== process.env.OWNER_ROLETYPE) {
      query = {
        ...query,
        parent_admin_role_type: type,
        parent_admin_username: adminUsername,
      };
    }
    const users = await User.aggregate([
      {
        $match: {
          updated_at: {
            $gte: formattedFiveMinutesAgo,
            $lte: formattedCurrentTime
          },
          ...query
        }
      },
      {
        $count: 'recentUsersCount'
      }
    ]);
    res.status(200).json({
      status: 200,
      success: true,
      data: users[0]?.recentUsersCount || 0,
      message: "Users counted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      data: null,
      message: error.message
    });
  }
}

const GetSingleAdmin = async (req, res) => {
  // from admin
  const { token, usernametoken } = req.headers;
  const { admin_id } = req.params;

  try {
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    // Find the admin in AdminModel
    const admin = await Admin.findOne({
      admin_id,
    });

    if (!admin) {
      return res.status(202).json({
        status: 200,
        success: false,
        data: {},
        message: "Admin not found.",
      });
    }
    return res.status(200).json({
      status: 200,
      success: false,
      data: admin,
      message: "Admin data retrived successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetSingleUser = async (req, res) => {
  // from admin
  const { token, usernametoken } = req.headers;
  const { user_id } = req.params;
  const modelQuery = req.query.modelQuery;
  let query = { ...modelQuery };
  try {
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    if (type !== "owneradmin") {
      query = {
        parent_admin_role_type: type,
        parent_admin_username: adminUsername,
      };
    }
    // Find the admin in AdminModel
    const user = await User.findOne({
      $or: [{ user_id: user_id }, { username: user_id }],
      ...query,
    });

    if (!user) {
      return res.status(200).json({
        status: 200,
        success: false,
        data: {},
        message: "User not found.",
      });
    }
    return res.status(200).json({
      status: 200,
      success: false,
      data: user,
      message: "User data retrived successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const UpdateSingleAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;
    // Find the market document by ID
    const {
      full_name,
      phone,
      state,
      country,
      email,
      share_percentage,
      min_payout,
      max_payout,
      facebook,
      twitter,
      instagram,
      whatsapp_no,
      telegram_no,
      city,
      bank_details = {}, // Ensure bank_details is an object even if undefined
      permissions,
      profile_picture,
      exposure_limit,
      platform_fee,
    } = req.body;

    // Optional destructuring for bank details
    const {
      bank_name,
      bank_holder,
      account_number,
      ifsc_code,
      branch_code,
    } = bank_details;

    const payload = {
      ...(full_name && { full_name }),
      ...(phone && { phone }),
      ...(state && { state }),
      ...(country && { country }),
      ...(email && { email }),
      ...(share_percentage && { share_percentage }),
      ...(min_payout && { min_payout }),
      ...(max_payout && { max_payout }),
      ...(facebook && { facebook }),
      ...(twitter && { twitter }),
      ...(instagram && { instagram }),
      ...(whatsapp_no && { whatsapp_no }),
      ...(telegram_no && { telegram_no }),
      ...(city && { city }),
      ...(Object.keys(bank_details).length > 0 && {
        bank_details: {
          ...(bank_name && { bank_name }),
          ...(bank_holder && { bank_holder }),
          ...(account_number && { account_number }),
          ...(ifsc_code && { ifsc_code }),
          ...(branch_code && { branch_code }),
        },
      }),
      ...(permissions && { permissions }),
      ...(profile_picture && { profile_picture }),
      ...(exposure_limit && { exposure_limit }),
      ...(platform_fee && { platform_fee }),
    };

    const modelQuery = req.query.modelQuery;
    let query = { ...modelQuery, admin_id };
    const admin = await Admin.findOneAndUpdate({ ...query }, payload, {
      new: true,
    });
    if (!admin) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Admin not found plese try again.",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Admin details update successfully",
      data: admin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const AdminSelfResetPassword = async (req, res) => {
  // from admin
  const { token, usernametoken } = req.headers;
  const { newPassword, oldPassword } = req.body;

  try {
    const modelQuery = req.query.modelQuery;
    let query = { ...modelQuery };
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    // Find the admin in AdminModel
    const admin = await Admin.findOne({ username: adminUsername, ...query });
    if (!admin) {
      return res.status(200).json({
        status: 200,
        success: false,
        data: {},
        message: "Admin not found.",
      });
    }
    console.log(admin);

    // Check if the old password matches the stored password for the admin
    const isPasswordValid = await DecryptPassword(oldPassword, admin.password); // Replace with your password comparison logic

    if (!isPasswordValid) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Old password is incorrect.",
      });
    }

    // Update the admin's password with the new one
    const newPasswordHash = await EncryptPassword(newPassword); // Replace with your password hashing logic
    admin.password = newPasswordHash;

    // Save the updated admin documen
    await admin.save();
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllAdmin = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const { search, page = 1, limit = 50 } = req.query;
  const skip = (page - 1) * limit;
  const modelQuery = req.query.modelQuery;
  let query = { ...modelQuery };

  try {
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    const type = await VerifyJwt(token, req, res); // Implement this to verify the admin_id
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Implement this to verify the role_type

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    query = { username: { $ne: adminUsername }, ...query };
    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // if (type !== "owneradmin") {
    //   query.parent_admin_role_type = type;
    //   query.parent_admin_username = adminUsername;
    // }
    const allAdmin = await Admin.find(query)
      .sort({ joined_at: -1 })
      .skip(skip)
      .limit(limit);
    const totalAdminCount = await Admin.countDocuments(query);
    const blockAdminCount = await Admin.countDocuments({ ...query, is_active: false });
    const activeAdminCount = await Admin.countDocuments({ ...query, is_active: true });


    // Handle date format when querying new users (7 days ago)
    const formattedSevenDaysAgo = GetDaysAgoDateTime(7)
    console.log(formattedSevenDaysAgo, "dkdkdys ago")
    const totalUserCount = await User.countDocuments();
    const newUserCount = await User.countDocuments({ joined_at: { $gte: formattedSevenDaysAgo } });
    const verifyUserCount = await User.countDocuments({ email_verified: true, sms_verified: true });
    const totalCasinoBetCount = await Casino.countDocuments();
    const totalPages = Math.ceil(totalAdminCount / limit);

    return res.status(200).json({
      status: 200,
      success: true,
      data: allAdmin || [],
      adminDetailsCount: {
        blockAdminCount,
        activeAdminCount,
      },
      additionalCounts: {
        totalUserCount,
        totalAdminCount,
        newUserCount,
        verifyUserCount,
        totalCasinoBetCount,
      },
      pagination: {
        totalAdmins: totalAdminCount,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
      message: "Admin data retrieved successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "An error occurred.",
    });
  }
};


const ToggleUserStatus = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { name } = req.body;
    // Find the market document by ID
    const user = await User.findOne({ $or: [{ user_id: user_id }, { username: user_id }] });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    user[name] = user[name] == true ? false : true;

    await user.save();

    res.status(200).json({
      status: 200,
      success: true,
      message: "Status toggled successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const ToggleAdminStatus = async (req, res) => {
  try {
    const { admin_id } = req.params;
    const { name } = req.body;
    const modelQuery = req.query.modelQuery;
    let query = { ...modelQuery, admin_id };
    // Find the market document by ID
    const admin = await Admin.findOne(query);
    if (!admin) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Admin not found.",
        data: {},
      });
    }
    admin[name] = admin[name] == true ? false : true;

    await admin.save();

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Status toggled successfully",
      data: admin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

// const DepositAmount = async (req, res) => {
//   try {
//     const modelQuery = req.query.modelQuery;
//     const { token, usernametoken } = req.headers;
//     if (!token || !usernametoken) {
//       return res.status(401).json({
//         status: 401,
//         success: false,
//         message: "Invalid tokens. Access denied.",
//       });
//     }
//     // Validate access token and verify token here
//     const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
//     const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type

//     if (!adminUsername || !type) {
//       return res.status(401).json({
//         status: 401,
//         success: false,
//         message: "Invalid tokens, Access denied.",
//       });
//     }
//     const {
//       username,
//       deposit_amount,
//       admin_response,
//       parent_admin_id,
//       admin_id,
//       user_type,
//       currency,

//     } = req.body;
//     // get single admin
//     const singleAdmin = await Admin.findOne({
//       username: username,
//       // parent_admin_username: adminUsername,
//       // admin_id: admin_id,
//     });

//     console.log(singleAdmin, "uoop");
//     if (!singleAdmin) {
//       return res.status(404).json({
//         status: 404,
//         success: true,
//         data: {},
//         message: "Admin not found.",
//       });
//     }
//     const payload = {
//       method: "manual",
//       method_id: "1",
//       transaction_id: TransactionIdGenerator(),
//       initiated_at: GetCurrentTime(),
//       username: username,
//       user_id: admin_id,
//       deposit_amount: deposit_amount,
//       status: "approved",
//       updated_at: GetCurrentTime(),
//       payable: 0,
//       currency,
//       after_deposit: singleAdmin.amount + deposit_amount,
//       wallet_amount: singleAdmin.amount,
//       admin_response: admin_response,
//       user_type: user_type,
//       parent_admin_id: parent_admin_id,
//       parent_admin_role_type: type,
//       parent_admin_username: adminUsername,
//       site_auth_key: modelQuery.site_auth_key
//     };
//     let parentAdmin1 = await Admin.findOne({
//       // admin_id: parent_admin_id,
//       username: adminUsername,
//     });
//     if (parentAdmin1.amount < deposit_amount) {
//       return res.status(500).json({
//         status: 500,
//         success: false,
//         message: "Insufficient balance",
//       });
//     }

//     const decrementAmount = deposit_amount; // Define the decrement value
//     singleAdmin.amount += decrementAmount; // Decrement the amount field
//     // Save the updated document back to the database
//     await singleAdmin.save();
//     const deposit = new DepositModel(payload);
//     // Save the document to the database
//     const depositData = await deposit.save();
//     let parentAdmin = await Admin.findOneAndUpdate(
//       { username: adminUsername },
//       { $inc: { amount: -deposit_amount } },
//       { new: true }
//     );
//     res.status(201).json({
//       status: 201,
//       success: true,
//       data: depositData,
//       parentData: parentAdmin,
//       message: "Deposit amount successfully.",
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 500,
//       success: false,
//       message: error.message,
//     });
//   }
// };



const DepositAmount = async (req, res) => {

  try {
    const modelQuery = req.query.modelQuery;
    const { token, usernametoken } = req.headers;
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    const {
      username,
      deposit_amount,
      admin_response,
      parent_admin_id,
      admin_id,
      user_type,
      currency,
    } = req.body;

    // get single admin
    const singleAdmin = await Admin.findOne({ username: username }).session(session);
    if (!singleAdmin) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(404).json({
        status: 404,
        success: true,
        data: {},
        message: "Admin not found.",
      });
    }

    const payload = {
      method: "manual",
      method_id: "1",
      transaction_id: TransactionIdGenerator(),
      initiated_at: GetCurrentTime(),
      username: username,
      user_id: admin_id,
      deposit_amount: deposit_amount,
      status: "approved",
      updated_at: GetCurrentTime(),
      payable: 0,
      currency,
      after_deposit: singleAdmin.amount + deposit_amount,
      wallet_amount: singleAdmin.amount,
      admin_response: admin_response,
      user_type: user_type,
      parent_admin_id: parent_admin_id,
      parent_admin_role_type: type,
      parent_admin_username: adminUsername,
      site_auth_key: modelQuery.site_auth_key
    };

    let parentAdmin1 = await Admin.findOne({ username: adminUsername }).session(session);
    if (parentAdmin1.amount < deposit_amount) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Insufficient balance",
      });
    }

    singleAdmin.amount += deposit_amount; // Update the amount field
    await singleAdmin.save({ session });

    const deposit = new DepositModel(payload);
    const depositData = await deposit.save({ session });

    let parentAdmin = await Admin.findOneAndUpdate(
      { username: adminUsername },
      { $inc: { amount: -deposit_amount } },
      { new: true, session: session }
    );

    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({
      status: 201,
      success: true,
      data: depositData,
      parentData: parentAdmin,
      message: "Deposit amount successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

// const WithdrawAmount = async (req, res) => {
//   try {

//     const modelQuery = req.query.modelQuery;
//     const { token, usernametoken } = req.headers;
//     if (!token || !usernametoken) {
//       return res.status(401).json({
//         status: 401,
//         success: false,
//         message: "Invalid tokens. Access denied.",
//       });
//     }
//     // Validate access token and verify token here
//     const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
//     const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
//     if (!adminUsername || !type) {
//       return res.status(401).json({
//         status: 401,
//         success: false,
//         message: "Invalid tokens, Access denied.",
//       });
//     }
//     const {
//       username,
//       withdraw_amount,
//       admin_response,
//       parent_admin_id,
//       admin_id,
//       user_type,
//       currency,
//     } = req.body;
//     // get single admin
//     const singleAdmin = await Admin.findOne({
//       username: username,
//       // parent_admin_username: adminUsername,
//       // admin_id: admin_id,
//     });

//     if (!singleAdmin) {
//       return res.status(404).json({
//         status: 404,
//         success: true,
//         data: {},
//         message: "Admin not found.",
//       });
//     }

//     if (withdraw_amount > singleAdmin.amount) {
//       return res.status(500).json({
//         status: 500,
//         success: true,
//         message: "insufficient balance.",
//       });
//     }
//     const payload = {
//       method: "manual",
//       method_id: "1",
//       transaction_id: TransactionIdGenerator(),
//       initiated_at: GetCurrentTime(),
//       username: username,
//       user_id: admin_id,
//       withdraw_amount: withdraw_amount,
//       status: "approved",
//       updated_at: GetCurrentTime(),
//       payable: 0,
//       currency,
//       after_withdraw: singleAdmin.amount - withdraw_amount,
//       wallet_amount: singleAdmin.amount,
//       admin_response: admin_response,
//       user_type: user_type,
//       parent_admin_id: parent_admin_id,
//       parent_admin_role_type: type,
//       parent_admin_username: adminUsername,
//       site_auth_key:modelQuery.site_auth_key
//     };

//     const decrementAmount = withdraw_amount; // Define the decrement value
//     singleAdmin.amount -= decrementAmount; // Decrement the amount field
//     // Save the updated document back to the database
//     await singleAdmin.save();
//     const withdraw = new WithdrawModel(payload);
//     // Save the document to the database
//     const withdrawData = await withdraw.save();

//     let parentAdmin = await Admin.findOneAndUpdate(
//       { admin_id: parent_admin_id, username: adminUsername },
//       { $inc: { amount: withdraw_amount } },
//       { new: true }
//     );
//     res.status(201).json({
//       status: 201,
//       success: true,
//       data: withdrawData,
//       parentData: parentAdmin,
//       message: "Withdraw amount successfully.",
//     });
//   } catch (error) {
//     console.error("Error adding Withdraw:", error);
//     res.status(500).json({
//       status: 500,
//       success: false,
//       message: error.message,
//     });
//   }
// };



const WithdrawAmount = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const modelQuery = req.query.modelQuery;
    const { token, usernametoken } = req.headers;
    if (!token || !usernametoken) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    if (!adminUsername || !type) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    const {
      username,
      withdraw_amount,
      admin_response,
      parent_admin_id,
      admin_id,
      user_type,
      currency,
      approved_by_username,
      approved_by_admin_id,
      approved_by_role_type,
    } = req.body;

    // get single admin
    const singleAdmin = await Admin.findOne({ username: username }).session(session);
    if (!singleAdmin) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(404).json({
        status: 404,
        success: true,
        data: {},
        message: "Admin not found.",
      });
    }

    if (withdraw_amount > singleAdmin.amount) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(500).json({
        status: 500,
        success: true,
        message: "Insufficient balance.",
      });
    }

    const payload = {
      method: "manual",
      method_id: "1",
      transaction_id: TransactionIdGenerator(),
      initiated_at: GetCurrentTime(),
      username: username,
      user_id: admin_id,
      withdraw_amount: withdraw_amount,
      status: "approved",
      updated_at: GetCurrentTime(),
      payable: 0,
      currency,
      after_withdraw: singleAdmin.amount - withdraw_amount,
      wallet_amount: singleAdmin.amount,
      admin_response: admin_response,
      user_type: user_type,
      parent_admin_id: parent_admin_id,
      parent_admin_role_type: type,
      parent_admin_username: adminUsername,
      site_auth_key: modelQuery.site_auth_key,
      approved_by_username,
      approved_by_admin_id,
      approved_by_role_type,
    };

    singleAdmin.amount -= withdraw_amount; // Update the amount field
    await singleAdmin.save({ session });

    const withdraw = new WithdrawModel(payload);
    const withdrawData = await withdraw.save({ session });

    let parentAdmin = await Admin.findOneAndUpdate(
      { admin_id: parent_admin_id, username: adminUsername },
      { $inc: { amount: withdraw_amount } },
      { new: true, session: session }
    );

    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({
      status: 201,
      success: true,
      data: withdrawData,
      parentData: parentAdmin,
      message: "Withdraw amount successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    console.error("Error processing withdrawal:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

// const DepositAmountUser = async (req, res) => {
//   try {
//     const modelQuery = req.query.modelQuery;
//     const { token, usernametoken } = req.headers;
//     if (!token || !usernametoken) {
//       return res.status(401).json({
//         status: 401,
//         success: false,
//         message: "Invalid tokens. Access denied.",
//       });
//     }
//     // Validate access token and verify token here
//     const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
//     const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type

//     if (!adminUsername || !type) {
//       return res.status(401).json({
//         status: 401,
//         success: false,
//         message: "Invalid tokens, Access denied.",
//       });
//     }
//     const {
//       username,
//       deposit_amount,
//       admin_response,
//       parent_admin_id,
//       user_id,
//       user_type,
//       currency,
//     } = req.body;
//     // get single admin
//     const singleAdmin = await User.findOne({
//       username: username,
//       // parent_admin_username: adminUsername,
//       // user_id: user_id,
//     });

//     if (!singleAdmin) {
//       return res.status(200).json({
//         status: 200,
//         success: true,
//         data: {},
//         message: "User not found.",
//       });
//     }
//     const payload = {
//       method: "manual",
//       method_id: "1",
//       transaction_id: TransactionIdGenerator(),
//       initiated_at: GetCurrentTime(),
//       username: username,
//       user_id: user_id,
//       deposit_amount: deposit_amount,
//       status: "approved",
//       updated_at: GetCurrentTime(),
//       payable: 0,
//       currency,
//       after_deposit: singleAdmin.amount + deposit_amount,
//       wallet_amount: singleAdmin.amount,
//       admin_response: admin_response,
//       user_type: user_type,
//       parent_admin_id: parent_admin_id,
//       parent_admin_role_type: type,
//       parent_admin_username: adminUsername,
//       site_auth_key:  modelQuery.site_auth_key
//     };
//     let parentAdmin1 = await Admin.findOne({
//       // admin_id: parent_admin_id,
//       username: adminUsername,
//     });
//     if (parentAdmin1.amount < deposit_amount) {
//       return res.status(500).json({
//         status: 500,
//         success: false,
//         message: "Insufficient balance",
//       });
//     }
//     const decrementAmount = deposit_amount; // Define the decrement value
//     singleAdmin.amount += decrementAmount; // Decrement the amount field
//     // Save the updated document back to the database
//     await singleAdmin.save();
//     const deposit = new DepositModel(payload);
//     // Save the document to the database
//     const depositData = await deposit.save();
//     let parentAdmin = await Admin.findOneAndUpdate(
//       { username: adminUsername },
//       { $inc: { amount: -deposit_amount } },
//       { new: true }
//     );
//     res.status(201).json({
//       status: 201,
//       success: true,
//       data: depositData,
//       parentData: parentAdmin,
//       message: "Deposit amount successfully.",
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 500,
//       success: false,
//       message: error.message,
//     });
//   }
// };


const DepositAmountUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const modelQuery = req.query.modelQuery;
    const { token, usernametoken } = req.headers;
    if (!token || !usernametoken) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type

    if (!adminUsername || !type) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    const {
      username,
      deposit_amount,
      admin_response,
      parent_admin_id,
      user_id,
      user_type,
      currency,
      site_auth_key,
      approved_by_username,
      approved_by_admin_id,
      approved_by_role_type,
    } = req.body;

    // get single user
    const singleUser = await User.findOne({ username: username }).session(session);

    if (!singleUser) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(200).json({
        status: 200,
        success: true,
        data: {},
        message: "User not found.",
      });
    }

    const payload = {
      method: "manual",
      method_id: "1",
      transaction_id: TransactionIdGenerator(),
      initiated_at: GetCurrentTime(),
      username: username,
      user_id: user_id,
      deposit_amount: deposit_amount,
      status: "approved",
      updated_at: GetCurrentTime(),
      payable: 0,
      currency,
      after_deposit: singleUser.amount + deposit_amount,
      wallet_amount: singleUser.amount,
      admin_response: admin_response,
      user_type: user_type,
      parent_admin_id: parent_admin_id,
      parent_admin_role_type: type,
      parent_admin_username: adminUsername,
      site_auth_key: modelQuery.site_auth_key,
      approved_by_username,
      approved_by_admin_id,
      approved_by_role_type,
    };

    let parentAdmin1 = await Admin.findOne({ username: adminUsername }).session(session);
    if (parentAdmin1.amount < deposit_amount) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Insufficient balance",
      });
    }

    singleUser.amount += deposit_amount; // Update the amount field
    await singleUser.save({ session });

    const deposit = new DepositModel(payload);
    const depositData = await deposit.save({ session });

    let parentAdmin = await Admin.findOneAndUpdate(
      { username: adminUsername },
      { $inc: { amount: -deposit_amount } },
      { new: true, session: session }
    );

    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({
      status: 201,
      success: true,
      data: depositData,
      parentData: parentAdmin,
      message: "Deposit amount successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

// const WithdrawAmountUser = async (req, res) => {
//   try {
//     const modelQuery = req.query.modelQuery;
//     const { token, usernametoken } = req.headers;
//     if (!token || !usernametoken) {
//       return res.status(401).json({
//         status: 401,
//         success: false,
//         message: "Invalid tokens. Access denied.",
//       });
//     }
//     // Validate access token and verify token here
//     const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
//     const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
//     if (!adminUsername || !type) {
//       return res.status(401).json({
//         status: 401,
//         success: false,
//         message: "Invalid tokens, Access denied.",
//       });
//     }
//     const {
//       username,
//       withdraw_amount,
//       admin_response,
//       parent_admin_id,
//       user_id,
//       user_type,
//       currency,
//     } = req.body;
//     // get single admin
//     const singleAdmin = await User.findOne({
//       username: username,
//       // parent_admin_username: adminUsername,
//       // user_id: user_id,
//     });

//     if (!singleAdmin) {
//       return res.status(200).json({
//         status: 200,
//         success: true,
//         data: {},
//         message: "User not found.",
//       });
//     }

//     if (withdraw_amount > singleAdmin.amount) {
//       return res.status(500).json({
//         status: 500,
//         success: true,
//         message: "insufficient balance.",
//       });
//     }
//     const payload = {
//       method: "manual",
//       method_id: "1",
//       transaction_id: TransactionIdGenerator(),
//       initiated_at: GetCurrentTime(),
//       username: username,
//       user_id: user_id,
//       withdraw_amount: withdraw_amount,
//       status: "approved",
//       updated_at: GetCurrentTime(),
//       payable: 0,
//       currency,
//       after_withdraw: singleAdmin.amount - withdraw_amount,
//       wallet_amount: singleAdmin.amount,
//       admin_response: admin_response,
//       user_type: user_type,
//       parent_admin_id: parent_admin_id,
//       parent_admin_role_type: type,
//       parent_admin_username: adminUsername,
//       site_auth_key:modelQuery.site_auth_key
//     };

//     const decrementAmount = withdraw_amount; // Define the decrement value
//     singleAdmin.amount -= decrementAmount; // Decrement the amount field
//     // Save the updated document back to the database
//     await singleAdmin.save();
//     const withdraw = new WithdrawModel(payload);
//     // Save the document to the database
//     const withdrawData = await withdraw.save();

//     let parentAdmin = await Admin.findOneAndUpdate(
//       { username: adminUsername },
//       { $inc: { amount: withdraw_amount } },
//       { new: true }
//     );
//     res.status(201).json({
//       status: 201,
//       success: true,
//       data: withdrawData,
//       parentData: parentAdmin,
//       message: "Withdraw amount successfully.",
//     });
//   } catch (error) {
//     console.error("Error adding Withdraw:", error);
//     res.status(500).json({
//       status: 500,
//       success: false,
//       message: error.message,
//     });
//   }
// };


const WithdrawAmountUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const modelQuery = req.query.modelQuery;
    const { token, usernametoken } = req.headers;
    if (!token || !usernametoken) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    if (!adminUsername || !type) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    const {
      username,
      withdraw_amount,
      admin_response,
      parent_admin_id,
      user_id,
      user_type,
      currency,
      approved_by_username,
      approved_by_admin_id,
      approved_by_role_type,
    } = req.body;
    // get single user
    const singleUser = await User.findOne({ username: username }).session(session);

    if (!singleUser) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(200).json({
        status: 200,
        success: true,
        data: {},
        message: "User not found.",
      });
    }

    if (withdraw_amount > singleUser.amount) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Insufficient balance.",
      });
    }

    const payload = {
      method: "manual",
      method_id: "1",
      transaction_id: TransactionIdGenerator(),
      initiated_at: GetCurrentTime(),
      username: username,
      user_id: user_id,
      withdraw_amount: withdraw_amount,
      status: "approved",
      updated_at: GetCurrentTime(),
      payable: 0,
      currency,
      after_withdraw: singleUser.amount - withdraw_amount,
      wallet_amount: singleUser.amount,
      admin_response: admin_response,
      user_type: user_type,
      parent_admin_id: parent_admin_id,
      parent_admin_role_type: type,
      parent_admin_username: adminUsername,
      site_auth_key: modelQuery.site_auth_key,
      approved_by_username,
      approved_by_admin_id,
      approved_by_role_type,
    };

    singleUser.amount -= withdraw_amount; // Decrement the amount field
    await singleUser.save({ session });

    const withdraw = new WithdrawModel(payload);
    const withdrawData = await withdraw.save({ session });

    let parentAdmin = await Admin.findOneAndUpdate(
      { username: adminUsername },
      { $inc: { amount: withdraw_amount } },
      { new: true, session: session }
    );

    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({
      status: 201,
      success: true,
      data: withdrawData,
      parentData: parentAdmin,
      message: "Withdraw amount successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    console.error("Error processing withdrawal:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllWithdrawDataOfLowerAdmin = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const page = parseInt(req.query.page) || 1; // Get page number from query params, default to 1
  const limit = parseInt(req.query.limit) || 10; // Get limit from query params, default to 10
  const modelQuery = req.query.modelQuery;

  const { search, transaction_type } = req.query;
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
    let query = {};
    query = {
      username: { $ne: adminUsername },
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
      user_type: "admin",
      ...modelQuery
    };
    if (search) {
      query = {
        ...query,
        $or: [{ username: { $regex: search, $options: "i" } }],
      };
    }

    if (transaction_type) {
      query.status = transaction_type;
    }
    // Fetch withdrawal records with pagination
    let withdrawalRecords = await WithdrawModel.find(query)
      .sort({
        initiated_at: -1,
      })
      .skip(skip)
      .limit(limit);

    const withdrawalCount = await WithdrawModel.countDocuments({
      ...modelQuery,
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
    });

    const depositCount = await WithdrawModel.countDocuments({
      parent_admin_username: adminUsername,
      ...modelQuery,
      parent_admin_role_type: type,
    });

    const approvedTransaction = await WithdrawModel.countDocuments({
      ...modelQuery,
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
      status: "approved",
    });
    const pendingTransaction = await WithdrawModel.countDocuments({
      ...modelQuery,
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
      status: "pending",
    });
    const rejectTransaction = await WithdrawModel.countDocuments({
      ...modelQuery,
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
      status: "reject",
    });
    const totalPages = Math.ceil(withdrawalCount / limit);

    const pagination = {
      totalItems: withdrawalCount,
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
    withdrawalRecords = sortByPlacedAt(withdrawalRecords);

    res.status(200).json({
      status: 200,
      success: true,
      pagination: pagination,
      data: withdrawalRecords,
      transactionsCount: {
        approvedTransaction,
        pendingTransaction,
        rejectTransaction,
        allTransaction: depositCount,
      },
      message: "Withdrawal records retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllDepositDataOfLowerAdmin = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const page = parseInt(req.query.page) || 1; // Get page number from query params, default to 1
  const limit = parseInt(req.query.limit) || 20; // Get limit from query params, default to 10
  const { search, transaction_type } = req.query;
  const modelQuery = req.query.modelQuery;
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
    let query = {};

    query = {
      username: { $ne: adminUsername },
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
      user_type: "admin",
      ...modelQuery
    };

    if (transaction_type) {
      query.status = transaction_type;
    }
    if (search) {
      query = {
        ...query,
        $or: [
          { username: { $regex: search, $options: "i" } },
          { method: { $regex: search, $options: "i" } },
        ],
      };
    }
    // Fetch withdrawal records with pagination
    let depositRecords = await DepositModel.find(query)
      .sort({
        initiated_at: -1,
      })
      .skip(skip)
      .limit(limit);
    const depositCount = await DepositModel.countDocuments({
      ...modelQuery,
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
    });

    const approvedTransaction = await DepositModel.countDocuments({
      ...modelQuery,
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
      status: "approved",
    });
    const pendingTransaction = await DepositModel.countDocuments({
      ...modelQuery,
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
      status: "pending",
    });
    const rejectTransaction = await DepositModel.countDocuments({
      ...modelQuery,
      parent_admin_username: adminUsername,
      parent_admin_role_type: type,
      status: "reject",
    });
    const totalPages = Math.ceil(depositCount / limit);

    const pagination = {
      totalItems: depositCount,
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
      pagination: pagination,
      transactionsCount: {
        approvedTransaction,
        pendingTransaction,
        rejectTransaction,
        allTransaction: depositCount,
      },
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

const GetAllWithdrawDataOfSelf = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const page = parseInt(req.query.page) || 1; // Get page number from query params, default to 1
  const limit = parseInt(req.query.limit) || 20; // Get limit from query params, default to 10
  const { search, transaction_type } = req.query;
  const modelQuery = req.query.modelQuery;
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
    let query = modelQuery || {};
    query = {
      username: adminUsername,
      // role_type: type,
    };
    if (search) {
      query = {
        ...query,
        $or: [
          { username: { $regex: search, $options: "i" } },
          { method: { $regex: search, $options: "i" } },
        ],
      };
    }
    if (transaction_type) {
      query.status = transaction_type;
    }

    // Fetch withdrawal records with pagination
    let withdrawalRecords = await WithdrawModel.find(query)
      .sort({
        initiated_at: -1,
      })
      .skip(skip)
      .limit(limit);
    const withdrawCount = await WithdrawModel.countDocuments({
      ...modelQuery,
      username: adminUsername,
      // role_type: type,
    });

    const approvedTransaction = await WithdrawModel.countDocuments({
      ...modelQuery,
      username: adminUsername,
      // role_type: type,
      status: "approved",
    });
    const pendingTransaction = await WithdrawModel.countDocuments({
      ...modelQuery,
      username: adminUsername,
      // role_type: type,
      status: "pending",
    });
    const rejectTransaction = await WithdrawModel.countDocuments({
      ...modelQuery,
      username: adminUsername,
      // role_type: type,
      status: "reject",
    });
    const totalPages = Math.ceil(withdrawCount / limit);

    const pagination = {
      totalItems: withdrawCount,
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
    withdrawalRecords = sortByPlacedAt(withdrawalRecords);
    res.status(200).json({
      status: 200,
      success: true,
      data: withdrawalRecords,
      pagination: pagination,
      transactionsCount: {
        approvedTransaction,
        pendingTransaction,
        rejectTransaction,
        allTransaction: withdrawCount,
      },
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

const GetAllDepositDataOfSelf = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const page = parseInt(req.query.page) || 1; // Get page number from query params, default to 1
  const limit = parseInt(req.query.limit) || 20; // Get limit from query params, default to 10
  const { search, transaction_type } = req.query;
  const modelQuery = req.query.modelQuery;
  try {
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
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
    let query = { username: adminUsername, ...modelQuery };
    if (search) {
      query = {
        ...query,
        $or: [
          { username: { $regex: search, $options: "i" } },
          { method: { $regex: search, $options: "i" } },
        ],
      };
    }
    if (transaction_type) {
      query.status = transaction_type;
    }
    // Fetch withdrawal records with pagination
    let depositRecords = await DepositModel.find(query)
      .sort({
        initiated_at: -1,
      })
      .skip(skip)
      .limit(limit);

    const depositCount = await DepositModel.countDocuments({
      ...modelQuery,
      username: adminUsername,
      // role_type: type,
    });

    const approvedTransaction = await DepositModel.countDocuments({
      ...modelQuery,
      username: adminUsername,
      // role_type: type,
      status: "approved",
    });
    const pendingTransaction = await DepositModel.countDocuments({
      ...modelQuery,
      username: adminUsername,
      // role_type: type,
      status: "pending",
    });
    const rejectTransaction = await DepositModel.countDocuments({
      ...modelQuery,
      username: adminUsername,
      // role_type: type,
      status: "reject",
    });
    const totalPages = Math.ceil(depositCount / limit);
    const pagination = {
      totalItems: depositCount,
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
      pagination: pagination,
      transactionsCount: {
        approvedTransaction,
        pendingTransaction,
        rejectTransaction,
        allTransaction: depositCount,
      },
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

const DeleteSingleAdmin = async (req, res) => {
  try {
    const { token, usernametoken } = req.headers;
    const { admin_id } = req.params;
    const modelQuery = req.query.modelQuery;
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

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

      let query = { admin_id: admin_id, ...modelQuery };

      if (type !== "owneradmin") {
        query = {
          ...query,
          parent_admin_role_type: type,
          parent_admin_username: adminUsername,
          username: { $ne: "owneradmin" },
        };
      }
      const admin = await Admin.findOne(query).session(session);
      if (!admin) {
        return res.status(202).json({
          status: 200,
          success: false,
          data: {},
          message: "Admin not found.",
        });
      }
      let deleteQuery = {
        $or: [
          {
            parent_admin_id: admin.admin_id,
            parent_admin_username: admin.username,
          },
          {
            username: admin.username,
            admin_id: admin.admin_id,
          },
        ],
        username: { $ne: "owneradmin" },
      };

      console.log(deleteQuery, "wiijj");
      await Admin.deleteMany({ ...deleteQuery, ...modelQuery }).session(session);
      await session.commitTransaction();
      await session.endSession();
      return res.status(200).json({
        status: 200,
        success: false,
        data: admin,
        message: "Admin remove successfully.",
      });
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      return res.status(500).json({
        status: 500,
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

// const DeleteSingleAdmin = async (req, res) => {
//   try {
//     const { token, usernametoken } = req.headers;
//     const { admin_id } = req.params;

//     if (!token || !usernametoken) {
//       return res.status(401).json({
//         status: 401,
//         success: false,
//         message: "Invalid tokens. Access denied.",
//       });
//     }

//   let  session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       const type = await VerifyJwt(token, req, res);
//       const adminUsername = await VerifyJwt(usernametoken, req, res);

//       if (!adminUsername || !type) {
//         return res.status(401).json({
//           status: 401,
//           success: false,
//           message: "Invalid tokens, Access denied.",
//         });
//       }

//       let query = { admin_id: admin_id };

//       if ( type !== "owneradmin") {
//         query = {
//           ...query,
//           parent_admin_role_type: type,
//           parent_admin_username: adminUsername,
//           username: { $ne: "owneradmin" },
//         };
//       }

//       const admin = await Admin.findOne(query).session(session);
//       if (!admin) {
//         return res.status(202).json({
//           status: 200,
//           success: false,
//           data: {},
//           message: "Admin not found.",
//         });
//       }

//       async function deleteAdminRecursively(adminId, allDeletedAdminIds = []) {
//         const childAdmins = await Admin.find({ parent_admin_id: adminId }).session(session);
//         for (const childAdmin of childAdmins) {
//           await deleteAdminRecursively(childAdmin.admin_id, allDeletedAdminIds);
//         }

//         // Collect all admin IDs to delete their associated users
//         const adminIds = childAdmins.map(admin => admin.admin_id).concat([adminId]);

//         // Store the collected admin IDs for further processing
//         allDeletedAdminIds.push(...adminIds);

//         // Delete all users associated with collected admin IDs
//         await User.deleteMany({ admin_id: { $in: adminIds } }).session(session);

//         // Finally, delete the current admin
//         await Admin.deleteOne({ admin_id: adminId }).session(session);
//       }

//       const allDeletedAdminIds = [];
//       await deleteAdminRecursively(admin_id, allDeletedAdminIds);

//       await session.commitTransaction();
//       await session.endSession();

//       return res.status(200).json({
//         status: 200,
//         success: true,
//         message: "Admin and all associated child admins and users removed successfully.",
//         deletedAdminIds: allDeletedAdminIds,
//       });
//     } catch (error) {
//       await session.abortTransaction();
//       await session.endSession();
//       return res.status(500).json({
//         status: 500,
//         success: false,
//         message: error.message,
//       });
//     }
//   } catch (error) {
//     if (session) {
//       await session.abortTransaction();
//       await session.endSession();
//     }
//     return res.status(500).json({
//       status: 500,
//       success: false,
//       message: error.message,
//     });
//   }
// };

const GetAllDeletedUser = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const { search, page = 1, limit = 50 } = req.query;
  const modelQuery = req.query.modelQuery;
  const skip = (page - 1) * limit;
  try {
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    let query = { ...modelQuery, is_deleted: true };

    if (type !== "owneradmin") {
      query = {
        ...query,
        parent_admin_username: adminUsername,
      };
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { first_name: { $regex: search, $options: "i" } },
          { last_name: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const deletedUsers = await User.find(query)
      .sort({ deleted_at: -1 })
      .skip(skip)
      .limit(limit);

    const totalDeletedCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalDeletedCount / limit);

    return res.status(200).json({
      status: 200,
      success: true,
      data: deletedUsers || [],
      pagination: {
        totalItems: totalDeletedCount,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
      message: "Deleted users retrieved successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const RestoreSingleUser = async (req, res) => {
  try {
    const { token, usernametoken } = req.headers;
    const { user_id } = req.params;
    const modelQuery = req.query.modelQuery;
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    const type = await VerifyJwt(token, req, res);
    const adminUsername = await VerifyJwt(usernametoken, req, res);

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    let query = { user_id, ...modelQuery, is_deleted: true };

    if (type !== "owneradmin") {
      query = {
        ...query,
        parent_admin_username: adminUsername,
      };
    }

    const user = await User.findOneAndUpdate(
      query,
      { is_deleted: false, deleted_at: null },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found or not in recycle bin.",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "User restored successfully.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const PermanentDeleteSingleUser = async (req, res) => {
  try {
    const { token, usernametoken } = req.headers;
    const { user_id } = req.params;
    const modelQuery = req.query.modelQuery;
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

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

      let query = { user_id, ...modelQuery, is_deleted: true };

      if (type !== "owneradmin") {
        query = {
          ...query,
          parent_admin_username: adminUsername,
        };
      }

      // 1. Find the user to be deleted
      const userToDelete = await User.findOne(query).session(session);

      if (!userToDelete) {
        await session.abortTransaction();
        return res.status(404).json({
          status: 404,
          success: false,
          message: "User not found in recycle bin.",
        });
      }

      // 2. Check for balance and refund to parent admin if > 0
      if (userToDelete.amount > 0) {
        const refundAmount = userToDelete.amount;

        // Update Parent Admin Balance (Credit)
        const parentAdmin = await Admin.findOneAndUpdate(
          { username: adminUsername },
          { $inc: { amount: refundAmount } },
          { new: true, session: session }
        );

        if (!parentAdmin) {
          console.error(`Parent admin ${adminUsername} not found for refund.`);
          // You might want to decide whether to abort or proceed. 
          // For safety, let's abort if the person getting the money doesn't exist.
          await session.abortTransaction();
          return res.status(500).json({
            status: 500,
            success: false,
            message: "Parent admin for refund not found. Deletion aborted.",
          });
        }

        // Create Withdrawal Record (USER -> ADMIN)
        // We record this as a "Withdraw" from the User's perspective, 
        // with the user as the source and parent as the destination (implicit in parent_admin fields).
        // The method is "User Deletion Refund".
        const transactionPayload = {
          method: "User Deletion Refund",
          method_id: "system_auto_refund",
          transaction_id: TransactionIdGenerator(),
          initiated_at: GetCurrentTime(),
          username: userToDelete.username,
          user_id: userToDelete.user_id,
          withdraw_amount: refundAmount,
          status: "approved",
          updated_at: GetCurrentTime(),
          payable: 0,
          currency: userToDelete.currency || "INR",
          after_withdraw: 0, // Balance becomes 0
          wallet_amount: userToDelete.amount, // Balance before withdraw
          admin_response: "Auto-refunded upon permanent deletion.",
          user_type: "user", // Or whatever userToDelete.role_type is
          parent_admin_id: parentAdmin.admin_id,
          parent_admin_role_type: parentAdmin.role_type,
          parent_admin_username: parentAdmin.username,
          payment_type: "manual", // Or "auto"
          type: "withdraw",
          approved_by_username: adminUsername,
          approved_by_admin_id: parentAdmin.admin_id,
          approved_by_role_type: type,
          site_auth_key: userToDelete.site_auth_key || "BspAuthKey123", // Ensure this exists
        };

        const refundTransaction = new WithdrawModel(transactionPayload);
        await refundTransaction.save({ session });
      }

      // 3. Delete the user
      const result = await User.deleteOne(query).session(session);

      if (result.deletedCount === 0) {
        await session.abortTransaction();
        return res.status(404).json({
          status: 404,
          success: false,
          message: "User not found in recycle bin (during delete).",
        });
      }

      await session.commitTransaction();
      await session.endSession();
      return res.status(200).json({
        status: 200,
        success: true,
        message: "User permanent deleted and balance refunded (if any).",
      });
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      return res.status(500).json({
        status: 500,
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const AutoDeleteTrashedUsers = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await User.deleteMany({
      is_deleted: true,
      deleted_at: { $lte: thirtyDaysAgo },
    });

    console.log(`Auto-deleted ${result.deletedCount} users from recycle bin.`);
  } catch (error) {
    console.error("Error in auto-delete cron job:", error);
  }
};

const DeleteSingleUser = async (req, res) => {
  try {
    const { token, usernametoken } = req.headers;
    const { user_id } = req.params;
    const modelQuery = req.query.modelQuery;
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

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

      let query = { user_id: user_id, ...modelQuery, is_deleted: { $ne: true } };

      if (type !== "owneradmin") {
        query = {
          ...query,
          parent_admin_role_type: type,
          parent_admin_username: adminUsername,
        };
      }

      const admin = await User.updateOne(query, { is_deleted: true, deleted_at: new Date() }).session(session);

      await session.commitTransaction();
      await session.endSession();
      return res.status(200).json({
        status: 200,
        success: true,
        data: admin,
        message: "User moved to recycle bin successfully.",
      });
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      return res.status(500).json({
        status: 500,
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const CheckUsernameExistence = async (req, res) => {
  try {
    const { username, email, phone, type } = req.body;
    let existingUserByUsername;
    let existingUserByEmail;
    let existingUserByPhone;

    // Check the type to determine the schema to use
    if (type === "user") {
      if (username) existingUserByUsername = await User.findOne({ username });
      if (email) existingUserByEmail = await User.findOne({ email });
      if (phone) existingUserByPhone = await User.findOne({ phone });
    } else if (type === "admin") {
      if (username) existingUserByUsername = await Admin.findOne({ username });
      if (email) existingUserByEmail = await Admin.findOne({ email });
      if (phone) existingUserByPhone = await Admin.findOne({ phone });
    } else {
      return res.status(400).json({
        status: 400,
        message: "Invalid user type. User type must be 'user' or 'admin'.",
      });
    }

    const conflicts = [];
    if (existingUserByUsername) conflicts.push("username");
    if (existingUserByEmail) conflicts.push("email");
    if (existingUserByPhone) conflicts.push("phone");

    if (conflicts.length > 0) {
      return res.status(409).json({
        status: 409,
        exists: true,
        conflicts,
        message: `${conflicts.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")} already exists.`,
      });
    } else {
      return res.status(200).json({
        status: 200,
        exists: false,
        message: "Details are available. You can proceed.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

const UpdateSingleUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const modelQuery = req.query.modelQuery;
    const query = { $or: [{ user_id: user_id }, { username: user_id }], ...modelQuery };

    const {
      email,
      phone,
      city,
      country,
      bank_name,
      bank_holder,
      account_number,
      ifsc_code,
      branch_code,
      document,
      sms_verified,
      bank_verified,
      email_verified,
      profile_picture,
      address,
      birthday,
      gender,
    } = req.body;

    // Prepare the update payload with only the fields present in the request body
    const updatePayload = {
      ...(email && { email }),
      ...(phone && { phone }),
      ...(city && { city }),
      ...(country && { country }),
      ...(bank_name && { bank_name }),
      ...(bank_holder && { bank_holder }),
      ...(account_number && { account_number }),
      ...(ifsc_code && { ifsc_code }),
      ...(branch_code && { branch_code }),
      ...(document && { document }),
      ...(sms_verified && { sms_verified }),
      ...(bank_verified && { bank_verified }),
      ...(email_verified && { email_verified }),
      ...(profile_picture && { profile_picture }),
      ...(address && { address }),
      ...(birthday && { birthday }),
      ...(gender && { gender }),
    };

    const user = await User.findOneAndUpdate(query, updatePayload, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found",
        data: {},
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "User details updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};


const GetAllUserByAdmin = async (req, res) => {
  // from admin
  const { token, usernametoken } = req.headers;
  const { category, search, page = 1, limit = 50 } = req.query;
  const { admin_id, username, role_type } = req.body;
  const modelQuery = req.query.modelQuery;
  const skip = (page - 1) * limit;
  try {
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    // Find the admin in AdminModel
    let allUser = [];
    let query = modelQuery || {};
    if (category == "bet_active") {
      query.bet_supported = false; //false / true
    }

    if (category == "is_active") {
      query.is_blocked = false; //false / true
    }
    if (category == "is_blocked") {
      query.is_blocked = true; //false / true
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { first_name: { $regex: search, $options: "i" } },
          { last_name: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    query = {
      ...query,
      parent_admin_id: admin_id,
      // parent_admin_role_type: role_type,
      parent_admin_username: username,
      is_deleted: { $ne: true },
    };

    allUser = await User.find(query).skip(skip).limit(limit);
    let totalUserCount = await User.countDocuments(query);
    let blockUserCount = await User.countDocuments({
      ...query,
      is_blocked: true,
    });
    let betDeactiveUser = await User.countDocuments({
      ...query,
      bet_supported: false,
    });

    function sortByPlacedAt(arr) {
      // Sort the array of objects by the 'placed_at' field
      let ans = arr.sort((a, b) => {
        const dateA = new Date(a.joined_at).getTime(); // Convert dates to timestamps
        const dateB = new Date(b.joined_at).getTime();
        return dateB - dateA; // Sort based on timestamps
      });
      return ans;
    }
    allUser = sortByPlacedAt(allUser);
    const admins = await Admin.countDocuments(query);
    const totalPages = Math.ceil(totalUserCount / limit);
    const pagination = {
      totalUsers: totalUserCount,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };
    return res.status(200).json({
      status: 200,
      success: false,
      data: allUser || [],
      userCount: {
        totalUserCount,
        blockUserCount,
        betDeactiveUser,
        totalUsers: totalUserCount,
      },
      pagination,
      message: "User data retrived successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllAdminByAdmin = async (req, res) => {
  // from admin
  const { token, usernametoken } = req.headers;
  const { category, search, page = 1, limit = 50 } = req.query;
  const { admin_id, username, role_type } = req.body;
  const modelQuery = req.query.modelQuery;
  const skip = (page - 1) * limit;
  try {
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    let allAdmin = [];
    let query = modelQuery || {};
    if (category) {
      query.role_type = category; //false / true
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { first_name: { $regex: search, $options: "i" } },
          { last_name: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    query = {
      ...query,
      parent_admin_id: admin_id,
      // parent_admin_role_type: role_type,
      parent_admin_username: username,
      username: { $ne: adminUsername },
    };

    // Find the admin in AdminModel
    allAdmin = await Admin.find(query).skip(skip).limit(limit);

    let totalAdminCount = await Admin.countDocuments(query);
    let ownerAdminCount = await Admin.countDocuments({
      ...query,
      role_type: "owneradmin",
    });
    let adminCount = await Admin.countDocuments({
      ...query,
      role_type: "admin",
    });
    let subadminCount = await Admin.countDocuments({
      ...query,
      role_type: "subadmin",
    });
    let seniorsuperCount = await Admin.countDocuments({
      ...query,
      role_type: "seniorsuper",
    });
    let superagentCount = await Admin.countDocuments({
      ...query,
      role_type: "superagent",
    });
    let agentCount = await Admin.countDocuments({
      ...query,
      role_type: "agent",
    });
    let blockAdminCount = await Admin.countDocuments({
      ...query,
      is_active: false,
    });
    let activeAdminCount = await Admin.countDocuments({
      ...query,
      is_active: true,
    });

    let betActiveAdminCount = await Admin.countDocuments({
      ...query,
      is_active: true,
    });
    function sortByPlacedAt(arr) {
      // Sort the array of objects by the 'placed_at' field
      let ans = arr.sort((a, b) => {
        const dateA = new Date(a.joined_at).getTime(); // Convert dates to timestamps
        const dateB = new Date(b.joined_at).getTime();
        return dateB - dateA; // Sort based on timestamps
      });
      return ans;
    }

    allAdmin = sortByPlacedAt(allAdmin);

    const totalPages = Math.ceil(totalAdminCount / limit);

    const pagination = {
      totalAdmins: totalAdminCount,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };
    return res.status(200).json({
      status: 200,
      success: false,
      data: allAdmin || [],
      adminDetailsCount: {
        blockAdminCount,
        activeAdminCount,
        betActiveAdminCount,
      },
      adminCount: {
        ownerAdminCount,
        totalAdminCount,
        adminCount,
        subadminCount,
        seniorsuperCount,
        superagentCount,
        agentCount,
        // totalAdmins: allAdmin,
      },
      pagination,
      message: "Admin data retrieved successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const SendMailUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { subject, message } = req.body;
    const user = await User.findOne({ user_id });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }
    // Find the market document by ID
    sendEmail(
      [user.email],
      user.username,
      message,
      "suvamswagatamp@gmail.com",
      subject
    );
    res.status(200).json({
      status: 200,
      success: true,
      message: "Email send successfully.",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllAdminByParent = async (req, res) => {
  // from admin
  const { token, usernametoken } = req.headers;
  const { category, search, page = 1, limit = 50, status = "" } = req.query;
  const skip = (page - 1) * limit;
  const modelQuery = req.query.modelQuery;
  try {
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    let allAdmin = [];
    let query = { username: { $ne: "owneradmin" }, ...modelQuery };
    if (category) {
      query.role_type = category; //false / true
    }

    if (status == "is_blocked") {
      query.is_active = false; //false / true
    }
    if (status == "is_active") {
      query.is_active = true; //false / true
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { first_name: { $regex: search, $options: "i" } },
          { last_name: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Check if adminUsername is "owneradmin" and type is "owneradmin"
    query = {
      ...query,
      parent_admin_role_type: type,
      parent_admin_username: adminUsername,
      username: { $ne: adminUsername },
    };
    // Find the admin in AdminModel
    allAdmin = await Admin.find(query)
      .sort({
        joined_at: -1,
      })
      .skip(skip)
      .limit(limit);

    let totalAdminCount = await Admin.countDocuments(query);
    let ownerAdminCount = await Admin.countDocuments({
      ...query,
      role_type: "owneradmin",
    });
    let adminCount = await Admin.countDocuments({
      ...query,
      role_type: "admin",
    });
    let subadminCount = await Admin.countDocuments({
      ...query,
      role_type: "subadmin",
    });
    let seniorsuperCount = await Admin.countDocuments({
      ...query,
      role_type: "seniorsuper",
    });
    let superagentCount = await Admin.countDocuments({
      ...query,
      role_type: "superagent",
    });
    let affiliateCount = await Admin.countDocuments({
      ...query,
      role_type: "affiliate",
    });
    let agentCount = await Admin.countDocuments({
      ...query,
      role_type: "agent",
    });
    let blockAdminCount = await Admin.countDocuments({
      ...query,
      parent_admin_role_type: type,
      parent_admin_username: adminUsername,
      username: { $ne: "owneradmin" },
      is_active: false,

    });
    let activeAdminCount = await Admin.countDocuments({
      ...query,
      parent_admin_role_type: type,
      parent_admin_username: adminUsername,
      username: { $ne: "owneradmin" },
      is_active: true,
    });

    let betActiveAdminCount = await Admin.countDocuments({
      ...query,
      parent_admin_role_type: type,
      parent_admin_username: adminUsername,
      username: { $ne: "owneradmin" },
      is_active: true,
    });
    function sortByPlacedAt(arr) {
      // Sort the array of objects by the 'placed_at' field
      let ans = arr.sort((a, b) => {
        const dateA = new Date(a.joined_at).getTime(); // Convert dates to timestamps
        const dateB = new Date(b.joined_at).getTime();
        return dateB - dateA; // Sort based on timestamps
      });
      return ans;
    }

    allAdmin = sortByPlacedAt(allAdmin);
    const admins = await Admin.countDocuments(query);
    const totalPages = Math.ceil(admins / limit);
    const pagination = {
      totalAdmins: allAdmin.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };
    return res.status(200).json({
      status: 200,
      success: false,
      data: allAdmin || [],
      adminDetailsCount: {
        blockAdminCount,
        activeAdminCount,
        betActiveAdminCount,
      },
      adminCount: {
        ownerAdminCount,
        totalAdminCount,
        adminCount,
        subadminCount,
        affiliateCount,
        seniorsuperCount,
        superagentCount,
        agentCount,
        // totalAdmins: allAdmin,
      },
      pagination,
      message: "Admin data retrieved successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllUserByParent = async (req, res) => {
  // from admin
  const { token, usernametoken } = req.headers;
  const { category, search, page = 1, limit = 50 } = req.query;
  const skip = (page - 1) * limit;
  const modelQuery = req.query.modelQuery;
  try {
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }
    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the admin_id)
    const adminUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type

    if (!adminUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    // Find the admin in AdminModel

    let allUser = [];
    let query = { username: { $ne: "owneradmin" }, ...modelQuery };
    if (category == "bet_active") {
      query.bet_supported = false; //false / true
    }

    if (category == "is_active") {
      query.is_blocked = false; //false / true
    }
    if (category == "is_blocked") {
      query.is_blocked = true; //false / true
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { first_name: { $regex: search, $options: "i" } },
          { last_name: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }
    let query1 = {};

    query = {
      ...query,
      parent_admin_role_type: type,
      parent_admin_username: adminUsername,
      username: { $ne: "owneradmin" },
      is_deleted: { $ne: true },
    };

    if (category === "no_deposit") {
      // Aggregation to find users with 0 approved deposits
      const pipeline = [
        { $match: query }, // Apply initial filters (parent scoping, search, etc.)
        {
          $lookup: {
            from: "deposits", // Collection name for DepositModel
            localField: "username",
            foreignField: "username",
            as: "user_deposits",
          },
        },
        {
          $addFields: {
            approved_deposit_count: {
              $size: {
                $filter: {
                  input: "$user_deposits",
                  as: "deposit",
                  cond: { $eq: ["$$deposit.status", "approved"] },
                },
              },
            },
          },
        },
        {
          $match: {
            approved_deposit_count: 0,
          },
        },
        { $sort: { joined_at: -1 } },
        {
          $facet: {
            metadata: [{ $count: "total" }],
            data: [{ $skip: skip }, { $limit: parseInt(limit) }],
          },
        },
      ];

      const result = await User.aggregate(pipeline);

      allUser = result[0].data;
      const totalFiltered = result[0].metadata[0] ? result[0].metadata[0].total : 0;

      // Override total/pagination for this specific category
      // const totalPages = Math.ceil(totalFiltered / limit); // Recalculate if needed but logic below does it differently

      const pagination = {
        totalUsers: totalFiltered,
        totalPages: Math.ceil(totalFiltered / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      };

      return res.status(200).json({
        status: 200,
        success: true,
        data: allUser || [],
        userCount: {
          totalUserCount: totalFiltered, // Just showing the filtered count for now
          // blockUserCount,
          // activeUserCount,
          // betDeactiveUser,
        },
        pagination,
        message: "User data retrived successfully.",
      });
    }

    query1 = {
      ...query,
      parent_admin_role_type: type,
      parent_admin_username: adminUsername,
      username: { $ne: "owneradmin" },
    };
    allUser = await User.find(query)
      .sort({
        joined_at: -1,
      })
      .skip(skip)
      .limit(limit);
    let totalUserCount = await User.countDocuments(query1);

    let blockUserCount = await User.countDocuments({
      ...modelQuery,
      parent_admin_role_type: type,
      parent_admin_username: adminUsername,
      username: { $ne: "owneradmin" },
      is_blocked: true,
      is_deleted: { $ne: true },
    });

    let activeUserCount = await User.countDocuments({
      ...modelQuery,
      parent_admin_role_type: type,
      parent_admin_username: adminUsername,
      username: { $ne: "owneradmin" },
      is_blocked: false,
      is_deleted: { $ne: true },
    });

    let betDeactiveUser = await User.countDocuments({
      ...modelQuery,
      parent_admin_role_type: type,
      parent_admin_username: adminUsername,
      username: { $ne: "owneradmin" },
      bet_supported: false,
      is_deleted: { $ne: true },
    });

    const user = await User.countDocuments(query);

    const totalPages = Math.ceil(user / limit);

    const pagination = {
      totalUsers: allUser.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };
    return res.status(200).json({
      status: 200,
      success: false,
      data: allUser || [],
      userCount: {
        totalUserCount,
        blockUserCount,
        activeUserCount,
        betDeactiveUser,
        // totalUsers: allUser,
      },
      pagination,
      message: "User data retrived successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  AdminLogin,
  AdminChipCreate,
  CreateAdminOrUser,
  UserChangePassword,
  AdminChangePassword,
  GetAllUser,
  GetRecentOnlineUserCount,
  GetSingleAdmin,
  GetSingleUser,
  UpdateSingleAdmin,
  AdminSelfResetPassword,
  GetAllAdmin,
  ToggleUserStatus,
  ToggleAdminStatus,
  DepositAmount,
  WithdrawAmount,
  DepositAmountUser,
  WithdrawAmountUser,
  GetAllDepositDataOfLowerAdmin,
  GetAllWithdrawDataOfLowerAdmin,
  GetAllWithdrawDataOfSelf,
  GetAllDepositDataOfSelf,
  DeleteSingleAdmin,
  DeleteSingleUser,
  CheckUsernameExistence,
  UpdateSingleUser,
  GetAllUserByAdmin,
  GetAllAdminByAdmin,
  SendMailUser,
  GetAllAdminByParent,
  GetAllUserByParent,
  GetAllDeletedUser,
  RestoreSingleUser,
  PermanentDeleteSingleUser,
  AutoDeleteTrashedUsers,
};
