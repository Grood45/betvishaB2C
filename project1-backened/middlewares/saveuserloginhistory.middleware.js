const mongoose = require("mongoose");

const User = require("../models/user.model");
const Admin = require("../models/admin.model");
const { GetCurrentTime } = require("../utils/GetCurrentTime");
const { GetCurrentDateTime } = require("../utils/GetCurrentDateTime");
const LoginHistory = require("../models/loginhistory.model");

const SaveUserLoginHistory = async (type, username, req) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if user exists
    const user =
      type === "user"
        ? await User.findOne({ username })
        : await Admin.findOne({ username });

    let userExits = await LoginHistory.findOne({ username });
    let clientIP = req?.headers["x-real-ip"] || "N/A";
    if (userExits) {
      // Update existing user's login history

      await LoginHistory.findOneAndUpdate(
        { username },
        {
          $push: {
            login_history: {
              login_ip: clientIP,
              login_time: GetCurrentDateTime(),
            },
          },
          updated_time: GetCurrentDateTime(),
        },
        { new: true, session }
      );
    } else {
      // Create a new user record
      const newUser = new LoginHistory({
        username,
        email: user?.email, // Assuming you have the email in the existingUser object
        role: type,
        login_history: [
          {
            login_ip: clientIP,
            login_time: GetCurrentDateTime(),
          },
        ],
        created_time: GetCurrentDateTime(),
        updated_time: GetCurrentDateTime(),
        site_auth_key: user?.site_auth_key,
        parent_admin_id: user?.parent_admin_id,
        parent_admin_role_type: user?.parent_admin_role_type,
        parent_admin_username: user?.parent_admin_username,
      });
      await newUser.save({ session });
    }
    // Commit the transaction
    await session.commitTransaction();
    await session.endSession();
    return { status: 200, success: true, message: "Saved" };
  } catch (error) {
    // Rollback the transaction on error
    console.log(error, "reer");
    await session.abortTransaction();
    await session.endSession();
    return { status: 500, success: false, message: error?.message };
  }
};

module.exports = SaveUserLoginHistory;
