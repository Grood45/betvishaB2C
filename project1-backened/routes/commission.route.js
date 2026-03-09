const express =require("express");
const { GetAllCommissions, DeleteCommission, UpdateCommission, UpdateCommissionStatus, AddCommission } = require("../controllers/commissioncontroller/commission.controller");

const CommissionRouter=express.Router()

CommissionRouter.get("/get-all-commission", GetAllCommissions);
CommissionRouter.delete("/delete-commission/:commission_id", DeleteCommission);
CommissionRouter.patch("/update-commission/:commission_id",UpdateCommission );
CommissionRouter.get("/get-single-commission/:commission_id", GetAllCommissions);
CommissionRouter.patch("/update-commission-status/:commission_id", UpdateCommissionStatus);
CommissionRouter.patch("/add-new-commission", AddCommission);

module.exports=CommissionRouter