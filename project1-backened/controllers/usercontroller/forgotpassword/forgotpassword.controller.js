// Function to send OTP to a recipient

const User = require("../../../models/user.model");
const { EncryptPassword } = require("../../../utils/EncryptPassword");
const { sendEmail } = require("../../../utils/SendOtp");

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP
};

// Function to send OTP to a recipient
const SendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Generate OTP
    const otp = generateOTP();

    // Save OTP to user's data
    let user = await User.findOneAndUpdate({ email: email }, { otp: otp });
 if(!user){
  return res
  .status(404)
  .json({ status: 200, success: true, message: "User not found." });
 }
    // Send email
    let full_name =user?.username||"user";
    const info = await sendEmail(email, full_name, otp);
    console.log(`Sent OTP to ${email}:`, info);

    res
      .status(200)
      .json({ status: 200, success: true, message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res
      .status(500)
      .json({ status: 500, success: false, message: "Error sending OTP." });
  }
};

// Function to verify OTP and reset password
const VerifyOTPAndResetPassword = async (req, res) => {
  const { email, userEnteredOTP, newPassword } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ status: 404, success: false, message: "User not found." });
    }

    // Compare OTP entered by the user with the OTP saved in the user's data
    if (user.otp == userEnteredOTP) {
      // OTP verification successful, clear OTP from user's data
      let hashPassword = await EncryptPassword(newPassword);
     const user= await User.findOneAndUpdate(
        { email: email },
        { password: hashPassword }
      );
      res.status(200).json({
        status: 200,
        success: true,
        message: "Password reset successful.",
      });
    } else {
      res
        .status(400)
        .json({ status: 400, success: false, message: "Invalid OTP." });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Error resetting password.",
    });
  }
}
module.exports = {
  SendOTP,
  VerifyOTPAndResetPassword,
};