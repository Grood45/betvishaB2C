const { default: axios } = require("axios");
const User = require("../../models/user.model");
const moment = require("moment");
const { DecryptPassword } = require("../../utils/DecryptPassword");
const { EncryptPassword } = require("../../utils/EncryptPassword");
const { GenrateJwtToken } = require("../../utils/GenerateJwt");
const { GetCurrentTime } = require("../../utils/GetCurrentTime");
const { VerifyJwt } = require("../../utils/VerifyJwt");
const BonusHistory = require("../../models/bonushistory.model");
const SaveUserLoginHistory = require("../../middlewares/saveuserloginhistory.middleware");
const { sendEmail } = require("../../utils/SendOtp");
const { isEmail } = require("validator");
const { GetAgentData } = require("../../utils/GetAgentData/GetAgentData");
const Setting = require("../../models/setting.model");
const { default: mongoose } = require("mongoose");
const Casino = require("../../models/casino.model")
const { GenerateReferralCode } = require("../../utils/GenerateReferalCode");
const Referral = require("../../models/referral.model");
const { GetCurrentDateTime } = require("../../utils/GetCurrentDateTime");
const { GetPromotion } = require("../../utils/Promotion/GetPromotion");
const Admin = require("../../models/admin.model");
require("dotenv").config();
const authKey = process.env.SITE_AUTH_KEY;

// Fix for Live User Count: Immediate Logout
async function UserLogout(req, res) {
  try {
    const { token, usernametoken } = req.headers;
    const { user_id } = req.body;

    // Determine user identifier (ID or Username)
    let identifier = user_id;
    if (!identifier && usernametoken) {
      // Try to decode username if ID not provided (though verifyJWT is better)
      // For now, we trust the frontend will send user_id or we'll rely on what we have.
      // If no user_id, we can try to use username from token if we verify it.
      // Let's stick to the simplest reliable method: Frontend sends user_id.
    }

    if (identifier) {
      await User.findOneAndUpdate(
        { user_id: identifier },
        {
          is_online: false,
          updated_at: "1970-01-01 00:00:00 AM" // Force 5-min window expiry
        }
      );
    }

    // Also try username matching if available from body
    if (req.body.username) {
      await User.findOneAndUpdate(
        { username: req.body.username },
        {
          is_online: false,
          updated_at: "1970-01-01 00:00:00 AM"
        }
      );
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Logged out successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
}

async function UserLogin(req, res) {
  const { username, password } = req.body; // Assuming you send username and password in the request body
  const modelQuery = req.query.modelQuery;
  let userName = username.trim();
  const query = { username: userName, ...modelQuery };
  try {
    // Find the admin by username
    const user = await User.findOne(query);
    if (!user || user.is_deleted) {
      // Password is incorrect
      return res.status(200).json({
        status: 200,
        success: false,
        data: {},
        message: "User not found",
      });
    }

    if (user.is_blocked) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "You have blocked contact admin.",
      });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await DecryptPassword(password, user.password);
    if (!isPasswordValid) {
      // Password is incorrect
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid password",
      });
    }
    const typeToken = GenrateJwtToken(user.role_type); // You need to implement this function
    const usernameToken = GenrateJwtToken(user.username); // You need to implement this function
    // Send a success response with the token and user data
    const data = await SaveUserLoginHistory(user.role_type, user.username, req);
    if (!data.success) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Login failed",
      });
    }

    // Set user as online immediately
    await User.findOneAndUpdate(
      { username: user.username },
      {
        is_online: true,
        updated_at: GetCurrentTime(),
        last_seen: GetCurrentTime()
      }
    );

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Login successfully",
      user,
      data: {
        token: typeToken,
        usernameToken,
      },
      redirect: "/",
    });
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

