const express=require("express");
const { GetSeamlessGameList, CasinoLogin } = require("../controllers/betcontroller/casinogame.controller");

const CasinoGameRouter = express.Router();
CasinoGameRouter.post("/get-seamless-game",GetSeamlessGameList);
CasinoGameRouter.post("/login-casino",CasinoLogin);
// CasinoGameRoute.post("/get-pl-commission",GetPlAndCommission);
// GetPlAndCommission

module.exports={CasinoGameRouter}