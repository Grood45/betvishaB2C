const express = require("express");
const { UserLogin, GetSingleUser, UpdateSingleUser, RegisterUser, UserChangePassword, GetTotalWager, UpdateBankDetails, UpdateDocumentDetails, VerifyEmailOTP, SendEmailOTP, ValidateReferralCode, UserLogout } = require("../controllers/usercontroller/user.controller");
const { SendOTP, VerifyOTPAndResetPassword } = require("../controllers/usercontroller/forgotpassword/forgotpassword.controller");
const UserRouter = express.Router();
UserRouter.patch("/update-single-user", UpdateSingleUser);
UserRouter.patch("/update-bank-details", UpdateBankDetails);
UserRouter.patch("/update-document-details", UpdateDocumentDetails);
UserRouter.post("/user-login", UserLogin);
UserRouter.patch("/user-change-password", UserChangePassword);
UserRouter.get("/get-single-user", GetSingleUser);
UserRouter.post("/register-user", RegisterUser);
UserRouter.post("/send-reset-otp", SendOTP);
UserRouter.post("/send-email-otp", SendEmailOTP);
UserRouter.post("/verify-email-otp", VerifyEmailOTP);
UserRouter.post("/verify-otp-and-reset", VerifyOTPAndResetPassword);
UserRouter.get("/get-total-wager", GetTotalWager);
UserRouter.post("/validate-refer-code", ValidateReferralCode);
UserRouter.post("/user-logout", UserLogout);
module.exports = { UserRouter }
