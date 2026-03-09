const Referral = require("../../models/referral.model");
const { VerifyJwt } = require("../../utils/VerifyJwt");

async function GetAllReferallByUser(req, res) {
    const { token, usernametoken } = req.headers;
    const modelQuery = req.query.modelQuery;
    const page = parseInt(req.query.page) || 1; // Get the page number from the query, default to 1
    const limit = parseInt(req.query.limit) || 10; // Get the limit from the query, default to 1
    
    try {
      if (!token || !usernametoken) {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Invalid tokens. Access denied.",
        });
      }

      // Validate access token and verify token here
      const type = await VerifyJwt(token, req, res);
      const userUsername = await VerifyJwt(usernametoken, req, res);
      if (!userUsername || !type) {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Invalid tokens, Access denied.",
        });
      }

      // Add pagination and modify query
      const query = { ...modelQuery, refer_by: userUsername, role_type: type, bonus_amount: { $gt: 0 } };
      const skip = (page - 1) * limit; // Calculate how many documents to skip
  
      const referrals = await Referral.find(query).skip(skip).limit(limit);
  
      if (!referrals || referrals.length === 0) {
        return res.status(404).json({
          status: 404,
          success: false,
          data: [],
          message: "No referrals found for this user",
        });
      }

      const totalReferrals = await Referral.countDocuments(query); // Get total number of referrals
      const totalPages = Math.ceil(totalReferrals / limit);
      return res.status(200).json({
        status: 200,
        success: true,
        data: referrals,
        pagination: {
          totalItems: totalReferrals,
          totalPages,
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
        message: "Referrals retrieved successfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: error.message,
      });
    }
}

async function GetAllReferallByAdmin(req, res) {
  const { token, usernametoken } = req.headers;
  const { modelQuery, status, search, refer_by } = req.query;
  const page = parseInt(req.query.page) || 1; // Get the page number from the query, default to 1
  const limit = parseInt(req.query.limit) || 10; // Get the limit from the query, default to 10

  try {
    if (!token || !usernametoken) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens. Access denied.",
      });
    }

    // Validate access token and verify token here
    const type = await VerifyJwt(token, req, res);
    const userUsername = await VerifyJwt(usernametoken, req, res);
    if (!userUsername || !type) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "Invalid tokens, Access denied.",
      });
    }

    // Add pagination and modify query
    const query = { ...modelQuery };
    if (search) {
      query.$or = [
        { "referred_user.username": { $regex: search, $options: "i" } },
        { refer_by: { $regex: search, $options: "i" } },
      ];
    }

    if (status != 0) {
      query.bonus_awarded = status == 1;
    }
    if (refer_by) {
      query.refer_by = refer_by;
    }

    const skip = (page - 1) * limit; // Calculate how many documents to skip

    // Query referrals with pagination
    const referrals = await Referral.find(query).skip(skip).limit(limit);

    // Get total number of referrals
    const totalReferrals = await Referral.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(totalReferrals / limit);

    // Aggregate data for counts and total amounts
    const [referralData] = await Referral.aggregate([
      { $match: query }, // Apply query filters
      {
        $group: {
          _id: null,
          totalReferralUser: { $sum: 1 }, // Count all referrals
          totalReferBonus: { $sum: "$bonus_amount" }, // Sum all bonus amounts
          pendingReferlUser: { $sum: { $cond: [{ $eq: ["$bonus_awarded", false] }, 1, 0] } }, // Count pending referrals
          rejectReferlUser: { $sum: { $cond: [{ $eq: ["$steps_completed.is_registered", false] }, 1, 0] } }, // Count rejected referrals
        },
      },
    ]);

    return res.status(200).json({
      status: 200,
      success: true,
      data: referrals,
      referralData: {
        totalReferralUser: referralData?.totalReferralUser || 0,
        totalReferBonus: referralData?.totalReferBonus || 0,
        pendingReferlUser: referralData?.pendingReferlUser || 0,
        rejectReferlUser: referralData?.rejectReferlUser || 0,
      },
      pagination: {
        totalItems: totalReferrals,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
      message: "Referrals retrieved successfully",
    });
  } catch (error) {
    console.log(error, "Error in GetAllReferallByAdmin");
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
}

