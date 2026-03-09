const express = require("express");
const { GetAllBonusHistory, GetAllBonusHistoryForUser, GetAllBonusHistoryOfSingleUserByAdmin } = require("../controllers/Ibonushistorycontroller/bonushistory.controller");
const CheckPermission = require("../middlewares/checkpermission.middleware");




const BonusHistoryRouter = express.Router();

BonusHistoryRouter.get("/get-all-bonus-history", GetAllBonusHistory);
BonusHistoryRouter.get("/get-all-bonus-history-for-user", GetAllBonusHistoryForUser);
BonusHistoryRouter.get("/get-all-bonus-history-for-user-by-admin", CheckPermission("bonusHistoryView"), GetAllBonusHistoryOfSingleUserByAdmin) ;
// Applying middleware to BonusHistoryRouter routes
// BonusHistoryRouter.get("/get-all-bonus-history", CheckPermission("bonusHistoryView"), GetAllBonusHistory);

module.exports = { BonusHistoryRouter };