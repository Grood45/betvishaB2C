const express = require("express");
const QRCode = require("qrcode");
const speakeasy = require("speakeasy");
const {
  GetAdminLayerPermission,
} = require("../../utils/GetAdminLayerPermission");
const Admin = require("../../models/admin.model");
const { GenrateJwtToken } = require("../../utils/GenerateJwt");
const SaveUserLoginHistory = require("../../middlewares/saveuserloginhistory.middleware");
const LoginHistory = require("../../models/loginhistory.model");

// Function to validate OTP within a time window
const validateOTP = (userOTP, secret) => {
  const timeWindow = 30; // Time window in seconds
  const currentUnixTime = Math.floor(Date.now() / 1000); // Current time in Unix time (seconds)

  // Generate OTPs for current time and previous/future intervals within the time window
  for (let i = -1; i <= 1; i++) {
    const otp = speakeasy.totp({
      secret: secret,
      encoding: "base32",
      time: currentUnixTime + i * timeWindow, // Adjust time for each interval
    });

    // Check if the received OTP matches any of the generated OTPs within the time window
    if (userOTP === otp) {
      return true; // OTP is valid
    }
  }

  return false; // OTP is not valid
};

// Endpoint for setting up Google Authenticator
const QrSetup = async (req, res) => {
  try {
    const isFirstTime = await LoginHistory.findOne({ email:req.body.email });
    console.log(isFirstTime ,"first")
    if ( !isFirstTime ) {
      const secret = speakeasy.generateSecret({ length: 20 });
      const admin = await Admin.findOneAndUpdate(
        { email: req.body.email },
        { secret: secret.base32 },
        { new: true, upsert: true }
      );
      const otpauth_url = `otpauth://totp/BetVisaAdmin?secret=${secret.base32}`;
      const qrCode = await QRCode.toDataURL(otpauth_url);
      res.json({ isFirstTime:true,qrCode });
    }
    else {
        res.json({ isFirstTime:false, qrCode:"" });
    }
  } catch (error) {
    console.error("Error setting up Google Authenticator:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Endpoint for verifying Google Authenticator code
const QrVerify = async (req, res) => {
  try {
    const { email, code } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate OTP within a time window
    const verified = validateOTP(code, admin.secret);
    if (verified) {
      const typeToken = GenrateJwtToken(admin.role_type); // You need to implement this function
      const usernameToken = GenrateJwtToken(admin.username); // You need to implement this function
      // Save user login history and handle potential failure
      const loginHistoryData = await SaveUserLoginHistory(
        admin.role_type,
        admin.username,
        req
      );
      if (!loginHistoryData.success) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Failed to save login history",
        });
      }
      res.status(200).json({
        status: 200,
        success: true,
        token: typeToken,
        adminLayer: GetAdminLayerPermission(admin.role_type),
        usernameToken: usernameToken,
        redirect: "/admin/dashboard",
        message: "Login successful",
        data: admin,
      });
    } else {
      res.status(400).json({ message: "Invalid verification code" });
    }
  } catch (error) {
    console.error("Error verifying Google Authenticator code:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { QrSetup, QrVerify };
