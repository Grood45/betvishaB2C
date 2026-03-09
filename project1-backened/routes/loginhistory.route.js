const express=require("express")
const GetLoginHistory = require("../controllers/loginhistorycontroller/loginhistory.controller")

const LoginHistoryRouter=express.Router()

LoginHistoryRouter.get("/get-history", GetLoginHistory)

module.exports={LoginHistoryRouter}