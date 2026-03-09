const express =require("express");
const { GetFooterInfo, UpdateFooterInfo } = require("../controllers/footerinfocontroller.js/footerinfo.controller");
const CheckPermission = require("../middlewares/checkpermission.middleware");

const FooterInfoRouter=express.Router()
FooterInfoRouter.get("/get-footer-info",GetFooterInfo)
FooterInfoRouter.patch("/update-footer-info", UpdateFooterInfo)

// Apply middleware to FooterInfoRouter routes
// FooterInfoRouter.get("/get-footer-info", CheckPermission("footerContentView"), GetFooterInfo);
// FooterInfoRouter.patch("/update-footer-info", CheckPermission("footerContentManage"), UpdateFooterInfo);

module.exports={FooterInfoRouter}