// Controller to handle referral code entry and step update
const UpdateReferralFirstStep = async (req, res) => {
  const { userId, referralCode, step } = req.body;
  try {
      // Find the referral entry by referral code
      const referral = await Referral.findOne({ referral_code: referralCode });

      if (!referral) {
          return res.status(404).json({
              status: 404,
              success: false,
              data: {},
              message: 'Referral code not found.'
          });
      }
      // Update the specific step based on the request
      switch (step) {
          case 'register':
              referral.steps_completed.is_registered = true;
              break;
          case 'deposit':
              referral.steps_completed.is_deposited = true;
              break;
          case 'wager':
              referral.steps_completed.is_wager_completed = true;
              break;
          default:
              return res.status(400).json({
                  status: 400,
                  success: false,
                  data: {},
                  message: 'Invalid step provided.'
              });
      }

      // Update the referred user information if not already set
      if (!referral.referred_user._id) {
          const user = await User.findById(userId);
          if (!user) {
              return res.status(404).json({
                  status: 404,
                  success: false,
                  data: {},
                  message: 'User not found.'
              });
          }
          referral.referred_user = {
              _id: user._id,
              username: user.username,
              name: user.name,
          };
      }

      // Save the updated referral entry
      await referral.save();

      return res.status(200).json({
          status: 200,
          success: true,
          data: referral,
          message: 'Referral step updated successfully.'
      });
  } catch (error) {
      console.error('Error updating referral step:', error);
      return res.status(500).json({
          status: 500,
          success: false,
          data: {},
          message: 'Internal server error.'
      });
  }
};
const UpdateReferralSecondStep = async (req, res) => {
  const { userId, referralCode, step } = req.body;
  try {
      // Find the referral entry by referral code
      const referral = await Referral.findOne({ referral_code: referralCode });

      if (!referral) {
          return res.status(404).json({
              status: 404,
              success: false,
              data: {},
              message: 'Referral code not found.'
          });
      }
      // Update the specific step based on the request
      switch (step) {
          case 'register':
              referral.steps_completed.is_registered = true;
              break;
          case 'deposit':
              referral.steps_completed.is_deposited = true;
              break;
          case 'wager':
              referral.steps_completed.is_wager_completed = true;
              break;
          default:
              return res.status(400).json({
                  status: 400,
                  success: false,
                  data: {},
                  message: 'Invalid step provided.'
              });
      }

      // Update the referred user information if not already set
      if (!referral.referred_user._id) {
          const user = await User.findById(userId);
          if (!user) {
              return res.status(404).json({
                  status: 404,
                  success: false,
                  data: {},
                  message: 'User not found.'
              });
          }
          referral.referred_user = {
              _id: user._id,
              username: user.username,
              name: user.name,
          };
      }

      // Save the updated referral entry
      await referral.save();

      return res.status(200).json({
          status: 200,
          success: true,
          data: referral,
          message: 'Referral step updated successfully.'
      });
  } catch (error) {
      console.error('Error updating referral step:', error);
      return res.status(500).json({
          status: 500,
          success: false,
          data: {},
          message: 'Internal server error.'
      });
  }
};
const UpdateReferralFinalStep = async (req, res) => {
  const { userId, referralCode, step } = req.body;
  try {
      // Find the referral entry by referral code
      const referral = await Referral.findOne({ referral_code: referralCode });

      if (!referral) {
          return res.status(404).json({
              status: 404,
              success: false,
              data: {},
              message: 'Referral code not found.'
          });
      }
      // Update the specific step based on the request
      switch (step) {
          case 'register':
              referral.steps_completed.is_registered = true;
              break;
          case 'deposit':
              referral.steps_completed.is_deposited = true;
              break;
          case 'wager':
              referral.steps_completed.is_wager_completed = true;
              break;
          default:
              return res.status(400).json({
                  status: 400,
                  success: false,
                  data: {},
                  message: 'Invalid step provided.'
              });
      }

      // Update the referred user information if not already set
      if (!referral.referred_user._id) {
          const user = await User.findById(userId);
          if (!user) {
              return res.status(404).json({
                  status: 404,
                  success: false,
                  data: {},
                  message: 'User not found.'
              });
          }
          referral.referred_user = {
              _id: user._id,
              username: user.username,
              name: user.name,
          };
      }

      // Save the updated referral entry
      await referral.save();

      return res.status(200).json({
          status: 200,
          success: true,
          data: referral,
          message: 'Referral step updated successfully.'
      });
  } catch (error) {
      console.error('Error updating referral step:', error);
      return res.status(500).json({
          status: 500,
          success: false,
          data: {},
          message: 'Internal server error.'
      });
  }
};

module.exports={GetAllReferallByUser, GetAllReferallByAdmin, UpdateReferralFirstStep, UpdateReferralSecondStep, UpdateReferralFinalStep}

// 1- when refer url?refer_code=NKFNIN3345N 
// 2- enter the code and apply
// 3- on register the first step will be completed (can be done with a middleware)
// 4- on first deposit the second step will be completed
// 5- run aa cornjob to get them the bonus 
// => check the bonus condition by start end date, and bonus amount when the above step is completed and credit that bonus