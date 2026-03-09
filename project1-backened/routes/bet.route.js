const express = require("express");
const { GetAllBetUser, GetAllBet, GetAllBetByParentOfUser, GetAllBetOfUserForParent, GetAllBetPlForGraph } = require("../controllers/betcontroller/bet.controller");
const { CalculateDynamicGGR, GetPlayerStats, GetGGRReportForDownload } = require("../controllers/betcontroller/ggrreport.controller");

const BetRouter = express.Router();
// primary
BetRouter.get("/get-all-bet-user", GetAllBetUser);

// primary
BetRouter.get("/get-all-bet", GetAllBet);


BetRouter.post("/get-all-bet-by-parent-of-user", GetAllBetByParentOfUser);
BetRouter.post("/get-all-bet-of-user-for-parent", GetAllBetOfUserForParent);
BetRouter.get("/get-all-bet-pl-for-graph",GetAllBetPlForGraph);
BetRouter.get("/get-ggr-report-by-date",CalculateDynamicGGR);
BetRouter.get("/get-data-overview",GetPlayerStats);
BetRouter.get("/get-bet-report-for-pdf",GetGGRReportForDownload);

// BetRouter.get("/get-all-bet-user", GetAllBetUser);
// BetRouter.get("/get-all-bet",  GetAllBet);
// BetRouter.post("/get-all-bet-by-parent-of-user", CheckPermission("betHistoryView"), GetAllBetByParentOfUser);
// BetRouter.post("/get-all-bet-of-user-for-parent",, GetAllBetOfUserForParent);
// BetRouter.get("/get-all-bet-pl-for-graph", CheckPermission("ggrReportView"), GetAllBetPlForGraph);
// BetRouter.get("/get-ggr-report-by-date", CheckPermission("ggrReportView"), CalculateDynamicGGR);
// BetRouter.get("/get-data-overview", CheckPermission("playerWiseReportView"), GetPlayerStats);
// BetRouter.get("/get-bet-report-for-pdf", CheckPermission("ggrReportView"), GetGGRReportForDownload);

module.exports={BetRouter}