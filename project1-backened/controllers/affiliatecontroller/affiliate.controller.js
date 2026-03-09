const SaveUserLoginHistory = require("../../middlewares/saveuserloginhistory.middleware");
const Admin = require("../../models/admin.model");
const Affiliate = require("../../models/affiliate.model");
const Casino = require("../../models/casino.model");
const User = require("../../models/user.model");
const { DecryptPassword } = require("../../utils/DecryptPassword");
const { EncryptPassword } = require("../../utils/EncryptPassword");
const { GenrateJwtToken } = require("../../utils/GenerateJwt");
const { GetAdminLayerPermission } = require("../../utils/GetAdminLayerPermission");
const { GetCurrentDateTime } = require("../../utils/GetCurrentDateTime");
const { VerifyJwt } = require("../../utils/VerifyJwt");
const moment =require("moment");

// Controller for updating an affiliate
const UpdateSingleAffiliate = async (req, res) => {
    const { id } = req.params;
    const { modelQuery } = req.query;
    const { full_name, share_percentage, min_payout, max_payout } = req.body;
  
    // Validate ID
    if (!id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Affiliate ID is required.",
      });
    }
  
    // Validate share_percentage (must be between 0 and 100 if provided)
    if (share_percentage != null && (share_percentage < 0 || share_percentage > 100)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Share percentage must be between 0 and 100.",
      });
    }
  
    // Validate min_payout and max_payout (if provided)
    if (min_payout != null && max_payout != null && min_payout >= max_payout) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Min payout should be less than max payout.",
      });
    }
  
    try {
      const updateData = {
        full_name,
        share_percentage,
        min_payout,
        max_payout,
      };
  
      const query = { _id: id, ...modelQuery };
      const updatedAffiliate = await Affiliate.findOneAndUpdate(
        query,
        { ...updateData, updated_at: GetCurrentDateTime() },
        { new: true }
      );
  
      if (!updatedAffiliate) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Affiliate not found",
        });
      }
  
      return res.status(200).json({
        status: 200,
        success: true,
        data: updatedAffiliate,
        message: "Affiliate updated successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Error updating affiliate",
        error: error.message,
      });
    }
};

const GetSingleAffiliate = async (req, res) => {
  const { modelQuery } = req.query;
  const { token, usernametoken } = req.headers;
  // Validate tokens
  if (!token || !usernametoken) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid tokens. Access denied.",
    });
  }

  try {
    // Verify the role type and admin username from the tokens
    const type = await VerifyJwt(token, req, res); 
    const adminUsername = await VerifyJwt(usernametoken, req, res);

    // Validate that the role type exists in the token
    if (!type || !adminUsername) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Unauthorized. Role type or username not found in tokens.",
      });
    }

    // Validate modelQuery to ensure it has valid structure
    if (!modelQuery || typeof modelQuery !== 'object') {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid query parameters.",
      });
    }

    const query = { role_type: type, ...modelQuery };

    // Fetch the affiliate
    const affiliate = await Admin.findOne(query);

    if (!affiliate) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Affiliate not found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      data: affiliate,
      message: "Affiliate retrieved successfully.",
    });
  } catch (error) {
    // Handle internal server errors
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error fetching affiliate",
      error: error.message,
    });
  }
};

async function AffiliateLogin(req, res) {
    const { username, password } = req.body; // Assuming you send username and password in the request body
    const {modelQuery}=req.query;
    try {
      // Find the admin by username
      const admin = await Admin.findOne({ role_type:"affiliate",username: username });
      if (!admin) {
        // Password is incorrect
        return res.status(200).json({
          status: 200,
          success: false,
          data: {},
          message: "Admin not found",
        });
      }
  
      if (admin.is_blocked) {
        return res.status(403).json({
          status: 403,
          success: false,
          message: "You have been blocked, contact admin.",
        });
      }
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await DecryptPassword(password, admin.password);
      if (!isPasswordValid) {
        // Password is incorrect
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Invalid password",
        });
      }
      const typeToken = GenrateJwtToken(admin.role_type, "2h"); // You need to implement this function
      const usernameToken = GenrateJwtToken(admin.username, "2h"); // You need to implement this function
      // Send a success response with the token and user data
     if(admin.is_2fa_enabled){
      res.status(200).json({
        status: 22,
        success: true,
        redirect: "/login",
        message: "Login Process.",
        email:admin.email,
        step:true,
        data: admin,
      });
     }
     else {
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

const GetAffiliateDashboardData = async (req, res) => {
  const { referral_code, username } = req.query; // Add search by username
  const { token, usernametoken } = req.headers;

  // Validate tokens
  if (!token || !usernametoken) {
    return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid tokens. Access denied.",
    });
  }

  // Validate referral code
  if (!referral_code) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Referral code is required.",
    });
  }

  try {
    // Verify tokens for role type and parent admin username
    const role_type = await VerifyJwt(token, req, res);
    const parent_admin_username = await VerifyJwt(usernametoken, req, res);

    // Ensure valid role type and parent admin username
    if (!role_type || !parent_admin_username) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Unauthorized. Role type or username not found in tokens.",
      });
    }

    // Prepare the date range for today's signups
    const todayStart = moment().startOf('day').toISOString();
    const todayEnd = moment().endOf('day').toISOString();

    // Build the query
    let query = {
      refer_by_code: referral_code,
      parent_admin_username: parent_admin_username,
      parent_admin_role_type: role_type,
    };

    // Include case-insensitive regex search for username if provided
    if (username) {
      query.username = { $regex: new RegExp(username, "i") }; // Case-insensitive regex search
    }

    // Fetch users based on the query
    const users = await User.find(query);

    // Calculate statistics
    const activeUsersCount = users.filter(user => !user.is_blocked).length;
    const newSignupsTodayCount = users.filter(user => 
      moment(user.joined_at).isBetween(todayStart, todayEnd)
    ).length;
    const blockedUsersCount = users.filter(user => user.is_blocked).length;
    const totalUsersCount = users.length;

    // Return the dashboard data
    return res.status(200).json({
      status: 200,
      success: true,
      data: {
        activeUsers: activeUsersCount,
        newSignupsToday: newSignupsTodayCount,
        blockedUsers: blockedUsersCount,
        totalUsers: totalUsersCount,
      },
      users,
      message: "Affiliate dashboard data retrieved successfully.",
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Error fetching affiliate dashboard data.",
      error: error.message,
    });
  }
};