const GetSingleUser = async (req, res) => {
  // from admin
  const { token, usernametoken } = req.headers;
  const modelQuery = req.query.modelQuery;
  const query = modelQuery;
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
    const userUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    if (!userUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
    // Find the admin in AdminModel
    const user = await User.findOneAndUpdate(
      {
        ...query,
        role_type: type,
        username: userUsername,
      },
      { updated_at: GetCurrentTime() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        data: {},
        message: "User not found.",
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
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

const UpdateSingleUser = async (req, res) => {
  const { token, usernametoken } = req.headers;
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

  const modelQuery = req.query.modelQuery;
  const query = modelQuery;

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
    const userUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    if (!userUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }
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

    // Find the user and update with the prepared payload
    const user = await User.findOneAndUpdate(
      {
        ...query,
        role_type: type,
        username: userUsername,
      },
      updatePayload,
      { new: true }
    );

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
      success: true,
      data: user,
      message: "User data updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const UpdateBankDetails = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const { bank_name, bank_holder, account_number, ifsc_code, branch_code } =
    req.body;
  const modelQuery = req.query.modelQuery;

  try {
    // Check for tokens in headers
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // Implement this function to verify the admin_id
    const userUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    if (!userUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    // Find the user and update the bank details
    const user = await User.findOneAndUpdate(
      {
        ...modelQuery,
        role_type: type,
        username: userUsername,
      },
      {
        bank_name,
        bank_holder,
        account_number,
        ifsc_code,
        branch_code,
        bank_verified: true,
      },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        data: {},
        message: "User not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      data: user,
      message: "Bank details updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const UpdateDocumentDetails = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const { document_type, document_url } = req.body;
  const modelQuery = req.query.modelQuery;

  try {
    // Check for tokens in headers
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // Implement this function to verify the admin_id
    const userUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type
    if (!userUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    // Find the user and update the document details
    const user = await User.findOneAndUpdate(
      {
        ...modelQuery,
        role_type: type,
        username: userUsername,
      },
      {
        document: {
          document_type,
          document_url,
        },
        kyc_verified: true,
      },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        data: {},
        message: "User not found.",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      data: user,
      message: "Document details updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const RegisterUser = async (req, res) => {
  const userData = req.body;
  const session = await mongoose.startSession(); // Start a session

  try {
    session.startTransaction(); // Start the transaction
    // Encrypt the password
    const hashedPassword = await EncryptPassword(userData.password);

    // Get the current timestamp
    const timestamp = GetCurrentTime();
    // Prepare data for the new user
    let newData = {
      ...userData,
      user_id: userData.username,
      password: hashedPassword,
      parent_admin_id: process.env.OWNER_USERNAME,
      parent_admin_username: process.env.OWNER_USERNAME,
      parent_admin_role_type: process.env.OWNER_ROLETYPE,
      role_type: "user",
      joined_at: timestamp,
      updated_at: timestamp,
      last_seen: timestamp,
      referral_code: GenerateReferralCode(userData.username),
      currency: userData.currency,
      site_auth_key: userData.site_auth_key,
      last_bonus_calculation_time: GetCurrentDateTime()
    };
    // Check if agent data is available for the given currency
    const getSetting = await Setting.findOne({
      site_auth_key: userData.site_auth_key,
    })
      .select("is_signup_enabled")
      .session(session); // Include session in the query

    if (!getSetting || !getSetting.is_signup_enabled) {
      console.log('Signup is not enabled for this site.');
      await session.abortTransaction(); // Abort the transaction
      session.endSession(); // End the session
      return res.status(403).json({
        status: 403,
        success: false,
        message:
          "Registration is not enabled. Please contact the administrator for further assistance.",
      });
    }

    // Create a new user based on the registration data
    const newUser = new User(newData);
    const user = await newUser.save({ session }); // Save the new user and include the session
    const userId = user._id;
    // Referral handling
    let referByRoleType = ""
    if (newData?.refer_by_code) {
      referByRoleType = "affiliate"
      let referByData = await Admin.findOne({
        affiliate_code: newData?.refer_by_code,
        role_type: "affiliate",
      }).session(session); // Check for admin (affiliate) referral first

      if (!referByData) {
        referByRoleType = "user";
        // If not found, check user referral
        referByData = await User.findOne({
          referral_code: newData?.refer_by_code,
        }).session(session);
      }

      if (referByData) {
        // Fetch promotion data for referral bonuses
        const promotionData = await GetPromotion({
          category: "referral_bonus",
          sub_category: "every_referral",
        });

        // Prepare the referral payload
        let payload = {
          refer_by: referByData.username,
          refer_by_id: referByData._id,
          refer_by_role_type: referByRoleType,
          referred_user: {
            _id: userId,
            username: newData.username,
            name: newData?.full_name || newData?.first_name,
          },
          referral_code: newData?.refer_by_code,
          steps_completed: {
            is_registered: true,
            is_deposited: false,
            is_wager_completed: false,
          },
          site_auth_key: referByData.site_auth_key,
          bonus_awarded: false,
          last_bonus_calculation_time: GetCurrentDateTime(),
        };

        // Add promotion data if available
        console.log(promotionData, "promotion data available")
        if (promotionData) {
          payload = {
            ...payload,
            bonus_amount: promotionData?.reward_amount || 0,
            min_amount:
              promotionData?.min_deposit || promotionData?.min_bet || 0,
          };
        }

        // Save referral data
        const referralData = new Referral(payload);
        await referralData.save({ session });
      }
    }

    // Generate JWT tokens

    const typeToken = GenrateJwtToken(user.role_type);
    const usernameToken = GenrateJwtToken(user.username);

    // Call external API to register casino player

    let casinoPlayer = {
      Username: userData.username,
      UserGroup: "f",
      Agent: GetAgentData("INR"),
      CompanyKey: process.env.COMPANY_KEY,
      ServerId: process.env.SERVER_ID,
    };

    let casinoUserData = await axios.post(
      `${process.env.CASINO_BASE_URL}/web-root/restricted/player/register-player.aspx`,
      casinoPlayer
    );

    if (casinoUserData?.data?.error?.msg !== "No Error") {
      await session.abortTransaction(); // Abort the transaction
      session.endSession(); // End the session
      return res.status(500).json({
        status: 500,
        success: false,
        data: {},
        message: casinoUserData?.data?.error?.msg,
      });
    }

    // Commit the transaction if everything is successful
    await session.commitTransaction();
    session.endSession(); // End the session
    // Send a success response with the token and user data
    return res.status(201).json({
      status: 201,
      success: true,
      message: "User registered successfully.",
      user: user,
      data: {
        token: typeToken,
        usernameToken,
      },
      redirect: "/",
    });
  } catch (error) {
    console.log('Error during registration process:', error.message);
    await session.abortTransaction(); // Abort the transaction in case of error
    session.endSession(); // End the session

    let status = 500;
    let message = error.message;

    if (error.code === 11000) {
      console.log('Duplicate user error:', error.message);
      status = 400;
      message = "A user with this username or email already exists.";
    }

    res.status(status).json({
      status: status,
      success: false,
      message: message,
    });
  }
};

const ValidateReferralCode = async (req, res) => {
  const { refer_by_code } = req.body;
  const modelQuery = req.query.modelQuery;
  const query = { ...modelQuery, referral_code: refer_by_code };
  try {
    // Check if the referral code exists
    const referByData = await User.findOne(query);

    if (!referByData) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid referral code.",
      });
    }

    // If the referral code is valid
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Referral code applied successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "An error occurred while validating the referral code.",
    });
  }
};


const UserChangePassword = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const { oldPassword, newPassword } = req.body;
  const modelQuery = req.query.modelQuery;
  const query = modelQuery;
  try {
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res); // You need to implement this function (e.g., verify the type)
    const userUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type

    if (!userUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Find the user in the database
    const user = await User.findOne({
      ...query,
      role_type: type,
      username: userUsername,
    });
    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }
    // Check if the old password matches the stored password for the user
    const isPasswordValid = await DecryptPassword(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Old password incorrect.",
      });
    }
    // Update the user's password with the new one
    const newPasswordHash = await EncryptPassword(newPassword); // Replace with your password hashing logic
    user.password = newPasswordHash;
    // Save the updated user document
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
      message: "Internal server error: " + error.message,
    });
  }
};

