
const express=require("express");
const { GetIpDetails } = require("../utils/IpService/IpService");
const IpServiceRouter=express.Router()

IpServiceRouter.post("/get-ip-details", GetIpDetails);


module.exports={IpServiceRouter}