const ChangeAffiliatePassword = async (req, res) => {
  const { token, usernametoken } = req.headers;
  const { oldPassword, newPassword } = req.body;
  const modelQuery = req.query.modelQuery;
  const query = modelQuery;

  try {
    // Check if required tokens are present
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Validate and verify tokens to get role type and username
    const type = await VerifyJwt(token, req, res); // Fetch role type from token
    const userUsername = await VerifyJwt(usernametoken, req, res); // Fetch username from token

    if (!userUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Find the affiliate user in the Admin model
    const admin = await Admin.findOne({
      ...query,               // Extra query if needed
      role_type: type,         // Role type from the token
      username: userUsername,  // Username from the token
    });

    if (!admin) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    // Check if the old password matches the stored password
    const isPasswordValid = await DecryptPassword(oldPassword, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Old password is incorrect.",
      });
    }
    // Encrypt the new password and update the user record
    const newPasswordHash = await EncryptPassword(newPassword);
    admin.password = newPasswordHash;

    // Save the updated user document
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
      message: "Internal server error: " + error.message,
    });
  }
};

const ProcessAffiliateBonus = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Get all active affiliates with a percentage share
    const affiliates = await Admin.find({ is_blocked: false, role_type: 'affiliate' })
      .select('_id share_percentage platform_fee last_calculation_time')
      .session(session); // Attach session for transaction

    if (!affiliates.length) {
      console.log('No active affiliates found.');
      await session.abortTransaction();
      session.endSession();
      return { success: false, message: 'No active affiliates found' };
    }

    // Step 2: Process all affiliates in parallel
    const affiliateUpdates = await Promise.all(
      affiliates.map(async (affiliate) => {
        try {
          // Get all referred users for this affiliate
          const referredUserIds = await User.find({ refer_by_code: affiliate.affiliate_code, role_type: 'user' })
            .select('_id')
            .lean()
            .session(session);

          if (!referredUserIds.length) {
            console.log(`No referred users for affiliate: ${affiliate._id}`);
            return null; // No users to process, return early
          }

          const userIds = referredUserIds.map(referral => referral._id);

          // Step 3: Calculate casino PL for all referred users
          const casinoPLResults = await Casino.aggregate([
            { $match: { user_id: { $in: userIds }, game_type: 'casino', status: 'settled' } },
            { $group: { _id: null, totalPL: { $sum: { $subtract: ['$amount', '$win_loss'] } } } }
          ]).session(session);

          const totalPL = casinoPLResults[0]?.totalPL || 0;

          // Step 4: If total PL is negative, calculate bonus share
          if (totalPL < 0) {
            const bonusShare = (Math.abs(totalPL) * affiliate.share_percentage) / 100;
            return {
              affiliateId: affiliate._id,
              bonusShare
            };
          }

          return null; // No bonus if PL is positive or zero
        } catch (err) {
          console.error(`Error processing affiliate ${affiliate._id}:`, err);
          return null;
        }
      })
    );

    // Step 5: Bulk update affiliates who have bonuses to claim
    const bulkUpdates = affiliateUpdates
      .filter(update => update !== null) // Only affiliates with calculated bonuses
      .map(update => ({
        updateOne: {
          filter: { _id: update.affiliateId },
          update: { $inc: { balance: update.bonusShare } },
          session
        }
      }));

    if (bulkUpdates.length > 0) {
      await AffiliateModel.bulkWrite(bulkUpdates, { session });
      console.log('Affiliate bonuses processed successfully.');
    } else {
      console.log('No bonuses to process.');
    }

    // Step 6: Commit the transaction if everything is successful
    await session.commitTransaction();
    session.endSession();

    return { success: true, message: 'Affiliate bonuses processed successfully.' };
  } catch (error) {
    // Abort the transaction in case of any error
    await session.abortTransaction();
    session.endSession();

    console.error('Error processing affiliate bonuses:', error);
    return { success: false, message: 'Error processing affiliate bonuses', error };
  }
};


module.exports = {
  UpdateSingleAffiliate,
  GetSingleAffiliate,
  AffiliateLogin,
  GetAffiliateDashboardData,
  ChangeAffiliatePassword,
  ProcessAffiliateBonus
};

// 1- affiliate add with username and password
// 2- from admin it will will created a new Affiliate
// 3- use both details to login



// 1- get all user by affiliate referral_code  (controllers)
// 2- process the affiliate bonus 
      // i- get aall user 
      // ii- calculate the pl by bet if -100 add %bonus to the affiliate and else if +20 adjust the amount with other users and make it average if negetive add the % of bonus to the affiliate admin and save it in deposit schema