const GetTotalWager = async (req, res) => {
  const session = await mongoose.startSession();
  try {

    await session.withTransaction(async () => {
      const { token, usernametoken } = req.headers;
      const modelQuery = req.query.modelQuery;

      // Check for tokens
      if (!token || !usernametoken) {
        throw new Error("Invalid token. Access denied.");
      }

      const userUsername = await VerifyJwt(usernametoken, req, res);
      const type = await VerifyJwt(token, req, res);

      if (!userUsername || !type) {
        throw new Error("Invalid token. Access denied.");
      }

      // Fetch the user to get last_bonus_calculation_time
      const user = await User.findOne({ username: userUsername }).session(session);
      if (!user) {
        throw new Error("User not found.");
      }
      // Parse last_bonus_calculation_time
      const lastWagerCalculatedTime = user.last_bonus_calculation_time

      // Fetch bonus history after last_wager_calculated_time
      const allBonus = await BonusHistory.find({
        username: userUsername,
        timestamp: { $gt: lastWagerCalculatedTime },
      }).session(session);

      if (!allBonus || allBonus.length === 0) {
        throw new Error("No eligible bonuses found to calculate the total wager for.");
      }

      // Calculate total wager from bonus history
      let totalWager = 0;
      for (const bonus of allBonus) {
        const wagerRequired = parseInt(bonus.wager_required) || 1;
        const rewardAmount = parseInt(bonus.reward_amount);
        if (!isNaN(wagerRequired) && !isNaN(rewardAmount)) {
          const wager = wagerRequired * rewardAmount;
          totalWager += wager;
        }
      }

      // Calculate wager left
      const wagerData = await Casino.aggregate([
        {
          $match: {
            Username: userUsername,
            ...modelQuery,
            BetTime: { $gt: lastWagerCalculatedTime },
          },
        },
        { $group: { _id: null, totalAmount: { $sum: "$Amount" } } },
      ]).session(session);

      const wagerLeft = wagerData.length >= 0 ? totalWager - (wagerData[0]?.totalAmount || 0) : 0;

      return res.status(200).json({
        success: true,
        data: {
          totalWager,
          wagerLeft: wagerLeft <= 0 ? 0 : wagerLeft,
        },
        message: "Total wager calculated and user balance adjusted successfully.",
      });
    });

  } catch (error) {
    console.error("Error in GetTotalWager:", error);

    // Rollback the transaction if any error occurs
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });

  } finally {
    session.endSession();
  }
};

