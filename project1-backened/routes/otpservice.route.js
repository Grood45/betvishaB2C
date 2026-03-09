
const express=require("express");
const { VerifyMobileOtp, SendOtp } = require("../utils/OtpService/OtpService");

const OtpServiceRouter=express.Router()

OtpServiceRouter.post("/send-otp", SendOtp);
OtpServiceRouter.post("/verify-otp", VerifyMobileOtp)

module.exports={OtpServiceRouter}
