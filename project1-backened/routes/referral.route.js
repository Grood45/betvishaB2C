const express =require("express");
const { GetAllReferallByAdmin, GetAllReferallByUser, UpdateReferralStep } = require("../controllers/referralcontroller/referral.controller");
const ReferralRouter=express.Router()
ReferralRouter.get("/get-all-referral-by-admin", GetAllReferallByAdmin);
ReferralRouter.get("/get-all-referral-by-user", GetAllReferallByUser);
module.exports=ReferralRouter