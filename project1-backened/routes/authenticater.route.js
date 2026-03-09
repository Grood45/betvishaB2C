const express=require("express");
const { QrSetup, QrVerify } = require("../controllers/authcontroller/auth.controller");

const AuthRouter=express.Router();

AuthRouter.post("/qr-setup", QrSetup)
AuthRouter.post("/qr-verify", QrVerify)


module.exports={AuthRouter}