const VerifyEmailOTP = async (req, res) => {
  const { email, userEnteredOTP } = req.body;
  const { token, usernametoken } = req.headers;

  try {
    // Validate presence of tokens
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Verify tokens
    const type = await VerifyJwt(token, req, res); // Implement this function to verify the admin_id
    const userUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type

    if (!userUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Find the user by username
    const user = await User.findOne({
      username: userUsername,
      role_type: type,
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    // Compare OTP entered by the user with the OTP saved in the user's data
    if (user.otp !== "" && user.otp === userEnteredOTP) {
      // OTP verification successful, update user's email, mark it as verified, and clear OTP
      await User.findOneAndUpdate(
        { username: userUsername, role_type: type },
        { email: email, email_verified: true, otp: "" }
      );

      res.status(200).json({
        status: 200,
        success: true,
        message: "Email verification successful.",
      });
    } else {
      res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid OTP.",
      });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Error verifying OTP.",
    });
  }
};

// async function GetAllUsername(req, res) {

//   try {
//     // Find the admin by username
//     let userName=username.trim()
//     const user = await User.findOne({ username: userName });
//     if (!user) {
//       // Password is incorrect
//       return res.status(200).json({
//         status: 200,
//         success: false,
//         data: {},
//         message: "User not found",
//       });
//     }

//     if (user.is_blocked) {
//       return res.status(403).json({
//         status: 403,
//         success: false,
//         message: "You have blocked contact admin.",
//       });
//     }

//     // Compare the provided password with the hashed password in the database
//     const isPasswordValid = await DecryptPassword(password, user.password);
//     if (!isPasswordValid) {
//       // Password is incorrect
//       return res.status(401).json({
//         status: 401,
//         success: false,
//         message: "Invalid password",
//       });
//     }
//     const typeToken = GenrateJwtToken(user.role_type); // You need to implement this function
//     const usernameToken = GenrateJwtToken(user.username); // You need to implement this function
//     // Send a success response with the token and user data
//     return res.status(200).json({
//       status: 200,
//       success: true,
//       message: "Login successfully",
//       user,
//       data: {
//         token: typeToken,
//         usernameToken,
//       },
//       redirect: "/",
//     });
//   } catch (error) {
//     console.error("Error during login:", error);
//     res.status(500).json({
//       status: 500,
//       success: false,
//       data: null,
//       message: error.message,
//     });
//   }
// }
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP
};

const SendEmailOTP = async (req, res) => {
  const { email } = req.body;
  const { token, usernametoken } = req.headers;

  try {
    // Validate presence of tokens
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Validate email
    if (!email || !isEmail(email)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid email address.",
      });
    }

    // Verify tokens
    const type = await VerifyJwt(token, req, res); // Implement this function to verify the admin_id
    const userUsername = await VerifyJwt(usernametoken, req, res); // Verify the role_type

    if (!userUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP to user's data
    let user = await User.findOneAndUpdate(
      { username: userUsername, role_type: type },
      { otp: otp },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    // Send email
    const full_name = user.username || "user";
    const info = await sendEmail(email, full_name, otp);

    if (info?.accepted?.length == 0) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Error sending OTP.",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Error sending OTP.",
    });
  }
};

module.exports = {
  UserLogin,
  GetSingleUser,
  UpdateSingleUser,
  UpdateBankDetails,
  UpdateDocumentDetails,
  RegisterUser,
  UserChangePassword,
  GetTotalWager,
  ValidateReferralCode,
  SendEmailOTP,
  VerifyEmailOTP,
  UserLogout,
};