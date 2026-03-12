const twilio = require("twilio");
const OtpModel = require("../../models/otp.model");
// Twilio credentials (replace with your own)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let client;
if (accountSid && authToken) {
  client = new twilio(accountSid, authToken);
} else {
  console.warn("[OTP Service] Twilio credentials missing. SMS functionality will be disabled.");
  client = {
    messages: {
      create: async () => {
        console.log("[OTP Service Mock] SMS would be sent if Twilio was configured.");
        return { sid: "MOCK_SID" };
      }
    }
  };
}



// Function to generate OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP using Twilio
const sendOtpToMobileNumber = async (to, otp) => {
  try {
    await client.messages.create({
      body: `Hello Player! Your verification code is ${otp}. Use this code to complete your verification. Remember, this code is valid for 5 minute's. Let's get you back to the game!`,
      from: twilioPhoneNumber, // Replace with your Twilio number
      to: to,
    });

    const otpDoc = new OtpModel({ phoneNumber: to, otp: otp });
    await otpDoc.save();
    console.log("OTP sent and saved to database");
    return { success: true, message: "OTP sent" }
  } catch (error) {
    console.error(error);
    return { success: false, message: "OTP sent failed" }
  }
};
const SendOtp = async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = generateOtp();
  const response = await sendOtpToMobileNumber(phoneNumber, otp);
  if (response.success) {
    res.status(200).json({
      status: 200,
      success: true,
      message: response.message,
    });
  }
  else {
    res.status(400).json({
      status: 400,
      success: false,
      message: response.message,
    });
  }
};
const VerifyMobileOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  const otpDoc = await OtpModel.findOne({ phoneNumber: phoneNumber, otp: otp });
  if (otpDoc) {
    res.status(200).json({
      status: 200,
      success: true,
      data: {},
      message: "OTP verified",
    });
  } else {
    res.status(400).json({
      status: 400,
      success: false,
      data: {},
      message: "Invalid OTP",
    });
  }
};

module.exports = {
  SendOtp,
  VerifyMobileOtp,
};
